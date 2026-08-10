import type { Metadata } from "next";
import Link from "next/link";
import { Card, Divider } from "@/components/ui";
import { PanelBody, PanelHeader } from "@/components/panel/shell";
import { ProfileForm, DangerZone } from "@/components/panel/settings-forms";
import { createClient } from "@/lib/supabase/server";
import { getCities } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Hesap Ayarları", robots: { index: false } };

export default async function Page() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const [{ data: profile }, cities] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", auth.user!.id).maybeSingle(),
    getCities(),
  ]);

  const p = (profile ?? {}) as unknown as {
    first_name: string | null; last_name: string | null; username: string | null;
    city_id: number | null; consent_marketing: boolean; created_at: string; avatar_path: string | null;
    purge_after: string | null; deletion_requested_at: string | null;
  };

  return (
    <PanelBody>
      <PanelHeader title="Hesap ayarları" subtitle={`Üyelik başlangıcı: ${formatDate(p.created_at)}`} />

      <ProfileForm profile={p} cities={cities} email={auth.user?.email ?? ""} />

      <Card className="flex flex-col gap-4 p-6 sm:p-7">
        <span className="font-display text-[19px] font-semibold tracking-[-.02em]">Güvenlik</span>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[14.5px] font-semibold">Şifre</span>
            <span className="text-[13.5px] text-muted">Şifrenizi e-posta doğrulamasıyla değiştirebilirsiniz.</span>
          </div>
          <Link href="/sifremi-unuttum" className="text-[14px] font-semibold text-green hover:underline">
            Şifre değiştir →
          </Link>
        </div>
        <Divider />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[14.5px] font-semibold">Verileriniz</span>
            <span className="text-[13.5px] text-muted">Hangi verileri sakladığımızı ve nedenini okuyun.</span>
          </div>
          <Link href="/kvkk" className="text-[14px] font-semibold text-green hover:underline">
            KVKK metni →
          </Link>
        </div>
      </Card>

      <DangerZone purgeAfter={p.purge_after} requestedAt={p.deletion_requested_at} />
    </PanelBody>
  );
}
