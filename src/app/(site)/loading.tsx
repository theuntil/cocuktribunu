import { Container } from "@/components/ui";
import { Bone } from "@/components/ui/skeletons";

/**
 * SİTE GENELİ İSKELET
 *
 * ┌─ NEDEN NÖTR ⚠️ ───────────────────────────────────────────────┐
 * │ Burada ana sayfaya özel bir iskelet duruyordu: hero, kart      │
 * │ önizlemesi, sayaçlar.                                           │
 * │                                                                  │
 * │ Next.js `loading.tsx`i EN YAKIN ÜST SEGMENTTEN devralıyor.      │
 * │ Kendi iskeleti olmayan her site sayfası — kombine kart,         │
 * │ hakkımızda, iletişim, politikalar — bu yüzden ana sayfanın      │
 * │ iskeletini gösteriyordu. Kullanıcı "yanlış sayfaya mı geldim"   │
 * │ diye tereddüt ediyordu.                                          │
 * │                                                                  │
 * │ Bu dosya artık nötr: başlık + içerik blokları. Hangi sayfaya    │
 * │ düşerse düşsün yanlış bir şey vaat etmiyor. Ana sayfanın ve    │
 * │ liste sayfalarının kendi iskeletleri zaten var, onlar           │
 * │ etkilenmiyor.                                                     │
 * └──────────────────────────────────────────────────────────────────┘
 */
export default function Loading() {
  return (
    <div className="bg-page" role="status" aria-label="Yükleniyor">
      <Container>
        <div className="flex flex-col gap-10 py-16 sm:py-20">
          {/* Sayfa başlığı */}
          <div className="flex flex-col gap-4">
            <Bone className="h-3.5 w-24" />
            <Bone className="h-[44px] w-full max-w-[520px] sm:h-[56px]" />
            <Bone className="h-4 w-full max-w-[560px]" />
            <Bone className="h-4 w-4/5 max-w-[460px]" />
          </div>

          {/* İçerik blokları — çoğu sayfa kart ya da metin bloğuyla
              devam ediyor; ikisine de yakın duran nötr bir şekil. */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-3 rounded-[20px] border border-line p-5">
                <Bone className="h-[140px] w-full rounded-[14px]" />
                <Bone className="h-4 w-3/4" />
                <Bone className="h-3.5 w-full" />
                <Bone className="h-3.5 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
