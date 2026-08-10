import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Card, Container, EmptyState, Eyebrow, H2, Section, StatBlock, Badge } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { Icon } from "@/components/ui/icon";
import { IconHeart, IconArrowRight, IconShield } from "@/components/ui/icons";
import { getRecentDonors, getDonorTotals } from "@/lib/data";
import { formatMoney, formatDate, formatNumber, relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bağışçılarımız",
  description: "Çocuk Tribünü'ne destek olan bağışçılar. En son yapılan bağış en üstte.",
  alternates: { canonical: "/bagiscilar" },
};

export const revalidate = 60;
const PER_PAGE = 60;

export default async function Page({
  searchParams,
}: { searchParams: Promise<{ sayfa?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.sayfa ?? 1));

  const [donors, totals] = await Promise.all([
    getRecentDonors(PER_PAGE, (page - 1) * PER_PAGE),
    getDonorTotals(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totals.donor_count / PER_PAGE));

  return (
    <>
      <PageHeader
        eyebrow="BAĞIŞÇILARIMIZ"
        title="Teşekkürler."
        description="Çocuk Tribünü'nü mümkün kılan herkes burada. En son yapılan bağış en üstte görünür."
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href="/bagis" variant="orange" size="lg">
            <Icon icon={IconHeart} size={17} /> Siz de bağış yapın
          </ButtonLink>
        </div>
      </PageHeader>

      <Section className="!pt-10">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-6"><StatBlock value={formatNumber(totals.donor_count)} label="bağış" tone="orange" /></Card>
            <Card className="p-6"><StatBlock value={formatMoney(totals.total_amount)} label="toplanan tutar" tone="green" /></Card>
          </div>

          <div className="mt-8">
            {donors.length === 0 ? (
              <EmptyState
                icon={<Icon icon={IconHeart} size={26} />}
                title="Henüz onaylanmış bağış yok"
                description="İlk bağışı siz yaparak listeyi açabilirsiniz."
                action={<ButtonLink href="/bagis" variant="orange">Bağış yap</ButtonLink>}
              />
            ) : (
              <>
                <Eyebrow className="mb-4 block text-orange">SON BAĞIŞLAR</Eyebrow>

                <div className="ct-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {donors.map((d, i) => (
                    <Card key={`${d.paid_at}-${i}`} className="flex flex-col gap-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-[15px] font-bold">{d.donor_display_name}</span>
                          <span className="text-[12.5px] text-muted">
                            {[d.city_name, relativeTime(d.paid_at)].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                        <span className="shrink-0 text-[15px] font-bold text-orange">
                          {formatMoney(d.amount, d.currency)}
                        </span>
                      </div>

                      {d.message && (
                        <p className="rounded-[12px] bg-chip px-3.5 py-2.5 text-[13.5px] leading-[1.55] text-ink2">
                          &ldquo;{d.message}&rdquo;
                        </p>
                      )}

                      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line2 pt-3">
                        {d.campaign_slug ? (
                          <Link href={`/bagis/${d.campaign_slug}`}>
                            <Badge tone="muted">{d.campaign_title}</Badge>
                          </Link>
                        ) : (
                          <Badge tone="muted">Genel bağış</Badge>
                        )}
                        <span className="ml-auto text-[12px] text-muted2">{formatDate(d.paid_at)}</span>
                      </div>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Sayfalama">
                    {Array.from({ length: Math.min(totalPages, 12) }, (_, i) => i + 1).map((p) => (
                      <Link key={p} href={`/bagiscilar?sayfa=${p}`}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-[14px] font-semibold transition-colors ${
                          p === page ? "border-transparent bg-solid text-on-solid" : "border-line bg-surface text-ink2 hover:border-green"
                        }`}>
                        {p}
                      </Link>
                    ))}
                  </nav>
                )}
              </>
            )}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-[18px] border border-line bg-surface p-5">
            <Icon icon={IconShield} size={19} className="mt-[2px] shrink-0 text-green" />
            <p className="text-[13.5px] leading-[1.6] text-ink2">
              Bu listede yalnızca <strong className="text-ink">görünmeyi kabul eden</strong> bağışçılar yer alır.
              &ldquo;İsimsiz kalmak istiyorum&rdquo; seçeneğini işaretleyenler <strong className="text-ink">İsimsiz Bağışçı</strong> olarak
              görünür; baş harf tercihi yapanların yalnızca baş harfleri gösterilir. Tutar dışında hiçbir
              kişisel bilgi paylaşılmaz.{" "}
              <Link href="/kvkk" className="font-semibold text-green hover:underline">KVKK metnimiz</Link>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-line bg-surface p-6">
            <span className="text-[15px] font-semibold">Bağışınızın durumunu mu sorgulamak istiyorsunuz?</span>
            <Link href="/bagis/sorgula" className="inline-flex items-center gap-2 text-[14px] font-semibold text-green hover:underline">
              Bağış sorgula <Icon icon={IconArrowRight} size={15} />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
