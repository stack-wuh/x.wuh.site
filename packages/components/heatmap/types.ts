export interface ContributionDay {
  date: string
  count: number
  level: number
  breakdown?: Record<string, number>
}

export interface ContributionWeek {
  days: Array<ContributionDay | null>
}

export interface HeatmapData {
  year: number
  total: number
  weeks: ContributionWeek[]
}

export type ColorScheme = 'github' | 'warm'

export const GITHUB_COLORS = [
  '#ebedf0',
  '#9be9a8',
  '#40c463',
  '#30a14e',
  '#216e39',
] as const

export const WARM_COLORS = [
  'var(--background-200)',
  'color-mix(in oklab, var(--accent-color) 30%, var(--background-100) 70%)',
  'color-mix(in oklab, var(--accent-color) 55%, var(--background-100) 45%)',
  'color-mix(in oklab, var(--accent-color) 75%, var(--background-100) 25%)',
  'var(--accent-color)',
] as const

export const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const
