import styled, { css } from 'styled-components'
import Card from '@wuh.site/components/card'
import Empty from '@wuh.site/components/empty'

export const Container = styled.div`
  max-width: 820px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) 24px;
  color: var(--text-color);
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`

export const Title = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  color: color-mix(in oklab, var(--text-color) 76%, transparent);
  font-size: var(--font-size-sm);
  align-items: center;
`

export const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const ArticleCard = styled.section`
  background: var(--background-100);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-card);
  padding: 32px;
  color: var(--text-primary);
  box-shadow: var(--elevation-card);
  transition: transform var(--transition-fast) ease, box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;

  @media (max-width: 640px) {
    padding: 20px;
  }

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 35%, rgba(0,0,0,0.06));
    box-shadow: var(--elevation-card-hover);
    transform: translateY(-2px);
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`

export const RedundantInfoCard = styled(Card)`
  margin-top: var(--space-md);
  width: 100%;
  border-radius: var(--radius-card);
  border-color: color-mix(in oklab, var(--primary-color) 12%, var(--normal-300) 88%);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in oklab, var(--primary-color) 7%, transparent), transparent 52%),
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-100) 97%, var(--primary-color) 3%),
      var(--background-100)
    );
  box-shadow: none;
`

export const ShareInfoCard = styled(RedundantInfoCard)`
  margin-top: var(--space-sm);
