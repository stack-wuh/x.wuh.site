# 任务清单

## Phase 1: 字体加载层迁移

### Task 1: 更新根布局字体注入

- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 将 `Inter` 替换为 `Noto_Sans_SC`，`weight: ['400', '500', '600', '700']`，`subsets: ['latin']`，`variable: '--font-sans'`，`display: 'swap'`
- [x] 将 `Noto_Serif_SC` 的 `weight` 从 `['400', '700']` 扩展为 `['400', '500', '600', '700']`
- [x] 引入 `JetBrains_Mono`，`subsets: ['latin']`，`variable: '--font-mono'`，`display: 'swap'`
- [x] `<body>` className 包含全部三个字体变量
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** diff 已确认；Network 面板和 `document.fonts.check()` 需在浏览器手动验收

### Task 2: 移除 post layout 的字体注入

- [x] **文件:** `packages/wuh.site.next/app/post/layout.tsx`
- [x] 删除 `JetBrains_Mono` 导入与注入（已由 root layout 提供）
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** diff 已确认

## Phase 2: 主题变量层更新

### Task 3: 更新 CSS 变量 fallback 并禁止字体合成

- [x] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [x] 将 `--font-sans` fallback 更新为 `'Noto Sans SC', ui-sans-serif, system-ui, sans-serif`
- [x] 将 `--font-serif` fallback 更新为 `Georgia, serif`
- [x] 将 `--font-mono` fallback 更新为 `'JetBrains Mono', ui-monospace, 'Courier New', monospace`
- [x] 在 `body` 全局样式中添加 `font-synthesis: none`
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** diff 已确认；`getComputedStyle(document.body).fontSynthesis` 需在浏览器手动验收

## Phase 3: 硬编码字体引用清理

### Task 4: 清理 post-markdown 硬编码字体栈

- [x] **文件:** `packages/wuh.site.next/app/post/styles/post-markdown.ts`
- [x] `code` 选择器（行 81）改为 `var(--font-mono)`
- [x] `kbd` 选择器（行 233）改为 `var(--font-mono)`
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 2 分钟
- [x] **验证:** diff 已确认

### Task 5: 排查其余绕过 token 的硬编码声明

- [x] **文件:** 全站（重点检查 `packages/components/`、`packages/wuh.site.next/`）
- [x] Grep 搜索 Georgia、system-ui、Menlo、Consolas、SFMono、BlinkMacSystemFont、Segoe UI
- [x] `components/image-preview/styles/index.tsx:253` — `var(--font-mono, 'SFMono-Regular', monospace)` 简化为 `var(--font-mono)`
- [x] `share-utils.ts:63` — 微信扫码分享内联 HTML 模板，CSS 变量不可用，**保留系统字体栈**
- [x] `wuh.site.console/src/styles/global.css` — Console 在提案非目标范围内，**跳过**
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 10 分钟
- [x] **验证:** diff 已确认；无剩余不必要的硬编码系统字体声明

## Phase 4: 验证与性能基线

### Task 6: 跨平台验证与首屏字体性能基线

- [ ] 固定视口、DPR、浏览器版本（macOS Chrome/Safari、Windows Chrome/Edge）
- [ ] 验证 `document.fonts.check()` 在各目标浏览器和字重下返回 true
- [ ] 对标题、正文、按钮、中英混排、代码块记录换行行数和元素宽高，确认两个平台结果一致
- [ ] 测量首页、博客列表、文章详情三个页面的实际字体请求数和传输量
- [ ] 测量 CLS；若超出可接受范围则评估 metric overrides
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 同一文本在两个平台使用相同字体文件和真实字重；关键元素尺寸和换行一致；无超出预期的 CLS

## 验收

- [ ] 主站中文、英文、数字、标点全部由 Noto Sans SC / Noto Serif SC / JetBrains Mono 渲染，无回退到系统字体（PingFang、微软雅黑、Georgia、Menlo、Consolas）
- [ ] 400/500/600/700 字重均由真实字体文件提供，font-synthesis: none 生效
- [ ] 字体变量作为唯一入口；全站无绕过 token 的硬编码系统字体声明
- [ ] macOS 与 Windows 关键元素换行一致、宽高误差在允许阈值内
- [ ] 首屏字体体积和请求数在各页面实测合理范围内，重复访问命中长期缓存
- [ ] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误
