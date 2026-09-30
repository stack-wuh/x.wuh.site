import type { ContactCardProps } from './ContactCard'
import { site } from '@wuh.site/components/locales/dictionaries/zh/site'

const contact = site.contact

export type ContactType = 'wechat' | 'qq' | 'twitter' | 'github' | 'douban' | 'netease' | 'discord'
export type ContactDialogConfig = ContactCardProps

/**
 * 渠道静态配置：二维码/链接/账号等结构数据在此；
 * 内容文案（title/tagline/hints/linkLabel）引用 zh 词典兜底，
 * 渲染时 ContactCard 按 id 取当前 locale 词典；平台品牌名不译。
 */
export const CONTACT_CONFIG: Record<ContactType, ContactDialogConfig> = {
  wechat: {
    id: 'wechat',
    badge: 'WeChat',
    qrSrc: 'https://cdn.wuh.site/web/wechat.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: contact.wechat.title,
    tagline: contact.wechat.tagline,
    hints: [contact.wechat.hint1, contact.wechat.hint2],
  },
  qq: {
    id: 'qq',
    badge: 'QQ',
    qrSrc: 'https://cdn.wuh.site/web/qq.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: contact.qq.title,
    tagline: contact.qq.tagline,
    hints: [contact.qq.hint1, contact.qq.hint2],
  },
  twitter: {
    id: 'twitter',
    badge: 'Twitter',
    linkUrl: 'https://x.com/wuh131420',
    linkLabel: contact.twitter.linkLabel,
    name: 'wuh131420',
    handle: '@wuh131420',
    title: contact.twitter.title,
    tagline: contact.twitter.tagline,
    hints: [contact.twitter.hint1],
  },
  github: {
    id: 'github',
    badge: 'GitHub',
    linkUrl: 'https://github.com/stack-wuh',
    linkLabel: contact.github.linkLabel,
    name: 'stack-wuh',
    handle: '@stack-wuh',
    title: contact.github.title,
    tagline: contact.github.tagline,
    hints: [contact.github.hint1],
  },
  douban: {
    id: 'douban',
    badge: '豆瓣',
    linkUrl: 'https://www.douban.com/people/wuh-site/?_i=6001540Kgx5FFN',
    linkLabel: contact.douban.linkLabel,
    name: 'wuh.site',
    handle: 'wuh-site',
    title: contact.douban.title,
    tagline: contact.douban.tagline,
    hints: [contact.douban.hint1],
  },
  netease: {
    id: 'netease',
    badge: '网易云',
    linkUrl: 'https://music.163.com/#/user/home?id=398326271',
    linkLabel: contact.netease.linkLabel,
    name: 'stack-wuh',
    handle: 'wuh131420',
    title: contact.netease.title,
    tagline: contact.netease.tagline,
    hints: [contact.netease.hint1],
  },
  discord: {
    id: 'discord',
    badge: 'Discord',
    linkUrl: 'https://discord.com/users/shadowoo1995',
    linkLabel: contact.discord.linkLabel,
    name: 'shadowoo1995',
    handle: '@shadowoo1995',
    title: contact.discord.title,
    tagline: contact.discord.tagline,
    hints: [contact.discord.hint1],
  },
}
