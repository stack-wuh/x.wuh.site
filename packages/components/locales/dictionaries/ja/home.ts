import type { DeepPartial, Dict } from '../zh'

export const home: DeepPartial<Dict['home']> = {
  heroTitle: '朝朝如念',
  heroTagline: '霧は楼台を失い、月は津渡に迷う',
  viewBlog: 'ブログを見る',
  aboutMe: '私について',
  featured: '注目のブログ',
  allPosts: 'すべてのブログ',
  yearly: '年間まとめ',
  projectsTitle: '注目のプロジェクト',
  wereadTitle: 'WeRead',
  myShelf: '私の本棚',
  views: '{count} 回閲覧',
  bookFinished: '読了',
  bookReading: '読書中',
  empty: {
    posts: 'ブログはまだありません',
    postsDesc: 'Issues データの取得に失敗しました。後でもう一度お試しください',
    yearly: '年間まとめはまだありません',
    yearlyDesc: '年間振り返りの記事はまだありません',
    projects: 'プロジェクトはまだありません',
    projectsDesc: 'GitHub データの取得に失敗しました。後でもう一度お試しください',
    shelf: '本棚はまだありません',
    shelfDesc: 'WeRead と同期するとここに表示されます',
    shelfAction: '本棚を見る',
  },
}
