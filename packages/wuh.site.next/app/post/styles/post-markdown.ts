import styled from '@wuh.site/components/styled'

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

  .hljs { background: transparent; color: var(--code-color); }
  .hljs-keyword, .hljs-selector-tag, .hljs-deletion { color: var(--code-keyword); }
  .hljs-string, .hljs-addition { color: var(--code-string); }
  .hljs-comment, .hljs-quote { color: var(--code-comment); font-style: italic; }
  .hljs-function, .hljs-title.function_ { color: var(--code-function); }
  .hljs-number, .hljs-meta .hljs-string { color: var(--code-number); }
  .hljs-literal, .hljs-variable.language_ { color: var(--code-literal); }
  .hljs-type, .hljs-built_in { color: var(--code-type); }
  .hljs-title { color: var(--code-title); }
  .hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-selector-attr, .hljs-selector-pseudo { color: var(--code-attr); }
  .hljs-tag, .hljs-selector-class { color: var(--code-tag); }
  .hljs-symbol, .hljs-bullet, .hljs-link, .hljs-meta { color: var(--accent-color); }
  .hljs-section, .hljs-name { color: var(--accent-color); }
  .hljs-emphasis { font-style: italic; }
  .hljs-strong { font-weight: bold; }
`
