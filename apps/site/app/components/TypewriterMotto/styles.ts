import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.8;
  color: var(--text-secondary);
  text-align: center;
  padding: var(--space-md) 0;
  margin: 0 auto;
  min-height: calc(var(--font-size-lg) * 1.8 + var(--space-md) * 2);

  @media (max-width: 520px) {
    max-width: 320px;
  }

  &::after {
    content: '';
    display: block;
    width: 28px;
    height: 2px;
    margin: var(--space-md) auto 0;
    background: var(--accent-color);
    opacity: 0.5;
  }
`

/*
 * 布局稳定的核心：隐藏的「最长句」占位字在流内决定容器高度——
 * 与当前打字进度无关（防换行跳动），并随断点/主题字号自动重排（无魔法行数）。
 * 见 20260915-fix-motto-wrap-jitter/brief.md。
 */
export const Sizer = styled.span`
  display: block;
  visibility: hidden;
  user-select: none;
`

/* 真实文字/光标的覆盖层：绝对定位、垂直居中，inset 与容器纵向 padding 同令牌 */
export const Content = styled.span`
  position: absolute;
  inset: var(--space-md) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

/* 文字与光标必须是同一个文本流（否则 flex 会在两项之间折断换行），包一层行内元素 */
export const Line = styled.span`
  display: inline;
  max-width: 100%;
`

export const TextWrap = styled.span`
  display: inline;
`

export const Cursor = styled.span<{ $blink: boolean }>`
  display: inline;
  border-left: 2px solid var(--primary-color);
  margin-left: 2px;
  animation: ${(p) => (p.$blink ? 'tk-blink 1s step-end infinite' : 'none')};

  @keyframes tk-blink {
    0%,
    100% {
      border-color: var(--primary-color);
    }
    50% {
      border-color: transparent;
    }
  }
`

export const Glow = styled.span`
  position: absolute;
  top: 50%;
  width: 28px;
  height: 1.1em;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, var(--primary-color) 0%, transparent 70%);
  filter: blur(7px);
  opacity: 0.3;
  pointer-events: none;
  transition: left 120ms ease;
`

export const ParticleDot = styled.span`
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--primary-color);
  pointer-events: none;
  animation: tk-particle-out 600ms ease-out forwards;

  @keyframes tk-particle-out {
    0% {
      opacity: 0.7;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(
        calc(cos(var(--a)) * var(--d)),
        calc(sin(var(--a)) * var(--d))
      ) scale(0.2);
    }
  }
`
