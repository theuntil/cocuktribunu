"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, Button, Card, Field, Input, Select } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconGirl, IconBoy, IconUser, IconChild, IconFootball } from "@/components/ui/icons";
import { TeamPicker } from "@/components/ui/team-picker";
import { signUpAndSetup } from "@/lib/actions/auth";
import { IDLE } from "@/lib/actions/types";
import { useActionToast } from "@/components/ui/action-toast";
import { cn } from "@/lib/utils";

/**
 * ÜYE OL — TEK SAYFA, TEK GÖNDERİM
 *
 * ┌─ NEDEN HEPSİ BİR ARADA ───────────────────────────────────────┐
 * │ Üç ekran vardı: kayıt → kurulum → başvuru. Her geçiş bir       │
 * │ vazgeçme noktasıydı; ödemesiz ve çocuksuz hesaplar birikiyordu.│
 * │                                                                 │
 * │ Hepsi tek formda: hesap açılır, çocuk yazılır ve sipariş aynı  │
 * │ anda oluşur. Ödeme yapmadan kullanılır bir hesap kalmıyor.     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Bölümler numaralı ama ayrı adım değil — kullanıcı ne kadar
 * kaldığını görüyor, "sonraki" düğmesine basmıyor.
 */
export function SignupFlow({
  teams, cities, price, bankInfo,
}: {
  teams: { id: string; name: string; short_name?: string | null;
           logo_path?: string | null; city_name?: string | null }[];
  cities: { id: number; name: string }[];
  price: string;
  bankInfo?: { iban?: string | null; holder?: string | null } | null;
}) {
  const [state, action, pending] = useActionState(signUpAndSetup, IDLE);
  useActionToast(state, { hata: "Kayıt tamamlanamadı" });

  const [teamId, setTeamId] = React.useState("");
  const [cinsiyet, setCinsiyet] = React.useState<"female" | "male" | "">("");

  const bugun = new Date().toISOString().slice(0, 10);

  /* ┌─ İKİ AŞAMA, TEK SAYFA ⚠️ ─────────────────────────────────┐
     │ Kart bilgileri sipariş oluşmadan alınamaz: ödeme sağlayıcı │
     │ tutar ve sipariş kimliği istiyor. Bu yüzden akış ikiye     │
     │ ayrılıyor ama SAYFA DEĞİŞMİYOR — form yerini ödeme         │
     │ bölümüne bırakıyor.                                         │
     │                                                              │
     │ Yönlendirme olsaydı kullanıcı "kayıt oldum mu olmadım mı"   │
     │ belirsizliğinde kalırdı.                                     │
     └──────────────────────────────────────────────────────────────┘ */


  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="teamId" value={teamId} />
      {/* Ödeme yöntemi sabit: havale. Kart açılınca burası seçime döner. */}
      <input type="hidden" name="paymentMethod" value="bank_transfer" />

      {/* Girişi olan kullanıcı formu doldurmaya başlamadan görsün:
          en altta olması, doldurduktan sonra fark etmeye yol açıyordu. */}
      <div className="flex items-center justify-between gap-3 rounded-[14px] bg-field px-4 py-3">
        <span className="text-[13.5px] text-ink2">Zaten hesabınız var mı?</span>
        <Link href="/giris" className="text-[13.5px] font-semibold text-ink underline">
          Giriş yapın
        </Link>
      </div>

      {state.message && !state.ok && <Alert tone="danger">{state.message}</Alert>}

      {/* ── 1 · Hesap ── */}
      <Card className="flex flex-col gap-5 p-6 sm:p-7">
        <Baslik icon={IconUser} n={1} baslik="Hesabınız"
          aciklama="Kartın sorumlusu olarak sizin adınıza açılır." />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adınız" htmlFor="firstName" error={state.fieldErrors?.firstName}>
            <Input id="firstName" name="firstName" required autoFocus autoComplete="given-name" />
          </Field>
          <Field label="Soyadınız" htmlFor="lastName" error={state.fieldErrors?.lastName}>
            <Input id="lastName" name="lastName" required autoComplete="family-name" />
          </Field>
        </div>

        <Field label="E-posta" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Şifre" htmlFor="password" hint="en az 8 karakter"
            error={state.fieldErrors?.password}>
            <Input id="password" name="password" type="password" required
              minLength={8} autoComplete="new-password" />
          </Field>
          <Field label="Telefon" htmlFor="phone" hint="isteğe bağlı"
            error={state.fieldErrors?.phone}>
            <Input id="phone" name="phone" type="tel" autoComplete="tel"
              placeholder="05XX XXX XX XX" />
          </Field>
        </div>
      </Card>

      {/* ── 2 · Çocuk ── */}
      <Card className="flex flex-col gap-5 p-6 sm:p-7">
        <Baslik icon={IconChild} n={2} baslik="Çocuğunuz"
          aciklama="Kombine kart onun adına düzenlenir." />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adı" htmlFor="childFirstName" error={state.fieldErrors?.childFirstName}>
            <Input id="childFirstName" name="childFirstName" required />
          </Field>
          <Field label="Soyadı" htmlFor="childLastName" error={state.fieldErrors?.childLastName}>
            <Input id="childLastName" name="childLastName" required />
          </Field>
        </div>

        {/* ┌─ CİNSİYET ZORUNLU ⚠️ ────────────────────────────────┐
            │ Kart tasarımı ve etkinlik gruplandırması buna göre     │
            │ yapılıyor. Açılır liste yerine iki kutu: tek dokunuş,  │
            │ ne seçildiği bir bakışta görünüyor.                     │
            └────────────────────────────────────────────────────────┘ */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink2">Cinsiyeti</span>
          <div className="grid grid-cols-2 gap-3">
            {([
              { k: "female", l: "Kız", icon: IconGirl },
              { k: "male", l: "Erkek", icon: IconBoy },
            ] as const).map((o) => (
              <button key={o.k} type="button" onClick={() => setCinsiyet(o.k)}
                aria-pressed={cinsiyet === o.k}
                className={cn(
                  "flex items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-colors",
                  cinsiyet === o.k
                    ? "border-solid bg-solid text-on-solid"
                    : "border-line bg-surface hover:border-ink/25",
                )}>
                <span className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  cinsiyet === o.k ? "bg-on-solid/15" : "bg-chip text-ink2",
                )}>
                  <Icon icon={o.icon} size={17} />
                </span>
                <span className="text-[14.5px] font-semibold">{o.l}</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="gender" value={cinsiyet} />
          {state.fieldErrors?.gender && (
            <span className="text-[12.5px] font-medium text-danger">
              {state.fieldErrors.gender}
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Doğum tarihi" htmlFor="childBirthDate" hint="18 yaşından küçük olmalı"
            error={state.fieldErrors?.childBirthDate}>
            <input id="childBirthDate" name="childBirthDate" type="date" required max={bugun}
              className="h-[46px] w-full rounded-[12px] border border-line bg-field px-3.5 text-[15px] text-ink focus:border-green focus:outline-none" />
          </Field>
          <Field label="Şehir" htmlFor="cityId" error={state.fieldErrors?.cityId}>
            <Select id="cityId" name="cityId" required defaultValue="">
              <option value="" disabled>Şehir seçin…</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
        </div>
      </Card>

      {/* ── 3 · Takım ── */}
      <Card className="flex flex-col gap-5 p-6 sm:p-7">
        <Baslik icon={IconFootball} n={3} baslik="Takımı"
          aciklama="Kart bu takım adına düzenlenir; sonradan değiştirilebilir." />
        <TeamPicker teams={teams} label="Takım" required
          defaultValue="" onChange={setTeamId} error={state.fieldErrors?.teamId} />
      </Card>

      {/* ┌─ ÖDEME ADIMI BURADAN KALDIRILDI ⚠️ ──────────────────┐
          │ Ödemeler havale ile alınıyor ve dekont yükleme gerekiyor.│
          │ Bunu kayıt formuna sıkıştırmak formu uzatıyor, kullanıcı │
          │ da dekontu o an hazır bulundurmak zorunda kalıyordu.     │
          │                                                            │
          │ Kayıt bitince "Ödeme bekleniyor" sayfasına gidiliyor:     │
          │ IBAN orada, dekont istediği zaman yüklenebiliyor.         │
          └────────────────────────────────────────────────────────────┘ */}

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="lime" size="lg" loading={pending} className="w-full">
          Üyeliği tamamla
        </Button>

        <span className="text-center text-[12.5px] leading-[1.6] text-muted">
          Devam ederek{" "}
          <Link href="/kullanim-kosullari" className="font-semibold text-ink underline">
            kullanım koşullarını
          </Link>{" "}
          ve{" "}
          <Link href="/kvkk" className="font-semibold text-ink underline">
            aydınlatma metnini
          </Link>{" "}
          kabul etmiş olursunuz.
        </span>
      </div>
    </form>
  );
}


function Baslik({
  icon, n, baslik, aciklama,
}: {
  icon: Parameters<typeof Icon>[0]["icon"];
  n: number; baslik: string; aciklama: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-solid text-on-solid">
        <Icon icon={icon} size={19} />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[11px] font-bold tracking-[.12em] text-muted2">ADIM {n}</span>
        <span className="ct-h3">{baslik}</span>
        <span className="text-[13.5px] leading-[1.55] text-muted">{aciklama}</span>
      </div>
    </div>
  );
}

