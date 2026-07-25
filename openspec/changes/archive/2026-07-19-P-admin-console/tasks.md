---
artifact: tasks
contractVersion: 1
requiredHeadings:
  - 任务清单
  - 验收
requiredPatterns:
  - '^## Phase .+'
  - '^### Task .+'
  - '^- \[[ x]\] \*\*文件:\*\* .+'
---

# 任务清单

## Phase 1: 后端认证与权限基础

### Task 1: 后端权限契约与用户角色固定

- [x] **文件:** `packages/shared-contracts/src/admin.dto.ts`, `packages/shared-contracts/src/index.ts`, `packages/wuh.site.nest/src/modules/user/user.service.ts`, `packages/wuh.site.nest/src/modules/user/schemas/user.schema.ts`
- [x] 新增后台用户、权限、认证响应、操作响应共享 DTO。
- [x] 增加 `resolveRoleByLogin(login)`，固定 `stack-wuh => root`，其他用户 => `reader`。
- [x] 调整用户创建/更新流程，防止非 `stack-wuh` 因数据库旧值或请求参数获得 `root/writer`。
- [x] **预计耗时:** 1.5h
- [x] **验证:** 已有 user service 单测覆盖角色固定与旧角色降级。

### Task 2: GitHub OAuth 与当前用户接口

- [x] **文件:** `packages/wuh.site.nest/src/modules/auth/**`, `packages/wuh.site.nest/src/modules/user/user.module.ts`, `packages/wuh.site.nest/src/app.module.ts`
- [x] 新增 `AuthController`、`AuthService`、GitHub OAuth callback、JWT 签发/清理、`GET /v2/auth/me`。
- [x] 实现 `JwtAuthGuard`、JWT token 校验，并提供 `CurrentUser` decorator。
- [x] 配置需要的环境变量：`GITHUB_OAUTH_CLIENT_ID`、`GITHUB_OAUTH_CLIENT_SECRET`、`GITHUB_OAUTH_CALLBACK_URL`、`CONSOLE_URL`、`JWT_SECRET`。
- [x] **预计耗时:** 2h
- [x] **验证:** auth service/controller 单测已覆盖 OAuth state、root/reader 登录及 token 校验。

### Task 3: RootGuard 与后台写权限拦截

- [x] **文件:** `packages/wuh.site.nest/src/modules/auth/**`, `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`
- [x] 新增 `RootGuard`，仅允许 `stack-wuh` 通过。
- [x] 为后台 GET 接口使用认证 guard，为 PATCH/POST/DELETE 管理动作叠加 root guard。
- [x] reader 调用写接口时由服务端拒绝。
- [x] **预计耗时:** 1h
- [x] **验证:** guard 单测覆盖 stale root claim、reader 拒绝和 root 允许路径。

## Phase 2: 后台管理 API

### Task 4: 博客后台管理 API

- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/admin/admin.module.ts`, `packages/wuh.site.nest/src/modules/content/content.service.ts`, `packages/wuh.site.nest/src/modules/content/dto/content.dto.ts`
- [x] 新增 `/v2/admin/content/posts` 列表和 `/v2/admin/content/posts/:number` 详情。
- [x] 提供 `/v2/admin/content/posts/:number/metadata` 并加 root guard。
- [x] 提供 root-only 单篇同步入口，并保持为同步模块后续接入点。
- [x] **预计耗时:** 2h
- [x] **验证:** admin controller 单测已覆盖列表、详情和管理接口依赖注入。

### Task 5: 留言板后台管理 API

- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.service.ts`, `packages/wuh.site.nest/src/modules/comment/dto/comment.dto.ts`, `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
- [x] 以 `repo: 'guestbook'` 作为留言板数据筛选规则。
- [x] 新增 `/v2/admin/guestbook/comments` 只读列表接口。
- [x] 新增 root-only 状态更新与删除能力。
- [x] **预计耗时:** 2h
- [x] **验证:** admin controller 已覆盖留言板查询和 root-only 管理路由。

### Task 6: 博客评论审核后台 API

- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.service.ts`, `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
- [x] 新增 `/v2/admin/post-comments` 列表，支持 `issueNumber` 和状态筛选。
- [x] 将 approve 能力纳入 root-only 后台接口，保留已有重复审批拦截。
- [x] 补齐 reject、retry-sync、delete 管理动作。
- [x] **预计耗时:** 2h
- [x] **验证:** admin controller 已覆盖评论管理路由和 root guard 配置。

### Task 7: 后台概览与用户只读 API

- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/admin/admin.module.ts`, `packages/wuh.site.nest/src/modules/user/user.service.ts`
- [x] 新增 `/v2/admin/overview` 统计博客、留言、待处理评论数量。
- [x] 新增 `/v2/admin/users` 只读用户列表，展示 GitHub login、头像、角色、最后登录时间。
- [x] **预计耗时:** 1.5h
- [x] **验证:** admin controller 单测已覆盖 overview/users 的角色映射。

## Phase 3: Console 前端应用

### Task 8: 创建 Vite React Console package

