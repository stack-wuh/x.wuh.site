import styled from '@wuh.site/components/styled'
import Link from 'next/link'

export const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-sans);
  background: transparent;
  padding: clamp(24px, 3vw, 64px) clamp(16px, 4vw, 60px);
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xl);
  padding: clamp(24px, 3vw, 48px) clamp(20px, 5vw, 32px);
`

// Header 布局系列从共享组件重导出
export { Header, TitleGroup, Title, Subtitle, HeaderActions } from '@/app/components/PageHeader/styles'

export const Timeline = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`

export const FilterBar = styled.section`
  position: relative;
  z-index: 20;
  width: 100%;
  border: 1px solid color-mix(in oklab, var(--accent-color) 32%, var(--background-100, #fff));
  border-radius: 8px;
  background: color-mix(in oklab, var(--accent-color) 8%, var(--background-100, #fff));
  overflow: visible;
`

export const FilterToolbar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  min-height: 46px;
  padding: 10px 12px;
  border-radius: 8px;
  background: color-mix(in oklab, var(--accent-color) 10%, var(--background-100, #fff));
`

export const FilterMenu = styled.details`
  position: relative;

  &[open] > summary {
    border-color: color-mix(in oklab, var(--accent-color) 64%, var(--background-100, #fff));
    color: var(--primary-color);
    background: color-mix(in oklab, var(--accent-color) 18%, var(--background-100, #fff));
  }
`

export const FilterSummary = styled.summary`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid color-mix(in oklab, var(--accent-color) 34%, var(--background-100, #fff));
  border-radius: 6px;
  background: color-mix(in oklab, var(--accent-color) 6%, var(--background-100, #fff));
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  list-style: none;
  user-select: none;
  transition: border-color var(--transition-fast) ease, color var(--transition-fast) ease, background-color var(--transition-fast) ease;

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: '▾';
    font-size: 10px;
    color: var(--text-muted);
  }

  &:hover {
    border-color: color-mix(in oklab, var(--accent-color) 58%, var(--background-100, #fff));
    color: var(--primary-color);
    background: color-mix(in oklab, var(--accent-color) 14%, var(--background-100, #fff));
  }
`

export const FilterMenuList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 30;
  display: flex;
  width: min(280px, calc(100vw - 48px));
  max-height: 320px;
  flex-direction: column;
  overflow-y: auto;
  border: 1px solid color-mix(in oklab, var(--accent-color) 32%, var(--background-100, #fff));
  border-radius: 8px;
  background: color-mix(in oklab, var(--accent-color) 6%, var(--background-100, #fff));
  box-shadow: 0 16px 40px color-mix(in oklab, #000 16%, transparent);
  padding: 6px;
`

export const FilterOption = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  min-height: 34px;
  padding: 0 10px;
  border-radius: 6px;
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-secondary)')};
  background: ${({ $active }) => ($active ? 'color-mix(in oklab, var(--accent-color) 20%, var(--background-100, #fff))' : 'transparent')};
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: background-color var(--transition-fast) ease, color var(--transition-fast) ease;

  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--accent-color) 16%, var(--background-100, #fff));
  }
`

export const FilterEmpty = styled.span`
  padding: 8px 10px;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`

export const FilterToken = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 26px;
  padding: 0 8px;
  border: 1px solid color-mix(in oklab, var(--accent-color) 46%, var(--background-100, #fff));
  border-radius: 6px;
  color: var(--primary-color);
  background: color-mix(in oklab, var(--accent-color) 18%, var(--background-100, #fff));
  font-size: var(--font-size-xs);
  text-decoration: none;
  transition: border-color var(--transition-fast) ease, background-color var(--transition-fast) ease;

  &:hover {
    border-color: color-mix(in oklab, var(--accent-color) 70%, var(--background-100, #fff));
    background: color-mix(in oklab, var(--accent-color) 26%, var(--background-100, #fff));
    text-decoration: none;
  }
`

export const YearGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  animation: blogRowRise 0.35s ease forwards;

  @keyframes blogRowRise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; opacity: 1; }
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

export const PostRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  color: inherit;

  @media (max-width: 520px) { flex-wrap: wrap; gap: 6px; }
`

export const InkDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  flex-shrink: 0;
`

export const IssueNumber = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  opacity: 0.6;
  flex-shrink: 0;
  min-width: 36px;
  text-align: right;
`

export const PostTitleLink = styled(Link)`
  display: block;
  flex: 1 1 0;
  min-width: 0;
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--primary-color);
    text-decoration: none;
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 36%, transparent);
    outline-offset: 2px;
    border-radius: 4px;
  }
`

export const PostTagLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 36%, transparent);
    outline-offset: 2px;
    border-radius: 6px;
  }
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
