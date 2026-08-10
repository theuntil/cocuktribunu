import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Card, Container, Eyebrow, H2, H3, Lead, Section, StatBlock } from "@/components/ui";
import { Reveal } from "@/components/ui/motion";
import { NewsletterForm } from "@/components/site/newsletter";
import { Icon } from "@/components/ui/icon";
import {
  IconFootball, IconCalendar, IconLocation, IconUsers, IconTicket,
  IconArrowRight, IconIdea, IconTarget, IconShield,
} from "@/components/ui/icons";
import { getSiteContent, getEvents } from "@/lib/data";
import { publicStorageUrl, formatDate, EVENT_TYPE_TR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FIFA 2026 Dünya Kupası",
  description:
    "Çocuk Tribünü'nün FIFA 2026 Dünya Kupası programı: şehirlerde ortak izleme etkinlikleri, okul atölyeleri ve tribün kültürü buluşmaları.",
  alternates: { canonical: "/fifa-2026" },
};

export const revalidate = 300;

const PROGRAM = [
  {
    icon: IconUsers,
    title: "Şehirlerde ortak izleme",
    text: "Türkiye'nin farklı şehirlerinde, çocuklar ve aileleri için güvenli ortak izleme alanları kuruyoruz. Amaç maçı birlikte izlemek değil sadece; çocuğun kalabalık içinde kendini güvende hissettiği bir topluluk deneyimi yaşaması.",
  },
  {
    icon: IconIdea,
    title: "Okul atölyeleri",
    text: "Dünya Kupası dönemi boyunca okullarda takım ruhu, adil oyun ve tribün dili üzerine atölyeler düzenliyoruz. Çocukların rekabeti sahada bırakmayı öğrenmesi bu işin özü.",
  },
  {
    icon: IconTicket,
    title: "Kart sahiplerine özel program",
    text: "Kombine kartı olan çocuklar için turnuva boyunca özel buluşmalar, mini turnuvalar ve sürpriz etkinlikler planlanıyor.",
  },
  {
    icon: IconShield,
    title: "Ekran dengesi rehberi",
    text: "Turnuva döneminde ekran süresi hızla artıyor. Ailelere yönelik pratik bir rehberle, futbol heyecanının ekran bağımlılığına dönüşmemesi için somut öneriler sunuyoruz.",
  },
];

const FACTS = [
  { v: "11 Haziran 2026", l: "açılış maçı" },
  { v: "104", l: "toplam maç" },
  { v: "48", l: "katılımcı takım" },
  { v: "16", l: "ev sahibi şehir" },
];

