import type { Metadata } from "next";
import Link from "next/link";
import { Alert, Badge, ButtonLink, Card, Divider, EmptyState, H3 } from "@/components/ui";
import { PanelBody, PanelHeader } from "@/components/panel/shell";
import { Icon } from "@/components/ui/icon";
import {
  IconChild, IconCard, IconOrder, IconCalendar, IconArrowRight, IconTicket, IconAlert,
} from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/data";
import {
  formatDate, formatMoney, ORDER_STATUS_TR, CARD_STATUS_TR, statusTone, calcAge,
} from "@/lib/utils";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };

export default async function PanelHome() {
  const supabase = await createClient();
  const profile = await getMyProfile();

  const [children, cards, orders, registrations] = await Promise.all([
    supabase.from("children").select("*").eq("status", "active").order("birth_date"),
    supabase.from("v_my_cards").select("*").order("valid_until", { ascending: false }).limit(3),
    supabase.from("orders").select("*, teams(name)").order("created_at", { ascending: false }).limit(3),
    supabase.from("v_my_event_registrations").select("*")
      .in("status", ["confirmed", "waitlisted"])
      .gte("starts_at", new Date().toISOString())
      .order("starts_at").limit(3),
  ]);

  const kids = (children.data ?? []) as unknown as { id: string; first_name: string; last_name: string; birth_date: string }[];
  const cardList = (cards.data ?? []) as unknown as { card_id: string; card_number: string; card_status: string; valid_until: string | null; child_first_name: string | null; team_name: string | null }[];
  const orderList = (orders.data ?? []) as unknown as { id: string; order_number: string; status: string; amount: number; currency: string; created_at: string }[];
  const eventList = (registrations.data ?? []) as unknown as { registration_id: string; event_title: string; event_slug: string; starts_at: string; status: string; city_name: string | null }[];

  const pendingPayment = orderList.find((o) => o.status === "payment_pending");
  const firstName = (profile as { first_name?: string } | null)?.first_name ?? "";
  const deletionAt = (profile as { purge_after?: string | null } | null)?.purge_after;

  return (
    <PanelBody>
      <PanelHeader
        title={firstName ? `Merhaba ${firstName}` : "Genel bakış"}
        subtitle="Hesabınızdaki her şeyin özeti burada."
      />

      {deletionAt && (
        <Alert tone="danger" title="Hesabınız silinmek üzere">
          <span className="flex items-start gap-2">
            <Icon icon={IconAlert} size={16} className="mt-[2px] shrink-0" />
            <span>
              Hesabınız {formatDate(deletionAt)} tarihinde kalıcı olarak silinecek.{" "}
              <Link href="/panel/ayarlar" className="font-semibold underline">Talebi iptal edebilirsiniz.</Link>
            </span>
          </span>
        </Alert>
      )}

      {pendingPayment && (
        <Alert tone="orange" title="Bekleyen ödemeniz var">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold">{pendingPayment.order_number}</span>
            numaralı siparişinizin ödemesi bekleniyor.
            <Link href={`/basvuru/odeme/${pendingPayment.order_number}`} className="font-semibold underline">
              Ödeme bilgilerini gör →
            </Link>
          </span>
        </Alert>
      )}

      {/* Özet kutuları */}
      <div className="ct-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IconChild} value={kids.length} label="çocuk kaydı" href="/panel/cocuklarim" />
        <StatCard icon={IconCard} value={cardList.filter((c) => c.card_status === "active").length} label="aktif kart" href="/panel/kartlarim" tone="green" />
        <StatCard icon={IconOrder} value={orderList.length} label="sipariş" href="/panel/siparisler" />
        <StatCard icon={IconCalendar} value={eventList.length} label="yaklaşan etkinlik" href="/panel/etkinliklerim" tone="orange" />
      </div>

      {/* Kartlar */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <H3>Kombine kartlar</H3>
          <Link href="/panel/kartlarim" className="text-[13.5px] font-semibold text-green hover:underline">Tümü →</Link>
        </div>
        {cardList.length === 0 ? (
          <EmptyState
            icon={<Icon icon={IconTicket} size={26} />}
            title="Henüz kartınız yok"
            description="Çocuğunuz için kombine kart başvurusu yaparak başlayın."
            action={<ButtonLink href="/basvuru" variant="green">Başvuru yap</ButtonLink>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cardList.map((c) => (
              <Card key={c.card_id} className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-[16px] font-semibold">{c.child_first_name ?? "—"}</span>
                  <Badge tone={statusTone(c.card_status)}>{CARD_STATUS_TR[c.card_status] ?? c.card_status}</Badge>
                </div>
                <span className="font-mono text-[13px] text-muted">{c.card_number}</span>
                <Divider />
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted">{c.team_name ?? "—"}</span>
                  <span className="font-semibold">{c.valid_until ? formatDate(c.valid_until) : "—"}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Yaklaşan etkinlikler */}
      {eventList.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <H3>Yaklaşan etkinlikler</H3>
            <Link href="/panel/etkinliklerim" className="text-[13.5px] font-semibold text-green hover:underline">Tümü →</Link>
          </div>
          <Card className="divide-y divide-line2">
            {eventList.map((e) => (
              <Link key={e.registration_id} href={`/etkinlikler/${e.event_slug}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-chip/40">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-[15px] font-semibold">{e.event_title}</span>
                  <span className="text-[13px] text-muted">
                    {formatDate(e.starts_at, true)}{e.city_name ? ` · ${e.city_name}` : ""}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone={statusTone(e.status)}>{e.status === "waitlisted" ? "Bekleme listesi" : "Onaylandı"}</Badge>
                  <Icon icon={IconArrowRight} size={16} className="text-muted" />
                </div>
              </Link>
            ))}
          </Card>
        </section>
      )}

      {/* Son siparişler */}
      {orderList.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <H3>Son siparişler</H3>
            <Link href="/panel/siparisler" className="text-[13.5px] font-semibold text-green hover:underline">Tümü →</Link>
          </div>
          <Card className="divide-y divide-line2">
            {orderList.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-mono text-[14px] font-semibold">{o.order_number}</span>
                  <span className="text-[13px] text-muted">{formatDate(o.created_at)}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-[14.5px] font-semibold">{formatMoney(o.amount, o.currency)}</span>
                  <Badge tone={statusTone(o.status)}>{ORDER_STATUS_TR[o.status] ?? o.status}</Badge>
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}

      {kids.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <H3>Çocuklarım</H3>
            <Link href="/panel/cocuklarim" className="text-[13.5px] font-semibold text-green hover:underline">Yönet →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {kids.map((c) => (
              <Card key={c.id} className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-chip text-muted">
                  <Icon icon={IconChild} size={19} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[14.5px] font-semibold">{c.first_name} {c.last_name}</span>
                  <span className="text-[12.5px] text-muted">{calcAge(c.birth_date)} yaş</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </PanelBody>
  );
}

function StatCard({
  icon, value, label, href, tone,
}: {
  icon: Parameters<typeof Icon>[0]["icon"]; value: number; label: string; href: string; tone?: "green" | "orange";
}) {
  const color = tone === "green" ? "text-green" : tone === "orange" ? "text-orange" : "text-ink";
  return (
    <Link href={href}>
      <Card className="flex flex-col gap-3 p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-green">
        <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-chip text-muted">
          <Icon icon={icon} size={18} />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className={`font-display text-[28px] leading-none font-semibold tracking-[-.03em] ${color}`}>{value}</span>
          <span className="text-[13px] text-muted">{label}</span>
        </div>
      </Card>
    </Link>
  );
}
