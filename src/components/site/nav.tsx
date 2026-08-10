"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { IconMenu, IconClose, IconUser } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/site/theme";
import { buttonClass } from "@/components/ui";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/imza-kampanyasi", label: "İmza Kampanyası" },
  { href: "/kombine-kart", label: "Kombine Kart" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/fifa-2026", label: "FIFA 2026" },
  { href: "/bagis", label: "Bağış" },
  { href: "/blog", label: "Blog" },
];

/**
 * Logo — açık temada /cocuktribunu.png, koyu temada /cocuktribunud.png.
 * Tema geçişi CSS ile yapılır; JS beklemeden doğru varyant görünür.
 */
export function Logo({ size = 38, showText = true, dark = false, forceDark = false }:
  { size?: number; showText?: boolean; dark?: boolean; forceDark?: boolean }) {
  if (forceDark) {
    return (
      <span className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cocuktribunud.png" alt="Çocuk Tribünü" width={size} height={size}
          className="shrink-0 object-contain" style={{ width: size, height: size }} />
        {showText && (
          <span className="font-display text-[17px] font-semibold tracking-[.02em] text-on-solid">Çocuk Tribünü</span>
        )}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-3">
      <span className="relative block shrink-0" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cocuktribunu.png" alt="Çocuk Tribünü"
          width={size} height={size}
          className="h-full w-full object-contain [html[data-theme=dark]_&]:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cocuktribunud.png" alt="" aria-hidden
          width={size} height={size}
          className="absolute inset-0 hidden h-full w-full object-contain [html[data-theme=dark]_&]:block"
        />
      </span>
      {showText && (
        <span className={cn("font-display text-[17px] font-semibold tracking-[.02em]", dark && "text-on-solid")}>
          Çocuk Tribünü
        </span>
      )}
    </span>
  );
}

export function SiteNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled ? "border-line2 bg-page/85 backdrop-blur-md" : "border-transparent bg-page",
      )}
    >
      <nav className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Çocuk Tribünü ana sayfa">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 text-[14.5px] font-medium text-ink2 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative pb-[3px] transition-colors duration-150 hover:text-ink",
                isActive(l.href) && "font-semibold text-ink",
              )}
            >
              {l.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-[1px] h-[2px] origin-left rounded-full bg-lime transition-transform duration-200",
                  isActive(l.href) ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle className="hidden sm:inline-flex" />
          {isLoggedIn ? (
            <Link href="/panel" className={buttonClass("solid", "md", "hidden sm:inline-flex")}>
              <Icon icon={IconUser} size={16} />
              Panelim
            </Link>
          ) : (
            <>
              <Link href="/giris" className="hidden text-[14.5px] font-semibold text-ink transition-colors hover:text-green sm:inline">
                Giriş Yap
              </Link>
              <Link href="/basvuru" className={buttonClass("solid", "md", "hidden sm:inline-flex")}>
                Kart Başvurusu
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
          >
            <Icon icon={open ? IconClose : IconMenu} size={19} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="ct-slide-down border-t border-line2 bg-page lg:hidden">
          <div className="ct-stagger flex flex-col gap-1 px-5 py-4 sm:px-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-[12px] px-4 py-3 text-[15px] font-medium transition-colors",
                  isActive(l.href) ? "bg-chip font-semibold text-ink" : "text-ink2 hover:bg-chip",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-line2 pt-4">
              {isLoggedIn ? (
                <Link href="/panel" className={buttonClass("solid", "md", "flex-1")}>Panelim</Link>
              ) : (
                <>
                  <Link href="/giris" className={buttonClass("outline", "md", "flex-1")}>Giriş Yap</Link>
                  <Link href="/basvuru" className={buttonClass("solid", "md", "flex-1")}>Kart Başvurusu</Link>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
