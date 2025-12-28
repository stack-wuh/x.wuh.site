import { isDev } from '@/lib/index'

/**
 * 默认网关
 */
export const PREFIX = '/v2'

/**
 * 默认域名
 */
export const DOMAIN = isDev() ? 'http://localhost:3200' : 'https://api.wuh.site'

/**
 * 静态文件域名
 */
export const DOMAIN_STATIC = isDev()
  ? 'http://localhost:3000'
  : 'https://wuh.site'

/**
 * 首页-列表查询
 */
export const API_ARTICLE_LIST = `${DOMAIN}${PREFIX}/article`

/**
 * 首页-列表-详情查询
 */
export const API_ARTICLE_ITEM = `${DOMAIN}${PREFIX}/article/`

/**
 * 首页-Banner查询
 */
export const API_BANNER_HOME = `${DOMAIN}${PREFIX}/banner`

/**
 * 首页-图集查询
 */
export const API_GALLERY_LIST = `${DOMAIN_STATIC}/api/gallery`

/**
 * 首页-音乐明细查询
 */
export const API_PLAY_LIST = `${DOMAIN}${PREFIX}/music/songs`

/**
 * 首页-音乐列表查询
 */
export const API_PLAY_ITEM = `${DOMAIN}${PREFIX}/music`
