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
  { href: "/", label: "Anasayfa" },
  { href: "/kombine-kart", label: "Kombine Kart" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/yaptiklarimiz", label: "Bizden Haberler" },
  { href: "/blog", label: "Blog" },
  { href: "/tescil-belgelerimiz", label: "Tescil Belgelerimiz" },
];

/**
 * Menü çubuğunun sabit yüksekliği.
 * Ana sayfadaki hero bölümü bu kadar yukarı çekilir (negatif üst boşluk),
 * böylece video ekranın en tepesinden başlar. Değer değişirse
 * (site)/page.tsx içindeki `-mt-[72px] sm:-mt-[84px]` de güncellenmelidir.
 */
const NAV_H_DESKTOP = 84;

/**
 * Logo — kaynak yönetim panelindeki ayardan gelir (props ile aktarılır).
 * Koyu temada dark varyantı CSS ile devreye girer; JS beklemez.
 */
export function Logo({
  size = 56, forceDark = false, light, dark, contain,
}: {
  size?: number;
  forceDark?: boolean;
  light?: string;
  dark?: string;
  /**
   * Kapsayıcının yüksekliğini büyütmeden logoyu ölçekler.
   * Header'da kullanılır: logo büyüse de menü çubuğu aynı yükseklikte kalır.
   */
  contain?: boolean;
}) {
  /*
   * Yedek zinciri: koyu tema logosu yoksa açık tema logosuna düşülür,
   * ikisi de yoksa görsel yerine yazı gösterilir. Böylece hiçbir durumda
   * kırık görsel çıkmaz.
   */
  const lightSrc = light || dark || "";
  const darkSrc = dark || light || "";

  /*
   * Yükseklik responsive: ayardaki değer MASAÜSTÜ ölçüsüdür, dar ekranda
   * clamp ile küçülür. Genişlik serbesttir (yatay logolar sıkışmasın).
   */
  const h = contain
    ? `clamp(${Math.round(size * 0.62)}px, ${Math.round(size * 0.09)}vw + ${
        Math.round(size * 0.45)}px, ${size}px)`
    : `clamp(${Math.round(size * 0.7)}px, ${Math.round(size * 0.08)}vw + ${
        Math.round(size * 0.5)}px, ${size}px)`;

  if (!lightSrc && !darkSrc) {
    return (
      <span
        className={`flex shrink-0 items-center whitespace-nowrap font-display font-semibold tracking-[-.02em] ${
          forceDark ? "text-white" : "text-ink"}`}
        style={{ fontSize: Math.max(15, size * 0.32) }}
      >
        Çocuk Tribünü
      </span>
    );
  }

  if (forceDark) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={darkSrc} alt="Çocuk Tribünü"
        className="w-auto max-w-full shrink-0 object-contain"
        style={{ height: h }} />
    );
  }

  /*
   * İki varyant normal akışta durur; gizlenen `display:none` olduğu için
   * yer kaplamaz.
   */
  return (
    <span className="flex shrink-0 items-center" style={{ height: h }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={lightSrc} alt="Çocuk Tribünü"
        className="ct-logo-light h-full w-auto max-w-full object-contain" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={darkSrc} alt="" aria-hidden
        className="ct-logo-dark h-full w-auto max-w-full object-contain" />
    </span>
  );
}

