import type { Metadata } from "next";
import { Card, Container, Eyebrow, H2, H3, Lead, Section, StatBlock, ButtonLink } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/motion";
import { Icon } from "@/components/ui/icon";
import { IconShield, IconUsers, IconHeart, IconTarget, IconFlag, IconIdea } from "@/components/ui/icons";
import { getTeamMembers } from "@/lib/data";
import { publicStorageUrl, initials } from "@/lib/utils";
import Link from "next/link";
import { getActivePlan, getCompanyInfo, getSiteContent } from "@/lib/data";
import { getTrademarks } from "@/lib/branding";
import { KatarBlock } from "@/components/site/katar-block";
import { formatMoney } from "@/lib/utils";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Çocuk Tribünü kimdir, neden kuruldu, nasıl çalışır? Değerlerimiz ve yol haritamız.",
};

const VALUES = [
  { icon: IconShield, title: "Çocuk önce gelir", text: "Her kararımızda ölçüt tektir: çocuk bu ortamda güvende mi, kendini ait hissediyor mu?" },
  { icon: IconUsers, title: "Takım ayrımı yok", text: "Hangi takımı tutarsa tutsun, her çocuk aynı tribünün parçasıdır. Rekabeti sahada bırakırız." },
  { icon: IconHeart, title: "Gönüllülük esası", text: "Sahadaki işi gönüllüler yapar. Bağışlar ve üyelik bedelleri şeffaf şekilde çocuklara döner." },
  { icon: IconTarget, title: "Ölçülebilir etki", text: "Kaç çocuk, kaç şehir, kaç etkinlik — verdiğimiz sözü sayılarla takip edilebilir kılarız." },
  { icon: IconFlag, title: "Bağımsızlık", text: "Hiçbir kulübün, siyasi yapının veya ticari markanın uzantısı değiliz." },
  { icon: IconIdea, title: "Veri minimizasyonu", text: "Çocuklardan yalnızca gerçekten gereken bilgiyi isteriz. Fazlasını istemeyiz, tutmayız." },
];

const TIMELINE = [
  { year: "2024", title: "İlk buluşma", text: "Farklı takımlardan bir grup taraftar, çocukların tribünde yaşadığı sorunları konuşmak için bir araya geldi." },
  { year: "2025", title: "İmza kampanyası", text: "«Çocuklar Tribünde Olsun» kampanyası başladı; kulüplere ve federasyona resmî çağrı yapıldı." },
  { year: "2026", title: "Kombine kart", text: "Çocuk Tribünü Kombine Kartı hayata geçti. Kart çocuğun kendi adına düzenleniyor." },
  { year: "Sırada", title: "81 şehir", text: "Her ilde en az bir gönüllü ekip ve yılda bir çocuk etkinliği hedefliyoruz." },
];

