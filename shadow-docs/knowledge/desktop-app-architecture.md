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
  - changes/20260915-feature-desktop-plugin-system/brief.md
  - apps/desktop 仓库 shadow-docs/changes/20260922-feature-user-center-github-oauth/brief.md（desktop 已为独立子仓库，跨仓溯源）
  - apps/desktop/shadow-docs/changes/20260923-test-dom-render-guard/brief.md
verified: 2026-09-23
---

# Desktop 应用架构

## 当前结论

`apps/desktop` 为独立仓库 `stack-wuh/wuh.site.desktop`（public, main），以 git 子模块嵌入父仓库，与 `apps/blog` 同模式：pnpm workspace 排除（`!apps/desktop`）、子仓库独立 lockfile（`pnpm install --ignore-workspace`）、父仓库仅维护子模块指针。

进程安全边界：渲染进程 `contextIsolation` 开启、无 nodeIntegration；全部 fs/git/网络操作收敛主进程，经 `window.api`（shared/types.ts 的 DesktopApi 契约）类型安全 IPC 暴露——该全量面仅宿主自用，插件经主进程 broker 按 session+manifest 权限裁决的白名单能力访问（见插件系统架构卡片）。GitHub 凭证（2026-09-22 起两种来源：OAuth **Device Flow** 授权 token 或手动粘贴 PAT）以 Electron safeStorage 加密存 `userData/gh-token.bin`，密文为 JSON `{kind: 'oauth'|'pat', token}`，旧版裸 token 密文兼容为 pat；Device Flow 主进程直连 `github.com/login/device/code` 与 access_token 轮询端点（内嵌公开 client_id、无 client_secret、无本地回调服务器，token 槽位同一份、git push 凭证注入链路不分叉）。git push 凭证以 `https://x-access-token:<token>@...` 内存注入、报错脱敏，不落仓库配置。预览本地图片走自定义 `local-resource:` 协议（dev/prod 一致，不关 webSecurity；已注册 standard+secure+cors 以支持插件沙箱帧加载）。

回退语义（revert-only）：未 push 的单文件改动用 checkout 恢复（有上游时自 upstream，无上游仅清脏改动）；已 push 的提交一律 `git revert` 生成反向提交抵消，禁止改写远端历史；无上游且存在未推送提交时回退明确阻塞并引导历史面板。

设计同源策略：desktop 不消费站点组件库（源码直出、跨仓库不可消费）。token 以快照复制自 `packages/components/themes`（四主题 wine/plain × light/dark、三层 CSS 变量、data-theme-family/data-color-scheme 属性、--font-sans/--font-mono、font-synthesis:none）；图标直依赖 lucide-react（站点图标上游库）统一 strokeWidth=2/currentColor，品牌图标自定义 SVG 同风格；字体内置站点同款 Noto Sans SC / JetBrains Mono woff2 子集。组件与 UI 原语在 desktop 内自持。

## 执行约束

- desktop 依赖安装必须 `--ignore-workspace`；父仓库提交仅动子模块指针与 workspace 配置。
- 回退动作不得改写已 push 历史；凭证不得写入仓库配置或报错信息。
- 桌面 UI 颜色只经主题变量暴露，图标不散落裸 SVG/emoji。

## 适用边界

不约束站点 web 组件库自身实现；多平台发布（微信公众号/Notion/知乎）仅预留 publisher 适配器接口，未实现。

## 验证方式

检查 apps/desktop 的 electron.vite/ipc/credentials/gitRevert/tokens 实现；运行 desktop 内 vitest 与三套 tsc（`npm run typecheck` = node / next / tests）；electron-builder mac dir 打包并启动验证。

**DOM 渲染测试（20260923-test-dom-render-guard 起）**：vitest 默认 node 环境（纯逻辑测试原速），DOM 渲染测试经文件头 `// @vitest-environment happy-dom` 按文件启用（happy-dom + @testing-library/react）；类型检查按环境分三套 tsconfig——`tsconfig.node.json`（主进程，**显式排除 DOM 测试以保住「主进程无 DOM」边界**）、`tsconfig.next.json`（渲染层）、`tsconfig.tests.json`（DOM + jsx，含 `lib/globals.d.ts` 的 window.api 声明）。渲染冒烟测试（`tests/capsule-render.test.tsx`）断言**渲染期零 React 告警**（非法 DOM 嵌套/无效 props/缺失 key 均经 console.error 报出——20260923-fix-capsule-doc-card-nesting 的 button 嵌套即此类）与 DOM 结构约束；渲染类缺陷的验收必须跑 DOM 用例，不能只看类型检查与源码扫描。

另（styled-components 约束，20260923-test-dom-render-guard 实测）：keyframes 插值须经 `css\`\`` 包裹的块内使用；插进未 tag 的字符串会告警且样式注入不可靠，直接在 styled 模板内写 `animation: ${keyframes}` 才是合法用法。

## 关联知识

- [design system](./design-system.md)
- [icon system](./icon-system.md)
- [桌面端插件系统架构](./desktop-plugin-architecture.md)
