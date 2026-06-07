'use client'

import { useCallback, useMemo, useState } from 'react'
import Button from '@wuh.site/components/button'
import Dialog from '@wuh.site/components/dialog'
import LinkGroup from '@wuh.site/components/link-group'
import Tag from '@wuh.site/components/tag'
import ContactCard, { type ContactCardProps } from './components/ContactCard'
import { IconMusic, IconDiscord, DiamondDivider } from '@wuh.site/components/icons'
import type { RepoDto, WereadBook, PostListItem } from '@wuh.site/shared-contracts'
import * as S from './styles'

const TAG_DISPLAY_LIMIT = 3

type TagItem = {
  name: string
  color?: string | null
}

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

type ContactDialogConfig = ContactCardProps

const CONTACT_CONFIG: Record<'wechat' | 'qq' | 'twitter' | 'github' | 'douban' | 'netease' | 'discord', ContactDialogConfig> = {
  wechat: {
    badge: 'WeChat',
    qrSrc: 'https://cdn.wuh.site/web/wechat.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: '工程化 & 可视化',
    tagline: '代码写诗，工具作画',
    hints: ['扫码即可开启一场 1:1 对话', '备注「官网来访」我们会更快相遇'],
  },
  qq: {
    badge: 'QQ',
    qrSrc: 'https://cdn.wuh.site/web/qq.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: '实时沟通',
    tagline: '山海皆可平，何况是聊个天',
    hints: ['扫码即刻语音或文字交流', '备注「官网来访」我们会更快相遇'],
  },
  twitter: {
    badge: 'Twitter',
    linkUrl: 'https://x.com/wuh131420',
    linkLabel: '前往 Twitter 主页',
    name: 'wuh131420',
    handle: '@wuh131420',
    title: 'Twitter',
    tagline: '碎片灵感，即时分享',
    hints: ['技术观察 & 灵感速写 & 碎碎念'],
  },
  github: {
    badge: 'GitHub',
    linkUrl: 'https://github.com/stack-wuh',
    linkLabel: '前往 GitHub 主页',
    name: 'stack-wuh',
    handle: '@stack-wuh',
    title: 'GitHub',
    tagline: '开源是一种信仰',
    hints: ['你是什么样的人，就会看到什么样的代码'],
  },
  douban: {
    badge: '豆瓣',
    linkUrl: 'https://www.douban.com/people/wuh-site/?_i=6001540Kgx5FFN',
    linkLabel: '前往豆瓣主页',
    name: 'wuh.site',
    handle: 'wuh-site',
    title: '豆瓣',
    tagline: '书影音标记，精神自留地',
    hints: ['标记过的书影音，构成了一个人的轮廓'],
  },
  netease: {
    badge: '网易云',
    linkUrl: 'https://music.163.com/#/user/home?id=398326271',
    linkLabel: '前往网易云主页',
    name: 'stack-wuh',
    handle: 'wuh131420',
    title: '网易云音乐',
    tagline: '算法推荐不了一颗有趣的灵魂',
    hints: ['用耳朵投票，每一首都算数'],
  },
  discord: {
    badge: 'Discord',
    linkUrl: 'https://discord.com/users/shadowoo1995',
    linkLabel: '前往 Discord',
    name: 'shadowoo1995',
    handle: '@shadowoo1995',
    title: 'Discord',
    tagline: '语音频道见，比 issue 更快',
    hints: ['技术闲聊 & 问题讨论 & 摸鱼胜地'],
  },
}

type ContactType = keyof typeof CONTACT_CONFIG

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
                  <S.BookCover $src={book.cover || undefined} />
                  <S.BookInfo>
                    <S.BookTitle>{book.title}</S.BookTitle>
                    <S.BookMeta>{book.author}{book.finishReading ? ' · 已读完' : ' · 阅读中'}</S.BookMeta>
                  </S.BookInfo>
                </S.BookRow>
              ))}
            </S.BooksList>
          )}
        </S.Section>

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
