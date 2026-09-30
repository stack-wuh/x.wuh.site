'use client'

import { useCallback, useState } from 'react'
import { useRequest } from 'ahooks'
import dynamic from 'next/dynamic'
import LinkGroup from '@wuh.site/components/link-group'
import { IconMusic, IconDiscord } from '@wuh.site/components/icons'
import Image from '@wuh.site/components/image'
import { Heatmap, type HeatmapData } from '@wuh.site/components/heatmap'
import { useLocale, type Locale } from '@wuh.site/components/locales'
import type { UnifiedActivityHeatmap } from '@wuh.site/core'

const Dialog = dynamic(() => import('@wuh.site/components/dialog'))
const ContactCard = dynamic(() => import('../../components/ContactCard'), {
  loading: () => null,
})
const FootprintMap = dynamic(() => import('@wuh.site/components/footprint-map'), { ssr: false })

import type { FootprintData } from '@wuh.site/components/footprint-map'
import {
  PageRoot,
  Hero, HeroLabel, HeroTitle, HeroSub,
  SectionHeader, SectionLabel,
  AboutTimeline, TimelineTrack, TimelineDot, AboutContent,
  ProfileRow, ProfileAvatarLink, Avatar, AvatarLetter, ProfileInfo, ProfileName, ProfileNameLink, ProfileRole,
  Bio, TagRow, Tag,
  PlatformList, PlatformCard, PlatformName, PlatformDesc,
  TimelineList, TimelineRow, TimelineDate, TimelineTitle, TimelineSelect,
} from '../styles'
import {
  blogTags, timelineFilters,
  timelineLogs, formatMonthDay,
} from '../data'
import { CONTACT_CONFIG, type ContactType } from '../../components/ContactConfig'
import GuestbookBarrageDialog from '../components/GuestbookBarrageDialog'
import type { AboutViewProps } from './specs'

/** locale → Intl 地区码（zh 需显式 zh-CN） */
const INTL_LOCALE: Record<Locale, string> = { zh: 'zh-CN', en: 'en', ja: 'ja' }

const buildActivityHeatmapData = (activityData: UnifiedActivityHeatmap | undefined): HeatmapData | null => {
  if (!activityData || activityData.days.length === 0) return null

  const firstDate = new Date(`${activityData.days[0].date}T00:00:00`)
  const leadingEmptyDays = firstDate.getDay()
  const paddedDays = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...activityData.days.map((day) => ({
      date: day.date,
      count: day.total,
      level: day.level,
      breakdown: day.counts,
    })),
  ]

  return {
    year: Number(activityData.endDate.slice(0, 4)),
    total: activityData.total,
    weeks: Array.from({ length: Math.ceil(paddedDays.length / 7) }, (_, index) => ({
      days: paddedDays.slice(index * 7, index * 7 + 7),
    })),
  }
}

