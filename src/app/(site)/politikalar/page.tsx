import type { Metadata } from "next";
import Link from "next/link";
import { Card, Container, EmptyState, Section } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconShield, IconArrowRight } from "@/components/ui/icons";
import { PageHeader } from "@/components/site/page-header";
import { getLegalDocuments } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politikalarımız",
  description:
    "Çocuk Tribünü'nün gizlilik, çocuk verileri, çerez ve kullanım politikaları tek sayfada.",
};
export const dynamic = "force-dynamic";

/**
 * POLİTİKALAR — TEK SAYFA
 *
 * ┌─ NEDEN TOPLU BİR SAYFA ───────────────────────────────────────┐
 * │ Politikalar alt bilgide yedi ayrı bağlantıydı ve orayı         │
 * │ şişiriyordu; listeyi kaldırınca da metinlere ulaşmak zorlaştı. │
 * │                                                                 │
 * │ Bu sayfa ikisini birden çözüyor: alt bilgide TEK bağlantı,     │
 * │ burada hepsinin listesi. Hangi belgenin ne anlattığı özetle     │
 * │ görünüyor, tıklayınca tam metne gidiliyor.                      │
 * └─────────────────────────────────────────────────────────────────┘
 */
export default async function Page() {
  const docs = await getLegalDocuments();

  return (
    <>
      <PageHeader
        eyebrow="YASAL"
        title="Politikalarımız."
        description="Verilerinizi nasıl işlediğimizi, çocuk verilerinde hangi ek önlemleri aldığımızı ve hizmet koşullarımızı burada bulabilirsiniz."
      />

      <Section>
        <Container>
          {docs.length === 0 ? (
            <EmptyState
              icon={<Icon icon={IconShield} size={24} />}
              title="Henüz belge yayınlanmadı"
              description="Politika metinleri hazırlandıkça burada listelenecek."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {docs.map((d) => (
                <Link key={d.slug} href={`/${d.slug}`}>
                  <Card className="flex h-full items-start gap-4 p-6 transition-colors hover:border-ink/25">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-chip text-ink2">
                      <Icon icon={IconShield} size={19} />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-[16px] font-semibold leading-snug">{d.title}</span>
                      {d.summary && (
                        <span className="text-[13.5px] leading-[1.55] text-muted">
                          {d.summary}
                        </span>
                      )}
                    </span>

                    <Icon icon={IconArrowRight} size={16}
                      className="mt-1 shrink-0 text-muted2" />
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