`

export const ShareCardInner = styled.div`
  > div {
    margin-top: 0 !important;
    padding: 0 !important;
    border-top: none !important;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  button {
    background: transparent !important;
    border-color: var(--normal-300) !important;
    border-radius: 4px !important;
  }

  @media (prefers-color-scheme: dark) {
    button {
      border-color: var(--normal-500) !important;
    }
  }
`

export const MarkdownBody = styled.article`
  --github-border: rgba(208, 215, 222, 0.8);
  --github-muted: #57606a;
  --atom-inline-bg: rgba(106, 115, 125, 0.15);
  --atom-inline-border: rgba(106, 115, 125, 0.4);
  --atom-pre-bg: #fafbfc;
  --atom-pre-border: rgba(208, 215, 222, 0.8);

  font-family: var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-primary);
  word-break: break-word;

  @media (prefers-color-scheme: dark) {
    --github-border: rgba(110, 118, 129, 0.4);
    --github-muted: #8b949e;
    --atom-inline-bg: rgba(87, 96, 106, 0.35);
    --atom-inline-border: rgba(87, 96, 106, 0.6);
    --atom-pre-bg: #1f2329;
    --atom-pre-border: rgba(87, 96, 106, 0.7);
    color: var(--text-primary);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.4;
    margin: 32px 0 16px;
    color: inherit;
  }

  h1, h2 {
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--github-border);
  }

  h1 { font-size: 2.1em; }
  h2 { font-size: 1.7em; }
  h3 { font-size: 1.4em; }
  h4 { font-size: 1.2em; }
  h5 { font-size: 1.05em; }
  h6 { font-size: 1em; color: var(--github-muted); }

  p {
    margin: 16px 0;
  }

  a {
    color: var(--primary-color);
    text-decoration: underline;
    text-decoration-thickness: 0.08em;
    text-underline-offset: 3px;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.95em;
    background: var(--atom-inline-bg);
    padding: 0.15em 0.4em;
    border-radius: 6px;
    border: 1px solid var(--atom-inline-border);
  }

  pre {
    background: var(--atom-pre-bg);
    border: 1px solid var(--atom-pre-border);
    border-radius: 12px;
    padding: 18px 20px;
    overflow: auto;
    font-size: 0.95em;
    position: relative;
    margin: 24px 0;
  }

  pre code {
    background: transparent;
    padding: 0;
    border: none;
    display: block;
  }

  .copy-btn {
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 12px;
    border-radius: 8px;
    border: 1px solid var(--atom-pre-border);
    background: rgba(32, 35, 42, 0.05);
    color: var(--github-muted);
    padding: 4px 10px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .copy-btn:hover {
    background: rgba(98, 114, 164, 0.15);
    color: #528bff;
    border-color: #528bff;
  }

  .anchor {
    margin-left: 6px;
    opacity: 0;
    text-decoration: none;
    color: var(--github-muted);
    transition: opacity 0.2s ease;
  }

  h1:hover .anchor,
  h2:hover .anchor,
  h3:hover .anchor,
  h4:hover .anchor,
  h5:hover .anchor,
  h6:hover .anchor {
    opacity: 1;
  }

  blockquote {
    margin: 16px 0;
    padding: 0.25em 1em;
    border-left: 4px solid var(--github-border);
    color: var(--github-muted);
    background: rgba(175, 184, 193, 0.12);
    border-radius: 6px;
  }

  ul,
  ol {
    margin: 16px 0 16px 1.8em;
  }

  li + li {
    margin-top: 6px;
  }

  .task-list-item {
    list-style: none;
    margin-left: -1.4em;
  }

  .task-list-item input {
    margin-right: 0.5em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 0.95em;
  }

  th,
  td {
    border: 1px solid var(--github-border);
    padding: 10px 14px;
    text-align: left;
  }

  th {
    background: rgba(175, 184, 193, 0.25);
    font-weight: 600;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: var(--background-100);
  }

  img[data-preview-index] {
    cursor: zoom-in;
  }

  img[data-preview-index]:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  hr {
    border: none;
    border-bottom: 1px solid var(--github-border);
    margin: 32px 0;
  }

  kbd {
    display: inline-block;
    padding: 3px 6px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    background: var(--github-inline-bg);
    border: 1px solid var(--github-border);
    border-radius: 6px;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
  }

  details {
    border: 1px solid var(--github-border);
    border-radius: 10px;
    padding: 12px 16px;
    background: var(--github-code-bg);
    margin: 16px 0;
  }

  summary {
    cursor: pointer;
    font-weight: 600;
  }

  .hljs {
    background: transparent;
    color: inherit;
  }
`

export const Toolbar = styled.div`
  --toolbar-icon-slot-width: 40px;
  --toolbar-divider-color: color-mix(in srgb, var(--normal-400) 45%, transparent);
  --toolbar-disabled-bg: color-mix(in oklab, var(--background-200) 76%, var(--normal-200) 24%);
  --toolbar-disabled-border: color-mix(in srgb, var(--normal-300) 70%, transparent);
  --toolbar-disabled-text: var(--text-primary);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  margin-top: var(--space-lg);

  .toolbar-link {
    width: 40%;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    min-height: 56px;
    padding: 0;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: var(--radius-card);
    border: 1px solid rgba(0,0,0,0.06);
    background: var(--background-100);
    box-shadow: var(--elevation-soft);
    transition:
      color var(--transition-fast) ease,
      background-color var(--transition-fast) ease,
      border-color var(--transition-fast) ease,
      transform var(--transition-fast) ease,
      box-shadow var(--transition-fast) ease;
  }

  .toolbar-link.prev {
    justify-content: flex-start;
    text-align: left;
  }

  .toolbar-link.next {
    justify-content: flex-end;
    margin-left: auto;
  }

  .toolbar-icon {
    flex: 0 0 auto;
    width: var(--toolbar-icon-slot-width);
    min-height: 56px;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .toolbar-icon svg {
    width: 16px;
    height: 16px;
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .toolbar-label {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toolbar-link.next .toolbar-icon {
    order: 2;
  }

  .toolbar-link.next .toolbar-label {
    order: 1;
    text-align: left;
  }

  .toolbar-link.prev .toolbar-icon::after,
  .toolbar-link.next .toolbar-icon::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--toolbar-divider-color);
  }

  .toolbar-link.prev .toolbar-icon::after {
    right: 0;
  }

  .toolbar-link.next .toolbar-icon::before {
    left: 0;
  }

  .toolbar-link[aria-disabled='true'] {
    color: var(--toolbar-disabled-text);
    opacity: 1;
    background: var(--toolbar-disabled-bg);
    border-color: var(--toolbar-disabled-border);
    box-shadow: none;
    cursor: not-allowed;
  }

  .toolbar-link[aria-disabled='true'] .toolbar-icon {
    color: var(--toolbar-disabled-text);
  }

  .toolbar-link[aria-disabled='true'] * {
    cursor: not-allowed;
  }

  .toolbar-link[aria-disabled='true'] .toolbar-icon::after,
  .toolbar-link[aria-disabled='true'] .toolbar-icon::before {
    background: var(--toolbar-disabled-border);
  }

  a.toolbar-link:hover {
    background: color-mix(in oklab, var(--background-100) 92%, var(--primary-color) 8%);
    border-color: color-mix(in oklab, var(--primary-color) 55%, rgba(0,0,0,0.06));
    color: var(--text-primary);
    box-shadow: var(--elevation-card-hover);
    transform: translateY(-2px);
  }

  a.toolbar-link:focus-visible {
    background: color-mix(in oklab, var(--background-100) 92%, var(--primary-color) 8%);
    border-color: color-mix(in oklab, var(--primary-color) 55%, rgba(0,0,0,0.06));
    color: var(--text-primary);
    outline: 2px solid color-mix(in srgb, var(--primary-color) 24%, transparent);
    outline-offset: 2px;
  }

  a.toolbar-link.prev:hover .toolbar-icon svg {
    transform: translateX(-2px);
  }
  a.toolbar-link.next:hover .toolbar-icon svg {
    transform: translateX(2px);
  }

  .toolbar-icon svg {
    transition: transform var(--transition-fast) ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .toolbar-link {
      transition: none;
      transform: none;
    }

    a.toolbar-link.prev:hover .toolbar-icon svg,
    a.toolbar-link.next:hover .toolbar-icon svg {
      transform: none;
    }

    .toolbar-icon svg {
      transition: none;
    }
  }

  @media (prefers-color-scheme: dark) {
    --toolbar-divider-color: color-mix(in srgb, var(--normal-700) 55%, transparent);
    --toolbar-disabled-bg: color-mix(in oklab, var(--background-300) 82%, var(--normal-800) 18%);
    --toolbar-disabled-border: color-mix(in srgb, var(--normal-700) 80%, transparent);
    --toolbar-disabled-text: var(--text-primary);
    .toolbar-link {
      border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
    }
  }
`

export const StatusEmpty = styled(Empty)`
  margin-bottom: var(--space-lg);
  min-height: 220px;
`

export const CommentPlaceholder = styled(Empty)`
  margin-top: var(--space-md);
`

export const FloatingButtonGroup = styled.div`
  --float-button-width: 50px;
  --float-offset: 0px;
  --float-bottom: var(--space-xl);
  --float-divider: var(--normal-300);

  position: fixed;
  right: var(--float-offset);
  bottom: var(--float-bottom);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 20;
  border: 1px solid var(--normal-300);
  border-right: 0;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
  overflow: hidden;
  background: var(--background-100);

  & > * {
    width: var(--float-button-width);
  }

  & > * + * {
    border-top: 1px solid var(--float-divider);
  }

  @media (max-width: 640px) {
    --float-offset: 0px;
    --float-button-width: 50px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
    border-right-color: transparent;
    background: color-mix(in oklab, var(--background-200) 75%, var(--normal-900) 25%);
    --float-divider: var(--normal-600);

    & > * + * {
      border-top-color: var(--float-divider);
    }
  }
`

const floatingButtonBase = css`
  border: none;
  background: transparent;
  color: var(--text-primary);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
  min-width: 50px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 12px;
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color 0.22s ease,
    background-color 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
  will-change: transform;

  &:hover {
    color: var(--primary-color);
    background: var(--background-200);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
    transform: translateX(-2px);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (prefers-color-scheme: dark) {
    background: transparent;
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.35);

    &:hover {
      background: color-mix(in oklab, var(--background-300) 70%, var(--normal-900) 30%);
    }
  }
`

const createLightGradient = (percent: number) => css`
  linear-gradient(
    90deg,
    color-mix(in srgb, var(--primary-color) 35%, var(--background-100)) 0%,
    color-mix(in srgb, var(--primary-color) 55%, var(--background-100)) ${percent}%,
    var(--background-100) ${percent}%,
    var(--background-100) 100%
  )
`

const createDarkGradient = (percent: number) => css`
  linear-gradient(
    90deg,
    color-mix(in srgb, var(--primary-color) 28%, var(--background-200)) 0%,
    color-mix(in srgb, var(--primary-color) 46%, var(--background-200)) ${percent}%,
    color-mix(in srgb, var(--background-200) 80%, var(--normal-900)) ${percent}%,
    color-mix(in srgb, var(--background-200) 80%, var(--normal-900)) 100%
  )
`

export const FloatingButton = styled.button<{ $variant?: 'default' | 'progress'; $percent?: number }>`
  ${floatingButtonBase}
  padding: 0;

  ${(props) =>
    props.$variant === 'progress' &&
    css`
      position: relative;
      overflow: hidden;
      background: ${createLightGradient(props.$percent ?? 0)};

      &:hover {
        color: var(--text-primary);
        background: ${createLightGradient(props.$percent ?? 0)};
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--background-100) 60%, transparent);
      }

      svg {
        position: relative;
        z-index: 1;
      }

      @media (prefers-color-scheme: dark) {
        background: ${createDarkGradient(props.$percent ?? 0)};

        &:hover {
          background: ${createDarkGradient(props.$percent ?? 0)};
        }

        &::after {
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--normal-900) 35%, transparent);
        }
      }
    `}
`
