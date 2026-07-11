// ============================================
// API 数据获取 — fetcher 使用示例
// import 路径：
//   fetcher → packages/hooks/useFetch
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { fetcher } from 'packages/hooks/useFetch'
import Skeleton from '@wuh.site/components/skeleton'
import Empty from '@wuh.site/components/empty'
import { Column } from '@wuh.site/components/flex'

// 获取列表
export function PostList() {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    fetcher('/api/posts', { query: { page: 1, limit: 10 } }).then((res) => {
      if (!cancelled) setState({ data: res.data, loading: false, error: res.error })
    })
    return () => { cancelled = true }
  }, [])

  if (state.loading) return <Column gap={12}>{[1,2,3].map(i => <Skeleton key={i} variant="rect" height={80} />)}</Column>
  if (state.error) return <Empty title="加载失败" description={state.error.message} />
  if (!state.data?.length) return <Empty title="暂无文章" />

  return <div>{/* 渲染列表 */}</div>
}

// 提交表单
export async function createPost(data) {
  const res = await fetcher('/api/posts', {
    method: 'POST',
    body: data,
    timeout: 10000,
  })
  if (!res.ok) throw res.error
  return res.data
}
