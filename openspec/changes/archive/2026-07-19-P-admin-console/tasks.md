---
artifact: tasks
contractVersion: 1
requiredHeadings:
  - 任务清单
  - 验收
requiredPatterns:
  - '^## Phase .+'
  - '^### Task .+'
  - '^- \[ \] \*\*文件:\*\* .+'
---

# 任务清单

## Phase 1: 后端认证与权限基础

### Task 1: 后端权限契约与用户角色固定

- [ ] **文件:** `packages/shared-contracts/src/admin.dto.ts`, `packages/shared-contracts/src/index.ts`, `packages/wuh.site.nest/src/modules/user/user.service.ts`, `packages/wuh.site.nest/src/modules/user/schemas/user.schema.ts`
- [ ] 新增后台用户、权限、认证响应、操作响应共享 DTO。
- [ ] 增加 `resolveRoleByLogin(login)` 或等价方法，固定 `stack-wuh => root`，其他用户 => `reader`。
- [ ] 调整用户创建/更新流程，防止非 `stack-wuh` 因数据库旧值或请求参数获得 `root/writer`。
- [ ] **预计耗时:** 1.5h
- [ ] **验证:** `pnpm --filter @wuh.site/nest test -- user` 或新增/运行用户服务单测；`pnpm exec tsc --noEmit`

### Task 2: GitHub OAuth 与当前用户接口

- [ ] **文件:** `packages/wuh.site.nest/src/modules/auth/**`, `packages/wuh.site.nest/src/modules/user/user.module.ts`, `packages/wuh.site.nest/src/app.module.ts`
- [ ] 新增 `AuthController`、`AuthService`、GitHub OAuth callback、JWT 签发/清理、`GET /v2/auth/me`。
- [ ] 实现 `JwtAuthGuard`、JWT strategy 或等价 token 校验，并提供 `CurrentUser` decorator。
- [ ] 配置需要的环境变量：`GITHUB_OAUTH_CLIENT_ID`、`GITHUB_OAUTH_CLIENT_SECRET`、`GITHUB_OAUTH_CALLBACK_URL`、`CONSOLE_URL`、`JWT_SECRET`。
- [ ] **预计耗时:** 2h
- [ ] **验证:** Auth service/controller 单测覆盖 root/reader 登录；Swagger 可见 `/v2/auth/**`；`pnpm --filter @wuh.site/nest test -- auth`

### Task 3: RootGuard 与后台写权限拦截

- [ ] **文件:** `packages/wuh.site.nest/src/modules/auth/guards/**`, `packages/wuh.site.nest/src/modules/auth/decorators/**`, `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`
- [ ] 新增 `RootGuard`，仅允许 `role === root`。
- [ ] 为后台 GET 接口使用认证 guard，为 PATCH/POST/DELETE 管理动作叠加 root guard。
- [ ] reader 调用写接口时返回统一 403 错误格式。
- [ ] **预计耗时:** 1h
- [ ] **验证:** controller/guard 单测覆盖 reader 写入被拒、root 写入允许

## Phase 2: 后台管理 API

### Task 4: 博客后台管理 API

- [ ] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/admin/admin.module.ts`, `packages/wuh.site.nest/src/modules/content/content.service.ts`, `packages/wuh.site.nest/src/modules/content/dto/content.dto.ts`
- [ ] 新增 `/v2/admin/content/posts` 列表和 `/v2/admin/content/posts/:number` 详情。
- [ ] 迁移或扩展现有 metadata 更新接口为 `/v2/admin/content/posts/:number/metadata` 并加 root guard。
- [ ] 如现有 sync 模块可复用，增加 root-only 单篇同步入口；否则在设计中标记为后续实现。
- [ ] **预计耗时:** 2h
- [ ] **验证:** Admin content controller 单测；reader GET 成功、PATCH 403、root PATCH 成功

### Task 5: 留言板后台管理 API

- [ ] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.service.ts`, `packages/wuh.site.nest/src/modules/comment/dto/comment.dto.ts`, `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
- [ ] 明确留言板数据筛选规则（例如 `page` 非博客文章详情或专用标记）。
- [ ] 新增 `/v2/admin/guestbook/comments` 只读列表/详情。
- [ ] 新增 root-only 状态更新、删除/软删除能力；如 schema 缺少状态字段，补充最小状态字段。
- [ ] **预计耗时:** 2h
- [ ] **验证:** 留言板管理 API 单测覆盖分页、reader 只读、root 状态更新

### Task 6: 博客评论审核后台 API

- [ ] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.service.ts`, `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
- [ ] 新增 `/v2/admin/post-comments` 列表，支持 `issueNumber`、状态、同步失败筛选。
- [ ] 将现有 approve 能力纳入 root-only 后台接口，保留重复审批拦截。
- [ ] 补齐 reject、retry-sync、delete/soft-delete 等管理动作。
- [ ] **预计耗时:** 2h
- [ ] **验证:** 评论审核单测覆盖 approve 重复拦截、reader 403、root 操作成功

### Task 7: 后台概览与用户只读 API

- [ ] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/admin/admin.module.ts`, `packages/wuh.site.nest/src/modules/user/user.service.ts`
- [ ] 新增 `/v2/admin/overview` 统计博客、留言、评论待处理数量。
- [ ] 新增 `/v2/admin/users` 只读用户列表，展示 GitHub login、头像、角色、最后登录时间。
- [ ] **预计耗时:** 1.5h
- [ ] **验证:** Admin overview/users 单测；reader/root 均可读取

