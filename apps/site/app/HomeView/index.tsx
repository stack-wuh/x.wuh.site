'use client'

import Button from '@wuh.site/components/button'
import dynamic from 'next/dynamic'
import Tag from '@wuh.site/components/tag'
import { IconLogo, DiamondDivider, IconBookOpen, IconCalendar, IconChevronRight } from '@wuh.site/components/icons'
import { buildPostUrl } from '../lib/slug'
import { formatShortDate } from '../lib/date'
import * as S from '../styles'
import Empty from '@wuh.site/components/empty'
import ContactArea from './ContactArea'
import WereadSection from './WereadSection'
import ProjectsSection from './ProjectsSection'
import type { HomeViewProps } from './specs'

const TypewriterMotto = dynamic(() => import('../components/TypewriterMotto'), {
  loading: () => <S.MottoSkeleton />,
})

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

/**
 * 首页视图（Server Component）：纯展示区块不参与客户端水合，
 * 交互部分（社交链接/联系弹窗/书架/项目刷新/打字机）为独立客户端叶子。
 */
export default function HomeView({ posts, yearlySummaries, wereadBooks, repos, hero }: HomeViewProps) {
  const yearGroups = groupByYear(posts)
  return (
    <S.Root>
      <S.Main>
        {hero ?? (
          <S.Hero>
            <IconLogo width={64} height={38.4} />
            <S.SiteTitle>wuh.site&nbsp;&middot;&nbsp;朝朝如念</S.SiteTitle>
            <S.SiteTagline>雾失楼台，月迷津渡</S.SiteTagline>
          </S.Hero>
        )}

        <TypewriterMotto />

        <S.Ctas>
          <Button href='/blog' variant='outlined' color='primary' size='small'>查看博客</Button>
          <Button href='/about' variant='outlined' color='secondary' size='small'>关于我</Button>
        </S.Ctas>

        <ContactArea />

        <OrnamentDivider />

        <S.Section>
          <S.SectionHeader className='reveal'>
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
                    <S.PostRow key={post.id} href={buildPostUrl(post.number)} className='reveal'>
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
          <S.SectionHeader className='reveal'>
            <S.SectionTitle>年度总结</S.SectionTitle>
          </S.SectionHeader>
          {yearlySummaries.length === 0 ? (
            <Empty icon={<IconCalendar />} title="暂无年度总结" description="还没有年度回顾文章" />
          ) : (
            <S.ProjectList>
              {yearlySummaries.map(item => (
                <S.PostRow key={item.id} href={buildPostUrl(item.number)} className='reveal'>
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

        <WereadSection fallbackBooks={wereadBooks} />

        <OrnamentDivider />

        <ProjectsSection fallbackRepos={repos} />
      </S.Main>
    </S.Root>
  )
}
