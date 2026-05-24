import styled from '@wuh.site/components/styled'
import Card from '@wuh.site/components/card'

/* ====== Page Root ====== */

export const PageRoot = styled.main`
  width: min(960px, 100%);
  margin: 0 auto;
  padding: clamp(16px, 3vw, 36px) clamp(12px, 4vw, 32px) 56px;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 28px);
  font-family: var(--font-geist-sans);
  color: var(--text-color);
`

/* ====== Hero ====== */

export const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  padding: clamp(24px, 4vw, 56px) 0 clamp(16px, 2vw, 32px);
`

export const HeroEyebrow = styled.span`
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-muted);
`

export const HeroTitle = styled.h1`
  font-family: var(--font-serif);
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
`

export const HeroSub = styled.p`
  color: var(--text-color);
  line-height: 1.5;
  max-width: 560px;
`

export const MetricRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-xs);
`

export const MetricItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`

export const MetricValue = styled.span`
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
`

export const MetricSep = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.4;
  flex-shrink: 0;
`

export const MetricLabel = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
`

/* ====== Section（公共） ====== */

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SectionTitle = styled.h2`
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
`

export const SectionSubtitle = styled.p`
  color: var(--text-color);
  font-size: var(--font-size-sm);
  max-width: 520px;
`

/* ====== About 区块 ====== */

export const AboutRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-md);
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

export const AboutAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: var(--radius-card);
  background: radial-gradient(
    circle at 20% 20%,
    color-mix(in oklab, var(--background-100) 80%, var(--accent-color)),
    var(--primary-500)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--elevation-card);
`

export const AvatarLabel = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
`

export const AboutCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  color: var(--text-color);
  & > p {
    margin: 0;
  }
`

export const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`

/* ====== 装饰分隔线 ====== */

export const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  color: var(--text-muted);
  opacity: 0.5;
`

export const DividerLine = styled.span`
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.35;
`

export const DividerDiamond = styled.svg`
  width: 10px;
  height: 10px;
  flex-shrink: 0;
`

/* ====== 联系与社交 — 唯一纸张风卡片 ====== */

export const ContactCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  align-items: flex-start;
  border-radius: var(--radius-card);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: var(--elevation-card), inset 0 1px 0 rgba(255, 255, 255, 0.5);

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
    box-shadow: var(--elevation-card), inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }
`

export const ContactTitle = styled.h3`
  font-size: 32px;
  margin: 0;
  color: var(--text-primary);
`

export const ContactSubtitle = styled.p`
  margin: 0;
  color: var(--text-color);
`

export const ContactLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

export const ContactLink = styled.a`
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
