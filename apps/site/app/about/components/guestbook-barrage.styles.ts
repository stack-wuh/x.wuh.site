import Button from '@wuh.site/components/button'
import { MessageCard } from '@wuh.site/components/message-card'
import ScrollArea from '@wuh.site/components/scroll-area'
import styled from 'styled-components'

/* ====== Trigger ====== */

export const GuestbookTrigger = styled(Button)`
  --guestbook-trigger-title: var(--text-primary);
  --guestbook-trigger-preview: var(--text-muted);
  --guestbook-trigger-cta: var(--text-secondary);

  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 18%, var(--normal-300) 82%);
  border-left: 3px solid var(--primary-color);
  border-radius: 8px;
  background:
    linear-gradient(
      105deg,
      color-mix(in oklab, var(--primary-color) 12%, var(--background-100)) 0%,
      color-mix(in oklab, var(--primary-color) 6%, var(--background-100)) 42%,
      var(--background-100) 78%
    );
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition:
    background 220ms ease,
    border-color 220ms ease;

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }

  &:hover,
  &:focus-visible {
    --guestbook-trigger-title: var(--text-primary);
    --guestbook-trigger-preview: var(--text-secondary);
    --guestbook-trigger-cta: var(--primary-color);

    background:
      linear-gradient(
        105deg,
        color-mix(in oklab, var(--primary-color) 16%, var(--background-100)) 0%,
        color-mix(in oklab, var(--primary-color) 8%, var(--background-100)) 48%,
        var(--background-100) 82%
      );
    border-color: color-mix(in oklab, var(--primary-color) 32%, var(--normal-300) 68%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
    outline-offset: 2px;
  }

  [data-color-scheme='dark'] & {
    background:
      linear-gradient(
        105deg,
        color-mix(in oklab, var(--primary-color) 14%, var(--background-100)) 0%,
        color-mix(in oklab, var(--primary-color) 7%, var(--background-100)) 44%,
        var(--background-100) 78%
      );
    border-color: color-mix(in oklab, var(--primary-color) 24%, var(--normal-600) 76%);

    &:hover,
    &:focus-visible {
      background:
        linear-gradient(
          105deg,
          color-mix(in oklab, var(--primary-color) 19%, var(--background-100)) 0%,
          color-mix(in oklab, var(--primary-color) 10%, var(--background-100)) 48%,
          var(--background-100) 82%
        );
      border-color: color-mix(in oklab, var(--primary-color) 38%, var(--normal-600) 62%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 520px) {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: flex-start;
  }
`

export const GuestbookTriggerAvatars = styled.span`
  display: flex;
  align-items: center;
  min-width: 54px;
`

export const GuestbookTriggerAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--background-100);
  background: color-mix(in oklab, var(--accent-color) 18%, var(--background-100));
  color: var(--accent-color);
  font-size: 12px;
  font-weight: 700;

  & + & {
    margin-left: -10px;
    background: color-mix(in oklab, var(--primary-color) 14%, var(--background-100));
    color: var(--primary-color);
  }
`

export const GuestbookTriggerCopy = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
`

export const GuestbookTriggerLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--accent-color);
`

export const GuestbookTriggerTitle = styled.strong`
  color: var(--guestbook-trigger-title);
  font-size: 14px;
  font-weight: 700;
  transition: color 220ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const GuestbookTriggerPreview = styled.span`
  color: var(--guestbook-trigger-preview);
  font-size: 12px;
  line-height: 1.55;
  transition: color 220ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const GuestbookTriggerCta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--guestbook-trigger-cta);
  font-size: 12px;
  white-space: nowrap;
  transition: color 220ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 520px) {
    grid-column: 2;
    margin-top: 2px;
  }
`

/* ====== Dialog Inner ====== */

