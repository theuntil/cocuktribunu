import type { Metadata } from "next";
import Link from "next/link";
import { Alert, Badge, Card, EmptyState } from "@/components/ui";
import { PanelBody, PanelHeader } from "@/components/panel/shell";
import { Icon } from "@/components/ui/icon";
import { IconMoney } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney, PAYMENT_STATUS_TR, statusTone } from "@/lib/utils";

export const metadata: Metadata = { title: "Ödemeler", robots: { index: false } };

const METHOD_TR: Record<string, string> = {
  bank_transfer: "Havale / EFT", credit_card: "Kredi kartı", debit_card: "Banka kartı",
  wallet: "Cüzdan", cash: "Nakit", other: "Diğer",
};

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("*, orders(order_number)")
    .order("created_at", { ascending: false });

  const payments = (data ?? []) as unknown as {
    id: string; amount: number; currency: string; status: string; payment_method: string;
    created_at: string; paid_at: string | null; rejection_reason: string | null;
    orders: { order_number: string } | null;
  }[];

  const total = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <PanelBody>
      <PanelHeader title="Ödemeler" subtitle={`${payments.length} kayıt · toplam ${formatMoney(total)} onaylı ödeme`} />

      {payments.length === 0 ? (
        <EmptyState icon={<Icon icon={IconMoney} size={26} />} title="Henüz ödeme kaydınız yok" />
      ) : (
        <Card className="ct-fade divide-y divide-line2 overflow-hidden">
          {payments.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {p.orders?.order_number && (
                      <Link href={`/basvuru/odeme/${p.orders.order_number}`} className="font-mono text-[14.5px] font-bold hover:text-green">
                        {p.orders.order_number}
                      </Link>
                    )}
                    <Badge tone={statusTone(p.status)}>{PAYMENT_STATUS_TR[p.status] ?? p.status}</Badge>
                  </div>
                  <span className="text-[13px] text-muted">
                    {METHOD_TR[p.payment_method] ?? p.payment_method} · {formatDate(p.paid_at ?? p.created_at, true)}
                  </span>
                </div>
                <span className="text-[17px] font-bold">{formatMoney(p.amount, p.currency)}</span>
              </div>

              {p.rejection_reason && (
                <Alert tone="danger" title="Reddedilme gerekçesi">{p.rejection_reason}</Alert>
              )}
              {p.status === "pending" && p.orders?.order_number && (
                <Link href={`/basvuru/odeme/${p.orders.order_number}`}
                  className="self-start text-[13.5px] font-semibold text-orange hover:underline">
                  Havale bilgilerini gör ve dekont yükle →
                </Link>
              )}
            </div>
          ))}
        </Card>
      )}
    </PanelBody>
  );
}
