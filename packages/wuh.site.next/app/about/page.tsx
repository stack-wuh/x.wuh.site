'use client'

import Tag from '@wuh.site/components/tag'
import { metrics, expertiseTags } from './data'
import * as S from './styles'
import OrnamentDivider from './OrnamentDivider'
import HeatmapSection from './HeatmapSection'
import TimelineSection from './TimelineSection'
import PlatformSection from './PlatformSection'

const AboutPage = () => {
  return (
    <S.PageRoot>
      {/* Hero — 去卡片化 */}
      <S.Hero>
        <S.HeroEyebrow>About · 输出节奏总览</S.HeroEyebrow>
        <S.HeroTitle>数据驱动的作者日记</S.HeroTitle>
        <S.HeroSub>
          以 GitHub 热力图为灵感，汇聚 GitHub / 语雀 / 微信公众号在同一个时间轴上的创作故事。
        </S.HeroSub>
        <S.MetricRow>
          {metrics.map((metric) => (
            <S.MetricItem key={metric.label}>
              <S.MetricValue>{metric.value}</S.MetricValue>
              <S.MetricSep />
              <S.MetricLabel>{metric.label}</S.MetricLabel>
            </S.MetricItem>
          ))}
        </S.MetricRow>
      </S.Hero>

      <OrnamentDivider />

      {/* About */}
      <S.Section>
        <S.SectionHeading>
          <S.SectionTitle>About</S.SectionTitle>
          <S.SectionSubtitle>
            以技术驱动与内容输出为核心，涵盖架构方案、开源协作与创作日记。
          </S.SectionSubtitle>
        </S.SectionHeading>
        <S.AboutRow>
          <S.AboutAvatar>
            <S.AvatarLabel>W</S.AvatarLabel>
          </S.AboutAvatar>
          <S.AboutCopy>
            <p>
              兼顾工程与写作，擅长将工具链、系统思维与社区视角融合，帮助团队/社区搭建可持续的输出机制。
              现在的创作节奏保持 4~6 天发布一次，长期保持多平台联动。
            </p>
            <S.TagGroup>
              {expertiseTags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </S.TagGroup>
          </S.AboutCopy>
        </S.AboutRow>
      </S.Section>

      <HeatmapSection />

      <TimelineSection />

      <PlatformSection />

      {/* 联系与社交 — 唯一纸张风卡片 */}
      <S.Section>
        <S.SectionHeading>
          <S.SectionTitle>联系与社交</S.SectionTitle>
          <S.SectionSubtitle>保持联络，欢迎找我聊合作/分享。</S.SectionSubtitle>
        </S.SectionHeading>
        <S.ContactCard variant='elevated' padding='md' fullWidth>
          <S.ContactTitle>stack-wuh</S.ContactTitle>
          <S.ContactSubtitle>创作人 · 系统设计师</S.ContactSubtitle>
          <S.ContactLinks>
            <S.ContactLink href='mailto:hello@wuh.site'>Email</S.ContactLink>
            <S.ContactLink href='https://github.com/stack-wuh' target='_blank' rel='noreferrer'>GitHub</S.ContactLink>
            <S.ContactLink href='https://www.yuque.com/' target='_blank' rel='noreferrer'>语雀</S.ContactLink>
          </S.ContactLinks>
        </S.ContactCard>
      </S.Section>

      <OrnamentDivider />
    </S.PageRoot>
  )
}

export default AboutPage
