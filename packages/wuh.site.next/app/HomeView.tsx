'use client'
import { useCallback, useMemo, useState } from 'react'
import styled from '@wuh.site/components/styled'
import Link from 'next/link'
import Button from '@wuh.site/components/button'
import Dialog from '@wuh.site/components/dialog'
import LinkGroup from '@wuh.site/components/link-group'
import Tag from '@wuh.site/components/tag'
import Image from '@wuh.site/components/image'
import ContactCard, { type ContactCardProps } from './components/ContactCard'
import { IconMusic, IconDiscord, DiamondDivider } from '@wuh.site/components/icons'

const TAG_DISPLAY_LIMIT = 3

type Repo = {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  homepage: string | null
  fork: boolean
}

type TagItem = {
  name: string
  color?: string | null
}

type Props = {
  repos: Repo[]
  posts: {
    id: number
    number: number
    title: string
    html_url: string
    comments: number
    created_at: string
    labels: TagItem[]
  }[]
  yearlySummaries: {
    id: number
    number: number
    title: string
    created_at: string
  }[]
}

type BookItem = {
  title: string
  author: string
  cover: string
  progress: string
}

const WECHAT_BOOKS: BookItem[] = [
  { title: '代码整洁之道', author: 'Robert C. Martin', cover: '', progress: '阅读中 60%' },
  { title: '深入理解计算机系统', author: 'Randal E. Bryant', cover: '', progress: '阅读中 30%' },
]

const TECH_STACK = [
  'React', 'TypeScript', 'Next.js', 'NestJS', 'Node.js',
  'MongoDB', 'PostgreSQL', 'Docker', 'GitHub Actions',
]

/* ====== Styled Components ====== */

const Root = styled.div`
  font-family: var(--font-sans);
  background: transparent;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: clamp(16px, 2.4vw, 48px) clamp(16px, 5vw, 48px);
`

const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  gap: var(--space-lg);
  padding: clamp(24px, 3vw, 48px) clamp(12px, 3vw, 40px);
`

/* Hero */
const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-xl) 0 var(--space-md);
`

const StyledLogo = styled(Image).attrs({
  showSkeleton: false,
  inline: true,
  appearance: 'plain',
  imageClassName: 'logo-img'
})`
  width: fit-content;

  .logo-img {
    display: block;
    transition: filter 0.2s ease;
    width: 64px;
    height: auto;
  }

  @media (prefers-color-scheme: dark) {
    .logo-img {
      filter: invert();
    }
  }
`

const SiteTitle = styled.p`
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  margin-top: var(--space-xs);
`

const SiteTagline = styled.p`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  letter-spacing: 0.06em;
`

/* Motto/格言区 */
const Motto = styled.blockquote`
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.8;
  color: var(--text-secondary);
  text-align: center;
  padding: var(--space-md) 0;
  border-left: none;
  position: relative;
  margin: 0 auto;

  @media (max-width: 520px) {
    max-width: 320px;
  }

  &::after {
    content: '';
    display: block;
    width: 28px;
    height: 2px;
    margin: var(--space-md) auto 0;
    background: var(--accent-color);
    opacity: 0.5;
  }
`

/* CTA 区域 */
const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  margin-top: var(--space-xs);
`

const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: var(--space-xs);
`

/* 装饰分隔线 */
const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 360px;
  margin: var(--space-md) auto;
  color: var(--text-muted);
  opacity: 0.5;
`

const DividerLine = styled.span`
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.35;
`

/** 装饰分隔线 SVG */
const OrnamentDivider = () => (
  <DividerRow aria-hidden='true'>
    <DividerLine />
    <DiamondDivider />
    <DividerLine />
  </DividerRow>
)

/* Section */
const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--space-md);
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
`

const SectionTitle = styled.h2`
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.03em;
`

const MoreLink = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast) ease;
  font-family: var(--font-serif);

  &:hover {
    color: var(--primary-color);
    text-decoration: none;
  }
`

/* Blog Timeline */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`

const YearGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const YearLabel = styled.div`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--space-xs) 0;
  letter-spacing: 0.05em;
  border-bottom: 1px solid color-mix(in oklab, var(--text-muted) 25%, transparent);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--text-muted) 20%, transparent);
  }
`

const PostRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color var(--transition-fast) ease, padding-left var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    padding-left: 12px;
    text-decoration: none;
  }

  @media (max-width: 520px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`

const InkDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  flex-shrink: 0;
`

const PostTitle = styled.span`
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
  }
`

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.5;
`

const PostTags = styled.span`
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
    width: 100%;
  }
`

/* Projects section (compact text link list) */
const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

const ProjectLink = styled.a`
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    text-decoration: none;
  }

  @media (max-width: 520px) {
    flex-wrap: wrap;
  }
`

const ProjectName = styled.span`
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  min-width: fit-content;
`

const ProjectDesc = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 520px) {
    white-space: normal;
  }
`

const ProjectMeta = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-left: auto;
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: 0;
  }
`

const Empty = styled.div`
  text-align: center;
  color: var(--text-muted);
  padding: var(--space-xl) 0;
  font-size: var(--font-size-sm);
`

/* Books */
const BooksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

const BookRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
`

const BookCover = styled.div<{ $src?: string }>`
  width: 32px;
  height: 42px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'var(--background-300)')};
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
`

const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const BookTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
`

const BookMeta = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 2px;
`

/* Tech Stack */
const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  padding-bottom: var(--space-md);
`

const TechTag = styled.span`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  background: color-mix(in oklab, var(--primary-color) 10%, transparent);
  border: 1px solid color-mix(in oklab, var(--primary-color) 18%, transparent);
