import Button from '@wuh.site/components/button'
import styled from '@wuh.site/components/styled'

/* ====== Trigger ====== */

export const GuestbookTrigger = styled(Button)`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 44%, transparent);
  border-left: 3px solid var(--accent-color);
  border-radius: 8px;
  background:
    linear-gradient(90deg, color-mix(in oklab, var(--accent-color) 7%, transparent), transparent 42%),
    var(--background-100);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }

  &:hover {
    background:
      linear-gradient(90deg, color-mix(in oklab, var(--accent-color) 10%, transparent), transparent 48%),
      var(--background-200);
    border-color: color-mix(in oklab, var(--accent-color) 26%, var(--normal-300) 74%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    background:
      linear-gradient(90deg, color-mix(in oklab, var(--accent-color) 10%, transparent), transparent 44%),
      color-mix(in oklab, var(--normal-700) 22%, var(--background-100));
    border-color: color-mix(in oklab, var(--normal-700) 45%, transparent);
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

  @media (prefers-color-scheme: dark) {
    border-color: var(--background-100);
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
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
`

export const GuestbookTriggerPreview = styled.span`
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.55;
`

export const GuestbookTriggerCta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;

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
    color-mix(in oklab, var(--background-100) 94%, var(--accent-color) 6%),
    color-mix(in oklab, var(--background-200) 86%, var(--background-100) 14%)
  );
  --guestbook-stage-highlight: linear-gradient(
    90deg,
    color-mix(in oklab, var(--accent-color) 9%, transparent),
    transparent 36%,
    color-mix(in oklab, var(--primary-color) 5%, transparent)
  );
  --guestbook-avatar-bg: color-mix(in oklab, var(--primary-color) 14%, var(--background-100));
  --guestbook-bubble-mine-bg: color-mix(in oklab, var(--primary-color) 14%, var(--background-100));
  --guestbook-bubble-other-bg: color-mix(in oklab, var(--background-100) 94%, var(--background-200));
  --guestbook-bubble-mine-border: color-mix(in oklab, var(--primary-color) 24%, transparent);
  --guestbook-bubble-other-border: color-mix(in oklab, var(--normal-300) 36%, transparent);
  --guestbook-shadow: 0 8px 18px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  [data-color-scheme="dark"] & {
    --guestbook-border: color-mix(in oklab, var(--normal-600) 42%, transparent);
    --guestbook-border-strong: color-mix(in oklab, var(--normal-500) 48%, transparent);
    --guestbook-stage-bg: linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-100) 88%, var(--accent-color) 12%),
      color-mix(in oklab, var(--background-100) 92%, var(--background-200) 8%)
    );
    --guestbook-stage-highlight: linear-gradient(
      90deg,
      color-mix(in oklab, var(--accent-color) 10%, transparent),
      transparent 42%,
      color-mix(in oklab, var(--primary-color) 6%, transparent)
    );
    --guestbook-avatar-bg: color-mix(in oklab, var(--primary-color) 20%, var(--background-200));
    --guestbook-bubble-mine-bg: color-mix(in oklab, var(--primary-color) 24%, var(--background-100));
    --guestbook-bubble-other-bg: color-mix(in oklab, var(--background-200) 78%, var(--background-100));
    --guestbook-bubble-mine-border: color-mix(in oklab, var(--primary-color) 36%, transparent);
    --guestbook-bubble-other-border: color-mix(in oklab, var(--normal-500) 42%, transparent);
    --guestbook-shadow: 0 12px 20px rgba(0, 0, 0, 0.16);
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
  flex: 1;
  min-height: 320px;
  overflow: hidden;
  border-radius: 16px 16px 12px 12px;
  border: 1px solid var(--guestbook-border);
  background:
    var(--guestbook-stage-highlight),
    var(--guestbook-stage-bg);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, var(--background-100) 76%, transparent),
    inset 0 -24px 48px color-mix(in oklab, var(--background-100) 62%, transparent);
`

export const ChatFeed = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
  padding: 18px 18px 80px;
  scroll-behavior: smooth;

  @media (max-width: 640px) {
    padding: 14px 12px 76px;
  }
`

export const ChatRow = styled.div<{ $mine: boolean }>`
  display: flex;
  flex-direction: ${({ $mine }) => ($mine ? 'row-reverse' : 'row')};
  align-items: flex-start;
  gap: 9px;
`

export const ChatAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 10px;
  background: var(--guestbook-avatar-bg);
  color: var(--primary-color);
  border: 1px solid color-mix(in oklab, var(--primary-color) 18%, transparent);
  font-size: 0.82rem;
  font-weight: 700;
`

export const ChatBubble = styled.div<{ $mine: boolean }>`
  position: relative;
  max-width: min(68%, 620px);
  padding: 9px 11px 8px;
  border-radius: ${({ $mine }) => ($mine ? '12px 2px 12px 12px' : '2px 12px 12px 12px')};
  background: ${({ $mine }) =>
    $mine ? 'var(--guestbook-bubble-mine-bg)' : 'var(--guestbook-bubble-other-bg)'};
  color: var(--text-primary);
  border: 1px solid
    ${({ $mine }) =>
      $mine ? 'var(--guestbook-bubble-mine-border)' : 'var(--guestbook-bubble-other-border)'};
  box-shadow: var(--guestbook-shadow);

  p {
    margin: 5px 0 0;
    font-size: 0.86rem;
    line-height: 1.62;
    overflow-wrap: anywhere;
  }

  @media (max-width: 640px) {
    max-width: calc(100% - 44px);
  }
`

export const ChatMessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.72rem;

  span {
    max-width: 10em;
    overflow: hidden;
    color: var(--text-primary);
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  time {
    white-space: nowrap;
  }
`

export const ChatStatus = styled.span<{ $tone?: 'error' }>`
  display: inline-flex;
  margin-top: 6px;
  color: ${({ $tone }) => ($tone === 'error' ? 'var(--primary-color)' : 'var(--text-secondary)')};
  font-size: 0.7rem;
`

/* ====== Floating Composer Bar ====== */

export const Composer = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -22px 8px 8px;
  padding: 10px 10px 10px 16px;
  border-radius: 14px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 26%, transparent);
  background: color-mix(in oklab, var(--background-100) 94%, var(--background-200) 6%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.06),
    0 0 0 1px var(--background-100);
  z-index: 2;

  &:focus-within {
    border-color: color-mix(in oklab, var(--primary-color) 28%, var(--normal-300) 72%);
  }

  [data-color-scheme="dark"] & {
    background: color-mix(in oklab, var(--background-100) 88%, var(--background-200) 12%);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.24),
      0 0 0 1px color-mix(in oklab, var(--background-100) 80%, transparent);
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
