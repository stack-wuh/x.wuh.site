'use client'
import styled from 'styled-components'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import SharedLinkGroup from '@wuh.site/components/shared-link-group'
import Tag from '@wuh.site/components/tag'

type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: { name: string; color?: string | null }[]
  body?: string
  body_html?: string
}

type Props = {
  issue: Issue | null
}

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 64px 24px;
  color: var(--text-primary);
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`

const Title = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
`

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  align-items: center;
`

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const ArticleCard = styled.section`
  background: var(--background-100);
  border: 1px solid var(--normal-300);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--elevation-soft);

  @media (max-width: 640px) {
    padding: 20px;
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);
    border-color: var(--normal-600);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  }
`

const MarkdownBody = styled.article`
  --github-border: rgba(208, 215, 222, 0.8);
  --github-muted: #57606a;
  --atom-inline-bg: rgba(106, 115, 125, 0.15);
  --atom-inline-border: rgba(106, 115, 125, 0.4);
  --atom-pre-bg: #fafbfc;
  --atom-pre-border: rgba(208, 215, 222, 0.8);

  font-family: var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-primary);
  word-break: break-word;

  @media (prefers-color-scheme: dark) {
    --github-border: rgba(110, 118, 129, 0.4);
    --github-muted: #8b949e;
    --atom-inline-bg: rgba(87, 96, 106, 0.35);
    --atom-inline-border: rgba(87, 96, 106, 0.6);
    --atom-pre-bg: #1f2329;
    --atom-pre-border: rgba(87, 96, 106, 0.7);
    color: var(--text-primary);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.4;
    margin: 32px 0 16px;
    color: inherit;
  }

  h1, h2 {
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--github-border);
  }

  h1 { font-size: 2.1em; }
  h2 { font-size: 1.7em; }
  h3 { font-size: 1.4em; }
  h4 { font-size: 1.2em; }
  h5 { font-size: 1.05em; }
  h6 { font-size: 1em; color: var(--github-muted); }

  p {
    margin: 16px 0;
  }

  a {
    color: var(--primary-color);
    text-decoration: underline;
    text-decoration-thickness: 0.08em;
    text-underline-offset: 3px;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.95em;
    background: var(--atom-inline-bg);
    padding: 0.15em 0.4em;
    border-radius: 6px;
    border: 1px solid var(--atom-inline-border);
  }

  pre {
    background: var(--atom-pre-bg);
    border: 1px solid var(--atom-pre-border);
    border-radius: 12px;
    padding: 18px 20px;
    overflow: auto;
    font-size: 0.95em;
    position: relative;
    margin: 24px 0;
  }

  pre code {
    background: transparent;
    padding: 0;
    border: none;
    display: block;
  }

  .copy-btn {
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 12px;
    border-radius: 8px;
    border: 1px solid var(--atom-pre-border);
    background: rgba(32, 35, 42, 0.05);
    color: var(--github-muted);
    padding: 4px 10px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .copy-btn:hover {
    background: rgba(98, 114, 164, 0.15);
    color: #528bff;
    border-color: #528bff;
  }

  .anchor {
    margin-left: 6px;
    opacity: 0;
    text-decoration: none;
    color: var(--github-muted);
    transition: opacity 0.2s ease;
  }

  h1:hover .anchor,
  h2:hover .anchor,
  h3:hover .anchor,
  h4:hover .anchor,
  h5:hover .anchor,
  h6:hover .anchor {
    opacity: 1;
  }

  blockquote {
    margin: 16px 0;
    padding: 0.25em 1em;
    border-left: 4px solid var(--github-border);
    color: var(--github-muted);
    background: rgba(175, 184, 193, 0.12);
    border-radius: 6px;
  }

  ul,
  ol {
    margin: 16px 0 16px 1.8em;
  }

  li + li {
    margin-top: 6px;
  }

  .task-list-item {
    list-style: none;
    margin-left: -1.4em;
  }

  .task-list-item input {
    margin-right: 0.5em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 0.95em;
  }

  th,
  td {
    border: 1px solid var(--github-border);
    padding: 10px 14px;
    text-align: left;
  }

  th {
    background: rgba(175, 184, 193, 0.25);
    font-weight: 600;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: var(--background-100);
  }

  hr {
    border: none;
    border-bottom: 1px solid var(--github-border);
    margin: 32px 0;
  }

  kbd {
    display: inline-block;
    padding: 3px 6px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    background: var(--github-inline-bg);
    border: 1px solid var(--github-border);
    border-radius: 6px;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
  }

  details {
    border: 1px solid var(--github-border);
    border-radius: 10px;
    padding: 12px 16px;
    background: var(--github-code-bg);
    margin: 16px 0;
  }

  summary {
    cursor: pointer;
    font-weight: 600;
  }

  .hljs {
    background: transparent;
    color: inherit;
  }
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-lg);
  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-fast) ease;
  }
  a:hover {
    text-decoration: underline;
  }
`

const Empty = styled.div`
  text-align: center;
  color: var(--text-secondary);
  padding: 80px 0;
