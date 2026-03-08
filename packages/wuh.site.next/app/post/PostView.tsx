'use client'

import Link from 'next/link'
import Alert, { type AlertLabel, type AlertLink } from '@wuh.site/components/alert'
import ImagePreview from '@wuh.site/components/image-preview'
import SharedLinkGroup, { type ShareItem } from '@wuh.site/components/shared-link-group'

import {
  ArticleCard,
  CommentPlaceholder,
  Container,
  Header,
  MarkdownBody,
  MetaRow,
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
        alert('链接已复制到剪贴板')
      } else {
        alert('复制失败，请手动复制')
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
    </Container>
  )
}
