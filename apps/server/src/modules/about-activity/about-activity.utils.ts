export const ACTIVITY_CATEGORIES = [
  'visits',
  'published',
  'updated',
  'comments',
  'guestbook',
  'projectUpdates',
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export type ActivityBreakdown = Record<ActivityCategory, number>;

export type ActivityDayInput = {
  date: string;
  breakdown: ActivityBreakdown;
};

export type ActivityDay = ActivityDayInput & {
  levels: ActivityBreakdown;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function levelForValue(value: number, distribution: number[]): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0 || distribution.length === 0) return 0;

  const rank = distribution.filter((item) => item <= value).length;
  return Math.min(4, Math.max(1, Math.ceil((rank * 4) / distribution.length))) as 1 | 2 | 3 | 4;
}

export type UnifiedActivityDay = {
  date: string;
  total: number;
  level: 0 | 1 | 2 | 3 | 4;
  counts: ActivityBreakdown & { githubContributions: number };
};

export function mergeActivityLevels(
  days: ActivityDayInput[],
  githubContributions: Map<string, number>,
): UnifiedActivityDay[] {
  const counts = days.map((day) => ({
    ...day.breakdown,
    githubContributions: githubContributions.get(day.date) ?? 0,
  }));
  const totals = counts.map((count) => Object.values(count).reduce((total, value) => total + value, 0));
  const distribution = totals.filter((total) => total > 0).sort((a, b) => a - b);

  return days.map((day, index) => ({
    date: day.date,
    total: totals[index],
    level: levelForValue(totals[index], distribution),
    counts: counts[index],
  }));
}

export function calculateActivityLevels(days: ActivityDayInput[]): ActivityDay[] {
  const distributions = Object.fromEntries(
    ACTIVITY_CATEGORIES.map((category) => [
      category,
      days
        .map((day) => day.breakdown[category])
        .filter((value) => value > 0)
        .sort((a, b) => a - b),
    ]),
  ) as Record<ActivityCategory, number[]>;

  return days.map((day) => {
    const levels = Object.fromEntries(
      ACTIVITY_CATEGORIES.map((category) => [
        category,
        levelForValue(day.breakdown[category], distributions[category]),
      ]),
    ) as ActivityBreakdown;
    const count = ACTIVITY_CATEGORIES.reduce((total, category) => total + day.breakdown[category], 0);
    const level = Math.round(
      ACTIVITY_CATEGORIES.reduce((total, category) => total + levels[category], 0) / ACTIVITY_CATEGORIES.length,
    ) as 0 | 1 | 2 | 3 | 4;

    return { ...day, levels, count, level };
  });
}
