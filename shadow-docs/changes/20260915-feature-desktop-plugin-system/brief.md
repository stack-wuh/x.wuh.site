---
{
  "schema": "shadow-dev/v1",
  "name": "20260915-feature-desktop-plugin-system",
  "type": "feature",
  "scope": "apps/desktop",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260915-feature-desktop-plugin-system",
  "files": [
    "apps/desktop/electron-builder.yml",
    "apps/desktop/plugins",
    "apps/desktop/src/main/github/issues.ts",
    "apps/desktop/src/main/index.ts",
    "apps/desktop/src/main/ipc.ts",
    "apps/desktop/src/main/plugins/broker.ts",
    "apps/desktop/src/main/plugins/loader.ts",
    "apps/desktop/src/main/plugins/protocol.ts",
    "apps/desktop/src/main/publishers/github-issues.ts",
    "apps/desktop/src/main/publishers/types.ts",
    "apps/desktop/src/main/register-features.ts",
    "apps/desktop/src/plugin-sdk/index.ts",
    "apps/desktop/src/preload/index.ts",
    "apps/desktop/src/renderer/src/App.tsx",
    "apps/desktop/src/renderer/src/components/ActivityBar.tsx",
    "apps/desktop/src/renderer/src/components/GitHubPanel.tsx",
    "apps/desktop/src/renderer/src/comments/CommentsPanel.tsx",
    "apps/desktop/src/renderer/src/editor/EditorPane.tsx",
    "apps/desktop/src/renderer/src/editor/useDirtyState.ts",
    "apps/desktop/src/renderer/src/frontmatter/FrontmatterPanel.tsx",
    "apps/desktop/src/renderer/src/history/HistoryPanel.tsx",
    "apps/desktop/src/renderer/src/issues/IssuesPanel.tsx",
    "apps/desktop/src/renderer/src/labels/LabelsPanel.tsx",
    "apps/desktop/src/renderer/src/main.tsx",
    "apps/desktop/src/renderer/src/plugins/PluginFrameHost.tsx",
    "apps/desktop/src/renderer/src/plugins/renderPipeline.tsx",
    "apps/desktop/src/renderer/src/preview/Preview.tsx",
    "apps/desktop/src/renderer/src/store.ts",
    "apps/desktop/src/renderer/src/styles/global.css",
    "apps/desktop/src/renderer/src/styles/preview.css",
    "apps/desktop/src/shared/plugin.ts",
    "apps/desktop/src/shared/types.ts",
    "apps/desktop/tests/plugin-auth.test.ts",
    "apps/desktop/tests/plugin-broker.test.ts",
    "apps/desktop/tests/plugin-manifest.test.ts",
    "apps/desktop/tests/plugin-protocol.test.ts",
    "apps/desktop/tests/plugin-sdk.test.ts",
    "apps/desktop/tests/plugin-assets.test.ts",
    "apps/desktop/tsconfig.node.json"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 381,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/381",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "c1e224f9173896b9b4ba34b403d11fe139ee8e4d",
    "verifiedAt": "2026-09-15T06:34:04.999Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:381",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# Desktop 编辑器插件系统（沙箱 iframe + 主进程权限 Broker）

## 动机

desktop 编辑器（apps/desktop）当前是功能硬编码的一元应用：渲染层 `App.tsx` 写死四个面板与活动栏、`Preview.tsx` 持有唯一同步 markdown-it 实例，`window.api` 将 28 个方法无身份区分地全量暴露给渲染进程。目标是把核心收敛到编辑功能、其余功能全部插件化，且按"Day-1 允许安装第三方插件"的信任模型设计机制。第一期不做市场/分发/审核基础设施，交付机制 + 契约 + 4 个官方参考插件证明 API 够用。

## 引用规范

- shadow-docs/knowledge/desktop-app-architecture.md
  - 当前结论: 渲染进程 contextIsolation、无 nodeIntegration；fs/git/网络收敛主进程经 window.api 类型安全 IPC；凭证不得进插件可见配置与报错；桌面 UI 用 token 快照自持，不消费站点组件库
  - 适用 scope: apps/desktop
- norms/code-style.md
  - 当前结论: 禁止新增 any；不为未来场景提前增加抽象；跨包只经公开入口
  - 适用 scope: apps/desktop（插件 API 面按 4 个参考插件的当下需要收敛）

## 决策

- **选型:** 方案 A——插件 = `<dir>/plugin.json` manifest + 沙箱 iframe 运行时（自定义协议 `plugin://<id>/` 加载资源）。插件逻辑跑隐藏 frame，UI 跑视图 frame；能力调用一律 postMessage → 主进程 broker，broker 以 `event.senderFrame` 核验 pluginId、按 manifest 已批准权限裁决，再复用现有 `implement()` 能力表。
- **对比方案:** B（渲染进程内 React 插件）：实现最快、同步扩展点天然，但第三方代码等同全权限，与"直接面向第三方"的信任模型冲突，否；C（utilityProcess 逻辑进程 + webview UI）：生态终态、隔离与上限最高，但对首期过度设计，否——manifest 与权限词表 A/C 通用，演进只换运行时不换契约；A+（首期提前上 utilityProcess）：为不存在的后台场景付双倍运行时成本，否。
- **理由:** A 是唯一同时满足"第三方信任 Day-1 + 首期仅机制+参考插件"约束的方案，与架构卡片"fs/git/网络收敛主进程"铁律同构；官方参考插件按第三方同等约束开发（吃自己狗粮），杜绝双标 API 膨胀。
- **扩展点收敛:** 首期仅四类——`views`（侧栏/预览区面板贡献）、`renderRules`（渲染异步 middleware 贡献）、`documentHooks`（open/save/dirty 生命周期事件）、`publishers`（发布目标贡献）。命令面板、插件间 API、主题插件、更新链路为非目标。
- **权限词表（首期）:** `fs.workspace.read`、`fs.workspace.write`、`git.status.read`、`git.history.write`、`net.github.api`、`settings.read`、`document.read.write`、`render.rule.register`、`publish.register`；broker 归一化后强制，manifest 未声明默认拒绝。
- **渲染管线:** 基础 markdown-it 实例放宿主自有可信帧；插件规则以异步 middleware RPC 接入（预览可接受毫秒级延迟）；相对图片路径解析留在宿主侧。
- **主题:** token 快照以 CSS 自定义属性注入插件 frame（设计同源策略不变，插件不消费宿主组件）。
- **凭证边界:** `window.api` 降级为宿主自用；插件 frame 无 preload DesktopApi；GitHub token 仅经 `net.github.api` 代理访问，broker 注入并脱敏。

## 实施对齐（apply 期记录）

- 帧身份核验实现为"主进程签发 session token，host 中继携带"：插件 frame 为 `sandbox="allow-scripts"` 不透明源，无法自带身份，host（核心代码，完整度等同今日渲染层）逐帧 MessagePort 绑定 sessionId；主进程仍按 session→权限裁决。
- 渲染引擎（markdown-it）保留在 host 主 frame（同为可信核心代码），不再单独开"可信帧"；插件规则仍在各自沙箱帧内执行。
- 权限词表补 `render.execute`（预览类视图调用渲染服务）；frontmatter 面板从编辑器工具栏抽屉迁为侧栏视图贡献。
- 插件 SDK 以主进程 bundle 内字符串常量经 `plugin://<id>/@core/sdk.js` 虚拟路径下发（无独立构建步骤）；参考插件为纯静态 Web 资产（HTML/JS/CSS），markdown-it 等依赖留在宿主。
- publishers 桥接：manifest 声明式贡献 → 主进程注册桥接 Publisher，publish 经 host 派发回插件逻辑帧执行；桥接 `isAvailable` 首期恒为 true。

## 任务

### Phase 1 契约与运行时骨架
- [x] 定义 manifest schema 与权限词表类型 — `apps/desktop/src/shared/plugin.ts`
- [x] plugin:// 自定义协议 handler（目录越界防护、MIME） — `apps/desktop/src/main/plugins/protocol.ts`
- [x] 主进程 broker：senderFrame→pluginId 核验 + 权限裁决 — `apps/desktop/src/main/plugins/broker.ts`
- [x] 插件扫描、启用/禁用与设置持久化 — `apps/desktop/src/main/plugins/loader.ts`
- [x] 插件 frame 宿主：逻辑隐藏 frame + 视图动态 frame — `apps/desktop/src/renderer/src/plugins/PluginFrameHost.tsx`
- [x] 插件 SDK（iframe 侧：capabilities 代理、contribution 注册、dispose 生命周期） — `apps/desktop/src/plugin-sdk/index.ts`

### Phase 2 宿主改造与扩展点
- [x] ActivityBar/侧栏改为读 views 贡献注册表 — `apps/desktop/src/renderer/src/components/ActivityBar.tsx`、`apps/desktop/src/renderer/src/App.tsx`
- [x] renderRules 异步 middleware 管线（可信帧 md 实例） — `apps/desktop/src/renderer/src/plugins/renderPipeline.tsx`
- [x] documentHooks 事件总线（open/save/dirty 广播） — `apps/desktop/src/renderer/src/store.ts`
- [x] publishers 贡献点桥接现有注册表 — `apps/desktop/src/main/publishers/types.ts`

### Phase 3 官方参考插件（与第三方同约束）
- [x] preview-markdown：提取 Preview.tsx — `apps/desktop/plugins/preview-markdown/`
- [x] github-issues：提取 GitHubPanel/IssuesPanel/LabelsPanel/CommentsPanel 与 issues.ts、publishers/github-issues.ts — `apps/desktop/plugins/github-issues/`
- [x] git-history：提取 HistoryPanel 与 gitRevert 视图 — `apps/desktop/plugins/git-history/`
- [x] frontmatter：提取 FrontmatterPanel 及 shared/frontmatter 消费方 — `apps/desktop/plugins/frontmatter/`

### Phase 4 验证
- [x] broker vitest：默认拒绝/授权放行/伪造身份/凭证脱敏 — `apps/desktop/tests/`
- [x] 停用任一参考插件对应功能消失、编辑核心完好；tsc 双侧 + vitest 全绿 — apps/desktop

## 结果

- 实际耗时: —
- 验证: `apps/desktop` 内 vitest 11 文件/72 测试全绿（含 40 例插件契约/裁决/协议/SDK/资产测试）、`tsc --noEmit` node+web 双工程通过、`electron-vite build` 三端构建成功、全部插件 JS 过 ESM 语法检查。未做：Electron GUI 手工冒烟（停用插件回归、插件帧内本地图片显示——local-resource 协议本次升级 standard+secure，属敏感回归点）。

## 知识评估

- **最终动作:** 新增 `shadow-docs/knowledge/desktop-plugin-architecture.md`（domain desktop，scope apps/desktop，source 本 brief，menu 已加路由）；更新 `desktop-app-architecture.md`（"window.api 全量直给"表述改为"宿主自用 + 插件经 broker 裁决"，追加 source 本 brief，关联新卡）。
- **理由:** 权限词表、帧消息协议、broker 裁决规则与贡献点契约是长期有效执行真相，与进程安全边界卡分开维护；旧卡表述被本变更改写，属事实变化原位更新。