- [x] **文件:** `packages/wuh.site.console/package.json`, `packages/wuh.site.console/index.html`, `packages/wuh.site.console/src/**`, `packages/wuh.site.console/tsconfig.json`, `packages/wuh.site.console/vite.config.ts`, `package.json`
- [x] 新增 Vite + React 19 + TypeScript 应用结构。
- [x] 增加 `dev:console`、`build:console`、`preview:console` root scripts。
- [x] 配置 `VITE_API_BASE_URL`、组件库 workspace 依赖与 styled-components 基础样式。
- [x] **预计耗时:** 1.5h
- [x] **验证:** package 和 root scripts 已存在；本次构建尝试受本机 Vite SIGSEGV 阻断，未将构建标记为通过。

### Task 9: Console 认证与权限框架

- [x] **文件:** `packages/wuh.site.console/src/api/**`, `packages/wuh.site.console/src/auth/**`, `packages/wuh.site.console/src/routes/**`, `packages/wuh.site.console/src/components/AdminShell.tsx`, `packages/wuh.site.console/src/components/PermissionGate.tsx`
- [x] 实现 API client、AuthProvider、RequireAuth、GitHub 登录跳转、logout、权限判断。
- [x] 实现 AdminShell 导航和当前用户显示。
- [x] reader 登录时展示只读提示，写操作统一隐藏或禁用。
- [x] **预计耗时:** 2h
- [x] **验证:** 源码结构与权限组件已核对。

### Task 10: Console 博客管理页面

- [x] **文件:** `packages/wuh.site.console/src/pages/content/**`, `packages/wuh.site.console/src/components/DataTable.tsx`, `packages/wuh.site.console/src/components/StatusBadge.tsx`
- [x] 实现博客列表、筛选、分页、详情页面。
- [x] root 可见 metadata 编辑/同步操作；reader 不可写。
- [x] **预计耗时:** 2h
- [x] **验证:** 页面、表格和状态组件已核对；构建验证受本机 Vite SIGSEGV 阻断。

### Task 11: Console 留言板与评论管理页面

- [x] **文件:** `packages/wuh.site.console/src/pages/guestbook/**`, `packages/wuh.site.console/src/pages/comments/**`, `packages/wuh.site.console/src/components/**`
- [x] 实现留言板列表/详情/状态操作 UI。
- [x] 实现博客评论审核列表、通过/拒绝/重试/删除 UI。
- [x] reader 只读，root 可见并可触发管理动作。
- [x] **预计耗时:** 2h
- [x] **验证:** 页面与权限门控源码已核对；构建验证受本机 Vite SIGSEGV 阻断。

### Task 12: Console 用户与概览页面

- [x] **文件:** `packages/wuh.site.console/src/pages/dashboard/**`, `packages/wuh.site.console/src/pages/users/**`
- [x] 实现后台概览统计卡片。
- [x] 实现用户列表只读页面。
- [x] **预计耗时:** 1h
- [x] **验证:** 页面源码已核对；构建验证受本机 Vite SIGSEGV 阻断。

## Phase 4: 集成配置与文档

### Task 13: 集成配置与环境示例

- [x] **文件:** `.env.example`, `README.md`, `packages/wuh.site.console/README.md`, `scripts/dev.sh`
- [x] 记录 GitHub OAuth、JWT、Console URL、API Base URL、CORS 的环境变量。
- [x] 更新本地开发脚本以同时启动 Nest、主站和 Console。
- [x] **预计耗时:** 1h
- [x] **验证:** 根 README、Console README、`.env.example` 和开发脚本已核对。

### Task 14: 全量验证

- [x] **文件:** `packages/wuh.site.nest/**`, `packages/wuh.site.console/**`, `packages/shared-contracts/**`
- [x] 运行后端相关单测、Console 构建、全仓类型检查。
- [x] 核对 root/reader 权限路径：`stack-wuh` root、非 `stack-wuh` reader、reader 写接口拒绝。
- [x] **预计耗时:** 1.5h
- [x] **验证:** 代码与测试已核对；OpenSpec 变更校验、Console 构建及全仓 TypeScript 检查已在 Node 20.20.2 下通过。Nest 全量测试仍在多个 Console 相关 suite 中发生 Jest 进程 SIGSEGV，未标记为通过。

## 验收

- [x] `packages/wuh.site.console` 作为 Vite + React SPA 独立存在。
- [x] GitHub OAuth 登录后，`stack-wuh` 获得 root，其他 GitHub 用户自动获得 reader。
- [x] reader 可以读取博客、留言板、博客评论、用户和概览数据。
- [x] reader 调用后台写操作会被 NestJS root guard 拒绝。
- [x] root 可以执行博客 metadata 更新、留言状态管理、评论审核/拒绝/重试/删除等管理动作。
- [x] Console UI 对 reader 隐藏或禁用写操作，并展示只读说明。
- [x] 新增后台 API 使用 Swagger 装饰器，列表复用既有分页服务响应。
- [ ] `pnpm --filter @wuh.site/nest test --runInBand` 通过：Node 20.20.2 下部分 suite 通过，但全量运行及多个 Console 相关 suite 的 Jest 进程仍发生 SIGSEGV。
- [x] `pnpm --filter @wuh.site/console build` 通过：Node 20.20.2 下 Vite 成功构建 47 个模块。
- [x] `pnpm exec tsc --noEmit` 零错误：Node 20.20.2 下退出码 0。
