const HEATMAP_WEEKS = 12
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const startDate = new Date(Date.UTC(2026, 0, 5))

export const buildHeatmap = () => {
  return WEEK_DAYS.map((weekday, weekdayIndex) => ({
    weekday,
    cells: Array.from({ length: HEATMAP_WEEKS }, (_, weekIndex) => {
      const date = new Date(startDate)
      date.setUTCDate(startDate.getUTCDate() + weekIndex * 7 + weekdayIndex)
      const level = (weekdayIndex + weekIndex) % 4
      return {
        date: date.toISOString().slice(0, 10),
        count: level ? level + 1 : 0,
        level,
      }
    }),
  }))
}

export const heatmap = buildHeatmap()
export const filters = ['全部平台', 'GitHub', '语雀', '微信公众号']
export const timelineFilters = ['最近 90 天', '最近 180 天', '今年']

export const metrics = [
  { label: '最近 30 天产出', value: '32 条', detail: '包含日志、文档、工具 & 运营总结' },
  { label: '活跃平台', value: '3 / 3', detail: 'GitHub × 语雀 × 微信公众号' },
  { label: '平均响应', value: '6 小时', detail: '合作邀约与读者反馈' },
]

export const expertiseTags = ['架构研究', '内容系统', '工具链', '社区运营', 'DevRel']

export const timelineLogs = [
  {
    date: '2026-04-16',
    summary: '5 条更新，总量 14 条（GitHub 3 / 语雀 1 / 公众号 1）',
    entries: [
      { platform: 'GitHub', title: 'Release: 能量贴图组件', link: '#' },
      { platform: '语雀', title: '撰写《沉浸式组件库》章节', link: '#' },
      { platform: '公众号', title: '如何用热力图展现输出节奏', link: '#' },
    ],
  },
  {
    date: '2026-04-12',
    summary: '3 条更新（GitHub 2 / 语雀 1）',
    entries: [
      { platform: 'GitHub', title: 'Issue: 博客导航体验优化', link: '#' },
      { platform: 'GitHub', title: 'Commit: 优化 About 热力图布局', link: '#' },
      { platform: '语雀', title: '资料：设计系统色彩步进', link: '#' },
    ],
  },
  {
    date: '2026-04-08',
    summary: '2 条更新（微信公众号 2）',
    entries: [
      { platform: '公众号', title: '系列：工具即生活｜Vol.3', link: '#' },
      { platform: '公众号', title: '运营日志：创作节奏记录', link: '#' },
    ],
  },
]

export const platformStories = [
  {
    name: 'GitHub',
    description: 'Issue / Repo / Release 统一为创作日志，30+ 开源项目持续维护。',
    lastUpdated: '2026-04-10',
    linkLabel: '前往仓库',
  },
  {
    name: '语雀',
    description: '沉浸式笔记与课程章节，文档更新率 >100 条 / 年。',
    lastUpdated: '2026-04-15',
    linkLabel: '查看文档',
  },
  {
    name: '微信公众号',
    description: '深度干货与创作日记，侧重经验总结与工具推荐。',
    lastUpdated: '2026-04-14',
    linkLabel: '跳转公众号',
  },
]

export const legendLabels = ['0 条', '1 条', '2 条', '3+ 条']
export const heatColors = [
  'var(--background-200)',
  'color-mix(in oklab, var(--success-color) 70%, var(--background-100) 30%)',
  'var(--success-400)',
  'var(--success-600)',
]

export const formatMonthDay = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
