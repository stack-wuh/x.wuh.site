import type { DeepPartial, Dict } from '../zh'

export const blog: DeepPartial<Dict['blog']> = {
  listTitle: 'All posts',
  listSubtitle: 'Every blog post from GitHub Issues',
  filterAria: 'Filter posts by category',
  filterEmpty: 'No categories',
  clearFilterAria: 'Clear {label} filter',
  views: '{count} views',
  topicViewAria: 'View posts tagged {label}',
  empty: {
    title: 'Nothing here yet',
    description: 'No posts to show right now',
  },
  topic: {
    subtitle: '{total} related posts, newest first.',
    emptyTitle: 'No related posts',
    emptyDescription: 'No posts tagged "{label}" yet',
    backToBlog: 'Back to blog',
  },
}
