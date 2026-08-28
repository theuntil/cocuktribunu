import type { Metadata } from "next";
import { ButtonLink, Card, Container, Eyebrow, H2, H3, Lead, Section } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/motion";
import { Accordion } from "@/components/site/faq";
import { Icon } from "@/components/ui/icon";
import { IconTicket, IconCheck, IconQr, IconCalendar, IconShield, IconArrowRight } from "@/components/ui/icons";
import { getActivePlan, getTeams } from "@/lib/data";
import { CardPreview } from "@/components/site/card-preview";
import { toPreviewTeams } from "@/lib/preview-teams";
import { formatMoney, publicStorageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kombine Kart",
  description: "Çocuk Tribünü Kombine Kartı: çocuğunuzun kendi adına düzenlenen yıllık üyelik kartı.",
};

export const revalidate = 600;

/*
 * ┌─ ÜÇ HATA DÜZELTİLDİ ⚠️ ───────────────────────────────────────┐
 * │                                                                 │
 * │ 1. "YENİDEN BASIM" VARSAYIMI                                    │
 * │    İki soruda kartın basıldığı yazıyordu ("yeni kart            │
 * │    basılmaz", "yeniden basım süreci"). Kart TAMAMEN DİJİTAL;    │
 * │    hiçbir aşamada basım yok. Kayıp kavramı da yok — kart        │
 * │    panelde duruyor.                                              │
 * │                                                                 │
 * │ 2. ETKİNLİK KATILIMI                                            │
 * │    "Katılım hakkı verir" ifadesi, her etkinliğe girileceği      │
 * │    anlamına geliyordu. Gerçek işleyiş farklı: kontenjan          │
 * │    sınırlı ve katılımcılar kura ile belirleniyor. Kart          │
 * │    katılım hakkı değil, KATILMA ŞANSI veriyor.                  │
 * │                                                                 │
 * │ 3. CAYMA SÜRESİNİN BAŞLANGICI                                   │
 * │    "Teslim tarihinden itibaren" yazıyordu. Teslimat yok;        │
 * │    dijital hizmette süre ödemenin onaylandığı gün başlar.       │
 * └─────────────────────────────────────────────────────────────────┘
 */
const FAQ = [
  { q: "Kart kimin adına düzenleniyor?", a: "Kart çocuğun kendi adına düzenlenir, velinin değil. Üzerinde çocuğun adı, soyadı ve takımı yer alır." },
  { q: "Fiziksel bir kart gönderiliyor mu?", a: "Hayır. Kart tamamen dijitaldir; hiçbir aşamada basım veya kargo yoktur. Ödeme onaylandığı an kartınız panelinizde oluşur ve telefonunuzdan gösterilir." },
  { q: "Kaç çocuk için kart alabilirim?", a: "Sınırlama yok. Her çocuğunuz için ayrı kart alabilirsiniz; her kart için ayrı yıllık üyelik bedeli geçerlidir." },
  { q: "Üyelik otomatik yenileniyor mu?", a: "Hayır. Otomatik yenileme yoktur, kartınızdan tekrar ücret çekilmez. Süre dolmadan 60 gün önce yenileme yapabilirsiniz." },
  { q: "Yenilediğimde ne oluyor?", a: "Mevcut kartınızın geçerlilik süresi uzatılır. Kart numaranız ve QR kodunuz değişmez; yeni bir kart oluşturulmaz." },
  { q: "Kartımı kaybedebilir miyim?", a: "Hayır. Kart dijitaldir ve hesabınıza tanımlıdır; kaybolma veya yıpranma söz konusu değildir. Telefonunuz değişse bile hesabınıza giriş yaptığınızda kartınız yerindedir." },
  { q: "Etkinliklere katılım nasıl belirleniyor?", a: "Etkinliklerimizde kontenjan sınırlıdır. Kombine kart, düzenlediğimiz etkinliklere başvurma ve kura sonucu katılma şansı verir; her etkinliğe katılımı garanti etmez. Etkinlik takvimi, kontenjan ve katılımcı sayısı Çocuk Tribünü tarafından belirlenir." },
  { q: "Kart ile stadyuma ücretsiz girebilir miyim?", a: "Hayır. Kart bir maç bileti değildir ve bilet yerine geçmez. Çocuk Tribünü etkinliklerine başvuru hakkı verir; kulüplerle yürüttüğümüz görüşmeler kapsamında zaman zaman ek imkânlar sunulabilir." },
  { q: "Etkinliğe çocuğumla birlikte gelebilir miyim?", a: "Evet, gelmeniz gerekir. Çocuğunuzun etkinliğe katılabilmesi için bir velisinin de yanında bulunması ve gerekli durumlarda kendi biletini/girişini temin etmesi zorunludur. Çocuklarımızı hiçbir etkinliğe velisi olmadan kabul etmiyoruz." },
  { q: "İptal edebilir miyim?", a: "Evet. Ödemenizin onaylandığı tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz. Detaylar İptal ve İade Koşulları sayfasındadır." },
];

