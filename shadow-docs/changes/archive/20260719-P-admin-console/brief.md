# 独立后台 Console 与 GitHub 认证只读权限

> 原始变更名：`2026-07-19-P-admin-console`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
当前站点已具备 NestJS 内容、留言板、博客评论、用户、认证等模块，但管理能力分散在 API 或脚本层，缺少一个独立后台 Console 来统一查看与操作。博客内容、留言板消息、博客评论等需要支持后台管理，同时管理入口必须复用 GitHub 认证，避免额外账号体系。

权限上需要满足明确的安全边界：GitHub 登录后自动注册用户；`stack-wuh` 是唯一 Root 管理员；除 `stack-wuh` 之外的所有 GitHub 用户只能获得 Read 只读权限，允许查看后台数据但不能执行创建、更新、删除、审核、同步等写操作。

## 引用规范
- `specs/admin-console/spec.md`

## 决策
本变更采用“独立 Console SPA + NestJS 后台 API”的架构：

```text
GitHub OAuth
    │
    ▼
packages/wuh.site.nest
  /v2/auth/github ──► GitHub user profile
  /v2/auth/github/callback
    │
    ├─ UserService.upsertFromGithubProfile(login=stack-wuh ? root : reader)
    ├─ JwtService.sign({ sub, githubId, login, role })
    └─ redirect / set auth token for Console
    │
    ▼
packages/wuh.site.console (Vite + React SPA)
  Login → ProtectedLayout → Dashboard
    │
    ├─ Blog management       GET allowed for root/reader; writes root only
    ├─ Guestbook management  GET allowed for root/reader; writes root only
    └─ Blog comment review   GET allowed for root/reader; writes root only
```

核心边界：

1. **认证由 NestJS 负责**：Console 不直接持有 GitHub client secret，只负责跳转登录、读取当前用户、携带 JWT/Cookie 调用 API。
2. **权限由 NestJS 强制**：前端按角色隐藏/禁用写按钮，但所有写接口必须通过 `RootGuard` 或等价 decorator/guard 拦截。
3. **Root 固定为 login**：`stack-wuh` 是唯一 root。非 `stack-wuh` 用户即使数据库中已有 `root` / `writer` 字段，也必须在登录或权限计算时降级为 `reader`。
4. **后台 API 独立命名空间**：新增或扩展 `/v2/admin/**`，避免影响公开 `/v2/content/**`、`/v2/comments/**`。
5. **后台读取复用现有服务**：博客复用 `ContentService.findAll/findBySlugOrNumber/updateMetadata`；评论/留言复用 `CommentService.findAll/create/approve` 能力，并补齐后台列表、状态操作与删除/拒绝/重试等缺口。

推荐实现分层：

- `auth`：GitHub OAuth strategy/controller/service、JWT strategy、`JwtAuthGuard`、`CurrentUser` decorator。
- `user`：新增 `upsertGithubUser()` 与 `resolveRoleByLogin()`，固定 `stack-wuh` root。
- `admin`：后台 API facade，聚合 content/comment/user 能力；GET 使用 `JwtAuthGuard`，写操作叠加 `RootGuard`。
- `shared-contracts`：新增后台用户、权限、资源摘要、管理操作响应等 DTO 类型。
- `console`：Vite SPA，包含登录页、受保护布局、API client、权限 hook、博客/留言/评论管理页面。

| 维度 | 选择 | 理由 |
|------|------|------|
| Console 框架 | Vite + React 19 + TypeScript | 保持 React 技术栈，适合后台 SPA，不引入 Next.js SSR/ISR 复杂度 |
| Console 路由 | React Router | 管理后台页面路由清晰，生态稳定，学习成本低 |
| Console 数据请求 | TanStack Query 或轻量 fetch client（实现时优先评估依赖成本） | 后台列表/详情/操作需要缓存、刷新、loading/error 状态；若不想加依赖可先封装 fetch client |
| Console 样式 | styled-components + CSS 变量主题令牌，复用组件库 | 与现有主站和 `@wuh.site/components` 保持一致 |
| 认证协议 | GitHub OAuth + NestJS JWT | GitHub 负责身份，NestJS 负责应用会话和权限 claim |
| Token 存储 | 优先 HttpOnly Cookie；如实现受限，可短期 Bearer token + localStorage 并记录风险 | Cookie 更安全；SPA/CORS 部署需要配置 `credentials: true` 与 SameSite/Secure |
| 后端权限 | `JwtAuthGuard` + `RootGuard` + decorator | 服务端强制 root/reader 边界，避免只靠前端控制 |
| Root 判定 | GitHub login 精确匹配 `stack-wuh` | 用户明确要求唯一账号，避免 ROOT_GITHUB_IDS 配置漂移 |
| API 命名空间 | `/v2/auth/**`, `/v2/admin/**` | 现有全局前缀为 `/v2`，后台资源与公开 API 隔离 |

