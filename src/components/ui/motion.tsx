"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll ile görünüme girdiğinde açılan sarmalayıcı.
 * IntersectionObserver kullanır — JS maliyeti neredeyse sıfır,
 * animasyon tamamen CSS transform/opacity üzerinden (GPU).
 */
export function Reveal({
  children, delay = 0, className, as: As = "div",
}: {
  children: React.ReactNode; delay?: number; className?: string; as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.visible = "true";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <As ref={ref} className={cn("ct-reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </As>
  );
}

/** Sayaçların hedefe doğru sayması — imza/bağış toplamları için */
export function CountUp({ to, duration = 900, className }: { to: number; duration?: number; className?: string }) {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // easeOutCubic
        setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { run(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return <span ref={ref} className={className}>{new Intl.NumberFormat("tr-TR").format(value)}</span>;
}
