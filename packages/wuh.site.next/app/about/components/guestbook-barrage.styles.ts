import styled, { keyframes } from '@wuh.site/components/styled'

const floatLeft = keyframes`
  from {
    transform: translateX(18px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

export const GuestbookTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: var(--space-md);
  padding: 14px 18px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 18%, var(--normal-300) 82%);
  border-radius: var(--radius-card);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in oklab, var(--primary-color) 8%, transparent), transparent 52%),
    var(--background-100);
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: var(--elevation-soft);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px color-mix(in oklab, var(--primary-color) 12%, transparent);
    border-color: color-mix(in oklab, var(--primary-color) 36%, var(--normal-300) 64%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    background: color-mix(in oklab, var(--normal-700) 30%, var(--background-100));
    border-color: color-mix(in oklab, var(--normal-700) 45%, transparent);
  }
`

export const GuestbookTriggerLabel = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;

  strong {
    font-size: 0.98rem;
  }

  span {
    font-size: 0.84rem;
    color: var(--text-secondary);
  }
`

export const GuestbookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`

export const GuestbookHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0 16px;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-300) 32%, transparent);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--normal-700) 45%, transparent);
  }
`

export const GuestbookTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
`

export const GuestbookSubtitle = styled.p`
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 0.88rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
`

export const GuestbookBody = styled.div`
  flex: 1;
  min-height: 0;
  padding-top: 16px;
`

export const GuestbookLayout = styled.div<{ $layout: 'barrage' | 'split' | 'stack' }>`
  display: grid;
  grid-template-columns: ${({ $layout }) => ($layout === 'split' ? 'minmax(0, 2fr) minmax(280px, 1fr)' : '1fr')};
  gap: 16px;
  height: 100%;
  min-height: 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const GuestbookPanel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 14px;
`

export const GuestbookStage = styled.div`
  position: relative;
  flex: 1;
  min-height: 320px;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 35%, transparent);
  background:
    radial-gradient(circle at top left, color-mix(in oklab, var(--primary-color) 9%, transparent), transparent 38%),
    linear-gradient(180deg, color-mix(in oklab, var(--background-100) 96%, var(--primary-color) 4%), var(--background-100));

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 50%, transparent);
    background:
      radial-gradient(circle at top left, color-mix(in oklab, var(--primary-color) 12%, transparent), transparent 38%),
      linear-gradient(180deg, color-mix(in oklab, var(--normal-700) 18%, var(--background-100)), var(--background-100));
  }
`

export const BarragePanel = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  padding: 18px;
`

export const BarrageItem = styled.div<{ $lane: number; $tone: 'soft' | 'accent' }>`
  position: absolute;
  top: ${({ $lane }) => `${18 + $lane * 18}%`};
  left: 0;
  max-width: 88%;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${({ $tone }) =>
    $tone === 'accent'
      ? 'color-mix(in oklab, var(--primary-color) 14%, rgba(255,255,255,0.86))'
      : 'color-mix(in oklab, var(--background-100) 88%, transparent)'};
  color: var(--text-primary);
  border: 1px solid color-mix(in oklab, var(--normal-300) 25%, transparent);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.06);
  animation: ${floatLeft} 260ms ease-out both;

  @media (prefers-color-scheme: dark) {
    background: ${({ $tone }) =>
      $tone === 'accent'
        ? 'color-mix(in oklab, var(--primary-color) 18%, var(--background-100))'
        : 'color-mix(in oklab, var(--normal-700) 26%, var(--background-100))'};
    border-color: color-mix(in oklab, var(--normal-700) 45%, transparent);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.22);
  }
`

export const Composer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 26%, transparent);
  background: color-mix(in oklab, var(--background-100) 96%, var(--primary-color) 4%);

  input {
    width: 100%;
    min-height: 44px;
    border: 1px solid color-mix(in oklab, var(--normal-300) 40%, transparent);
    border-radius: 14px;
    padding: 12px 14px;
    background: var(--background-100);
    color: var(--text-primary);
    font: inherit;
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

  @media (prefers-color-scheme: dark) {
    background: color-mix(in oklab, var(--normal-700) 22%, var(--background-100));
    border-color: color-mix(in oklab, var(--normal-700) 45%, transparent);
  }
`

export const ComposerTextArea = styled.textarea`
  width: 100%;
  min-height: 44px;
  resize: none;
  border: 1px solid color-mix(in oklab, var(--normal-300) 40%, transparent);
  border-radius: 14px;
  padding: 12px 14px;
  background: var(--background-100);
  color: var(--text-primary);
  font: inherit;
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
  font-size: 0.8rem;
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
    min-height: 40px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid color-mix(in oklab, var(--normal-300) 45%, transparent);
    background: var(--background-100);
    color: var(--text-primary);
    cursor: pointer;
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

export const ComposerToggle = styled.button`
  border-color: color-mix(in oklab, var(--primary-color) 18%, var(--normal-300) 82%) !important;
  color: var(--primary-color) !important;
`

export const ComposerToggleLabel = styled.span`
  font-weight: 600;
`

export const GuestbookList = styled.aside`
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 20px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 32%, transparent);
  background: var(--background-100);
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 45%, transparent);
  }
`

export const GuestbookListTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-300) 26%, transparent);
  font-weight: 700;

  button {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: none;
    background: color-mix(in oklab, var(--normal-300) 18%, transparent);
    color: var(--text-primary);
    cursor: pointer;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

export const GuestbookListItem = styled.ul`
  list-style: none;
  padding: 8px;
  margin: 0;
  overflow: auto;
  min-height: 0;

  li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border-radius: 16px;
    background: color-mix(in oklab, var(--background-200) 66%, transparent);
  }

  li + li {
    margin-top: 8px;
  }
`

export const GuestbookListMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
  }
`

export const GuestbookListText = styled.p`
  margin: 0;
  color: var(--text-primary);
  line-height: 1.65;
`
