import { NextResponse, type NextRequest } from "next/server";
import { storageSignedUpload, dualWrite } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * VELİ İÇİN YÜKLEME ADRESİ
 *
 * ┌─ YOL SAHİPLİĞİ ZORUNLU ⚠️ ────────────────────────────────────┐
 * │ Supabase'de yükleme yolunu RLS denetliyordu: `{uid}/...` deseni │
 * │ dışına yazılamıyordu. R2'de RLS yok — bu kontrolü BURASI        │
 * │ yapmalı.                                                          │
 * │                                                                   │
 * │ Kontrol atlanırsa bir veli, yolun başına başka birinin           │
 * │ kimliğini yazarak onun dosyalarının üzerine yazabilirdi.         │
 * │                                                                   │
 * │ Bu yüzden yol MUTLAKA kullanıcının kendi kimliğiyle başlıyor.   │
 * └───────────────────────────────────────────────────────────────────┘
 */

/* Velinin yazabileceği kovalar — hepsi kişisel ve kapalı. */
const IZINLI = new Set(["avatars", "child-photos", "payment-receipts"]);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  let govde: { bucket?: string; path?: string; contentType?: string };
  try {
    govde = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const bucket = String(govde.bucket ?? "");
  const path = String(govde.path ?? "");

  if (!IZINLI.has(bucket)) {
    return NextResponse.json({ error: "Bu kovaya yükleme yapılamaz." }, { status: 403 });
  }

  if (!path || path.includes("..") || path.startsWith("/") || path.length > 300) {
    return NextResponse.json({ error: "Geçersiz dosya yolu." }, { status: 400 });
  }

  /* ★ Yol kullanıcının kendi kimliğiyle başlamalı. */
  if (!path.startsWith(`${auth.user.id}/`)) {
    return NextResponse.json(
      { error: "Yalnızca kendi klasörünüze yükleme yapabilirsiniz." },
      { status: 403 },
    );
  }

  const res = await storageSignedUpload({
    bucket, path,
    contentType: govde.contentType ? String(govde.contentType) : undefined,
  });

  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 502 });

  return NextResponse.json({
    url: res.url,
    /* Geçiş dönemindeyse istemci ikinci kopyayı da gönderiyor. */
    dualWrite: dualWrite(),
  });
}
