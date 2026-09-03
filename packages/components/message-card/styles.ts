import styled from 'styled-components'

/* 信笺风留言组件：奶油纸底便笺卡片、衬线斜体昵称、琥珀时间戳。
   全部走主题 token，四主题（wine/plain × light/dark）自动适配。 */

export const MessageCard = styled.div<{ $mine?: boolean }>`
  position: relative;
  padding: 8px 11px;
  border-radius: ${({ $mine }) => ($mine ? '12px 3px 12px 3px' : '3px 12px 3px 12px')};
  border: 1px solid
    ${({ $mine }) =>
      $mine
        ? 'color-mix(in oklab, var(--primary-color) 22%, var(--normal-300) 78%)'
        : 'color-mix(in oklab, var(--normal-300) 55%, transparent)'};
  background: ${({ $mine }) =>
    $mine
      ? 'color-mix(in oklab, var(--primary-color) 7%, var(--background-100))'
      : 'color-mix(in oklab, var(--background-100) 96%, var(--accent-color) 4%)'};
  box-shadow: 0 1px 2px color-mix(in oklab, var(--normal-700) 14%, transparent);
  color: var(--text-primary);

  [data-color-scheme='dark'] & {
    background: ${({ $mine }) =>
      $mine
        ? 'color-mix(in oklab, var(--primary-color) 16%, var(--background-100))'
        : 'color-mix(in oklab, var(--background-100) 94%, var(--background-200) 6%)'};
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`

export const MessageAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  border-radius: 50%;
  border: 1px solid color-mix(in oklab, var(--primary-color) 28%, transparent);
  background: color-mix(in oklab, var(--background-100) 92%, var(--accent-color) 8%);
  color: var(--primary-color);
  font-size: 0.72rem;
  font-weight: 700;
`

export const MessageMeta = styled.div<{ align?: 'start' | 'end' }>`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0 0 4px;
  font-size: 0.72rem;
  justify-content: ${({ align }) => (align === 'end' ? 'flex-end' : 'flex-start')};
`

export const MessageName = styled.span`
  max-width: 10em;
  overflow: hidden;
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  color: color-mix(in oklab, var(--primary-color) 78%, var(--normal-900) 22%);
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MessageTime = styled.time`
  color: color-mix(in oklab, var(--accent-color) 72%, var(--normal-600) 28%);
  font-size: 0.68rem;
  white-space: nowrap;
`

export const MessageStatus = styled.span<{ $tone?: 'default' | 'error' }>`
  color: ${({ $tone }) => ($tone === 'error' ? 'var(--primary-color)' : 'var(--text-muted)')};
  font-size: 0.68rem;
`

export const MessageContent = styled.p`
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--text-primary);
  overflow-wrap: anywhere;
`
