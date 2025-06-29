/**
 * @NOTE 首页文章列表
 */
export type TPostsHit = {
  title: string,
  content: string,
  looked: number
  sub_title: string,
  created_at: number,
  updated_at: number,
  cover_img: string,
  origin: string,
  liked: number,
}

/**
 * @NOTE 公共分页
 */
export type TPager = {
  page: number,
  pageSize: number,
  pageTotal: number,
  count: number
}

export interface IPosts {
  hits: TPostsHit[]
  pager: TPager
}

export interface IPostInfo {
  hits: {
    id: string,
    title: string,
    body: string,
    looked: number
    sub_title: string,
    created_at: number,
    updated_at: number,
    cover_img: string,
    origin: string,
    liked: number,
  }
}