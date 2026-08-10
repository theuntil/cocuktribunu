"use client";

import * as React from "react";
import { publicStorageUrl, cn } from "@/lib/utils";
import type { PreviewTeam } from "@/lib/preview-teams";

/**
 * Gerçekçi kombine kart önizlemesi.
 * Takım seçildikçe logo ve ışıma rengi canlı değişir.
 * İsim alanı düzenlenebilir olduğunu belli eden yanıp sönen imleçle gösterilir.
 */
export function CardPreview({
  teams,
  holderName = "",
  placeholder = "Çocuğunuzun adı",
  showPicker = true,
  editableName = false,
  className,
}: {
  teams: PreviewTeam[];
  holderName?: string;
  placeholder?: string;
  showPicker?: boolean;
  editableName?: boolean;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [name, setName] = React.useState(holderName);
  const [focused, setFocused] = React.useState(false);

  const team = teams[index];
  const logo = publicStorageUrl("team-logos", team?.logo_path);
  const accent = team?.color_primary ?? "var(--green)";
  const showCaret = editableName && !focused && name.length === 0;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        className="relative isolate overflow-hidden rounded-[22px] border border-white/10 p-7 text-deep-ink"
        style={{ background: "var(--deep)", boxShadow: "var(--shadow)" }}
      >
        {/* Takım rengiyle yumuşak ışıma */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl transition-colors duration-500"
          style={{ background: accent }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        {/* Üst satır */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10.5px] font-bold tracking-[.16em] text-deep-muted">ÇOCUK TRİBÜNÜ</span>
            <span className="font-display text-[19px] font-semibold tracking-[-.02em]">Kombine Kart</span>
          </div>

          <span
            key={team?.id}
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-white/95"
            style={{ animation: "ct-scale .35s cubic-bezier(.22,1,.36,1) both" }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={team?.name ?? ""} className="h-full w-full object-contain p-1.5" />
            ) : (
              <span className="font-display text-[13px] font-bold text-ink">
                {(team?.short_name ?? team?.name ?? "ÇT").slice(0, 3).toUpperCase()}
              </span>
            )}
          </span>
        </div>

        {/* Kart sahibi */}
        <div className="relative mt-14 flex flex-col gap-1">
          <span className="text-[10.5px] font-bold tracking-[.16em] text-deep-muted">KART SAHİBİ</span>

          {editableName ? (
            <div className="relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 28))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Kart üzerindeki isim"
                placeholder={placeholder}
                spellCheck={false}
                className={cn(
                  "w-full bg-transparent pb-1 font-display text-[26px] font-semibold tracking-[-.02em]",
                  "text-deep-ink outline-none transition-colors duration-200",
                  "border-b placeholder:text-white/25",
                  focused ? "border-lime" : "border-white/15",
                )}
              />
              {/* Yanıp sönen imleç — alanın yazılabilir olduğunu belli eder */}
              {showCaret && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-1 h-[30px] w-[2px] bg-lime"
                  style={{ animation: "ct-caret 1.1s step-end infinite" }}
                />
              )}
            </div>
          ) : (
            <span className="font-display text-[26px] font-semibold tracking-[-.02em]">
              {name || placeholder}
            </span>
          )}

          <span className="mt-1 text-[13px] text-deep-muted">{team?.name ?? "Takım seçin"}</span>
        </div>
      </div>

      {/* Takım seçici */}
      {showPicker && teams.length > 1 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-[12.5px] text-muted">Takımını seç, kartın üzerinde canlı gör:</span>
          <div className="grid grid-cols-4 gap-2.5">
            {teams.map((t, i) => {
              const l = publicStorageUrl("team-logos", t.logo_path);
              const active = i === index;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={active}
                  aria-label={`${t.name} kartını önizle`}
                  title={t.name}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-[16px] border-2 bg-surface p-2.5 transition-all duration-200",
                    active
                      ? "border-green scale-[1.04] shadow-[0_6px_20px_-10px_rgba(14,122,87,.7)]"
                      : "border-line hover:border-green/50 hover:-translate-y-0.5",
                  )}
                >
                  {l ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l} alt="" className="h-full w-full object-contain" loading="lazy" />
                  ) : (
                    <span className="font-display text-[13px] font-bold text-muted">
                      {(t.short_name ?? t.name).slice(0, 3).toUpperCase()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
