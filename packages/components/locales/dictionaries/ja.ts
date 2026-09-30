import type { DeepPartial, Dict } from './zh'
import { common } from './ja/common'
import { site } from './ja/site'
import { home } from './ja/home'
import { blog } from './ja/blog'
import { post } from './ja/post'
import { player } from './ja/player'
import { about } from './ja/about'
import { guestbook } from './ja/guestbook'
import { music } from './ja/music'
import { weread } from './ja/weread'
import { footprint } from './ja/footprint'
import { components } from './ja/components'

/** 日文词典：zh 的 DeepPartial，缺 key 运行时回落中文。 */
const ja: DeepPartial<Dict> = {
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

export default ja
