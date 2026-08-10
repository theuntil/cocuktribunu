import Link from "next/link";
import type { Metadata } from "next";
import {
  ButtonLink, Card, Container, Dot, Eyebrow, H2, H3, Lead, Pill, ProgressBar, Section, StatBlock,
} from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { Reveal, CountUp } from "@/components/ui/motion";
import { CardPreview } from "@/components/site/card-preview";
import { toPreviewTeams } from "@/lib/preview-teams";
import { NewsletterForm } from "@/components/site/newsletter";
import { PressStrip } from "@/components/site/press-strip";
import {
  IconArrowRight, IconTicket, IconSignature, IconCalendar, IconHeart,
  IconShield, IconUsers, IconLocation, IconCheck, IconFootball, IconTarget, IconMail,
} from "@/components/ui/icons";
import {
  getMainCampaign, getNews, getEvents, getActivePlan, getTeams,
  getPressCoverage, getSiteContent,
} from "@/lib/data";
import { formatDate, formatMoney, EVENT_TYPE_TR, publicStorageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  description:
    "Çocuk Tribünü; stadyumlarda çocuklara ayrılmış güvenli bir tribün açılması için çalışan taraftar inisiyatifidir. İmza kampanyası, kombine kart ve şehir etkinlikleri.",
  alternates: { canonical: "/" },
};

export const revalidate = 300;

/** Projenin üç ayağı — asıl amacın anlatıldığı bölüm */
const PILLARS = [
  {
    icon: IconSignature,
    step: "01",
    title: "İmza topluyoruz",
    text: "Stadyumlarda çocuklara ayrılmış, güvenli ve gözetimli bir tribün bölümü açılması için kulüpleri ve federasyonu göreve çağırıyoruz. İmza vermek ücretsizdir ve üyelik gerektirmez.",
    href: "/imza-kampanyasi",
    cta: "Kampanyayı imzala",
  },
  {
    icon: IconTicket,
    step: "02",
    title: "Kombine kart veriyoruz",
    text: "Çocuğun kendi adına düzenlenen, sembolik bedelli yıllık kombine kart. Kart velinin değil çocuğun adınadır; çocuğu tribünün bir üyesi yapar.",
    href: "/kombine-kart",
    cta: "Kartı incele",
  },
  {
    icon: IconUsers,
    step: "03",
    title: "Şehirlerde buluşturuyoruz",
    text: "Maç günü buluşmaları, atölyeler ve şenliklerle çocukları ekran başından alıp sporun disiplini, takım ruhu ve akran ortamıyla tanıştırıyoruz.",
    href: "/etkinlikler",
    cta: "Etkinlikleri gör",
  },
];

const STEPS = [
  { n: "01", title: "Çocuğunuzu ekleyin", text: "Panelden ad, soyad ve doğum tarihini girin. Yalnızca kart için gereken asgari bilgi istenir." },
  { n: "02", title: "Takımı ve adresi seçin", text: "Çocuğunuzun takımını seçin, kartın gönderileceği adresi belirtin." },
  { n: "03", title: "Ödemeyi yapın", text: "Havale/EFT ile ödeyin, dekontu yükleyin. Ekibimiz 1 iş günü içinde onaylar." },
  { n: "04", title: "Kart kapınızda", text: "Kart basılır, kargoya verilir. Panelden kargo takibini anlık görebilirsiniz." },
];