export default async function AboutPage() {
  // Fiyat tek kaynaktan: yönetim panelindeki aktif plan
  const [plan, sirket, trademarks, katarBloklari] = await Promise.all([
    getActivePlan(),
    getCompanyInfo(),
    getTrademarks(),
    getSiteContent(["home.fifa2026"]),
  ]);

  const katar = katarBloklari.get("home.fifa2026");

  /* Ana sayfadaki görselin aynısı — bölüm oradan taşındı, kaynak da
     tek yerde tutulmalı. */
  const katarGorsel =
    "https://supabase.childrentribune.online/storage/v1/object/public/galeri/1787007282990-katar_pankart--1-.webp";

  const price = plan ? formatMoney(plan.price, plan.currency) : "—";

  const members = await getTeamMembers();
  const leader = members.find((m) => m.is_leader) ?? members[0] ?? null;
  const others = members.filter((m) => m.id !== leader?.id);

  return (
    <>
      <PageHeader
        eyebrow="HAKKIMIZDA"
        title={<>Tribünü çocuklara<br />açmak için buradayız.</>}
        description="Çocuk Tribünü, çocukların futbolu güvenli ve ayrımsız deneyimlemesi için çalışan bağımsız bir taraftar inisiyatifidir."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow className="text-accent-ink">NEDEN VARIZ</Eyebrow>
              <H2>Bir çocuk için tribün, hayatının ilk topluluğu olabilir.</H2>
              <div className="flex flex-col gap-4 text-[15.5px] leading-[1.75] text-ink2">
                <p>
                  Türkiye&apos;de milyonlarca çocuk futbolu ekran üzerinden tanıyor. Stadyuma gidebilenlerin
                  çoğu için ilk deneyim; bilet fiyatı, ulaşım, güvenlik kaygısı ve tribün dilinin sertliği
                  arasında sıkışıyor.
                </p>
                <p>
                  Biz bunun değişebileceğine inanıyoruz. Çocuk Tribünü; kulüplerle, taraftar gruplarıyla ve
                  ailelerle birlikte çocuğun tribünde <strong className="text-ink">güvende, görünür ve hoş
                  karşılanmış</strong> hissetmesini hedefliyor.
                </p>
                <p>
                  Yaptığımız iş üç ayak üzerine kurulu: erişilebilir bir kombine kart, kamuoyu oluşturan imza
                  kampanyaları ve şehirlerde düzenlediğimiz çocuk etkinlikleri.
                </p>
              </div>
            </Reveal>

            {/* ┌─ İSTATİSTİK YERİNE KURUMSAL BİLGİ ⚠️ ──────────────┐
                │ Burada "81 hedeflenen şehir" ve "%100 gönüllü emeği"  │
                │ yazıyordu. İkisi de ÖLÇÜLEBİLİR BİR ŞEY DEĞİL —      │
                │ birincisi bir temenni, ikincisi doğrulanamaz bir      │
                │ iddia. Rakam gibi sunulan temenni, güven vermek       │
                │ yerine sorgulanır.                                     │
                │                                                         │
                │ Yerine doğrulanabilir bilgi: kim olduğumuz, nerede    │
                │ kayıtlı olduğumuz, nasıl ulaşılacağı.                 │
                └─────────────────────────────────────────────────────────┘ */}
            <Reveal delay={100}>
              <Card className="flex flex-col gap-5 p-7 sm:p-8">
                <span className="text-[12px] font-bold tracking-[.12em] text-muted2">
                  KURUMSAL BİLGİLER
                </span>

                <div className="flex flex-col gap-4">
                  {sirket.legalName && (
                    <BilgiSatiri etiket="Ticari unvan" deger={sirket.legalName} />
                  )}
                  {sirket.address && (
                    <BilgiSatiri etiket="Adres" deger={sirket.address} />
                  )}
                  {sirket.taxOffice && (
                    <BilgiSatiri etiket="Vergi dairesi" deger={sirket.taxOffice} />
                  )}
                  {sirket.taxNo && (
                    <BilgiSatiri etiket="Vergi no" deger={sirket.taxNo} />
                  )}
                  {sirket.mersis && (
                    <BilgiSatiri etiket="MERSİS" deger={sirket.mersis} />
                  )}
                  <BilgiSatiri etiket="E-posta" deger={sirket.email}
                    href={`mailto:${sirket.email}`} />
                  {sirket.phone && (
                    <BilgiSatiri etiket="Telefon" deger={sirket.phone}
                      href={`tel:${sirket.phone.replace(/[^0-9+]/g, "")}`} />
                  )}
                  <BilgiSatiri etiket="Yıllık kombine bedeli" deger={price} />
                </div>

                {/* Tescil belgeleri — alt bilgideki gibi minik rozetler */}
                {trademarks.length > 0 && (
                  <div className="flex flex-col gap-2.5 border-t border-line2 pt-5">
                    <span className="text-[12px] font-bold tracking-[.12em] text-muted2">
                      MARKA TESCİLİ
                    </span>
                    <Link href="/tescil-belgelerimiz"
                      className="group inline-flex flex-wrap items-center gap-2.5">
                      {trademarks.map((t: { code: string; image: string; office: string }) => (
                        <span key={t.code}
                          className="flex h-8 items-center gap-1.5 rounded-[8px] border border-line bg-field px-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.image} alt="" className="h-4 w-auto" />
                          <span className="text-[11.5px] font-semibold text-ink2">
                            {t.office}
                          </span>
                        </span>
                      ))}
                      <span className="text-[12.5px] font-semibold text-muted group-hover:text-ink">
                        Belgeleri görüntüle →
                      </span>
                    </Link>
                  </div>
                )}
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ┌─ İKİ BÖLÜM KALDIRILDI ⚠️ ────────────────────────────────┐
          │ "Altı ilke, tek ölçüt" ve "Nereden nereye" bölümleri         │
          │ kaldırıldı. Sayfa altı bölüme çıkmıştı ve kimse sonuna       │
          │ kadar okumuyordu.                                              │
          │                                                                 │
          │ İkisi de aynı şeyi farklı sözlerle anlatıyordu: ne yapmak     │
          │ istediğimizi. Bu zaten üstteki manifestoda var. Değerler bir  │
          │ liste hâlinde sayıldığında inandırıcılığını da yitiriyor —    │
          │ herkes aynı altı şeyi yazıyor.                                 │
          │                                                                 │
          │ Kalan yapı: manifesto → kurumsal bilgiler → gönüllülük →     │
          │ Katar çalışması. Kısa, doğrulanabilir ve somut.                │
          └─────────────────────────────────────────────────────────────────┘ */}

      {/* ┌─ EKİP BÖLÜMÜ KALDIRILDI ⚠️ ──────────────────────────────┐
          │ Tek bir kişinin fotoğrafı, unvanı ve özgeçmişi                │
          │ gösteriliyordu. İki sorunu vardı:                              │
          │                                                                 │
          │ · Kişi ayrılırsa ya da rolü değişirse sayfa yanlış bilgi      │
          │   göstermeye devam ediyor                                       │
          │ · Bir kurumu tek kişiyle özdeşleştirmek, "biz" diliyle         │
          │   anlatılan projeyle çelişiyor                                  │
          │                                                                 │
          │ Kurumsal bilgiler (unvan, adres, tescil) yukarıdaki kartta    │
          │ zaten var ve doğrulanabilir.                                    │
          └─────────────────────────────────────────────────────────────────┘ */}

      <Section className="border-t border-line2 bg-surface/40">
        <Container>
          <Reveal>
            {/* ┌─ ARKA PLAN GÖRSELİ ⚠️ ────────────────────────────┐
                │ Düz koyu zemin yerine fotoğraf. Üstünde okunabilirlik │
                │ perdesi var: görselin açık bölgelerinde beyaz yazı    │
                │ kaybolmasın diye. Perde olmadan bazı ekranlarda metin │
                │ okunmuyordu.                                           │
                │                                                         │
                │ `bg-deep` yedek olarak duruyor: görsel yüklenmezse    │
                │ ya da yoksa bölüm boş çıkmıyor, koyu zeminle çalışıyor.│
                └─────────────────────────────────────────────────────────┘ */}
            <div
              className="relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-[26px] border border-line bg-deep px-8 py-14 text-center text-deep-ink"
              style={{
                backgroundImage: "url(/gonullu.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div aria-hidden className="absolute inset-0 -z-10"
                style={{ background: "linear-gradient(180deg, rgba(8,8,8,.72) 0%, rgba(8,8,8,.84) 100%)" }} />
              <H2 className="max-w-[540px] text-deep-ink">Bu işin sahadaki adı gönüllülüktür.</H2>
              <Lead className="max-w-[520px] !text-on-dark">
                Şehrinizde bir çocuk etkinliği düzenlemek, iletişim veya organizasyonda destek olmak isterseniz
                kapımız açık.
              </Lead>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <ButtonLink href="/gonullu-ol" variant="solid" size="lg">Gönüllü ol</ButtonLink>
                <ButtonLink href="/iletisim" variant="outline" size="lg"
                  className="!border-white/20 !bg-transparent !text-deep-ink hover:!border-lime hover:!text-lime">
                  İletişime geç
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Ana sayfadaki bölümün aynısı — kopya değil, aynı bileşen. */}
      <Section className="!pb-24 !pt-0 sm:!pb-32">
        <KatarBlock gorsel={katarGorsel} title={katar?.title} body={katar?.body} />
      </Section>
    </>
  );
}

function BilgiSatiri({
  etiket, deger, href,
}: {
  etiket: string; deger: string; href?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] text-muted2">{etiket}</span>
      {href ? (
        <a href={href} className="text-[13.5px] font-medium leading-[1.5] text-ink underline underline-offset-2 hover:text-muted">
          {deger}
        </a>
      ) : (
        <span className="text-[13.5px] font-medium leading-[1.5] text-ink">{deger}</span>
      )}
    </div>
  );
}
