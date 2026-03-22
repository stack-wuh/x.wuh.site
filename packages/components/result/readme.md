# Result

Error guidance component for 404/500 pages with GitHub-like styling.

## Usage

```tsx
import Result from '@wuh.site/components/result'

<Result
  status='404'
  title='页面不存在'
  description='你访问的页面可能已被移动或删除。'
  links={[{ label: 'GitHub', href: 'https://github.com/stack-wuh/x.wuh.site' }]}
/>
```

## Props

- `status`: `404` | `500` | `info` | `error`
- `title`: ReactNode
- `description`: ReactNode
- `icon`: ReactNode
- `links`: { label, href?, target?, rel? }[]
- `extra`: ReactNode (custom actions)

Default content is provided for `404` and `500`.
