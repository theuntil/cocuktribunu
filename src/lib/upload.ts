"use client";

import { uploadToStorage } from "@/lib/storage/client";
import { createClient } from "@/lib/supabase/client";

/**
 * Çocuk fotoğrafını ÖZEL kovaya yükler ve depolama yolunu döndürür.
 *
 * child-photos kovası herkese açık değildir: fotoğrafı yalnızca çocuğun
 * velisi ve yetkili personel görebilir. Adres tahmin edilse bile açılamaz.
 */
export async function uploadChildPhoto(childId: string, blob: Blob): Promise<string> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Oturum bulunamadı");

  // Yol biçimi veritabanı trigger'ı ile doğrulanır: {uid}/children/{dosya}
  const path = `${auth.user.id}/children/${childId}-${Date.now()}.jpg`;

  const res = await uploadToStorage({
    bucket: "child-photos",
    path: path,
    file: blob,
    contentType: "image/jpeg",
  });

  if (!res.ok) throw new Error(res.error);

  return path;
}

/** Kullanıcının kendi profil fotoğrafını yükler. */
export async function uploadProfileAvatar(blob: Blob): Promise<string> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Oturum bulunamadı");

  const path = `${auth.user.id}/avatar-${Date.now()}.jpg`;

  const res = await uploadToStorage({
    bucket: "avatars",
    path: path,
    file: blob,
    contentType: "image/jpeg",
  });

  if (!res.ok) throw new Error(res.error);

  return path;
}