## 任务
### Phase 1: 后端认证与权限基础
- [x] **文件:** `packages/shared-contracts/src/admin.dto.ts`, `packages/shared-contracts/src/index.ts`, `packages/wuh.site.nest/src/modules/user/user.service.ts`, `packages/wuh.site.nest/src/modules/user/schemas/user.schema.ts`
- [x] 新增后台用户、权限、认证响应、操作响应共享 DTO。
- [x] 增加 `resolveRoleByLogin(login)`，固定 `stack-wuh => root`，其他用户 => `reader`。
- [x] 调整用户创建/更新流程，防止非 `stack-wuh` 因数据库旧值或请求参数获得 `root/writer`。
- [x] **预计耗时:** 1.5h
- [x] **验证:** 已有 user service 单测覆盖角色固定与旧角色降级。
- [x] **文件:** `packages/wuh.site.nest/src/modules/auth/**`, `packages/wuh.site.nest/src/modules/user/user.module.ts`, `packages/wuh.site.nest/src/app.module.ts`
- [x] 新增 `AuthController`、`AuthService`、GitHub OAuth callback、JWT 签发/清理、`GET /v2/auth/me`。
- [x] 实现 `JwtAuthGuard`、JWT token 校验，并提供 `CurrentUser` decorator。
- [x] 配置需要的环境变量：`GITHUB_OAUTH_CLIENT_ID`、`GITHUB_OAUTH_CLIENT_SECRET`、`GITHUB_OAUTH_CALLBACK_URL`、`CONSOLE_URL`、`JWT_SECRET`。
- [x] **预计耗时:** 2h
- [x] **验证:** auth service/controller 单测已覆盖 OAuth state、root/reader 登录及 token 校验。
- [x] **文件:** `packages/wuh.site.nest/src/modules/auth/**`, `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`
- [x] 新增 `RootGuard`，仅允许 `stack-wuh` 通过。
- [x] 为后台 GET 接口使用认证 guard，为 PATCH/POST/DELETE 管理动作叠加 root guard。
- [x] reader 调用写接口时由服务端拒绝。
- [x] **预计耗时:** 1h
- [x] **验证:** guard 单测覆盖 stale root claim、reader 拒绝和 root 允许路径。
### Phase 2: 后台管理 API
- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/admin/admin.module.ts`, `packages/wuh.site.nest/src/modules/content/content.service.ts`, `packages/wuh.site.nest/src/modules/content/dto/content.dto.ts`
- [x] 新增 `/v2/admin/content/posts` 列表和 `/v2/admin/content/posts/:number` 详情。
- [x] 提供 `/v2/admin/content/posts/:number/metadata` 并加 root guard。
- [x] 提供 root-only 单篇同步入口，并保持为同步模块后续接入点。
- [x] **预计耗时:** 2h
- [x] **验证:** admin controller 单测已覆盖列表、详情和管理接口依赖注入。
- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.service.ts`, `packages/wuh.site.nest/src/modules/comment/dto/comment.dto.ts`, `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
- [x] 以 `repo: 'guestbook'` 作为留言板数据筛选规则。
- [x] 新增 `/v2/admin/guestbook/comments` 只读列表接口。
- [x] 新增 root-only 状态更新与删除能力。
- [x] **预计耗时:** 2h
- [x] **验证:** admin controller 已覆盖留言板查询和 root-only 管理路由。
- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.controller.ts`, `packages/wuh.site.nest/src/modules/comment/comment.service.ts`, `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
- [x] 新增 `/v2/admin/post-comments` 列表，支持 `issueNumber` 和状态筛选。
- [x] 将 approve 能力纳入 root-only 后台接口，保留已有重复审批拦截。
- [x] 补齐 reject、retry-sync、delete 管理动作。
- [x] **预计耗时:** 2h
- [x] **验证:** admin controller 已覆盖评论管理路由和 root guard 配置。
- [x] **文件:** `packages/wuh.site.nest/src/modules/admin/admin.controller.ts`, `packages/wuh.site.nest/src/modules/admin/admin.module.ts`, `packages/wuh.site.nest/src/modules/user/user.service.ts`
- [x] 新增 `/v2/admin/overview` 统计博客、留言、待处理评论数量。
- [x] 新增 `/v2/admin/users` 只读用户列表，展示 GitHub login、头像、角色、最后登录时间。
- [x] **预计耗时:** 1.5h
- [x] **验证:** admin controller 单测已覆盖 overview/users 的角色映射。
### Phase 3: Console 前端应用
- [x] **文件:** `packages/wuh.site.console/package.json`, `packages/wuh.site.console/index.html`, `packages/wuh.site.console/src/**`, `packages/wuh.site.console/tsconfig.json`, `packages/wuh.site.console/vite.config.ts`, `package.json`
- [x] 新增 Vite + React 19 + TypeScript 应用结构。
- [x] 增加 `dev:console`、`build:console`、`preview:console` root scripts。
- [x] 配置 `VITE_API_BASE_URL`、组件库 workspace 依赖与 styled-components 基础样式。
- [x] **预计耗时:** 1.5h
- [x] **验证:** package 和 root scripts 已存在；本次构建尝试受本机 Vite SIGSEGV 阻断，未将构建标记为通过。
- [x] **文件:** `packages/wuh.site.console/src/api/**`, `packages/wuh.site.console/src/auth/**`, `packages/wuh.site.console/src/routes/**`, `packages/wuh.site.console/src/components/AdminShell.tsx`, `packages/wuh.site.console/src/components/PermissionGate.tsx`
- [x] 实现 API client、AuthProvider、RequireAuth、GitHub 登录跳转、logout、权限判断。
- [x] 实现 AdminShell 导航和当前用户显示。
- [x] reader 登录时展示只读提示，写操作统一隐藏或禁用。
- [x] **预计耗时:** 2h
- [x] **验证:** 源码结构与权限组件已核对。
- [x] **文件:** `packages/wuh.site.console/src/pages/content/**`, `packages/wuh.site.console/src/components/DataTable.tsx`, `packages/wuh.site.console/src/components/StatusBadge.tsx`
- [x] 实现博客列表、筛选、分页、详情页面。
- [x] root 可见 metadata 编辑/同步操作；reader 不可写。
- [x] **预计耗时:** 2h
- [x] **验证:** 页面、表格和状态组件已核对；构建验证受本机 Vite SIGSEGV 阻断。
- [x] **文件:** `packages/wuh.site.console/src/pages/guestbook/**`, `packages/wuh.site.console/src/pages/comments/**`, `packages/wuh.site.console/src/components/**`
- [x] 实现留言板列表/详情/状态操作 UI。
- [x] 实现博客评论审核列表、通过/拒绝/重试/删除 UI。
- [x] reader 只读，root 可见并可触发管理动作。
- [x] **预计耗时:** 2h
- [x] **验证:** 页面与权限门控源码已核对；构建验证受本机 Vite SIGSEGV 阻断。
- [x] **文件:** `packages/wuh.site.console/src/pages/dashboard/**`, `packages/wuh.site.console/src/pages/users/**`
- [x] 实现后台概览统计卡片。
- [x] 实现用户列表只读页面。
- [x] **预计耗时:** 1h
- [x] **验证:** 页面源码已核对；构建验证受本机 Vite SIGSEGV 阻断。
### Phase 4: 集成配置与文档
- [x] **文件:** `.env.example`, `README.md`, `packages/wuh.site.console/README.md`, `scripts/dev.sh`
- [x] 记录 GitHub OAuth、JWT、Console URL、API Base URL、CORS 的环境变量。
- [x] 更新本地开发脚本以同时启动 Nest、主站和 Console。
- [x] **预计耗时:** 1h
- [x] **验证:** 根 README、Console README、`.env.example` 和开发脚本已核对。
- [x] **文件:** `packages/wuh.site.nest/**`, `packages/wuh.site.console/**`, `packages/shared-contracts/**`
- [x] 运行后端相关单测、Console 构建、全仓类型检查。
- [x] 核对 root/reader 权限路径：`stack-wuh` root、非 `stack-wuh` reader、reader 写接口拒绝。
- [x] **预计耗时:** 1.5h
- [x] **验证:** 代码与测试已核对；OpenSpec 变更校验、Console 构建及全仓 TypeScript 检查已在 Node 20.20.2 下通过。Nest 全量测试仍在多个 Console 相关 suite 中发生 Jest 进程 SIGSEGV，未标记为通过。
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

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
# ================================================================
# Agent Loop workflow-control state
# Schema: agent-loop/v1
# This file coordinates the fixed OpenSpec artifacts; it does not replace them.
# proposal.md, design.md, tasks.md and specs/<domain>/spec.md remain required.
# ================================================================
schema: agent-loop/v1

change:
  id: 2026-07-19-P-admin-console
  title: 独立后台 Console 与 GitHub 认证只读权限
  type: feature
  status: archived
  createdAt: 2026-07-19T07:45:47Z
  issue: https://github.com/stack-wuh/x.wuh.site/issues/227

artifacts:
  proposal:
    path: openspec/changes/archive/2026-07-19-P-admin-console/proposal.md
    status: completed
    summary: 新增独立后台 Console，使用 GitHub 登录；stack-wuh 为唯一 root，其他用户自动 reader；覆盖博客、留言板、博客评论后台管理。
    template:
      id: proposal
      source: skills/shadow-dev-propose/templates/proposal.md
      contractVersion: 1
      digest: sha256:426c31b60cb50e7457a6e4aa6f86c9bd6718cdd6217f292d98f1b9739ad612fd
    validation:
      status: passed
      checkedAt: 2026-07-19T07:45:47Z
      missingHeadings: []
      invalidPatterns: []
  design:
    path: openspec/changes/archive/2026-07-19-P-admin-console/design.md
    status: completed
    summary: 采用 Vite + React SPA 独立 Console，NestJS 提供 GitHub OAuth、JWT/Cookie 会话、root/reader Guard 与 /v2/admin 后台 API。
    template:
      id: design
      source: skills/shadow-dev-propose/templates/design.md
      contractVersion: 1
      digest: sha256:2483c466de2ab4e8e34a1e147e098a6cef61ff6b5a69d567f565987fdd77b3e4
    validation:
      status: passed
      checkedAt: 2026-07-19T07:58:42Z
      missingHeadings: []
      invalidPatterns: []
  tasks:
    path: openspec/changes/archive/2026-07-19-P-admin-console/tasks.md
    status: completed
    summary: 14 个任务，覆盖后端认证权限、后台管理 API、Vite React Console、集成配置与全量验证。
    template:
      id: tasks
      source: skills/shadow-dev-propose/templates/tasks.md
      contractVersion: 1
      digest: sha256:d67578bdb054f235acd942e8cf1bb436abbd6831ff52469e30b82c9c845d37f9
    validation:
      status: passed
      checkedAt: 2026-07-19T07:58:42Z
      missingHeadings: []
      invalidPatterns: []
  specs:
    status: completed
    entries:
      - path: openspec/changes/archive/2026-07-19-P-admin-console/specs/admin-console/spec.md
        template:
          id: spec
          source: skills/shadow-dev-propose/templates/spec.md
          contractVersion: 1
          digest: sha256:322bb9b2a379e72fa08f5ce84fbee689fddac788245ebf2c4d01153947072ea5
        validation:
          status: passed
          checkedAt: 2026-07-19T07:45:47Z
          missingHeadings: []
          invalidPatterns: []

proposal:
  status: completed
  source:
    type: manual
    issueNumber: 227
  intent: 新增 monorepo 独立后台 Console，复用 GitHub 认证并以 stack-wuh 为唯一 root，其他 GitHub 登录用户自动 reader，只读查看博客、留言板、博客评论等后台数据。
  background: 现有 NestJS 已有内容、留言、评论等模块，但缺少统一后台操作入口和严格的 root/reader 权限边界。
  goals:
    - 新增独立 Console 前端 package。
    - 完成 GitHub OAuth 登录、自动注册与当前用户权限读取。
    - 固定 stack-wuh 为唯一 root，其他用户自动 reader。
    - 覆盖博客、留言板、博客评论等后台读取和 root 写操作。
    - 服务端强制权限校验，reader 不可执行任何写操作。
  nonGoals:
    - 不实现任意用户角色分配、邀请制、组织权限或多管理员配置。
    - 不替换 GitHub Issues CMS 数据来源。
    - 不改变公开主站展示逻辑。
    - 不把后台放入现有主站 /admin 路由。
  scope:
    packages:
      - packages/wuh.site.console
      - packages/wuh.site.nest
      - packages/shared-contracts
    files:
      - packages/wuh.site.nest/src/modules/auth
      - packages/wuh.site.nest/src/modules/user
      - packages/wuh.site.nest/src/modules/admin
      - packages/wuh.site.nest/src/modules/content
      - packages/wuh.site.nest/src/modules/comment
      - packages/wuh.site.console
      - packages/shared-contracts
  acceptanceCriteria:
    - Console 作为独立 package 可开发、构建并访问登录页。
    - GitHub 登录后 stack-wuh 显示 root 权限，非 stack-wuh 自动显示 reader 权限。
    - reader 可查看后台资源列表和详情，但所有写 API 返回权限不足。
    - root 可执行博客、留言板、博客评论相关管理写操作。
    - 新增后台 API 有 Swagger 标注，并保持统一分页和错误格式。
  constraints:
    - Root 账号固定为 GitHub login stack-wuh。
    - 非 stack-wuh 用户不得通过数据库角色、客户端参数或接口更新提升权限。
    - 后台写操作必须在 NestJS 服务端 Guard 或等价机制强制校验。
    - 复用现有 content-api 分页规范与 api-standardization 错误规范。
    - 博客评论管理需保留现有审核后同步 GitHub Issue 与重复审批拦截语义。
  risks:
    - GitHub OAuth 回调 URL、client id/secret、JWT secret 等环境变量需要部署配置。
    - 后台独立 package 可能需要新增端口、Docker/CI/CD 配置。
    - 现有 comment 模块可能同时承载留言板与博客评论，需要 discuss 阶段进一步拆清 API 边界。
    - 若现有 UserRole 包含 writer，需确保本需求下 writer 不参与权限提升。
  domain:
    name: admin-console
    keywords:
      - 后台
      - Console
      - GitHub OAuth
      - 权限
      - root
      - reader
      - 博客管理
      - 留言板
      - 评论审核
    description: 独立后台 Console、GitHub 登录与固定 root/reader 权限控制。

discuss:
  status: completed
  decisions:
    - id: console-framework
      question: Console 前端框架选择
      options:
        - Vite + React SPA
        - React Admin/Refine 后台框架
        - Vue 3 + Vite 后台技术栈
      selected: Vite + React SPA
      rationale: 用户确认保持 React 技术栈；后台不需要 Next.js SSR/ISR，Vite SPA 更轻、更适合管理工作台。
    - id: permission-model
      question: 后台权限模型
      options:
        - stack-wuh root，其他用户自动 reader
        - 支持 root 分配多角色
        - 邀请制访问
      selected: stack-wuh root，其他用户自动 reader
      rationale: 用户明确要求其他用户全部为 Read，暂不实现权限分配系统。
    - id: api-boundary
      question: 后台 API 边界
      options:
        - 新增 /v2/admin/** facade
        - Console 直接调用公开 API
        - 将后台路由放进主站 /admin
      selected: 新增 /v2/admin/** facade
      rationale: 可隔离公开 API 与后台管理动作，并在服务端集中强制权限。
  architecture:
    summary: 独立 Vite React Console 调用 NestJS /v2/auth 与 /v2/admin API；NestJS 负责 GitHub OAuth、JWT/Cookie、User 自动注册、JwtAuthGuard 和 RootGuard；后台 API 聚合 content/comment/user 服务。
    modules:
      - packages/wuh.site.console: Vite React SPA，登录、布局、权限 UI、博客/留言/评论/用户/概览页面。
      - packages/wuh.site.nest/src/modules/auth: GitHub OAuth、JWT、CurrentUser、JwtAuthGuard、RootGuard。
      - packages/wuh.site.nest/src/modules/user: GitHub 用户 upsert 与 stack-wuh 固定 root 权限计算。
      - packages/wuh.site.nest/src/modules/admin: /v2/admin 后台 facade，统一读写权限边界。
      - packages/shared-contracts: 后台 DTO 与角色/权限类型。
  contracts:
    api:
      - GET /v2/auth/github
      - GET /v2/auth/github/callback
      - POST /v2/auth/logout
      - GET /v2/auth/me
      - GET /v2/admin/overview
      - GET /v2/admin/users
      - GET /v2/admin/content/posts
      - GET /v2/admin/content/posts/:number
      - PATCH /v2/admin/content/posts/:number/metadata
      - POST /v2/admin/content/posts/:number/sync
      - GET /v2/admin/guestbook/comments
      - PATCH /v2/admin/guestbook/comments/:id/status
      - DELETE /v2/admin/guestbook/comments/:id
      - GET /v2/admin/post-comments
      - POST /v2/admin/post-comments/:id/approve
      - POST /v2/admin/post-comments/:id/reject
      - POST /v2/admin/post-comments/:id/retry-sync
      - DELETE /v2/admin/post-comments/:id
    data:
      - AdminRole root | reader
      - AdminPermission admin/content/guestbook/comment read/write
      - AdminUserDto
      - AdminAuthResponseDto
      - AdminOperationResultDto
  reuse:
    components:
      - Button from @wuh.site/components/button
      - Card from @wuh.site/components/card
      - Flex/Row/Column from @wuh.site/components/flex
      - Empty/Skeleton/Result/Tag/Dialog/Message from @wuh.site/components
    newComponents:
      - packages/wuh.site.console/src/components/AdminShell.tsx
      - packages/wuh.site.console/src/components/PermissionGate.tsx
      - packages/wuh.site.console/src/components/DataTable.tsx
      - packages/wuh.site.console/src/components/StatusBadge.tsx
  implementationNotes:
    - 已读 packages/wuh.site.nest/src/modules/auth/auth.module.ts：当前仅注册 PassportModule/JwtModule，无 controller/service/strategy。
    - 已读 packages/wuh.site.nest/src/modules/user/user.service.ts：已有 createOrUpdate/updateRole/isRootUser，但 root 判定基于 ROOT_GITHUB_IDS；需改为 login=stack-wuh 固定计算。
    - 已读 packages/wuh.site.nest/src/modules/admin/admin.controller.ts：当前只有 PATCH admin/content/:id/metadata，且未加 guard。
    - 已读 packages/wuh.site.nest/src/modules/content/content.controller.ts 和 content.service.ts：公开博客列表/详情/metadata 更新能力可复用。
    - 已读 packages/wuh.site.nest/src/modules/comment/comment.controller.ts 和 comment.service.ts：已有评论列表、匿名创建、approve 能力；后台需补齐 reader/root 权限与拒绝/删除/重试等动作。
    - 已读 package.json、pnpm-workspace.yaml、packages/wuh.site.next/package.json、packages/wuh.site.nest/package.json、packages/shared-contracts/src/index.ts：monorepo 可新增 packages/wuh.site.console。
  impact:
    dependencies:
      - Console: vite, @vitejs/plugin-react, react-router-dom，可选 @tanstack/react-query。
      - Nest: GitHub OAuth 可选择 passport-github2 或手写 token exchange；实现时优先依赖最小化。
    compatibility: 新增 /v2/auth/** 和 /v2/admin/**；公开 /v2/content/**、/v2/comments/** 与主站展示不做破坏性修改。
    rollback: Console package 可独立下线；后端新增后台路由不影响公开站点，如 OAuth 异常可临时关闭 Console 部署。

apply:
  status: ready
  generatedFrom:
    - proposal
    - discuss
  instructions:
    - 严格按 TDD 执行后端服务、guard、controller 的权限行为。
    - reader/root 权限必须以后端校验为准，前端只做展示辅助。
    - 新增 Console 使用 Vite + React SPA，不使用 Next.js。
  workflow:
    - id: backend-contracts-user-role
      title: 后端权限契约与用户角色固定
      status: pending
      dependsOn: []
      files:
        - packages/shared-contracts/src/admin.dto.ts
        - packages/shared-contracts/src/index.ts
        - packages/wuh.site.nest/src/modules/user/user.service.ts
        - packages/wuh.site.nest/src/modules/user/schemas/user.schema.ts
      instructions:
        - 新增后台用户、权限、认证响应、操作响应共享 DTO。
        - 固定 stack-wuh 为 root，其他 login 为 reader。
        - 防止非 stack-wuh 因旧数据库角色或请求参数提升权限。
      verification:
        - pnpm --filter @wuh.site/nest test -- user
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: backend-auth-oauth-me
      title: GitHub OAuth 与当前用户接口
      status: pending
      dependsOn:
        - backend-contracts-user-role
      files:
        - packages/wuh.site.nest/src/modules/auth/**
        - packages/wuh.site.nest/src/modules/user/user.module.ts
        - packages/wuh.site.nest/src/app.module.ts
      instructions:
        - 新增 AuthController/AuthService/GitHub OAuth callback/JWT 签发或 Cookie 会话。
        - 实现 GET /v2/auth/me 与 logout。
        - 声明 GitHub OAuth 与 Console 环境变量。
      verification:
        - pnpm --filter @wuh.site/nest test -- auth
        - pnpm exec tsc --noEmit
      requiredInputs:
        - key: GITHUB_OAUTH_CLIENT_ID
          description: 本地/生产 GitHub OAuth App Client ID，用于真实登录验证；可先以测试 mock 覆盖单测。
          supplied: false
        - key: GITHUB_OAUTH_CLIENT_SECRET
          description: GitHub OAuth App Client Secret，仅用于真实登录验证；实现代码不得硬编码。
          supplied: false
        - key: GITHUB_OAUTH_CALLBACK_URL
          description: GitHub OAuth callback URL，例如 http://localhost:3200/v2/auth/github/callback。
          supplied: false
        - key: CONSOLE_URL
          description: OAuth 登录完成后的 Console 跳转地址，例如 http://localhost:3300。
          supplied: false
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: backend-root-guard
      title: RootGuard 与后台写权限拦截
      status: pending
      dependsOn:
        - backend-auth-oauth-me
      files:
        - packages/wuh.site.nest/src/modules/auth/guards/**
        - packages/wuh.site.nest/src/modules/auth/decorators/**
        - packages/wuh.site.nest/src/modules/admin/admin.controller.ts
      instructions:
        - 新增 RootGuard，仅允许 role=root。
        - 后台 GET 使用认证 guard，后台写接口叠加 root guard。
        - reader 写操作返回统一 403。
      verification:
        - pnpm --filter @wuh.site/nest test -- admin
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: admin-content-api
      title: 博客后台管理 API
      status: pending
      dependsOn:
        - backend-root-guard
      files:
        - packages/wuh.site.nest/src/modules/admin/admin.controller.ts
        - packages/wuh.site.nest/src/modules/admin/admin.module.ts
        - packages/wuh.site.nest/src/modules/content/content.service.ts
        - packages/wuh.site.nest/src/modules/content/dto/content.dto.ts
      instructions:
        - 新增后台博客列表/详情/metadata 更新 API。
        - root-only 写操作；reader GET 允许。
        - 评估 sync 模块是否支持单篇同步，不支持则保留后续入口说明。
      verification:
        - pnpm --filter @wuh.site/nest test -- admin
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: admin-guestbook-api
      title: 留言板后台管理 API
      status: pending
      dependsOn:
        - backend-root-guard
      files:
        - packages/wuh.site.nest/src/modules/admin/admin.controller.ts
        - packages/wuh.site.nest/src/modules/comment/comment.service.ts
        - packages/wuh.site.nest/src/modules/comment/dto/comment.dto.ts
        - packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts
      instructions:
        - 明确留言板筛选规则并新增后台只读列表/详情。
        - 补齐 root-only 状态更新和删除/软删除能力。
      verification:
        - pnpm --filter @wuh.site/nest test -- comment
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: admin-post-comments-api
      title: 博客评论审核后台 API
      status: pending
      dependsOn:
        - backend-root-guard
      files:
        - packages/wuh.site.nest/src/modules/admin/admin.controller.ts
        - packages/wuh.site.nest/src/modules/comment/comment.controller.ts
        - packages/wuh.site.nest/src/modules/comment/comment.service.ts
        - packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts
      instructions:
        - 新增博客评论审核列表与 issueNumber/status/sync 筛选。
        - 将 approve 纳入 root-only 后台接口，保留重复审批拦截。
        - 补齐 reject、retry-sync、delete/soft-delete。
      verification:
        - pnpm --filter @wuh.site/nest test -- comment
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: admin-overview-users-api
      title: 后台概览与用户只读 API
      status: pending
      dependsOn:
        - backend-root-guard
      files:
        - packages/wuh.site.nest/src/modules/admin/admin.controller.ts
        - packages/wuh.site.nest/src/modules/admin/admin.module.ts
        - packages/wuh.site.nest/src/modules/user/user.service.ts
      instructions:
        - 新增 /v2/admin/overview 统计。
        - 新增 /v2/admin/users 只读列表。
      verification:
        - pnpm --filter @wuh.site/nest test -- admin
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: console-vite-scaffold
      title: 创建 Vite React Console package
      status: pending
      dependsOn: []
      files:
        - packages/wuh.site.console/package.json
        - packages/wuh.site.console/index.html
        - packages/wuh.site.console/src/**
        - packages/wuh.site.console/tsconfig.json
        - packages/wuh.site.console/vite.config.ts
        - package.json
      instructions:
        - 新增 Vite + React 19 + TypeScript 应用结构。
        - 增加 dev:console/build:console/preview:console 脚本。
        - 配置 VITE_API_BASE_URL、组件库依赖与基础样式。
      verification:
        - pnpm --filter @wuh.site/console build
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: console-auth-shell
      title: Console 认证与权限框架
      status: pending
      dependsOn:
        - console-vite-scaffold
        - backend-auth-oauth-me
      files:
        - packages/wuh.site.console/src/api/**
        - packages/wuh.site.console/src/auth/**
        - packages/wuh.site.console/src/routes/**
        - packages/wuh.site.console/src/components/AdminShell.tsx
        - packages/wuh.site.console/src/components/PermissionGate.tsx
      instructions:
        - 实现 API client、AuthProvider、RequireAuth、GitHub 登录跳转、logout、权限判断。
        - 实现 AdminShell 导航和当前用户显示。
        - reader 显示只读提示，写操作统一隐藏或禁用。
      verification:
        - pnpm --filter @wuh.site/console build
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: console-content-pages
      title: Console 博客管理页面
      status: pending
      dependsOn:
        - console-auth-shell
        - admin-content-api
      files:
        - packages/wuh.site.console/src/pages/content/**
        - packages/wuh.site.console/src/components/DataTable.tsx
        - packages/wuh.site.console/src/components/StatusBadge.tsx
      instructions:
        - 实现博客列表、筛选、分页、详情页面。
        - root 可见 metadata 编辑/同步；reader 不可写。
      verification:
        - pnpm --filter @wuh.site/console build
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: console-guestbook-comments-pages
      title: Console 留言板与评论管理页面
      status: pending
      dependsOn:
        - console-auth-shell
        - admin-guestbook-api
        - admin-post-comments-api
      files:
        - packages/wuh.site.console/src/pages/guestbook/**
        - packages/wuh.site.console/src/pages/comments/**
        - packages/wuh.site.console/src/components/**
      instructions:
        - 实现留言板列表/详情/状态操作 UI。
        - 实现博客评论审核列表，通过/拒绝/重试/删除 UI。
        - reader 只读，root 可见管理动作。
      verification:
        - pnpm --filter @wuh.site/console build
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: console-dashboard-users-pages
      title: Console 用户与概览页面
      status: pending
      dependsOn:
        - console-auth-shell
        - admin-overview-users-api
      files:
        - packages/wuh.site.console/src/pages/dashboard/**
        - packages/wuh.site.console/src/pages/users/**
      instructions:
        - 实现后台概览统计卡片。
        - 实现用户列表只读页面。
      verification:
        - pnpm --filter @wuh.site/console build
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: integration-env-docs
      title: 集成配置与环境示例
      status: pending
      dependsOn:
        - backend-auth-oauth-me
        - console-vite-scaffold
      files:
        - .env.example
        - README.md
        - packages/wuh.site.console/README.md
        - scripts/dev.sh
      instructions:
        - 记录 GitHub OAuth、JWT、Console URL、API Base URL、CORS 环境变量。
        - 更新本地开发脚本或文档以支持 Console。
      verification:
        - grep -n "GITHUB_OAUTH" .env.example README.md packages/wuh.site.console/README.md
      requiredInputs:
        - key: DEPLOYMENT_CONSOLE_HOSTING
          description: Console 生产环境托管方式或域名；可先只补本文档占位，部署阶段再确认。
          supplied: false
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
    - id: full-verification
      title: 全量验证
      status: pending
      dependsOn:
        - console-content-pages
        - console-guestbook-comments-pages
        - console-dashboard-users-pages
        - integration-env-docs
      files:
        - packages/wuh.site.nest/**
        - packages/wuh.site.console/**
        - packages/shared-contracts/**
      instructions:
        - 运行后端相关单测、Console 构建、全仓类型检查。
        - 手动验证 root/reader 权限路径。
      verification:
        - pnpm --filter @wuh.site/nest test
        - pnpm --filter @wuh.site/console build
        - pnpm exec tsc --noEmit
      requiredInputs:
        - key: REAL_GITHUB_OAUTH_TEST_ACCOUNT
          description: 若要做真实 OAuth E2E，需要一个非 stack-wuh GitHub 账号验证 reader；单元测试可先 mock。
          supplied: false
      attempts: 0
      maxAttempts: 2
      evidence: []
      failure: null
  repairWorkflow: []
  checkpoint:
    lastCompletedTaskId: null
    updatedAt: null

review:
  status: pending
  verification: []
  findings: []
  summary: null

archive:
  status: pending
  archivedAt: null
  specSync: []
  indexEntry: null
  componentScenarios: []

commit:
  status: pending
  branch: null
  commits: []
  pullRequest: null

runtime:
  phase: apply
  state: idle
  attempts: 0
  resume:
    taskId: null
    command: 开始执行
  requiredInputs: []
  failure: null
  updatedAt: 2026-07-19T07:58:42Z
```

### `design.md`
---
artifact: design
contractVersion: 1
requiredHeadings:
  - 架构
  - 技术选型
  - 复用分析
  - 影响分析
requiredPatterns:
  - '^# .+'
---

# 独立后台 Console 与 GitHub 认证只读权限设计

## 架构

本变更采用“独立 Console SPA + NestJS 后台 API”的架构：

```text
GitHub OAuth
    │
    ▼
packages/wuh.site.nest
  /v2/auth/github ──► GitHub user profile
  /v2/auth/github/callback
    │
    ├─ UserService.upsertFromGithubProfile(login=stack-wuh ? root : reader)
    ├─ JwtService.sign({ sub, githubId, login, role })
    └─ redirect / set auth token for Console
    │
    ▼
packages/wuh.site.console (Vite + React SPA)
  Login → ProtectedLayout → Dashboard
    │
    ├─ Blog management       GET allowed for root/reader; writes root only
    ├─ Guestbook management  GET allowed for root/reader; writes root only
    └─ Blog comment review   GET allowed for root/reader; writes root only
```

核心边界：

1. **认证由 NestJS 负责**：Console 不直接持有 GitHub client secret，只负责跳转登录、读取当前用户、携带 JWT/Cookie 调用 API。
2. **权限由 NestJS 强制**：前端按角色隐藏/禁用写按钮，但所有写接口必须通过 `RootGuard` 或等价 decorator/guard 拦截。
3. **Root 固定为 login**：`stack-wuh` 是唯一 root。非 `stack-wuh` 用户即使数据库中已有 `root` / `writer` 字段，也必须在登录或权限计算时降级为 `reader`。
4. **后台 API 独立命名空间**：新增或扩展 `/v2/admin/**`，避免影响公开 `/v2/content/**`、`/v2/comments/**`。
5. **后台读取复用现有服务**：博客复用 `ContentService.findAll/findBySlugOrNumber/updateMetadata`；评论/留言复用 `CommentService.findAll/create/approve` 能力，并补齐后台列表、状态操作与删除/拒绝/重试等缺口。

推荐实现分层：

- `auth`：GitHub OAuth strategy/controller/service、JWT strategy、`JwtAuthGuard`、`CurrentUser` decorator。
- `user`：新增 `upsertGithubUser()` 与 `resolveRoleByLogin()`，固定 `stack-wuh` root。
- `admin`：后台 API facade，聚合 content/comment/user 能力；GET 使用 `JwtAuthGuard`，写操作叠加 `RootGuard`。
- `shared-contracts`：新增后台用户、权限、资源摘要、管理操作响应等 DTO 类型。
- `console`：Vite SPA，包含登录页、受保护布局、API client、权限 hook、博客/留言/评论管理页面。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Console 框架 | Vite + React 19 + TypeScript | 保持 React 技术栈，适合后台 SPA，不引入 Next.js SSR/ISR 复杂度 |
| Console 路由 | React Router | 管理后台页面路由清晰，生态稳定，学习成本低 |
| Console 数据请求 | TanStack Query 或轻量 fetch client（实现时优先评估依赖成本） | 后台列表/详情/操作需要缓存、刷新、loading/error 状态；若不想加依赖可先封装 fetch client |
| Console 样式 | styled-components + CSS 变量主题令牌，复用组件库 | 与现有主站和 `@wuh.site/components` 保持一致 |
| 认证协议 | GitHub OAuth + NestJS JWT | GitHub 负责身份，NestJS 负责应用会话和权限 claim |
| Token 存储 | 优先 HttpOnly Cookie；如实现受限，可短期 Bearer token + localStorage 并记录风险 | Cookie 更安全；SPA/CORS 部署需要配置 `credentials: true` 与 SameSite/Secure |
| 后端权限 | `JwtAuthGuard` + `RootGuard` + decorator | 服务端强制 root/reader 边界，避免只靠前端控制 |
| Root 判定 | GitHub login 精确匹配 `stack-wuh` | 用户明确要求唯一账号，避免 ROOT_GITHUB_IDS 配置漂移 |
| API 命名空间 | `/v2/auth/**`, `/v2/admin/**` | 现有全局前缀为 `/v2`，后台资源与公开 API 隔离 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Button | `@wuh.site/components/button` | 复用 | 现有主站按钮使用场景 |
| Card | `@wuh.site/components/card` | 复用 | 现有内容卡片场景 |
| Flex/Row/Column | `@wuh.site/components/flex` | 复用 | 现有布局场景 |
| Empty / Skeleton / Result | `@wuh.site/components/empty`, `@wuh.site/components/skeleton`, `@wuh.site/components/result` | 复用 | 列表空态、加载态、错误态 |
| Tag | `@wuh.site/components/tag` | 复用 | 标签/状态展示 |
| Dialog / Message | `@wuh.site/components/dialog`, `@wuh.site/components/message` | 扩展/复用 | 确认操作和反馈提示 |
| AdminShell | `packages/wuh.site.console/src/components/AdminShell.tsx` | 新建 | 后台侧边栏、顶部用户、内容区 |
| PermissionGate | `packages/wuh.site.console/src/components/PermissionGate.tsx` | 新建 | root/reader 操作显隐与禁用说明 |
| DataTable | `packages/wuh.site.console/src/components/DataTable.tsx` | 新建 | 后台列表表格，组件库暂无表格组件 |
| StatusBadge | `packages/wuh.site.console/src/components/StatusBadge.tsx` | 新建 | 评论/留言/同步状态展示 |

**说明：**
- Console 优先复用现有组件库，缺少的后台特定组件放在 `packages/wuh.site.console/src/components`，不急于沉淀到通用组件库。
- 若实现中发现 DataTable、PermissionGate 可跨项目复用，再单独提组件库增强需求。

## 数据模型（如涉及）

共享契约建议新增到 `packages/shared-contracts/src/admin.dto.ts` 并从 `index.ts` 导出：

```ts
export enum AdminRole {
  ROOT = 'root',
  READER = 'reader',
}

export interface AdminUserDto {
  githubId: number
  login: string
  email?: string
  avatarUrl?: string
  profileUrl?: string
  role: AdminRole
  permissions: AdminPermission[]
  lastLoginAt?: string
}

export type AdminPermission =
  | 'admin:read'
  | 'admin:write'
  | 'content:read'
  | 'content:write'
  | 'guestbook:read'
  | 'guestbook:write'
  | 'comment:read'
  | 'comment:write'

export interface AdminAuthResponseDto {
  user: AdminUserDto
  accessToken?: string
}

export interface AdminOperationResultDto {
  ok: boolean
  message?: string
}
```

后端 `UserRole.WRITER` 可保留以兼容历史 schema，但本需求下权限计算只输出 `root | reader`：

```ts
function resolveRoleByLogin(login: string): UserRole.ROOT | UserRole.READER {
  return login === 'stack-wuh' ? UserRole.ROOT : UserRole.READER
}
```

## API 设计（如涉及）

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/v2/auth/github` | public | 跳转 GitHub OAuth |
| GET | `/v2/auth/github/callback` | public | OAuth 回调，创建/更新用户并发放会话 |
| POST | `/v2/auth/logout` | authenticated | 清除 Console 会话 |
| GET | `/v2/auth/me` | authenticated | 返回当前用户、角色和权限 |
| GET | `/v2/admin/overview` | reader/root | 后台仪表盘统计 |
| GET | `/v2/admin/users` | reader/root | 查看登录过的用户列表，全部只读 |
| GET | `/v2/admin/content/posts` | reader/root | 后台博客列表，支持分页/状态/标签/关键词筛选 |
| GET | `/v2/admin/content/posts/:number` | reader/root | 后台博客详情 |
| PATCH | `/v2/admin/content/posts/:number/metadata` | root | 更新博客 metadata |
| POST | `/v2/admin/content/posts/:number/sync` | root | 触发单篇博客同步或刷新（如现有 sync 模块支持） |
| GET | `/v2/admin/guestbook/comments` | reader/root | 留言板消息列表，按 `page` 或留言类型筛选 |
| PATCH | `/v2/admin/guestbook/comments/:id/status` | root | 更新留言处理状态，如隐藏/恢复/拒绝 |
| DELETE | `/v2/admin/guestbook/comments/:id` | root | 删除或软删除留言 |
| GET | `/v2/admin/post-comments` | reader/root | 博客评论审核列表，支持 issueNumber/status 筛选 |
| POST | `/v2/admin/post-comments/:id/approve` | root | 通过评论并同步到 GitHub Issue，复用重复审批拦截 |
| POST | `/v2/admin/post-comments/:id/reject` | root | 拒绝评论 |
| POST | `/v2/admin/post-comments/:id/retry-sync` | root | 重试同步失败评论 |
| DELETE | `/v2/admin/post-comments/:id` | root | 删除或软删除评论 |

**请求示例:**

```json
{
  "cover": "https://cdn.wuh.site/example.jpg",
  "coverAlt": "博客封面",
  "summary": "摘要",
  "rssExcluded": false
}
```

**响应示例:**

```json
{
  "user": {
    "githubId": 123,
    "login": "stack-wuh",
    "avatarUrl": "https://avatars.githubusercontent.com/u/123?v=4",
    "role": "root",
    "permissions": ["admin:read", "admin:write", "content:read", "content:write"]
  }
}
```

## 组件/模块设计

### AuthController / AuthService

职责：
- 提供 GitHub OAuth 入口和 callback。
- 使用 GitHub profile 创建/更新用户。
- 生成 JWT 或设置 HttpOnly Cookie。
- 提供 `/auth/me` 返回当前用户和权限。

### JwtAuthGuard / RootGuard / CurrentUser

职责：
- `JwtAuthGuard` 验证访问令牌并挂载当前用户。
- `RootGuard` 只允许 `role === root`。
- `CurrentUser` decorator 简化 controller 获取用户。

### AdminController / AdminService

职责：
- 统一暴露 `/admin/**` 后台接口。
- 对读取接口使用 authenticated guard。
- 对写接口叠加 root guard。
- 聚合 ContentService、CommentService、UserService，避免 Console 直接调用公开 API 完成管理动作。

### Console App

页面结构：
- `/login`：GitHub 登录入口。
- `/` 或 `/dashboard`：统计概览。
- `/content/posts`：博客列表。
- `/content/posts/:number`：博客详情与 metadata 表单。
- `/guestbook`：留言板管理。
- `/comments`：博客评论审核管理。
- `/users`：用户列表只读。

核心模块：
- `src/api/client.ts`：统一 baseUrl、credentials、错误解析。
- `src/auth/AuthProvider.tsx`：加载 `/auth/me`、维护当前用户、logout。
- `src/auth/RequireAuth.tsx`：保护路由。
- `src/auth/permissions.ts`：角色与权限判断。
- `src/components/AdminShell.tsx`：导航和用户区。
- `src/components/PermissionGate.tsx`：root/reader UI 控制。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 1024px | 左侧固定导航 + 右侧内容区，表格展示主要管理字段 |
| 768px - 1023px | 侧边栏可折叠，表格保留关键列，次要信息进入详情页 |
| < 768px | 顶部导航/抽屉式菜单，列表改为卡片式，操作按钮按权限隐藏或禁用 |

## 影响分析

- **新增依赖:** Console 需要 `vite`、`@vitejs/plugin-react`、`react-router-dom`；可选 `@tanstack/react-query`。后端 GitHub OAuth 可能需要 `passport-github2` 或直接使用 Octokit/fetch 交换 token（推荐实现时评估依赖最小化）。
- **破坏性变更:** 无计划中的公开 API 破坏；后台 API 放在 `/v2/admin/**`。
- **向后兼容:** 保留现有公开 `/v2/content/**`、`/v2/comments/**`、主站读取逻辑；`UserRole.WRITER` 可保留但不参与本需求权限授予。
- **性能影响:** Console 是独立 SPA 静态资源；后台列表复用分页，避免一次拉取所有数据。认证 Guard 增加轻量 JWT 校验开销。
- **安全影响:** root/reader 权限必须服务端强制。生产环境应优先使用 HttpOnly Cookie、严格 CORS origin、Secure/SameSite 配置；GitHub OAuth secret 只存在 NestJS 环境变量。
- **部署影响:** 需要为 `packages/wuh.site.console` 增加 dev/build/start 或 preview 脚本，并在 CI/Docker/部署脚本中决定 Console 静态资源托管方式。环境变量至少包括 `VITE_API_BASE_URL`、GitHub OAuth callback 对应后端变量、JWT secret、Console URL。
- **回滚策略:** Console package 可独立回滚；后端新增 `/v2/admin/**` 与 `/v2/auth/**` 不影响公开站点。若认证上线异常，可临时下线 Console 路由/静态服务并保留公开 API。

### `proposal.md`
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

# 独立后台 Console 与 GitHub 认证只读权限

## 背景

当前站点已具备 NestJS 内容、留言板、博客评论、用户、认证等模块，但管理能力分散在 API 或脚本层，缺少一个独立后台 Console 来统一查看与操作。博客内容、留言板消息、博客评论等需要支持后台管理，同时管理入口必须复用 GitHub 认证，避免额外账号体系。

权限上需要满足明确的安全边界：GitHub 登录后自动注册用户；`stack-wuh` 是唯一 Root 管理员；除 `stack-wuh` 之外的所有 GitHub 用户只能获得 Read 只读权限，允许查看后台数据但不能执行创建、更新、删除、审核、同步等写操作。

## 目标

- 新增独立后台 Console 前端应用，作为 monorepo 内单独 package，例如 `packages/wuh.site.console`，不集成到现有主站 `/admin` 路由。
- 后端支持 GitHub OAuth 登录、会话/JWT 鉴权、当前用户信息读取，并在首次登录时自动注册用户。
- 权限模型固定为 `stack-wuh = root`，其他所有用户自动为 `reader`；reader 只能读取后台资源，root 才能执行写操作。
- 后台覆盖现有 Nest 项目中的博客管理、留言板管理、博客评论管理等能力，至少支持列表、详情、筛选、读取状态、管理操作入口。
- 对所有后台写接口增加服务端权限校验，确保前端隐藏按钮之外仍由 NestJS 拒绝 reader 写操作。
- 管理 API 继续遵循现有 API 标准化约束，包括统一错误格式、Swagger 可发现、分页响应格式。

## 非目标（明确不做）

- 本次不实现任意用户角色分配、邀请制、组织权限、团队权限或多管理员配置；除 `stack-wuh` 外全部固定为 Read。
- 本次不替换现有 GitHub Issues 作为 CMS 的数据来源，不改变博客公开站点展示逻辑。
- 本次不做复杂工作流审批系统；只要求后台能覆盖现有管理动作并按 root/reader 权限控制。
- 本次不要求迁移历史数据模型，除非为了记录 GitHub 登录用户、会话或审计信息必须补充字段。
- 本次不将后台 Console 打包进 `packages/wuh.site.next` 主站路由。

## 影响范围

- `packages/wuh.site.console` — 新增独立后台 Console 前端应用，包含登录页、布局、导航、资源列表/详情/操作页面。
- `packages/wuh.site.nest/src/modules/auth` — 补齐 GitHub OAuth 登录、JWT/session 发放、当前用户接口与认证 Guard。
- `packages/wuh.site.nest/src/modules/user` — 固化 `stack-wuh` Root 判定与自动注册 reader 逻辑，保留用户读取能力。
- `packages/wuh.site.nest/src/modules/admin` — 扩展统一后台管理 API，并对写操作使用 Root 权限 Guard。
- `packages/wuh.site.nest/src/modules/content` — 暴露后台博客列表、详情、metadata 更新、同步/状态管理等能力，并复用现有分页与内容 DTO。
- `packages/wuh.site.nest/src/modules/comment` — 暴露留言板与博客评论后台读取、审核、删除或同步等现有管理动作。
- `packages/shared-contracts` — 如需前后端共享后台 DTO、角色、分页与操作响应类型，新增对应契约。
- `openspec/specs/admin-console/spec.md` — 新增后台 Console 与权限规范，归档时合并。

### `specs/admin-console/spec.md`
---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^#### Scenario: .+'
---

# Spec: 后台 Console 与权限控制

## ADDED Requirements

### Requirement: 独立后台 Console 应作为单独前端应用存在
后台管理系统 SHALL 作为独立的前端应用运行，与主站前端保持应用边界分离。

#### Scenario: Console 与主站前端独立部署
- **GIVEN** monorepo 中已有主站前端 `packages/wuh.site.next`
- **WHEN** 实现后台管理系统
- **THEN** 应新增独立 Console 前端 package，而不是把后台页面放入主站 `/admin` 路由
- **AND** Console 应拥有独立的开发、构建、启动脚本和环境变量配置

### Requirement: Console 应使用 GitHub 认证登录
Console SHALL 通过 GitHub OAuth 完成用户身份认证，并向已认证用户提供后台 API 所需的认证凭据。

#### Scenario: 用户完成 GitHub OAuth 登录
- **GIVEN** 用户访问 Console 未登录状态下的受保护页面
- **WHEN** 用户点击 GitHub 登录并完成 OAuth 授权
- **THEN** NestJS 应验证 GitHub 用户身份并为 Console 发放可用于后续 API 调用的认证凭据
- **AND** Console 应能读取当前登录用户的 GitHub login、头像、角色与权限

### Requirement: 首次登录用户应自动注册为只读用户
首次通过 Console 登录且不是 `stack-wuh` 的 GitHub 用户 SHALL 自动注册或更新为 `reader`，并仅获得只读权限。

#### Scenario: 普通 GitHub 用户首次登录
- **GIVEN** 任意 GitHub 用户首次通过 Console 登录
- **WHEN** 该用户不是 `stack-wuh`
- **THEN** 后端应自动创建或更新该用户记录，并将角色固定为 `reader`
- **AND** reader 用户只能读取后台资源，不能执行任何写操作

### Requirement: stack-wuh 应是唯一 Root 管理员
后台系统 SHALL 根据 GitHub login 固定计算 root 身份，只有 `stack-wuh` 可以获得 root 角色与全部后台管理权限。

#### Scenario: root 用户身份固定
- **GIVEN** GitHub 登录用户的 login 为 `stack-wuh`
- **WHEN** 后端创建或更新用户记录并计算权限
- **THEN** 该用户应获得 `root` 角色与全部后台管理权限
- **AND** 非 `stack-wuh` 用户不得通过请求参数、数据库已有角色或客户端状态提升为 root/writer

### Requirement: 服务端应强制区分读取权限与写入权限
后台 API SHALL 在服务端校验用户角色，区分只读查询与管理写操作的授权范围。

#### Scenario: reader 读取和写入后台 API
- **GIVEN** 已登录 reader 用户调用后台 API
- **WHEN** 请求为 GET 或只读查询
- **THEN** 服务端应允许访问其授权的后台只读数据
- **AND** 当 reader 调用创建、更新、删除、审核、同步等写操作时，服务端应返回权限不足错误

### Requirement: 后台应支持博客管理
Console SHALL 提供博客内容的查询与 root-only 管理能力，并复用既有 GitHub Issues CMS 内容服务。

#### Scenario: root 和 reader 管理博客
- **GIVEN** 后端已有内容管理与 GitHub Issues CMS 同步能力
- **WHEN** root 或 reader 用户进入博客管理模块
- **THEN** Console 应支持查看博客列表、详情、状态、标签、封面、metadata、GitHub Issue 关联信息
- **AND** 仅 root 用户可执行博客 metadata 更新、状态变更、同步触发等写操作

### Requirement: 后台应支持留言板管理
Console SHALL 提供留言板数据查询，并提供仅限 root 使用的留言处理管理能力。

#### Scenario: root 和 reader 管理留言板
- **GIVEN** 后端已有留言板或匿名留言相关模块
- **WHEN** root 或 reader 用户进入留言板管理模块
- **THEN** Console 应支持查看留言列表、详情、提交人信息、创建时间、处理状态与错误信息
- **AND** 仅 root 用户可执行审核、隐藏、删除、同步或状态更新等写操作

### Requirement: 后台应支持博客评论管理
Console SHALL 提供博客评论审核数据查询与 root-only 审核、删除及同步重试能力。

#### Scenario: root 和 reader 管理博客评论
- **GIVEN** 后端已有博客评论提交、审核后发布到 GitHub Issue、重复审批拦截等能力
- **WHEN** root 或 reader 用户进入博客评论管理模块
- **THEN** Console 应支持查看评论列表、所属博客、评论内容、审核状态、GitHub 同步状态与失败原因
- **AND** 仅 root 用户可执行通过、拒绝、删除、重试同步等写操作

### Requirement: Console UI 应基于角色展示操作能力
Console 前端 SHALL 根据当前用户角色展示可用操作，但所有权限决策仍必须由服务端强制执行。

#### Scenario: reader 使用 Console
- **GIVEN** 当前登录用户角色为 reader
- **WHEN** Console 渲染博客、留言板、评论等管理页面
- **THEN** 写操作按钮应隐藏或禁用，并说明当前账号仅可读取
- **AND** 前端权限展示不能替代服务端权限校验

### Requirement: 后台 API 应遵循既有 API 标准
后台 API SHALL 遵循项目现有的认证、分页、异常响应与 Swagger 文档约定，并保持公开内容 API 兼容。

#### Scenario: Console 调用后台 API
- **GIVEN** Console 调用 NestJS 后台 API
- **WHEN** API 返回列表、错误或 Swagger 文档
- **THEN** 列表应复用统一分页响应格式，错误应复用统一异常格式，接口应可被 Swagger 文档发现
- **AND** 新增接口不应破坏现有公开内容 API 与主站展示行为

### `tasks.md`
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
