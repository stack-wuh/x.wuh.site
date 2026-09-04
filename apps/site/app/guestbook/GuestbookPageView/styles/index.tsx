'use client'

import styled from 'styled-components'

export const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 80px;

  @media (max-width: 640px) {
    padding: 32px 16px 64px;
  }
`

export const PageHeader = styled.header`
  margin-bottom: 40px;
`

export const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
`

export const PageSubtitle = styled.p`
  font-size: 0.86rem;
  color: var(--text-muted);
  margin: 0;
`

export const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 0;
  color: var(--text-muted);
  text-align: center;
`

export const EmptyText = styled.p`
  margin: 0;
  font-size: 0.88rem;
`

export const BackLink = styled.a`
  font-size: 0.82rem;
  color: var(--primary-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

/* ====== Timeline ====== */

export const Timeline = styled.div`
  position: relative;
  padding-left: 28px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 8px;
    width: 1px;
    background: color-mix(in oklab, var(--primary-color) 22%, var(--normal-300) 78%);

    [data-color-scheme='dark'] & {
      background: color-mix(in oklab, var(--primary-color) 28%, var(--normal-600) 72%);
    }
  }

  @media (max-width: 640px) {
    padding-left: 22px;

    &::before {
      left: 6px;
    }
  }
`

export const TimelineItem = styled.li`
  position: relative;
  list-style: none;
  padding-bottom: 24px;

  &:last-child {
    padding-bottom: 0;
  }
`

export const TimelineDot = styled.span`
  position: absolute;
  top: 6px;
  left: -20px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--primary-color);
  border: 2px solid var(--background-100);
  box-shadow: 0 0 0 1px color-mix(in oklab, var(--primary-color) 30%, transparent);
  z-index: 1;

  @media (max-width: 640px) {
    left: -16px;
    width: 7px;
    height: 7px;
  }
`

export const TimelineDateLabel = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  padding-top: 4px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: color-mix(in oklab, var(--accent-color) 72%, var(--primary-color) 28%);
    border: 2px solid var(--background-100);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--accent-color) 40%, transparent);
    z-index: 1;
    transform: translateY(-50%);

    @media (max-width: 640px) {
      left: -16px;
      width: 7px;
      height: 7px;
    }
  }

  &:first-child {
    padding-top: 0;
  }
`

export const TimelineDateText = styled.span`
  font-family: var(--font-serif);
  font-size: 0.78rem;
  font-weight: 600;
  font-style: italic;
  color: color-mix(in oklab, var(--accent-color) 82%, var(--normal-600) 18%);
  letter-spacing: 0.02em;
`

export const TimelineCard = styled.div`
  position: relative;
`
