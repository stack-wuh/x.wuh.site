'use client'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Button from '@wuh.site/components/button'
import Dialog from '@wuh.site/components/dialog'
import LinkGroup from '@wuh.site/components/link-group'
import Tag from '@wuh.site/components/tag'
import Image from '@wuh.site/components/image'
import ContactCard, { type ContactCardProps } from './components/ContactCard'

const IconMusic = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M12 3v12.15a3 3 0 1 0 1 2.83V7.83l6-1.5V3l-7 1.75Z' />
  </svg>
)

const BREAKPOINTS = {
  mobile: '640px',
  tablet: '1024px',
  desktop: '1280px'
}

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
}

const Root = styled.div`
  font-family: var(--font-geist-sans);
  background: transparent;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: clamp(16px, 2.4vw, 48px) clamp(16px, 5vw, 48px);
`

const Main = styled.main`
  width: min(1080px, 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: flex-start;
  gap: var(--space-lg);
  padding: clamp(16px, 2.4vw, 40px) clamp(12px, 3vw, 40px);
`

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  width: 100%;
`

const HeroCard = styled.div`
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--normal-300) 55%, transparent);
  background:
    radial-gradient(circle at 92% 0%, color-mix(in oklab, var(--accent-color) 22%, transparent), transparent 55%),
    radial-gradient(circle at 0% 12%, color-mix(in oklab, var(--primary-color) 18%, transparent), transparent 52%),
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-100) 92%, white 8%),
      var(--background-100)
    );
  box-shadow: var(--elevation-card);
  padding: clamp(16px, 2.4vw, 32px);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  overflow: hidden;

  @media (min-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }
`

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
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
  }

  @media (prefers-color-scheme: dark) {
    .logo-img {
      filter: invert();
    }
  }
`

const Title = styled.h1`
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: var(--text-primary);
`

const Subtitle = styled.p`
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.75;
  color: var(--text-secondary);
`

const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  width: 100%;
  align-items: center;

  & > * {
    flex: 1 1 180px;
  }

  @media (min-width: ${BREAKPOINTS.tablet}) {
    max-width: 580px;
  }

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  margin-top: var(--space-lg);
`

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-color);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--space-sm);

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${BREAKPOINTS.desktop}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const Card = styled.a`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-card);
  background: var(--background-100);
  box-shadow: var(--elevation-soft);
  transition: transform var(--transition-fast) ease, box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 55%, rgba(0,0,0,0.06));
    box-shadow: var(--elevation-card-hover);
    transform: translateY(-4px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: var(--space-sm);
  }
`

const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--space-sm);
  width: 100%;
  align-items: flex-start;
`

const CardName = styled.span`
  font-weight: 600;
  font-size: var(--font-size-md);
  color: var(--text-primary);
  flex: 1 1 auto;
  min-width: 200px;
`

const Lang = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  background: color-mix(in oklab, var(--accent-color) 14%, var(--background-100));
  padding: 4px 12px;
  border-radius: 64px;

  @media (prefers-color-scheme: dark) {
    background: color-mix(in oklab, var(--accent-color) 18%, var(--background-200));
  }
`

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1 1 auto;
  min-width: 160px;
  justify-content: flex-start;
`

const Desc = styled.p`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  min-height: 40px;

  @media (prefers-color-scheme: dark) {
    color: var(--text-primary);
    opacity: 0.8;
  }
`

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  align-items: center;
  min-height: 24px;

  @media (prefers-color-scheme: dark) {
    color: var(--text-primary);
    opacity: 0.7;
  }
`

const Empty = styled.div`
  grid-column: 1 / 4;
  text-align: center;
  color: color-mix(in oklab, var(--text-color) 76%, transparent);
  padding: var(--space-xl) 0;

  @media (prefers-color-scheme: dark) {
    opacity: 0.8;
  }
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MoreLink = styled(Link)`
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 88%, var(--accent-color) 12%);
  text-decoration: none;
  transition: color var(--transition-fast) ease;
  &:hover {
    text-decoration: underline;
  }
`

type ContactDialogConfig = ContactCardProps & { dialogGradient?: string }

const CONTACT_CONFIG: Record<'wechat' | 'qq', ContactDialogConfig> = {
  wechat: {
    badge: 'WeChat',
    qrSrc: 'https://cdn.wuh.site/web/wechat.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: '工程化 & 可视化',
    tagline: 'React / Vue / 编程爱好者',
    hints: ['扫描二维码添加微信', '备注"官网来访"更容易通过'],
    cardGradient: 'linear-gradient(180deg, rgba(16, 185, 129, 0.2), rgba(4, 120, 87, 0.7))',
    borderColor: 'rgba(16, 185, 129, 0.65)',
    hintColor: '#bdf9eb',
    dialogGradient: 'linear-gradient(180deg, rgba(16, 185, 129, 0.25), rgba(4, 120, 87, 0.95))',
  },
  qq: {
    badge: 'QQ',
    qrSrc: 'https://cdn.wuh.site/web/qq.jpg',
    name: 'stack-wuh',
    handle: 'shadow_u',
    title: '实时沟通',
    tagline: '工程化 / 可视化 / 效率工具',
    hints: ['二维码即刻发起 QQ 语音/文字', '备注“官网来访”更容易通过'],
    cardGradient: 'linear-gradient(180deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.85))',
    borderColor: 'rgba(37, 99, 235, 0.65)',
    hintColor: '#d4e5ff',
    dialogGradient: 'linear-gradient(180deg, rgba(37, 99, 235, 0.25), rgba(59, 130, 246, 0.95))',
  },
}

