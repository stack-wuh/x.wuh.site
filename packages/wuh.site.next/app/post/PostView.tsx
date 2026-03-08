'use client'

import Link from 'next/link'
import ImagePreview from '@wuh.site/components/image-preview'
import SharedLinkGroup, { type ShareItem } from '@wuh.site/components/shared-link-group'
import Tag from '@wuh.site/components/tag'

import {
  ArticleCard,
  Container,
  Empty,
  Header,
  MarkdownBody,
  MetaRow,
  TagGroup,
  Title,
  Toolbar,
} from './styles'
import { type Issue, type PostViewProps } from './PostView.types'
import { usePostImagePreview } from './usePostImagePreview'

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

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

export default function PostView({ issue }: PostViewProps) {
  const { containerRef, previewProps } = usePostImagePreview(issue?.body_html)

  if (!issue) {
    return (
      <Container>
        <Empty>未找到文章或网络错误</Empty>
        <Toolbar>
          <Link href='/'>返回首页</Link>
          <a href='https://github.com/stack-wuh/blog/issues' target='_blank' rel='noopener noreferrer'>
            查看全部博客
          </a>
        </Toolbar>
      </Container>
    )
  }

  const date = new Date(issue.created_at).toLocaleDateString()
  const shareItems = createShareItems(issue)

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
              {issue.labels.slice(0, 4).map((label) => (
                <Tag key={`${issue.id}-${label.name}`} label={label.name} color={label.color} />
              ))}
            </TagGroup>
          ) : null}
        </MetaRow>
      </Header>

      <ArticleCard>
        <MarkdownBody className='markdown-body' dangerouslySetInnerHTML={{ __html: issue.body_html ?? '' }} />
      </ArticleCard>

      <ImagePreview {...previewProps} />
      <SharedLinkGroup items={shareItems} size='medium' label='分享到' />

      <Toolbar>
        <Link href='/'>返回首页</Link>
        <a href={issue.html_url} target='_blank' rel='noopener noreferrer'>
          在 GitHub 查看
        </a>
      </Toolbar>
    </Container>
  )
}
