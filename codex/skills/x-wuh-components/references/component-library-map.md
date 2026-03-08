# Component Library Map (x.wuh.site)

## Implemented and actively usable

| Component | Path | Notes |
| --- | --- | --- |
| Alert | `packages/components/alert/index.tsx` | Reusable post metadata panel with `label: value` rows (icon hover spin), supports `updatedBy` + second-level timestamp, path-style source label, license row, clickable labels and optional embedded share actions. |
| Button | `packages/components/button/index.tsx` | Material-like variants (`filled/outlined/text`), link mode via `href`, legacy `type` mapping to color, tokenized sizing/colors. |
| Card | `packages/components/card/index.tsx` | Material-like surface component with `elevation`/`variant` controls and compound slots: `Card.Header`, `Card.Content`, `Card.Actions`. |
| Dialog | `packages/components/dialog/index.tsx` | Controlled modal with ESC/overlay close, body scroll lock, optional fullscreen, footer render function. Works well with `useDialog`. |
| Flex (+ presets) | `packages/components/flex/index.tsx` | Token-aware spacing parser and many preset wrappers (`Row`, `Column`, `Center`, `SpaceBetween`, etc.). |
| Image | `packages/components/image/index.tsx` | Wrapper around `next/image` with skeleton/error fallback/ratio/caption/overlay and appearance modes. |
| ImagePreview | `packages/components/image-preview/index.tsx` | Portal-based preview with keyboard, zoom, rotate, drag/swipe, thumbnail rail, fullscreen, download hooks. |
| LinkGroup | `packages/components/link-group/index.tsx` | Contact/social icon links with preset icon types and hover/focus animations. |
| SharedLinkGroup | `packages/components/shared-link-group/index.tsx` | Share action group for article pages, supports link and callback actions. |
| Tag | `packages/components/tag/index.tsx` | GitHub-like tag chip with hex color normalization and readable foreground auto-selection. |
| Themes | `packages/components/themes/*` | `themeProvider`, `cssVariableProvider`, `registry`, tokens and color generation utilities. |
| Layout footer/main | `packages/components/layout/*` | Project-specific layout/footer helpers (used in Next app layout). |

## Placeholder or empty implementations (implement before use)

- `packages/components/audio-player/index.tsx`
- `packages/components/col/index.tsx`
- `packages/components/config-provider/index.tsx`
- `packages/components/divider/index.tsx`
- `packages/components/empty/index.tsx`
- `packages/components/float-button/index.tsx`
- `packages/components/message/index.tsx`
- `packages/components/modal/index.tsx`
- `packages/components/row/index.tsx`
- `packages/components/space/index.tsx`
- `packages/components/spin/index.tsx`
- `packages/components/video-player/index.tsx`
- `packages/components/result/404.tsx`
- `packages/components/result/500.tsx`

## Theme integration baseline

Use this setup pattern in app roots (already used in `packages/wuh.site.next/app/layout.tsx`):

```tsx
<ThemeProvider>
  <StyledComponentsRegistry>
    <html>
      <CssVariableStyles />
      <body>{children}</body>
    </html>
  </StyledComponentsRegistry>
</ThemeProvider>
```

## Usage references

- Button API: `packages/components/button/readme.md`
- Card API: `packages/components/card/readme.md`
- Dialog API: `packages/components/dialog/README.md`
- Image API: `packages/components/image/readme.md`
- ImagePreview API: `packages/components/image-preview/README.md`
- LinkGroup API: `packages/components/link-group/readme.md`
- SharedLinkGroup API: `packages/components/shared-link-group/readme.md`
- Alert API: `packages/components/alert/readme.md`
- Tag API: `packages/components/tag/README.md`
- Theme notes: `packages/components/themes/README.md`
