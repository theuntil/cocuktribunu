"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { IconMoon, IconSun } from "@/components/ui/icons";

const KEY = "ct-theme";

/** Sayfa boyanmadan önce temayı uygular — FOUC (beyaz parlama) olmaz. */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem("${KEY}");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function ThemeToggle({ className }: { className?: string }) {
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
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink2 transition-colors hover:border-green hover:text-green ${className ?? ""}`}
    >
      <Icon icon={theme === "dark" ? IconSun : IconMoon} size={17} />
    </button>
  );
}
