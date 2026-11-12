/** 时间线筛选档位：value 参与过滤逻辑，labelKey 为词典 key（展示文案与逻辑值同源） */
export const timelineFilters = [
  { value: '90d', labelKey: 'about.timeline.filter90d' },
  { value: '180d', labelKey: 'about.timeline.filter180d' },
  { value: 'year', labelKey: 'about.timeline.filterThisYear' },
] as const

export type TimelineFilterValue = (typeof timelineFilters)[number]['value']

export const blogTags = ['Javascript', 'React', 'Git', 'Node', 'Nginx', 'Vue']

/** 动态条目是否落在筛选窗口内（90d/180d 回看窗口；year 对齐本地年份） */
export const isWithinFilter = (
  timestamp: string,
  filter: TimelineFilterValue,
  now = new Date(),
): boolean => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return false
  if (filter === 'year') return date.getFullYear() === now.getFullYear()
  const days = filter === '90d' ? 90 : 180
  return date.getTime() >= now.getTime() - days * 24 * 60 * 60 * 1000
}

export const formatMonthDay = (isoDate: string, locale: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' })
}
