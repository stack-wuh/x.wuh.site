import styled from 'styled-components'
import Card from '@wuh.site/components/card'

export const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 64px 24px;
  color: var(--text-primary);
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
  color: var(--text-muted);
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
  border: 1px solid var(--normal-300);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--elevation-soft);

  @media (max-width: 640px) {
    padding: 20px;
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);
    border-color: var(--normal-600);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  }
`

export const RedundantInfoCard = styled(Card)`
  margin-top: var(--space-md);
  width: 100%;
  border-radius: 12px;
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
    border-radius: 12px;
    border: 1px solid var(--github-border);
    background: var(--background-100);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
    transition:
      color var(--transition-fast) ease,
      background-color var(--transition-fast) ease,
      border-color var(--transition-fast) ease;
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
    background: var(--background-200);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  a.toolbar-link:focus-visible {
    background: var(--background-200);
    border-color: var(--primary-color);
    color: var(--primary-color);
    outline: 2px solid color-mix(in srgb, var(--primary-color) 24%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: dark) {
    --toolbar-divider-color: color-mix(in srgb, var(--normal-700) 55%, transparent);
    --toolbar-disabled-bg: color-mix(in oklab, var(--background-300) 82%, var(--normal-800) 18%);
    --toolbar-disabled-border: color-mix(in srgb, var(--normal-700) 80%, transparent);
    --toolbar-disabled-text: var(--text-primary);
  }
`

export const Empty = styled.div`
  text-align: center;
  color: var(--text-secondary);
  padding: 80px 0;
`
