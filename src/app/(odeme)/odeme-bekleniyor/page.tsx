import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Alert, Card } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconClock, IconCheck } from "@/components/ui/icons";
import { PaymentSection } from "@/components/panel/payment-section";
import { ScrollTop } from "@/components/ui/scroll-top";
import { createClient } from "@/lib/supabase/server";
import { getBankInfo } from "@/lib/data";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Ödeme bekleniyor", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * ÖDEME BEKLENİYOR
 *
 * ┌─ ÖDEME ONAYLANMADAN PANEL AÇILMAZ ⚠️ ────────────────────────┐
 * │ Kullanıcı kayıt olduktan sonra buraya gelir ve ödeme yönetici │
 * │ tarafından onaylanana kadar burada kalır. Araya girip panele  │
 * │ gitmeye çalışsa da kabuk onu geri gönderir.                    │
 * │                                                                 │
 * │ Sebep: kombine kart ödeme onaylandığı an oluşuyor. Onaysız    │
 * │ hesabın panelde görebileceği bir şey yok — boş bir panel      │
 * │ göstermek "kartım nerede?" sorusuna yol açardı.               │
 * └─────────────────────────────────────────────────────────────────┘
 */
export default async function Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/giris?devam=/odeme-bekleniyor");

  const { data: durum } = await supabase.rpc("my_setup_state");
  const d = durum as { complete?: boolean; has_order?: boolean; has_paid?: boolean } | null;

  /* Kurulum yarım kaldıysa önce o tamamlanmalı. */
  if (!d?.complete) redirect("/kurulum");

  /* Ödeme onaylandıysa burada işi yok. */
  if (d.has_paid) redirect("/panel");

  /* Bekleyen sipariş — en yenisi. */
  const { data: siparis } = await supabase
    .from("orders")
    .select("id, order_number, amount, currency, status, created_at")
    .in("status", ["payment_pending", "pending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const o = siparis as {
    id: string; order_number: string; amount: number;
    currency: string; status: string; created_at: string;
  } | null;

  /* ┌─ SONSUZ DÖNGÜ DÜZELTMESİ ⚠️ ──────────────────────────────┐
     │ Sipariş yoksa `/panel/kombine-kart/basvuru`'ya gönderiliyordu.│
     │ Ama panel kabuğu ödeme onaylanmadan içeri almıyor ve          │
     │ kullanıcıyı buraya geri atıyordu → SONSUZ DÖNGÜ.              │
     │                                                                 │
     │ Yönetici bir siparişi ve kartı silince tam olarak bu oluyor:  │
     │ kurulum tamam, sipariş yok, hiçbir sayfa duramıyor.           │
     │                                                                 │
     │ `/kurulum` sonlandırıcı: orada duruyor ve formu bilgiler dolu │
     │ olarak gösteriyor. Panel yolunu HİÇ kullanmıyoruz.            │
     └─────────────────────────────────────────────────────────────────┘ */
  if (!o) redirect("/kurulum");

  const [{ data: odeme }, bank] = await Promise.all([
    supabase
      .from("payments")
      .select("id, status, payment_method")
      .eq("order_id", o.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    getBankInfo(),
  ]);

  const p = odeme as { id: string; status: string; payment_method: string } | null;
  const inceleniyor = p?.status === "awaiting_review";

  return (
    <div className="ct-rise flex flex-col gap-7">
      <ScrollTop />
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-chip px-3.5 py-1.5 text-[12px] font-bold tracking-[.1em] text-muted2">
          <Icon icon={IconClock} size={13} /> ÖDEME BEKLENİYOR
        </span>

        <h1 className="ct-h2">
          {inceleniyor ? "Dekontunuz inceleniyor." : "Son adım: ödeme."}
        </h1>

        <p className="ct-lead max-w-[560px]">
          {inceleniyor
            ? "Dekontunuzu aldık. Ekibimiz genellikle 1 iş günü içinde onaylıyor; onaylandığında kombine kartınız oluşacak ve e-posta ile haber vereceğiz."
            : "Aşağıdaki hesaba havale/EFT yapıp dekontunuzu yükleyin. Ödemeniz onaylandığı an kombine kartınız oluşacak."}
        </p>
      </div>

      {inceleniyor && (
        <Alert tone="green" title="Dekont alındı">
          İnceleme tamamlanana kadar bu sayfada kalacaksınız. Onaydan sonra
          panelinize erişebileceksiniz.
        </Alert>
      )}

      {/* Sipariş özeti */}
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-bold tracking-[.1em] text-muted2">SİPARİŞ</span>
          <span className="font-mono text-[14px] font-semibold">{o.order_number}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[12px] text-muted">Tutar</span>
          <span className="font-display text-[22px] font-semibold tracking-[-.02em]">
            {formatMoney(o.amount, o.currency)}
          </span>
        </div>
      </Card>

      {/* IBAN + dekont yükleme — siparişlerim ekranındaki bileşenin aynısı */}
      <PaymentSection
        orderId={o.id}
        orderNumber={o.order_number}
        amount={formatMoney(o.amount, o.currency)}
        paymentId={p?.id ?? null}
        preferred="bank"
        reviewing={inceleniyor}
        bank={bank}
        /* ┌─ KART ŞİMDİLİK KAPALI ⚠️ ────────────────────────────┐
           │ Ödemeler havale ile alınıyor. Kart altyapısı yerinde   │
           │ duruyor (kod silinmedi); ileride açmak için bu değeri  │
           │ `true` yapmak ya da panelden kart ödemeyi etkinleş-    │
           │ tirmek yeterli.                                         │
           └────────────────────────────────────────────────────────┘ */
        cardEnabled={false}
      />

      <Card className="flex items-start gap-3.5 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chip text-muted">
          <Icon icon={IconCheck} size={16} />
        </span>
        <p className="text-[13.5px] leading-[1.6] text-muted">
          Açıklama alanına <strong className="text-ink2">{o.order_number}</strong> yazmayı
          unutmayın — ödemenizi bu numarayla eşleştiriyoruz. Onaylandığında
          e-posta göndereceğiz; bu sayfayı yenilemeniz yeterli.
        </p>
      </Card>
    </div>
  );
}
