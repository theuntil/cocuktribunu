import Link from "next/link";
import { Logo } from "@/components/site/nav";
import { ThemeToggle } from "@/components/site/theme";
import { getBranding } from "@/lib/branding";

/**
 * KAYIT DÜZENİ — TAM GENİŞLİK
 *
 * ┌─ NEDEN GİRİŞTEN AYRI DÜZEN ───────────────────────────────────┐
 * │ Giriş ekranı iki sütunlu: solda form, sağda görsel panel.      │
 * │ Kayıt formu artık dört bölümlü (hesap, çocuk, takım, ödeme) —  │
 * │ ekranın yarısına sıkıştırılınca alanlar daralıyor ve sayfa     │
 * │ gereksiz uzuyordu.                                              │
 * │                                                                 │
 * │ Kayıt kendi düzenini kullanıyor: görsel panel yok, içerik       │
 * │ ortada ve geniş. Görsel panel yalnızca girişte kalıyor.        │
 * └─────────────────────────────────────────────────────────────────┘
 */
export default async function SignupLayout({ children }: { children: React.ReactNode }) {
  const branding = await getBranding();

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" aria-label="Anasayfa">
          <Logo size={branding.sizePanel} light={branding.logoLight} dark={branding.logoDark} />
        </Link>
        <ThemeToggle className="inline-flex" />
      </header>

      <main className="flex flex-1 justify-center px-5 pb-12 sm:px-8">
        <div className="ct-rise w-full max-w-[680px]">{children}</div>
      </main>

      <footer className="px-5 py-6 text-center text-[12.5px] text-muted sm:px-10">
        © {new Date().getFullYear()} Çocuk Tribünü ·{" "}
        <Link href="/kvkk" className="hover:text-ink">KVKK</Link> ·{" "}
        <Link href="/gizlilik" className="hover:text-ink">Gizlilik</Link>
      </footer>
    </div>
  );
}
