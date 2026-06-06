import styled, { css, keyframes } from '@wuh.site/components/styled'
import Card from '@wuh.site/components/card'
import Empty from '@wuh.site/components/empty'

const scrollProgress = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 5vw, 72px) 24px;
  color: var(--text-color);
  animation: contentEnter 0.25s ease-out;

  @keyframes contentEnter {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 9999;
    background: var(--primary-color);
    transform-origin: left center;
    pointer-events: none;

    @supports (animation-timeline: scroll()) {
      animation: ${scrollProgress} auto linear;
      animation-timeline: scroll(root);
    }

    @supports not (animation-timeline: scroll()) {
      transform: scaleX(0);
    }
  }
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 820px) 260px;
    gap: 24px;
    justify-content: center;
  }
`

export const MainColumn = styled.div`
  min-width: 0;
`

export const TocAside = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: sticky;
    top: 88px;
    align-self: start;
  }
`

export const TocCard = styled.div`
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  padding: 16px 16px 12px;

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 55%, transparent);
  }
`

export const TocTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--text-primary) 75%, transparent);
  margin-bottom: 10px;
`

export const TocList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 0;
`

export const TocItemLink = styled.a<{ $active?: boolean; $depth?: number }>`
  display: block;
  text-decoration: none;
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'color-mix(in oklab, var(--text-primary) 84%, transparent)')};
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${({ $active }) => ($active ? 'color-mix(in oklab, var(--primary-color) 12%, transparent)' : 'transparent')};
  margin-left: ${({ $depth }) => `${Math.min(2, Math.max(0, ($depth ?? 2) - 2)) * 10}px`};
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease, color var(--transition-fast) ease;

  &:hover {
    color: var(--text-primary);
    background: color-mix(in oklab, var(--background-200) 80%, transparent);
    border-color: color-mix(in oklab, var(--primary-color) 18%, transparent);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }
`

export const TocMobile = styled.details`
  margin: 0 0 var(--space-md);
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  overflow: hidden;

  @media (min-width: 1024px) {
    display: none;
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-weight: 700;
    color: var(--text-primary);
  }

  summary::-webkit-details-marker {
    display: none;
  }

  &[open] summary {
    border-bottom: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  }

  .toc-body {
    padding: 10px 10px 12px;
  }
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`

