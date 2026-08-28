import type { NextConfig } from "next";

const supabaseHost = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://localhost").hostname; }
  catch { return "localhost"; }
})();

const _s3 = ["@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner"];
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
  experimental: { optimizePackageImports: ["@hugeicons/react"] },
  async headers() {
    return [
      {
        /* ┌─ SERTİFİKA ÖNİZLEMESİ AYRI TUTULUYOR ⚠️ ──────────────┐
           │ Genel kural `X-Frame-Options: DENY`. Bu başlık AYNI     │
           │ KÖKENDEN gelen çerçeveleri de engelliyor — tıklama      │
           │ hırsızlığına karşı en katı ayar.                         │
           │                                                           │
           │ Ama sertifika önizlemesi PDF'i bir `<iframe>` içinde    │
           │ gösteriyor. Tarayıcı bunu da engelleyip şunu yazıyordu: │
           │   "www.cocuktribunu.org bağlanmayı reddetti"             │
           │                                                           │
           │ Bu tek uç için `SAMEORIGIN`e düşülüyor: kendi sayfamız  │
           │ çerçeveleyebiliyor, başka siteler hâlâ engelli.         │
           │ Genel kural olduğu gibi katı kalıyor.                    │
           └───────────────────────────────────────────────────────────┘ */
        source: "/api/sertifika",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};
export default nextConfig;
