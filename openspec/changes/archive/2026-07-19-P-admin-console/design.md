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
