"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button, Card } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { IconAward, IconDownload, IconClose, IconArrowRight } from "@/components/ui/icons";

export interface CertificateInfo {
  id: string;
  number: string;
  childName: string;
  issuedAt: string;
}

/**
 * SERTİFİKA KARTI — VELİ PANELİ
 *
 * Kombine kartın altında görünür. Üstüne basınca tam ekran önizleme
 * açılır, indirme düğmesi PDF'i kaydeder.
 */
export function CertificateCard({ cert }: { cert: CertificateInfo }) {
  const [acik, setAcik] = React.useState(false);

  return (
    <>
      <button type="button" onClick={() => setAcik(true)} className="w-full text-left">
        <Card className="flex items-center gap-4 p-5 transition-colors hover:border-ink/25 sm:p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-accent text-accent-ink">
            <Icon icon={IconAward} size={22} />
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[15.5px] font-semibold">
              Bilinçli Ebeveyn Sertifikanız
            </span>
            <span className="truncate text-[13px] text-muted">
              {cert.childName} · {cert.number}
            </span>
          </span>

          <Icon icon={IconArrowRight} size={17} className="shrink-0 text-muted2" />
        </Card>
      </button>

      {acik && <Onizleme cert={cert} onClose={() => setAcik(false)} />}
    </>
  );
}

/**
 * TAM EKRAN ÖNİZLEME
 *
 * ┌─ NEDEN PORTAL ⚠️ ─────────────────────────────────────────────┐
 * │ Bir ata elemanda `transform` varsa (panelde animasyon          │
 * │ bileşenleri kullanıyor) `position: fixed` o kutuya göre        │
 * │ konumlanır ve ekranı kaplamaz. `createPortal` ile doğrudan     │
 * │ <body>'ye basılınca arada transform uygulayan ata kalmıyor.    │
 * └─────────────────────────────────────────────────────────────────┘
 */
function Onizleme({ cert, onClose }: { cert: CertificateInfo; onClose: () => void }) {
  const [monte, setMonte] = React.useState(false);

  React.useEffect(() => {
    setMonte(true);

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);

    const cubuk = window.innerWidth - document.documentElement.clientWidth;
    const eskiOverflow = document.body.style.overflow;
    const eskiPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (cubuk > 0) document.body.style.paddingRight = `${cubuk}px`;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = eskiOverflow;
      document.body.style.paddingRight = eskiPadding;
    };
  }, [onClose]);

  if (!monte || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex h-[100dvh] w-screen flex-col bg-black/95"
      role="dialog" aria-modal="true" aria-label="Sertifika önizleme">

      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[14px] font-semibold text-white">
            Bilinçli Ebeveyn Sertifikası
          </span>
          <span className="truncate font-mono text-[12px] text-white/60">{cert.number}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a href={`/api/sertifika?id=${cert.id}&indir=1`} download>
            <Button type="button" variant="lime" size="sm">
              <Icon icon={IconDownload} size={15} /> İndir
            </Button>
          </a>
          <button type="button" onClick={onClose} aria-label="Kapat"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20">
            <Icon icon={IconClose} size={18} />
          </button>
        </div>
      </div>

      {/* `min-h-0` olmadan esnek kutuda PDF taşıp altı kesiliyor */}
      <div className="min-h-0 flex-1 p-2 sm:p-4">
        <iframe
          src={`/api/sertifika?id=${cert.id}`}
          title={cert.number}
          className="h-full w-full rounded-[10px] border-0 bg-white"
        />
      </div>
    </div>,
    document.body,
  );
}
