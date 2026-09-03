'use client'

import message from '@wuh.site/components/message'
import ImagePreview from '@wuh.site/components/image-preview'
import Divider from '@wuh.site/components/divider'
import { useEffect, useRef, type ReactNode } from 'react'
import {
  IconShare,
  IconArticle,
  IconWechat,
  IconQQ,
  IconWeibo,
  IconTwitter,
  IconEmail,
  IconLink,
  IconChevronDown,
} from '@wuh.site/components/icons'
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
import {
  Container,
  ContentGrid,
  MainColumn,
  MarkdownBody,
  UpdateDivider,
  PostLead,
  StatusEmpty,
  ArticleColophon,
  ColophonLicense,
  ColophonMeta,
  ColophonShareRow,
  ShareIconButton,
  ColophonTools,
  TocAside,
  TocTitle,
  TocScroller,
  TocItemLink,
  TocList,
  TocNum,
  TocTools,
  TocPrevNext,
  TocInfo,
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

/** 分享行数据：页面级渲染原型 cbtn 圆钮，不再经过 SharedLinkGroup */
type ShareAction = {
  key: string
  label: string
  icon: ReactNode
  href?: string
  onClick?: () => void
}

const createShareItems = (issue: Issue): ShareAction[] => {
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
      key: 'wechat',
      label: '分享到微信',
      icon: <IconWechat />,
      onClick: () => openWechatShareWindow(siteUrl, shareTitle),
    },
    {
      key: 'qq',
      label: '分享到QQ',
      icon: <IconQQ />,
      onClick: () => openSharePopup(qqShareUrl, 'share-qq'),
    },
    {
      key: 'weibo',
      label: '分享到微博',
      icon: <IconWeibo />,
      onClick: () => openSharePopup(weiboShareUrl, 'share-weibo'),
    },
    {
      key: 'twitter',
      label: '分享到Twitter',
      icon: <IconTwitter />,
      onClick: () => openSharePopup(twitterShareUrl, 'share-twitter'),
    },
    {
      key: 'email',
      icon: <IconEmail />,
      href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`查看这篇文章：${siteUrl}`)}`,
      label: '邮件分享',
    },
    {
      key: 'link',
      label: '复制链接',
      icon: <IconLink />,
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
  const tocScrollerRef = useRef<HTMLDivElement>(null)

  // 阅读位置变化 → active 条目在纸卷内居中跟随。命令式滚动而非监听，
  // 遵守「详情页禁止 scroll/resize 监听」约束；reduced-motion 直接跳转
  useEffect(() => {
    const scroller = tocScrollerRef.current
    if (!scroller || !activeHeading) return
    const active = scroller.querySelector<HTMLElement>('[data-active="true"]')
    if (!active) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = active.offsetTop - scroller.clientHeight / 2 + active.offsetHeight / 2
    scroller.scrollTo({ top: Math.max(0, target), behavior: reduce ? 'auto' : 'smooth' })
  }, [activeHeading])
  const activeTocItem = activeHeading
    ? tocResult.toc.find((item) => item.id === activeHeading) ?? null
    : null
  const shareCardDialog = useDialog()
  const articleExportDialog = useDialog()

  const renderToc = () => (
    <TocList>
      {tocResult.toc.map((item) => (
        <li key={item.id}>
          <TocItemLink
            href={`#${item.id}`}
            $active={activeHeading ? activeHeading === item.id : false}
            data-active={activeHeading === item.id}
            $depth={item.depth}
            onClick={(e) => {
              e.preventDefault()
              const target = document.getElementById(item.id)
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(null, '', `#${item.id}`)
              }
              e.currentTarget.closest('details')?.removeAttribute('open')
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
        <PostToolbar prevIssue={null} nextIssue={null} total={total} position={position} />
      </Container>
    )
  }

  const wasEdited = Boolean(issue.updated_at && issue.updated_at !== issue.created_at)
  const updatedDate = wasEdited && issue.updated_at ? issue.updated_at.slice(0, 10) : null
  const sourceLink = createSourceLink(issue)
  const projectLink = createProjectLink(issue)
  const shareItems: ShareAction[] = [
    ...createShareItems(issue),
    {
      key: 'share-card',
      label: '分享图',
      icon: <IconShare />,
      onClick: shareCardDialog.openDialog,
    },
    {
      key: 'article-export',
      label: '导出全文',
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
                <span className='toc-m-label'>
                  <span className='toc-m-title'>
                    目录
                    <span className='toc-m-count'>共 {tocResult.toc.length} 节</span>
                  </span>
                  {activeTocItem && (
                    <span className='toc-m-now'>
                      读至 ·{activeTocItem.shortNum && (
                        <span className='toc-m-now-num' aria-hidden='true'>{activeTocItem.shortNum}</span>
                      )}
                      {activeTocItem.text}
                    </span>
                  )}
                </span>
                <span className='toc-m-toggle' aria-hidden='true'>
                  <IconChevronDown size={14} strokeWidth={2} />
                </span>
              </summary>
              <div className='toc-body'>
                {renderToc()}
              </div>
            </TocMobile>
          )}

          <MarkdownBody className='markdown-body' dangerouslySetInnerHTML={{ __html: tocResult.html }} />
          {updatedDate && <UpdateDivider>更新于 {updatedDate}</UpdateDivider>}

          <RelatedPosts number={issue.number} labels={issue.labels.map((label) => label.name)} />

          <ImagePreview {...previewProps} />

          <ArticleColophon>
            <Divider variant='ornament' aria-hidden='true' />
            <ColophonLicense>{COPYRIGHT_TEXT}</ColophonLicense>
            <ColophonMeta>
              <a href={sourceLink.href} target='_blank' rel='noopener noreferrer'>{sourceLink.label}</a>
              {' · '}
              <a href={projectLink.href} target='_blank' rel='noopener noreferrer'>{projectLink.label}</a>
            </ColophonMeta>
            <ColophonShareRow>
              {shareItems.map((item) =>
                item.href ? (
                  <ShareIconButton
                    key={item.key}
                    as='a'
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    title={item.label}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </ShareIconButton>
                ) : (
                  <ShareIconButton key={item.key} type='button' title={item.label} aria-label={item.label} onClick={item.onClick}>
                    {item.icon}
                  </ShareIconButton>
                ),
              )}
            </ColophonShareRow>
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
              <TocScroller ref={tocScrollerRef}>{renderToc()}</TocScroller>
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

          {(prevIssue || nextIssue) && (
            <TocPrevNext aria-label='前后篇'>
              {prevIssue ? (
                <a href={buildPostUrl(prevIssue.number)} data-dir='prev'>
                  <span className='toc-pn-label'>
                    <span className='toc-pn-arrow' aria-hidden='true'>‹</span>
                    天才向左
                  </span>
                  <span className='toc-pn-title'>{prevIssue.title}</span>
                </a>
              ) : (
                <span className='toc-pn-empty'>已是最早一篇</span>
              )}
              {nextIssue ? (
                <a href={buildPostUrl(nextIssue.number)} data-dir='next'>
                  <span className='toc-pn-label'>
                    疯子向右
                    <span className='toc-pn-arrow' aria-hidden='true'>›</span>
                  </span>
                  <span className='toc-pn-title'>{nextIssue.title}</span>
                </a>
              ) : (
                <span className='toc-pn-empty'>已是最新一篇</span>
              )}
            </TocPrevNext>
          )}

          <TocInfo>
            <span>
              第 {position ?? issue.number}
              {typeof total === 'number' ? ` / ${total} 篇` : ' 篇'}
            </span>
            <span>发布于 {issue.created_at.slice(0, 10)}</span>
            {updatedDate && <span>更新于 {updatedDate}</span>}
            <span>
              约 {Math.max(1, Math.round((issue.body_html ?? '').replace(/<[^>]+>/g, '').length / 450))} 分钟读完
            </span>
          </TocInfo>
        </TocAside>
      </ContentGrid>
    </Container>
  )
}
