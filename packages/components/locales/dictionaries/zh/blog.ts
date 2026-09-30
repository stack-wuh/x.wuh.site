export const blog = {
  listTitle: '全部博客',
  listSubtitle: '收录 GitHub Issues 中的全部博客文章',
  filterAria: '博客分类过滤',
  filterEmpty: '暂无分类',
  clearFilterAria: '清除 {label} 分类筛选',
  views: '{count} 浏览',
  topicViewAria: '查看 {label} 主题文章',
  empty: {
    title: '暂无内容',
    description: '暂时没有可展示的博客',
  },
  topic: {
    subtitle: '共 {total} 篇相关文章，按发布时间展示最新内容。',
    emptyTitle: '暂无相关文章',
    emptyDescription: '还没有与「{label}」相关的文章',
    backToBlog: '返回博客',
  },
} as const
