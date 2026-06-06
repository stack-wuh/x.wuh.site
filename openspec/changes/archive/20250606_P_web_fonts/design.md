# 设计文档

## 目标

解决 Mac/Windows 跨系统字体渲染不一致问题，中英文全换 web font。

## 字体选择

| 字体 | 用途 | 方式 | 时机 |
|---|---|---|---|
| Inter (variable) | 全局 UI/正文 sans-serif | `next/font/google` 自托管 | 构建时内联，首屏可用 |
| Noto Serif SC | 博客正文/标题 serif | JS 动态注入 Google Fonts CSS | `window.load` 后才加载 |
| JetBrains Mono | 代码块 | `next/font/google` 自托管 | 构建时内联，首屏可用 |

## CSS 变量

```css
--font-sans:   <Inter-variable>, ui-sans-serif, system-ui, -apple-system, ...;
--font-mono:   <JetBrainsMono-variable>, ui-monospace, SFMono-Regular, ...;
--font-serif:  'Noto Serif SC', Georgia, 'Songti SC', 'STSong', serif;
```

Noto Serif SC 加载前回退到 Georgia/Songti SC，加载后浏览器自动切换。

## 加载策略

- Inter + JetBrains Mono：`next/font/google` 构建时下载，CSS 内联到首屏 HTML，零额外请求，立即可用
- Noto Serif SC：通过 `<script>` 在 `window.load` 事件后动态创建 `<link>` 加载 Google Fonts CDN

## 改动文件

- `app/layout.tsx` — `next/font/google` 加载 Inter + JetBrains Mono，挂载 CSS 变量，注入延迟加载脚本
- `packages/components/themes/cssVariableProvider.tsx` — 更新三个字体 CSS 变量
- 全站替换 `var(--font-geist-sans)` → `var(--font-sans)`
