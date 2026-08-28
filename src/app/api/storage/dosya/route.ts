import { NextResponse, type NextRequest } from "next/server";
import { storageDownload } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * VELİNİN GİZLİ DOSYASINI SUNAR
 *
 * ┌─ SAHİPLİK VERİTABANINDAN DOĞRULANIYOR ⚠️ ────────────────────┐
 * │ Yolu bilen herkes indirebilseydi, fatura ve dekont numaralarını│
 * │ deneyerek başkasının belgesine ulaşılabilirdi.                  │
 * │                                                                   │
 * │ Bu yüzden dosya yolu doğrudan kabul EDİLMİYOR: kayıt kimliği    │
 * │ alınıyor, sahibi olup olmadığı veritabanından sorgulanıyor,     │
 * │ yol oradan okunuyor.                                              │
 * │                                                                   │
 * │ RLS zaten koruyor; bu ikinci katman, tek bir politikanın        │
 * │ yanlışlıkla gevşetilmesinin sessiz bir sızıntıya dönüşmemesi    │
 * │ için.                                                              │
 * └───────────────────────────────────────────────────────────────────┘
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const tur = sp.get("tur") ?? "";
  const id = sp.get("id") ?? "";
  const indir = sp.get("indir") === "1";

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  let bucket = "";
  let path = "";

  if (tur === "fatura") {
    const { data } = await supabase
      .from("order_invoices").select("bucket_id, path").eq("id", id).maybeSingle();

    const d = data as { bucket_id: string | null; path: string } | null;
    if (!d?.path) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    bucket = d.bucket_id || "invoices";
    path = d.path;
  } else if (tur === "dekont") {
    const { data } = await supabase
      .from("payment_receipts").select("bucket_id, path").eq("id", id).maybeSingle();

    const d = data as { bucket_id: string | null; path: string } | null;
    if (!d?.path) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    bucket = d.bucket_id || "payment-receipts";
    path = d.path;
  } else {
    return NextResponse.json({ error: "Bilinmeyen belge türü" }, { status: 400 });
  }

  const res = await storageDownload(bucket, path);
  if (!res.ok) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });

  const ad = path.split("/").pop() ?? "belge";

  return new NextResponse(new Uint8Array(res.body), {
    headers: {
      "Content-Type": res.contentType || "application/octet-stream",
      "Content-Disposition":
        `${indir ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(ad)}`,
      "Cache-Control": "private, no-store",
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  });
}
