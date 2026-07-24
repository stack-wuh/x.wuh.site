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
