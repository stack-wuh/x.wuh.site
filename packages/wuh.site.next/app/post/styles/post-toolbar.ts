import styled from '@wuh.site/components/styled'

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
    &::before { left: 0; }
  }

  .toolbar-link.next {
    width: 56%;
    align-self: flex-end;
    justify-content: flex-end;
    &::before { right: 0; }
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

  .toolbar-link.next .toolbar-icon { order: 2; }
  .toolbar-link.next .toolbar-label { order: 1; text-align: right; }

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
  .toolbar-position { pointer-events: none; }

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

  .toolbar-flow-line::before { margin-bottom: auto; }

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

  .toolbar-link[aria-disabled='true'] {
    color: var(--text-primary);
    opacity: 0.45;
    background: color-mix(in oklab, var(--background-200) 76%, var(--normal-200) 24%);
    border-color: color-mix(in srgb, var(--normal-300) 50%, transparent);
    box-shadow: none;
    cursor: not-allowed;
    &::before { background: var(--normal-400); }
  }

  .toolbar-link[aria-disabled='true'] * { cursor: not-allowed; }

  a.toolbar-link:hover {
    border-color: color-mix(in oklab, var(--primary-color) 40%, transparent);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    &::before { height: 28px; }
  }

  a.toolbar-link.prev:hover .toolbar-icon svg { transform: translateX(-3px); }
  a.toolbar-link.next:hover .toolbar-icon svg { transform: translateX(3px); }
  a.toolbar-link.prev:hover .toolbar-icon { background: color-mix(in oklab, var(--primary-color) 18%, transparent); }
  a.toolbar-link.next:hover .toolbar-icon { background: color-mix(in oklab, var(--primary-color) 18%, transparent); }

  a.toolbar-link:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 24%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .toolbar-link,
    .toolbar-link::before,
    .toolbar-icon,
    .toolbar-icon svg { transition: none; }
    a.toolbar-link:hover { transform: none; }
  }

  @media (max-width: 640px) {
    gap: 20px;
    .toolbar-link.next { width: 100%; align-self: stretch; }
    .toolbar-flow-line { height: 10px; }
    .toolbar-back { display: none; }
    .toolbar-position { font-size: 0.68rem; }
    a.toolbar-link:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }
  }

  @media (prefers-color-scheme: dark) {
    .toolbar-link { border-color: color-mix(in oklab, var(--normal-700) 40%, transparent); }
    .toolbar-icon { background: color-mix(in oklab, var(--normal-700) 30%, transparent); }
    .toolbar-flow-line::before,
    .toolbar-flow-line::after { background: var(--normal-600); }
    a.toolbar-link:hover {
      border-color: color-mix(in oklab, var(--primary-color) 50%, transparent);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
    }
    a.toolbar-link:hover .toolbar-icon { background: color-mix(in oklab, var(--primary-color) 22%, transparent); }
  }
`
