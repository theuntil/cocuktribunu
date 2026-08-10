"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyError, type ActionState } from "@/lib/actions/types";

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

  const next = String(formData.get("next") ?? "/panel");
  revalidatePath("/", "layout");
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
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${await siteUrl()}/api/auth/callback`,
      data: { first_name: parsed.data.firstName, last_name: parsed.data.lastName },
    },
  });

  if (error) return { ok: false, message: friendlyError(error) };

  return {
    ok: true,
    message: "Hesabınız oluşturuldu. E-postanıza gönderdiğimiz doğrulama bağlantısına tıklayabilirsiniz — doğrulama zorunlu değil, hemen giriş yapabilirsiniz.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { ok: false, fieldErrors: { email: "Geçerli bir e-posta girin" } };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await siteUrl()}/api/auth/callback?next=/sifre-yenile`,
  });

  // Hesabın var olup olmadığını sızdırmamak için her durumda aynı mesaj döner.
  return { ok: true, message: "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi." };
}

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

export async function resendVerification(): Promise<ActionState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) return { ok: false, message: "Oturum bulunamadı." };

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: data.user.email,
    options: { emailRedirectTo: `${await siteUrl()}/api/auth/callback` },
  });
  if (error) return { ok: false, message: friendlyError(error) };
  return { ok: true, message: "Doğrulama e-postası tekrar gönderildi." };
}

export async function signInWithOAuth(provider: "google" | "apple", next?: string) {
  const supabase = await createClient();

  // Açık yönlendirme koruması: yalnızca site içi yollara izin ver
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/panel";
  const callback = `${await siteUrl()}/api/auth/callback?next=${encodeURIComponent(safeNext)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callback,
      queryParams: provider === "google"
        // Google: hesap seçtir ve e-posta/profil izni iste
        ? { access_type: "offline", prompt: "select_account" }
        : undefined,
    },
  });

  if (error || !data.url) {
    // Supabase tarafında sağlayıcı etkin değilse gelen hata teknik olur;
    // kullanıcıya ne yapması gerektiğini söyleyen bir mesaja çeviriyoruz.
    const raw = error?.message ?? "";
    const message = raw.includes("not enabled") || raw.includes("Unsupported provider")
      ? `${provider === "google" ? "Google" : "Apple"} ile giriş şu an kullanılamıyor. Lütfen e-posta ile giriş yapın.`
      : friendlyError(error);
    redirect(`/giris?hata=${encodeURIComponent(message)}`);
  }

  redirect(data.url);
}
