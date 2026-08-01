# NestJS 后端初始化

> 原始变更名：`20260308_P_nest-init`

## 元数据
- 日期：2026-03-08
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：NestJS 后端初始化

## 方案

### 1. 数据模型

**Content Schema**:
- externalId, repo, number, title, labels, state, body, bodyHtml
- metadata: { slug, summary, cover, keywords, rssExcluded, extra }
- author: { login, avatarUrl, url }
- comments (count), createdAtGitHub, updatedAtGitHub

**Comment Schema**:
- externalId, issueId, issueNumber, body, bodyHtml
- user: { login, avatarUrl, url }
- nickname, email, avatarUrl, footprint (UUID)
- clientIp, userAgent
- createdAtGitHub, updatedAtGitHub

**User Schema**:
- githubId, login, email, role (root/writer/reader), isActive

### 2. API 路由

| Method | Path | 说明 |
|--------|------|------|
| GET | /content/posts | 博客列表（分页） |
| GET | /content/posts/:slugOrNumber | 博客详情 |
| GET | /content/projects | 项目列表 |
| GET | /comments | 留言列表 |
| POST | /comments | 匿名留言（速率限制） |
| GET | /rss.xml | RSS 订阅源 |
| POST | /webhook/github | Webhook（签名校验） |
| GET | /health | 健康检查 |

### 3. 集成

- Octokit REST API
- Pino 结构化日志（redact 敏感字段）
- Sentry 全局异常捕获
- nestjs-throttler 速率限制

## 依赖

- @nestjs/*, @nestjs/mongoose, @octokit/rest, nestjs-pino, @sentry/node

## 任务
### Phase 1 — 基础设施
- [ ] T1: 初始化 NestJS 项目与模块结构
- [ ] T2: 创建 Content/Comment/User Schema
### Phase 2 — 核心功能
- [ ] T3: 实现 Sync Service（全量/增量同步）
- [ ] T4: 实现 Content/Comment API
- [ ] T5: 实现 Webhook 模块（签名校验 + 事件处理）
### Phase 3 — 辅助功能
- [ ] T6: 实现 RSS 模块
- [ ] T7: 集成 Pino + Sentry
- [ ] T8: 实现 User/Auth/Admin 模块
### Phase 4 — 脚本与验证
- [ ] T9: 实现 sync:init 脚本
- [ ] T10: 全链路验证

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: NestJS后端初始化
change: nest-init
date: 2026-03-08
type: P
status: applied
```

### `design.md`
# 设计：NestJS 后端初始化

## 方案

### 1. 数据模型

**Content Schema**:
- externalId, repo, number, title, labels, state, body, bodyHtml
- metadata: { slug, summary, cover, keywords, rssExcluded, extra }
- author: { login, avatarUrl, url }
- comments (count), createdAtGitHub, updatedAtGitHub

**Comment Schema**:
- externalId, issueId, issueNumber, body, bodyHtml
- user: { login, avatarUrl, url }
- nickname, email, avatarUrl, footprint (UUID)
- clientIp, userAgent
- createdAtGitHub, updatedAtGitHub

**User Schema**:
- githubId, login, email, role (root/writer/reader), isActive

### 2. API 路由

| Method | Path | 说明 |
|--------|------|------|
| GET | /content/posts | 博客列表（分页） |
| GET | /content/posts/:slugOrNumber | 博客详情 |
| GET | /content/projects | 项目列表 |
| GET | /comments | 留言列表 |
| POST | /comments | 匿名留言（速率限制） |
| GET | /rss.xml | RSS 订阅源 |
| POST | /webhook/github | Webhook（签名校验） |
| GET | /health | 健康检查 |

### 3. 集成

- Octokit REST API
- Pino 结构化日志（redact 敏感字段）
- Sentry 全局异常捕获
- nestjs-throttler 速率限制

## 依赖

- @nestjs/*, @nestjs/mongoose, @octokit/rest, nestjs-pino, @sentry/node

### `proposal.md`
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

### `tasks.md`
# 任务拆分

## Phase 1 — 基础设施

- [ ] T1: 初始化 NestJS 项目与模块结构
  - 涉及文件: `packages/wuh.site.nest/`
  - 产出: App Module + Mongoose + Config + Throttler

- [ ] T2: 创建 Content/Comment/User Schema
  - 涉及文件: `packages/wuh.site.nest/src/modules/content/schemas/` 等

## Phase 2 — 核心功能

- [ ] T3: 实现 Sync Service（全量/增量同步）
  - 涉及文件: `packages/wuh.site.nest/src/modules/sync/`

- [ ] T4: 实现 Content/Comment API
  - 涉及文件: `packages/wuh.site.nest/src/modules/content/`, `comment/`

- [ ] T5: 实现 Webhook 模块（签名校验 + 事件处理）

## Phase 3 — 辅助功能

- [ ] T6: 实现 RSS 模块
- [ ] T7: 集成 Pino + Sentry
- [ ] T8: 实现 User/Auth/Admin 模块

## Phase 4 — 脚本与验证

- [ ] T9: 实现 sync:init 脚本
- [ ] T10: 全链路验证
  - `pnpm --filter @wuh.site/nest lint && pnpm --filter @wuh.site/nest build`
  - 手动验证 API 端点、Webhook、RSS
