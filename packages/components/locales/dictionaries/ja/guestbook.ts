import type { DeepPartial, Dict } from '../zh'

export const guestbook: DeepPartial<Dict['guestbook']> = {
  page: {
    title: 'ゲストブック',
    subtitle: '全 {total} 件のメッセージ ・ {current} / {totalPages} ページ',
    empty: 'まだメッセージがありません。ぜひ挨拶してください。',
    backLink: 'ゲストブックへ →',
    listAria: 'メッセージ一覧',
    today: '今日',
    yesterday: '昨日',
    beforeYesterday: '一昨日',
  },
}
