import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import styled from '@wuh.site/components/styled'

/* shadcn ScrollArea 移植：10px 可点区域 + 透明 border + 1px padding，thumb 圆角胶囊。
   主题色联动：thumb 跟随 primary-color，hover 加深；data-state 控制 hover 浮现。 */

export const ScrollAreaRoot = styled(ScrollAreaPrimitive.Root)`
  position: relative;
  overflow: hidden;
`

export const ScrollAreaViewport = styled(ScrollAreaPrimitive.Viewport)`
  height: 100%;
  width: 100%;
  border-radius: inherit;
`

export const ScrollAreaScrollbar = styled(ScrollAreaPrimitive.ScrollAreaScrollbar)`
  display: flex;
  touch-action: none;
  user-select: none;
  padding: 1px;
  opacity: 0;
  transition: opacity 180ms ease, background-color 180ms ease;

  &[data-state='visible'] {
    opacity: 1;
  }

  &[data-orientation='vertical'] {
    height: 100%;
    width: 10px;
    border-left: 1px solid transparent;
  }

  &[data-orientation='horizontal'] {
    width: 100%;
    height: 10px;
    flex-direction: column;
    border-top: 1px solid transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const ScrollAreaThumb = styled(ScrollAreaPrimitive.ScrollAreaThumb)`
  position: relative;
  flex: 1;
  border-radius: 99px;
  background: color-mix(in oklab, var(--primary-color) 38%, transparent);
  transition: background-color 180ms ease;

  &:hover {
    background: color-mix(in oklab, var(--primary-color) 58%, transparent);
  }

  [data-color-scheme='dark'] & {
    background: color-mix(in oklab, var(--primary-color) 42%, transparent);

    &:hover {
      background: color-mix(in oklab, var(--primary-color) 62%, transparent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
