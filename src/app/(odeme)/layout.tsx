import { Logo } from "@/components/site/nav";
import { ThemeToggle } from "@/components/site/theme";
import { signOut } from "@/lib/actions/auth";
import { getBranding } from "@/lib/branding";

/**
 * ÖDEME BEKLENİYOR — PANEL KABUĞUNUN DIŞINDA
 *
 * ┌─ NEDEN AYRI DÜZEN ⚠️ ─────────────────────────────────────────┐
 * │ Panel kabuğu "ödeme onaylanmadıysa buraya gönder" diyor. Bu    │
 * │ sayfa da o kabuğun içinde olsaydı kendi kendini tetikler ve    │
 * │ SONSUZ YÖNLENDİRME oluşurdu.                                    │
 * │                                                                 │
 * │ Kenar çubuğu da yok: ödeme onaylanmadan gezilecek bir sayfa    │
 * │ zaten yok, menü göstermek kullanıcıyı boşa yönlendirirdi.      │
 * └─────────────────────────────────────────────────────────────────┘
 */
export default async function OdemeLayout({ children }: { children: React.ReactNode }) {
  const branding = await getBranding();

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <header className="border-b border-line2">
        <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Logo contain size={branding.sizeHeader ?? 56}
            light={branding.logoLight} dark={branding.logoDark} />

          <div className="flex items-center gap-2">
            <ThemeToggle className="inline-flex" />
            {/* Çıkış: kullanıcı sıkışıp kalmasın, başka hesapla
                girebilsin ya da sonra dönebilsin. */}
            <form action={signOut}>
              <button type="submit"
                className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-[13px] font-semibold text-ink2 transition-colors hover:border-ink/30 hover:text-ink">
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}
