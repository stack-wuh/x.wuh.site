import type { DeepPartial, Dict } from '../zh'

export const weread: DeepPartial<Dict['weread']> = {
  page: {
    title: 'WeRead',
    subtitle: '{total} books in total · {reading} reading, {finished} finished on this page',
    emptyTitle: 'Empty bookshelf',
    emptyDesc: 'No synced book data yet',
    metaFinished: ' · Finished',
    metaReading: ' · Reading',
  },
}
