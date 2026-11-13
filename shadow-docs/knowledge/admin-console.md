---
title: 后台 Console 与权限控制
domain: admin
keywords: [后台管理, Console, OAuth, GitHub登录, 权限控制, RBAC, Docker, SPA]
scope:
  - apps/console
  - apps/server/src/modules/auth
  - apps/server/src/modules/admin
status: active
source:
  - changes/archive/2026-07-19-P-admin-console/brief.md
  - changes/archive/2026-07-26-P-console-production-deployment/brief.md
  - changes/archive/20261113-fix-audit-batch7-console-dialog/brief.md
verified: 2026-11-13
---

# 后台 Console 与权限控制

## 当前结论

Console 是独立于主站前端的前端应用（`apps/console`，Vite + React）。**当前为本地开发态应用，无生产部署链**（2026-11-13 实况核对，审计 #568 P1-37 回写）：主仓 Dockerfile 无 console 构建阶段、docker-compose 无 console 服务、生产不可复现——历史上「Nginx Alpine 容器 + 127.0.0.1:3300 独立部署」的形态已不成立。开发态经 `vite.config.ts` dev server 跑 3300；`client.ts` 的 API base 由 `VITE_API_BASE_URL` 注入（缺省 `http://localhost:3200/v2`）。若未来恢复生产部署，需补 Dockerfile console 构建阶段 + compose 服务 + 构建期注入 `VITE_API_BASE_URL`（并核 OAuth 回调域名）。

认证与权限契约仍然有效：通过 GitHub OAuth 登录，NestJS 验证身份并发放 `access_token` Cookie（HttpOnly、Secure、SameSite=Lax、Path=/）。`stack-wuh` 是唯一 root 管理员，拥有全部权限。其他 GitHub 用户首次登录自动注册为 `reader`，只能读取后台资源，不能执行写操作。权限决策在服务端强制执行。

管理操作实况（2026-11-13）：console 为**只读壳**——写端点（审核/删除/更新等 7 个）服务端在、前端未接通；列表页操作列显式「只读（写操作尚未接入）」文案（审计 #568 P1-36：此前的死按钮已移除）。接通写操作时按「服务端 guard 已就位 → 前端 API 层补调用 → 按钮 + PermissionGate」次序接线。

后台 API 复用统一分页响应格式和异常格式，与公开内容 API 兼容。环境变量不向前端注入任何 Secret。`/admin/users` 不下发 email（PII 收敛，#582）。

## 执行约束

- 认证使用服务端 HttpOnly Cookie，后台接口必须执行角色校验（类级 JwtAuthGuard + 写端点 RootGuard）。
- console 生产部署链缺失是已知边界——不得假设 console.wuh.site 可用；恢复部署前先补构建链。

## 适用边界

不约束主站公开页面和普通内容读取接口。

## 验证方式

检查 console 构建脚本、Nest auth/admin guard，以及（若部署链恢复）生产部署端口和反向代理配置。

## 关联知识

- [api standardization](./api-standardization.md)
- [build config](./build-config.md)
