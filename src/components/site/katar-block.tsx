import { Container, Section, ButtonLink } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconFootball, IconArrowRight } from "@/components/ui/icons";
import { Motion } from "@/components/ui/motion";

/**
 * 2022 KATAR DÜNYA KUPASI BÖLÜMÜ
 *
 * Ana sayfada ve hakkımızda sayfasında aynı blok kullanılıyor.
 * Kopyalamak yerine bileşene çıkarıldı: metin ya da bağlantı
 * değişince iki yerde birden değişsin.
 */
export function KatarBlock({
  gorsel, title, body,
}: {
  gorsel: string;
  title?: string | null;
  body?: string | null;
}) {
  return (
      <Section className="!py-0">
        <Container>
          <Motion variant="scale">
            <div
              className="relative isolate overflow-hidden rounded-[30px] border border-line"
              style={{
                backgroundImage: `url(${gorsel})`,
                backgroundColor: "var(--deep)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Okunabilirlik perdesi: görselin üstündeki yazılar her
                  ekranda okunsun diye soldan sağa açılan koyu degrade. */}
              <div aria-hidden className="absolute inset-0"
                style={{ background: "linear-gradient(100deg, rgba(8,20,16,.86) 0%, rgba(8,20,16,.62) 52%, rgba(8,20,16,.34) 100%)" }} />

              <div className="relative p-8 sm:p-14">
                <div className="flex max-w-[620px] flex-col gap-5">
                  <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12.5px] font-bold tracking-[.12em] text-white backdrop-blur-sm">
                    <Icon icon={IconFootball} size={15} />
                    2022 · KATAR
                  </span>

                  <h2 className="ct-h2 text-white">
                    {title ?? "2022 Katar Dünya Kupası"}
                  </h2>

                  <p className="text-[15.5px] leading-[1.7] text-white/85">
                    {body ??
                      "Dünya Kupası, çocukların futbolla en yoğun temas kurduğu dönemdir. Çocuk Tribünü, 2022 Katar Dünya Kupası boyunca şehirlerde ortak izleme etkinlikleri, okul atölyeleri ve tribün kültürü buluşmaları düzenledi; bu ilgiyi kalıcı bir katılıma dönüştürmeyi hedefledi."}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-1">
                    {/* Bölüm Katar'ı anlatıyor; "Etkinlik takvimi"
                        genel takvime götürüyordu. Artık o çalışmanın
                        kendi sayfasına gidiyor. */}
                    <ButtonLink
                      href="/yaptiklarimiz/2022-katar-dunya-kupasi-nda-cocuklarimiz-icin-oradaydik"
                      variant="light" size="lg">
                      İncele
                      <Icon icon={IconArrowRight} size={16} />
                    </ButtonLink>
                    <ButtonLink href="/yaptiklarimiz" variant="outline" size="lg"
                      className="!border-white/25 !bg-white/5 !text-white backdrop-blur-sm hover:!border-white hover:!bg-white/10 hover:!text-white">
                      Bizden haberler
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </Motion>
        </Container>
      </Section>

  );
}