export const Title = styled.h1`
  color: var(--text-primary);
  font-family: var(--font-serif);
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
  box-shadow:
    var(--elevation-card),
    inset 0 1px 0 rgba(255,255,255,0.5);
  transition: box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;

  @media (max-width: 640px) {
    padding: 20px;
  }

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 35%, rgba(0,0,0,0.06));
    box-shadow:
      var(--elevation-card-hover),
      inset 0 1px 0 rgba(255,255,255,0.5);
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
    box-shadow:
      var(--elevation-card),
      inset 0 1px 0 rgba(255,255,255,0.03);

    &:hover {
      box-shadow:
        var(--elevation-card-hover),
        inset 0 1px 0 rgba(255,255,255,0.03);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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
  --github-border: color-mix(in oklab, var(--accent-color) 18%, var(--normal-300));
  --github-muted: var(--text-secondary);
  --atom-inline-bg: color-mix(in oklab, var(--accent-color) 8%, transparent);
  --atom-inline-border: color-mix(in oklab, var(--accent-color) 22%, transparent);
  --atom-pre-bg: color-mix(in oklab, var(--background-200) 85%, var(--normal-300) 15%);
  --atom-pre-border: color-mix(in oklab, var(--normal-300) 35%, transparent);
  --code-color: var(--text-primary);
  --code-keyword: var(--accent-color);
  --code-string: #3b7c3b;
  --code-comment: var(--text-secondary);
  --code-function: #5a4e9e;
  --code-number: #b35c1e;
  --code-literal: #7a3e8c;
  --code-type: #2d7a8c;
  --code-title: var(--text-primary);
  --code-attr: #b3801e;
  --code-tag: #2d5a8c;

  @media (prefers-color-scheme: dark) {
    --github-border: color-mix(in oklab, var(--normal-600) 55%, transparent);
    --github-muted: var(--text-secondary);
    --atom-inline-bg: color-mix(in oklab, var(--accent-color) 14%, transparent);
    --atom-inline-border: color-mix(in oklab, var(--accent-color) 28%, transparent);
    --atom-pre-bg: #1a1a1a;
    --atom-pre-border: rgba(255, 255, 255, 0.06);
    --code-color: #d4d4d4;
    --code-keyword: #c678dd;
    --code-string: #98c379;
    --code-comment: #5c6370;
    --code-function: #61afef;
    --code-number: #d19a66;
    --code-literal: #56b6c2;
    --code-type: #e5c07b;
    --code-title: #e06c75;
    --code-attr: #e5c07b;
    --code-tag: #e06c75;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: var(--line-height-heading);
    margin: 36px 0 18px;
    color: inherit;
  }

  h1, h2 {
    font-family: var(--font-serif);
    padding-bottom: 0.35em;
    border-bottom: 1px solid var(--github-border);
  }

  h1 { font-size: var(--font-size-2xl); }
  h2 { font-size: var(--font-size-xl); }
  h3 { font-size: var(--font-size-lg); }
  h4 { font-size: var(--font-size-md); }
  h5 { font-size: var(--font-size-base); }
  h6 { font-size: var(--font-size-sm); color: var(--github-muted); }

  p {
    margin: 20px 0;
    font-size: var(--font-size-base);
    line-height: var(--line-height-body);
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
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
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
    color: var(--code-color);
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
    margin: 24px 0;
    padding: 16px 20px;
    border-left: 4px solid var(--accent-color);
    color: var(--text-secondary);
    background: color-mix(in oklab, var(--accent-color) 5%, var(--background-200));
    border-radius: 0 8px 8px 0;
    font-style: italic;
  }

  blockquote p {
    margin: 8px 0;
  }

  ul,
  ol {
    margin: 20px 0 20px 1.8em;
  }

  li + li {
    margin-top: 8px;
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
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--github-border);
  }

  th,
  td {
    border: 1px solid var(--github-border);
    padding: 10px 14px;
    text-align: left;
  }

  th {
    background: color-mix(in oklab, var(--accent-color) 8%, var(--background-200));
    font-weight: 600;
  }

  tr:nth-child(even) td {
    background: color-mix(in oklab, var(--background-200) 45%, transparent);
  }

  img {
    max-width: 100%;
    height: auto;
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
    border: none;
    border-bottom: 1px solid var(--github-border);
    margin: 36px 0;
  }

  kbd {
    display: inline-block;
    padding: 3px 6px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
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

  .hljs {
    background: transparent;
    color: var(--code-color);
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-deletion {
    color: var(--code-keyword);
  }

  .hljs-string,
  .hljs-addition {
    color: var(--code-string);
  }

  .hljs-comment,
  .hljs-quote {
    color: var(--code-comment);
    font-style: italic;
  }

  .hljs-function,
  .hljs-title.function_ {
    color: var(--code-function);
  }

  .hljs-number,
  .hljs-meta .hljs-string {
    color: var(--code-number);
  }

  .hljs-literal,
  .hljs-variable.language_ {
    color: var(--code-literal);
  }

  .hljs-type,
  .hljs-built_in {
    color: var(--code-type);
  }

  .hljs-title {
    color: var(--code-title);
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: var(--code-attr);
  }

  .hljs-tag,
  .hljs-selector-class {
    color: var(--code-tag);
  }

  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta {
    color: var(--accent-color);
  }

  .hljs-section,
  .hljs-name {
    color: var(--accent-color);
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }
`

