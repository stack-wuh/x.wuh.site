import styled from '@wuh.site/components/styled'

export const MarkdownBody = styled.article`
  --github-border: color-mix(in oklab, var(--accent-color) 18%, var(--normal-300));
  --github-muted: var(--text-secondary);
  --atom-inline-bg: color-mix(in oklab, var(--accent-color) 8%, transparent);
  --atom-inline-border: color-mix(in oklab, var(--accent-color) 22%, transparent);
  --atom-pre-bg: color-mix(in oklab, var(--background-200) 85%, var(--normal-300) 15%);
  --atom-pre-border: color-mix(in oklab, var(--normal-300) 35%, transparent);

  [data-color-scheme="dark"] & {
    --github-border: color-mix(in oklab, var(--normal-600) 55%, transparent);
    --github-muted: var(--text-secondary);
    --atom-inline-bg: color-mix(in oklab, var(--accent-color) 14%, transparent);
    --atom-inline-border: color-mix(in oklab, var(--accent-color) 28%, transparent);
    --atom-pre-bg: #1a1a1a;
    --atom-pre-border: rgba(255, 255, 255, 0.06);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 600;
    line-height: 1.3;
    margin: 28px 0 10px;
    color: inherit;
    letter-spacing: 0.02em;
  }

  h1 { font-size: 26px; }
  h2 { font-size: 18px; }
  h3 { font-size: 16px; }
  h4 { font-size: 15px; }
  h5 { font-size: 14px; }
  h6 { font-size: 13px; color: var(--github-muted); }

  h2 {
    position: relative;
    padding-left: 14px;
  }

  h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    border-radius: 999px;
    background: linear-gradient(180deg, var(--primary-color), var(--accent-color));
  }

  p {
    margin: 14px 0;
    font-family: var(--font-serif);
    font-size: 14px;
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    p {
      line-height: 1.5;
    }
  }

  a {
    color: var(--accent-color);
    text-decoration: none;
    border-bottom: 1px dashed color-mix(in oklab, var(--accent-color) 42%, transparent);
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  a:hover {
    border-bottom-style: solid;
    border-bottom-color: var(--accent-color);
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--atom-inline-bg);
    padding: 0.15em 0.45em;
    border-radius: 5px;
    border: 1px solid var(--atom-inline-border);
  }

  pre {
    background: var(--atom-pre-bg);
    border: 1px solid var(--atom-pre-border);
    border-radius: 10px;
    padding: 20px 22px;
    overflow: auto;
    font-size: 0.9em;
    position: relative;
    margin: 24px 0;
    box-shadow: var(--elevation-soft);
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
    background: color-mix(in oklab, var(--atom-pre-bg) 60%, transparent);
    color: var(--text-secondary);
    padding: 4px 10px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .copy-btn:hover {
    background: var(--atom-pre-border);
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .anchor {
    margin-left: 6px;
    opacity: 0;
    text-decoration: none;
    border-bottom: none;
    color: var(--text-secondary);
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
    margin: 12px 0;
    padding: 0 0 0 14px;
    border-left: 2px solid var(--accent-color);
    color: var(--text-secondary);
  }

  blockquote p {
    margin: 6px 0;
  }

  ul,
  ol {
    margin: 14px 0 14px 1.6em;
  }

  ul {
    list-style: none;
  }

  ul > li {
    position: relative;
    padding-left: 16px;
  }

  ul > li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.75em;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent-color);
  }

  ol {
    counter-reset: li;
    list-style: none;
  }

  ol > li {
    position: relative;
    padding-left: 24px;
    counter-increment: li;
  }

  ol > li::before {
    content: counter(li);
    position: absolute;
    left: 0;
    top: 0;
    font-family: var(--font-serif);
    font-variant-numeric: tabular-nums;
    color: var(--accent-color);
    font-weight: 600;
  }

  li + li {
    margin-top: 7px;
  }

  .task-list-item {
    list-style: none;
    margin-left: -1.4em;
    padding-left: 0;
  }

  .task-list-item::before {
    content: none;
  }

  .task-list-item input {
    margin-right: 0.5em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 13px;
  }

  th,
  td {
    padding: 8px 12px;
    text-align: left;
  }

  th {
    font-family: var(--font-serif);
    font-weight: 600;
    border-bottom: 2px solid var(--accent-color);
    color: var(--text-primary);
  }

  td {
    border-bottom: 1px solid color-mix(in oklab, var(--github-border) 55%, transparent);
    color: var(--text-secondary);
  }

  tr:last-child td {
    border-bottom: none;
  }

  img {
    max-width: 100%;
    height: auto;
    max-height: 340px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: var(--background-100);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  img[data-preview-index] {
    cursor: zoom-in;
  }

  img[data-preview-index]:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }

  hr {
    position: relative;
    border: none;
    width: 200px;
    height: 1px;
    margin: 32px auto;
    background: color-mix(in oklab, var(--accent-color) 55%, transparent);
  }

  hr::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    background: var(--background-100);
    box-shadow: 0 0 0 4px var(--background-100);
  }

  kbd {
    display: inline-block;
    padding: 3px 6px;
    font-size: 12px;
    font-family: var(--font-mono);
    background: var(--atom-inline-bg);
    border: 1px solid var(--atom-inline-border);
    border-radius: 6px;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
  }

  details {
    border: 1px solid var(--github-border);
    border-radius: 10px;
    padding: 12px 16px;
    background: color-mix(in oklab, var(--background-200) 55%, transparent);
    margin: 16px 0;
  }

  summary {
    cursor: pointer;
    font-weight: 600;
  }

  .shiki {
    background-color: var(--atom-pre-bg);
  }

  .shiki,
  .shiki span {
    color: var(--shiki-light, inherit);
  }

  [data-color-scheme="dark"] & .shiki,
  [data-color-scheme="dark"] & .shiki span {
    color: var(--shiki-dark, inherit);
  }
`

export const UpdateDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  color: var(--accent-color);
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: 0.06em;
  white-space: nowrap;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: color-mix(in oklab, var(--accent-color) 40%, transparent);
  }
`
