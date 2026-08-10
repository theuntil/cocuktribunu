import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { getCurrentUser } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <SiteNav isLoggedIn={Boolean(user)} />
      <main id="icerik" className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