export default async function HomePage() {
  const [campaign, news, events, plan, teams, press, blocks] = await Promise.all([
    getMainCampaign(),
    getNews(3),
    getEvents({ limit: 3 }),
    getActivePlan(),
    getTeams(),
    getPressCoverage(3, true),
    getSiteContent(["home.fifa2026", "home.about", "home.newsletter"]),
  ]);

  const price = plan ? formatMoney(plan.price, plan.currency) : "190 ₺";
  const signatureCount = campaign?.signature_count ?? 0;
  const target = campaign?.target_signature_count ?? 100000;
  const progress = campaign?.progress_percent ?? (target ? (signatureCount / target) * 100 : 0);

  const previewTeams = toPreviewTeams(teams, 4);
  const fifa = blocks.get("home.fifa2026");
  const about = blocks.get("home.about");
  const newsletter = blocks.get("home.newsletter");

  const fifaImage = publicStorageUrl(fifa?.image_bucket ?? "site-media", fifa?.image_path);
  const overlay = Number((fifa?.data as { overlay_opacity?: number } | undefined)?.overlay_opacity ?? 0.55);

  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <Section className="!py-0">
        <Container>
          <div className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:py-20">
            <div className="ct-stagger flex flex-col gap-6">
              <Pill>
                <Dot tone="orange" />
                15 yıldır sahada · 81 şehir hedefi · akademik model
              </Pill>

              <h1 className="font-display text-[38px] leading-[1.02] font-semibold tracking-[-.035em] sm:text-[52px] lg:text-[68px] lg:leading-[.98]">
                Her çocuğun
                <br />
                bir <span className="text-green">tribünü</span> olsun.
              </h1>

              <Lead className="max-w-[500px]">
                Çocuk Tribünü, stadyumlarda çocuklara ayrılmış güvenli bir tribün bölümü açılması için
                çalışan bir taraftar inisiyatifidir. İmza topluyor, çocuğun kendi adına kombine kart
                veriyor ve şehirlerde buluşmalar düzenliyoruz.
              </Lead>

              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/imza-kampanyasi" size="lg" variant="green">
                  <Icon icon={IconSignature} size={17} />
                  Kampanyayı imzala
                </ButtonLink>
                <ButtonLink href="/basvuru" size="lg" variant="outline">
                  Kombine kart başvurusu
                  <Icon icon={IconArrowRight} size={16} />
                </ButtonLink>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-10 gap-y-5 border-t border-line2 pt-6">
                <StatBlock value={<CountUp to={signatureCount} />} label="toplanan imza" tone="green" />
                <StatBlock value={price} label="yıllık kombine bedeli" />
                <StatBlock value={<CountUp to={teams.length || 18} />} label="katılan takım" tone="orange" />
              </div>
            </div>

            {/* Canlı kart önizlemesi — takım seçilebilir */}
            <Reveal>
              {previewTeams.length > 0 ? (
                <CardPreview teams={previewTeams} editableName />
              ) : (
                <Card className="p-8"><span className="text-muted">Kart önizlemesi yükleniyor…</span></Card>
              )}

              <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-orange-line bg-orange-bg px-4 py-3.5">
                <Icon icon={IconShield} size={18} className="shrink-0 text-orange" />
                <span className="text-[13.5px] leading-[1.55] text-orange-ink">
                  Kart <strong>çocuğun adına</strong> düzenlenir. Veriler KVKK kapsamında asgari düzeyde tutulur.
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ══════════ ÇOCUK TRİBÜNÜ NEDİR ══════════ */}
      <Section className="border-t border-line2 bg-surface/40" id="nedir">
        <Container>
          <Reveal className="flex max-w-[760px] flex-col gap-4">
            <Eyebrow className="text-green">{about?.subtitle ?? "ASIL AMACIMIZ"}</Eyebrow>
            <H2>{about?.title ?? "Çocuk Tribünü nedir?"}</H2>
            <Lead>
              {about?.body ??
                "Çocuk Tribünü; stadyumlarda çocuklara ayrılmış, güvenli ve gözetimli bir tribün bölümünün açılması için yürütülen bir taraftar inisiyatifidir."}
            </Lead>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <Card className="flex h-full flex-col gap-4 p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-green">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-green-soft text-green">
                      <Icon icon={p.icon} size={22} />
                    </span>
                    <span className="font-display text-[13px] font-semibold tracking-[.18em] text-muted2">{p.step}</span>
                  </div>
                  <H3>{p.title}</H3>
                  <p className="text-[14.5px] leading-[1.65] text-ink2">{p.text}</p>
                  <Link href={p.href} className="group mt-auto inline-flex items-center gap-2 pt-2 text-[14px] font-semibold text-green">
                    {p.cta}
                    <Icon icon={IconArrowRight} size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-[22px] border border-line bg-surface p-7">
              <div className="flex max-w-[620px] flex-col gap-2">
                <H3>Neden bu proje bir zorunluluk?</H3>
                <p className="text-[14.5px] leading-[1.65] text-ink2">
                  Çocuklar giderek daha uzun süre kontrolsüz ekran başında kalıyor. Onları ekrandan alıp
                  sporun disiplinine, takım ruhuna ve akran ortamına yönlendirmek; hem sosyalleşme hem de
                  şiddetin önlenmesi açısından somut bir çıkış yolu sunuyor. Çocuk Tribünü bunu 15 yıldır
                  akademik temellerle sürdürülen bir model olarak yürütüyor.
                </p>
              </div>
              <ButtonLink href="/hakkimizda" variant="outline" size="lg">
                Projeyi tanıyın <Icon icon={IconArrowRight} size={16} />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ══════════ İMZA KAMPANYASI ══════════ */}
      <Section className="border-t border-line2">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-[26px] border border-line bg-deep text-deep-ink">
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_.9fr]">
                <div className="flex flex-col gap-5">
                  <Eyebrow className="text-lime">İMZA KAMPANYASI</Eyebrow>
                  <H2 className="text-deep-ink">{campaign?.title ?? "Çocuklar Tribünde Olsun"}</H2>
                  <p className="max-w-[520px] text-[15.5px] leading-[1.65] text-on-dark">
                    Her çocuğun stadyumda güvenle maç izleyebilmesi için kulüpleri ve federasyonu göreve
                    çağırıyoruz. İmzalamak için üye olmanıza gerek yok, 30 saniye sürüyor.
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3">
                    <ButtonLink href="/imza-kampanyasi" size="lg" variant="lime">
                      <Icon icon={IconSignature} size={17} />
                      Hemen imzala
                    </ButtonLink>
                    <ButtonLink href="/imza-kampanyasi#nasil" size="lg" variant="outline"
                      className="!border-white/20 !bg-transparent !text-deep-ink hover:!border-lime hover:!text-lime">
                      Nasıl çalışıyor?
                    </ButtonLink>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-4 rounded-[20px] border border-white/10 bg-white/5 p-7">
                  <div className="flex items-end justify-between">
                    <span className="font-display text-[42px] leading-none font-semibold tracking-[-.03em] text-lime">
                      <CountUp to={signatureCount} />
                    </span>
                    <span className="text-[13.5px] text-deep-muted">
                      hedef {new Intl.NumberFormat("tr-TR").format(target)}
                    </span>
                  </div>
                  <ProgressBar value={progress} tone="lime" className="!bg-white/10" />
                  <span className="text-[13px] text-deep-muted">
                    Kampanya {campaign?.ends_at ? `${formatDate(campaign.ends_at)} tarihine kadar açık` : "devam ediyor"}.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ══════════ FIFA 2026 DÜNYA KUPASI ══════════ */}
      <Section className="!py-0">
        <Container>
          <Reveal>
            <div
              className="relative isolate overflow-hidden rounded-[26px] border border-line"
              style={{
                backgroundImage: fifaImage ? `url(${fifaImage})` : undefined,
                backgroundColor: "var(--deep)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Okunabilirlik için karartma — oranı veritabanından ayarlanır */}
              <div aria-hidden className="absolute inset-0"
                style={{ background: `linear-gradient(100deg, rgba(15,42,34,${Math.min(overlay + 0.25, 0.95)}) 0%, rgba(15,42,34,${overlay}) 55%, rgba(15,42,34,${Math.max(overlay - 0.2, 0.15)}) 100%)` }} />

              <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
                <div className="flex flex-col gap-5">
                  <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12.5px] font-bold tracking-[.12em] text-lime backdrop-blur-sm">
                    <Icon icon={IconFootball} size={15} />
                    11 HAZİRAN 2026 · ABD · KANADA · MEKSİKA
                  </span>

                  <h2 className="font-display text-[32px] leading-[1.05] font-semibold tracking-[-.03em] text-white sm:text-[44px]">
                    {fifa?.title ?? "FIFA 2026 Dünya Kupası"}
                  </h2>

                  <p className="max-w-[560px] text-[15.5px] leading-[1.7] text-white/85">
                    {fifa?.body ??
                      "Dünya Kupası, çocukların futbolla en yoğun temas kurduğu dönemdir. Çocuk Tribünü, 2026 boyunca şehirlerde ortak izleme etkinlikleri, okul atölyeleri ve tribün kültürü buluşmaları düzenleyerek bu ilgiyi kalıcı bir katılıma dönüştürmeyi hedefliyor."}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <ButtonLink href={fifa?.cta_href ?? "/fifa-2026"} variant="lime" size="lg">
                      {fifa?.cta_label ?? "FIFA 2026 programını incele"}
                      <Icon icon={IconArrowRight} size={16} />
                    </ButtonLink>
                    <ButtonLink href="/etkinlikler" variant="outline" size="lg"
                      className="!border-white/25 !bg-white/5 !text-white backdrop-blur-sm hover:!border-lime hover:!text-lime">
                      Etkinlik takvimi
                    </ButtonLink>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
                  {[
                    { v: "104", l: "maç" },
                    { v: "48", l: "takım" },
                    { v: "16", l: "ev sahibi şehir" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-[16px] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                      <div className="font-display text-[26px] leading-none font-semibold text-lime">{s.v}</div>
                      <div className="mt-1 text-[12.5px] text-white/75">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ══════════ KOMBİNE KART ADIMLARI ══════════ */}
      <Section className="border-t border-line2 bg-surface/40">
        <Container>
          <Reveal className="flex flex-col gap-3">
            <Eyebrow className="text-green">KOMBİNE KART</Eyebrow>
            <H2 className="max-w-[620px]">Dört adımda çocuğunuzun kartı.</H2>
            <Lead className="max-w-[560px]">
              Yıllık {price} sembolik bedelle, çocuğunuz kendi adına düzenlenmiş Çocuk Tribünü kombine
              kartına sahip olur.
            </Lead>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span className="font-display text-[13px] font-semibold tracking-[.18em] text-green">{s.n}</span>
                  <span className="font-display text-[18px] font-semibold tracking-[-.02em]">{s.title}</span>
                  <p className="text-[14px] leading-[1.6] text-ink2">{s.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-line bg-surface p-6">
              <div className="flex flex-col gap-1">
                <span className="font-display text-[20px] font-semibold tracking-[-.02em]">Yıllık üyelik {price}</span>
                <span className="text-[13.5px] text-muted">12 ay geçerli · kargo dahil · otomatik yenileme yok</span>
              </div>
              <ButtonLink href="/kombine-kart" variant="green" size="lg">
                Detayları incele <Icon icon={IconArrowRight} size={16} />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ══════════ ETKİNLİKLER ══════════ */}
      {events.length > 0 && (
        <Section className="border-t border-line2">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Reveal className="flex flex-col gap-3">
                <Eyebrow className="text-green">YAKLAŞAN ETKİNLİKLER</Eyebrow>
                <H2>Şehirlerde buluşuyoruz.</H2>
              </Reveal>
              <Link href="/etkinlikler" className="group inline-flex items-center gap-2 text-[14.5px] font-semibold text-green">
                Tüm etkinlikler
                <Icon icon={IconArrowRight} size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {events.map((e, i) => (
                <Reveal key={e.id} delay={i * 70}>
                  <Link href={`/etkinlikler/${e.slug}`} className="block h-full">
                    <Card className="flex h-full flex-col gap-4 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-green">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-chip px-2.5 py-1 text-[12px] font-semibold text-ink2">
                          {EVENT_TYPE_TR[e.event_type] ?? "Etkinlik"}
                        </span>
                        {e.requires_card && (
                          <span className="rounded-full bg-orange-soft px-2.5 py-1 text-[12px] font-semibold text-orange-ink">
                            Kart sahiplerine özel
                          </span>
                        )}
                      </div>
                      <H3 className="text-[19px]">{e.title}</H3>
                      <p className="line-clamp-2 text-[14px] leading-[1.6] text-ink2">{e.short_description}</p>
                      <div className="mt-auto flex flex-col gap-1.5 border-t border-line2 pt-4 text-[13.5px] text-muted">
                        <span className="flex items-center gap-2">
                          <Icon icon={IconCalendar} size={15} />{formatDate(e.starts_at, true)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Icon icon={IconLocation} size={15} />
                          {[e.city_name, e.venue_name].filter(Boolean).join(" · ") || "Konum açıklanacak"}
                        </span>
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ══════════ BASINDA BİZ ══════════ */}
      {press.length > 0 && (
        <Section className="border-t border-line2 bg-surface/40">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Reveal className="flex flex-col gap-3">
                <Eyebrow className="text-green">BASINDA BİZ</Eyebrow>
                <H2>Bizden söz edenler.</H2>
              </Reveal>
              <Link href="/basin" className="group inline-flex items-center gap-2 text-[14.5px] font-semibold text-green">
                Tüm haberler
                <Icon icon={IconArrowRight} size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-8">
              <PressStrip items={press} />
            </div>
          </Container>
        </Section>
      )}

      {/* ══════════ BLOG ══════════ */}
      {news.rows.length > 0 && (
        <Section className="border-t border-line2">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Reveal className="flex flex-col gap-3">
                <Eyebrow className="text-green">BLOG</Eyebrow>
                <H2>Sahadan notlar.</H2>
              </Reveal>
              <Link href="/blog" className="group inline-flex items-center gap-2 text-[14.5px] font-semibold text-green">
                Tüm yazılar
                <Icon icon={IconArrowRight} size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {news.rows.map((n, i) => (
                <Reveal key={n.id} delay={i * 70}>
                  <Link href={`/blog/${n.slug}`} className="block h-full">
                    <Card className="flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-green">
                      <div className="relative aspect-[16/9] w-full bg-chip">
                        {publicStorageUrl(n.image_bucket ?? "news-media", n.image_path) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={publicStorageUrl(n.image_bucket ?? "news-media", n.image_path)!}
                            alt={n.title} loading="lazy" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        {n.category_name && <Eyebrow className="text-green">{n.category_name}</Eyebrow>}
                        <H3 className="text-[18px] leading-[1.3]">{n.title}</H3>
                        <p className="line-clamp-2 text-[14px] leading-[1.6] text-ink2">{n.excerpt}</p>
                        <span className="mt-auto pt-2 text-[13px] text-muted">{formatDate(n.published_at)}</span>
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ══════════ BAĞIŞ ══════════ */}
      <Section className="border-t border-line2 bg-surface/40">
        <Container>
          <Reveal>
            <div className="grid gap-8 rounded-[26px] border border-line bg-surface p-8 sm:p-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
              <div className="flex flex-col gap-4">
                <Eyebrow className="text-orange">BAĞIŞ</Eyebrow>
                <H2 className="max-w-[500px]">Bir çocuğa kombine hediye edin.</H2>
                <Lead className="max-w-[500px]">
                  Her {price}, imkânı olmayan bir çocuğun bir sezon boyunca tribünde olmasını sağlar.
                  Bağış yapmak için üye olmanıza gerek yok.
                </Lead>
                <div className="flex flex-wrap gap-3 pt-1">
                  <ButtonLink href="/bagis" variant="orange" size="lg">
                    <Icon icon={IconHeart} size={17} /> Bağış yap
                  </ButtonLink>
                  <ButtonLink href="/hakkimizda" variant="outline" size="lg">Bizi tanıyın</ButtonLink>
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                {[
                  "Bağışın tamamı kombine kart ve etkinlik giderlerine gider",
                  "Her bağış için makbuz düzenlenir",
                  "Bağışçı duvarında adınız istediğiniz biçimde görünür",
                  "İstediğiniz an anonim kalabilirsiniz",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[14.5px] leading-[1.6] text-ink2">
                    <Icon icon={IconCheck} size={18} className="mt-[2px] shrink-0 text-green" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ══════════ E-POSTA BÜLTENİ ══════════ */}
      <Section className="border-t border-line2">
        <Container>
          <Reveal>
            <div className="grid gap-8 rounded-[26px] bg-lime p-8 text-on-lime sm:p-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div className="flex flex-col gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-on-lime/10">
                  <Icon icon={IconMail} size={22} className="text-on-lime" />
                </span>
                <h2 className="font-display text-[28px] leading-[1.05] font-semibold tracking-[-.03em] sm:text-[36px] lg:text-[42px]">
                  {newsletter?.title ?? "Gelişmelerden haberdar olun"}
                </h2>
                <p className="max-w-[460px] text-[15px] leading-[1.65] text-on-lime/80">
                  {newsletter?.body ??
                    "Kampanya güncellemeleri, şehrinizdeki etkinlikler ve kombine kart duyuruları için e-posta listemize katılın."}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-on-lime/70">
                  <Icon icon={IconTarget} size={15} />
                  Ayda en fazla 2 e-posta · reklam yok · tek tıkla çıkış
                </div>
              </div>

              <div className="rounded-[20px] border border-on-lime/15 bg-on-lime/5 p-6">
                <NewsletterForm onLime />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
