import SharedLinkGroup from './index'

// 示例 1: 基础使用
export const Example1 = () => {
  const shareItems = [
    { type: 'wechat' as const, href: '#', title: '分享到微信' },
    { type: 'qq' as const, href: '#', title: '分享到QQ' },
    { type: 'weibo' as const, href: '#', title: '分享到微博' },
    { type: 'twitter' as const, href: '#', title: '分享到Twitter' },
    { type: 'email' as const, href: 'mailto:?subject=分享文章', title: '邮件分享' },
    {
      type: 'link' as const,
      title: '复制链接',
      onClick: () => {
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert('链接已复制'))
          .catch(() => alert('复制失败'))
      }
    }
  ]

  return <SharedLinkGroup items={shareItems} size="medium" label="分享到" />
}

// 示例 2: 小尺寸，无标签
export const Example2 = () => {
  const shareItems = [
    { type: 'twitter' as const, href: '#', title: 'Twitter' },
    { type: 'email' as const, href: '#', title: 'Email' },
    { type: 'link' as const, title: '复制链接', onClick: () => {} }
  ]

  return <SharedLinkGroup items={shareItems} size="small" gap={8} />
}

// 示例 3: 大尺寸，自定义标签
export const Example3 = () => {
  const shareItems = [
    { type: 'wechat' as const, href: '#', title: '微信' },
    { type: 'qq' as const, href: '#', title: 'QQ' },
    { type: 'weibo' as const, href: '#', title: '微博' }
  ]

  return <SharedLinkGroup items={shareItems} size="large" label="喜欢这篇文章？分享给朋友" gap={16} />
}

// 示例 4: 文章详情页使用
export const ArticleShareExample = ({ title, url }: { title: string; url: string }) => {
  const shareItems = [
    { type: 'wechat' as const, href: '#', title: '分享到微信' },
    { type: 'qq' as const, href: '#', title: '分享到QQ' },
    { type: 'weibo' as const, href: '#', title: '分享到微博' },
    {
      type: 'twitter' as const,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      title: '分享到Twitter'
    },
    {
      type: 'email' as const,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`查看这篇文章：${url}`)}`,
      title: '邮件分享'
    },
    {
      type: 'link' as const,
      title: '复制链接',
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(url)
          alert('链接已复制到剪贴板')
        } catch {
          alert('复制失败，请手动复制')
        }
      }
    }
  ]

  return <SharedLinkGroup items={shareItems} size="medium" label="分享到" />
}
