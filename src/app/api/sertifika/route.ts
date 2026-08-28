import { NextResponse, type NextRequest } from "next/server";
import { storageDownload } from "@/lib/storage";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * VELİNİN SERTİFİKASINI SUNAR
 *
 * ┌─ SAHİPLİK KONTROLÜ ŞART ⚠️ ───────────────────────────────────┐
 * │ Kova kapalı, ama bu uç açık olsaydı kimlik numarasını tahmin   │
 * │ eden biri başkasının belgesini indirebilirdi. Sertifikada       │
 * │ çocuğun ve velinin adı yazıyor — kişisel veri.                  │
 * │                                                                  │
 * │ Sorgu `user_id` ile sınırlanıyor: RLS zaten koruyor, burada da  │
 * │ açıkça filtreleniyor. İki katman, çünkü tek bir politikanın     │
 * │ yanlışlıkla gevşetilmesi sessiz bir sızıntı olurdu.             │
 * └──────────────────────────────────────────────────────────────────┘
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id") ?? "";
  const indir = req.nextUrl.searchParams.get("indir") === "1";

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const { data: cert, error } = await supabase
    .from("certificates")
    .select("number, storage_path")
    .eq("id", id)
    .eq("user_id", auth.user.id)   // ★ sahiplik
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!cert) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  const c = cert as { number: string; storage_path: string };

  const svc = createServiceClient();
  const _in = await storageDownload("certificates", c.storage_path);
    const data = _in.ok ? new Blob([_in.body as BlobPart], { type: _in.contentType }) : null;
    const dErr = _in.ok ? null : new Error(_in.error);

  if (dErr || !data) {
    return NextResponse.json({ error: "Belge bulunamadı" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(await data.arrayBuffer()), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        `${indir ? "attachment" : "inline"}; filename="${c.number}.pdf"`,
      "Cache-Control": "private, no-store",
      /* Genel kural `X-Frame-Options: DENY`; burada üzerine yazılıyor.
         Yanıt başlığı yapılandırmadaki kuralı ezer — sıralamaya
         güvenmek yerine burada da açıkça belirtiliyor. */
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  });
}
