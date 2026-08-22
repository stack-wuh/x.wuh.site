export const SITE_ACTIVITY_CATEGORIES = [
  'visits',
  'published',
  'updated',
  'comments',
  'guestbook',
  'projectUpdates',
] as const;

export const UNIFIED_ACTIVITY_CATEGORIES = [...SITE_ACTIVITY_CATEGORIES, 'githubContributions'] as const;

export type SiteActivityCategory = (typeof SITE_ACTIVITY_CATEGORIES)[number];
export type UnifiedActivityCategory = (typeof UNIFIED_ACTIVITY_CATEGORIES)[number];
export type SiteActivityLevel = 0 | 1 | 2 | 3 | 4;

export type SiteActivityBreakdown = Record<SiteActivityCategory, number>;
export type UnifiedActivityCounts = Record<UnifiedActivityCategory, number>;

export interface UnifiedActivityDay {
  date: string;
  total: number;
  level: SiteActivityLevel;
  counts: UnifiedActivityCounts;
}

export interface UnifiedActivityHeatmap {
  startDate: string;
  endDate: string;
  timezone: string;
  total: number;
  days: UnifiedActivityDay[];
}

export type SiteActivityDay = UnifiedActivityDay;
export type SiteActivityHeatmap = UnifiedActivityHeatmap;
