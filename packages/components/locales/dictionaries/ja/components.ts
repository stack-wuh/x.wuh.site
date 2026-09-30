import type { DeepPartial, Dict } from '../zh'

export const components: DeepPartial<Dict['components']> = {
  preview: {
    title: '画像プレビュー',
    emptyCaption: 'プレビューできる画像がありません',
    emptyState: 'プレビューできる画像がありません',
    subtitleHint: '←/→ で切り替え · ESC で閉じる',
    legend: '←/→ で移動 · スペースで次へ · ESC で閉じる',
    previous: '前の画像',
    next: '次の画像',
    close: 'プレビューを閉じる',
    more: 'その他の操作',
    zoomIn: '拡大',
    zoomOut: '縮小',
    resetZoom: 'ズームをリセット',
    rotate: '画像を回転',
    rotateShort: '回転',
    download: '画像をダウンロード',
    downloadShort: 'ダウンロード',
    fullscreen: '全画面',
    enterFullscreen: '全画面にする',
    exitFullscreen: '全画面を解除',
    thumbnailAria: '{index} 枚目をプレビュー',
    thumbnailAlt: 'プレビュー {index}',
  },
  alert: {
    defaultTitle: '補足情報',
    defaultSummary: '以下は本文の補足説明です。転載や続きの閲覧の参考にどうぞ。',
    shareLabel: '記事をシェア',
    closeNotice: '通知を閉じる',
    updatedAtLabel: '更新日時:',
    updatedByTitle: '{by} が {time} に更新',
    updatedAtTitle: '{time} に更新',
    updatedAt: '{time} に更新',
    githubProfileTitle: '{by} の GitHub プロフィールを見る',
    sourceLinkLabel: '原文リンク:',
    projectLabel: '所属プロジェクト:',
    licenseLabel: 'オープンソースライセンス:',
    labelsLabel: '所属タグ:',
    labelsAria: 'ドキュメントタグ',
  },
  heatmap: {
    date: '{m} 月 {d} 日',
    less: 'Less',
    more: 'More',
  },
  footprintMap: {
    here: 'ここにいます',
    homeAddress: '深圳市宝安区 · 立新湖クリエイティブパーク',
    loading: '地図を読み込み中',
    loadingDetail: '足跡を描いています',
  },
  progress: {
    defaultLabel: '進捗',
  },
  empty: {
    title: 'まだ何もありません',
  },
  result: {
    errorTitle: 'エラーが発生しました',
    infoTitle: 'お知らせ',
    unavailable: 'ページが一時的に利用できません。後でもう一度お試しください。',
  },
  image: {
    loadFailed: '画像の読み込みに失敗しました',
  },
  dialog: {
    close: '閉じる',
  },
  message: {
    closeNotice: '通知を閉じる',
  },
}
