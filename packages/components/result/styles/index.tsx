'use client'

import styled from 'styled-components'
import type { ResultStatus } from './specs'

export const Root = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: var(--text-primary);
`

export const Card = styled.div`
  width: 100%;
  max-width: 760px;
  border-radius: 18px;
  border: 1px solid var(--normal-300);
  background: var(--background-100);
  box-shadow: var(--elevation-soft);
  padding: 36px 40px;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 28px 24px;
  }

  html[data-color-scheme='dark'] & {
    background: var(--normal-800);
    border-color: var(--normal-600);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  }
`

export const IconWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, color-mix(in oklab, var(--primary-color) 10%, transparent), transparent 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);

  svg {
    width: 32px;
    height: 32px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`

export const StatusText = styled.span<{ $status: ResultStatus }>`
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => (p.$status === '404' || p.$status === '500' ? 'var(--danger-color)' : 'var(--text-muted)')};
  background: ${(p) =>
    p.$status === '404' || p.$status === '500'
      ? 'color-mix(in oklab, var(--danger-color) 14%, transparent)'
      : 'color-mix(in oklab, var(--normal-300) 12%, transparent)'};
  padding: 6px 10px;
  border-radius: 999px;
  width: fit-content;
`

export const Title = styled.h1`
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
`

export const Description = styled.p`
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.7;
`

export const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`

export const LinkItem = styled.a`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--normal-300);
  text-decoration: none;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 8%, transparent);
  }

  html[data-color-scheme='dark'] & {
    border-color: var(--normal-600);
  }
`

export const LinkText = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px dashed var(--normal-300);
  font-size: var(--font-size-xs);
  color: var(--text-muted);

  html[data-color-scheme='dark'] & {
    border-color: var(--normal-600);
  }
`

export const ExtraRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`
