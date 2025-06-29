import APIS from './index.js'
import { fetcher } from './fetcher.ts'
import type { IPosts, IPostInfo } from './interface.ts'

/** 
 * @NOTE 获取首页文章列表
 */
export const getPosts = async (): Promise<IPosts> => {
  return fetcher(APIS.ARTICLE_LIST, {})
}

/**
 * @NOTE 获取文章详情
 */
export const getPostInfo = async (params: { id: string }): Promise<IPostInfo> => {
  const api = APIS.ARTICLE_DETAIL.replace(':id', params.id)
  return fetcher(api)
}