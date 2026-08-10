import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  CampaignProgress, City, DonationCampaignProgress, DonorWallRow, EventPublicView,
  NewsRow, Team, TeamLeaderboardRow, SubscriptionPlan, Announcement, SignatureCampaign,
} from "@/lib/types";

/**
 * Supabase henüz bağlı değilken (build sırasında, .env yokken) sayfaların
 * çökmemesi için tüm okumalar bu sarmalayıcıdan geçer.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallback;
  }
  try {
    return await fn();
  } catch (err) {
    console.error("[data]", err);
    return fallback;
  }
}

/**
 * Profil satırının varlığını garantiler. Profil yoksa RLS politikaları
 * (app.is_account_active) yazma işlemlerini reddeder ve kullanıcı
 * "yetkiniz yok" hatası alır. Bu çağrı o durumu kendiliğinden onarır.
 */
export async function ensureProfile() {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.rpc("ensure_my_profile");
    return data as { ok: boolean; created: boolean; account_status: string } | null;
  }, null);
}

export async function getCurrentUser() {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  }, null);
}

export async function getMyProfile() {
  return safe(async () => {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*, cities(name)")
      .eq("id", auth.user.id)
      .maybeSingle();
    return data as (Record<string, unknown> & { id: string }) | null;
  }, null);
}

export async function getMyRoles(): Promise<string[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("user_roles").select("role");
    return (data ?? []).map((r) => (r as { role: string }).role);
  }, []);
}

export async function getCities(): Promise<City[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("cities").select("id,name,slug,region").order("name");
    return (data ?? []) as unknown as City[];
  }, []);
}

export async function getTeams(): Promise<Team[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("teams").select("*").eq("is_active", true)
      .order("sort_order").order("name");
    return (data ?? []) as unknown as Team[];
  }, []);
}

export async function getTeam(slug: string): Promise<Team | null> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("teams").select("*").eq("slug", slug).maybeSingle();
    return (data ?? null) as unknown as Team | null;
  }, null);
}

export async function getActivePlan(): Promise<SubscriptionPlan | null> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscription_plans").select("*")
      .eq("slug", "yillik-kombine").eq("is_active", true).maybeSingle();
    return (data ?? null) as unknown as SubscriptionPlan | null;
  }, null);
}

export async function getMainCampaign(): Promise<CampaignProgress | null> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("v_campaign_progress").select("*")
      .eq("status", "active").order("signature_count", { ascending: false }).limit(1).maybeSingle();
    return (data ?? null) as unknown as CampaignProgress | null;
  }, null);
}

export async function getCampaignBySlug(slug: string): Promise<SignatureCampaign | null> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("signature_campaigns").select("*").eq("slug", slug).maybeSingle();
    return (data ?? null) as unknown as SignatureCampaign | null;
  }, null);
}

export async function getCampaignProgress(slug: string): Promise<CampaignProgress | null> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("v_campaign_progress").select("*").eq("slug", slug).maybeSingle();
    return (data ?? null) as unknown as CampaignProgress | null;
  }, null);
}

export async function getCampaignLeaderboard(campaignId: string): Promise<TeamLeaderboardRow[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("v_campaign_team_leaderboard").select("*")
      .eq("campaign_id", campaignId).order("rank").limit(24);
    return (data ?? []) as unknown as TeamLeaderboardRow[];
  }, []);
}

export async function getNews(limit = 12, offset = 0, categorySlug?: string) {
  return safe(async () => {
    const supabase = await createClient();
    let q = supabase
      .from("v_published_news").select("*", { count: "exact" })
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (categorySlug) q = q.eq("category_slug", categorySlug);
    const { data, count } = await q;
    return { rows: (data ?? []) as unknown as (NewsRow & { category_name: string | null; category_slug: string | null; image_path: string | null; image_bucket: string | null })[], count: count ?? 0 };
  }, { rows: [], count: 0 });
}

export async function getNewsBySlug(slug: string) {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news").select("*, news_categories(name,slug), profiles(first_name,last_name)")
      .eq("slug", slug).eq("status", "published").maybeSingle();
    return data as (NewsRow & Record<string, unknown>) | null;
  }, null);
}

export async function getNewsCategories() {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_categories").select("id,name,slug").eq("is_active", true).order("sort_order");
    return (data ?? []) as unknown as { id: string; name: string; slug: string }[];
  }, []);
}