export default async function CardPage() {
  const [plan, teams] = await Promise.all([getActivePlan(), getTeams()]);
  // Plan bulunamazsa sabit fiyat GÖSTERİLMEZ: yanlış bilgi vermektense boş bırakılır
  const price = plan ? formatMoney(plan.price, plan.currency) : "—";
  const previewTeams = toPreviewTeams(teams);

  return (
    <>
      <PageHeader
        eyebrow="KOMBİNE KART"
        title={<>Çocuğunuzun kendi<br />kombine kartı.</>}
        description={`Yıllık ${price} sembolik bedelle, çocuğunuz Çocuk Tribünü ailesinin bir üyesi olur. Kart çocuğun adına düzenlenir ve 12 ay geçerlidir.`}
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href="/panel/kombine-kart/basvuru" size="lg">Başvuruyu başlat <Icon icon={IconArrowRight} size={16} /></ButtonLink>
          <ButtonLink href="#sss" variant="outline" size="lg">Soruları oku</ButtonLink>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: IconTicket, t: "Çocuğun adına", d: "Kart üzerinde çocuğunuzun adı, soyadı ve takımı yazar." },
              { icon: IconCalendar, t: "12 ay geçerli", d: "Satın alma tarihinden itibaren tam bir yıl boyunca geçerlidir." },
              { icon: IconQr, t: "Anında aktif", d: "Ödeme onaylandığı an kart panelinizde. Kargo yok, bekleme yok." },
              { icon: IconShield, t: "Etkinlik başvurusu", d: "Kart sahibi çocuklara özel etkinliklere başvurma ve kura ile katılma şansı." },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 60}>
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-accent-soft text-accent-ink">
                    <Icon icon={f.icon} size={20} />
                  </span>
                  <H3 className="text-[17px]">{f.t}</H3>
                  <p className="text-[14px] leading-[1.6] text-ink2">{f.d}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-line2 bg-surface/40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <Reveal>
              <CardPreview teams={previewTeams} />
              <p className="mt-4 text-center text-[13px] text-muted">
                Yukarıdaki kutulardan takım seçin, isim alanına yazın — kartınız canlı değişsin.
              </p>
            </Reveal>

            <Reveal delay={80} className="flex flex-col gap-5">
              <Eyebrow className="text-accent-ink">ÜYELİĞE DAHİL</Eyebrow>
              <H2>{price} karşılığında neler var?</H2>
              <ul className="flex flex-col gap-3">
                {[
                  "Çocuğun adına düzenlenmiş dijital kombine kart",
                  "Kart sahiplerine özel etkinliklere başvuru hakkı",
                  "Şehrinizdeki Çocuk Tribünü buluşmalarına öncelikli kayıt",
                  "Kulüplerle yürüttüğümüz görüşmelerde temsil edilme",
                  "Kargo ve teslimat ücreti yok, ek ödeme yok",
                  "İstediğiniz an iptal, 14 gün içinde koşulsuz cayma hakkı",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-[1.6] text-ink2">
                    <Icon icon={IconCheck} size={18} className="mt-[3px] shrink-0 text-accent-ink" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <ButtonLink href="/panel/kombine-kart" variant="solid" size="lg">
                  Hemen başvur <Icon icon={IconArrowRight} size={16} />
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {teams.length > 0 && (
        <Section className="border-t border-line2">
          <Container>
            <Reveal className="flex flex-col gap-3">
              <Eyebrow className="text-accent-ink">TAKIMLAR</Eyebrow>
              <H2>Hangi takım için kart alabilirim?</H2>
              <Lead className="max-w-[560px]">Aşağıdaki takımlar için kart düzenlenebilir. Takımınız listede yoksa bize yazın.</Lead>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {teams.map((t, i) => {
                const logo = publicStorageUrl("team-logos", t.logo_path);
                return (
                  <Reveal key={t.id} delay={Math.min(i * 30, 300)}>
                    <Card className="flex h-full items-center gap-3 p-4 transition-colors duration-200 hover:border-accent-line">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-chip">
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt="" className="h-full w-full object-contain" loading="lazy" />
                        ) : (
                          <span className="text-[11px] font-bold text-muted">{(t.short_name ?? t.name).slice(0, 3)}</span>
                        )}
                      </span>
                      <span className="truncate text-[14px] font-semibold">{t.name}</span>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      <Section id="sss" className="border-t border-line2 bg-surface/40">
        <Container className="max-w-[820px]">
          <Reveal className="mb-8 flex flex-col gap-3">
            <Eyebrow className="text-accent-ink">SIKÇA SORULANLAR</Eyebrow>
            <H2>Kombine kart hakkında.</H2>
          </Reveal>
          <Accordion items={FAQ} />
        </Container>
      </Section>
    </>
  );
}
