---
title: Desktop 应用架构
domain: desktop
keywords: [Electron, 桌面端, 子模块, 设计同源, token 快照, lucide, IPC, safeStorage, revert]
scope:
  - apps/desktop
status: active
source:
  - changes/20260913-feature-desktop-markdown-editor/brief.md
  - changes/20260914-style-desktop-ui-redesign/brief.md
verified: 2026-09-15
---

# Desktop 应用架构

## 当前结论

`apps/desktop` 为独立仓库 `stack-wuh/wuh.site.desktop`（public, main），以 git 子模块嵌入父仓库，与 `apps/blog` 同模式：pnpm workspace 排除（`!apps/desktop`）、子仓库独立 lockfile（`pnpm install --ignore-workspace`）、父仓库仅维护子模块指针。

进程安全边界：渲染进程 `contextIsolation` 开启、无 nodeIntegration；全部 fs/git/网络操作收敛主进程，经 `window.api`（shared/types.ts 的 DesktopApi 契约）类型安全 IPC 暴露。GitHub PAT 用 Electron safeStorage 加密存系统钥匙串；git push 凭证以 `https://x-access-token:<token>@...` 内存注入、报错脱敏，不落仓库配置。预览本地图片走自定义 `local-resource:` 协议（dev/prod 一致，不关 webSecurity）。

回退语义（revert-only）：未 push 的单文件改动用 checkout 恢复（有上游时自 upstream，无上游仅清脏改动）；已 push 的提交一律 `git revert` 生成反向提交抵消，禁止改写远端历史；无上游且存在未推送提交时回退明确阻塞并引导历史面板。

设计同源策略：desktop 不消费站点组件库（源码直出、跨仓库不可消费）。token 以快照复制自 `packages/components/themes`（四主题 wine/plain × light/dark、三层 CSS 变量、data-theme-family/data-color-scheme 属性、--font-sans/--font-mono、font-synthesis:none）；图标直依赖 lucide-react（站点图标上游库）统一 strokeWidth=2/currentColor，品牌图标自定义 SVG 同风格；字体内置站点同款 Noto Sans SC / JetBrains Mono woff2 子集。组件与 UI 原语在 desktop 内自持。

## 执行约束

- desktop 依赖安装必须 `--ignore-workspace`；父仓库提交仅动子模块指针与 workspace 配置。
- 回退动作不得改写已 push 历史；凭证不得写入仓库配置或报错信息。
- 桌面 UI 颜色只经主题变量暴露，图标不散落裸 SVG/emoji。

## 适用边界

不约束站点 web 组件库自身实现；多平台发布（微信公众号/Notion/知乎）仅预留 publisher 适配器接口，未实现。

## 验证方式

检查 apps/desktop 的 electron.vite/ipc/credentials/gitRevert/tokens 实现；运行 desktop 内 vitest 与双侧 tsc；electron-builder mac dir 打包并启动验证。

## 关联知识

- [design system](./design-system.md)
- [icon system](./icon-system.md)