export const GuestbookWrapper = styled.div`
  --guestbook-border: color-mix(in oklab, var(--normal-300) 34%, transparent);
  --guestbook-border-strong: color-mix(in oklab, var(--normal-300) 45%, transparent);
  --guestbook-stage-bg: linear-gradient(
    180deg,
    color-mix(in oklab, var(--background-100) 96%, var(--accent-color) 4%),
    color-mix(in oklab, var(--background-200) 88%, var(--background-100) 12%)
  );
  --guestbook-stage-border: color-mix(in oklab, var(--primary-color) 28%, var(--normal-300) 72%);
  --guestbook-composer-bg: color-mix(in oklab, var(--background-100) 94%, var(--accent-color) 6%);
  --guestbook-composer-divider: color-mix(in oklab, var(--primary-color) 30%, transparent);

  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  [data-color-scheme="dark"] & {
    --guestbook-border: color-mix(in oklab, var(--normal-600) 42%, transparent);
    --guestbook-border-strong: color-mix(in oklab, var(--normal-500) 48%, transparent);
    --guestbook-stage-bg: linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-100) 92%, var(--accent-color) 8%),
      color-mix(in oklab, var(--background-100) 94%, var(--background-200) 6%)
    );
    --guestbook-stage-border: color-mix(in oklab, var(--primary-color) 34%, var(--normal-600) 66%);
    --guestbook-composer-bg: color-mix(in oklab, var(--background-100) 92%, var(--background-200) 8%);
    --guestbook-composer-divider: color-mix(in oklab, var(--primary-color) 36%, transparent);
  }
`

export const GuestbookBody = styled.div`
  flex: 1;
  min-height: 0;
`

export const GuestbookPanel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
`

export const GuestbookStage = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 320px;
  overflow: hidden;
  border-radius: 16px 16px 12px 12px;
  border: 1px solid var(--guestbook-stage-border);
  background: var(--guestbook-stage-bg);
`

export const GuestbookFeed = styled(ScrollArea)`
  height: 100%;
`

export const ChatRow = styled.div<{ $mine: boolean }>`
  display: flex;
  flex-direction: ${({ $mine }) => ($mine ? 'row-reverse' : 'row')};
  align-items: flex-start;
  gap: 9px;
`

/* 气泡语境下的宽度约束：窄屏给头像留出空间 */
export const GuestbookCard = styled(MessageCard)`
  max-width: min(68%, 620px);

  @media (max-width: 640px) {
    max-width: calc(100% - 44px);
  }
`

/* ====== Floating Composer Bar ====== */

export const Composer = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 8px 8px;
  padding: 10px 10px 10px 16px;
  border: none;
  border-top: 1px dashed var(--guestbook-composer-divider);
  border-radius: 0 0 12px 12px;
  background: var(--guestbook-composer-bg);
  z-index: 2;

  &:focus-within {
    border-top-color: color-mix(in oklab, var(--primary-color) 55%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const ComposerInput = styled.input`
  flex: 1;
  min-height: 40px;
  border: none;
  padding: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.86rem;
  line-height: 1.5;
  outline: none;

  &::placeholder {
    color: var(--text-muted);
  }
`

export const ComposerSend = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--primary-color);
  color: var(--background-100);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  line-height: 0;

  &:hover:not(:disabled) {
    background: color-mix(in oklab, var(--primary-color) 82%, black);
    transform: scale(1.04);
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const ComposerBadge = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 32px;
  height: 32px;
  padding: 0 4px;
  border: 1px solid var(--guestbook-border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.2s ease;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 30%, var(--normal-300) 70%);
  }
`

export const ComposerNicknameInput = styled.input`
  flex: 1;
  min-height: 40px;
  border: none;
  padding: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.86rem;
  line-height: 1.5;
  outline: none;

  &::placeholder {
    color: var(--text-muted);
  }
`

export const NewMessageBanner = styled.button`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 99px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 30%, var(--normal-300) 70%);
  background: color-mix(in oklab, var(--background-100) 92%, var(--primary-color) 8%);
  color: var(--primary-color);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 1px 2px color-mix(in oklab, var(--normal-700) 14%, transparent);
  transition: background 180ms ease, border-color 180ms ease;

  &:hover {
    background: color-mix(in oklab, var(--background-100) 82%, var(--primary-color) 18%);
    border-color: color-mix(in oklab, var(--primary-color) 50%, var(--normal-300) 50%);
  }

  [data-color-scheme='dark'] & {
    background: color-mix(in oklab, var(--background-100) 88%, var(--primary-color) 12%);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.24);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const GuestbookFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px 2px;
  min-height: 32px;
`

export const GuestbookFooterLink = styled.a`
  font-size: 0.72rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 160ms ease;

  &:hover {
    color: var(--primary-color);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
