'use client'

import message from '@wuh.site/components/message'
import Alert, { type AlertLabel, type AlertLink } from '@wuh.site/components/alert'
import ImagePreview from '@wuh.site/components/image-preview'
import SharedLinkGroup, { type ShareItem } from '@wuh.site/components/shared-link-group'

import type { Issue, PostViewProps } from './PostView.types'
import { usePostImagePreview } from './usePostImagePreview'
import { useToc } from './hooks/useToc'
import { useHeadingObserver } from './hooks/useHeadingObserver'
import PostHeader from './components/PostHeader'
import PostCover from './components/PostCover'
import PostToolbar from './components/PostToolbar'
import PostComments from './components/PostComments'
import FloatingActions from './components/FloatingActions'
import { openSharePopup, openWechatShareWindow } from '../share-utils'

import { buildPostUrl } from '@/app/lib/slug'
import { buildTopicUrl } from '@/app/lib/topic-url'
import {
  ArticleCard,
  Container,
  ContentGrid,
  MainColumn,
  MarkdownBody,
  PostLead,
  RedundantInfoCard,
  RelatedPostLabels,
  RelatedPostLink,
  RelatedPostsSection,
  RelatedPostTitle,
  ShareCardInner,
  ShareInfoCard,
  StatusEmpty,
  TocAside,
  TocCard,
  TocItemLink,
  TocList,
  TocMobile,
  TocTitle,
} from './styles'

const BLOG_PROJECT_URL = 'https://github.com/stack-wuh/blog'
const COPYRIGHT_TEXT = '本文内容遵循 CC BY-NC-SA 4.0 协议，转载请注明文章出处与原文链接。'

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
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
    href: buildTopicUrl(label.name),
  }))

const createShareItems = (issue: Issue): ShareItem[] => {
  const siteUrl = `https://wuh.site${buildPostUrl(issue.number, issue.title)}`
  const shareTitle = issue.title?.trim() || 'wuh.site 文章'
  const shareIntro = `我在 wuh.site 看到《${shareTitle}》，推荐给你看看`
  const encodedUrl = encodeURIComponent(siteUrl)
  const encodedTitle = encodeURIComponent(shareTitle)
  const encodedIntro = encodeURIComponent(shareIntro)
  const qqShareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}&desc=${encodedIntro}&summary=&site=wuh.site`
  const weiboShareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedIntro}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedIntro}&url=${encodedUrl}`

  return [
    {
      type: 'wechat',
      title: '分享到微信',
      onClick: () => openWechatShareWindow(siteUrl, shareTitle),
    },
    {
      type: 'qq',
      title: '分享到QQ',
      onClick: () => openSharePopup(qqShareUrl, 'share-qq'),
    },
    {
      type: 'weibo',
      title: '分享到微博',
      onClick: () => openSharePopup(weiboShareUrl, 'share-weibo'),
    },
    {
      type: 'twitter',
      title: '分享到Twitter',
      onClick: () => openSharePopup(twitterShareUrl, 'share-twitter'),
    },
    {
      type: 'email',
      href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`查看这篇文章：${siteUrl}`)}`,
      title: '邮件分享',
    },
    {
      type: 'link',
      title: '复制链接',
      onClick: async () => {
        const success = await copyToClipboard(siteUrl)
        if (success) {
          message.success('链接已复制到剪贴板')
        } else {
          message.error('复制失败，请手动复制')
        }
      },
    },
  ]
}

export default function PostView({ issue, prevIssue, nextIssue, total, position, relatedPosts = [] }: PostViewProps) {
  const renderedHtml = issue?.body_html || ''
  const { containerRef, previewProps } = usePostImagePreview(renderedHtml)
  const tocResult = useToc(renderedHtml)
  const activeHeading = useHeadingObserver(tocResult.toc)

  const renderToc = (onNavigate?: () => void) => (
    <TocList>
      {tocResult.toc.map((item) => (
        <li key={item.id}>
          <TocItemLink
            href={`#${item.id}`}
            $active={activeHeading ? activeHeading === item.id : false}
            $depth={item.depth}
            onClick={(e) => {
              e.preventDefault()
              const target = document.getElementById(item.id)
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(null, '', `#${item.id}`)
              }
              onNavigate?.()
            }}
          >
            {item.text}
          </TocItemLink>
        </li>
      ))}
    </TocList>
  )

  if (!issue) {
    return (
      <Container>
        <StatusEmpty title='未找到文章' description='请检查链接是否正确，或稍后再试。' />
        <PostToolbar prevIssue={null} nextIssue={null} currentNumber={issue?.number} total={total} position={position} />
      </Container>
    )
  }

  const updatedAt = issue.updated_at ?? issue.created_at
  const { userName: updatedBy, userHomePage } = resolveUpdatedBy(issue)
  const sourceLink = createSourceLink(issue)
  const projectLink = createProjectLink(issue)
  const alertLabels = createAlertLabels(issue)
  const shareItems = createShareItems(issue)

  return (
    <Container ref={containerRef}>
      <ContentGrid>
        <MainColumn>
          <PostLead>
            <PostCover src={issue.metadata?.cover} alt={issue.metadata?.coverAlt || issue.title} />
            <PostHeader issue={issue} />
          </PostLead>

          {tocResult.toc.length > 0 && (
            <TocMobile>
              <summary>
                目录
                <span aria-hidden='true'>⌄</span>
              </summary>
              <div className='toc-body'>{renderToc()}</div>
            </TocMobile>
          )}

          <ArticleCard>
            <MarkdownBody className='markdown-body' dangerouslySetInnerHTML={{ __html: tocResult.html }} />
          </ArticleCard>

          {relatedPosts.length > 0 && (
            <RelatedPostsSection aria-labelledby='related-posts-title'>
              <h2 id='related-posts-title'>相关文章</h2>
              <ul>
                {relatedPosts.map((post) => (
                  <li key={post.number}>
                    <RelatedPostLink href={buildPostUrl(post.number, post.title)}>
                      <RelatedPostTitle>{post.title}</RelatedPostTitle>
                      <RelatedPostLabels>{post.sharedLabels.slice(0, 2).join(' · ')}</RelatedPostLabels>
                    </RelatedPostLink>
                  </li>
                ))}
              </ul>
            </RelatedPostsSection>
          )}

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
              <FloatingActions
                issueNumber={issue.number}
                initialLikeCount={issue.likeCount ?? 0}
                initialLiked={issue.liked ?? false}
              />
            </ShareCardInner>
          </ShareInfoCard>

          <PostComments issueNumber={issue.number} />

          <PostToolbar prevIssue={prevIssue} nextIssue={nextIssue} currentNumber={issue.number} total={total} position={position} />
        </MainColumn>

        {tocResult.toc.length > 0 && (
          <TocAside aria-label='文章目录'>
            <TocCard>
              <TocTitle>目录</TocTitle>
              {renderToc()}
            </TocCard>
          </TocAside>
        )}
      </ContentGrid>
    </Container>
  )
}
