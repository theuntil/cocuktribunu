import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupFlow } from "@/components/site/signup-flow";
import { createClient } from "@/lib/supabase/server";
import { getCities, getTeams, getActivePlan, getBankInfo } from "@/lib/data";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Üye Ol", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * ÜYE OL — TEK SAYFA
 *
 * ┌─ ÜÇ EKRAN BİRLEŞTİ ⚠️ ────────────────────────────────────────┐
 * │ Önce: kayıt (ad, e-posta, şifre) → kurulum (çocuk, takım) →   │
 * │ başvuru (ödeme). İki geçiş, iki vazgeçme noktası.              │
 * │                                                                 │
 * │ Şimdi tek gönderim: hesap açılır, çocuk yazılır ve sipariş     │
 * │ aynı anda oluşur. Ödeme yapmadan kullanılır bir hesap kalmıyor.│
 * └─────────────────────────────────────────────────────────────────┘
 */
export default async function Page() {
  /* Zaten girişliyse burada işi yok: ya panele ya kurulum
     tamamlamaya gitsin. */
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (auth.user) {
    const { data: durum } = await supabase.rpc("my_setup_state");
    const d = durum as { complete?: boolean; has_order?: boolean; has_paid?: boolean } | null;

    if (!d?.complete) redirect("/kurulum");
    redirect(d.has_paid ? "/panel" : "/odeme-bekleniyor");
  }

  const [teams, cities, plan, bank] = await Promise.all([
    getTeams(), getCities(), getActivePlan(), getBankInfo(),
  ]);

  const price = plan ? formatMoney(plan.price, plan.currency) : "—";

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        {/* Giriş bağlantısı EN ÜSTTE: hesabı olan kullanıcı formun
            tamamını okuyup en alta inmek zorunda kalmasın. */}

        <h1 className="ct-h2 mt-2">Aramıza katılın.</h1>
        <p className="text-[15px] leading-[1.6] text-ink2">
          Hesap, çocuk bilgileri ve ödeme — hepsi tek adımda.
          Bir dakikadan kısa sürer.
        </p>
      </div>

      <SignupFlow
        teams={teams}
        cities={cities}
        price={price}
        bankInfo={bank ? { iban: bank.iban, holder: bank.holder } : null}
      />
    </div>
  );
}
