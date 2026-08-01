---
keywords: [后台管理, Console, OAuth, GitHub登录, 权限控制, RBAC, Docker, SPA]
---

# 后台 Console 与权限控制

Console 是独立于主站前端的前端应用（`packages/wuh.site.console`），通过 Docker 以 Nginx Alpine 容器运行 Vite 构建产物，端口 `127.0.0.1:3300`。与主站独立部署，拥有独立的开发、构建、启动脚本和环境变量。

认证与权限：通过 GitHub OAuth 登录，NestJS 验证身份并发放 `access_token` Cookie（HttpOnly、Secure、SameSite=Lax、Path=/）。`stack-wuh` 是唯一 root 管理员，拥有全部权限。其他 GitHub 用户首次登录自动注册为 `reader`，只能读取后台资源，不能执行写操作。权限决策在服务端强制执行，前端仅根据角色展示/隐藏操作按钮。

管理模块：博客管理（查看列表/详情/metadata，root 可更新/同步）、留言板管理（查看留言/状态，root 可审核/隐藏/删除）、评论管理（查看审核状态/GitHub 同步状态，root 可通过/拒绝/删除/重试同步）。

后台 API 复用统一分页响应格式和异常格式，与公开内容 API 兼容。生产 OAuth 回调使用 `https://console.wuh.site/v2/auth/github/callback`。前端通过同源路径 `/v2` 访问 API。环境变量不向前端注入任何 Secret。静态资源按类型区分缓存：`index.html` 不长期缓存，带 hash 的资源使用长期缓存。
