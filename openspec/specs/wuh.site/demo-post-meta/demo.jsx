// ============================================
// 文章元信息面板 — Alert
// import 路径：
//   Alert  → @wuh.site/components/alert
// ============================================

import Alert from '@wuh.site/components/alert'

export function PostMetaPanel({ post }) {
  return (
    <Alert
      variant="info"
      title="文章信息"
      summary="以下为文章补充说明。"
      updatedAt={post.updatedAt}
      updatedBy={post.author}
      updatedByLink={`https://github.com/${post.author}`}
      sourceLink={{
        label: '查看原文',
        href: `https://github.com/stack-wuh/x.wuh.site/issues/${post.number}`,
      }}
      labels={post.tags?.map((t) => ({
        name: t,
        href: `/blog?tag=${encodeURIComponent(t)}`,
      }))}
      license="MIT"
      shareItems={[
        { type: 'twitter', url: `https://x.wuh.site/post/${post.number}` },
        { type: 'weibo', url: `https://x.wuh.site/post/${post.number}` },
      ]}
    />
  )
}
