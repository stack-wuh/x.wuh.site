'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '@wuh.site/components/button'
import dynamic from 'next/dynamic'
import LinkGroup from '@wuh.site/components/link-group'
import Tag from '@wuh.site/components/tag'

const Dialog = dynamic(() => import('@wuh.site/components/dialog'))
const ContactCard = dynamic(() => import('./components/ContactCard'), {
  loading: () => null,
})
import { IconMusic, IconDiscord, DiamondDivider } from '@wuh.site/components/icons'
import type { RepoDto, WereadBook, PostListItem } from '@wuh.site/shared-contracts'
import * as S from './styles'

const TAG_DISPLAY_LIMIT = 3

type Props = {
  repos: RepoDto[]
  posts: PostListItem[]
  yearlySummaries: {
    id: number
    number: number
    title: string
    created_at: string
  }[]
  wereadBooks: WereadBook[]
}

import { CONTACT_CONFIG, type ContactType, type ContactDialogConfig } from './components/ContactConfig'

const groupByYear = (posts: Props['posts']) => {
  const map = new Map<number, Props['posts']>()
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
    <div ref={ref}>
      {visible ? children : <S.SectionSkeleton />}
    </div>
  )
}

/**
 * 首页视图，展示 Hero、格言、社交链接、精选博客、年度总结、微信读书、精选项目等板块。
 */
export default function HomeView({ repos, posts, yearlySummaries, wereadBooks }: Props) {
  const [activeContact, setActiveContact] = useState<ContactType | null>(null)
  const openContact = useCallback((type: ContactType) => setActiveContact(type), [])
  const closeContact = useCallback(() => setActiveContact(null), [])
  const activeContactConfig = activeContact ? CONTACT_CONFIG[activeContact] : null

  const yearGroups = useMemo(() => groupByYear(posts), [posts])
  return (
    <S.Root>
      <S.Main>
        <S.Hero>
          <S.StyledLogo src='/logo.svg' alt='wuh.site.logo' width={64} height={38.4} priority />
          <S.SiteTitle>wuh.site&nbsp;&middot;&nbsp;朝朝如念</S.SiteTitle>
          <S.SiteTagline>雾失楼台，月迷津渡</S.SiteTagline>
        </S.Hero>

        <S.Motto>
          写作是抵抗遗忘的方式，代码是构建世界的语言。
        </S.Motto>

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
              { type: 'email', href: 'mailto:wuh131420@foxmail.com', title: '邮箱' },
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
            <S.MoreLink href='/blog'>全部博客&nbsp;&rarr;</S.MoreLink>
          </S.SectionHeader>
          {posts.length === 0 ? (
            <S.EmptyHint>暂时无法获取 Issues 数据</S.EmptyHint>
          ) : (
            <S.Timeline>
              {yearGroups.map(([year, yearPosts]) => (
                <S.YearGroup key={year}>
                  <S.YearLabel>{year}</S.YearLabel>
                  {yearPosts.map(post => (
                    <S.PostRow key={post.id} href={`/post/${post.number}`}>
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
                        <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                        <S.MetaDot />
                        <span>{post.comments}</span>
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
          {yearlySummaries.length === 0 ? (
            <S.EmptyHint>暂无年度总结</S.EmptyHint>
          ) : (
            <S.ProjectList>
              {yearlySummaries.map(item => (
                <S.PostRow key={item.id} href={`/post/${item.number}`}>
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
              {wereadBooks.length > 0 && <S.MoreLink href='/weread'>全部&nbsp;&rarr;</S.MoreLink>}
            </S.SectionHeader>
            {wereadBooks.length === 0 ? (
              <S.EmptyHint>暂无书架数据</S.EmptyHint>
            ) : (
              <S.BooksList>
                {wereadBooks.map((book) => (
                  <S.BookRow key={book.bookId}>
                    <S.BookCover src={book.cover || ''} alt={book.title} width={32} height={42} />
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
          {repos.length === 0 ? (
            <S.EmptyHint>暂时无法获取 GitHub 数据</S.EmptyHint>
          ) : (
            <S.ProjectList>
              {repos.map(repo => (
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
