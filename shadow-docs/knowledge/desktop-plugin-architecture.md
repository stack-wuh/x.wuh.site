---
title: 桌面端插件系统架构
domain: desktop
keywords: [插件系统, plugin, manifest, 沙箱 iframe, broker, session, 权限词表, 贡献点, 渲染管线, publisher 桥接, plugin-sdk]
scope:
  - apps/desktop
status: active
source:
  - changes/20260915-feature-desktop-plugin-system/brief.md
verified: 2026-09-15
---

# 桌面端插件系统架构

## 当前结论

`apps/desktop` 的功能面板按「编辑核心 + 插件」组织：插件 = 目录 + `plugin.json` manifest（id/name/version/logic/views/publishers/permissions，经 `src/shared/plugin.ts` 的 `validateManifest` 严格校验，id 禁止路径字符，入口限相对 .html/.js 且拒绝 .. 越界）。

信任链：插件逻辑与 UI 一律运行在 `sandbox="allow-scripts"` 的 iframe（不透明源，无 preload/node/宿主 DOM 访问），资源经主进程 `plugin://<id>/` 协议下发（`@core/sdk.js`、`@core/logic-host.html` 为协议合成的虚拟文件，SDK 源码字符串编入主进程 bundle）。host（核心渲染层代码）逐帧建立 MessagePort 绑定身份，能力调用按 service 分流：`cap` → 主进程 broker（session→manifest 权限裁决后复用 `ipc.ts` 的 `implement()` 能力表），`doc`/`render`/`ui` → host 直服务（同样先查权限）。sessionId 由主进程签发、只在 host 内存流转，绝不下发给插件帧；`window.api`（完整 DesktopApi）降级为宿主自用。

能力白名单 `CAPABILITY_METHODS` 默认拒绝：不在表内的方法（setGithubToken、uploadImage、openWorkspace 等）对插件永久不可见；broker 对能力实现的报错做 token 值兜底脱敏。贡献点首期收敛为四类：`views`（sidebar/preview 区域 + 图标白名单）、`renderRules`（异步 RPC middleware，单规则 2s 超时跳过）、`documentHooks`（store 的 open/save/changed/closed 事件广播）、`publishers`（manifest 声明 → 主进程注册表桥接 → 派发回插件逻辑帧执行）。渲染管线基础 markdown-it 实例保留在 host（可信核心代码），frontmatter 剥离与相对图片 → local-resource 重写由管线完成。

官方参考插件（`plugins/` 下 preview-markdown、git-history、github-issues、frontmatter）与第三方同约束：纯静态资产、不消费宿主组件、样式仅用注入的主题 token 变量、第三方依赖自 vendor（js-yaml UMD）。

## 执行约束

- 新增插件能力必须先进 `CAPABILITY_METHODS` 白名单并绑定权限词表项，禁止为单插件开特例通道；host 直服务（doc/render/ui）同样先过 manifest 权限。
- 插件凭证只经能力代理注入（GitHub 走 `net.github.api`/`publish.register`），不得让插件帧或报错接触 token 原文。
- 插件帧禁止 `allow-same-origin`；消息协议 kind（hello/ready/invoke/result/event/request/response）变更须同步 `shared/plugin.ts` 类型、SDK 字符串与帧宿主三方。
- 插件 UI 颜色只经注入 token 变量、图标走白名单名称（资源由核心自持）；`local-resource` 协议已注册 standard+secure+cors，改动需回归插件帧内本地图片显示。
- 新增贡献点类型须以真实参考插件需要为准，不预留空抽象。

## 适用边界

只约束 `apps/desktop` 的插件机制与其上的官方插件；站点 web 端与此无关。市场、签名、审核、分发链路尚未实现（非目标期），权限批准目前是 manifest 声明即生效（用户确认弹窗后置）。utilityProcess 双进程运行时（方案 C）是契约兼容的演进方向，届时只换运行时。

## 验证方式

运行 `apps/desktop` 内 `vitest run tests/plugin-*.test.ts`（契约/裁决/协议/SDK/资产五类）与双侧 `tsc --noEmit`；检查 `shared/plugin.ts` 的白名单与 `PluginFrameHost.tsx` 服务分派一致、`plugins/*/plugin.json` 均过 `validateManifest`；`electron-vite build` 三端通过。

## 关联知识

- [desktop-app-architecture](desktop-app-architecture.md)（进程安全边界的上位约束）
- [design-system](design-system.md)（token 快照来源）