const AboutView = ({ profile }: AboutViewProps) => {
  const { t, locale } = useLocale()
  const githubLogin = profile?.login || 'stack-wuh'
  const githubUrl = `https://github.com/${githubLogin}`
  const name = githubLogin
  const avatarUrl = profile?.avatar_url ?? null
  const location = profile?.location || 'ShenZhen GuangDong China'
  const profileMeta = profile?.name ? `${profile.name} · ${location}` : location

  const { data: activityData, loading: activityLoading, error: activityError } = useRequest<UnifiedActivityHeatmap, []>(
    async () => {
      const res = await fetch('/api/about/activity')
      if (!res.ok) throw new Error('Failed to fetch unified activity')
      return res.json()
    },
    { cacheKey: 'about-unified-activity' }
  )

  const { data: footprints } = useRequest<FootprintData[], []>(
    async () => {
      const res = await fetch('/api/footprints')
      if (!res.ok) return []
      const json = await res.json()
      return json.data || []
    }
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
        <HeroTitle>{t('about.hero.title')}</HeroTitle>
        <HeroSub>{t('about.hero.sub')}</HeroSub>
      </Hero>

      {/* 2. 关于我 */}
      <section>
        <SectionHeader className='reveal'>
          <SectionLabel>{t('about.profile.section')}</SectionLabel>
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
              <ProfileRow className='reveal'>
                {avatarUrl ? (
                  <ProfileAvatarLink
                    href={githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${name} GitHub profile`}
                  >
                    <Image
                      src={avatarUrl || ''}
                      alt={name}
                      role='avatar'
                      width={56}
                      height={56}
                      imageStyle={{ flexShrink: 0 }}
                    />
                  </ProfileAvatarLink>
                ) : (
                  <ProfileAvatarLink
                    href={githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${name} GitHub profile`}
                  >
                    <Avatar>
                      <AvatarLetter>W</AvatarLetter>
                    </Avatar>
                  </ProfileAvatarLink>
                )}
                <ProfileInfo>
                  <ProfileName>
                    <ProfileNameLink href={githubUrl} target='_blank' rel='noopener noreferrer'>
                      {name}
                    </ProfileNameLink>
                  </ProfileName>
                  <ProfileRole>{profileMeta}</ProfileRole>
                </ProfileInfo>
              </ProfileRow>
              <Bio style={{ marginTop: 12 }}>
                {t('about.profile.bio')}
              </Bio>
              <TagRow style={{ marginTop: 10 }}>
                {blogTags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagRow>
            </div>

            {/* Platforms */}
            <div>
              <SectionLabel style={{ marginBottom: 16 }}>{t('about.platforms.section')}</SectionLabel>
              <PlatformList>
                <PlatformCard className='reveal'>
                  <div>
                    <PlatformName>GitHub</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>
                      {profile
                        ? `${profile.public_repos} repos · ${profile.followers} followers`
                        : t('about.platforms.githubFallback')}
                    </PlatformDesc>
                  </div>
                </PlatformCard>
                <PlatformCard className='reveal'>
                  <div>
                    <PlatformName>{t('about.platforms.yuque')}</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>{t('about.platforms.yuqueDesc')}</PlatformDesc>
                  </div>
                </PlatformCard>
                <PlatformCard className='reveal'>
                  <div>
                    <PlatformName>{t('about.platforms.wechat')}</PlatformName>
                    <PlatformDesc style={{ marginLeft: 8 }}>{t('about.platforms.wechatDesc')}</PlatformDesc>
                  </div>
                </PlatformCard>
              </PlatformList>
            </div>

            {/* Contact */}
            <div>
              <SectionLabel style={{ marginBottom: 16 }}>{t('about.contact.section')}</SectionLabel>
              <LinkGroup
                items={[
                  { type: 'wechat', title: t('about.contact.wechat'), onClick: () => openContact('wechat') },
                  { type: 'qq', title: 'QQ', onClick: () => openContact('qq') },
                  { type: 'twitter', title: 'Twitter', onClick: () => openContact('twitter') },
                  { type: 'email', href: 'mailto:wuh131420@foxmail.com', title: t('about.contact.email'), hideOnMobile: true },
                  { type: 'github', title: 'GitHub', onClick: () => openContact('github') },
                  { type: 'douban', title: t('about.contact.douban'), onClick: () => openContact('douban') },
                  { type: 'custom', title: t('about.contact.netease'), icon: <IconMusic />, onClick: () => openContact('netease') },
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
        <SectionHeader className='reveal'>
          <SectionLabel>{t('about.heatmap.section')}</SectionLabel>
        </SectionHeader>
        <Heatmap
          data={buildActivityHeatmapData(activityData)}
          loading={activityLoading}
          error={activityError}
          errorLabel={t('about.heatmap.error')}
          colorScheme='warm'
          activityLabel={t('about.heatmap.activity')}
          emptyLabel={t('about.heatmap.empty')}
        />
      </section>

      {/* 4. Timeline */}
      <section>
        <SectionHeader className='reveal'>
          <SectionLabel>{t('about.timeline.section')}</SectionLabel>
          <TimelineSelect defaultValue={t(timelineFilters[0])}>
            {timelineFilters.map((key) => (
              <option key={key} value={t(key)}>{t(key)}</option>
            ))}
          </TimelineSelect>
        </SectionHeader>
        <TimelineList>
          {timelineLogs.map((log) => (
            <TimelineRow key={log.date} className='reveal'>
              <TimelineDate>{formatMonthDay(log.date, INTL_LOCALE[locale])}</TimelineDate>
              <TimelineTitle>{t(log.summaryKey)}</TimelineTitle>
            </TimelineRow>
          ))}
        </TimelineList>
      </section>

      <section>
        <SectionHeader className='reveal'>
          <SectionLabel>{t('about.footprint.section')}</SectionLabel>
        </SectionHeader>
        <div style={{ height: '380px', borderRadius: 'var(--radius-card, 12px)', overflow: 'hidden' }}>
          <FootprintMap footprints={footprints || []} variant="compact" />
        </div>
      </section>

      <section>
        <SectionHeader className='reveal'>
          <SectionLabel>{t('about.guestbook.section')}</SectionLabel>
        </SectionHeader>
        <GuestbookBarrageDialog />
      </section>

      <Dialog
        open={Boolean(activeContactConfig)}
        onClose={closeContact}
        title={activeContactConfig
          ? t('about.contact.dialogTitle', { name: activeContactConfig.badge })
          : t('about.contact.dialogTitleFallback')}
        fullScreen={false}
        width='min(760px, calc(100vw - 32px))'
      >
        {activeContactConfig && <ContactCard {...activeContactConfig} />}
      </Dialog>
    </PageRoot>
  )
}

export default AboutView
