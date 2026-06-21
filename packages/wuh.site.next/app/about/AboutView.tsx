'use client'

import { useCallback, useState } from 'react'
import { useRequest } from 'ahooks'
import dynamic from 'next/dynamic'
import LinkGroup from '@wuh.site/components/link-group'
import { IconMusic, IconDiscord } from '@wuh.site/components/icons'
import { Heatmap, type HeatmapData } from '@wuh.site/components/heatmap'

const Dialog = dynamic(() => import('@wuh.site/components/dialog'))
const ContactCard = dynamic(() => import('../components/ContactCard'), {
  loading: () => null,
})

import type { GitHubProfileDto, RepoDto } from '@wuh.site/shared-contracts'
import {
  PageRoot,
  Hero, HeroLabel, HeroTitle, HeroSub,
  SectionHeader, SectionLabel,
  AboutTimeline, TimelineTrack, TimelineDot, AboutContent,
  ProfileRow, Avatar, AvatarLetter, ProfileInfo, ProfileName, ProfileRole,
  Bio, TagRow, Tag,
  PlatformList, PlatformCard, PlatformName, PlatformDesc,
  TimelineList, TimelineRow, TimelineDate, TimelineTitle, TimelineSelect,
} from './styles'
import {
  blogTags, personalBio, timelineFilters,
  timelineLogs, formatMonthDay,
} from './data'
import { CONTACT_CONFIG, type ContactType } from '../components/ContactConfig'

interface AboutViewProps {
  profile: GitHubProfileDto | null
  repos: RepoDto[]
}

const AboutView = ({ profile, repos }: AboutViewProps) => {
  const name = profile?.name || 'Shadow Wu'
  const avatarUrl = profile?.avatar_url ?? null
  const location = profile?.location || 'ShenZhen GuangDong China'

  const { data: heatmapData, loading: heatmapLoading } = useRequest<HeatmapData>(
    async () => {
      const res = await fetch('/v2/github/contributions?username=stack-wuh')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    { cacheKey: 'github-contributions' }
  )

  const [activeContact, setActiveContact] = useState<ContactType | null>(null)
  const openContact = useCallback((type: ContactType) => setActiveContact(type), [])
  const closeContact = useCallback(() => setActiveContact(null), [])
  const activeContactConfig = activeContact ? CONTACT_CONFIG[activeContact] : null

  return (
    <PageRoot>
      {/* 1. Hero */}
      <Hero>
        <HeroLabel>About · 吴尒红</HeroLabel>
        <HeroTitle>输出节奏总览</HeroTitle>
        <HeroSub>不要停止脚步, 每一天都要进步</HeroSub>
      </Hero>

      {/* 2. 关于我 */}
      <section>
        <SectionHeader>
          <SectionLabel>关于我</SectionLabel>
        </SectionHeader>
        <AboutTimeline>
          <TimelineTrack>
            <TimelineDot $top={0} />
            <TimelineDot $top={80} />
            <TimelineDot $top={160} />
          </TimelineTrack>
          <AboutContent>
            {/* Profile */}
            <div>
              <ProfileRow>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    width={56}
                    height={56}
                    style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <Avatar>
                    <AvatarLetter>W</AvatarLetter>
                  </Avatar>
                )}
                <ProfileInfo>
                  <ProfileName>{name}</ProfileName>
                  <ProfileRole>{location}</ProfileRole>
                </ProfileInfo>
              </ProfileRow>
              <Bio style={{ marginTop: 12 }}>
                {personalBio}
              </Bio>
              <TagRow style={{ marginTop: 10 }}>
                {blogTags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagRow>
            </div>

            {/* Platforms */}
            <div>
              <SectionLabel style={{ marginBottom: 16 }}>输出平台</SectionLabel>
              <PlatformList>
                <PlatformCard>
                  <div>
                    <PlatformName>GitHub</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>
                      {profile
                        ? `${profile.public_repos} repos · ${profile.followers} followers`
                        : '开源项目 & 代码笔记'}
                    </PlatformDesc>
                  </div>
                </PlatformCard>
                <PlatformCard>
                  <div>
                    <PlatformName>语雀</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>长篇技术文章，文档持续更新</PlatformDesc>
                  </div>
                </PlatformCard>
                <PlatformCard>
                  <div>
                    <PlatformName>微信公众号</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>碎片思考 & 周报，侧重经验总结与工具推荐</PlatformDesc>
                  </div>
                </PlatformCard>
              </PlatformList>
            </div>

            {/* Contact */}
            <div>
              <SectionLabel style={{ marginBottom: 16 }}>联系方式</SectionLabel>
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
                size='small'
              />
            </div>
          </AboutContent>
        </AboutTimeline>
      </section>

      {/* 3. Heatmap */}
      <section>
        <SectionHeader>
          <SectionLabel>产出热力图</SectionLabel>
        </SectionHeader>
        <Heatmap data={heatmapData} loading={heatmapLoading} />
      </section>

      {/* 4. Timeline */}
      <section>
        <SectionHeader>
          <SectionLabel>最近日志</SectionLabel>
          <TimelineSelect defaultValue={timelineFilters[0]}>
            {timelineFilters.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </TimelineSelect>
        </SectionHeader>
        <TimelineList>
          {timelineLogs.map((log) => (
            <TimelineRow key={log.date}>
              <TimelineDate>{formatMonthDay(log.date)}</TimelineDate>
              <TimelineTitle>{log.summary}</TimelineTitle>
            </TimelineRow>
          ))}
        </TimelineList>
      </section>

      <Dialog
        open={Boolean(activeContactConfig)}
        onClose={closeContact}
        title={activeContactConfig ? `${activeContactConfig.badge} 联系` : '联系'}
        fullScreen={false}
        width='min(760px, calc(100vw - 32px))'
      >
        {activeContactConfig && <ContactCard {...activeContactConfig} />}
      </Dialog>
    </PageRoot>
  )
}

export default AboutView