`

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export default function PostView({ issue }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const cssId = 'hljs-atom-style'
    const darkHref = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
    const lightHref = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css'
    const media =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : undefined

    const applyTheme = () => {
      const prefersDark = media ? media.matches : false
      const link = document.getElementById(cssId) as HTMLLinkElement | null
      const href = prefersDark ? darkHref : lightHref
      if (link) {
        link.href = href
      } else {
        const newLink = document.createElement('link')
        newLink.id = cssId
        newLink.rel = 'stylesheet'
        newLink.href = href
        document.head.appendChild(newLink)
      }
    }

    applyTheme()
    if (media) {
      if (media.addEventListener) {
        media.addEventListener('change', applyTheme)
      } else if (media.addListener) {
        media.addListener(applyTheme)
      }
    }

    const scriptId = 'hljs-lib'

    function enhanceDom() {
      const root = containerRef.current
      if (!root) return
      const pres = root.querySelectorAll('article pre')
      pres.forEach((pre) => {
        if (pre.querySelector('.copy-btn')) return
        const btn = document.createElement('button')
        btn.className = 'copy-btn'
        btn.textContent = '复制'
        btn.setAttribute('type', 'button')
        btn.onclick = async () => {
          const code = pre.querySelector('code')?.textContent || ''
          try {
            await navigator.clipboard.writeText(code)
            btn.textContent = '已复制'
            setTimeout(() => (btn.textContent = '复制'), 1500)
          } catch {
            btn.textContent = '失败'
            setTimeout(() => (btn.textContent = '复制'), 1500)
          }
        }
        pre.appendChild(btn)
      })
      const headings = root.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
      headings.forEach((h) => {
        const text = h.textContent?.trim() || ''
        if (!text) return
        const slug = text
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '')
        if (!h.id) h.id = slug
        if (!h.querySelector('.anchor')) {
          const a = document.createElement('a')
          a.className = 'anchor'
          a.href = `#${h.id}`
          a.textContent = '#'
          h.appendChild(a)
        }
      })
    }

    function runHighlight() {
      const root = containerRef.current
      if (!root) return
      try {
        // @ts-expect-error hljs is provided by CDN script
        if (window.hljs && typeof window.hljs.highlightAll === 'function') {
          // @ts-expect-error hljs is provided by CDN script
          window.hljs.highlightAll()
        } else {
          const blocks = root.querySelectorAll('pre code')
          blocks.forEach((b) => {
            b.classList.add('hljs')
          })
        }
      } finally {
        enhanceDom()
      }
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'
      script.onload = runHighlight
      document.body.appendChild(script)
    } else {
      runHighlight()
    }

    return () => {
      if (media) {
        if (media.removeEventListener) {
          media.removeEventListener('change', applyTheme)
        } else if (media.removeListener) {
          media.removeListener(applyTheme)
        }
      }
    }
  }, [issue?.body_html])

  useEffect(() => {
    try {
      // @ts-expect-error hljs is provided by CDN script
      if (window.hljs && typeof window.hljs.highlightAll === 'function') {
        // @ts-expect-error hljs is provided by CDN script
        window.hljs.highlightAll()
      }
    } catch {}
  }, [issue?.body_html])
  if (!issue) {
    return (
      <Container>
        <Empty>未找到文章或网络错误</Empty>
        <Toolbar>
          <Link href="/">返回首页</Link>
          <a href="https://github.com/stack-wuh/blog/issues" target="_blank" rel="noopener noreferrer">
            查看全部博客
          </a>
        </Toolbar>
      </Container>
    )
  }

  const date = new Date(issue.created_at).toLocaleDateString()

  const shareItems = [
    {
      type: 'wechat' as const,
      href: '#',
      title: '分享到微信'
    },
    {
      type: 'qq' as const,
      href: '#',
      title: '分享到QQ'
    },
    {
      type: 'weibo' as const,
      href: '#',
      title: '分享到微博'
    },
    {
      type: 'twitter' as const,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(issue.title)}&url=${encodeURIComponent(issue.html_url)}`,
      title: '分享到Twitter'
    },
    {
      type: 'email' as const,
      href: `mailto:?subject=${encodeURIComponent(issue.title)}&body=${encodeURIComponent(`查看这篇文章：${issue.html_url}`)}`,
      title: '邮件分享'
    },
    {
      type: 'link' as const,
      title: '复制链接',
      onClick: async () => {
        const success = await copyToClipboard(issue.html_url)
        if (success) {
          alert('链接已复制到剪贴板')
        } else {
          alert('复制失败，请手动复制')
        }
      }
    }
  ]

  return (
    <Container ref={containerRef}>
      <Header>
        <Title>{issue.title}</Title>
        <MetaRow>
          <span>发布于 {date}</span>
          <span>·</span>
          <span>评论 {issue.comments}</span>
          {issue.labels?.length ? (
            <TagGroup>
              {issue.labels.slice(0, 4).map((l) => (
                <Tag key={`${issue.id}-${l.name}`} label={l.name} color={l.color} />
              ))}
            </TagGroup>
          ) : null}
        </MetaRow>
      </Header>
      <ArticleCard>
        <MarkdownBody
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: issue?.body_html ?? '' }}
        />
      </ArticleCard>
      <SharedLinkGroup items={shareItems} size="medium" label="分享到" />
      <Toolbar>
        <Link href="/">返回首页</Link>
        <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
          在 GitHub 查看
        </a>
      </Toolbar>
    </Container>
  )
}
