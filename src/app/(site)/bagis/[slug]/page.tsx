import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Card, Container, Eyebrow, H2, Lead, ProgressBar, Section, StatBlock } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { DonationForm } from "@/components/site/donation-form";
import { Reveal } from "@/components/ui/motion";
import { getDonationCampaign, getCities, getDonorWall, getDonationCampaigns } from "@/lib/data";
import { formatMoney, formatDate, formatNumber } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const list = await getDonationCampaigns();
  return list.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getDonationCampaign(slug);
  if (!c) return { title: "Kampanya bulunamadı" };
  return { title: c.title, description: c.summary ?? undefined, alternates: { canonical: `/bagis/${c.slug}` } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [campaign, cities] = await Promise.all([getDonationCampaign(slug), getCities()]);
  if (!campaign) notFound();

  const wall = campaign.show_donor_list ? await getDonorWall(slug, 30) : [];
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <>
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

      <PageHeader eyebrow="BAĞIŞ KAMPANYASI" title={campaign.title} description={campaign.summary ?? undefined} />

      <Section className="!pt-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
            <div className="flex flex-col gap-8">
              <Reveal>
                <Card className="flex flex-col gap-5 p-7">
                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <StatBlock value={formatMoney(campaign.total_amount, campaign.currency)} label="toplanan" tone="orange" />
                    <StatBlock value={formatNumber(campaign.donation_count)} label="bağışçı" />
                    {campaign.goal_amount && (
                      <StatBlock value={formatMoney(campaign.goal_amount, campaign.currency)} label="hedef" />
                    )}
                  </div>
                  {campaign.goal_amount && <ProgressBar value={campaign.progress_percent ?? 0} tone="orange" />}
                  {campaign.ends_at && (
                    <span className="text-[13px] text-muted">Kampanya {formatDate(campaign.ends_at)} tarihine kadar açık.</span>
                  )}
                </Card>
              </Reveal>

              {campaign.description && (
                <Reveal delay={70} className="flex flex-col gap-3">
                  <Eyebrow className="text-orange">KAMPANYA HAKKINDA</Eyebrow>
                  <Lead className="whitespace-pre-line">{campaign.description}</Lead>
                </Reveal>
              )}

              {wall.length > 0 && (
                <Reveal delay={100} className="flex flex-col gap-4">
                  <H2 className="text-[28px]">Bağışçılar</H2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {wall.map((d, i) => (
                      <Card key={i} className="flex flex-col gap-2 p-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[14.5px] font-semibold">{d.donor_display_name}</span>
                          <span className="text-[14px] font-bold text-orange">{formatMoney(d.amount, d.currency)}</span>
                        </div>
                        {d.message && <p className="text-[13.5px] leading-[1.55] text-ink2">&ldquo;{d.message}&rdquo;</p>}
                        <span className="text-[12.5px] text-muted2">{[d.city_name, formatDate(d.paid_at)].filter(Boolean).join(" · ")}</span>
                      </Card>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <DonationForm
                  campaignSlug={campaign.slug}
                  cities={cities}
                  suggested={campaign.suggested_amounts?.length ? campaign.suggested_amounts.map(Number) : [100, 250, 500, 1000]}
                  minAmount={Number(campaign.min_amount ?? 10)}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
