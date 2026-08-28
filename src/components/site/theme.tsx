"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { IconMoon, IconSun } from "@/components/ui/icons";

const KEY = "ct-theme";

/** Sayfa boyanmadan önce temayı uygular — FOUC (beyaz parlama) olmaz. */
export function ThemeScript({ defaultTheme = "system" }: { defaultTheme?: string }) {
  /* ┌─ SIRALAMA ÖNEMLİ ⚠️ ──────────────────────────────────────┐
     │ 1. Kullanıcının kendi seçimi (localStorage)                 │
     │ 2. Yönetim panelindeki varsayılan                           │
     │ 3. Cihaz tercihi                                             │
     │                                                               │
     │ Kullanıcı seçimi en üstte: birisi koyu temayı seçtiyse       │
     │ yönetici ayarı onu ezmemeli. Varsayılan yalnızca HENÜZ       │
     │ SEÇİM YAPMAMIŞ ziyaretçi için geçerli.                       │
     │                                                               │
     │ Bu betik `<head>` içinde ve senkron çalışıyor: sayfa         │
     │ çizilmeden tema kuruluyor, yoksa açık temadan koyuya geçiş   │
     │ göz kırpması oluyordu.                                       │
     └───────────────────────────────────────────────────────────────┘ */
  const code = `(function(){try{`
    + `var t=localStorage.getItem("${KEY}");`
    + `if(!t){var d=${JSON.stringify(defaultTheme)};`
    + `t=d==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):d;}`
    + `document.documentElement.setAttribute("data-theme",t);`
    + `}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function ThemeToggle({
  className, onDark = false,
}: {
  className?: string;
  /** Hero videosunun üstünde: kenarlık ve ikon beyaza döner */
  onDark?: boolean;
}) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as "light" | "dark") ?? "light";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      /* ┌─ `inline-flex` TABANDA DEĞİL ⚠️ ──────────────────────────┐
         │ Taban sınıf `inline-flex` ile başlıyordu. Çağıran taraf    │
         │ `hidden sm:inline-flex` verse bile GİZLEME ÇALIŞMIYORDU:   │
         │ ikisi de `display` yardımcısı ve CSS'te hangisi kazanacağı │
         │ class niteliğindeki sıraya değil, STİL DOSYASINDAKİ sıraya │
         │ bakıyor. Tailwind `inline-flex`i sonra yazdığı için o      │
         │ kazanıyor ve düğme mobilde de görünüyordu.                  │
         │                                                              │
         │ Taban artık display belirtmiyor; çağıran taraf ne derse o. │
         └──────────────────────────────────────────────────────────────┘ */
      className={`h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        onDark
          ? "border-white/30 text-white/85 hover:border-white hover:text-white"
          : "border-line text-ink2 hover:border-accent-line hover:text-accent-ink"
      } ${className ?? ""}`}
    >
      <Icon icon={theme === "dark" ? IconSun : IconMoon} size={17} />
    </button>
  );
}
