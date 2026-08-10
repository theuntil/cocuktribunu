import type { Metadata } from "next";
import { Badge, Card, EmptyState } from "@/components/ui";
import { DonationReviewRow } from "@/components/panel/admin-rows";
import { Icon } from "@/components/ui/icon";
import { IconCheck } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney, DONATION_STATUS_TR, statusTone } from "@/lib/utils";

export const metadata: Metadata = { title: "Bağış Onayları", robots: { index: false } };

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select("*, donation_campaigns(title)")
    .in("status", ["pending", "awaiting_review"])
    .order("created_at");

  const rows = (data ?? []) as unknown as {
    id: string; donation_number: string; amount: number; currency: string; status: string;
    created_at: string; donor_first_name: string; donor_last_name: string; message: string | null;
    donation_campaigns: { title: string } | null;
  }[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[28px] font-semibold tracking-[-.03em]">Bağış onayları</h1>
        <span className="text-[14px] text-muted">{rows.length} bekleyen bağış</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<Icon icon={IconCheck} size={26} />} title="Bekleyen bağış yok" />
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((d) => (
            <Card key={d.id} className="flex flex-col gap-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[15px] font-bold">{d.donation_number}</span>
                    <Badge tone={statusTone(d.status)}>{DONATION_STATUS_TR[d.status] ?? d.status}</Badge>
                  </div>
                  <span className="text-[13px] text-muted">
                    {d.donor_first_name} {d.donor_last_name}
                    {d.donation_campaigns ? ` · ${d.donation_campaigns.title}` : " · Genel bağış"} · {formatDate(d.created_at, true)}
                  </span>
                </div>
                <span className="text-[19px] font-bold text-orange">{formatMoney(d.amount, d.currency)}</span>
              </div>

              {d.message && (
                <p className="rounded-[12px] bg-chip px-4 py-3 text-[13.5px] leading-[1.55] text-ink2">
                  &ldquo;{d.message}&rdquo;
                </p>
              )}

              <DonationReviewRow donationId={d.id} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
