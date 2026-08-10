import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Card, Container, Eyebrow, H2, H3, Lead, ProgressBar, Section } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { DonationForm } from "@/components/site/donation-form";
import { Reveal } from "@/components/ui/motion";
import { Icon } from "@/components/ui/icon";
import { IconCheck, IconArrowRight } from "@/components/ui/icons";
import { getDonationCampaigns, getCities, getDonorWall } from "@/lib/data";
import { formatMoney, formatDate, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bağış Yap",
  description: "Bağışınızla imkânı olmayan bir çocuğa Çocuk Tribünü kombine kartı hediye edin. Üyelik gerekmez.",
};

export const revalidate = 60;

export default async function DonationPage() {
  const [campaigns, cities] = await Promise.all([getDonationCampaigns(), getCities()]);
  const main = campaigns[0] ?? null;
  const wall = main ? await getDonorWall(main.slug, 12) : [];
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <>
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

      <PageHeader
        eyebrow="BAĞIŞ"
        title={<>Bir çocuğa<br />kombine hediye edin.</>}
        description="Bağışınız doğrudan kombine kart bedeline ve şehir etkinliklerinin giderlerine gider. Bağış yapmak için üye olmanıza gerek yok."
      />

      <Section className="!pt-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="flex flex-col gap-8">
              {campaigns.length > 0 && (
                <Reveal className="flex flex-col gap-4">
                  <Eyebrow className="text-orange">AÇIK KAMPANYALAR</Eyebrow>
                  <div className="flex flex-col gap-4">
                    {campaigns.map((c) => (
                      <Link key={c.campaign_id} href={`/bagis/${c.slug}`} className="block">
                        <Card className="flex flex-col gap-4 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-orange">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1.5">
                              <H3 className="text-[19px]">{c.title}</H3>
                              <p className="text-[14px] leading-[1.6] text-ink2">{c.summary}</p>
                            </div>
                            <Icon icon={IconArrowRight} size={18} className="mt-1 shrink-0 text-muted" />
                          </div>
                          {c.goal_amount && (
                            <>
                              <ProgressBar value={c.progress_percent ?? 0} tone="orange" />
                              <div className="flex flex-wrap justify-between gap-2 text-[13.5px]">
                                <span className="font-semibold text-orange">{formatMoney(c.total_amount, c.currency)} toplandı</span>
                                <span className="text-muted">hedef {formatMoney(c.goal_amount, c.currency)}</span>
                              </div>
                            </>
                          )}
                          <span className="text-[13px] text-muted">{formatNumber(c.donation_count)} bağışçı</span>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </Reveal>
              )}

              <Reveal delay={80}>
                <Card className="flex flex-col gap-4 p-6">
                  <H3>Bağışınız nereye gidiyor?</H3>
                  <ul className="flex flex-col gap-3">
                    {[
                      "İmkânı olmayan çocuklar için kombine kart bedeli",
                      "Şehir etkinliklerinin ulaşım ve ikram giderleri",
                      "Kart basımı ve kargo maliyetleri",
                      "Gönüllü eğitim ve organizasyon giderleri",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[14.5px] leading-[1.6] text-ink2">
                        <Icon icon={IconCheck} size={17} className="mt-[3px] shrink-0 text-green" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="border-t border-line2 pt-4 text-[13.5px] leading-[1.6] text-muted">
                    Bağışlar gönüllü ekip tarafından yönetilir; yıllık gelir-gider özeti{" "}
                    <Link href="/basin" className="font-semibold text-green hover:underline">basın sayfamızda</Link>{" "}
                    yayımlanır.
                  </p>
                </Card>
              </Reveal>

              {wall.length > 0 && (
                <Reveal delay={100} className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <Eyebrow className="text-orange">BAĞIŞÇI DUVARI</Eyebrow>
                      <H2 className="text-[28px]">Teşekkürler.</H2>
                    </div>
                    <Link href="/bagiscilar" className="text-[14px] font-semibold text-green hover:underline">
                      Tüm bağışçılar →
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {wall.map((d, i) => (
                      <Card key={`${d.donor_display_name}-${i}`} className="flex flex-col gap-2 p-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[14.5px] font-semibold">{d.donor_display_name}</span>
                          <span className="text-[14px] font-bold text-orange">{formatMoney(d.amount, d.currency)}</span>
                        </div>
                        {d.message && <p className="text-[13.5px] leading-[1.55] text-ink2">&ldquo;{d.message}&rdquo;</p>}
                        <span className="text-[12.5px] text-muted2">
                          {[d.city_name, formatDate(d.paid_at)].filter(Boolean).join(" · ")}
                        </span>
                      </Card>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <DonationForm
                  campaignSlug={main?.slug ?? null}
                  cities={cities}
                  suggested={main?.suggested_amounts?.length ? main.suggested_amounts.map(Number) : [100, 250, 500, 1000]}
                  minAmount={Number(main?.min_amount ?? 10)}
                />
              </Reveal>
              <Reveal delay={80}>
                <Link href="/bagis/sorgula"
                  className="mt-4 flex items-center justify-between gap-3 rounded-[16px] border border-line bg-surface px-5 py-4 text-[14px] transition-colors hover:border-green">
                  <span className="text-ink2">Daha önce bağış yaptım, <strong className="text-ink">durumunu sorgula</strong></span>
                  <Icon icon={IconArrowRight} size={16} className="text-muted" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
