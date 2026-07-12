# 组件标准化

## 背景

当前业务代码中的按钮大量使用 `styled.button` 自定义样式，与 `@wuh.site/components/button` 组件存在风格不一致、维护成本高的问题。同时需要确认业务代码中的图标已全部切换到 `@wuh.site/components/icons` 组件库。

## 目标

- 将业务代码中的 `styled.button` 替换为 `@wuh.site/components/button` 组件
- 将业务代码中的原生 `<img>` 替换为 `@wuh.site/components/image` 组件
- 确认并通过代码审查保证所有业务代码已使用 `@wuh.site/components/icons` 图标组件
- 按钮组件统一使用瞬态 props 和共享样式 Token

## 非目标（明确不做）

- 不修改 `packages/components/` 内部的组件实现（属于共享库本身）
- 不涉及按钮的视觉重设计，仅替换技术实现
- 不调整后端代码
- `share-utils.ts` 中的 `<img>` 属于 HTML 模板字面量，非 React 渲染树，不替换

## 影响范围

- `packages/wuh.site.next/app/post/styles/post-floating.ts` — 替换 FloatingButton、LikeButton
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 替换 MobileToggle、ThemeToggle、MobileActionButton
- `packages/wuh.site.next/app/components/ContactCard.tsx` — 替换 ActionArea
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 替换 GuestbookTrigger、ComposerSend、ComposerBadge
- `packages/wuh.site.next/app/about/styles.ts` — 替换 GuestbookSubmit
- `packages/wuh.site.next/app/design/system-color/page.tsx` — 替换 ThemeChip
- `packages/wuh.site.next/app/about/AboutView.tsx` — 替换 GitHub 头像的 `<img>`
- `packages/wuh.site.next/app/post/components/PostCover.tsx` — 替换博文封面的 `<img>`