export const Toolbar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin-top: var(--space-xl);

  .toolbar-link {
    display: flex;
    align-items: center;
    min-height: 64px;
    padding: 14px 18px;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: var(--radius-card);
    border: 1px solid color-mix(in oklab, var(--normal-400) 18%, transparent);
    background: var(--background-100);
    box-shadow: var(--elevation-soft);
    position: relative;
    overflow: hidden;
    transition:
      transform 0.25s cubic-bezier(0.2, 0, 0, 1),
      box-shadow 0.25s cubic-bezier(0.2, 0, 0, 1),
      border-color 0.25s ease;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      width: 4px;
      height: 0;
      border-radius: 2px;
      background: var(--primary-color);
      transform: translateY(-50%);
      transition: height 0.3s cubic-bezier(0.2, 0, 0, 1);
    }
  }

  .toolbar-link.prev {
    width: 100%;
    justify-content: flex-start;

    &::before {
      left: 0;
    }
  }

  .toolbar-link.next {
    width: 56%;
    align-self: flex-end;
    justify-content: flex-end;

    &::before {
      right: 0;
    }
  }

  .toolbar-icon {
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: color-mix(in oklab, var(--normal-300) 14%, transparent);
    transition: background 0.25s ease;
  }

  .toolbar-icon svg {
    width: 18px;
    height: 18px;
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.25s ease;
  }

  .toolbar-label {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 14px;
    font-size: 0.9rem;
    line-height: 1.45;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toolbar-link.next .toolbar-icon {
    order: 2;
  }

  .toolbar-link.next .toolbar-label {
    order: 1;
    text-align: right;
  }

  /* flow indicator */
  .toolbar-flow {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .toolbar-flow-line,
  .toolbar-position {
    pointer-events: none;
  }

  .toolbar-flow-line {
    width: 2px;
    height: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    opacity: 0.35;
  }

  .toolbar-flow-line::before,
  .toolbar-flow-line::after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--normal-400);
  }

  .toolbar-flow-line::before {
    margin-bottom: auto;
  }

  .toolbar-back {
    position: absolute;
    right: 14px;
    top: 0;
    height: 64px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--normal-400);
    text-decoration: none;
    opacity: 0.45;
    transition: opacity 0.2s ease, color 0.2s ease;
    z-index: 2;
  }

  .toolbar-back svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .toolbar-back:hover {
    opacity: 0.9;
    color: var(--primary-color);
  }

  .toolbar-position {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--normal-400);
    opacity: 0.55;
    white-space: nowrap;
    user-select: none;
  }

  /* disabled */
  .toolbar-link[aria-disabled='true'] {
    color: var(--text-primary);
    opacity: 0.45;
    background: color-mix(in oklab, var(--background-200) 76%, var(--normal-200) 24%);
    border-color: color-mix(in srgb, var(--normal-300) 50%, transparent);
    box-shadow: none;
    cursor: not-allowed;

    &::before {
      background: var(--normal-400);
    }
  }

  .toolbar-link[aria-disabled='true'] * {
    cursor: not-allowed;
  }

  /* hover */
  a.toolbar-link:hover {
    border-color: color-mix(in oklab, var(--primary-color) 40%, transparent);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);

    &::before {
      height: 28px;
    }
  }

  a.toolbar-link.prev:hover .toolbar-icon svg {
    transform: translateX(-3px);
  }

  a.toolbar-link.next:hover .toolbar-icon svg {
    transform: translateX(3px);
  }

  a.toolbar-link.prev:hover .toolbar-icon {
    background: color-mix(in oklab, var(--primary-color) 18%, transparent);
  }

  a.toolbar-link.next:hover .toolbar-icon {
    background: color-mix(in oklab, var(--primary-color) 18%, transparent);
  }

  a.toolbar-link:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 24%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .toolbar-link,
    .toolbar-link::before,
    .toolbar-icon,
    .toolbar-icon svg {
      transition: none;
    }
    a.toolbar-link:hover {
      transform: none;
    }
  }

  @media (max-width: 640px) {
    gap: 20px;

    .toolbar-link.next {
      width: 100%;
      align-self: stretch;
    }

    .toolbar-flow-line {
      height: 10px;
    }

    .toolbar-back {
      display: none;
    }

    .toolbar-position {
      font-size: 0.68rem;
    }

    a.toolbar-link:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }
  }

  @media (prefers-color-scheme: dark) {
    .toolbar-link {
      border-color: color-mix(in oklab, var(--normal-700) 40%, transparent);
    }

    .toolbar-icon {
      background: color-mix(in oklab, var(--normal-700) 30%, transparent);
    }

    .toolbar-flow-line::before,
    .toolbar-flow-line::after {
      background: var(--normal-600);
    }

    a.toolbar-link:hover {
      border-color: color-mix(in oklab, var(--primary-color) 50%, transparent);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
    }

    a.toolbar-link:hover .toolbar-icon {
      background: color-mix(in oklab, var(--primary-color) 22%, transparent);
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
  --float-divider: var(--normal-300);

  position: fixed;
  right: 0;
  bottom: var(--space-xl);
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
    --float-button-width: 50px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
    border-right-color: transparent;
    background: color-mix(in oklab, var(--background-200) 75%, var(--background-900) 25%);
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
      background: color-mix(in oklab, var(--background-300) 70%, var(--background-900) 30%);
    }
  }
`

export const FloatingButton = styled.button`
  ${floatingButtonBase}
  padding: 0;
`

/* ====== PostHeader 子组件样式 ====== */

export const CoverImage = styled.div`
  width: 100%;
  max-height: 360px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: var(--space-lg);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`

export const AuthorAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid color-mix(in oklab, var(--accent-color) 30%, transparent);
  flex-shrink: 0;
`

export const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`

export const Summary = styled.blockquote`
  margin: 0 0 var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--accent-color);
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
  background: color-mix(in oklab, var(--accent-color) 6%, transparent);
  border-radius: 0 8px 8px 0;
`

export const OrnamentDivider = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 360px;
  margin: var(--space-md) auto;
  color: var(--text-muted);
  opacity: 0.5;

  .divider-line {
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.35;
  }

  .divider-diamond {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
  }
`