export default async function Page() {
  const [blocks, events] = await Promise.all([
    getSiteContent(["fifa2026.intro", "home.fifa2026"]),
    getEvents({ limit: 6 }),
  ]);

  const intro = blocks.get("fifa2026.intro") ?? blocks.get("home.fifa2026");
  const hero = publicStorageUrl(intro?.image_bucket ?? "site-media", intro?.image_path);

  return (
    <>
      {/* HERO */}
      <div
        className="relative isolate border-b border-line2"
        style={{
          backgroundImage: hero ? `url(${hero})` : undefined,
          backgroundColor: "var(--deep)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div aria-hidden className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(15,42,34,.92) 0%, rgba(15,42,34,.72) 55%, rgba(15,42,34,.55) 100%)" }} />

        <Container className="relative px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="ct-stagger flex max-w-[720px] flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12.5px] font-bold tracking-[.12em] text-lime backdrop-blur-sm">
              <Icon icon={IconFootball} size={15} />
              ABD · KANADA · MEKSİKA
            </span>

            <h1 className="font-display text-[38px] leading-[1.03] font-semibold tracking-[-.035em] text-white sm:text-[56px]">
              FIFA 2026<br />Dünya Kupası
            </h1>

            <p className="max-w-[560px] text-[16.5px] leading-[1.7] text-white/85">
              {intro?.body ??
                "Her Dünya Kupası, milyonlarca çocuğun futbolla ilk ciddi temasını kurduğu bir eşiktir. Çocuk Tribünü, 2026'yı çocukları ekrandan alıp sahaya, tribüne ve akranlarının yanına taşımak için bir başlangıç noktası olarak görüyor."}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href="/etkinlikler" variant="lime" size="lg">
                Etkinlik takvimi <Icon icon={IconArrowRight} size={16} />
              </ButtonLink>
              <ButtonLink href="/basvuru" variant="outline" size="lg"
                className="!border-white/25 !bg-white/5 !text-white backdrop-blur-sm hover:!border-lime hover:!text-lime">
                Kombine kart al
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>

      {/* SAYILAR */}
      <Section className="!py-10">
        <Container>
          <div className="ct-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f) => (
              <Card key={f.l} className="p-6">
                <StatBlock value={f.v} label={f.l} tone="green" />
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* NEDEN ÖNEMLİ */}
      <Section className="border-t border-line2 bg-surface/40">
        <Container>
          <Reveal className="flex max-w-[720px] flex-col gap-4">
            <Eyebrow className="text-green">{intro?.subtitle ?? "NEDEN BU PROGRAM?"}</Eyebrow>
            <H2>{intro?.title ?? "Dünya Kupası çocuklar için bir fırsat"}</H2>
            <Lead>
              Bu ilgi kendiliğinden kalıcı olmaz. Doğru ortam sunulmazsa, turnuva bittiğinde geriye yalnızca
              ekran başında geçmiş birkaç hafta kalır. Biz bu dönemi çocuğun sosyalleştiği, takım ruhunu
              deneyimlediği ve tribün kültürüyle güvenli biçimde tanıştığı bir başlangıca çevirmek istiyoruz.
            </Lead>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PROGRAM.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <Card className="flex h-full flex-col gap-3.5 p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-green-soft text-green">
                    <Icon icon={p.icon} size={22} />
                  </span>
                  <H3>{p.title}</H3>
                  <p className="text-[14.5px] leading-[1.65] text-ink2">{p.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* TURNUVA DÖNEMİ ETKİNLİKLERİ */}
      <Section className="border-t border-line2">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal className="flex flex-col gap-3">
              <Eyebrow className="text-green">TAKVİM</Eyebrow>
              <H2>Yaklaşan etkinlikler</H2>
            </Reveal>
            <Link href="/etkinlikler" className="text-[14.5px] font-semibold text-green hover:underline">
              Tümünü gör →
            </Link>
          </div>

          {events.length === 0 ? (
            <Reveal>
              <Card className="mt-8 flex flex-col items-center gap-4 p-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-chip text-muted">
                  <Icon icon={IconCalendar} size={24} />
                </span>
                <H3>Program yakında açıklanacak</H3>
                <p className="max-w-[440px] text-[14.5px] leading-[1.6] text-ink2">
                  Turnuva dönemine özel etkinlik takvimi hazırlanıyor. İlk duyanlardan olmak için
                  e-posta listemize katılın.
                </p>
              </Card>
            </Reveal>
          ) : (
            <div className="ct-stagger mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <Link key={e.id} href={`/etkinlikler/${e.slug}`} className="block h-full">
                  <Card className="flex h-full flex-col gap-4 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-green">
                    <span className="w-fit rounded-full bg-chip px-2.5 py-1 text-[12px] font-semibold text-ink2">
                      {EVENT_TYPE_TR[e.event_type] ?? "Etkinlik"}
                    </span>
                    <H3 className="text-[18px]">{e.title}</H3>
                    <div className="mt-auto flex flex-col gap-1.5 border-t border-line2 pt-4 text-[13.5px] text-muted">
                      <span className="flex items-center gap-2">
                        <Icon icon={IconCalendar} size={15} />{formatDate(e.starts_at, true)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Icon icon={IconLocation} size={15} />{e.city_name ?? "—"}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* BÜLTEN */}
      <Section className="border-t border-line2 bg-surface/40">
        <Container className="max-w-[720px]">
          <Reveal>
            <div className="flex flex-col gap-5 rounded-[26px] bg-lime p-8 text-on-lime">
              <div className="flex flex-col gap-2">
                <span className="text-[11.5px] font-bold tracking-[.14em] text-on-lime/60">HABERDAR OLUN</span>
                <h3 className="font-display text-[22px] font-semibold tracking-[-.02em]">
                  FIFA 2026 programı açıklandığında ilk siz bilin
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-on-lime/80">
                  Şehrinizdeki ortak izleme etkinlikleri ve atölye takvimi için e-posta listemize katılın.
                </p>
              </div>
              <NewsletterForm onLime />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
