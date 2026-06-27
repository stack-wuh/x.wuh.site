# NestJS 后端初始化

## 为什么做

需要独立后端服务对博客内容进行可控的本地缓存（MongoDB），支持匿名留言同步到 GitHub Issue，提供 RSS 订阅、Webhook 增量更新、日志监控等能力。

## 做什么

### 模块
- **Content**: 博客/项目内容 CRUD（从 MongoDB 读写）
- **Comment**: 匿名留言系统，写入 GitHub Issue + 存 MongoDB
- **Sync**: GitHub Issues 全量/增量同步（GitHub REST API → MongoDB Upsert）
- **Webhook**: GitHub Webhook 事件处理（签名校验）
- **RSS**: RSS 2.0 订阅源生成
- **User**: 角色管理（root/writer/reader）
- **Auth**: GitHub OAuth + JWT
- **Admin**: 管理接口（权限保护）

### 技术栈
- NestJS 10 + Mongoose 8
- Octokit（GitHub API）
- Pino（日志）+ Sentry（监控）
- class-validator（DTO 校验）

## 影响范围

- `packages/wuh.site.nest/` — 新增完整后端服务
