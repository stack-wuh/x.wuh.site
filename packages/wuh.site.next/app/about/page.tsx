'use client'

import {
  PageRoot,
  Hero, HeroLabel, HeroTitle, HeroSub,
  SectionHeader, SectionLabel,
  AboutTimeline, TimelineTrack, TimelineDot, AboutContent,
  ProfileRow, Avatar, AvatarLetter, ProfileInfo, ProfileName, ProfileRole,
  Bio, TagRow, Tag,
  PlatformList, PlatformCard, PlatformName, PlatformDesc,
  ContactRow, ContactItem,
  MetricRow, MetricItem, MetricValue, MetricSep, MetricLabel,
  HeatmapGrid, HeatmapRow, DayLabel, Cells, Cell,
  FilterGroup, ChipButton,
  Legend, LegendItem, Swatch, LegendLabel,
  TimelineList, TimelineRow, TimelineDate, TimelineTitle, TimelineSelect,
} from './styles'
import {
  metrics, expertiseTags, heatmap, filters, timelineFilters,
  timelineLogs, platformStories, heatColors, legendLabels, formatMonthDay,
} from './data'

const AboutPage = () => {
  return (
    <PageRoot>
      {/* 1. Hero */}
      <Hero>
        <HeroLabel>About</HeroLabel>
        <HeroTitle>输出节奏总览</HeroTitle>
        <HeroSub>记录思考，串联碎片，构建自己的知识系统</HeroSub>
      </Hero>

      {/* 2. 关于我 — 合并：个人 + 平台 + 联系 + 指标 */}
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
                <Avatar>
                  <AvatarLetter>W</AvatarLetter>
                </Avatar>
                <ProfileInfo>
                  <ProfileName>Shadow Wu</ProfileName>
                  <ProfileRole>全栈开发 & 技术写作</ProfileRole>
                </ProfileInfo>
              </ProfileRow>
              <Bio style={{ marginTop: 12 }}>
                关注架构设计、内容系统与开发者体验。喜欢用工具链解决问题，用文字沉淀思考。
              </Bio>
              <TagRow style={{ marginTop: 10 }}>
                {expertiseTags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagRow>
            </div>

            {/* Platforms */}
            <div>
              <SectionLabel style={{ marginBottom: 10 }}>输出平台</SectionLabel>
              <PlatformList>
                {platformStories.map((p) => (
                  <PlatformCard key={p.name}>
                    <div>
                      <PlatformName>{p.name}</PlatformName>
                      <PlatformDesc style={{ marginLeft: 8 }}>{p.description}</PlatformDesc>
                    </div>
                  </PlatformCard>
                ))}
              </PlatformList>
            </div>

            {/* Contact */}
            <div>
              <SectionLabel style={{ marginBottom: 10 }}>联系方式</SectionLabel>
              <ContactRow>
                <ContactItem href='mailto:hello@wuh.site'>Email</ContactItem>
                <ContactItem href='https://github.com/stack-wuh' target='_blank' rel='noreferrer'>GitHub</ContactItem>
                <ContactItem href='https://www.yuque.com/' target='_blank' rel='noreferrer'>语雀</ContactItem>
              </ContactRow>
            </div>

            {/* Metrics */}
            <MetricRow>
              {metrics.map((m) => (
                <MetricItem key={m.label}>
                  <MetricValue>{m.value}</MetricValue>
                  <MetricSep />
                  <MetricLabel>{m.label}</MetricLabel>
                </MetricItem>
              ))}
            </MetricRow>
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

export default AboutPage
