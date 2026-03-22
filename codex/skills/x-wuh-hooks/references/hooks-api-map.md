# Hooks API Map (x.wuh.site)

## Current status

| Hook | Path | Status |
| --- | --- | --- |
| useDialog | `packages/hooks/useDialog/index.ts` | Implemented |
| useImagePreview | `packages/hooks/useImagePreview/index.ts` | Implemented |
| useFetch | `packages/hooks/useFetch/index.ts` | Implemented |
| useTokens | `packages/hooks/useTokens/index.ts` | Implemented |
| useTheme (dedicated folder) | `packages/hooks/useTheme/index.ts` | Empty placeholder |

## useDialog

```ts
const dialog = useDialog({
  defaultOpen?: boolean,
  onOpenChange?: (open: boolean) => void,
})
```

Returns:

- `open`
- `openDialog()`
- `closeDialog()`
- `toggleDialog()`
- `setOpen(value | updater)`
- `bind: { open, onClose }`

Use with Dialog:

```tsx
const dialog = useDialog()
<Dialog {...dialog.bind} title="Confirm" />
```

## useImagePreview

```ts
const preview = useImagePreview({
  defaultOpen?: boolean,
  defaultIndex?: number,
  loop?: boolean,
  itemCount?: number,
  onOpenChange?: (open: boolean) => void,
  onIndexChange?: (index: number) => void,
})
```

Returns:

- `open`
- `index`
- `openPreview(index?)`
- `closePreview()`
- `togglePreview()`
- `next(total?)`
- `previous(total?)`
- `setIndex(value | updater)`
- `bind: { open, currentIndex, onClose, onIndexChange }`

Key behavior:

- Index is clamped when `itemCount` is provided.
- `next/previous` respects `loop` when `total` or `itemCount` is valid.

Use with ImagePreview:

```tsx
const preview = useImagePreview({ itemCount: items.length, loop: true })
<ImagePreview items={items} {...preview.bind} />
```

## useTokens

```ts
const primary500 = useTokens('primary', '500')
```

Details:

- Source: `packages/hooks/useTokens/index.ts`
- Depends on styled-components `useTheme`.
- Throws if called outside `ThemeProvider`.
- Exposes `useTheme(): Tokens` and `useTokens(tokenType, token)`.

## useFetch

```ts
const state = useFetch<DataType>('/api/items', requestOptions, {
  manual?: boolean,
  deps?: [],
})
```

Returns:

- `data`
- `error`
- `loading`
- `status`
- `ok`
- `run(override?)`
- `reload()`
- `cancel()`
- `setData()`

Server Components should use `fetcher` from `@wuh.site/hooks/useFetch/fetcher`.

## Import conventions

In `packages/wuh.site.next`, prefer tsconfig aliases:

- `@wuh.site/hooks/useDialog`
- `@wuh.site/hooks/useImagePreview`
- `@wuh.site/hooks/useFetch`
- `@wuh.site/hooks/useTokens`

Legacy direct path imports may still exist in docs (for example `@/packages/hooks/...`); keep consistency within edited file.
