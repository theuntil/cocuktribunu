"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyError, type ActionState } from "@/lib/actions/types";

/** Ödeme onayı — DB tarafında finance rolü ayrıca doğrulanır. */
export async function approvePayment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = z.string().uuid().safeParse(formData.get("paymentId"));
  if (!id.success) return { ok: false, message: "Ödeme bulunamadı." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("approve_payment", {
    p_payment_id: id.data,
    p_note: String(formData.get("note") ?? ""),
  });
  if (error) return { ok: false, message: friendlyError(error) };

  revalidatePath("/yonetim/odemeler");
  return { ok: true, message: "Ödeme onaylandı, kart hazırlığa alındı." };
}

export async function rejectPayment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({ paymentId: z.string().uuid(), reason: z.string().trim().min(3, "Gerekçe yazın") })
    .safeParse({ paymentId: formData.get("paymentId"), reason: formData.get("reason") });
  if (!parsed.success) return { ok: false, fieldErrors: { reason: "Red gerekçesi zorunludur" } };

  const supabase = await createClient();
  const { error } = await supabase.rpc("reject_payment", {
    p_payment_id: parsed.data.paymentId,
    p_reason: parsed.data.reason,
  });
  if (error) return { ok: false, message: friendlyError(error) };

  revalidatePath("/yonetim/odemeler");
  return { ok: true, message: "Ödeme reddedildi." };
}

export async function approveDonation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = z.string().uuid().safeParse(formData.get("donationId"));
  if (!id.success) return { ok: false, message: "Bağış bulunamadı." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("approve_donation", {
    p_donation_id: id.data,
    p_note: String(formData.get("note") ?? ""),
  });
  if (error) return { ok: false, message: friendlyError(error) };

  revalidatePath("/yonetim/bagislar");
  return { ok: true, message: "Bağış onaylandı." };
}

export async function rejectDonation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({ donationId: z.string().uuid(), reason: z.string().trim().min(3) })
    .safeParse({ donationId: formData.get("donationId"), reason: formData.get("reason") });
  if (!parsed.success) return { ok: false, fieldErrors: { reason: "Red gerekçesi zorunludur" } };

  const supabase = await createClient();
  const { error } = await supabase.rpc("reject_donation", {
    p_donation_id: parsed.data.donationId,
    p_reason: parsed.data.reason,
  });
  if (error) return { ok: false, message: friendlyError(error) };

  revalidatePath("/yonetim/bagislar");
  return { ok: true, message: "Bağış reddedildi." };
}

export async function updateCardStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      cardId: z.string().uuid(),
      status: z.enum(["processing", "ready", "shipped", "delivered", "active", "cancelled", "lost", "suspended", "expired"]),
      carrier: z.string().optional().nullable(),
      tracking: z.string().optional().nullable(),
    })
    .safeParse({
      cardId: formData.get("cardId"),
      status: formData.get("status"),
      carrier: formData.get("carrier") || null,
      tracking: formData.get("tracking") || null,
    });
  if (!parsed.success) return { ok: false, message: "Geçersiz durum bilgisi." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_card_status", {
    p_card_id: parsed.data.cardId,
    p_status: parsed.data.status,
    p_carrier: parsed.data.carrier,
    p_tracking: parsed.data.tracking,
  });
  if (error) return { ok: false, message: friendlyError(error) };

  revalidatePath("/yonetim/siparisler");
  return { ok: true, message: "Kart durumu güncellendi." };
}

/** Etkinlik girişinde kod okutma */
export async function checkIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const code = z.string().trim().min(4, "Kod girin").safeParse(formData.get("code"));
  if (!code.success) return { ok: false, fieldErrors: { code: "Giriş kodunu girin" } };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_in_registration", { p_code: code.data });
  if (error) return { ok: false, message: friendlyError(error) };

  const result = data as { ok: boolean; message: string; attendee?: Record<string, unknown>; event_title?: string };
  return { ok: result.ok, message: result.message, data: result as Record<string, unknown> };
}

export async function moderateDonationMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({ donationId: z.string().uuid(), approved: z.enum(["1", "0"]) })
    .safeParse({ donationId: formData.get("donationId"), approved: formData.get("approved") });
  if (!parsed.success) return { ok: false, message: "Kayıt bulunamadı." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("moderate_donation_message", {
    p_donation_id: parsed.data.donationId,
    p_approved: parsed.data.approved === "1",
  });
  if (error) return { ok: false, message: friendlyError(error) };

  revalidatePath("/yonetim/bagislar");
  return { ok: true, message: parsed.data.approved === "1" ? "Mesaj yayınlandı." : "Mesaj gizlendi." };
}
