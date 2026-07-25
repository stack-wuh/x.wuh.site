# Header 外观选择器样式与交互优化

## 背景

当前 Header 的主题入口是一个“调色盘图标 + 当前主题名称 + 下拉提示”的胶囊按钮，但点击后直接在 `wine`（酒红）与 `plain`（素雅）之间循环，并不会展开选择菜单。与此同时，页面的浅色/深色模式只能跟随系统，用户无法手动选择。按钮的视觉语义、下拉暗示与实际行为不一致，也不足以承载站点已有的“主题家族 + 显示模式”双维度主题能力。

本次属于现有 Header 与主题系统的 **chore 优化**：将主题入口升级为与博客编辑气质一致的“编辑部调色台”外观选择器。桌面端使用轻量浮层，移动端使用 Bottom Sheet，让用户分别选择主题风格和显示模式，并即时预览组合效果；不新增业务能力、后端接口或主题家族。

## 目标

- 将桌面 Header 入口设计为稳定宽度的“半明半暗图标 + 外观 + 下拉提示”胶囊按钮，并与 Header 的半透明纸张感、细边框和酒红强调色保持一致。
- 在桌面浮层中提供“酒红 / 素雅”主题色板，以及“跟随系统 / 浅色 / 深色”显示模式选择。
- 在移动菜单中提供“外观设置”入口，并通过 Bottom Sheet 呈现同一套选择能力。
- 选项点击后立即生效，选择器保持打开，允许用户连续调整并预览主题组合。
- 分别持久化主题家族和显示模式；选择“跟随系统”时继续响应系统配色变化。
- 满足键盘操作、焦点管理、屏幕阅读器语义、触摸目标与减少动效要求。

## 非目标（明确不做）

- 不调整 Header 的站点标识、导航信息架构、移动菜单导航项或 768px 响应式断点。
- 不新增 `wine`、`plain` 之外的主题家族，也不重做全站调色板和 CSS 变量架构。
- 不修改通用 Button 的公共 API 或全局默认样式。
- 不新增第三方弹层、动画或状态管理依赖。
- 不将外观设置同步到服务端或用户账户。
- 不在本次变更中扩展对比度、字体、字号等其他个性化设置。

## 影响范围

- `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` — 将主题家族与显示模式作为独立状态暴露，处理持久化和系统模式监听。
- `packages/wuh.site.next/app/layout.tsx` — 首屏同步脚本恢复主题家族和显示模式，避免水合前闪动。
- `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 将一键循环按钮替换为桌面外观浮层入口与移动 Bottom Sheet 入口。
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 增加“编辑部调色台”视觉、浮层、遮罩、Bottom Sheet、响应式和交互状态样式。
- `packages/components/icons/index.tsx` — 仅在现有导出不足时补充同一 Lucide outline 图标集中的外观与关闭图标。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 以失败优先测试覆盖双维度状态、桌面/移动结构、持久化和无障碍契约。
- 影响包：`@wuh.site/next`；如需补充图标导出，则同时影响 `@wuh.site/components/icons`。
