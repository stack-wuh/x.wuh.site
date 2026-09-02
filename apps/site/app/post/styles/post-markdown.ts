import styled from '@wuh.site/components/styled'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

/**
 * 正文排印体系「铅字工坊」：
 * - 基准 15.5px/1.85，移动端（max 640）收敛 15px/1.85，平板端继承桌面值（三档断点契约）
 * - 章节记号：.sec-eyebrow 眉线 + .sec-text 章节字号，由 lib/articleTypography 注入
 * - 首字下沉：.dropcap，正文首段首字
 * - 链接/列表序号用 --primary-color（accent 金在纸面上对比度不足），链接另有虚线下划线双重可供性
 */
export const MarkdownBody = styled.article`
  font-size: 15.5px;

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

  & ::selection {
    background: var(--primary-color);
    color: var(--background-100);
  }

  h1, h2, h3, h4, h5, h6 {
    position: relative;
    font-family: var(--font-serif);
    font-weight: 700;
    line-height: 1.4;
    color: inherit;
    letter-spacing: 0.02em;
  }

  h1 { font-size: 26px; margin: 2.2em 0 0.6em; }

  h2, h3 { margin: 2.6em 0 0.8em; }

  h2 .sec-text {
    display: block;
    font-size: 23px;
  }

  h3 .sec-text {
    display: block;
    font-size: 20px;
  }

  h4 { font-size: 17px; margin: 1.8em 0 0.6em; }
  h5 { font-size: 16px; margin: 1.6em 0 0.6em; }
  h6 { font-size: 15px; margin: 1.6em 0 0.6em; color: var(--github-muted); }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    h2 .sec-text { font-size: 20px; }
    h3 .sec-text { font-size: 18px; }
  }

  .sec-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-family: var(--font-serif);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.42em;
    color: var(--primary-color);
  }

  .sec-eyebrow .stub {
    flex: none;
    width: 44px;
    height: 1px;
    background: color-mix(in oklab, var(--primary-color) 38%, transparent);
  }

  p {
    margin: 1.15em 0;
    font-family: var(--font-serif);
    font-size: 15.5px;
    line-height: 1.85;
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    p {
      font-size: 15px;
      line-height: 1.85;
    }
  }

  .dropcap {
    float: left;
    margin: 0.05em 0.14em 0 0;
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 3.35em;
    line-height: 1.15;
    color: var(--primary-color);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    border-bottom: 1px dashed color-mix(in oklab, var(--primary-color) 45%, transparent);
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  a:hover {
    border-bottom-style: solid;
    border-bottom-color: var(--primary-color);
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.88em;
    background: var(--atom-inline-bg);
    padding: 0.15em 0.45em;
    border-radius: 5px;
    border: 1px solid var(--atom-inline-border);
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  pre {
    background: var(--atom-pre-bg);
    border: 1px solid var(--atom-pre-border);
    border-radius: 10px;
    padding: 20px 22px;
    overflow: auto;
    font-size: 13.5px;
    line-height: 1.7;
    position: relative;
    margin: 1.8em 0;
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
    position: absolute;
    right: 0;
    top: 6px;
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
    margin: 1.9em 0;
    padding: 1.15em 4px;
    border-top: 1px solid color-mix(in oklab, var(--accent-color) 42%, transparent);
    border-bottom: 1px solid color-mix(in oklab, var(--accent-color) 42%, transparent);
    color: var(--text-secondary);
  }

  blockquote p {
    margin: 0.35em 0;
    font-size: 15.5px;
    line-height: 1.9;
  }

  blockquote p:first-child::before {
    content: '「';
    color: var(--primary-color);
    font-weight: 700;
  }

  blockquote p:last-child::after {
    content: '」';
    color: var(--primary-color);
    font-weight: 700;
  }

  ul,
  ol {
    margin: 1.15em 0 1.15em 1.7em;
  }

  ul {
    list-style: none;
  }

  ul > li {
    position: relative;
    padding-left: 18px;
    line-height: 1.88;
  }

  ul > li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.78em;
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
    padding-left: 26px;
    counter-increment: li;
    line-height: 1.88;
  }

  ol > li::before {
    content: counter(li);
    position: absolute;
    left: 0;
    top: 0.08em;
    font-family: var(--font-serif);
    font-variant-numeric: tabular-nums;
    color: var(--primary-color);
    font-weight: 700;
  }

  li + li {
    margin-top: 0.6em;
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
    margin: 1.6em 0;
    font-size: 14px;
  }

  th,
  td {
    padding: 9px 12px;
    text-align: left;
  }

  th {
    font-family: var(--font-serif);
    font-weight: 700;
    letter-spacing: 0.06em;
    border-bottom: 1px solid color-mix(in oklab, var(--normal-500) 70%, transparent);
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
    border: 1px solid color-mix(in oklab, var(--normal-400) 35%, transparent);
    background: var(--background-100);
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
