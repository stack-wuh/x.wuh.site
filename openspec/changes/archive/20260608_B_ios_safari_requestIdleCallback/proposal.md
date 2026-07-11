# iOS Safari 兼容性修复 — requestIdleCallback

## 问题

iOS Safari 浏览器访问网站时报错 "Application error: a client-side exception has occurred"，页面完全不可用。

## 根因

`GlobalAudioPlayer` 组件的 `useEffect` 中调用了 `requestIdleCallback`，该 API 仅在 Chromium 系浏览器中可用，Safari（桌面 + iOS）均不支持。

错误发生在 `layout.tsx` 中的动态组件，页面的 `error.tsx` 无法捕获，触发 Next.js 全局 error overlay。

## 修复

添加运行时检测，`requestIdleCallback` 不可用时退化为 `setTimeout`/`clearTimeout`。

## 影响

- Chromium 浏览器行为不变
- Safari/iOS Safari 上歌单延迟加载正常工作（退化为固定延迟）