`

/* ====== Contact Config ====== */

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

/* ====== Helpers ====== */

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
  const sorted = Array.from(map.entries()).sort((a, b) => b[0] - a[0])
  return sorted
}

/* ====== Component ====== */

export default function HomeView({ repos, posts, yearlySummaries }: Props) {
  const [activeContact, setActiveContact] = useState<ContactType | null>(null)
  const openContact = useCallback((type: ContactType) => setActiveContact(type), [])
  const closeContact = useCallback(() => setActiveContact(null), [])
  const activeContactConfig = activeContact ? CONTACT_CONFIG[activeContact] : null

  const yearGroups = useMemo(() => groupByYear(posts), [posts])
  const summaryYearGroups = useMemo(() => groupByYear(yearlySummaries), [yearlySummaries])

  return (
    <Root>
      <Main>
        {/* Hero */}
        <Hero>
          <StyledLogo src='/logo.svg' alt='wuh.site.logo' width={64} height={38.4} priority />
          <SiteTitle>wuh.site&nbsp;&middot;&nbsp;朝朝如念</SiteTitle>
          <SiteTagline>雾失楼台，月迷津渡</SiteTagline>
        </Hero>

        {/* 格言区 */}
        <Motto>
          写作是抵抗遗忘的方式，代码是构建世界的语言。
        </Motto>

        {/* CTA & 社交 */}
        <Ctas>
          <Button href='/blog' variant='outlined' color='primary' size='small'>
            查看博客
          </Button>
          <Button href='/about' variant='outlined' color='secondary' size='small'>
            关于我
          </Button>
        </Ctas>
        <SocialRow>
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
        </SocialRow>

        <OrnamentDivider />

        {/* 精选博客 */}
        <Section>
          <SectionHeader>
            <SectionTitle>精选博客</SectionTitle>
            <MoreLink href='/blog'>全部博客&nbsp;&rarr;</MoreLink>
          </SectionHeader>
          {posts.length === 0 ? (
            <Empty>暂时无法获取 Issues 数据</Empty>
          ) : (
            <Timeline>
              {yearGroups.map(([year, yearPosts]) => (
                <YearGroup key={year}>
                  <YearLabel>{year}</YearLabel>
                  {yearPosts.map(post => (
                    <PostRow key={post.id} href={`/post/${post.number}`}>
                      <InkDot />
                      <PostTitle>{post.title}</PostTitle>
                      {post.labels?.length > 0 && (
                        <PostTags>
                          {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                            <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                          ))}
                        </PostTags>
                      )}
                      <PostMeta>
                        <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                        <MetaDot />
                        <span>{post.comments}</span>
                      </PostMeta>
                    </PostRow>
                  ))}
                </YearGroup>
              ))}
            </Timeline>
          )}
        </Section>

        <OrnamentDivider />

        {/* 年度总结 */}
        {yearlySummaries.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>年度总结</SectionTitle>
            </SectionHeader>
            <Timeline>
              {summaryYearGroups.map(([year, items]) => (
                <YearGroup key={year}>
                  <YearLabel>{year}</YearLabel>
                  {items.map(item => (
                    <PostRow key={item.id} href={`/post/${item.number}`}>
                      <InkDot />
                      <PostTitle>{item.title}</PostTitle>
                      <PostMeta>
                        <span>{new Date(item.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                      </PostMeta>
                    </PostRow>
                  ))}
                </YearGroup>
              ))}
            </Timeline>
          </Section>
        )}

        <OrnamentDivider />

        {/* 微信读书 */}
        <Section>
          <SectionHeader>
            <SectionTitle>微信读书</SectionTitle>
          </SectionHeader>
          <BooksList>
            {WECHAT_BOOKS.map((book) => (
              <BookRow key={book.title}>
                <BookCover $src={book.cover || undefined} />
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookMeta>{book.author} · {book.progress}</BookMeta>
                </BookInfo>
              </BookRow>
            ))}
          </BooksList>
        </Section>

        <OrnamentDivider />

        {/* 技术栈 + 开源项目 */}
        <Section>
          <SectionHeader>
            <SectionTitle>技术 &amp; 项目</SectionTitle>
          </SectionHeader>
          <TechList>
            {TECH_STACK.map((tech) => (
              <TechTag key={tech}>{tech}</TechTag>
            ))}
          </TechList>
          {repos.length === 0 ? (
            <Empty>暂时无法获取 GitHub 数据</Empty>
          ) : (
            <ProjectList>
              {repos.map(repo => (
                <ProjectLink
                  key={repo.html_url}
                  href={repo.homepage || repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <ProjectName>{repo.name}</ProjectName>
                  {repo.description && <ProjectDesc>{repo.description}</ProjectDesc>}
                  <ProjectMeta>{repo.language ?? ''}{repo.stargazers_count > 0 ? ` \u00b7 \u2606 ${repo.stargazers_count}` : ''}</ProjectMeta>
                </ProjectLink>
              ))}
            </ProjectList>
          )}
        </Section>

        {/* Contact Dialog */}
        <Dialog
          open={Boolean(activeContactConfig)}
          onClose={closeContact}
          title={activeContactConfig ? `${activeContactConfig.badge} 联系` : '联系'}
          fullScreen={false}
          width='min(760px, calc(100vw - 32px))'
        >
          {activeContactConfig && <ContactCard {...activeContactConfig} />}
        </Dialog>
      </Main>
    </Root>
  )
}
