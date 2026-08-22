export const timelineFilters = ['最近 90 天', '最近 180 天', '今年']

export const blogTags = ['Javascript', 'React', 'Git', 'Node', 'Nginx', 'Vue']

export const personalBio =
  '全栈工程师，2018 年开始用 GitHub Issues 记录技术实践与个人思考。内容覆盖前端（React/Vue）、Node 服务端、运维部署（Docker/Nginx）及工程化。信奉实践驱动写作，写过的每一篇都是踩过的坑或拆过的轮子。现居深圳，业余时间喜欢读历史与推理小说。'

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

export const formatMonthDay = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
