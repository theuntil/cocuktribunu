import Link from "next/link";
import { Logo } from "@/components/site/nav";
import { ThemeToggle } from "@/components/site/theme";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* Sol: form */}
      <div className="flex flex-col bg-page">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10">
          <Link href="/" aria-label="Anasayfa"><Logo /></Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <div className="ct-rise w-full max-w-[420px]">{children}</div>
        </div>
        <div className="px-6 py-6 text-center text-[12.5px] text-muted sm:px-10">
          © {new Date().getFullYear()} Çocuk Tribünü ·{" "}
          <Link href="/kvkk" className="hover:text-green">KVKK</Link> ·{" "}
          <Link href="/gizlilik" className="hover:text-green">Gizlilik</Link>
        </div>
      </div>

      {/* Sağ: görsel panel */}
      <div className="relative hidden overflow-hidden bg-deep p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-[.07]"
          style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--lime) 0, transparent 45%), radial-gradient(circle at 80% 70%, var(--green) 0, transparent 50%)" }} />
        <div className="relative">
          <span className="text-[11.5px] font-bold tracking-[.14em] text-deep-muted">ÇOCUK TRİBÜNÜ</span>
        </div>
        <div className="relative flex flex-col gap-6">
          <blockquote className="font-display text-[38px] leading-[1.15] font-semibold tracking-[-.03em] text-deep-ink">
            &ldquo;İlk maçımı babamla değil,<br />gönüllüyle izledim.&rdquo;
          </blockquote>
          <p className="max-w-[420px] text-[15px] leading-[1.65] text-on-dark">
            Çocukların tribünde güvende olduğu bir futbol kültürü için çalışan bağımsız taraftar inisiyatifi.
          </p>
          <div className="flex gap-8 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-1">
              <span className="font-display text-[26px] font-semibold text-lime">81</span>
              <span className="text-[12.5px] text-deep-muted">şehir</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-display text-[26px] font-semibold text-lime">190₺</span>
              <span className="text-[12.5px] text-deep-muted">yıllık kombine</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-display text-[26px] font-semibold text-lime">0₺</span>
              <span className="text-[12.5px] text-deep-muted">imza için ücret</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
