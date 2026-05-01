'use client'

import styled from 'styled-components'
import Card from '@wuh.site/components/card'
import Tag from '@wuh.site/components/tag'

const HEATMAP_WEEKS = 12
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const startDate = new Date(Date.UTC(2026, 0, 5))

const buildHeatmap = () => {
  return WEEK_DAYS.map((weekday, weekdayIndex) => ({
    weekday,
    cells: Array.from({ length: HEATMAP_WEEKS }, (_, weekIndex) => {
      const date = new Date(startDate)
      date.setUTCDate(startDate.getUTCDate() + weekIndex * 7 + weekdayIndex)
      const level = (weekdayIndex + weekIndex) % 4
      return {
        date: date.toISOString().slice(0, 10),
        count: level ? level + 1 : 0,
        level,
      }
    }),
  }))
}

const heatmap = buildHeatmap()
const filters = ['全部平台', 'GitHub', '语雀', '微信公众号']
const timelineFilters = ['最近 90 天', '最近 180 天', '今年']

const metrics = [
  {
    label: '最近 30 天产出',
    value: '32 条',
    detail: '包含日志、文档、工具 & 运营总结',
  },
  {
    label: '活跃平台',
    value: '3 / 3',
    detail: 'GitHub × 语雀 × 微信公众号',
  },
  {
    label: '平均响应',
    value: '6 小时',
    detail: '合作邀约与读者反馈',
  },
]

const expertiseTags = ['架构研究', '内容系统', '工具链', '社区运营', 'DevRel']

const timelineLogs = [
  {
    date: '2026-04-16',
    summary: '5 条更新，总量 14 条（GitHub 3 / 语雀 1 / 公众号 1）',
    entries: [
      { platform: 'GitHub', title: 'Release: 能量贴图组件', link: '#' },
      { platform: '语雀', title: '撰写《沉浸式组件库》章节', link: '#' },
      { platform: '公众号', title: '如何用热力图展现输出节奏', link: '#' },
    ],
  },
  {
    date: '2026-04-12',
    summary: '3 条更新（GitHub 2 / 语雀 1）',
    entries: [
      { platform: 'GitHub', title: 'Issue: 博客导航体验优化', link: '#' },
      { platform: 'GitHub', title: 'Commit: 优化 About 热力图布局', link: '#' },
      { platform: '语雀', title: '资料：设计系统色彩步进', link: '#' },
    ],
  },
  {
    date: '2026-04-08',
    summary: '2 条更新（微信公众号 2）',
    entries: [
      { platform: '公众号', title: '系列：工具即生活｜Vol.3', link: '#' },
      { platform: '公众号', title: '运营日志：创作节奏记录', link: '#' },
    ],
  },
]

const platformStories = [
  {
    name: 'GitHub',
    description: 'Issue / Repo / Release 统一为创作日志，30+ 开源项目持续维护。',
    lastUpdated: '2026-04-10',
    linkLabel: '前往仓库',
  },
  {
    name: '语雀',
    description: '沉浸式笔记与课程章节，文档更新率 >100 条 / 年。',
    lastUpdated: '2026-04-15',
    linkLabel: '查看文档',
  },
  {
    name: '微信公众号',
    description: '深度干货与创作日记，侧重经验总结与工具推荐。',
    lastUpdated: '2026-04-14',
    linkLabel: '跳转公众号',
  },
]

const legendLabels = ['0 条', '1 条', '2 条', '3+ 条']
const heatColors = [
  'var(--background-200)',
  'color-mix(in oklab, var(--success-color) 70%, var(--background-100) 30%)',
  'var(--success-400)',
  'var(--success-600)',
]

const formatMonthDay = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

