/** 时间线筛选档位：词典 key（选择器 value 与展示文案同源，无独立业务消费方） */
export const timelineFilters = [
  'about.timeline.filter90d',
  'about.timeline.filter180d',
  'about.timeline.filterThisYear',
]

export const blogTags = ['Javascript', 'React', 'Git', 'Node', 'Nginx', 'Vue']

export const timelineLogs = [
  {
    date: '2026-04-16',
    summaryKey: 'about.timeline.logsApril16',
    entries: [
      { platform: 'GitHub', title: 'Release: 能量贴图组件', link: '#' },
      { platform: '语雀', title: '撰写《沉浸式组件库》章节', link: '#' },
      { platform: '公众号', title: '如何用热力图展现输出节奏', link: '#' },
    ],
  },
  {
    date: '2026-04-12',
    summaryKey: 'about.timeline.logsApril12',
    entries: [
      { platform: 'GitHub', title: 'Issue: 博客导航体验优化', link: '#' },
      { platform: 'GitHub', title: 'Commit: 优化 About 热力图布局', link: '#' },
      { platform: '语雀', title: '资料：设计系统色彩步进', link: '#' },
    ],
  },
  {
    date: '2026-04-08',
    summaryKey: 'about.timeline.logsApril8',
    entries: [
      { platform: '公众号', title: '系列：工具即生活｜Vol.3', link: '#' },
      { platform: '公众号', title: '运营日志：创作节奏记录', link: '#' },
    ],
  },
]

export const formatMonthDay = (isoDate: string, locale: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}
