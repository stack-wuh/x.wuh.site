import type { DeepPartial, Dict } from './zh'
import { common } from './en/common'
import { site } from './en/site'
import { home } from './en/home'
import { blog } from './en/blog'
import { post } from './en/post'
import { player } from './en/player'
import { about } from './en/about'
import { guestbook } from './en/guestbook'
import { music } from './en/music'
import { weread } from './en/weread'
import { footprint } from './en/footprint'
import { components } from './en/components'

/** 英文词典：zh 的 DeepPartial，缺 key 运行时回落中文。 */
const en: DeepPartial<Dict> = {
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
}

export default en
