import styled from '@wuh.site/components/styled'

export const GuestbookTrigger = styled.button`
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

export const GuestbookWrapper = styled.div`
  --guestbook-border: color-mix(in oklab, var(--normal-300) 34%, transparent);
  --guestbook-border-strong: color-mix(in oklab, var(--normal-300) 45%, transparent);
  --guestbook-stage-grid: color-mix(in oklab, var(--normal-300) 14%, transparent);
  --guestbook-stage-bg: linear-gradient(
    180deg,
    color-mix(in oklab, var(--background-200) 58%, transparent),
    var(--background-100)
  );
  --guestbook-avatar-bg: color-mix(in oklab, var(--primary-color) 14%, var(--background-100));
  --guestbook-bubble-mine-bg: color-mix(in oklab, var(--primary-color) 14%, var(--background-100));
  --guestbook-bubble-other-bg: color-mix(in oklab, var(--background-100) 94%, var(--background-200));
  --guestbook-bubble-mine-border: color-mix(in oklab, var(--primary-color) 24%, transparent);
  --guestbook-bubble-other-border: color-mix(in oklab, var(--normal-300) 36%, transparent);
  --guestbook-composer-bg: color-mix(in oklab, var(--background-100) 96%, var(--primary-color) 4%);
  --guestbook-control-bg: var(--background-100);
  --guestbook-shadow: 0 8px 18px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  [data-color-scheme="dark"] & {
    --guestbook-border: color-mix(in oklab, var(--normal-600) 42%, transparent);
    --guestbook-border-strong: color-mix(in oklab, var(--normal-500) 48%, transparent);
    --guestbook-stage-grid: color-mix(in oklab, var(--normal-600) 16%, transparent);
    --guestbook-stage-bg: linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-200) 72%, var(--background-100)),
      var(--background-100)
    );
    --guestbook-avatar-bg: color-mix(in oklab, var(--primary-color) 20%, var(--background-200));
    --guestbook-bubble-mine-bg: color-mix(in oklab, var(--primary-color) 24%, var(--background-100));
    --guestbook-bubble-other-bg: color-mix(in oklab, var(--background-200) 78%, var(--background-100));
    --guestbook-bubble-mine-border: color-mix(in oklab, var(--primary-color) 36%, transparent);
    --guestbook-bubble-other-border: color-mix(in oklab, var(--normal-500) 42%, transparent);
    --guestbook-composer-bg: color-mix(in oklab, var(--background-200) 72%, var(--background-100));
    --guestbook-control-bg: color-mix(in oklab, var(--background-200) 86%, var(--background-100));
    --guestbook-shadow: 0 12px 20px rgba(0, 0, 0, 0.16);
  }
`

export const GuestbookHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0 16px;
  border-bottom: 1px solid var(--guestbook-border);
`

export const GuestbookTitle = styled.h3`
  margin: 0;
  font-size: 0.98rem;
`

export const GuestbookSubtitle = styled.p`
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.6;
`

export const LayoutBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--primary-color) 10%, transparent);
  color: var(--primary-color);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
`

export const GuestbookBody = styled.div`
  flex: 1;
  min-height: 0;
  padding-top: 16px;
`

export const GuestbookPanel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  gap: 12px;
`

export const GuestbookStage = styled.div`
  position: relative;
  flex: 1;
  min-height: 320px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--guestbook-border);
  background:
    linear-gradient(90deg, var(--guestbook-stage-grid) 1px, transparent 1px),
    var(--guestbook-stage-bg);
  background-size: 22px 22px, auto;
`

export const ChatFeed = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
  padding: 18px;
  scroll-behavior: smooth;

  @media (max-width: 640px) {
    padding: 14px 12px;
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

export const Composer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--guestbook-border);
  background: var(--guestbook-composer-bg);

  input {
    width: 100%;
    min-height: 38px;
    border: 1px solid var(--guestbook-border-strong);
    border-radius: 10px;
    padding: 8px 11px;
    background: var(--guestbook-control-bg);
    color: var(--text-primary);
    font: inherit;
    font-size: 0.82rem;
    line-height: 1.5;
    outline: none;
  }

  input::placeholder {
    color: var(--text-secondary);
  }

  input:focus {
    border-color: color-mix(in oklab, var(--primary-color) 36%, var(--normal-300) 64%);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 12%, transparent);
  }
`

export const ComposerTextArea = styled.textarea`
  width: 100%;
  min-height: 38px;
  resize: none;
  border: 1px solid var(--guestbook-border-strong);
  border-radius: 10px;
  padding: 8px 11px;
  background: var(--guestbook-control-bg);
  color: var(--text-primary);
  font: inherit;
  font-size: 0.82rem;
  line-height: 1.5;
  outline: none;

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    border-color: color-mix(in oklab, var(--primary-color) 36%, var(--normal-300) 64%);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 12%, transparent);
  }
`

export const ComposerMeta = styled.div<{ $overLimit: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: ${({ $overLimit }) => ($overLimit ? 'var(--primary-color)' : 'var(--text-secondary)')};
  font-size: 0.72rem;
`

export const ComposerActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 36px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--guestbook-border-strong);
    background: var(--guestbook-control-bg);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 0.82rem;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`
