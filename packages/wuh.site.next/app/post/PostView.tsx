'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import message from '@wuh.site/components/message'
import Alert, { type AlertLabel, type AlertLink } from '@wuh.site/components/alert'
import ImagePreview from '@wuh.site/components/image-preview'
import SharedLinkGroup, { type ShareItem } from '@wuh.site/components/shared-link-group'

import {
  ArticleCard,
  CommentPlaceholder,
  Container,
  FloatingButton,
  FloatingButtonGroup,
  FloatingProgress,
  Header,
  MarkdownBody,
  MetaRow,
  ProgressShade,
  ProgressValue,
  RedundantInfoCard,
  ShareCardInner,
  ShareInfoCard,
  StatusEmpty,
  Title,
  Toolbar,
} from './styles'
import { type AdjacentIssue, type Issue, type PostViewProps } from './PostView.types'
import { usePostImagePreview } from './usePostImagePreview'

const BLOG_PROJECT_URL = 'https://github.com/stack-wuh/blog'
const COPYRIGHT_TEXT = '本文内容遵循 CC BY-NC-SA 4.0 协议，转载请注明文章出处与原文链接。'
const TOOLBAR_EMPTY_TEXT = '空空如也'

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

const createLabelHref = (labelName: string) => {
  const query = encodeURIComponent(`is:issue label:"${labelName}"`)
  return `${BLOG_PROJECT_URL}/issues?q=${query}`
}

const toGithubWebUrl = (repositoryUrl?: string | null) => {
  if (!repositoryUrl) return BLOG_PROJECT_URL
  if (repositoryUrl.startsWith('https://api.github.com/repos/')) {
    return repositoryUrl.replace('https://api.github.com/repos/', 'https://github.com/')
  }
  return repositoryUrl
}

const toGithubIssuePathLabel = (url: string) => {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('github.com')) return url
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`
    return path || url
  } catch {
    const normalized = url.replace(/^https?:\/\/github\.com/i, '')
    if (!normalized) return url
    return normalized.startsWith('/') ? normalized : `/${normalized}`
  }
}

const resolveUpdatedBy = (issue: Issue) => {
  const login = issue.user?.login?.trim()
  const userName = issue.user?.userName?.trim() || login || 'github.userName'
  return {
    userName,
    userHomePage: login ? `https://github.com/${login}` : undefined,
  }
}

const createProjectLink = (issue: Issue): AlertLink => {
  const href = toGithubWebUrl(issue.repository_url).replace(/\/+$/, '')
  const repoName = href.replace('https://github.com/', '')
  return {
    label: repoName || 'stack-wuh/blog',
    href,
  }
}

const createSourceLink = (issue: Issue): AlertLink => ({
  label: toGithubIssuePathLabel(issue.html_url),
  href: issue.html_url,
})

const createAlertLabels = (issue: Issue): AlertLabel[] =>
  issue.labels.map((label) => ({
    name: label.name,
    color: label.color,
    href: createLabelHref(label.name),
  }))

