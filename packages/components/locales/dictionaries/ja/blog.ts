import type { DeepPartial, Dict } from '../zh'

export const blog: DeepPartial<Dict['blog']> = {
  listTitle: 'すべてのブログ',
  listSubtitle: 'GitHub Issues の全ブログ記事を収録',
  filterAria: 'ブログカテゴリ絞り込み',
  filterEmpty: 'カテゴリはまだありません',
  clearFilterAria: '{label} の絞り込みを解除',
  views: '{count} 回閲覧',
  topicViewAria: '{label} の記事を見る',
  empty: {
    title: 'まだ何もありません',
    description: '表示できるブログ記事はまだありません',
  },
  topic: {
    subtitle: '関連記事は全部で {total} 件、新しい順に表示します。',
    emptyTitle: '関連記事はまだありません',
    emptyDescription: '「{label}」に関連する記事はまだありません',
    backToBlog: 'ブログへ戻る',
  },
}
