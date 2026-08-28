"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyError, type ActionState } from "@/lib/actions/types";
import { sendWelcomeEmail } from "@/lib/actions/verify";

const emailSchema = z.string().trim().toLowerCase().email("Geçerli bir e-posta girin");
const passwordSchema = z.string().min(8, "Şifre en az 8 karakter olmalı");

async function siteUrl() {
  const h = await headers();
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host") ?? "localhost:3000"}`
  );
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({ email: emailSchema, password: z.string().min(1, "Şifre gerekli") })
    .safeParse({ email: formData.get("email"), password: formData.get("password") });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, message: friendlyError(error) };

  /* ┌─ GİRİŞTEN SONRA DOĞRU KAPIYA ⚠️ ──────────────────────────┐
     │ Herkes `/panel`e gönderiliyordu; kabuk oradan tekrar        │
     │ yönlendiriyordu. İki adım demek: bir anda panel iskeleti    │
     │ görünüp kayboluyordu.                                        │
     │                                                               │
     │ Durum burada okunup tek adımda doğru yere gidiliyor.         │
     └───────────────────────────────────────────────────────────────┘ */
  const { data: durum } = await supabase.rpc("my_setup_state");
  const d = durum as { complete?: boolean; has_paid?: boolean } | null;

  const next = String(formData.get("next") ?? "");
  revalidatePath("/", "layout");

  if (!d?.complete) redirect("/kurulum");
  if (!d.has_paid) redirect("/odeme-bekleniyor");

  redirect(next.startsWith("/") ? next : "/panel");
}

export async function signUp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      firstName: z.string().trim().min(2, "Adınızı girin").max(80),
      lastName: z.string().trim().min(2, "Soyadınızı girin").max(80),
      email: emailSchema,
      password: passwordSchema,
      terms: z.literal("on", { message: "Koşulları kabul etmelisiniz" }),
      kvkk: z.literal("on", { message: "KVKK metnini onaylamalısınız" }),
    })
    .safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      terms: formData.get("terms"),
      kvkk: formData.get("kvkk"),
    });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();

  // Supabase'in kendi doğrulama e-postası KULLANILMIYOR.
  // Doğrulama kendi servisimizden (ct-notify) kod ile yapılır.
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { first_name: parsed.data.firstName, last_name: parsed.data.lastName },
    },
  });

  if (error) return { ok: false, message: friendlyError(error) };

  /*
   * KAYIT SONRASI OTOMATİK GİRİŞ.
   *
   * Supabase e-posta onayı açıkken signUp oturum döndürmez; kullanıcı
   * ayrıca giriş yapmak zorunda kalıyordu. Oturum yoksa hemen giriş
   * denenir. Başarısız olursa kayıt yine geçerlidir, kullanıcı giriş
   * ekranına yönlendirilir.
   */
  if (!signUpData.session) {
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (signInErr) {
      console.error("[signup] otomatik giriş yapılamadı:", signInErr.message);
    }
  }

  // Hoş geldiniz e-postası kendi servisimizden gider; başarısız olursa kayıt yine geçerli
  try {
    await sendWelcomeEmail(parsed.data.email, parsed.data.firstName);
  } catch (err) {
    console.error("[signup] hoş geldiniz e-postası gönderilemedi:", (err as Error).message);
  }

  return {
    ok: true,
    message: "Hesabınız hazır. Hoş geldiniz!",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * NOT: Şifre sıfırlama artık kendi servisimizden yürüyor.
 * Bkz. lib/actions/verify.ts → startPasswordReset / completePasswordReset
 * Supabase'in resetPasswordForEmail çağrısı bilinçli olarak kaldırıldı.
 */

export async function updatePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({ password: passwordSchema, confirm: z.string() })
    .refine((d) => d.password === d.confirm, { message: "Şifreler eşleşmiyor", path: ["confirm"] })
    .safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, message: friendlyError(error) };

  return { ok: true, message: "Şifreniz güncellendi." };
}

/**
 * NOT: E-posta doğrulaması kendi servisimizden kod ile yapılır.
 * Bkz. lib/actions/verify.ts → startEmailVerification / confirmEmailVerification
 */

/*
 * `signInWithOAuth` KALDIRILDI.
 *
 * Kurulum zorunlu ve tek ekranda olduğu için sosyal giriş anlamsız
 * kalıyordu: kişi tek tıkla hesap açıyor ama veli adı, çocuk bilgisi
 * ve takım yine sorulmak zorundaydı. Tek yol e-posta ve şifre.
 */

/**
 * ═══════════════════════════════════════════════════════════════════
 *  TEK AKIŞ: HESAP + KURULUM + SİPARİŞ
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Üç ekran vardı: kayıt → kurulum → başvuru. Kullanıcı aralarında
 *  kayboluyor, ödemesiz ve çocuksuz hesaplar birikiyordu.
 *
 *  Artık tek gönderim:
 *    1. Auth hesabı açılır ve oturum başlatılır
 *    2. `complete_signup` profili, çocuğu ve SİPARİŞİ tek işlemde yazar
 *    3. Ödeme sayfasına gidilir
 *
 *  ┌─ HESAP AÇILDI AMA SİPARİŞ AÇILMADIYSA ⚠️ ────────────────────┐
 *  │ Auth hesabı Supabase'in sisteminde, sipariş bizim             │
 *  │ veritabanımızda — ikisi tek sarmala alınamıyor.                │
 *  │                                                                 │
 *  │ Bu durumda hesap silinmez (kullanıcı e-postasını yeniden       │
 *  │ kullanamaz hâle gelirdi); hata gösterilir ve kullanıcı aynı    │
 *  │ formu yeniden gönderebilir. `complete_signup` tekrar           │
 *  │ çağrılabilir olduğu için ikinci deneme temiz tamamlanır.       │
 *  └─────────────────────────────────────────────────────────────────┘
 */
