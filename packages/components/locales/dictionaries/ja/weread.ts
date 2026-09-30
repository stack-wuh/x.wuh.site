import type { DeepPartial, Dict } from '../zh'

export const weread: DeepPartial<Dict['weread']> = {
  page: {
    title: 'WeRead（微信読書）',
    subtitle: '合計 {total} 冊 ・ このページは読書中 {reading} 冊 ・ 読了 {finished} 冊',
    emptyTitle: '本棚は空です',
    emptyDesc: '同期された書籍データはまだありません',
    metaFinished: ' ・ 読了',
    metaReading: ' ・ 読書中',
  },
}
