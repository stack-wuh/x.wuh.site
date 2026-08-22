'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '@wuh.site/components/button'
import dynamic from 'next/dynamic'
import LinkGroup from '@wuh.site/components/link-group'
import Tag from '@wuh.site/components/tag'

const Dialog = dynamic(() => import('@wuh.site/components/dialog'))
const TypewriterMotto = dynamic(() => import('../components/TypewriterMotto'), {
  loading: () => <S.MottoSkeleton />,
})
const ContactCard = dynamic(() => import('../components/ContactCard'), {
  loading: () => null,
})
import { IconMusic, IconDiscord, DiamondDivider, IconBookOpen, IconCalendar, IconLibrary, IconFolderGit2, IconChevronRight } from '@wuh.site/components/icons'
import type { ContentItem, RepoDto, WereadBook } from '@wuh.site/core'
import { contentService, reposService, wereadService } from '@wuh.site/core/endpoints'
import { buildPostUrl } from '../lib/slug'
import { formatShortDate } from '../lib/date'
import * as S from '../styles'
import Empty from '@wuh.site/components/empty'
import { CONTACT_CONFIG, type ContactType } from '../components/ContactConfig'
import type { HomeViewProps } from './specs'

const TAG_DISPLAY_LIMIT = 3

const groupByYear = (posts: HomeViewProps['posts']) => {
  const map = new Map<number, HomeViewProps['posts']>()
  posts.forEach(post => {
    const year = new Date(post.created_at).getFullYear()
    const list = map.get(year)
    if (list) {
      list.push(post)
    } else {
      map.set(year, [post])
    }
  })
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
}

/** 装饰分隔线 */
function OrnamentDivider() {
  return (
    <S.DividerRow aria-hidden='true'>
      <S.DividerLine />
      <DiamondDivider />
      <S.DividerLine />
    </S.DividerRow>
  )
}

function LazySection({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {visible ? children : <S.SectionSkeleton />}
    </div>
  )
}

/**
 * 首页视图，展示 Hero、格言、社交链接、精选博客、年度总结、微信读书、精选项目等板块。
 */