export async function signUpAndSetup(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z.object({
    firstName: z.string().trim().min(2, "Adınızı girin").max(60),
    lastName: z.string().trim().min(2, "Soyadınızı girin").max(60),
    email: z.string().trim().email("Geçerli bir e-posta girin"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı").max(72),
    childFirstName: z.string().trim().min(2, "Çocuğun adını girin").max(60),
    childLastName: z.string().trim().min(2, "Çocuğun soyadını girin").max(60),
    childBirthDate: z.string().trim().min(8, "Doğum tarihini girin"),
    /* Zorunlu: kart tasarımı ve etkinlik gruplandırması buna bağlı. */
    gender: z.enum(["female", "male"], { message: "Cinsiyet seçin" }),
    teamId: z.string().uuid("Takım seçin"),
    cityId: z.string().trim().min(1, "Şehir seçin"),
    phone: z.string().trim().optional().default(""),
    /* ┌─ ŞİMDİLİK YALNIZCA HAVALE ⚠️ ──────────────────────────┐
       │ Ödemeler IBAN üzerinden alınıyor. Kart altyapısı kodda    │
       │ duruyor (silinmedi); açılacağı zaman bu kısıtı            │
       │ genişletmek yeterli.                                       │
       │                                                             │
       │ Varsayılan verilmesinin sebebi: form kart seçeneği         │
       │ göstermiyor, alan boş gelirse doğrulama patlardı.          │
       └─────────────────────────────────────────────────────────────┘ */
    paymentMethod: z.enum(["credit_card", "bank_transfer"]).default("bank_transfer"),
  }).safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    childFirstName: formData.get("childFirstName"),
    childLastName: formData.get("childLastName"),
    childBirthDate: formData.get("childBirthDate"),
    gender: formData.get("gender") || undefined,
    teamId: formData.get("teamId"),
    cityId: formData.get("cityId"),
    phone: formData.get("phone") ?? "",
    paymentMethod: formData.get("paymentMethod") ?? "bank_transfer",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const d = parsed.data;
  const supabase = await createClient();

  /* ── 1) Hesap ── */
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: { data: { first_name: d.firstName, last_name: d.lastName } },
  });

  if (signUpError) {
    /* E-posta zaten kayıtlıysa kullanıcıyı girişe yönlendirmek yerine
       aynı formdan devam ettiriyoruz: belki yarım kalmış bir kaydı var. */
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: d.email, password: d.password,
    });

    if (signInErr) {
      return {
        ok: false,
        message: /already|registered|exists/i.test(signUpError.message)
          ? "Bu e-posta zaten kayıtlı. Şifreniz doğruysa tekrar deneyin ya da giriş yapın."
          : friendlyError(signUpError),
      };
    }
  } else if (!signUpData.session) {
    /* E-posta onayı açıksa signUp oturum döndürmez; hemen giriş
       deniyoruz ki kullanıcı akışın ortasında kalmasın. */
    await supabase.auth.signInWithPassword({ email: d.email, password: d.password });
  }

  /* ── 2) Kurulum + sipariş (tek işlem) ── */
  const { data: sonuc, error: setupError } = await supabase.rpc("complete_signup", {
    p_data: {
      parent_first_name: d.firstName,
      parent_last_name: d.lastName,
      child_first_name: d.childFirstName,
      child_last_name: d.childLastName,
      child_birth_date: d.childBirthDate,
      gender: d.gender,
      team_id: d.teamId,
      city_id: Number(d.cityId),
      phone: d.phone || null,
      payment_method: d.paymentMethod,
    },
  });

  if (setupError) {
    /* Hesap açıldı ama kurulum tamamlanamadı. Hesabı SİLMİYORUZ:
       kullanıcı e-postasını yeniden kullanamaz hâle gelirdi. Aynı
       formu yeniden göndermesi yeterli. */
    return { ok: false, message: setupError.message };
  }

  const r = sonuc as { order_id?: string; order_number?: string } | null;

  try {
    /* Sipariş numarası e-postada geçsin: kullanıcı havale
       açıklamasına yazacak, sayfayı açmadan da elinde olsun. */
    await sendWelcomeEmail(d.email, d.firstName, r?.order_number);
  } catch (err) {
    console.error("[kayit] hoş geldiniz e-postası gönderilemedi:", (err as Error).message);
  }

  revalidatePath("/panel");

  /* ── 3) Ödeme AYNI SAYFADA ──
     Yönlendirme YOK. Sipariş bilgisi çağırana dönüyor; form ödeme
     bölümünü kendi içinde açıyor. Kullanıcı sayfa değiştirmeden kart
     bilgilerini giriyor ve sonucu aynı yerde görüyor. */
  /* Ödeme bekleniyor sayfasına: IBAN bilgileri ve dekont yükleme
     orada. Kayıt formunda ödeme adımı göstermek yerine tek bir
     yere toplandı — kullanıcı dekontu sonra da yükleyebilir. */
  redirect("/odeme-bekleniyor");
}
