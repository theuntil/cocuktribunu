"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, Button, Card, Checkbox, Field, Input, Select, Textarea } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconHeart, IconCheck, IconCopy, IconBank, IconArrowDown } from "@/components/ui/icons";
import { submitDonation } from "@/lib/actions/app";
import { IDLE } from "@/lib/actions/types";
import { formatMoney, cn } from "@/lib/utils";
import type { City } from "@/lib/types";

const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME ?? "Banka",
  holder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? "Çocuk Tribünü",
  iban: process.env.NEXT_PUBLIC_BANK_IBAN ?? "TR00 0000 0000 0000 0000 0000 00",
};

/**
 * Sadeleştirilmiş bağış formu.
 * Tek ekran: tutar → ad soyad → onay. Diğer her şey isteğe bağlı ve gizli.
 */
export function DonationForm({
  campaignSlug, cities, suggested = [100, 250, 500, 1000], minAmount = 10,
}: {
  campaignSlug?: string | null; cities: City[]; suggested?: number[]; minAmount?: number;
}) {
  const [state, action, pending] = useActionState(submitDonation, IDLE);
  const [amount, setAmount] = React.useState<number | "">(suggested[1] ?? 250);
  const [customMode, setCustomMode] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const customRef = React.useRef<HTMLInputElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (state.ok && state.data) {
    return <DonationSuccess data={state.data as never} />;
  }

  const pickPreset = (v: number) => { setCustomMode(false); setAmount(v); };
  const pickCustom = () => {
    setCustomMode(true);
    setAmount("");
    requestAnimationFrame(() => customRef.current?.focus());
  };

  return (
    <Card className="p-6 sm:p-8">
      <form action={action} className="flex flex-col gap-6">
        {campaignSlug && <input type="hidden" name="campaignSlug" value={campaignSlug} />}
        <input type="hidden" name="contactType" value="email" />

        <div className="flex flex-col gap-1">
          <span className="font-display text-[22px] font-semibold tracking-[-.02em]">Bağış yap</span>
          <span className="text-[13.5px] text-muted">Üyelik gerekmez · 30 saniye sürer</span>
        </div>

        {state.message && !state.ok && <Alert tone="danger">{state.message}</Alert>}

        {/* ── TUTAR: hazır tutarlar ve "diğer" aynı ızgarada ── */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-ink2">Tutar seçin</span>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {suggested.map((s) => (
              <button
                key={s} type="button" onClick={() => pickPreset(s)}
                className={cn(
                  "flex h-[52px] items-center justify-center rounded-[14px] border text-[15px] font-bold transition-all duration-150",
                  !customMode && amount === s
                    ? "border-green bg-green-soft text-green"
                    : "border-line bg-field text-ink2 hover:border-green",
                )}
              >
                {formatMoney(s)}
              </button>
            ))}

            {/* "Diğer": diğer kutularla aynı ölçüde; seçilince içine yazılır */}
            <div
              onClick={pickCustom}
              className={cn(
                "flex h-[52px] cursor-text items-center justify-center gap-0.5 overflow-hidden rounded-[14px] border px-2 transition-all duration-150",
                customMode ? "border-green bg-green-soft" : "border-line bg-field hover:border-green",
              )}
            >
              {customMode ? (
                <>
                  <span className="shrink-0 text-[15px] font-bold text-green">₺</span>
                  <input
                    ref={customRef}
                    name="amount" type="number" required min={minAmount} step="1" inputMode="numeric"
                    aria-label="Bağış tutarı"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full min-w-0 bg-transparent text-center text-[15px] font-bold text-green outline-none [appearance:textfield] placeholder:font-semibold placeholder:text-green/40"
                    placeholder="0"
                  />
                </>
              ) : (
                <span className="text-[15px] font-bold text-ink2">Diğer</span>
              )}
            </div>
          </div>

          {/* Hazır tutar seçiliyse değeri gizli alanla gönder */}
          {!customMode && <input type="hidden" name="amount" value={amount} />}

          {state.fieldErrors?.amount && (
            <span className="text-[12.5px] font-medium text-danger">{state.fieldErrors.amount}</span>
          )}
          <span className="text-[12.5px] text-muted">En az {formatMoney(minAmount)}</span>
        </div>

        {/* ── KİMLİK: yalnızca ad ve soyad zorunlu ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad" htmlFor="dFirstName" error={state.fieldErrors?.firstName}>
            <Input id="dFirstName" name="firstName" required maxLength={80} autoComplete="given-name" />
          </Field>
          <Field label="Soyad" htmlFor="dLastName" error={state.fieldErrors?.lastName}>
            <Input id="dLastName" name="lastName" required maxLength={80} autoComplete="family-name" />
          </Field>
        </div>

        {/* ── ONAYLAR ── */}
        <div className="flex flex-col gap-2.5">
          <Checkbox id="dkvkk" name="kvkk" required
            label={<><Link href="/kvkk" className="font-semibold text-green hover:underline">KVKK metnini</Link> ve{" "}
              <Link href="/uyelik-kosullari" className="font-semibold text-green hover:underline">koşulları</Link> okudum, kabul ediyorum.</>} />
          {/* Koşul onayı tek kutuya bağlandı; sunucuya iki alan da gönderilir */}
          <input type="hidden" name="terms" value="on" />
          {(state.fieldErrors?.kvkk || state.fieldErrors?.terms) && (
            <span className="text-[12.5px] font-medium text-danger">{state.fieldErrors?.kvkk ?? state.fieldErrors?.terms}</span>
          )}
        </div>

        {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} />}

        <Button type="submit" size="lg" variant="orange" loading={pending}>
          <Icon icon={IconHeart} size={18} />
          {typeof amount === "number" && amount > 0 ? `${formatMoney(amount)} bağış yap` : "Bağış yap"}
        </Button>

        {/* ── İSTEĞE BAĞLI ALANLAR: varsayılan olarak gizli ── */}
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center justify-center gap-2 text-[13.5px] font-semibold text-muted transition-colors hover:text-green"
        >
          Makbuz, mesaj ve görünürlük ayarları
          <Icon icon={IconArrowDown} size={15} className={cn("transition-transform duration-300", showMore && "rotate-180")} />
        </button>

        <div className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: showMore ? "1fr" : "0fr" }}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 border-t border-line2 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="E-posta" htmlFor="contact" hint="makbuz için" error={state.fieldErrors?.contact}>
                  <Input id="contact" name="contact" type="email" autoComplete="email" placeholder="ornek@eposta.com" />
                </Field>
                <Field label="Şehir" htmlFor="dCityId" hint="isteğe bağlı">
                  <Select id="dCityId" name="cityId" defaultValue="">
                    <option value="">Seçiniz</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </Field>
              </div>

              <Checkbox id="receipt" name="receipt"
                label="Makbuz gönderilmesi için e-posta adresimin saklanmasını onaylıyorum." />

              <Field label="Bağışçı duvarında görünüm" htmlFor="visibility">
                <Select id="visibility" name="visibility" defaultValue="initials">
                  <option value="initials">Baş harflerim görünsün (A*** Y***)</option>
                  <option value="public">Ad ve soyadım tam görünsün</option>
                  <option value="anonymous">İsimsiz kalmak istiyorum</option>
                </Select>
              </Field>

              <Field label="Mesajınız" htmlFor="message" hint="moderasyondan sonra yayınlanır" error={state.fieldErrors?.message}>
                <Textarea id="message" name="message" maxLength={500} placeholder="Çocuklara bir not bırakın…" />
              </Field>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}

