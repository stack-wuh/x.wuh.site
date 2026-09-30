/**
 * 中文词典 = 类型基准。
 * - 各命名空间拆分在 zh/<namespace>.ts 片段，随各区域迁移逐步扩充；
 * - 其他语言词典是 DeepPartial<Dict>：缺 key 由运行时回落中文；
 * - 插值用 {name} 占位符（translate.interpolate 负责）。
 */
import { common } from './zh/common'
import { site } from './zh/site'
import { home } from './zh/home'
import { blog } from './zh/blog'
import { post } from './zh/post'
import { player } from './zh/player'
import { about } from './zh/about'
import { guestbook } from './zh/guestbook'
import { music } from './zh/music'
import { weread } from './zh/weread'
import { footprint } from './zh/footprint'
import { components } from './zh/components'

export const zh = {
  common,
  site,
  home,
  blog,
  post,
  player,
  about,
  guestbook,
  music,
  weread,
  footprint,
  components,
} as const

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> }

/** zh 词典的宽化形状：所有叶子从字面量类型放宽为 string。 */
export type Dict = Widen<typeof zh>

/** 部分翻译词典形状：任意子树可缺省，运行时回落 zh。 */
export type DeepPartial<T> = T extends string ? string : { [K in keyof T]?: DeepPartial<T[K]> }

export default zh
