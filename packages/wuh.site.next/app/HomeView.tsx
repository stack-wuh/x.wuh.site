'use client'
import Image from 'next/image'
import styled from 'styled-components'
import Button from '@wuh.site/components/button'
import LinkGroup from '@wuh.site/components/link-group'

type Repo = {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  homepage: string | null
  fork: boolean
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
    labels: { name: string }[]
  }[]
}

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background-color: var(--background-color);
`

const Main = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 980px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 80px 60px;
`

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  width: 100%;
`

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`

const StyledLogo = styled(Image)`
  @media (prefers-color-scheme: dark) {
    filter: invert();
  }
`

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: var(--text-primary);
`

const Subtitle = styled.p`
  font-size: var(--font-size-md);
  line-height: 1.75;
  color: var(--text-secondary);
`

const Ctas = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 520px;
  gap: var(--space-md);
  font-size: var(--font-size-sm);
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  margin-top: var(--space-2xl);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
`

const Card = styled.a`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 1px solid var(--normal-300);
  border-radius: 12px;
  background: var(--background-100);
  transition: all .2s ease;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 14px rgba(0,0,0,.06);
    transform: translateY(-2px);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardName = styled.span`
  font-weight: 600;
  font-size: var(--font-size-md);
  color: var(--text-primary);
`

const Lang = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  background: var(--background-200);
  padding: 2px var(--space-sm);
  border-radius: 64px;
`

const Desc = styled.p`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  min-height: 40px;
`

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

const Empty = styled.div`
  grid-column: 1 / 4;
  text-align: center;
  color: var(--text-secondary);
  padding: var(--space-xl) 0;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MoreLink = styled.a`
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast) ease;
  &:hover {
    text-decoration: underline;
  }
`

export default function HomeView({ repos, posts }: Props) {
  return (
    <Root>
      <Main>
        <Hero>
          <Brand>
            <StyledLogo src='/logo.svg' alt='wuh.site.logo' width={180} height={108} priority />
            <Title>stack-wuh的博客</Title>
            <Subtitle>React / Vue / 工程化 / 可视化</Subtitle>
          </Brand>
          <Ctas>
            <Button href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' variant='filled' color='primary'>
              <Image src='/vercel.svg' alt='blog' width={16} height={16} />
              知识库
            </Button>
            <LinkGroup
              items={[
                { type: 'wechat', href: 'https://example.com/wechat', title: '微信' },
                { type: 'qq', href: 'https://example.com/qq', title: 'QQ' },
                { type: 'twitter', href: 'https://twitter.com/stack_wuh', title: 'Twitter' },
                { type: 'email', href: 'mailto:shadow_u@foxmail.com', title: '邮箱' },
                { type: 'github', href: 'https://github.com/stack-wuh', title: 'GitHub' },
                { type: 'douban', href: 'https://www.douban.com/', title: '豆瓣' },
              ]}
              size='medium'
            />
          </Ctas>
        </Hero>

        <Section>
          <HeaderRow>
            <h2>精选博客</h2>
            <MoreLink href='https://github.com/stack-wuh/blog/issues' target='_blank' rel='noopener noreferrer'>更多</MoreLink>
          </HeaderRow>
          <Grid>
            {posts.length === 0 && <Empty>暂时无法获取 Issues 数据</Empty>}
            {posts.map(post => (
              <Card key={post.id} href={post.html_url} target='_blank' rel='noopener noreferrer'>
                <CardHeader>
                  <CardName>{post.title}</CardName>
                  {post.labels?.length > 0 && <Lang>{post.labels.map(l => l.name).slice(0, 2).join(' · ')}</Lang>}
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
            <h2>精选项目</h2>
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
      </Main>
    </Root>
  )
}
