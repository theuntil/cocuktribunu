import Link from "next/link";
import { Logo } from "@/components/site/nav";

const COLUMNS = [
  {
    title: "KEŞFET",
    links: [
      { href: "/imza-kampanyasi", label: "İmza Kampanyası" },
      { href: "/kombine-kart", label: "Kombine Kart" },
      { href: "/etkinlikler", label: "Etkinlikler" },
      { href: "/fifa-2026", label: "FIFA 2026 Dünya Kupası" },
      { href: "/takimlar", label: "Takımlar" },
      { href: "/blog", label: "Blog" },
      { href: "/duyurular", label: "Duyurular" },
    ],
  },
  {
    title: "KURUMSAL",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/bagis", label: "Bağış Yap" },
      { href: "/bagiscilar", label: "Bağışçılarımız" },
      { href: "/gonullu-ol", label: "Gönüllü Ol" },
      { href: "/basin", label: "Basın" },
      { href: "/sss", label: "Sıkça Sorulanlar" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
  {
    title: "YASAL",
    links: [
      { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
      { href: "/cocuk-verileri-politikasi", label: "Çocuk Verileri Politikası" },
      { href: "/uyelik-kosullari", label: "Üyelik Koşulları" },
      { href: "/gizlilik", label: "Gizlilik Politikası" },
      { href: "/cerez-politikasi", label: "Çerez Politikası" },
      { href: "/mesafeli-satis", label: "Mesafeli Satış Sözleşmesi" },
      { href: "/iptal-iade", label: "İptal ve İade Koşulları" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-sidebar text-on-dark">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12 lg:py-14">
        <div className="flex flex-col gap-4">
          <Logo dark forceDark />
          <p className="max-w-[300px] text-[13.5px] leading-[1.6]">
            Çocukların tribünde güvende olduğu bir futbol kültürü için çalışan bağımsız taraftar inisiyatifi.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className="flex flex-col gap-2.5 text-[13.5px]" aria-label={col.title}>
            <span className="text-[11.5px] font-bold tracking-[.14em] text-deep-muted">{col.title}</span>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href} className="text-on-dark transition-colors duration-150 hover:text-lime">
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 px-5 py-6 text-[12.5px] text-deep-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} Çocuk Tribünü. Tüm hakları saklıdır.</span>
          <span>Bu site çocuk verilerini KVKK kapsamında asgari düzeyde işler.</span>
        </div>
      </div>
    </footer>
  );
}
