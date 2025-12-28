import * as React from 'react'
import { useExternal, useRequest } from 'ahooks'
import fetcher from '@/lib/fetch'
import { useRouter } from 'next/router'
import { API_ARTICLE_ITEM } from '@/constant/api'
import {
  PostHeader,
  PostBody,
  PostContext,
  PostInfoList,
} from '@/components/post'
import Divider from '@/components/divider'
import ShareGroup from '@/components/button/share-group'
import ErrorBoundary from '@/components/ErrorBoundary'
import Empty from '@/components/empty'
import withLayout from '@/layout/layout'

function useData(id: string | string[] | undefined) {
  const {data, error} = useRequest(params => {
      return fetcher(`${API_ARTICLE_ITEM}${params.id}`)
  }, {
    defaultParams: [{ id }],
    cacheKey: `${API_ARTICLE_ITEM}_${id}`,
  })

  return {
    data,
    error,
  }
}

const Detail: React.FC<{}> = () => {
  const router = useRouter()
  const [externalUrls, setExternalUrls] = React.useState({
    hljs: '',
    hlmjs: '',
    github: ''
  })
  /**
   * !FIXED 刷新页面 router.query.id 会出现一个空对象
   */
  if (!router.query.id) return <Empty.Loading></Empty.Loading>

  const { data, error } = useData(router.query.id)

  useExternal(externalUrls.hljs, { type: 'js' })
  useExternal(externalUrls.hlmjs, { type: 'js' })
  useExternal(externalUrls.github, { type: 'css' })

  if (error) return <div className="error">ERROR</div>
  if (!data) return <Empty.Loading />

  React.useEffect(() => {
    setExternalUrls({
      hljs: 'https://src.wuh.site/scripts/highlight.min.js',
      hlmjs: 'https://src.wuh.site/scripts/highlight.js',
      github: 'https://src.wuh.site/stylesheet/github.min.css'
    })
  }, [])


  return (
    <div className="ww_detail">
      <ErrorBoundary>
        <PostContext value={data.hits}>
          {/* 文章详情页--页头meta处理 */}
          <PostHeader />
          {/* 文章详情页--文章主体 */}
          <PostBody />

          {/* 版权声明 */}
          <Divider />

          <PostInfoList {...data.hits} />

          {/* 分享--按钮组 */}
          <Divider size="small" />
          <ShareGroup />
          <Divider size="small" />
        </PostContext>
      </ErrorBoundary>
    </div>
  )
}

export default React.memo(withLayout(Detail))
