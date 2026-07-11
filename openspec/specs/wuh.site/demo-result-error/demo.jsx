// ============================================
// 错误结果页 — 404 / 500
// import 路径：
//   Result → @wuh.site/components/result
// ============================================

import Result from '@wuh.site/components/result'

export function NotFoundPage() {
  return (
    <Result
      status="404"
      links={[
        { label: '返回首页', href: '/' },
        { label: '浏览博客', href: '/blog' },
        { label: '关于我', href: '/about' },
      ]}
    />
  )
}

export function ServerErrorPage() {
  return (
    <Result
      status="500"
      description="服务暂时不可用，请稍后重试。"
      links={[
        { label: '刷新页面', href: window.location.href },
        { label: '返回首页', href: '/' },
      ]}
    />
  )
}