const createShareItems = (issue: Issue): ShareItem[] => [
  {
    type: 'wechat',
    href: '#',
    title: '分享到微信',
  },
  {
    type: 'qq',
    href: '#',
    title: '分享到QQ',
  },
  {
    type: 'weibo',
    href: '#',
    title: '分享到微博',
  },
  {
    type: 'twitter',
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(issue.title)}&url=${encodeURIComponent(issue.html_url)}`,
    title: '分享到Twitter',
  },
  {
    type: 'email',
    href: `mailto:?subject=${encodeURIComponent(issue.title)}&body=${encodeURIComponent(`查看这篇文章：${issue.html_url}`)}`,
    title: '邮件分享',
  },
  {
    type: 'link',
    title: '复制链接',
    onClick: async () => {
      const success = await copyToClipboard(issue.html_url)
      if (success) {
        message.success('链接已复制到剪贴板')
      } else {
        message.error('复制失败，请手动复制')
      }
    },
  },
]

const renderToolbarIcon = (direction: 'prev' | 'next') => (
  <span className='toolbar-icon' aria-hidden='true'>
    <svg viewBox='0 0 16 16' focusable='false'>
      {direction === 'prev' ? <path d='M10.5 3.5L5.5 8l5 4.5' /> : <path d='M5.5 3.5L10.5 8l-5 4.5' />}
    </svg>
  </span>
)

const renderToolbarAction = (direction: 'prev' | 'next', targetIssue: AdjacentIssue | null) => {
  const className = `toolbar-link ${direction}`
  const label = targetIssue?.title?.trim() || TOOLBAR_EMPTY_TEXT

  if (!targetIssue) {
    return (
      <span className={className} aria-disabled='true'>
        {renderToolbarIcon(direction)}
        <span className='toolbar-label'>{label}</span>
      </span>
    )
  }

  return (
    <Link className={className} href={`/post/${targetIssue.number}`} title={targetIssue.title}>
      {renderToolbarIcon(direction)}
      <span className='toolbar-label'>{label}</span>
    </Link>
  )
}

export default function PostView({ issue, prevIssue, nextIssue }: PostViewProps) {
  const { containerRef, previewProps } = usePostImagePreview(issue?.body_html)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [floatSide, setFloatSide] = useState<'left' | 'right'>('right')
  const [floatTop, setFloatTop] = useState(0)
  const [floatLeft, setFloatLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const floatGroupRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    offsetY: 0,
    offsetX: 0,
    moved: false,
  })
  const clampTopRef = useRef<(value: number) => number>(() => 0)
  const clampLeftRef = useRef<(value: number) => number>(() => 0)
  const suppressClickRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let rafId = 0

    const updateScrollProgress = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0
      const clientHeight = doc.clientHeight || window.innerHeight || 0
      const total = scrollHeight - clientHeight
      const percent = total <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((scrollTop / total) * 100)))
      setScrollPercent(percent)
    }

    const handleScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        updateScrollProgress()
      })
    }

    updateScrollProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const resolveSpaceLg = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--space-lg').trim()
      const parsed = Number.parseFloat(value)
      return Number.isFinite(parsed) ? parsed : 24
    }

    const clampTop = (value: number) => {
      const spaceLg = resolveSpaceLg()
      const groupHeight = floatGroupRef.current?.offsetHeight ?? 0
      const maxTop = Math.max(spaceLg, window.innerHeight - groupHeight - spaceLg)
      return Math.min(maxTop, Math.max(spaceLg, value))
    }

    const clampLeft = (value: number) => {
      const spaceLg = resolveSpaceLg()
      const groupWidth = floatGroupRef.current?.offsetWidth ?? 0
      const maxLeft = Math.max(spaceLg, window.innerWidth - groupWidth - spaceLg)
      return Math.min(maxLeft, Math.max(spaceLg, value))
    }

    clampTopRef.current = clampTop
    clampLeftRef.current = clampLeft

    const updateInitialTop = () => {
      const spaceLg = resolveSpaceLg()
      const groupHeight = floatGroupRef.current?.offsetHeight ?? 0
      const maxTop = Math.max(spaceLg, window.innerHeight - groupHeight - spaceLg)
      setFloatTop(maxTop)
      setFloatLeft(Math.max(spaceLg, window.innerWidth - (floatGroupRef.current?.offsetWidth ?? 0) - spaceLg))
    }

    updateInitialTop()
    const handleResize = () => {
      setFloatTop((current) => clampTop(current))
      setFloatLeft((current) => clampLeft(current))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleGroupPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const group = floatGroupRef.current
    if (!group) return

    const rect = group.getBoundingClientRect()
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetY: event.clientY - rect.top,
      offsetX: event.clientX - rect.left,
      moved: false,
    }
    suppressClickRef.current = false
    setIsDragging(false)
  }

  const handleGroupPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if (event.pointerId !== dragStateRef.current.pointerId) return

    const deltaX = event.clientX - dragStateRef.current.startX
    const deltaY = event.clientY - dragStateRef.current.startY
    if (!dragStateRef.current.moved && Math.hypot(deltaX, deltaY) > 4) {
      dragStateRef.current.moved = true
      suppressClickRef.current = true
      setIsDragging(true)
      floatGroupRef.current?.setPointerCapture(event.pointerId)
    }

    if (!dragStateRef.current.moved) return

    const nextTop = event.clientY - dragStateRef.current.offsetY
    const nextLeft = event.clientX - dragStateRef.current.offsetX
    setFloatTop(clampTopRef.current(nextTop))
    setFloatLeft(clampLeftRef.current(nextLeft))
  }

  const handleGroupPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== dragStateRef.current.pointerId) return
    if (dragStateRef.current.moved) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {}
    }
    setIsDragging(false)
    dragStateRef.current.pointerId = -1

    if (dragStateRef.current.moved) {
      const nextSide = event.clientX < window.innerWidth / 2 ? 'left' : 'right'
      setFloatSide(nextSide)
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
  }

  const handleGroupPointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== dragStateRef.current.pointerId) return
    if (dragStateRef.current.moved) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {}
    }
    setIsDragging(false)
    dragStateRef.current.pointerId = -1
    suppressClickRef.current = false
  }

  const progressLabel = `${scrollPercent}`

  if (!issue) {
    return (
      <Container>
        <StatusEmpty title='未找到文章' description='请检查链接是否正确，或稍后再试。' />
        <Toolbar>
          {renderToolbarAction('prev', null)}
          {renderToolbarAction('next', null)}
        </Toolbar>
      </Container>
    )
  }

  const date = new Date(issue.created_at).toLocaleDateString()
  const updatedAt = issue.updated_at ?? issue.created_at
  const { userName: updatedBy, userHomePage } = resolveUpdatedBy(issue)
  const sourceLink = createSourceLink(issue)
  const projectLink = createProjectLink(issue)
  const alertLabels = createAlertLabels(issue)
  const shareItems = createShareItems(issue)

  return (
    <Container ref={containerRef}>
      <Header>
        <Title>{issue.title}</Title>
        <MetaRow>
          <span>发布于 {date}</span>
          <span>·</span>
          <span>评论 {issue.comments}</span>
        </MetaRow>
      </Header>

      <ArticleCard>
        <MarkdownBody className='markdown-body' dangerouslySetInnerHTML={{ __html: issue.body_html ?? '' }} />
      </ArticleCard>

      <ImagePreview {...previewProps} />
      <RedundantInfoCard variant='outlined' elevation={0} fullWidth padding='md'>
        <Alert
          framed={false}
          showHeader={false}
          updatedAt={updatedAt}
          updatedBy={updatedBy}
          updatedByLink={userHomePage}
          sourceLink={sourceLink}
          projectLink={projectLink}
          labels={alertLabels}
          license={COPYRIGHT_TEXT}
        />
      </RedundantInfoCard>
      <ShareInfoCard variant='outlined' elevation={0} fullWidth padding='md'>
        <ShareCardInner>
          <SharedLinkGroup items={shareItems} label='' />
        </ShareCardInner>
      </ShareInfoCard>
      <CommentPlaceholder title='空空如也~' description='评论功能正在开发中，欢迎稍后回来留言交流。' />

      <Toolbar>
        {renderToolbarAction('prev', prevIssue)}
        {renderToolbarAction('next', nextIssue)}
      </Toolbar>

      <FloatingButtonGroup
        ref={floatGroupRef}
        $side={floatSide}
        $top={floatTop}
        $left={floatLeft}
        $dragging={isDragging}
        onPointerDown={handleGroupPointerDown}
        onPointerMove={handleGroupPointerMove}
        onPointerUp={handleGroupPointerUp}
        onPointerCancel={handleGroupPointerCancel}
      >
        <FloatingProgress aria-label={`当前阅读进度 ${progressLabel}`} role='status'>
          <ProgressShade $percent={scrollPercent} aria-hidden='true' />
          <ProgressValue>{progressLabel}</ProgressValue>
        </FloatingProgress>
        <FloatingButton
          type='button'
          aria-label='返回首页'
          title='返回首页'
          onClick={() => {
            if (suppressClickRef.current) return
            window.location.href = '/'
          }}
        >
          <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
            <path d='M3 10.5L12 3l9 7.5' />
            <path d='M5.5 9.5V20a1 1 0 0 0 1 1h4.5v-6h2v6H17.5a1 1 0 0 0 1-1V9.5' />
          </svg>
        </FloatingButton>
        <FloatingButton
          type='button'
          aria-label='返回页头'
          title='返回页头'
          onClick={() => {
            if (suppressClickRef.current) return
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
            <path d='M12 5l-6 6' />
            <path d='M12 5l6 6' />
            <path d='M12 5v14' />
          </svg>
        </FloatingButton>
        <FloatingButton
          type='button'
          aria-label='点赞（开发中）'
          title='点赞（开发中）'
          onClick={() => {
            if (suppressClickRef.current) return
            message.info('点赞功能正在开发中')
          }}
        >
          <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
            <path d='M7 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2' />
            <path d='M7 10h9.2a2 2 0 0 1 1.95 2.43l-1.2 6A2 2 0 0 1 15 20H7' />
            <path d='M7 10V6.8a3 3 0 0 1 .88-2.12L10 2l1.5 1.5A2.5 2.5 0 0 1 12 5.27V10' />
          </svg>
        </FloatingButton>
      </FloatingButtonGroup>
    </Container>
  )
}
