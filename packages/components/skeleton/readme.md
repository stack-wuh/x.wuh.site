# Skeleton

Lightweight skeleton loader for page transitions or content placeholders.

## Usage

```tsx
import Skeleton from '@wuh.site/components/skeleton'

<Skeleton width='60%' height={20} />
<Skeleton variant='rect' height={180} />
<Skeleton variant='circle' width={40} height={40} />
```

## Props

- `variant`: `text` | `rect` | `circle`
- `width`: number | string
- `height`: number | string
- `radius`: number | string
- `shimmer`: boolean (default true)

The component respects `prefers-reduced-motion` and will disable the shimmer animation.
