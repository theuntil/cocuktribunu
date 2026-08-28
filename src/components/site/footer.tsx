import Link from "next/link";
import { Logo } from "@/components/site/nav";
import { Icon } from "@/components/ui/icon";
import { IconArrowRight } from "@/components/ui/icons";

/* ┌─ YASAL SÜTUNU KALDIRILDI ⚠️ ──────────────────────────────────┐
   │ Yedi bağlantılık bir liste alt bilgiyi şişiriyordu ve hiçbiri   │
   │ günlük kullanımda tıklanmıyor. Yasal metinler en alttaki ince   │
   │ satırda duruyor — gerekli, ama görsel ağırlığı orantılı.        │
   └─────────────────────────────────────────────────────────────────┘ */
const COLUMNS = [
  {
    title: "KEŞFET",
    links: [
      { href: "/kombine-kart", label: "Kombine Kart" },
      { href: "/etkinlikler", label: "Etkinlikler" },
      { href: "/takimlar", label: "Takımlar" },
      { href: "/blog", label: "Blog" },
      { href: "/duyurular", label: "Duyurular" },
    ],
  },
  {
    title: "KURUMSAL",
    links: [
      /* Politikalar tek sayfada toplandı: alt bilgide yedi ayrı
         bağlantı yerine bir tane. */
      { href: "/politikalar", label: "Politikalarımız" },
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/gonullu-ol", label: "Gönüllü Ol" },
      { href: "/basin", label: "Basında Biz" },
      { href: "/destekcilerimiz", label: "Destekçilerimiz" },
      { href: "/sss", label: "Sıkça Sorulanlar" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
];

export function SiteFooter({
  branding, legalDocs, trademarks,
}: {
  branding?: { logoLight: string; logoDark: string; paymentLogos?: string | null; sizeFooter?: number };
  legalDocs?: { slug: string; title: string }[];
  /** Yüklenmiş tescil belgeleri — footer rozeti için */
  trademarks?: { code: string; image: string; office: string }[];
}) {
  return (
    <footer className="border-t border-line bg-page text-ink">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12 lg:py-14">
        <div className="flex flex-col gap-4">
          {/* ┌─ `forceDark` KALDIRILDI ⚠️ ────────────────────────────┐
              │ Footer zemini siyahken koyu tema logosu zorlanıyordu.  │
              │ Zemin beyaza dönünce logo görünmez oldu — beyaz logo,  │
              │ beyaz zemin.                                            │
              │                                                          │
              │ Artık normal davranıyor: açık temada açık logo, koyu    │
              │ temada koyu logo.                                        │
              └──────────────────────────────────────────────────────────┘ */}
          <Logo size={branding?.sizeFooter ?? 80}
            light={branding?.logoLight} dark={branding?.logoDark} />
          <p className="max-w-[300px] text-[15px] leading-[1.6]">
            Çocukların tribünde güvende olduğu bir futbol kültürü için çalışan bağımsız taraftar inisiyatifi.
          </p>
        </div>

        {COLUMNS.map((col) => {
          const links = col.links;

          return (
            <nav key={col.title} className="flex flex-col gap-2.5 text-[15px]" aria-label={col.title}>
              <span className="text-[12.5px] font-bold tracking-[.12em] text-muted2">{col.title}</span>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-ink transition-colors duration-150 hover:text-lime">
                  {l.label}
                </Link>
              ))}
            </nav>
          );
        })}
      </div>

      {/* ── Tescil belgeleri şeridi ──
          YALNIZCA yüklenmiş belge varsa çıkar. Belge yoksa boş bir
          şerit bırakmak yerine bölüm hiç basılmaz. */}
      {trademarks && trademarks.length > 0 && (
        <div className="border-t border-line2">
          <div className="mx-auto w-full max-w-[1240px] px-5 py-5 sm:px-8 lg:px-12">
            <Link href="/tescil-belgelerimiz"
              className="group inline-flex flex-wrap items-center gap-3.5 rounded-[14px] px-1 py-1 transition-opacity hover:opacity-90">
              {/* Belge küçük resimleri — ikondan büyük, ayırt edilebilir */}
              <span className="flex items-center -space-x-2">
                {trademarks.slice(0, 3).map((t) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={t.code} src={t.image} alt={t.office} loading="lazy"
                    className="h-11 w-9 rounded-[5px] border border-line bg-white object-cover object-top shadow-[0_2px_8px_rgba(0,0,0,.3)]" />
                ))}
              </span>

              <span className="flex flex-col">
                <span className="text-[14px] font-semibold text-ink">
                  Tescil belgelerimiz
                </span>
                <span className="text-[13px] text-muted">
                  Çocuk Tribünü tescilli markadır · belgeleri görüntüle
                </span>
              </span>

              <Icon icon={IconArrowRight} size={15}
                className="text-muted transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      <div className="border-t border-line2">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 px-5 py-6 text-[13.5px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex flex-col gap-1.5">
            <span>© {new Date().getFullYear()} Çocuk Tribünü. Tüm hakları saklıdır.</span>
            <span>Bu site çocuk verilerini KVKK kapsamında asgari düzeyde işler.</span>
          </div>

          {/* Ödeme logoları — yönetim panelinden yüklenir */}
          {branding?.paymentLogos && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={branding.paymentLogos} alt="Kabul edilen ödeme yöntemleri"
              className="h-7 max-w-[280px] self-start object-contain opacity-80 sm:self-auto"
              loading="lazy" />
          )}
        </div>
      </div>

      {/* ── Yapımcı imzası ──
          En altta, ince bir şeritte. Logo iki temada da okunsun diye
          iki dosya: açık temada koyu logo, koyu temada açık logo.
          `dark:` varyantı burada çalışmaz — tema `data-theme` ile
          yönetiliyor. `ct-logo-light` / `ct-logo-dark` sınıfları
          globals.css'te tanımlı. */}
      <div className="border-t border-line2">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-center px-5 py-5 sm:px-8 lg:px-12">
          <a
            href="https://terrasoftware.co"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Terra Software"
            className="inline-flex items-center gap-2 opacity-45 transition-opacity hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/terra.png" alt="Terra Software"
              className="ct-logo-light h-4 w-auto" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/terra_dark.png" alt="Terra Software"
              className="ct-logo-dark h-4 w-auto" loading="lazy" />
          </a>
        </div>
      </div>
    </footer>
  );
}
