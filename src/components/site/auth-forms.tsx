"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Checkbox, Field, Input, Divider } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconMail, IconAlert, IconCheck } from "@/components/ui/icons";
import { signIn, signUp, requestPasswordReset, updatePassword, signInWithOAuth } from "@/lib/actions/auth";
import { IDLE } from "@/lib/actions/types";

/**
 * OAuth düğmeleri yalnızca NEXT_PUBLIC_OAUTH_PROVIDERS içinde listelenen
 * sağlayıcılar için gösterilir. Böylece Supabase tarafında etkinleştirilmemiş
 * bir sağlayıcıya tıklanıp "provider is not enabled" hatası alınmaz.
 */
const ENABLED_PROVIDERS = (process.env.NEXT_PUBLIC_OAUTH_PROVIDERS ?? "")
  .split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);

function OAuthButtons({ next }: { next?: string }) {
  const google = ENABLED_PROVIDERS.includes("google");
  const apple = ENABLED_PROVIDERS.includes("apple");
  if (!google && !apple) return null;

  return (
    <div className={`grid gap-2.5 ${google && apple ? "sm:grid-cols-2" : ""}`}>
      {google && <button
          type="button"
          onClick={() => { void signInWithOAuth("google", next); }}
          className="inline-flex items-center justify-center gap-2.5 rounded-full border border-line bg-surface px-5 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-green"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
          </svg>
          Google
        </button>}
      {apple && <button
        type="button"
        onClick={() => { void signInWithOAuth("apple", next); }}
        className="inline-flex items-center justify-center gap-2.5 rounded-full border border-line bg-surface px-5 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-green"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16.36 12.79c.02 2.4 2.1 3.2 2.13 3.21-.02.06-.33 1.14-1.1 2.26-.66.97-1.35 1.93-2.44 1.95-1.07.02-1.41-.63-2.63-.63s-1.6.61-2.61.65c-1.05.04-1.85-1.05-2.51-2.01-1.36-1.97-2.4-5.57-1-8 .69-1.2 1.93-1.97 3.28-1.99 1.03-.02 2 .69 2.63.69.63 0 1.81-.86 3.05-.73.52.02 1.98.21 2.92 1.58-.08.05-1.74 1.02-1.72 3.02M14.4 4.9c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.82-.46 2.38-1.14" />
        </svg>
        Apple
      </button>}
    </div>
  );
}

/** Sağlayıcı bölümü tamamen kapalıysa ayırıcıyı da gösterme */
function OAuthDivider() {
  if (ENABLED_PROVIDERS.length === 0) return null;
  return (
    <div className="flex items-center gap-3">
      <Divider className="flex-1" />
      <span className="text-[12.5px] text-muted2">veya e-posta ile</span>
      <Divider className="flex-1" />
    </div>
  );
}

