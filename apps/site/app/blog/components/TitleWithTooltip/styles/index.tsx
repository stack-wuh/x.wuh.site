'use client'

import styled from 'styled-components'

export const TitleTextContainer = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
`

export const TitleText = styled.span`
  display: block;
  font-weight: 500;
  font-size: var(--font-size-base);
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TitleTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: min(360px, 80vw);
  padding: var(--space-sm);
  border-radius: var(--border-radius-base);
  background: var(--background-100);
  color: var(--text-primary);
  box-shadow: var(--elevation-card);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  pointer-events: none;
  z-index: 10;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '4px')});
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
`
