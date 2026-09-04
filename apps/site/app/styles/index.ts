import styled from 'styled-components'
import Link from 'next/link'
import Image from '@wuh.site/components/image'

export const Root = styled.div`
  font-family: var(--font-sans);
  background: transparent;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: clamp(16px, 2.4vw, 48px) clamp(16px, 5vw, 48px);
`

export const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  gap: var(--space-lg);
  padding: clamp(24px, 3vw, 48px) clamp(12px, 3vw, 40px);
`

export const Hero = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-xl) 0 var(--space-md);
`

export const SiteTitle = styled.p`
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  margin-top: var(--space-xs);
  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
`

export const SiteTagline = styled.p`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  letter-spacing: 0.06em;
  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
  animation-delay: 80ms;
`

export const MottoSkeleton = styled.div`
  min-height: calc(var(--font-size-lg) * 1.8 + var(--space-md) * 2);
`

export const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  margin-top: var(--space-xs);
  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
  animation-delay: 160ms;
`

export const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: var(--space-xs);
  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
  animation-delay: 240ms;
`

export const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 360px;
  margin: var(--space-md) auto;
  color: var(--text-muted);
  opacity: 0.5;
`

export const DividerLine = styled.span`
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.35;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--space-md);
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
`

export const SectionTitle = styled.h2`
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.03em;
`

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`

export const YearGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const YearLabel = styled.div`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--space-xs) 0;
  letter-spacing: 0.05em;
  border-bottom: 1px solid color-mix(in oklab, var(--text-muted) 25%, transparent);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--text-muted) 20%, transparent);
  }
`

export const PostRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color var(--transition-fast) ease, padding-left var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    padding-left: 12px;
    text-decoration: none;
  }

  @media (max-width: 520px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`

export const InkDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  flex-shrink: 0;
`

export const PostTitle = styled.span`
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
  }
`

export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.5;
`

export const PostTags = styled.span`
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
    width: 100%;
  }
`

export const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

export const ProjectLink = styled.a`
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition:
    background-color var(--transition-fast) ease,
    transform var(--motion-dur-quick) var(--motion-ease-out-soft);

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    transform: translateY(-4px);
    text-decoration: none;
  }

  @media (max-width: 520px) { flex-wrap: wrap; }
`

export const ProjectName = styled.span`
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  min-width: fit-content;
`

export const ProjectDesc = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 520px) { white-space: normal; }
`

export const ProjectMeta = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-left: auto;
  flex-shrink: 0;

  @media (max-width: 520px) { margin-left: 0; }
`

export const BooksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

export const BookRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
`

export const BookCover = styled(Image)`
  width: 36px;
  height: 54px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
`

export const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const BookTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
`

export const BookMeta = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 2px;
`

export const SectionSkeleton = styled.div`
  width: 100%;
  height: 200px;
  border-radius: var(--radius-md, 8px);
  background: linear-gradient(
    90deg,
    var(--background-200, #f0f0f0) 25%,
    var(--background-100, #e0e0e0) 50%,
    var(--background-200, #f0f0f0) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;

  @keyframes skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`
