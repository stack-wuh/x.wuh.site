---
title: 桌面端插件系统架构
domain: desktop
keywords: [插件系统, plugin, manifest, 沙箱 iframe, broker, session, 权限词表, 贡献点, 渲染管线, publisher 桥接, plugin-sdk, float 浮窗, 批准 approvals, 插件管理]
scope:
  - apps/desktop
status: active
source:
  - changes/archive/20260915-feature-desktop-plugin-system/brief.md
  - apps/desktop/shadow-docs/changes/archive/20260918-feature-shell-float-layer/brief.md
  - apps/desktop/shadow-docs/changes/archive/20260920-feature-plugin-manager/brief.md
  - apps/desktop/shadow-docs/changes/20260922-feature-home-editor-panel/brief.md
  - apps/desktop/shadow-docs/changes/archive/20260922-feature-vditor-md-editor/brief.md
  - apps/desktop/shadow-docs/changes/archive/20260922-fix-vditor-theme-bridge/brief.md
  - apps/desktop/shadow-docs/changes/archive/20260922-fix-editor-panel-controls/brief.md
  - apps/desktop/shadow-docs/changes/20260923-feature-cm-live-preview/brief.md
verified: 2026-09-23
---

# 桌面端插件系统架构

## 当前结论

`apps/desktop` 的功能面板按「编辑核心 + 插件」组织：插件 = 目录 + `plugin.json` manifest（id/name/version/logic/views/publishers/permissions，经 `src/shared/plugin.ts` 的 `validateManifest` 严格校验，id 禁止路径字符，入口限相对 .html/.js 且拒绝 .. 越界）。**宿主写入 UI（2026-09-22 演进）**：首页持有主编辑器面板，直写 workspaceStore 的 `openDoc/setContent/saveActive`，content 双通道并存——宿主编辑器与插件帧 `doc.set` 汇聚同一 store 状态源，documentHooks 广播对两者一致生效。**编辑核心引擎（20260923 演进，20260923-feature-cm-live-preview）**：主编辑器为 CodeMirror 6 源码编辑 + L3 即时渲染装饰层（`components/editor/decorations.ts` 的 livePreviewField StateField + `widgets.ts`）；#52 引入的 Vditor 4 IR 已被 20260922-refactor-codemirror-editor 换为 CM6，本变更再叠加即时渲染。渲染开关经 Compartment 热切换（livePreviewField 挂/卸，偏好持久化 `wd.editorRenderMode`，快捷键 Mod-/）；视觉规则为光标触及行保持源码态（selectionLineSet），其余行标题加级、引用竖线、围栏换语言标头、mermaid 与 KaTeX 公式块整体换渲染 widget（两库动态 import 惰性分块 + 渲染失败回退源码）、图片内联缩略图（`@shared/url` toFileUrl 同款解析）、行内符号隐藏。双通道：updateListener docChanged 直写 store，外部注入经 cmExternalContent 全量回写 + pushedRef 防回环；CM6 事务天然覆盖命令路径，无 Vditor 式「命令突变不触发回调」问题。派生状态（当前章节/渲染模式）经 `lib/editor-state` 总线回推供胶囊与面板单状态源消费。**胶囊复合入口（2026-09-22 演进）**：壳层 TaskCapsule 兼任「任务 + 编辑器」复合入口（任务或活动文档任一存在即显示）——格式化/插入/大纲跳转经 `lib/editor-commands` 发布-订阅命令总线（无订阅者 no-op）下发编辑器实例，大纲/字数由 `lib/editor-info` 纯函数从 store.content 派生。**入口双轨制（2026-09-22-fix-editor-panel-controls 修正）**：胶囊化曾把项目/文件/保存全部收进胶囊且胶囊冷启动不渲染，造成「打开文件的入口恰在无文档时不可达」死锁——首页面板恢复上下操作行（上：项目/文件选择；下：状态/新建/保存）作为常在入口，胶囊降级为全局补充入口；文档操作宿主 `EditorCommandHost` 常驻壳层 layout **单实例**（禁止面板/胶囊重复挂载导致命令双消费），面板与胶囊按钮均经命令通道发布。内置编辑器移除期（2026-09-21 前后）的「宿主无写入 UI」结论自此废止。

信任链：插件逻辑与 UI 一律运行在 `sandbox="allow-scripts"` 的 iframe（不透明源，无 preload/node/宿主 DOM 访问），资源经主进程 `plugin://<id>/` 协议下发（`@core/sdk.js`、`@core/logic-host.html` 为协议合成的虚拟文件，SDK 源码字符串编入主进程 bundle）。host（核心渲染层代码）逐帧建立 MessagePort 绑定身份，能力调用按 service 分流：`cap` → 主进程 broker（session→manifest 权限裁决后复用 `ipc.ts` 的 `implement()` 能力表），`doc`/`render`/`ui` → host 直服务（同样先查权限）。sessionId 由主进程签发、只在 host 内存流转，绝不下发给插件帧；`window.api`（完整 DesktopApi）降级为宿主自用。

