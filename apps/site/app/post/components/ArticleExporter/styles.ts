import styled, { keyframes } from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'
import { MarkdownBody } from '../../styles'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const ExportContainer = styled.div`
  position: relative;
  width: 800px;
  background: #FFFBF8;
  color: #2A1E16;
  pointer-events: none;

  --primary-color: #C94A44;
  --accent-color: #E3B567;
  --text-primary: #2A1E16;
  --text-secondary: #8A6E5C;
  --text-muted: #B9A998;
  --background-100: #FFFBF8;
  --background-200: #FDF3EC;
  --background-300: #F5D0BC;
  --normal-300: #D4C8B8;
  --normal-500: #B9A998;
  --normal-600: #8A6E5C;
  --normal-700: #5A4438;
  --font-serif: Georgia, "Noto Serif SC", serif;
  --font-sans: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "SF Mono", Menlo, monospace;
  --elevation-soft: 0 2px 8px rgba(42, 30, 22, 0.08);
`

export const ExportBody = styled(MarkdownBody)`
  &&& {
    --github-border: #D6CBB9;
    --github-muted: #8A6E5C;
    --atom-inline-bg: rgba(227, 181, 103, 0.08);
    --atom-inline-border: rgba(227, 181, 103, 0.22);
    --atom-pre-bg: #F6EFE6;
    --atom-pre-border: rgba(212, 200, 184, 0.35);
  }

  &&& .shiki,
  &&& .shiki span {
    color: var(--shiki-light, inherit) !important;
  }

  .copy-btn,
  .anchor {
    display: none !important;
  }

  img {
    max-height: 420px !important;
  }
`

export const ExportHeader = styled.div`
  padding: 48px 48px 0;

  .export-cover {
    width: 100%;
    height: auto;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    object-fit: cover;
    display: block;
  }
`

export const ExportTitle = styled.h1`
  margin: 28px 0 12px;
  font-family: Georgia, "Noto Serif SC", serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: #2A1E16;
`

export const ExportMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-family: "Noto Sans SC", "PingFang SC", sans-serif;
  font-size: 14px;
  color: #8A6E5C;

  .export-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(227, 181, 103, 0.3);
    object-fit: cover;
  }
`

export const ExportSummary = styled.blockquote`
  margin: 16px 0 0;
  padding: 10px 18px;
  border-left: 3px solid #E3B567;
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 14px;
  color: #8A6E5C;
  line-height: 1.7;
  background: rgba(227, 181, 103, 0.06);
  border-radius: 0 8px 8px 0;
`

export const ExportBodyWrap = styled.div`
  padding: 24px 48px;
`

export const ExportFooter = styled.div`
  padding: 24px 48px 48px;
  border-top: 1px solid #D4C8B8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  .export-qr {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .export-footer-info {
    flex: 1;
    text-align: right;
  }

  .export-url {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 13px;
    color: #8A6E5C;
    word-break: break-all;
  }

  .export-colophon {
    font-family: Georgia, serif;
    font-size: 20px;
    color: #B9A998;
    letter-spacing: 0.12em;
    margin-top: 8px;
  }
`

export const PreviewWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

export const PreviewImageWrap = styled.div`
  max-height: 56vh;
  overflow-y: auto;
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--normal-300);
  background: var(--background-100);

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
  }
`

export const ImageInfo = styled.p`
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: center;
`

export const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid var(--normal-300);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    border-top-color: var(--normal-300);
  }
`

export const ErrorWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`

export const RetryButton = styled(Button)`
  margin-top: 4px;
`

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
`

export const ActionButton = styled(Button)`
  border-radius: 999px;
`
