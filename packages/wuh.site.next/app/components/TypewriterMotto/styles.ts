import styled from '@wuh.site/components/styled'

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
