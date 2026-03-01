'use client'
import styled from 'styled-components'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: { name: string }[]
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
`

const LabelChip = styled.span`
  background: var(--background-200);
  border-radius: 999px;
  padding: 2px 8px;
  color: var(--text-secondary);
`

const Article = styled.article`
  background: var(--background-100);
  border: 1px solid var(--normal-300);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--elevation-soft);
  line-height: 1.85;
  font-size: var(--font-size-md);
  color: var(--text-primary);
  word-wrap: break-word;

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    margin: 1.5em 0 0.6em;
    color: var(--text-primary);
  }
  h1 { font-size: var(--font-size-2xl); }
  h2 { font-size: var(--font-size-xl); }
  h3 { font-size: var(--font-size-lg); }
  h4, h5, h6 { font-size: var(--font-size-md); }

  p { margin: 1em 0; }
  a { color: var(--primary-color); text-decoration: underline; }
  code {
    background: var(--background-200);
    padding: 2px 6px;
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.95em;
  }
  pre {
    background: var(--background-200);
    border: 1px solid var(--normal-300);
    border-radius: 12px;
    padding: 16px;
    overflow: auto;
    position: relative;
  }
  pre code {
    background: transparent;
    padding: 0;
  }
  .copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: var(--font-size-xs);
    background: var(--background-100);
    border: 1px solid var(--normal-300);
    color: var(--text-secondary);
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all var(--transition-fast) ease;
  }
  .copy-btn:hover {
    color: var(--text-primary);
    border-color: var(--primary-color);
  }
  .anchor {
    margin-left: 8px;
    color: var(--normal-500);
    text-decoration: none;
    opacity: 0;
    transition: opacity var(--transition-fast) ease;
  }
  h1:hover .anchor,
  h2:hover .anchor,
  h3:hover .anchor,
  h4:hover .anchor,
  h5:hover .anchor,
  h6:hover .anchor {
    opacity: 1;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
  tr:nth-child(odd) td {
    background: var(--background-100);
  }
  blockquote {
    margin: 1em 0;
    padding: 0 1em;
    color: var(--text-secondary);
    border-left: 4px solid var(--normal-300);
  }
  ul, ol { margin: 1em 0 1em 1.5em; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }
  th, td {
    border: 1px solid var(--normal-300);
    padding: 8px 12px;
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

export default function PostView({ issue }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const cssId = 'hljs-atom-style'
    const darkHref = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
    const lightHref = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css'
    function applyTheme() {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const link = document.getElementById(cssId) as HTMLLinkElement | null
      if (link) {
        link.href = prefersDark ? darkHref : lightHref
      } else {
        const newLink = document.createElement('link')
        newLink.id = cssId
        newLink.rel = 'stylesheet'
        newLink.href = prefersDark ? darkHref : lightHref
        document.head.appendChild(newLink)
      }
    }
    applyTheme()
    const scriptId = 'hljs-lib'
    function enhanceDom() {
      const root = containerRef.current
      if (!root) return
      const pres = root.querySelectorAll('article pre')
      pres.forEach((pre) => {
        if (pre.querySelector('.copy-btn')) return
        pre.setAttribute('style', (pre.getAttribute('style') || '') + ';position:relative;')
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
        const slug = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')
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
      try {
        // @ts-expect-error hljs is provided by CDN script
        if (window.hljs && typeof window.hljs.highlightAll === 'function') {
          // @ts-expect-error hljs is provided by CDN script
          window.hljs.highlightAll()
        } else {
          const blocks = document.querySelectorAll('pre code')
          blocks.forEach((b) => {
            b.classList.add('hljs')
          })
        }
        enhanceDom()
      } catch {}
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
  return (
    <Container ref={containerRef}>
      <Header>
        <Title>{issue.title}</Title>
        <MetaRow>
          <span>发布于 {date}</span>
          <span>·</span>
          <span>评论 {issue.comments}</span>
          {issue.labels?.slice(0, 4).map((l) => (
            <LabelChip key={l.name}>{l.name}</LabelChip>
          ))}
        </MetaRow>
      </Header>
      <Article dangerouslySetInnerHTML={{ __html: issue?.body_html ?? '' }} />
      <Toolbar>
        <Link href="/">返回首页</Link>
        <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
          在 GitHub 查看
        </a>
      </Toolbar>
    </Container>
  )
}