type ContactType = keyof typeof CONTACT_CONFIG

export default function HomeView({ repos, posts }: Props) {
  const [activeContact, setActiveContact] = useState<ContactType | null>(null)
  const openContact = useCallback((type: ContactType) => setActiveContact(type), [])
  const closeContact = useCallback(() => setActiveContact(null), [])
  const activeContactConfig = activeContact ? CONTACT_CONFIG[activeContact] : null

  return (
    <Root>
      <Main>
        <Hero>
          <HeroCard>
            <Brand>
              <StyledLogo src='/logo.svg' alt='wuh.site.logo' width={180} height={108} priority />
              <Title>
                stack-wuh的博客 <Subtitle style={{ display: 'inline' }}>雾失楼台, 月迷津渡</Subtitle>
              </Title>
              <Subtitle>React / Vue / 工程化 / 可视化</Subtitle>
            </Brand>
            <Ctas>
              <Button
                href='https://stack-wuh.github.io/blog/'
                target='_blank'
                rel='noopener noreferrer'
                variant='filled'
                color='primary'
                size='large'
              >
                <Image src='/vercel.svg' alt='blog' width={16} height={16} inline showSkeleton={false} appearance='plain' />
                知识库
              </Button>
              <LinkGroup
                items={[
                  { type: 'wechat', title: '微信', onClick: () => openContact('wechat') },
                  { type: 'qq', title: 'QQ', onClick: () => openContact('qq') },
                  { type: 'twitter', href: 'https://x.com/wuh131420', title: 'Twitter' },
                  { type: 'email', href: 'mailto:wuh131420@foxmail.com', title: '邮箱' },
                  { type: 'github', href: 'https://github.com/stack-wuh', title: 'GitHub' },
                  { type: 'douban', href: 'https://www.douban.com/people/wuh-site/?_i=6001540Kgx5FFN', title: '豆瓣' },
                  { type: 'custom', href: 'https://music.163.com/#/user/home?id=398326271', title: '网易云', icon: <IconMusic /> },
                ]}
                size='medium'
              />
            </Ctas>
          </HeroCard>
        </Hero>

        <Section>
          <HeaderRow>
            <SectionTitle>精选博客</SectionTitle>
            <MoreLink href='/blog'>全部博客</MoreLink>
          </HeaderRow>
          <Grid>
            {posts.length === 0 && <Empty>暂时无法获取 Issues 数据</Empty>}
            {posts.map(post => (
              <Card key={post.id} href={`/post/${post.number}`} >
                <CardHeader>
                  <CardName>{post.title}</CardName>
                  {post.labels?.length > 0 && (
                    <CardTags>
                      {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                        <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                      ))}
                    </CardTags>
                  )}
                </CardHeader>
                <Desc>发布于 {new Date(post.created_at).toLocaleDateString()}</Desc>
                <Meta>
                  <span>💬 {post.comments}</span>
                  <span>⇢ 查看</span>
                </Meta>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section>
          <HeaderRow>
            <SectionTitle>精选项目</SectionTitle>
          </HeaderRow>
          <Grid>
            {repos.length === 0 && <Empty>暂时无法获取 GitHub 数据</Empty>}
            {repos.map(repo => (
              <Card key={repo.html_url} href={repo.homepage || repo.html_url} target='_blank' rel='noopener noreferrer'>
                <CardHeader>
                  <CardName>{repo.name}</CardName>
                  {repo.language && <Lang>{repo.language}</Lang>}
                </CardHeader>
                {repo.description && <Desc>{repo.description}</Desc>}
                <Meta>
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>⇢ 查看</span>
                </Meta>
              </Card>
            ))}
          </Grid>
        </Section>
        <Dialog
          open={Boolean(activeContactConfig)}
          onClose={closeContact}
          title={activeContactConfig ? `${activeContactConfig.badge} 联系` : '联系'}
          fullScreen={false}
          width='min(760px, calc(100vw - 32px))'
          style={{
            background: 'var(--background-100)',
          }}
        >
          {activeContactConfig && (
            <ContactCard
              {...activeContactConfig}
              cardGradient={activeContactConfig.cardGradient}
              borderColor={activeContactConfig.borderColor}
              hintColor={activeContactConfig.hintColor}
            />
          )}
        </Dialog>
      </Main>
    </Root>
  )
}
