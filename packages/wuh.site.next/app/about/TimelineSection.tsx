'use client'

import styled from 'styled-components'
import { Section, SectionHeading, SectionTitle, SectionSubtitle } from './styles'
import { timelineLogs } from './data'

const TimelineSection = () => {
  return (
    <Section>
      <SectionHeading>
        <SectionTitle>最近日志</SectionTitle>
        <SectionSubtitle>
          点击任意条目后续可展开该日所有平台/内容的具体链接。
        </SectionSubtitle>
      </SectionHeading>
      <Timeline>
        {timelineLogs.map((log) => (
          <Row key={log.date}>
            <InkDot />
            <Date>{log.date}</Date>
            <Summary>{log.summary}</Summary>
            <InlineLinks>
              {log.entries.map((entry, i) => (
                <span key={`${log.date}-${entry.title}`}>
                  {i > 0 && <Dot>·</Dot>}
                  <Link href={entry.link}>{entry.title}</Link>
                </span>
              ))}
            </InlineLinks>
          </Row>
        ))}
      </Timeline>
    </Section>
  )
}

export default TimelineSection

/* ====== Timeline Styles ====== */

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Row = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  transition: background-color var(--transition-fast) ease, padding-left var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    padding-left: 12px;
  }
`

const InkDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  flex-shrink: 0;
  align-self: center;
`

const Date = styled.span`
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
  font-size: var(--font-size-sm);
`

const Summary = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  flex-shrink: 0;
`

const InlineLinks = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Dot = styled.span`
  margin: 0 6px;
  color: var(--text-muted);
  opacity: 0.4;
`

const Link = styled.a`
  color: var(--primary-color);
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`
