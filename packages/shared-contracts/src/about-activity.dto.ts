export const SITE_ACTIVITY_CATEGORIES = [
  'visits',
  'published',
  'updated',
  'comments',
  'guestbook',
  'projectUpdates',
] as const;

export type SiteActivityCategory = (typeof SITE_ACTIVITY_CATEGORIES)[number];
export type SiteActivityLevel = 0 | 1 | 2 | 3 | 4;

export type SiteActivityBreakdown = Record<SiteActivityCategory, number>;

export interface SiteActivityDay {
  date: string;
  count: number;
  level: SiteActivityLevel;
  breakdown: SiteActivityBreakdown;
  levels: SiteActivityBreakdown;
}

export interface SiteActivityHeatmap {
  startDate: string;
  endDate: string;
  timezone: string;
  total: number;
  days: SiteActivityDay[];
}