export function SiteNav({
  isLoggedIn = false, branding,
}: {
  isLoggedIn?: boolean;
  branding?: { logoLight: string; logoDark: string; sizeHeader?: number };
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  /*
   * BAŞLIK ÇUBUĞU DAVRANIŞI
   *
   * Aşağı kaydırılınca yukarı kayıp kaybolur, yukarı kaydırılınca
   * geri gelir. Okurken ekranın üstünü kaplamıyor ama menüye ulaşmak
   * için başa dönmek de gerekmiyor.
   *
   * ┌─ ŞEFFAFLIK KALDIRILDI ⚠️ ──────────────────────────────────┐
   * │ Başlık hero videosunun üstünde saydam duruyordu. Videonun    │
   * │ aydınlık kareleri geldiğinde yazılar okunmuyordu ve çubuk    │
   * │ nerede başlayıp bittiği belirsizdi. Artık her zaman dolu.    │
   * └──────────────────────────────────────────────────────────────┘
   *
   * ┌─ EŞİK NEDEN VAR ───────────────────────────────────────────┐
   * │ Her piksellik hareket yön değişimi sayılsaydı çubuk titrer   │
   * │ dururdu. 8 pikselden küçük hareketler yok sayılıyor.         │
   * │                                                               │
   * │ En üstteki 80 pikselde çubuk HER ZAMAN görünür: sayfa başına │
   * │ dönen kullanıcı menüyü arar.                                  │
   * └───────────────────────────────────────────────────────────────┘
   */
  const [gizli, setGizli] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  /* Zemin opaklığı: 0 = tamamen saydam, 1 = tamamen dolu */
  const [oran, setOran] = React.useState(0);

  React.useEffect(() => {
    /* Sayfanın tepesinde sayılan bölge. Başlık yüksekliğinden biraz
       fazla: kullanıcı "en üstteyim" hissindeyken gizlenme olmasın. */
    const UST_ESIK = 90;

    /* Yön kararı için birikmesi gereken mesafe. Küçük olursa titrer,
       büyük olursa tepki gecikir. 56px iki-üç kare sürüyor. */
    const YON_ESIK = 56;

    let raf = 0;
    let sonY = window.scrollY;
    let birikim = 0;

    const oku = () => {
      raf = 0;
      const y = window.scrollY;

      /* ┌─ ŞEFFAFLIK KAYDIRMAYLA ORANTILI ──────────────────────┐
         │ Önce iki durum vardı: ya tamamen saydam ya opak; geçiş │
         │ sert görünüyordu. Artık 0–140px arasında kademeli.      │
         │ Sayfanın tepesinde tamamen saydam, aşağı indikçe        │
         │ doluyor — 140px kullanıcı kaydırmaya başlar başlamaz    │
         │ başlığın okunur hâle gelmesi için yeterli.              │
         └──────────────────────────────────────────────────────────┘ */
      setOran(Math.min(y / 140, 1));
      setScrolled(y > 8);

      /* ┌─ YÖN ALGILAMASI: BİRİKİMLİ EŞİK ⚠️ ────────────────────┐
         │ Önce her karedeki fark tek başına bakılıyordu:           │
         │                                                            │
         │     if (Math.abs(y - sonY) > 8) setGizli(y > sonY)        │
         │                                                            │
         │ İki sorunu vardı:                                          │
         │                                                            │
         │ 1. YAVAŞ KAYDIRMA ALGILANMIYOR. Parmak yavaşça hareket    │
         │    ederse kare başına fark 8px'i geçmiyor ve başlık       │
         │    olduğu yerde takılı kalıyordu.                          │
         │                                                            │
         │ 2. HIZLI KAYDIRMADA TİTREME. İvmeli kaydırmada tek bir    │
         │    ters kare (parmak kalkarken) yön değiştirmeye yetiyor, │
         │    başlık bir aşağı bir yukarı zıplıyordu.                 │
         │                                                            │
         │ Çözüm: farkları AYNI YÖNDE biriktirmek. Yön değişince     │
         │ birikim sıfırlanıyor; 56px birikince karar veriliyor.     │
         │ Tek bir ters kare kararı bozamıyor, yavaş kaydırma da     │
         │ er geç eşiğe ulaşıyor.                                     │
         └────────────────────────────────────────────────────────────┘ */
      const fark = y - sonY;

      if (fark !== 0) {
        /* Yön değiştiyse birikimi sıfırla — eski yönün artığı yeni
           kararı kirletmesin. */
        if ((fark > 0) !== (birikim > 0)) birikim = 0;
        birikim += fark;
      }

      if (y <= UST_ESIK) {
        /* ★ Sayfanın en üstünde başlık HER ZAMAN görünür. Birikim de
           sıfırlanıyor: tepeden aşağı inerken temiz başlasın. */
        setGizli(false);
        birikim = 0;
      } else if (birikim > YON_ESIK) {
        setGizli(true);             // aşağı → yukarı kayarak gizlen
        birikim = 0;
      } else if (birikim < -YON_ESIK) {
        setGizli(false);            // yukarı → üstten aşağı gel
        birikim = 0;
      }

      sonY = y;
    };

    const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(oku); };

    oku();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);


  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  /* ┌─ HERO ÜSTÜNDE BAŞLIK KOYU TEMA GİBİ DAVRANIR ⚠️ ──────────┐
     │ `onVideo` bir ara `false` sabitlenmişti; sonuç olarak açık   │
     │ temada logo, menü ve düğmeler koyu renkte çiziliyordu ve     │
     │ hero videosunun üstünde okunmuyorlardı.                      │
     │                                                                │
     │ Kural: ANA SAYFANIN EN ÜSTÜNDE arkada koyu video var, o      │
     │ yüzden başlık her zaman koyu tema görünümü alır — açık       │
     │ temada bile. Aşağı kaydırılıp zemin dolunca kullanıcının     │
     │ gerçek temasına dönüyor.                                      │
     │                                                                │
     │ Mobil menü açıkken kapanıyor: menü paneli açık zeminli,      │
     │ beyaz yazı orada okunmaz.                                     │
     └────────────────────────────────────────────────────────────────┘ */
  /* Ana sayfada mıyız ve zemin daha dolmaya başlamadı mı?
     `oran` 0'a yakınken başlık saydam, arkada video görünüyor. */
  const heroPage = pathname === "/";
  const onVideo = heroPage && oran < 0.15 && !open;

  /* Mobil menü açıkken çubuk gizlenmez: menü ondan sarkıyor. */
  const gizlensin = gizli && !open;

  return (
    <>
    <header
      data-gizli={gizlensin ? "true" : "false"}
      className={cn(
        /* `sticky` değil `fixed`: gizlenirken yukarı kayması gerekiyor,
           sticky elemanda dönüşüm sayfayı da kaydırıyordu. Yerini
           doldurmak için altına eşit yükseklikte boşluk konuyor. */
        "ct-header fixed inset-x-0 top-0 z-50",
        /* ┌─ GİRİŞ/ÇIKIŞ YAVAŞLATILDI ────────────────────────────┐
           │ 420ms fazla keskindi; başlık "pat" diye kayboluyordu.  │
           │ 640ms ile hareket izlenebilir hâle geliyor ama         │
           │ bekletmiyor.                                            │
           │                                                          │
           │ Eğri iOS'un sheet animasyonu: başta hızlı, sonda çok   │
           │ yumuşak duruş. Zemin ve gölge daha kısa sürede          │
           │ değişiyor — onların gecikmesi hantal hissettiriyordu.   │
           └──────────────────────────────────────────────────────────┘ */
        "will-change-transform",
        gizlensin ? "-translate-y-full" : "translate-y-0",
        /* ┌─ ALT ÇİZGİ YOK ⚠️ ────────────────────────────────────┐
           │ Başlık altındaki çizgi, saydamdan opağa geçerken       │
           │ havada asılı bir çubuk gibi duruyordu. Ayrımı çok       │
           │ yumuşak bir gölge yapıyor — kaydırıldığında beliriyor,  │
           │ tepede hiç yok.                                          │
           └──────────────────────────────────────────────────────────┘ */
        scrolled ? "shadow-[0_1px_24px_-18px_rgba(0,0,0,.45)]" : "",
      )}
      style={{
        /* ┌─ GİRİŞ/ÇIKIŞ YAVAŞLATILDI ────────────────────────────┐
           │ 420ms fazla keskindi; başlık "pat" diye kayboluyordu.  │
           │ 640ms ile hareket izlenebilir oluyor ama bekletmiyor.  │
           │                                                          │
           │ Eğri iOS'un sheet animasyonu: başta hızlı, sonda çok   │
           │ yumuşak duruş.                                          │
           │                                                          │
           │ Zemin ve gölge 320ms — hareketten hızlı. Onlar da       │
           │ 640ms olsaydı başlık kayarken rengi geriden gelir,      │
           │ hantal hissettirirdi.                                    │
           │                                                          │
           │ Sınıf yerine inline: Tailwind'in `transition-*`         │
           │ yardımcıları tek süre veriyor, üç özelliğe ayrı süre    │
           │ ancak böyle yazılabiliyor. */
        transitionProperty: "transform, background-color, box-shadow, backdrop-filter",
        transitionDuration: "640ms, 320ms, 320ms, 320ms",
        transitionTimingFunction: "cubic-bezier(.32,.72,0,1)",

        /* Zemin opaklığı kaydırma oranını izliyor. `backdrop-blur`
           yalnızca zemin bir miktar dolduğunda devreye giriyor:
           tam saydamken bulanıklık hero videosunu bozuyordu. */
        /* ┌─ MENÜ AÇIKKEN ZEMİN TAM DOLU ⚠️ ────────────────────┐
           │ `onVideo` hesabı menüyü hesaba katıyordu ama zemin     │
           │ opaklığı yalnızca kaydırma oranına bakıyordu. Sayfanın │
           │ tepesinde menü açılınca başlık saydam kalıyor, menü    │
           │ maddeleri videonun üstünde okunmuyordu.                 │
           └────────────────────────────────────────────────────────┘ */
        backgroundColor: open
          ? "var(--page)"
          : `color-mix(in srgb, var(--page) ${Math.round(oran * 100)}%, transparent)`,
        backdropFilter: open || oran > 0.08 ? "saturate(180%) blur(14px)" : "none",
        WebkitBackdropFilter: open || oran > 0.08 ? "saturate(180%) blur(14px)" : "none",
      }}
    >

      {/* Menü çubuğu SABİT yükseklikte. Logo boyutu ayardan büyütülse bile
          çubuk uzamaz; logo kendi kutusunda ölçeklenir. */}
      <nav className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between gap-4 px-5 sm:h-[84px] sm:px-8 lg:px-12">
        <Link href="/" aria-label="Çocuk Tribünü ana sayfa">
          {/* ┌─ HERO ÜSTÜNDE HER ZAMAN BEYAZ LOGO ⚠️ ──────────────┐
              │ Ana sayfanın tepesinde başlık saydam ve arkada koyu   │
              │ video var. Açık temadaki koyu logo orada okunmuyordu. │
              │                                                        │
              │ `forceDark` yalnızca o durumda: kaydırılınca ya da     │
              │ başka sayfada normal tema davranışına dönüyor.        │
              └────────────────────────────────────────────────────────┘ */}
          <Logo contain forceDark={onVideo} size={branding?.sizeHeader ?? 64}
            light={branding?.logoLight} dark={branding?.logoDark} />
        </Link>

        <div className={cn(
          "hidden items-center gap-7 text-[14.5px] font-medium transition-colors duration-300 lg:flex",
          onVideo ? "text-white/85" : "text-ink",
        )}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative pb-[3px] transition-colors duration-150",
                onVideo ? "hover:text-white" : "hover:text-ink",
                isActive(l.href) && (onVideo ? "font-semibold text-white" : "font-semibold text-ink"),
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
          {isLoggedIn ? (
            <Link href="/panel" className={buttonClass("solid", "md", "hidden sm:inline-flex")}>
              <Icon icon={IconUser} size={16} />
              Hesabım
            </Link>
          ) : (
            <>
              <Link href="/giris" className={cn(
                "hidden text-[14.5px] font-semibold transition-colors sm:inline",
                onVideo ? "text-white/85 hover:text-white" : "text-ink hover:text-muted",
              )}>
                Giriş Yap
              </Link>
              {/* Başlıktaki asıl eylem. "Dijital Kombine" ürünü
                  anlatıyordu, ne yapılacağını değil — "Üye Ol" daha net. */}
              <Link href="/kayit" className={buttonClass("lime", "md", "hidden sm:inline-flex")}>
                Üye Ol
              </Link>
            </>
          )}

          {/* ┌─ TEMA DÜĞMESİ MASAÜSTÜNDE, "ÜYE OL"UN SAĞINDA ────┐
              │ Mobilde başlıkta yok: açılır menüde zaten var ve    │
              │ dar ekranda asıl eylemin yerini daraltıyordu.       │
              └────────────────────────────────────────────────────┘ */}
          <ThemeToggle onDark={onVideo} className="hidden sm:inline-flex" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden",
              onVideo ? "border-white/30 text-white" : "border-line text-ink",
            )}
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
                <Link href="/panel" className={buttonClass("solid", "md", "flex-1")}>Hesabım</Link>
              ) : (
                <>
                  <Link href="/giris" className={buttonClass("outline", "md", "flex-1")}>Giriş Yap</Link>
                  <Link href="/kayit" className={buttonClass("lime", "md", "flex-1")}>
                    Üye Ol
                  </Link>
                </>
              )}
              <ThemeToggle className="inline-flex" />
            </div>
          </div>
        </div>
      )}
    </header>

      {/* ┌─ YER TUTUCU ⚠️ ────────────────────────────────────────┐
          │ Başlık `fixed` olduğu için sayfa akışından çıktı;      │
          │ altındaki içerik onun altına kayıyordu. Aynı yükseklik │
          │ te boş bir kutu o yeri dolduruyor.                     │
          │                                                         │
          │ Hero sayfası bunu KENDİ eksi kenar boşluğuyla iptal    │
          │ ediyor (video başlığın arkasından başlıyor); orada      │
          │ yer tutucu görünmez.                                    │
          └─────────────────────────────────────────────────────────┘ */}
      <div aria-hidden className="h-[72px] sm:h-[84px]" />
    </>
  );
}