function DonationSuccess({ data }: { data: { donation_number: string; access_token: string; amount: number; currency: string } }) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* yoksay */ }
  };

  return (
    <Card className="ct-scale flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-green">
          <Icon icon={IconCheck} size={30} />
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-display text-[24px] font-semibold tracking-[-.02em]">Bağış kaydınız oluşturuldu</span>
          <p className="text-[14.5px] leading-[1.6] text-ink2">
            Son adım: aşağıdaki hesaba <strong>{formatMoney(data.amount, data.currency)}</strong> havale/EFT yapın.
          </p>
        </div>
      </div>

      <Alert tone="orange" title="Açıklama alanına mutlaka yazın">
        <button type="button" onClick={() => copy(data.donation_number, "no")}
          className="mt-1 inline-flex items-center gap-2 rounded-[10px] bg-white/60 px-3 py-2 font-mono text-[15px] font-bold text-orange-ink">
          {data.donation_number}
          <Icon icon={copied === "no" ? IconCheck : IconCopy} size={15} />
        </button>
      </Alert>

      <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-field p-5">
        <span className="flex items-center gap-2 text-[12.5px] font-bold tracking-[.1em] text-muted2">
          <Icon icon={IconBank} size={16} /> HESAP BİLGİLERİ
        </span>
        <Row label="Banka" value={BANK.name} />
        <Row label="Alıcı" value={BANK.holder} />
        <div className="flex flex-col gap-1">
          <span className="text-[11.5px] font-bold tracking-[.08em] text-muted2">IBAN</span>
          <button type="button" onClick={() => copy(BANK.iban.replace(/\s/g, ""), "iban")}
            className="inline-flex items-center gap-2 self-start font-mono text-[15px] font-semibold text-ink">
            {BANK.iban}
            <Icon icon={copied === "iban" ? IconCheck : IconCopy} size={15} className="text-muted" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-[18px] border border-line2 bg-surface p-5">
        <span className="text-[13px] font-semibold text-ink">Sorgulama kodunuz</span>
        <p className="text-[13px] leading-[1.55] text-muted">
          Bu kodu saklayın; üye olmadan bağış durumunuzu sorgulamak için gerekli. Tekrar gösterilmez.
        </p>
        <button type="button" onClick={() => copy(data.access_token, "tk")}
          className="mt-1 inline-flex items-center gap-2 self-start rounded-[10px] bg-chip px-3 py-2 font-mono text-[12.5px] text-ink">
          {data.access_token}
          <Icon icon={copied === "tk" ? IconCheck : IconCopy} size={14} />
        </button>
        <Link href="/bagis/sorgula" className="mt-1 text-[13.5px] font-semibold text-green hover:underline">
          Bağış durumu sorgula →
        </Link>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[11.5px] font-bold tracking-[.08em] text-muted2">{label.toUpperCase()}</span>
      <span className="text-[14.5px] font-semibold text-ink">{value}</span>
    </div>
  );
}
