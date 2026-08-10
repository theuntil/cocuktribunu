import type { Metadata } from "next";
import Link from "next/link";
import { Badge, ButtonLink, Card, EmptyState } from "@/components/ui";
import { PanelBody, PanelHeader } from "@/components/panel/shell";
import { Icon } from "@/components/ui/icon";
import { IconHeart } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney, DONATION_STATUS_TR, statusTone } from "@/lib/utils";

export const metadata: Metadata = { title: "Bağışlarım", robots: { index: false } };

const VISIBILITY_TR: Record<string, string> = {
  public: "Adım tam görünüyor", initials: "Baş harflerim görünüyor", anonymous: "İsimsiz",
};

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select("*, donation_campaigns(title,slug)")
    .order("created_at", { ascending: false });

  const donations = (data ?? []) as unknown as {
    id: string; donation_number: string; amount: number; currency: string; status: string;
    created_at: string; paid_at: string | null; visibility: string; message: string | null;
    is_message_approved: boolean; rejection_reason: string | null;
    donation_campaigns: { title: string; slug: string } | null;
  }[];

  const total = donations.filter((d) => d.status === "paid").reduce((s, d) => s + Number(d.amount), 0);

  return (
    <PanelBody>
      <PanelHeader
        title="Bağışlarım"
        subtitle={total > 0 ? `Toplam ${formatMoney(total)} bağışta bulundunuz. Teşekkürler.` : "Bağış geçmişiniz"}
        action={{ href: "/bagis", label: "Bağış yap" }}
      />

      {donations.length === 0 ? (
        <EmptyState
          icon={<Icon icon={IconHeart} size={26} />}
          title="Henüz bağışınız yok"
          description="Bağışınızla imkânı olmayan bir çocuğa kombine kart hediye edebilirsiniz."
          action={<ButtonLink href="/bagis" variant="orange">Bağış yap</ButtonLink>}
        />
      ) : (
        <div className="ct-stagger flex flex-col gap-4">
          {donations.map((d) => (
            <Card key={d.id} className="flex flex-col gap-3 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[14.5px] font-bold">{d.donation_number}</span>
                    <Badge tone={statusTone(d.status)}>{DONATION_STATUS_TR[d.status] ?? d.status}</Badge>
                  </div>
                  <span className="text-[13px] text-muted">
                    {d.donation_campaigns ? (
                      <Link href={`/bagis/${d.donation_campaigns.slug}`} className="hover:text-green">
                        {d.donation_campaigns.title}
                      </Link>
                    ) : "Genel bağış"} · {formatDate(d.paid_at ?? d.created_at)}
                  </span>
                </div>
                <span className="text-[19px] font-bold text-orange">{formatMoney(d.amount, d.currency)}</span>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line2 pt-3 text-[13px] text-muted">
                <span>{VISIBILITY_TR[d.visibility] ?? d.visibility}</span>
                {d.message && (
                  <span>Mesaj: {d.is_message_approved ? "yayında" : "onay bekliyor"}</span>
                )}
              </div>

              {d.status === "pending" && (
                <p className="text-[13.5px] leading-[1.55] text-orange-ink">
                  Havale/EFT açıklamasına <strong>{d.donation_number}</strong> yazmayı unutmayın.
                </p>
              )}
              {d.rejection_reason && (
                <p className="text-[13.5px] text-danger">Reddedilme gerekçesi: {d.rejection_reason}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </PanelBody>
  );
}