const AboutPage = () => {
  const highlightDate = '2026-03-25'

  return (
    <PageRoot>
      <HeroCard variant='elevated' padding='lg' fullWidth>
        <HeroHeader>
          <HeroEyebrow>About · 输出节奏总览</HeroEyebrow>
          <HeroTitle>数据驱动的作者日记</HeroTitle>
          <HeroSub>
            以 GitHub 热力图为灵感，汇聚 GitHub / 语雀 / 微信公众号在同一个时间轴上的创作故事。
          </HeroSub>
        </HeroHeader>
        <MetricGrid>
          {metrics.map((metric) => (
            <MetricCard key={metric.label}>
              <MetricValue>{metric.value}</MetricValue>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricDetail>{metric.detail}</MetricDetail>
            </MetricCard>
          ))}
        </MetricGrid>
      </HeroCard>

      <Section>
        <SectionHeading>
          <SectionTitle>About</SectionTitle>
          <SectionSubtitle>
            以技术驱动与内容输出为核心，涵盖架构方案、开源协作与创作日记。
          </SectionSubtitle>
        </SectionHeading>
        <AboutBody>
          <AboutAvatar>
            <AvatarLabel>W</AvatarLabel>
          </AboutAvatar>
          <AboutCopy>
            <p>
              兼顾工程与写作，擅长将工具链、系统思维与社区视角融合，帮助团队/社区搭建可持续的输出机制。
              现在的创作节奏保持 4~6 天发布一次，长期保持多平台联动。
            </p>
            <TagGroup>
              {expertiseTags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </TagGroup>
          </AboutCopy>
        </AboutBody>
      </Section>

      <Section>
        <SectionHeading>
          <SectionTitle>平台热力图</SectionTitle>
          <SectionSubtitle>
            以日为单位的活动格子，颜色深浅代表当天的内容密度，Hover 可查看每个平台的贡献明细。
          </SectionSubtitle>
        </SectionHeading>
        <HeatmapCard variant='outlined' padding='lg' fullWidth>
          <HeatmapControls>
            <ControlGroup>
              {filters.map((filter, index) => (
                <ChipButton key={filter} $active={index === 0}>
                  {filter}
                </ChipButton>
              ))}
            </ControlGroup>
            <ControlGroup>
              {timelineFilters.map((item, idx) => (
                <ChipButton key={item} $active={idx === 0}>
                  {item}
                </ChipButton>
              ))}
            </ControlGroup>
          </HeatmapControls>
          <HeatmapGrid>
            {heatmap.map((row) => (
              <HeatRow key={row.weekday}>
                <HeatDayLabel>{row.weekday}</HeatDayLabel>
                <HeatCells>
                  {row.cells.map((cell) => (
                    <HeatCell
                      key={cell.date}
                      type='button'
                      $level={cell.level}
                      $selected={cell.date === highlightDate}
                      title={`${formatMonthDay(cell.date)} · ${cell.count} 条`}
                    />
                  ))}
                </HeatCells>
              </HeatRow>
            ))}
          </HeatmapGrid>
          <HeatmapLegend>
            {legendLabels.map((label, index) => (
              <LegendItem key={label}>
                <LegendSwatch style={{ background: heatColors[index] }} />
                <LegendLabel>{label}</LegendLabel>
              </LegendItem>
            ))}
          </HeatmapLegend>
        </HeatmapCard>
      </Section>

      <Section>
        <SectionHeading>
          <SectionTitle>最近日志</SectionTitle>
          <SectionSubtitle>点击任意条目后续可展开该日所有平台/内容的具体链接。</SectionSubtitle>
        </SectionHeading>
        <LogGrid>
          {timelineLogs.map((log) => (
            <Card key={log.date} variant='elevated' padding='md' fullWidth>
              <LogHeader>
                <LogDate>{log.date}</LogDate>
                <LogSummary>{log.summary}</LogSummary>
              </LogHeader>
              <LogList>
                {log.entries.map((entry) => (
                  <LogItem key={`${log.date}-${entry.title}`}>
                    <Tag label={entry.platform} />
                    <LogLink href={entry.link}>{entry.title}</LogLink>
                  </LogItem>
                ))}
              </LogList>
            </Card>
          ))}
        </LogGrid>
      </Section>

      <Section>
        <SectionHeading>
          <SectionTitle>平台概况</SectionTitle>
          <SectionSubtitle>每个平台的内容侧重点与最后更新时间。</SectionSubtitle>
        </SectionHeading>
        <PlatformGrid>
          {platformStories.map((platform) => (
            <Card key={platform.name} variant='outlined' padding='md' fullWidth>
              <PlatformName>{platform.name}</PlatformName>
              <PlatformDesc>{platform.description}</PlatformDesc>
              <PlatformMeta>
                <span>最后更新时间 {platform.lastUpdated}</span>
                <PlatformLink href='#'>{platform.linkLabel}</PlatformLink>
              </PlatformMeta>
            </Card>
          ))}
        </PlatformGrid>
      </Section>

      <Section>
        <SectionHeading>
          <SectionTitle>联系与社交</SectionTitle>
          <SectionSubtitle>保持联络，欢迎找我聊合作/分享。</SectionSubtitle>
        </SectionHeading>
        <ContactCard>
          <ContactTitle>stack-wuh</ContactTitle>
          <ContactSubtitle>创作人 · 系统设计师</ContactSubtitle>
          <ContactLinks>
            <ContactLink href='mailto:hello@wuh.site'>Email</ContactLink>
            <ContactLink href='https://github.com/stack-wuh' target='_blank' rel='noreferrer'>GitHub</ContactLink>
            <ContactLink href='https://www.yuque.com/' target='_blank' rel='noreferrer'>语雀</ContactLink>
          </ContactLinks>
        </ContactCard>
      </Section>
    </PageRoot>
  )
}

export default AboutPage

const PageRoot = styled.main`
  width: min(960px, 100%);
  margin: 0 auto;
  padding: clamp(16px, 3vw, 36px) clamp(12px, 4vw, 32px) 56px;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 28px);
  font-family: var(--font-geist-sans);
  color: var(--text-color);
`

const HeroCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: color-mix(in oklab, var(--background-color) 78%, transparent);
  border: 1px solid color-mix(in oklab, var(--normal-300) 55%, transparent);
`

const HeroHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`

const HeroEyebrow = styled.span`
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-muted);
`

const HeroTitle = styled.h1`
  font-size: clamp(36px, 4vw, 48px);
  line-height: 1.2;
  color: var(--text-primary);
`

const HeroSub = styled.p`
  color: var(--text-color);
  line-height: 1.5;
`

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  gap: var(--space-sm);
  align-items: stretch;
  align-content: start;
`

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  min-height: 100%;
  justify-content: space-between;
`

const MetricValue = styled.span`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
`

const MetricLabel = styled.span`
  font-weight: 600;
  color: var(--text-color);
`

const MetricDetail = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`

const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
`

const SectionSubtitle = styled.p`
  color: var(--text-color);
  font-size: var(--font-size-sm);
  max-width: 520px;
`

const AboutBody = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-sm);
  align-items: center;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const AboutAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 32px;
  background: radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--background-100) 80%, var(--accent-color)), var(--primary-500));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--elevation-card);
