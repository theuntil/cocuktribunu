import type { MetadataRoute } from "next";
import { getNews, getEvents, getTeams, getDonationCampaigns } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cocuktribunu.org";

const STATIC_PATHS = [
  "", "/hakkimizda", "/imza-kampanyasi", "/kombine-kart", "/etkinlikler", "/fifa-2026", "/takimlar",
  "/blog", "/duyurular", "/bagis", "/bagiscilar", "/iletisim", "/sss", "/gonullu-ol", "/basin",
  "/kvkk", "/gizlilik", "/cerez-politikasi", "/uyelik-kosullari",
  "/cocuk-verileri-politikasi", "/mesafeli-satis", "/iptal-iade",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, events, teams, donations] = await Promise.all([
    getNews(200), getEvents({ limit: 200 }), getTeams(), getDonationCampaigns(),
  ]);

  return [
    ...STATIC_PATHS.map((p) => ({
      url: `${SITE}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...news.rows.map((n) => ({
      url: `${SITE}/blog/${n.slug}`,
      lastModified: n.published_at ? new Date(n.published_at) : new Date(),
      changeFrequency: "monthly" as const, priority: 0.6,
    })),
    ...events.map((e) => ({
      url: `${SITE}/etkinlikler/${e.slug}`,
      lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.6,
    })),
    ...teams.map((t) => ({
      url: `${SITE}/takimlar/${t.slug}`,
      lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5,
    })),
    ...donations.map((d) => ({
      url: `${SITE}/bagis/${d.slug}`,
      lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.6,
    })),
  ];
}
