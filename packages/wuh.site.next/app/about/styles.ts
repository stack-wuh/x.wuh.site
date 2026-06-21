import { styled } from '@wuh.site/components/styled'

/* ====== Page Root ====== */

export const PageRoot = styled.main`
  width: min(640px, 100%);
  margin: 0 auto;
  padding: clamp(32px, 4vw, 48px) clamp(16px, 4vw, 24px) 64px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  font-family: var(--font-sans);
  color: var(--text-color);
`

/* ====== Hero ====== */

export const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 32px 0 24px;
`

export const HeroLabel = styled.span`
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent-color);
`

export const HeroTitle = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 28px);
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-primary);
`

export const HeroSub = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 480px;
`

/* ====== Section Header ====== */

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`

export const SectionLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--accent-color);
`

/* ====== AboutMe Block ====== */

export const AboutTimeline = styled.div`
  display: flex;
  gap: 16px;
`

export const TimelineTrack = styled.div`
  width: 2px;
  background: linear-gradient(to bottom, var(--primary-300), transparent);
  flex-shrink: 0;
  position: relative;
  margin-top: 4px;

  @media (max-width: 767px) {
    display: none;
  }
`

export const TimelineDot = styled.div<{ $top: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-300);
  position: absolute;
  left: -3px;
  top: ${({ $top }) => $top}px;
`

export const AboutContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-left: 4px;
`

/* Profile sub-section */

export const ProfileRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`

export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    color-mix(in oklab, var(--background-100) 70%, var(--accent-color)),
    var(--primary-500)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--elevation-soft);
`

export const AvatarLetter = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
`

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ProfileName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`

export const ProfileRole = styled.span`
  font-size: 12px;
  color: var(--text-muted);
`

export const Bio = styled.p`
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-secondary);
  margin: 0;
`

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Tag = styled.span`
  padding: 3px 10px;
  font-size: 11px;
  color: var(--primary-color);
  background: color-mix(in oklab, var(--primary-100) 60%, transparent);
  border-radius: 12px;
`

/* Platform cards */

export const PlatformList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const PlatformCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--background-100);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--background-200);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--background-200);
    border-color: rgba(255, 255, 255, 0.04);
    &:hover {
      background: var(--background-300);
    }
  }
`

export const PlatformName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
`

export const PlatformDesc = styled.span`
  font-size: 11px;
  color: var(--text-muted);
`

/* Metric row */

export const MetricRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  @media (prefers-color-scheme: dark) {
    border-top-color: rgba(255, 255, 255, 0.06);
  }
`

export const MetricItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`

export const MetricValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
`

export const MetricSep = styled.span`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.4;
  flex-shrink: 0;
`

export const MetricLabel = styled.span`
  font-size: 11px;
  color: var(--text-muted);
`

/* ====== Timeline ====== */

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const TimelineRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 8px;
  border-radius: 6px;
  transition: background var(--transition-fast), padding-left var(--transition-fast);

  &:hover {
    background: color-mix(in oklab, var(--accent-color) 6%, transparent);
    padding-left: 12px;
  }
`

export const TimelineDate = styled.span`
  width: 48px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  text-align: right;
`

export const TimelineTitle = styled.span`
  font-size: 13px;
  color: var(--text-primary);
`

export const TimelineSelect = styled.select`
  border: 1px solid color-mix(in oklab, var(--normal-300) 45%, transparent);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  font-family: var(--font-sans);

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

/* 响应式规则已内联到各组件 (TimelineTrack 等) */