`

const AvatarLabel = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
`

const AboutCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  color: var(--text-color);
  & > p {
    margin: 0;
  }
`

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`

const HeatmapCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`

const HeatmapControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  justify-content: space-between;
`

const ControlGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

const ChipButton = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active }) => ($active ? 'var(--primary-color)' : 'color-mix(in oklab, var(--normal-300) 45%, transparent)')};
  background: ${({ $active }) => ($active ? 'var(--primary-100)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-primary)')};
  border-radius: 999px;
  padding: 6px 16px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  &:focus-visible {
    outline: 2px solid rgba(59, 130, 246, 0.6);
    outline-offset: 2px;
  }
`

const HeatmapGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-x: auto;
`

const HeatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const HeatDayLabel = styled.span`
  min-width: 30px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

const HeatCells = styled.div`
  display: flex;
  gap: 4px;
`

const HeatCell = styled.button<{ $level: number; $selected?: boolean }>`
  width: 14px;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  border: ${({ $selected }) => ($selected ? '2px solid var(--primary-color)' : '1px solid transparent')};
  background: ${({ $level }) => heatColors[$level]};
  cursor: pointer;
  &:hover,
  &:focus-visible {
    border-color: var(--primary-color);
  }
`

const HeatmapLegend = styled.div`
  display: flex;
  gap: var(--space-xs);
  align-items: center;
  flex-wrap: wrap;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const LegendSwatch = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);
`

const LegendLabel = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
`

const LogGrid = styled.div`
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`

const LogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const LogDate = styled.span`
  font-weight: 700;
  color: var(--text-primary);
`

const LogSummary = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
`

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: var(--space-sm);
`

const LogItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
`

const LogLink = styled.a`
  color: var(--primary-color);
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`

const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-md);
`

const PlatformName = styled.h3`
  margin: 0;
  font-size: 22px;
  color: var(--text-primary);
`

const PlatformDesc = styled.p`
  margin: 8px 0 0;
  color: var(--text-color);
`

const PlatformMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
`

const PlatformLink = styled.a`
  color: var(--primary-color);
  font-weight: 600;
`

const ContactCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  align-items: flex-start;
`

const ContactTitle = styled.h3`
  font-size: 32px;
  margin: 0;
  color: var(--text-primary);
`

const ContactSubtitle = styled.p`
  margin: 0;
  color: var(--text-color);
`

const ContactLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: var(--primary-color);
  font-weight: 600;
  transition: background var(--transition-fast);
  &:hover {
    background: color-mix(in oklab, var(--primary-color) 15%, var(--background-100) 85%);
  }
`
