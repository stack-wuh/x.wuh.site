'use client'

import styled from '@wuh.site/components/styled'
import { Section, SectionHeading, SectionTitle, SectionSubtitle } from './styles'
import { platformStories } from './data'

const PlatformSection = () => {
  return (
    <Section>
      <SectionHeading>
        <SectionTitle>平台概况</SectionTitle>
        <SectionSubtitle>
          每个平台的内容侧重点与最后更新时间。
        </SectionSubtitle>
      </SectionHeading>
      <List>
        {platformStories.map((platform) => (
          <Item key={platform.name}>
            <Name>{platform.name}</Name>
            <Desc>{platform.description}</Desc>
            <Meta>
              <span>最后更新时间 {platform.lastUpdated}</span>
              <Link href='#'>{platform.linkLabel}</Link>
            </Meta>
          </Item>
        ))}
      </List>
    </Section>
  )
}

export default PlatformSection

/* ====== Platform Styles ====== */

const List = styled.div`
  display: flex;
  flex-direction: column;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--space-md) 0;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-300) 30%, transparent);

  &:last-child {
    border-bottom: none;
  }

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--normal-700) 30%, transparent);
  }
`

const Name = styled.h3`
  margin: 0;
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--text-primary);
`

const Desc = styled.p`
  margin: 0;
  color: var(--text-color);
  font-size: var(--font-size-sm);
`

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

const Link = styled.a`
  color: var(--primary-color);
  font-weight: 600;
`