export default function HomeView({ repos, posts, yearlySummaries, wereadBooks }: HomeViewProps) {
  const [activeContact, setActiveContact] = useState<ContactType | null>(null)
  const openContact = useCallback((type: ContactType) => setActiveContact(type), [])
  const closeContact = useCallback(() => setActiveContact(null), [])
  const activeContactConfig = activeContact ? CONTACT_CONFIG[activeContact] : null

  const { data: reposData } = reposService.getAll.use({ query: { limit: '6' } })
  const { data: summariesData } = contentService.getPosts.use({ query: { limit: '50', state: 'open' } })
  const { data: booksData } = wereadService.getBooks.use({ query: { page: '1', limit: '6', finishReading: '0' } })
  const clientRepos = reposData ? ((reposData as any).repos || []).slice(0, 6) as RepoDto[] : repos
  const clientSummaries = summariesData
    ? (((summariesData as any).data || []) as ContentItem[])
        .filter((item) => item.title.includes('年度总结'))
        .slice(0, 3)
        .map((item) => ({
          id: item.externalId,
          number: item.number,
          title: item.title,
          created_at: item.createdAtGitHub,
        }))
    : yearlySummaries
  const clientBooks = booksData ? (((booksData as any).data || []) as WereadBook[]) : wereadBooks

  const yearGroups = useMemo(() => groupByYear(posts), [posts])
  return (
    <S.Root>
      <S.Main>
        <S.Hero>
          <S.StyledLogo role='logo' src='/logo.svg' alt='wuh.site.logo' width={64} height={38.4} priority />
          <S.SiteTitle>wuh.site&nbsp;&middot;&nbsp;朝朝如念</S.SiteTitle>
          <S.SiteTagline>雾失楼台，月迷津渡</S.SiteTagline>
        </S.Hero>

        <TypewriterMotto />

        <S.Ctas>
          <Button href='/blog' variant='outlined' color='primary' size='small'>查看博客</Button>
          <Button href='/about' variant='outlined' color='secondary' size='small'>关于我</Button>
        </S.Ctas>
        <S.SocialRow>
          <LinkGroup
            items={[
              { type: 'wechat', title: '微信', onClick: () => openContact('wechat') },
              { type: 'qq', title: 'QQ', onClick: () => openContact('qq') },
              { type: 'twitter', title: 'Twitter', onClick: () => openContact('twitter') },
              { type: 'email', href: 'mailto:wuh131420@foxmail.com', title: '邮箱', hideOnMobile: true },
              { type: 'github', title: 'GitHub', onClick: () => openContact('github') },
              { type: 'douban', title: '豆瓣', onClick: () => openContact('douban') },
              { type: 'custom', title: '网易云', icon: <IconMusic />, onClick: () => openContact('netease') },
              { type: 'custom', title: 'Discord', icon: <IconDiscord />, onClick: () => openContact('discord') },
            ]}
            size='medium'
          />
        </S.SocialRow>

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>精选博客</S.SectionTitle>
            <Button href='/blog' variant='text' color='secondary' size='small' icon={<IconChevronRight />} iconPosition='right'>全部博客</Button>
          </S.SectionHeader>
          {posts.length === 0 ? (
            <Empty icon={<IconBookOpen />} title="暂无博客" description="获取 Issues 数据失败，请稍后重试" />
          ) : (
            <S.Timeline>
              {yearGroups.map(([year, yearPosts]) => (
                <S.YearGroup key={year}>
                  <S.YearLabel>{year}</S.YearLabel>
                  {yearPosts.map(post => (
                    <S.PostRow key={post.id} href={buildPostUrl(post.number, post.title)}>
                      <S.InkDot />
                      <S.PostTitle>{post.title}</S.PostTitle>
                      {post.labels?.length > 0 && (
                        <S.PostTags>
                          {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                            <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                          ))}
                        </S.PostTags>
                      )}
                      <S.PostMeta>
                        <span>{formatShortDate(post.created_at)}</span>
                        <S.MetaDot />
                        <span>{post.views} 浏览</span>
                      </S.PostMeta>
                    </S.PostRow>
                  ))}
                </S.YearGroup>
              ))}
            </S.Timeline>
          )}
        </S.Section>

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>年度总结</S.SectionTitle>
          </S.SectionHeader>
          {clientSummaries.length === 0 ? (
            <Empty icon={<IconCalendar />} title="暂无年度总结" description="还没有年度回顾文章" />
          ) : (
            <S.ProjectList>
              {clientSummaries.map(item => (
                <S.PostRow key={item.id} href={buildPostUrl(item.number, item.title)}>
                  <S.InkDot />
                  <S.PostTitle>{item.title}</S.PostTitle>
                  <S.PostMeta>
                    <span>{new Date(item.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                  </S.PostMeta>
                </S.PostRow>
              ))}
            </S.ProjectList>
          )}
        </S.Section>

        <OrnamentDivider />

        <LazySection>
          <S.Section>
            <S.SectionHeader>
              <S.SectionTitle>微信读书</S.SectionTitle>
              {clientBooks.length > 0 && <Button href='/weread' variant='text' color='secondary' size='small' icon={<IconChevronRight />} iconPosition='right'>我的书架</Button>}
            </S.SectionHeader>
            {clientBooks.length === 0 ? (
              <Empty icon={<IconLibrary />} title="暂无书架" description="微信读书同步后这里会展示" actions={[{ label: '去看看书架', href: '/weread' }]} />
            ) : (
              <S.BooksList>
                {clientBooks.map((book) => (
                  <S.BookRow key={book.bookId}>
                    <S.BookCover role='book-cover' src={book.cover || ''} alt={book.title} width={36} height={54} />
                    <S.BookInfo>
                      <S.BookTitle>{book.title}</S.BookTitle>
                      <S.BookMeta>{book.author}{book.finishReading ? ' · 已读完' : ' · 阅读中'}</S.BookMeta>
                    </S.BookInfo>
                  </S.BookRow>
                ))}
              </S.BooksList>
            )}
          </S.Section>
        </LazySection>

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>精选项目</S.SectionTitle>
          </S.SectionHeader>
          {clientRepos.length === 0 ? (
            <Empty icon={<IconFolderGit2 />} title="暂无项目" description="获取 GitHub 数据失败，请稍后重试" />
          ) : (
            <S.ProjectList>
              {clientRepos.map(repo => (
                <S.ProjectLink
                  key={repo.html_url}
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <S.ProjectName>{repo.name}</S.ProjectName>
                  {repo.description && <S.ProjectDesc>{repo.description}</S.ProjectDesc>}
                  <S.ProjectMeta>{repo.language ?? ''}{repo.stargazers_count > 0 ? ` \u00b7 \u2606 ${repo.stargazers_count}` : ''}</S.ProjectMeta>
                </S.ProjectLink>
              ))}
            </S.ProjectList>
          )}
        </S.Section>

        <Dialog
          open={Boolean(activeContactConfig)}
          onClose={closeContact}
          title={activeContactConfig ? `${activeContactConfig.badge} 联系` : '联系'}
          fullScreen={false}
          width='min(760px, calc(100vw - 32px))'
        >
          {activeContactConfig && <ContactCard {...activeContactConfig} />}
        </Dialog>
      </S.Main>
    </S.Root>
  )
}
