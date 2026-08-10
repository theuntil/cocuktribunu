import type { Metadata } from "next";
import Link from "next/link";
import { Badge, ButtonLink, Card, Divider, EmptyState } from "@/components/ui";
import { PanelBody, PanelHeader } from "@/components/panel/shell";
import { Icon } from "@/components/ui/icon";
import { IconTicket, IconTruck, IconAlert } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { formatDate, CARD_STATUS_TR, SUBSCRIPTION_STATUS_TR, statusTone } from "@/lib/utils";
import type { MyCardView } from "@/lib/types";

export const metadata: Metadata = { title: "Kombine Kartlar", robots: { index: false } };

const RENEWAL_WINDOW_DAYS = 60;

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("v_my_cards").select("*").order("valid_until", { ascending: false });
  const cards = (data ?? []) as unknown as MyCardView[];

  return (
    <PanelBody>
      <PanelHeader
        title="Kombine kartlar"
        subtitle={`${cards.length} kart`}
        action={{ href: "/basvuru", label: "Yeni kart başvurusu" }}
      />

      {cards.length === 0 ? (
        <EmptyState
          icon={<Icon icon={IconTicket} size={26} />}
          title="Henüz kombine kartınız yok"
          description="Çocuğunuz için başvuru yaparak Çocuk Tribünü ailesine katılın."
          action={<ButtonLink href="/basvuru" variant="green">Başvuru yap</ButtonLink>}
        />
      ) : (
        <div className="ct-stagger grid gap-5 lg:grid-cols-2">
          {cards.map((c) => {
            const daysLeft = c.valid_until
              ? Math.ceil((new Date(c.valid_until).getTime() - Date.now()) / 864e5)
              : null;
            const canRenew = daysLeft !== null && daysLeft <= RENEWAL_WINDOW_DAYS;
            const expired = daysLeft !== null && daysLeft < 0;

            return (
              <Card key={c.card_id} className="flex flex-col gap-0 overflow-hidden">
                {/* Kart görseli */}
                <div className="flex flex-col gap-8 bg-deep p-6 text-deep-ink">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10.5px] font-bold tracking-[.14em] text-deep-muted">ÇOCUK TRİBÜNÜ</span>
                      <span className="font-display text-[17px] font-semibold">Kombine Kart</span>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-green text-lime">
                      <Icon icon={IconTicket} size={16} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10.5px] font-bold tracking-[.14em] text-deep-muted">KART SAHİBİ</span>
                    <span className="font-display text-[21px] font-semibold tracking-[-.02em]">
                      {c.child_first_name} {c.child_last_name}
                    </span>
                    <span className="text-[13px] text-deep-muted">{c.team_name ?? "—"}</span>
                  </div>
                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <span className="font-mono text-[12.5px] text-deep-muted">{c.card_number}</span>
                    <Badge tone={statusTone(c.card_status)}>{CARD_STATUS_TR[c.card_status] ?? c.card_status}</Badge>
                  </div>
                </div>

                {/* Detaylar */}
                <div className="flex flex-col gap-4 p-6">
                  <div className="grid grid-cols-2 gap-3 text-[13.5px]">
                    <Meta label="GEÇERLİLİK BAŞLANGICI" value={formatDate(c.valid_from)} />
                    <Meta label="GEÇERLİLİK BİTİŞİ" value={formatDate(c.valid_until)} />
                    <Meta label="ÜYELİK DURUMU" value={c.subscription_status ? (SUBSCRIPTION_STATUS_TR[c.subscription_status] ?? c.subscription_status) : "—"} />
                    <Meta label="SİPARİŞ" value={c.order_number ?? "—"} />
                  </div>

                  {c.tracking_number && (
                    <div className="flex items-center gap-3 rounded-[14px] bg-field px-4 py-3">
                      <Icon icon={IconTruck} size={17} className="shrink-0 text-green" />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-[12.5px] text-muted">{c.shipping_carrier ?? "Kargo"}</span>
                        <span className="truncate font-mono text-[13.5px] font-semibold">{c.tracking_number}</span>
                      </div>
                    </div>
                  )}

                  {expired ? (
                    <div className="flex flex-col gap-3 rounded-[14px] border border-orange-line bg-orange-bg px-4 py-3.5">
                      <span className="flex items-start gap-2 text-[13.5px] leading-[1.5] text-orange-ink">
                        <Icon icon={IconAlert} size={16} className="mt-[2px] shrink-0" />
                        Üyelik süresi doldu. Yenileyerek kartı tekrar aktif hâle getirebilirsiniz.
                      </span>
                      <ButtonLink href="/basvuru" variant="orange" size="sm" className="self-start">Yenile</ButtonLink>
                    </div>
                  ) : canRenew ? (
                    <div className="flex flex-col gap-3 rounded-[14px] border border-orange-line bg-orange-bg px-4 py-3.5">
                      <span className="text-[13.5px] leading-[1.5] text-orange-ink">
                        Üyeliğinizin bitmesine <strong>{daysLeft} gün</strong> kaldı. Şimdi yenilerseniz yeni
                        dönem mevcut süreniz bittiğinde başlar; yeni kart basılmaz, kartınızın süresi uzatılır.
                      </span>
                      <ButtonLink href="/basvuru" variant="orange" size="sm" className="self-start">Yenile</ButtonLink>
                    </div>
                  ) : daysLeft !== null ? (
                    <p className="text-[13px] text-muted">
                      Yenileme, bitiş tarihine {RENEWAL_WINDOW_DAYS} gün kala açılır. ({daysLeft} gün kaldı)
                    </p>
                  ) : null}

                  {c.card_status === "delivered" && (
                    <Link href="/etkinlikler?kart=1" className="text-[13.5px] font-semibold text-green hover:underline">
                      Kart sahiplerine özel etkinlikleri gör →
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PanelBody>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-bold tracking-[.08em] text-muted2">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
