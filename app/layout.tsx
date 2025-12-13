import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../providers/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Figtree } from "next/font/google";

export const metadata: Metadata = {
  title: "Çocuk Tribünü",
  icons: {
    icon: "/favicon.png",  },
  description: "Çocuk Tribünü Spor sosyal sorumluluk projesi",
  verification: {
    google: "X5ffxjkjmRmVY4UZyfC1SoBgqM7UZdBZRX4Ra0bFmQI",
  },
};



const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
    
      <body
        className={`
          ${figtree.className}
          bg-neutral-50 text-neutral-900
          dark:bg-neutral-950 dark:text-neutral-50
          transition-colors duration-300
        `}
      >
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
