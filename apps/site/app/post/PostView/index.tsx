'use client'

import message from '@wuh.site/components/message'
import ImagePreview from '@wuh.site/components/image-preview'
import SharedLinkGroup, { type ShareItem } from '@wuh.site/components/shared-link-group'
import { IconShare, IconArticle } from '@wuh.site/components/icons'
import { useDialog } from '@wuh.site/hooks/useDialog'

import type { Issue, PostViewProps } from '../PostView.types'
import { usePostImagePreview } from '../usePostImagePreview'
import { useToc } from '../hooks/useToc'
import { useHeadingObserver } from '../hooks/useHeadingObserver'
import PostHeader from '../components/PostHeader'
import PostCover from '../components/PostCover'
import PostToolbar from '../components/PostToolbar'
import PostComments from '../components/PostComments'
import RelatedPosts from '../components/RelatedPosts'
import FloatingActions from '../components/FloatingActions'
import ShareCard from '../components/ShareCard'
import ArticleExporter from '../components/ArticleExporter'
import { openSharePopup, openWechatShareWindow } from '../../share-utils'

import { buildPostUrl } from '@/app/lib/slug'
import { buildTopicUrl } from '@/app/lib/topic-url'
import {
  Container,
  ContentGrid,
  MainColumn,
  MarkdownBody,
  UpdateDivider,
  PostLead,
  StatusEmpty,
  ArticleColophon,
  ColophonOrnament,
  ColophonRule,
  ColophonLicense,
  ColophonMeta,
  ColophonTools,
  TocAside,
  TocTitle,
  TocItemLink,
  TocList,
  TocNum,
  TocTools,
  TocMobile,
} from '../styles'

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

const createProjectLink = (issue: Issue): { label: string; href: string } => {
  const href = toGithubWebUrl(issue.repository_url).replace(/\/+$/, '')
  const repoName = href.replace('https://github.com/', '')
  return {
    label: repoName || 'stack-wuh/blog',
    href,
  }
}

const createSourceLink = (issue: Issue): { label: string; href: string } => ({
  label: toGithubIssuePathLabel(issue.html_url),
  href: issue.html_url,
})

const createShareItems = (issue: Issue): ShareItem[] => {
  const siteUrl = `https://wuh.site${buildPostUrl(issue.number)}`
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

export default function PostView({ issue, prevIssue, nextIssue, total, position }: PostViewProps) {
  const renderedHtml = issue?.body_html
  const { containerRef, previewProps } = usePostImagePreview(renderedHtml)
  const tocResult = useToc(renderedHtml)
  const activeHeading = useHeadingObserver(tocResult.toc)
  const shareCardDialog = useDialog()
  const articleExportDialog = useDialog()

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
            {item.shortNum && (
              <TocNum aria-hidden='true'>{item.shortNum}</TocNum>
            )}
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

  const wasEdited = Boolean(issue.updated_at && issue.updated_at !== issue.created_at)
  const updatedDate = wasEdited && issue.updated_at ? issue.updated_at.slice(0, 10) : null
  const sourceLink = createSourceLink(issue)
  const projectLink = createProjectLink(issue)
  const shareItems: ShareItem[] = [
    ...createShareItems(issue),
    {
      type: 'custom',
      title: '分享图',
      icon: <IconShare />,
      onClick: shareCardDialog.openDialog,
    },
    {
      type: 'custom',
      title: '导出全文',
      icon: <IconArticle />,
      onClick: articleExportDialog.openDialog,
    },
  ]

  const shareCardData = {
    title: issue.title,
    summary: issue.metadata?.summary ?? null,
    cover: issue.metadata?.cover ?? null,
    coverAlt: issue.metadata?.coverAlt ?? null,
    authorName: issue.user?.userName?.trim() || issue.user?.login?.trim() || 'wuh.site',
    authorAvatar: issue.user?.avatarUrl ?? null,
    createdAt: issue.created_at,
    labels: issue.labels.map((l) => ({ name: l.name, color: l.color ?? null })),
    url: `https://wuh.site${buildPostUrl(issue.number)}`,
    viewCount: issue.viewCount,
    likeCount: issue.likeCount,
  }

  const articleExportData = {
    title: issue.title,
    summary: issue.metadata?.summary ?? null,
    cover: issue.metadata?.cover ?? null,
    coverAlt: issue.metadata?.coverAlt ?? null,
    authorName: issue.user?.userName?.trim() || issue.user?.login?.trim() || 'wuh.site',
    authorAvatar: issue.user?.avatarUrl ?? null,
    createdAt: issue.created_at,
    bodyHtml: issue.body_html ?? '',
    url: `https://wuh.site${buildPostUrl(issue.number)}`,
  }

  return (
    <Container ref={containerRef}>
      <ContentGrid>
        <MainColumn>
          <PostLead>
            {issue.metadata?.cover ? (
              <>
                <PostCover src={issue.metadata?.cover} alt={issue.metadata?.coverAlt || issue.title} />
                <PostHeader issue={issue} />
              </>
            ) : (
              <PostCover
                src={null}
                alt={issue.title}
                title={issue.title}
                authorName={issue.user?.userName?.trim() || issue.user?.login?.trim()}
                createdAt={issue.created_at}
                viewCount={issue.viewCount}
                summary={issue.metadata?.summary}
              />
            )}
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

          <MarkdownBody className='markdown-body' dangerouslySetInnerHTML={{ __html: tocResult.html }} />
          {updatedDate && <UpdateDivider>更新于 {updatedDate}</UpdateDivider>}

          <RelatedPosts number={issue.number} labels={issue.labels.map((label) => label.name)} />

          <ImagePreview {...previewProps} />

          <ArticleColophon>
            <ColophonOrnament aria-hidden='true'>◇</ColophonOrnament>
            <ColophonRule aria-hidden='true' />
            <ColophonLicense>{COPYRIGHT_TEXT}</ColophonLicense>
            <ColophonMeta>
              <a href={sourceLink.href} target='_blank' rel='noopener noreferrer'>{sourceLink.label}</a>
              {' · '}
              <a href={projectLink.href} target='_blank' rel='noopener noreferrer'>{projectLink.label}</a>
            </ColophonMeta>
            <SharedLinkGroup items={shareItems} />
            <ColophonTools>
              <FloatingActions
                issueNumber={issue.number}
                initialLikeCount={issue.likeCount ?? 0}
                initialLiked={issue.liked ?? false}
              />
            </ColophonTools>
          </ArticleColophon>

          <ShareCard
            open={shareCardDialog.open}
            onClose={shareCardDialog.closeDialog}
            data={shareCardData}
          />

          <ArticleExporter
            open={articleExportDialog.open}
            onClose={articleExportDialog.closeDialog}
            data={articleExportData}
          />

          <PostComments issueNumber={issue.number} />

          <PostToolbar prevIssue={prevIssue} nextIssue={nextIssue} currentNumber={issue.number} total={total} position={position} />
        </MainColumn>

        <TocAside aria-label='文章目录与操作'>
          {tocResult.toc.length > 0 && (
            <>
              <TocTitle>目录</TocTitle>
              {renderToc()}
            </>
          )}
          <TocTools>
            <FloatingActions
              variant='compact'
              issueNumber={issue.number}
              initialLikeCount={issue.likeCount ?? 0}
              initialLiked={issue.liked ?? false}
            />
          </TocTools>
        </TocAside>
      </ContentGrid>
    </Container>
  )
}
