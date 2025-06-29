export const DOMAIN = 'https://api.wuh.site'
export const VERSION = '/v2'

export default {
  // 获取文章列表
  ARTICLE_LIST: `${DOMAIN}${VERSION}/article`,
  // 获取文章详情
  ARTICLE_DETAIL: `${DOMAIN}${VERSION}/article/:id`
}