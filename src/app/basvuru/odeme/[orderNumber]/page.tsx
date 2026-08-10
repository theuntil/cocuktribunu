import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Alert, Badge, Card, Container, Divider, Section } from "@/components/ui";
import { PageHeader } from "@/components/site/page-header";
import { ReceiptUpload } from "@/components/site/receipt-upload";
import { BankDetails } from "@/components/site/bank-details";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data";
import { formatMoney, formatDate, ORDER_STATUS_TR, PAYMENT_STATUS_TR, statusTone } from "@/lib/utils";

export const metadata: Metadata = { title: "Ödeme", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/giris?devam=/basvuru/odeme/${orderNumber}`);

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, teams(name), children(first_name,last_name)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order) notFound();

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", (order as { id: string }).id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const o = order as unknown as {
    id: string; order_number: string; amount: number; currency: string; status: string;
    created_at: string; is_renewal: boolean;
    teams: { name: string } | null;
    children: { first_name: string; last_name: string } | null;
  };
  const p = payment as unknown as { id: string; status: string; rejection_reason: string | null } | null;

  const isPaid = p?.status === "paid";
  const isReviewing = p?.status === "awaiting_review";

  return (
    <>
      <PageHeader
        eyebrow="ÖDEME"
        title={isPaid ? "Ödemeniz onaylandı" : "Son adım: ödeme"}
        description={
          isPaid
            ? "Kartınız hazırlanmaya başlandı. Süreci panelinizden takip edebilirsiniz."
            : "Aşağıdaki hesaba havale/EFT yapın ve açıklama alanına sipariş numaranızı yazın."
        }
      />

      <Section className="!pt-10">
        <Container className="max-w-[760px]">
          <div className="flex flex-col gap-6">
            {/* Sipariş özeti */}
            <Card className="flex flex-col gap-4 p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[17px] font-bold">{o.order_number}</span>
                <div className="flex gap-2">
                  {o.is_renewal && <Badge tone="lime">Yenileme</Badge>}
                  <Badge tone={statusTone(o.status)}>{ORDER_STATUS_TR[o.status] ?? o.status}</Badge>
                </div>
              </div>
              <Divider />
              <div className="grid gap-3 sm:grid-cols-2">
                <Row label="Çocuk" value={o.children ? `${o.children.first_name} ${o.children.last_name}` : "—"} />
                <Row label="Takım" value={o.teams?.name ?? "—"} />
                <Row label="Sipariş tarihi" value={formatDate(o.created_at)} />
                <Row label="Ödeme durumu" value={p ? (PAYMENT_STATUS_TR[p.status] ?? p.status) : "—"} />
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] text-ink2">Tutar</span>
                <span className="font-display text-[28px] font-semibold tracking-[-.02em] text-green">
                  {formatMoney(o.amount, o.currency)}
                </span>
              </div>
            </Card>

            {isPaid ? (
              <Alert tone="green" title="Ödeme onaylandı">
                Kartınız hazırlanıyor. Kargoya verildiğinde takip numarasını{" "}
                <Link href="/panel/kartlarim" className="font-semibold underline">Kartlarım</Link> sayfasında göreceksiniz.
              </Alert>
            ) : (
              <>
                {p?.rejection_reason && (
                  <Alert tone="danger" title="Dekontunuz reddedildi">
                    {p.rejection_reason} — Lütfen doğru dekontu tekrar yükleyin.
                  </Alert>
                )}
                {isReviewing && (
                  <Alert tone="orange" title="Dekontunuz inceleniyor">
                    Ekibimiz genellikle 1 iş günü içinde onaylıyor. Sonuç panelinize bildirim olarak düşecek.
                  </Alert>
                )}

                <BankDetails reference={o.order_number} amount={formatMoney(o.amount, o.currency)} />

                {p && <ReceiptUpload paymentId={p.id} disabled={isReviewing} />}
              </>
            )}

            <div className="flex flex-wrap gap-3">
              <Link href="/panel/siparisler" className="text-[14px] font-semibold text-green hover:underline">
                Siparişlerim →
              </Link>
              <Link href="/iptal-iade" className="text-[14px] font-semibold text-muted hover:text-green">
                İptal ve iade koşulları
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11.5px] font-bold tracking-[.1em] text-muted2">{label.toUpperCase()}</span>
      <span className="text-[14.5px] font-semibold">{value}</span>
    </div>
  );
}
