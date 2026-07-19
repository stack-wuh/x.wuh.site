---
artifact: proposal
contractVersion: 1
requiredHeadings:
  - 背景
  - 目标
  - 非目标（明确不做）
  - 影响范围
requiredPatterns:
  - '^# .+'
---

# 首页主题切换按钮现代化重设计

## 背景

首页头部的主题切换入口在页面按钮统一替换为 `@wuh.site/components/button` 后出现样式回归：通用按钮的默认变体、尺寸和内边距与头部局部样式叠加，桌面端视觉不协调；移动端主题入口缺少稳定、明确的图标展示，窄屏下图标存在被压缩或不可见的问题。

## 目标

- 将首页主题切换入口重设计为现代网站常见的轻量胶囊式控件。
- 桌面端显示主题图标、当前主题名称和可切换提示。
- 移动端在展开菜单内显示带主题图标的整行操作项，并保证触摸目标和图标可见。
- 保持 `wine` / `plain` 主题家族的现有循环切换、localStorage 持久化和系统明暗色逻辑。
- 保持键盘操作、可见焦点和屏幕阅读器语义。

## 非目标（明确不做）

- 不修改通用 `@wuh.site/components/button` 的公共 API 或全局默认样式。
- 不新增主题家族，不改变 `ThemeModeProvider` 的状态模型和存储键。
- 不重做首页头部的其他导航项和移动菜单布局。
- 不新增第三方图标库或接口。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 主题控件的语义结构、图标和可访问性属性。
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 桌面胶囊与移动整行控件的响应式样式。
- `packages/components/icons/index.tsx` — 复用并导出主题所需的 outline 图标别名（如缺失）。
- `packages/wuh.site.next/test/` — 新增主题切换控件的回归测试。
- 影响包：`@wuh.site/next`、`@wuh.site/components/icons`。
