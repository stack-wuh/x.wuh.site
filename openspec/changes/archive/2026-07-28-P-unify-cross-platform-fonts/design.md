# 设计文档

## 架构

字体统一的核心改动集中在字体加载层和主题变量层，组件层无需感知字体来源变化。

```
Root Layout（next/font 注入三个字体变量）
  ├── Noto Sans SC  → CSS var: --font-sans
  ├── Noto Serif SC → CSS var: --font-serif
  └── JetBrains Mono → CSS var: --font-mono
         ↓
CssVariableStyles（:root fallback 栈 + font-synthesis: none）
         ↓
全站组件只消费 var(--font-sans|serif|mono)
```

字体文件由 `next/font/google` 在构建期下载并同源托管，不依赖 Google Fonts CDN。浏览器通过 `unicode-range` 分片按需请求，只下载页面实际命中的字符区段。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 无衬线字体 | Noto Sans SC | 中英文同一字体文件，字形统一，避免 Inter + 系统中文混排；OFL 开源授权，适合自托管 |
| 衬线字体 | Noto Serif SC（保留现有） | 与 Noto Sans SC 同一设计体系，视觉协调，只需补充 500/600 字重 |
| 等宽字体 | JetBrains Mono（保留现有） | 已自托管，提升到根布局统一注入即可 |
| 字重 | 400/500/600/700 | 覆盖现有样式实际使用的所有字重，避免 synthetic bold |
| 加载方式 | next/font + unicode-range 分片 | 构建期缓存、同源、长期不可变、按需分片；无 Google CDN 依赖 |
| display | swap | 首屏速度优先；配合 metric overrides 降低 CLS |
| 字体合成 | font-synthesis: none | 明确禁止 synthetic bold/italic，使缺失字重在开发期暴露 |
| 字体 token | var(--font-sans|serif|mono) | 全站单一入口，组件不感知底层字体，便于后续迁移 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### Root Layout 字体注入

替换 `Inter` 为 `Noto_Sans_SC`，覆盖 `weight: ['400', '500', '600', '700']`，`subsets: ['latin']`，`variable: '--font-sans'`，`display: 'swap'`。

将 `Noto_Serif_SC` 的 `weight` 从 `['400', '700']` 扩展为 `['400', '500', '600', '700']`。

将 `JetBrains_Mono` 从 post/layout.tsx 移入 root layout.tsx，注入到 `<body>` className。

### CssVariableStyles 变量层

`--font-sans` fallback 精简为 `'Noto Sans SC', ui-sans-serif, system-ui, sans-serif`，其余平台特定字体（PingFang、Microsoft YaHei 等）从 fallback 移除，避免系统字体在 Web Font 未加载时造成可见差异。

`--font-serif` fallback 保留 `Georgia, serif`（仅 Latin 兜底）。

`--font-mono` fallback 保留 `ui-monospace, 'Courier New', monospace`。

在 `body` 全局样式中增加 `font-synthesis: none`，禁止浏览器合成粗体和斜体。

### 硬编码字体引用清理

全站组件中的 `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`（post-markdown.ts:79、post-markdown.ts:232）改为 `var(--font-mono)`。

排查其他绕过 token 的硬编码字体声明，统一改为三个语义 token。

## 响应式策略（如涉及）

字体加载与分片策略在桌面和移动端相同，由浏览器根据 unicode-range 自动分片请求。

## 影响分析

- **新增依赖:** `next/font/google` 下载 Noto Sans SC 400/500/600/700；Noto Serif SC 新增 500/600 字重；JetBrains Mono 已存在。
- **破坏性变更:** Noto Sans SC Latin 字形与 Inter 不同，标题和导航文本宽度可能微调；需截图回归。Noto Serif SC 新增字重后，原先依赖 synthetic bold 渲染的 500/600 样式视觉会有轻微变化。
- **向后兼容:** 字体 token 名称不变（--font-sans / --font-serif / --font-mono），组件无需改变 CSS 变量引用。字体失败时 fallback 仍保证页面可读。
- **性能影响:** 首屏字体分片请求数增加，但每次只下载命中字符的分片；重复访问命中长期缓存。构建产物字体文件增加（新增 Noto Sans SC 四档字重）。实际首屏传输量需构建后在 Network 面板逐页测量，不能仅依赖字体原始文件大小估算。
