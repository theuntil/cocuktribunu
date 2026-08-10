import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/site/theme";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cocuktribunu.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Çocuk Tribünü — Her çocuğun bir tribünü olsun",
    template: "%s · Çocuk Tribünü",
  },
  description:
    "Çocuk Tribünü; çocukların futbolu güvenli, ayrımsız ve sevgiyle deneyimlemesi için çalışan bir taraftar inisiyatifidir. Kombine kart, imza kampanyaları ve şehir etkinlikleri.",
  keywords: ["çocuk tribünü", "kombine kart", "çocuk futbol", "taraftar", "imza kampanyası"],
  authors: [{ name: "Çocuk Tribünü" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Çocuk Tribünü",
    title: "Çocuk Tribünü — Her çocuğun bir tribünü olsun",
    description: "Çocukların tribünde güvende olduğu bir futbol kültürü için çalışıyoruz.",
  },
  twitter: { card: "summary_large_image", title: "Çocuk Tribünü" },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efeae1" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${bricolage.variable} ${manrope.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-solid focus:px-5 focus:py-3 focus:text-on-solid"
        >
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}
