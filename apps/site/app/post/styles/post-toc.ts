import styled from '@wuh.site/components/styled'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const TocAside = styled.aside`
  display: none;

  @media (min-width: ${BREAKPOINTS.tablet}px) {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 88px;
    align-self: start;
    max-height: calc(100vh - 112px);
  }
`

/**
 * 目录纸卷：侧栏唯一的内部滚动区（不出滚动条）。
 * - 滚动条全平台隐藏；overscroll-behavior 防止滚到边时连带页面滚动
 * - padding-block 与渐隐遮罩等宽（20px）：静止时条目永不落入渐隐区，
 *   只有滚动过程中条目才从纸卷边缘「收进去」，是纸卷收边而非窗口感
 * - active 条目由 useHeadingObserver（IntersectionObserver）驱动、PostView
 *   命令式居中跟随，遵守「详情页禁止 scroll/resize 监听」Knowledge
 */
export const TocScroller = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px 2px;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%);

  &::-webkit-scrollbar {
    display: none;
  }
`

export const TocTitle = styled.div`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-weight: 500;
  letter-spacing: 0.32em;
  color: var(--text-secondary);
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${hairline};
`

export const TocList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0;
  margin: 0;
`

export const TocNum = styled.span`
  margin-right: 8px;
  font-family: var(--font-serif);
  font-weight: 600;
  color: var(--primary-color);
`

/** 侧栏工具列：目录下方的返回首页/回到顶部/点赞（仅桌面端随侧栏出现） */
export const TocTools = styled.div`
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid ${hairline};
`

/** 侧栏前后篇迷你导航：阅读中随时跳转，不必滚到文末（「天才向左 / 疯子向右」为站点个性文案） */
export const TocPrevNext = styled.nav`
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid ${hairline};
  display: grid;
  gap: var(--space-xs);

  .toc-pn-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    letter-spacing: 0.12em;
  }

  .toc-pn-arrow {
    color: var(--primary-color);
    transition: transform var(--motion-dur-quick) var(--motion-ease-out-soft);
  }

  .toc-pn-title {
    display: -webkit-box;
    overflow: hidden;
    font-family: var(--font-serif);
    font-size: var(--font-size-sm);
    font-weight: 500;
    line-height: 1.6;
    color: var(--text-secondary);
    transition: color var(--motion-dur-quick) var(--motion-ease-out-soft);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  a {
    display: grid;
    gap: 3px;
    min-height: 40px;
    text-decoration: none;

    &:hover .toc-pn-title {
      color: var(--primary-color);
    }

    &[data-dir='prev']:hover .toc-pn-arrow {
      transform: translateX(-2px);
    }

    &[data-dir='next']:hover .toc-pn-arrow {
      transform: translateX(2px);
    }

    &:focus-visible {
      outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
      outline-offset: 2px;
    }
  }

  .toc-pn-empty {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    opacity: 0.6;
  }
`

/** 侧栏篇信息小注：篇号进度 / 发布 / 更新 / 阅读时长 */
export const TocInfo = styled.div`
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid ${hairline};
  display: grid;
  gap: 4px;
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  font-variant-numeric: tabular-nums;
`

export const TocItemLink = styled.a<{ $active?: boolean; $depth?: number }>`
  position: relative;
  display: block;
  text-decoration: none;
  font-size: var(--font-size-xs);
  line-height: 1.6;
  padding: 5px 4px 5px 14px;
  margin-left: ${({ $depth }) => `${Math.max(0, ($depth ?? 2) - 2) * 12}px`};
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-secondary)')};
  transition: color 180ms ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    border-radius: 999px;
    background: linear-gradient(180deg, var(--primary-color), var(--accent-color));
    transition: height 200ms ease;
  }

  ${({ $active }) => ($active ? '&::before { height: 14px; }' : '')}

  &:hover {
    color: var(--text-primary);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }
  }
`

/** 移动端目录折叠条：纸面折叠条语言——标题行 +「共 N 节」计数 +「读至 · 第N节」小注 + 圆形箭头钮（对齐 cbtn 圆钮视觉） */
export const TocMobile = styled.details`
  margin: 0 0 var(--space-md);
  border-top: 1px solid ${hairline};

  @media (min-width: ${BREAKPOINTS.tablet}px) {
    display: none;
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 10px 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  .toc-m-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .toc-m-title {
    font-family: var(--font-serif);
    font-size: var(--font-size-sm);
    font-weight: 500;
    letter-spacing: 0.32em;
    color: var(--text-secondary);
  }

  .toc-m-count {
    margin-left: 8px;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  .toc-m-now {
    font-size: var(--font-size-xs);
    color: var(--primary-color);
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .toc-m-now-num {
    margin: 0 4px 0 6px;
    font-family: var(--font-serif);
    font-weight: 600;
  }

  .toc-m-toggle {
    flex: none;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--background-200);
    border: 1px solid var(--normal-300);
    color: var(--text-secondary);
    transition: transform var(--motion-dur-quick) var(--motion-ease-out-soft);
  }

  &[open] .toc-m-toggle {
    transform: rotate(180deg);
  }

  .toc-body {
    padding: 4px 2px 14px;
  }

  @media (prefers-reduced-motion: reduce) {
    .toc-m-toggle {
      transition: none;
    }
  }
`
