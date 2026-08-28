"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Checkbox, Field, Input, Divider } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconMail, IconCheck, IconAlert } from "@/components/ui/icons";
import { signIn, signUp } from "@/lib/actions/auth";
import { IDLE } from "@/lib/actions/types";
import { useActionToast } from "@/components/ui/action-toast";

/**
 * bir sağlayıcıya tıklanıp "provider is not enabled" hatası alınmaz.
 */

/*
 * ┌─ GOOGLE / APPLE GİRİŞİ KALDIRILDI ⚠️ ─────────────────────────┐
 * │ Kurulum artık zorunlu ve tek ekranda: veli adı, çocuk adı,     │
 * │ takım, şehir birlikte alınıyor.                                 │
 * │                                                                  │
 * │ Sosyal giriş bu akışla çelişiyordu: kişi tek tıkla hesap        │
 * │ açıyor ama hiçbir bilgi gelmiyor, yine kurulum ekranına         │
 * │ düşüyordu. İki farklı yol aynı yere çıkıyor, biri fazladan      │
 * │ adım ekliyordu.                                                  │
 * │                                                                  │
 * │ Tek yol: e-posta ve şifre.                                       │
 * └──────────────────────────────────────────────────────────────────┘
 */

export function SignInForm() {
  const params = useSearchParams();
  const next = params.get("devam") ?? "/panel";
  const urlError = params.get("hata");
  const [state, action, pending] = useActionState(signIn, IDLE);
  useActionToast(state);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] font-semibold tracking-[-.03em]">Tekrar hoş geldiniz</h1>
        <p className="text-[14.5px] text-ink2">Panelinize giriş yapın.</p>
      </div>

      {(state.message || urlError) && (
        <Alert tone="danger"><span className="flex items-start gap-2"><Icon icon={IconAlert} size={16} className="mt-[2px] shrink-0" />{state.message ?? urlError}</span></Alert>
      )}

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <Field label="E-posta" htmlFor="email" error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="ornek@eposta.com" />
        </Field>
        <Field label="Şifre" htmlFor="password" error={state.fieldErrors?.password}>
          <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </Field>
        <div className="flex justify-end">
          <Link href="/sifremi-unuttum" className="text-[13.5px] font-semibold text-ink underline decoration-accent-line decoration-2 underline-offset-4 hover:decoration-[3px]">Şifremi unuttum</Link>
        </div>
        <Button type="submit" size="lg" loading={pending}>Giriş yap</Button>
      </form>

      <p className="text-center text-[14px] text-ink2">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-ink underline decoration-accent-line decoration-2 underline-offset-4 hover:decoration-[3px]">Kayıt olun</Link>
      </p>
    </div>
  );
}

/*
 * `SignUpForm` KALDIRILDI.
 *
 * Kayıt artık tek sayfada: hesap, çocuk, takım ve ödeme birlikte
 * alınıyor (`SignupFlow`). Ad, soyad, e-posta ve şifre alanları o
 * formun ilk bölümü. İki ayrı ekran olması, kullanıcıyı aynı akış
 * içinde iki kez form doldurmaya zorluyordu.
 */

/* ForgotPasswordForm ve ResetPasswordForm kaldırıldı.
   Şifre sıfırlama artık kendi servisimizden kod ile yapılıyor:
   components/site/password-reset.tsx */
