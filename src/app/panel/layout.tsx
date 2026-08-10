import { redirect } from "next/navigation";
import { PanelSidebar } from "@/components/panel/sidebar";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, ensureProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?devam=/panel");

  // Profil satırı yoksa RLS tüm yazma işlemlerini reddeder ("yetkiniz yok" hatası).
  // Bu çağrı eksik profili sessizce oluşturur.
  await ensureProfile();

  let unread = 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .is("read_at", null);
    unread = count ?? 0;
  } catch { /* bildirim sayısı kritik değil */ }

  return (
    <div className="flex min-h-dvh flex-col bg-page lg:flex-row">
      <PanelSidebar unread={unread} />
      <main id="icerik" className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
