import type { Metadata } from "next";
import Link from "next/link";
import { Badge, ButtonLink, Card, Divider, EmptyState } from "@/components/ui";
import { PanelBody, PanelHeader } from "@/components/panel/shell";
import { Icon } from "@/components/ui/icon";
import { IconOrder, IconArrowRight, IconTruck } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney, ORDER_STATUS_TR, statusTone } from "@/lib/utils";

export const metadata: Metadata = { title: "Siparişler", robots: { index: false } };

const TIMELINE = ["payment_pending", "paid", "processing", "shipped", "delivered", "completed"];

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, teams(name), children(first_name,last_name)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as unknown as {
    id: string; order_number: string; status: string; amount: number; currency: string;
    created_at: string; is_renewal: boolean;
    shipping_address_snapshot: Record<string, string | null> | null;
    teams: { name: string } | null;
    children: { first_name: string; last_name: string } | null;
  }[];

  return (
    <PanelBody>
      <PanelHeader title="Siparişler" subtitle={`${orders.length} sipariş`} action={{ href: "/basvuru", label: "Yeni sipariş" }} />

      {orders.length === 0 ? (
        <EmptyState
          icon={<Icon icon={IconOrder} size={26} />}
          title="Henüz siparişiniz yok"
          description="Kombine kart başvurusu yaptığınızda siparişleriniz burada listelenecek."
          action={<ButtonLink href="/basvuru" variant="green">Başvuru yap</ButtonLink>}
        />
      ) : (
        <div className="ct-stagger flex flex-col gap-5">
          {orders.map((o) => {
            const stepIndex = TIMELINE.indexOf(o.status);
            const cancelled = ["cancelled", "refunded"].includes(o.status);
            const addr = o.shipping_address_snapshot;

            return (
              <Card key={o.id} className="flex flex-col gap-5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[16px] font-bold">{o.order_number}</span>
                      {o.is_renewal && <Badge tone="lime">Yenileme</Badge>}
                      <Badge tone={statusTone(o.status)}>{ORDER_STATUS_TR[o.status] ?? o.status}</Badge>
                    </div>
                    <span className="text-[13.5px] text-muted">{formatDate(o.created_at, true)}</span>
                  </div>
                  <span className="font-display text-[22px] font-semibold tracking-[-.02em] text-green">
                    {formatMoney(o.amount, o.currency)}
                  </span>
                </div>

                <div className="grid gap-3 text-[13.5px] sm:grid-cols-3">
                  <Meta label="ÇOCUK" value={o.children ? `${o.children.first_name} ${o.children.last_name}` : "—"} />
                  <Meta label="TAKIM" value={o.teams?.name ?? "—"} />
                  <Meta label="TESLİMAT" value={addr ? `${addr.city ?? ""}${addr.district ? ` / ${addr.district}` : ""}` : "—"} />
                </div>

                {!cancelled && stepIndex >= 0 && (
                  <>
                    <Divider />
                    <ol className="flex flex-wrap gap-x-2 gap-y-3">
                      {TIMELINE.map((s, i) => {
                        const done = i <= stepIndex;
                        return (
                          <li key={s} className="flex flex-1 flex-col gap-2" style={{ minWidth: 90 }}>
                            <span className={`h-1.5 rounded-full transition-colors duration-500 ${done ? "bg-green" : "bg-chip"}`} />
                            <span className={`text-[11.5px] font-semibold ${done ? "text-ink" : "text-muted2"}`}>
                              {ORDER_STATUS_TR[s]}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </>
                )}

                <div className="flex flex-wrap items-center gap-4 border-t border-line2 pt-4">
                  {o.status === "payment_pending" && (
                    <Link href={`/basvuru/odeme/${o.order_number}`}
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-orange hover:underline">
                      Ödeme bilgilerini gör <Icon icon={IconArrowRight} size={15} />
                    </Link>
                  )}
                  {["shipped", "delivered"].includes(o.status) && (
                    <Link href="/panel/kartlarim"
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-green hover:underline">
                      <Icon icon={IconTruck} size={15} /> Kargo takibi
                    </Link>
                  )}
                  <Link href="/iptal-iade" className="text-[13.5px] text-muted hover:text-green">
                    İptal ve iade koşulları
                  </Link>
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
