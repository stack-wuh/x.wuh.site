'use client'

import styled from 'styled-components'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const Wrapper = styled.div`
  margin-top: var(--space-xl);
`

export const CommentsHeader = styled.h3`
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  margin: 0;
`

export const CommentItem = styled.div<{ $isGithub?: boolean }>`
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid ${hairline};

  &:last-child {
    border-bottom: none;
  }
`

export const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: color-mix(in oklab, var(--primary-color) 14%, var(--background-100));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--primary-color);
  border: 1px solid color-mix(in oklab, var(--primary-color) 18%, transparent);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const AvatarFallback = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`

export const CommentBody = styled.div`
  flex: 1;
  min-width: 0;
`

export const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: var(--font-size-sm);
`

export const CommentAuthor = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`

export const CommentTime = styled.time`
  color: var(--text-muted);
  font-size: var(--font-size-xs);
`

export const CommentSource = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  padding: 1px 6px;
  border-radius: 4px;
  background: color-mix(in oklab, var(--normal-300) 12%, transparent);
`

export const CommentText = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  word-break: break-word;

  img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid ${hairline};
    background: var(--background-100);
  }
`

export const CommentStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: var(--font-size-xs);
  padding: 1px 6px;
  border-radius: 4px;
  color: ${({ $status }) =>
    $status === 'approved' ? 'var(--success-color)' :
    $status === 'pending' ? 'var(--warning-color)' :
    'var(--danger-color)'};
  background: ${({ $status }) =>
    $status === 'approved' ? 'color-mix(in oklab, var(--success-color) 10%, transparent)' :
    $status === 'pending' ? 'color-mix(in oklab, var(--warning-color) 10%, transparent)' :
    'color-mix(in oklab, var(--danger-color) 10%, transparent)'};
`

export const InputArea = styled.div`
  margin-top: var(--space-lg);
  display: grid;
  gap: 10px;
`

export const NicknameRow = styled.div``

export const NicknameInput = styled.input`
  width: 100%;
  max-width: 200px;
  padding: 8px 12px;
  border: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);
  border-radius: 8px;
  background: var(--background-200);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  outline: none;

  &:focus {
    border-color: color-mix(in oklab, var(--primary-color) 36%, transparent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`

export const ContentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px 12px;
  border: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);
  border-radius: 8px;
  background: var(--background-200);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    border-color: color-mix(in oklab, var(--primary-color) 36%, transparent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`

export const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 32px 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 24px 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`