## Phase 3: Console 前端应用

### Task 8: 创建 Vite React Console package

- [ ] **文件:** `packages/wuh.site.console/package.json`, `packages/wuh.site.console/index.html`, `packages/wuh.site.console/src/**`, `packages/wuh.site.console/tsconfig.json`, `packages/wuh.site.console/vite.config.ts`, `package.json`
- [ ] 新增 Vite + React 19 + TypeScript 应用结构。
- [ ] 增加 `dev:console`、`build:console`、`preview:console` 或等价 root scripts。
- [ ] 配置 `VITE_API_BASE_URL`、组件库 workspace 依赖、styled-components 基础样式。
- [ ] **预计耗时:** 1.5h
- [ ] **验证:** `pnpm --filter @wuh.site/console build`

### Task 9: Console 认证与权限框架

- [ ] **文件:** `packages/wuh.site.console/src/api/**`, `packages/wuh.site.console/src/auth/**`, `packages/wuh.site.console/src/routes/**`, `packages/wuh.site.console/src/components/AdminShell.tsx`, `packages/wuh.site.console/src/components/PermissionGate.tsx`
- [ ] 实现 API client、AuthProvider、RequireAuth、GitHub 登录跳转、logout、权限判断。
- [ ] 实现 AdminShell 导航和当前用户显示。
- [ ] reader 登录时展示只读提示，写操作统一隐藏或禁用。
- [ ] **预计耗时:** 2h
- [ ] **验证:** Console build；手动检查未登录跳转和权限 UI；可补充 Vitest/RTL 测试

### Task 10: Console 博客管理页面

- [ ] **文件:** `packages/wuh.site.console/src/pages/content/**`, `packages/wuh.site.console/src/components/DataTable.tsx`, `packages/wuh.site.console/src/components/StatusBadge.tsx`
- [ ] 实现博客列表、筛选、分页、详情页面。
- [ ] root 可见 metadata 编辑/同步操作；reader 不可写。
- [ ] **预计耗时:** 2h
- [ ] **验证:** Console build；mock 或本地 API 手动验证列表/详情/权限展示

### Task 11: Console 留言板与评论管理页面

- [ ] **文件:** `packages/wuh.site.console/src/pages/guestbook/**`, `packages/wuh.site.console/src/pages/comments/**`, `packages/wuh.site.console/src/components/**`
- [ ] 实现留言板列表/详情/状态操作 UI。
- [ ] 实现博客评论审核列表、通过/拒绝/重试/删除 UI。
- [ ] reader 只读，root 可见并可触发管理动作。
- [ ] **预计耗时:** 2h
- [ ] **验证:** Console build；mock 或本地 API 手动验证 reader/root UI 差异

### Task 12: Console 用户与概览页面

- [ ] **文件:** `packages/wuh.site.console/src/pages/dashboard/**`, `packages/wuh.site.console/src/pages/users/**`
- [ ] 实现后台概览统计卡片。
- [ ] 实现用户列表只读页面。
- [ ] **预计耗时:** 1h
- [ ] **验证:** Console build；页面可访问且空态/错误态正常

## Phase 4: 集成验证与文档

### Task 13: 集成配置与环境示例

- [ ] **文件:** `.env.example`, `README.md`, `packages/wuh.site.console/README.md`, `scripts/dev.sh`
- [ ] 记录 GitHub OAuth、JWT、Console URL、API Base URL、CORS 的环境变量。
- [ ] 如需要，更新本地开发脚本以同时启动 Nest、主站和 Console 或单独启动 Console。
- [ ] **预计耗时:** 1h
- [ ] **验证:** 文档包含本地 GitHub OAuth callback 示例和启动命令

### Task 14: 全量验证

- [ ] **文件:** `packages/wuh.site.nest/**`, `packages/wuh.site.console/**`, `packages/shared-contracts/**`
- [ ] 运行后端相关单测、Console 构建、全仓类型检查。
- [ ] 手动验证 root/reader 权限路径：`stack-wuh` root、非 `stack-wuh` reader、reader 写接口 403。
- [ ] **预计耗时:** 1.5h
- [ ] **验证:** `pnpm --filter @wuh.site/nest test`; `pnpm --filter @wuh.site/console build`; `pnpm exec tsc --noEmit`

## 验收

- [ ] `packages/wuh.site.console` 作为 Vite + React SPA 独立存在，并能构建成功。
- [ ] GitHub OAuth 登录后，`stack-wuh` 获得 root，其他 GitHub 用户自动获得 reader。
- [ ] reader 可以读取博客、留言板、博客评论、用户和概览数据。
- [ ] reader 调用任何后台写操作都会被 NestJS 返回 403。
- [ ] root 可以执行博客 metadata 更新、留言状态管理、评论审核/拒绝/重试/删除等管理动作。
- [ ] Console UI 对 reader 隐藏或禁用写操作，并展示只读说明。
- [ ] 新增后台 API 可在 Swagger 中发现，列表复用统一分页响应，错误复用统一异常格式。
- [ ] `pnpm --filter @wuh.site/nest test` 通过。
- [ ] `pnpm --filter @wuh.site/console build` 通过。
- [ ] `pnpm exec tsc --noEmit` 零错误。
