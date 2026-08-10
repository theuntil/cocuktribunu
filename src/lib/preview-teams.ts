import type { Team } from "@/lib/types";

/** Kart önizlemesinde gösterilecek takım verisi (sunucudan client'a aktarılır) */
export interface PreviewTeam {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  logo_path: string | null;
  color_primary: string | null;
}

export function toPreviewTeams(teams: Team[], limit = 4): PreviewTeam[] {
  return teams.slice(0, limit).map((t) => ({
    id: t.id,
    name: t.name,
    short_name: t.short_name,
    slug: t.slug,
    logo_path: t.logo_path,
    color_primary: t.color_primary,
  }));
}
