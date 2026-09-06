import styled, { css } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-xl);
  order: 1;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    order: 2;
  }
`

/** 注记式页头：辅助信息双列单行——meta 行靠左、书签标签靠右，520 以下折为上下 */
export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: 14px;
  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
  animation-delay: 80ms;

  @media (max-width: ${BREAKPOINTS.small}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`

export const MetaLine = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 76%, transparent);

  .author {
    color: var(--text-primary);
    font-weight: 500;
  }

  .dot {
    margin: 0 8px;
    color: var(--normal-400);
  }
`

export const Title = styled.h1`
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: clamp(28px, 5.4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.35;
  margin: 0 0 18px;
  animation: write-fade var(--motion-dur-write) var(--motion-ease-out-soft) both;
`

/** 头部收束符：朱砂短规 + 发丝线延伸，与正文章节 stub 同语言 */
export const HeadRule = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: 18px;

  &::before {
    content: '';
    width: 44px;
    height: 2px;
    background: var(--primary-color);
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${hairline};
  }
`

/** 朱砂藏印标签：双框印边 + 印文疏排（角度由 --tilt 传入），hover 时印章"落正" */
export const TagGroup = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 2px;

  a {
    display: inline-flex;
    align-items: center;
    padding: 5px calc(10px - 0.14em) 5px 10px;
    font-size: var(--font-size-xs);
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.14em;
    color: color-mix(in oklab, var(--primary-color) 84%, var(--text-primary));
    text-decoration: none;
    border: 1px solid color-mix(in oklab, var(--primary-color) 48%, transparent);
    border-radius: 3px;
    background: color-mix(in oklab, var(--primary-color) 5%, transparent);
    box-shadow:
      inset 0 0 0 1px var(--background-100),
      inset 0 0 0 2px color-mix(in oklab, var(--primary-color) 20%, transparent);
    transform: rotate(var(--tilt, 0deg));
    transition:
      transform var(--motion-dur-quick) var(--motion-ease-out-soft),
      color var(--motion-dur-quick) var(--motion-ease-out-soft),
      border-color var(--motion-dur-quick) var(--motion-ease-out-soft),
      background-color var(--motion-dur-quick) var(--motion-ease-out-soft),
      box-shadow var(--motion-dur-quick) var(--motion-ease-out-soft);
  }

  a:hover,
  a:focus-visible {
    transform: rotate(0deg);
    color: var(--primary-color);
    border-color: color-mix(in oklab, var(--primary-color) 70%, transparent);
    background: color-mix(in oklab, var(--primary-color) 9%, transparent);
    box-shadow:
      inset 0 0 0 1px var(--background-100),
      inset 0 0 0 2px color-mix(in oklab, var(--primary-color) 32%, transparent);
  }

  a:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    a {
      transition: none;
    }

    a:hover,
    a:focus-visible {
      transform: rotate(var(--tilt, 0deg));
    }
  }
`

/** 封面公共外壳：尺寸、圆角、边框、动效、移动端出血 */
const coverShell = css`
  --post-cover-radius: 12px;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 360px;
  border-radius: var(--post-cover-radius);
  overflow: hidden;
  margin-bottom: var(--space-lg);
  order: 2;
  border: 1px solid color-mix(in oklab, var(--accent-color) 16%, transparent);
  background: color-mix(in oklab, var(--background-200) 88%, var(--accent-color) 12%);
  animation: coverEnter 280ms var(--motion-ease-out-soft) both;

  @keyframes coverEnter {
    from { opacity: 0; transform: scale(1.02); }
    to { opacity: 1; transform: scale(1); }
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    --post-cover-radius: 0;
    width: calc(100% + 48px);
    height: clamp(220px, 60vw, 300px);
    aspect-ratio: auto;
    max-height: none;
    margin: 0 -24px var(--space-lg);
    border-radius: var(--post-cover-radius);
    border-left: none;
    border-right: none;
    order: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const CoverFrame = styled.div`
  ${coverShell}

  > * { height: 100%; }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

/** 底部轻渐变过渡：只柔和压暗信息条附近的图，不改变图片主体观感 */
export const CoverGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in oklab, #000 40%, transparent) 0%,
    transparent 40%
  );
  pointer-events: none;
`

/** 无封面时的生成式封面：主题渐变 + 装饰线 + 衬线标题 + 落款 */
export const GeneratedCover = styled.div`
  ${coverShell}
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: clamp(20px, 5vw, 40px);
  background:
    radial-gradient(110% 90% at 88% -10%, color-mix(in oklab, var(--accent-color) 16%, transparent), transparent 55%),
    radial-gradient(90% 80% at 8% 110%, color-mix(in oklab, var(--accent-color) 12%, transparent), transparent 55%),
    linear-gradient(165deg, var(--background-100) 0%, var(--background-200) 100%);
`

export const GeneratedOrnament = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding-top: clamp(12px, 3vw, 24px);
  color: var(--accent-color);
  opacity: 0.55;

  svg {
    width: min(240px, 60%);
    height: auto;
  }
`

export const GeneratedTitle = styled.h1`
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(var(--font-size-xl), 4vw, var(--font-size-3xl));
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const GeneratedSummary = styled.p`
  margin: 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const GeneratedAuthorRow = styled.div`
  margin-top: var(--space-xs);
  padding-top: var(--space-sm);
  border-top: 1px solid color-mix(in oklab, var(--accent-color) 14%, transparent);
`

export const GeneratedAuthorInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`

export const GeneratedColophon = styled.div`
  font-size: var(--font-size-xs);
  letter-spacing: 0.12em;
  color: var(--text-muted);
`

export const Summary = styled.blockquote`
  margin: 0 0 18px;
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--accent-color);
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
  background: color-mix(in oklab, var(--accent-color) 6%, transparent);
  border-radius: 0 8px 8px 0;
`

export const PostLead = styled.div`
  display: flex;
  flex-direction: column;
`