export function SignInForm() {
  const params = useSearchParams();
  const next = params.get("devam") ?? "/panel";
  const urlError = params.get("hata");
  const [state, action, pending] = useActionState(signIn, IDLE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-semibold tracking-[-.03em]">Tekrar hoş geldiniz</h1>
        <p className="text-[14.5px] text-ink2">Panelinize giriş yapın.</p>
      </div>

      {(state.message || urlError) && (
        <Alert tone="danger"><span className="flex items-start gap-2"><Icon icon={IconAlert} size={16} className="mt-[2px] shrink-0" />{state.message ?? urlError}</span></Alert>
      )}

      <OAuthButtons next={next} />

      <OAuthDivider />

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <Field label="E-posta" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="ornek@eposta.com" />
        </Field>
        <Field label="Şifre" htmlFor="password" error={state.fieldErrors?.password}>
          <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </Field>
        <div className="flex justify-end">
          <Link href="/sifremi-unuttum" className="text-[13.5px] font-semibold text-green hover:underline">Şifremi unuttum</Link>
        </div>
        <Button type="submit" size="lg" loading={pending}>Giriş yap</Button>
      </form>

      <p className="text-center text-[14px] text-ink2">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-green hover:underline">Kayıt olun</Link>
      </p>
    </div>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, IDLE);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-soft text-green">
          <Icon icon={IconMail} size={26} />
        </span>
        <h1 className="font-display text-[26px] font-semibold tracking-[-.02em]">Hesabınız hazır</h1>
        <p className="text-[14.5px] leading-[1.6] text-ink2">{state.message}</p>
        <Link href="/giris" className="w-full"><Button size="lg" className="w-full">Giriş yap</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-semibold tracking-[-.03em]">Aramıza katılın</h1>
        <p className="text-[14.5px] text-ink2">Kombine kart başvurusu için önce hesap oluşturun.</p>
      </div>

      {state.message && !state.ok && <Alert tone="danger">{state.message}</Alert>}

      <OAuthButtons />

      <OAuthDivider />

      <form action={action} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad" htmlFor="firstName" error={state.fieldErrors?.firstName}>
            <Input id="firstName" name="firstName" autoComplete="given-name" required />
          </Field>
          <Field label="Soyad" htmlFor="lastName" error={state.fieldErrors?.lastName}>
            <Input id="lastName" name="lastName" autoComplete="family-name" required />
          </Field>
        </div>
        <Field label="E-posta" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Şifre" htmlFor="password" hint="en az 8 karakter" error={state.fieldErrors?.password}>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
        </Field>

        <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-surface p-4">
          <Checkbox id="terms" name="terms" required
            label={<><Link href="/uyelik-kosullari" className="font-semibold text-green hover:underline">Üyelik koşullarını</Link> okudum, kabul ediyorum.</>} />
          <Checkbox id="kvkk" name="kvkk" required
            label={<><Link href="/kvkk" className="font-semibold text-green hover:underline">KVKK aydınlatma metnini</Link> okudum.</>} />
        </div>
        {(state.fieldErrors?.terms || state.fieldErrors?.kvkk) && (
          <span className="text-[12.5px] font-medium text-danger">{state.fieldErrors?.terms ?? state.fieldErrors?.kvkk}</span>
        )}

        <Button type="submit" size="lg" loading={pending}>Hesap oluştur</Button>
      </form>

      <p className="text-center text-[14px] text-ink2">
        Zaten üye misiniz? <Link href="/giris" className="font-semibold text-green hover:underline">Giriş yapın</Link>
      </p>
    </div>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, IDLE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-semibold tracking-[-.03em]">Şifremi unuttum</h1>
        <p className="text-[14.5px] leading-[1.6] text-ink2">
          E-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      {state.message && <Alert tone={state.ok ? "green" : "danger"}>{state.message}</Alert>}

      <form action={action} className="flex flex-col gap-4">
        <Field label="E-posta" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Button type="submit" size="lg" loading={pending}>Bağlantı gönder</Button>
      </form>

      <Link href="/giris" className="text-center text-[14px] font-semibold text-green hover:underline">Girişe dön</Link>
    </div>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, IDLE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-semibold tracking-[-.03em]">Yeni şifre belirleyin</h1>
        <p className="text-[14.5px] text-ink2">Hesabınız için yeni bir şifre oluşturun.</p>
      </div>

      {state.message && (
        <Alert tone={state.ok ? "green" : "danger"}>
          <span className="flex items-start gap-2">
            {state.ok && <Icon icon={IconCheck} size={16} className="mt-[2px] shrink-0" />}
            {state.message}
          </span>
        </Alert>
      )}

      {state.ok ? (
        <Link href="/panel"><Button size="lg" className="w-full">Panele git</Button></Link>
      ) : (
        <form action={action} className="flex flex-col gap-4">
          <Field label="Yeni şifre" htmlFor="password" hint="en az 8 karakter" error={state.fieldErrors?.password}>
            <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
          </Field>
          <Field label="Yeni şifre (tekrar)" htmlFor="confirm" error={state.fieldErrors?.confirm}>
            <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
          </Field>
          <Button type="submit" size="lg" loading={pending}>Şifreyi güncelle</Button>
        </form>
      )}
    </div>
  );
}
