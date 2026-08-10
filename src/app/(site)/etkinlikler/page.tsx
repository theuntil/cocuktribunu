import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Container, EmptyState, H3, Section } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/ui/motion";
import { Icon } from "@/components/ui/icon";
import { IconCalendar, IconLocation, IconTicket, IconUsers } from "@/components/ui/icons";
import { getEvents, getCities } from "@/lib/data";
import { formatDate, EVENT_TYPE_TR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Etkinlikler",
  description: "Çocuk Tribünü'nün şehirlerde düzenlediği buluşmalar, atölyeler ve maç günü etkinlikleri.",
};

export const revalidate = 120;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ sehir?: string; tur?: string; kart?: string }>;
}) {
  const sp = await searchParams;
  const [events, cities] = await Promise.all([
    getEvents({ citySlug: sp.sehir, type: sp.tur, onlyCard: sp.kart === "1", limit: 60 }),
    getCities(),
  ]);

  const usedCitySlugs = new Set(events.map((e) => e.city_slug).filter(Boolean));
  const cityOptions = cities.filter((c) => usedCitySlugs.has(c.slug) || c.slug === sp.sehir);

  return (
    <>
      <PageHeader
        eyebrow="ETKİNLİKLER"
        title="Şehirlerde buluşuyoruz."
        description="Maç günü buluşmaları, atölyeler ve çocuk şenlikleri. Bazı etkinlikler yalnızca kombine kart sahibi çocuklara açıktır."
      />

      <Section className="!pt-8">
        <Container>
          {/* Filtreler */}
          <div className="ct-fade mb-8 flex flex-wrap gap-2">
            <FilterChip href="/etkinlikler" active={!sp.sehir && !sp.tur && !sp.kart}>Tümü</FilterChip>
            <FilterChip href="/etkinlikler?kart=1" active={sp.kart === "1"}>Kart sahiplerine özel</FilterChip>
            {Object.entries(EVENT_TYPE_TR).slice(0, 5).map(([k, v]) => (
              <FilterChip key={k} href={`/etkinlikler?tur=${k}`} active={sp.tur === k}>{v}</FilterChip>
            ))}
            {cityOptions.slice(0, 8).map((c) => (
              <FilterChip key={c.id} href={`/etkinlikler?sehir=${c.slug}`} active={sp.sehir === c.slug}>{c.name}</FilterChip>
            ))}
          </div>

          {events.length === 0 ? (
            <EmptyState
              icon={<Icon icon={IconCalendar} size={26} />}
              title="Şu an planlanmış etkinlik yok"
              description="Yeni etkinlikler eklendiğinde burada göreceksiniz. Duyurulardan haberdar olmak için üye olabilirsiniz."
            />
          ) : (
            <div className="ct-stagger grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <Link key={e.id} href={`/etkinlikler/${e.slug}`} className="block h-full">
                  <Card className="flex h-full flex-col gap-4 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-green">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="muted">{EVENT_TYPE_TR[e.event_type] ?? "Etkinlik"}</Badge>
                      {e.requires_card && (
                        <Badge tone="orange"><Icon icon={IconTicket} size={13} />Kart sahiplerine özel</Badge>
                      )}
                      {e.remaining_capacity === 0 && <Badge tone="danger">Kontenjan doldu</Badge>}
                    </div>

                    <H3 className="text-[19px] leading-[1.25]">{e.title}</H3>
                    {e.short_description && (
                      <p className="line-clamp-2 text-[14px] leading-[1.6] text-ink2">{e.short_description}</p>
                    )}

                    <div className="mt-auto flex flex-col gap-2 border-t border-line2 pt-4 text-[13.5px] text-muted">
                      <span className="flex items-center gap-2">
                        <Icon icon={IconCalendar} size={15} />{formatDate(e.starts_at, true)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Icon icon={IconLocation} size={15} />
                        {[e.city_name, e.venue_name].filter(Boolean).join(" · ") || "Konum açıklanacak"}
                      </span>
                      {e.capacity && (
                        <span className="flex items-center gap-2">
                          <Icon icon={IconUsers} size={15} />
                          {e.registered_count}/{e.capacity} kayıt
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

function FilterChip({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors duration-150 ${
        active ? "border-transparent bg-solid text-on-solid" : "border-line bg-surface text-ink2 hover:border-green hover:text-green"
      }`}
    >
      {children}
    </Link>
  );
}