能力白名单 `CAPABILITY_METHODS` 默认拒绝：不在表内的方法（setGithubToken、uploadImage、openWorkspace 等）对插件永久不可见；broker 对能力实现的报错做 token 值兜底脱敏。贡献点首期收敛为四类：`views`（main/float 区域 + 图标白名单——双栏布局 2026-09-21 起 sidebar 废弃、插件 main 视图直进右栏路由，preview 固定分栏已于 2026-09-20 泛化为 float 浮窗经 FloatLayer 按需唤起）、`renderRules`（异步 RPC middleware，单规则 2s 超时跳过）、`documentHooks`（store 的 open/save/changed/closed 事件广播）、`publishers`（manifest 声明 → 主进程注册表桥接 → 派发回插件逻辑帧执行）。渲染管线基础 markdown-it 实例保留在 host（可信核心代码），frontmatter 剥离与相对图片 → local-resource 重写由管线完成。

**权限批准模型（2026-09-21 落地）**：`plugin-state.json` 增 `approvals` 段（插件 id → 批准时 manifest 权限快照）；纯函数 `resolveApproval` 判定三态 `approved/pending/changed`（快照与当前 manifest 权限排序去重比较），**有效启用 = 用户未禁用 且 批准有效**——broker 会话、逻辑帧、publisher 桥接、渲染层视图列表全部自动继承该语义。启用 pending/changed 插件必须携带与 manifest 完全一致的权限数组（`plugin:setEnabled` 三参，主进程校验），批准时机由壳层管理入口（设置页插件区块）弹窗承载；manifest 权限变更自动落 `changed` 待重批；禁用不撤销批准记录。

官方参考插件（`plugins/` 下 preview-markdown、git-history、github-issues、frontmatter）与第三方同约束：纯静态资产、不消费宿主组件、样式仅用注入的主题 token 变量、第三方依赖自 vendor（js-yaml UMD）。

## 执行约束

- 新增插件能力必须先进 `CAPABILITY_METHODS` 白名单并绑定权限词表项，禁止为单插件开特例通道；host 直服务（doc/render/ui）同样先过 manifest 权限。
- 插件凭证只经能力代理注入（GitHub 走 `net.github.api`/`publish.register`），不得让插件帧或报错接触 token 原文。
- 插件帧禁止 `allow-same-origin`；消息协议 kind（hello/ready/invoke/result/event/request/response）变更须同步 `shared/plugin.ts` 类型、SDK 字符串与帧宿主三方。
- 插件 UI 颜色只经注入 token 变量、图标走白名单名称（资源由核心自持）；`local-resource` 协议已注册 standard+secure+cors，改动需回归插件帧内本地图片显示。
- 新增贡献点类型须以真实参考插件需要为准，不预留空抽象。
- 编辑器功能入口一律收进壳层胶囊并经命令通道（`lib/editor-commands`）下发，禁止在编辑器面板内重建工具栏或旁路直调编辑器实例；命令事务经 updateListener 自动回同步 store（CM6 事务覆盖命令路径）。
- **CM6 装饰硬约束（20260923 实测踩出）**：跨行 replace 装饰（mermaid/公式块）必须经 StateField 直供（`EditorView.decorations.from(field)`）——插件函数式供给直接抛 RangeError「Decorations that replace line breaks may not be specified via plugins」；line decoration 必须零长挂行首（非零长抛 RangeError）；替换区须经 `EditorView.atomicRanges` 注册防光标落入；渲染失败一律回退源码，装饰层异常不得逃逸。
- 图片粘贴落盘复用 `savePastedImage` 能力链（`src/main/images.ts` + `@shared/imagePlan`：文档同名 `<stem>.assets/` 目录、时间戳防冲突命名、返回相对引用 markdownRef），禁止 base64 内嵌正文。

## 适用边界

只约束 `apps/desktop` 的插件机制与其上的官方插件；站点 web 端与此无关。市场、签名、审核、分发与本地插件安装/卸载链路尚未实现（非目标期）；权限批准已落地为快照模型（见上），管理入口为设置页插件区块。utilityProcess 双进程运行时（方案 C）是契约兼容的演进方向，届时只换运行时。

## 验证方式

运行 `apps/desktop` 内 `vitest run tests/plugin-*.test.ts`（契约/裁决/协议/SDK/资产五类）与双侧 `tsc --noEmit`；检查 `shared/plugin.ts` 的白名单与 `PluginFrameHost.tsx` 服务分派一致、`plugins/*/plugin.json` 均过 `validateManifest`；`electron-vite build` 三端通过。

## 关联知识

- [desktop-app-architecture](desktop-app-architecture.md)（进程安全边界的上位约束）
- [design-system](design-system.md)（token 快照来源）
