import type { DeepPartial, Dict } from '../zh'

export const guestbook: DeepPartial<Dict['guestbook']> = {
  page: {
    title: 'Guestbook',
    subtitle: '{total} messages in total · Page {current} / {totalPages}',
    empty: 'No messages yet — come say hello.',
    backLink: 'Go to the guestbook →',
    listAria: 'Message list',
    today: 'Today',
    yesterday: 'Yesterday',
    beforeYesterday: 'Two days ago',
  },
}
