'use client'

import type { GitHubProfileDto, RepoDto } from '@wuh.site/shared-contracts'
import {
  PageRoot,
  Hero, HeroLabel, HeroTitle, HeroSub,
  SectionHeader, SectionLabel,
  AboutTimeline, TimelineTrack, TimelineDot, AboutContent,
  ProfileRow, Avatar, AvatarLetter, ProfileInfo, ProfileName, ProfileRole,
  Bio, TagRow, Tag,
  PlatformList, PlatformCard, PlatformName, PlatformDesc,
  ContactRow, ContactItem,
  HeatmapGrid, HeatmapRow, DayLabel, Cells, Cell,
  FilterGroup, ChipButton,
  Legend, LegendItem, Swatch, LegendLabel,
  TimelineList, TimelineRow, TimelineDate, TimelineTitle, TimelineSelect,
} from './styles'
import {
  blogTags, personalBio, heatmap, filters, timelineFilters,
  timelineLogs, heatColors, legendLabels, formatMonthDay,
} from './data'

interface AboutViewProps {
  profile: GitHubProfileDto | null
  repos: RepoDto[]
}

const AboutView = ({ profile, repos }: AboutViewProps) => {
  const name = profile?.name || 'Shadow Wu'
  const avatarUrl = profile?.avatar_url ?? null
  const location = profile?.location || 'ShenZhen GuangDong China'

  return (
    <PageRoot>
      {/* 1. Hero */}
      <Hero>
        <HeroLabel>About</HeroLabel>
        <HeroTitle>输出节奏总览</HeroTitle>
        <HeroSub>记录思考，串联碎片，构建自己的知识系统</HeroSub>
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
              <SectionLabel style={{ marginBottom: 10 }}>输出平台</SectionLabel>
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
              <SectionLabel style={{ marginBottom: 10 }}>联系方式</SectionLabel>
              <ContactRow>
                <ContactItem href='mailto:hello@wuh.site'>Email</ContactItem>
                <ContactItem href='https://github.com/stack-wuh' target='_blank' rel='noreferrer'>GitHub</ContactItem>
                <ContactItem href={profile?.blog ? `https://${profile.blog}` : 'https://wuh.site'} target='_blank' rel='noreferrer'>Blog</ContactItem>
              </ContactRow>
            </div>
          </AboutContent>
        </AboutTimeline>
      </section>

      {/* 3. Heatmap */}
      <section>
        <SectionHeader>
          <SectionLabel>产出热力图</SectionLabel>
          <FilterGroup>
            {filters.map((f, i) => (
              <ChipButton key={f} $active={i === 0}>{f}</ChipButton>
            ))}
          </FilterGroup>
        </SectionHeader>
        <HeatmapGrid>
          {heatmap.map((row) => (
            <HeatmapRow key={row.weekday}>
              <DayLabel>{row.weekday}</DayLabel>
              <Cells>
                {row.cells.map((cell) => (
                  <Cell
                    key={cell.date}
                    $level={cell.level}
                    title={`${formatMonthDay(cell.date)} · ${cell.count} 条`}
                  />
                ))}
              </Cells>
            </HeatmapRow>
          ))}
        </HeatmapGrid>
        <Legend>
          {legendLabels.map((label, i) => (
            <LegendItem key={label}>
              <Swatch style={{ background: heatColors[i] }} />
              <LegendLabel>{label}</LegendLabel>
            </LegendItem>
          ))}
        </Legend>
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
    </PageRoot>
  )
}

export default AboutView