export async function getEvents(opts: { limit?: number; citySlug?: string; type?: string; onlyCard?: boolean } = {}) {
  const { limit = 24, citySlug, type, onlyCard } = opts;
  return safe(async () => {
    const supabase = await createClient();
    let q = supabase
      .from("v_events_public").select("*")
      .in("status", ["published", "ongoing"])
      .gte("starts_at", new Date(Date.now() - 6 * 3600 * 1000).toISOString())
      .order("starts_at").limit(limit);
    if (citySlug) q = q.eq("city_slug", citySlug);
    if (type) q = q.eq("event_type", type);
    if (onlyCard) q = q.eq("requires_card", true);
    const { data } = await q;
    return (data ?? []) as unknown as EventPublicView[];
  }, []);
}

export async function getEventBySlug(slug: string): Promise<EventPublicView | null> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("v_events_public").select("*").eq("slug", slug).maybeSingle();
    return (data ?? null) as unknown as EventPublicView | null;
  }, null);
}

export async function getAnnouncements(limit = 20): Promise<Announcement[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements").select("*").eq("status", "published")
      .order("starts_at", { ascending: false }).limit(limit);
    return (data ?? []) as unknown as Announcement[];
  }, []);
}

export async function getDonationCampaigns(): Promise<DonationCampaignProgress[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("v_donation_campaign_progress").select("*")
      .in("status", ["active", "completed"]).order("total_amount", { ascending: false });
    return (data ?? []) as unknown as DonationCampaignProgress[];
  }, []);
}

export async function getDonationCampaign(slug: string): Promise<DonationCampaignProgress | null> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("v_donation_campaign_progress").select("*").eq("slug", slug).maybeSingle();
    return (data ?? null) as unknown as DonationCampaignProgress | null;
  }, null);
}

export async function getDonorWall(slug: string, limit = 24): Promise<DonorWallRow[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.rpc("donor_wall", { p_campaign_slug: slug, p_limit: limit });
    return (data ?? []) as unknown as DonorWallRow[];
  }, []);
}

/* ── Migration 004 ile gelen içerik kaynakları ────────────────────── */

export async function getLegalDocument(slug: string) {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("legal_documents").select("*")
      .eq("slug", slug).eq("is_published", true).maybeSingle();
    return data as {
      slug: string; title: string; summary: string | null; body: string;
      version: string; effective_from: string; updated_at: string;
    } | null;
  }, null);
}

export async function getLegalDocuments() {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("legal_documents").select("slug,title,summary,sort_order")
      .eq("is_published", true).order("sort_order");
    return (data ?? []) as unknown as { slug: string; title: string; summary: string | null }[];
  }, []);
}

export interface PressItem {
  id: string; source_name: string; source_logo_path: string | null;
  source_url: string | null; article_url: string | null;
  title: string; excerpt: string | null; published_at: string; is_featured: boolean;
}

export async function getPressCoverage(limit = 12, onlyFeatured = false) {
  return safe(async () => {
    const supabase = await createClient();
    let q = supabase.from("press_coverage").select("*")
      .eq("is_published", true).order("sort_order").order("published_at", { ascending: false }).limit(limit);
    if (onlyFeatured) q = q.eq("is_featured", true);
    const { data } = await q;
    return (data ?? []) as unknown as PressItem[];
  }, []);
}

export interface TeamMember {
  id: string; full_name: string; role_title: string; bio: string | null;
  photo_path: string | null; is_leader: boolean; links: Record<string, string>;
}

export async function getTeamMembers() {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("team_members").select("*")
      .eq("is_published", true).order("sort_order");
    return (data ?? []) as unknown as TeamMember[];
  }, []);
}

export interface SiteBlock {
  key: string; title: string | null; subtitle: string | null; body: string | null;
  image_path: string | null; image_bucket: string; cta_label: string | null;
  cta_href: string | null; data: Record<string, unknown>;
}

export async function getSiteContent(keys: string[]) {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("site_content").select("*")
      .in("key", keys).eq("is_published", true);
    const map = new Map<string, SiteBlock>();
    for (const row of (data ?? []) as unknown as SiteBlock[]) map.set(row.key, row);
    return map;
  }, new Map<string, SiteBlock>());
}

export interface DonorListRow {
  donor_display_name: string;
  amount: number;
  currency: string;
  paid_at: string;
  message: string | null;
  city_name: string | null;
  campaign_title: string | null;
  campaign_slug: string | null;
  is_anonymous: boolean;
}

export async function getRecentDonors(limit = 60, offset = 0): Promise<DonorListRow[]> {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.rpc("recent_donors", { p_limit: limit, p_offset: offset });
    return (data ?? []) as unknown as DonorListRow[];
  }, []);
}

export async function getDonorTotals() {
  return safe(async () => {
    const supabase = await createClient();
    const { data } = await supabase.rpc("donor_totals");
    return (data ?? { donor_count: 0, total_amount: 0 }) as { donor_count: number; total_amount: number };
  }, { donor_count: 0, total_amount: 0 });
}
