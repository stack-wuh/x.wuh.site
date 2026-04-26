# x.wuh.site 项目架构概览

## 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         x.wuh.site 项目                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (packages/wuh.site.next)  │  Backend (packages/wuh.site.nest)
│  ┌─────────────────────────────┐    │  ┌─────────────────────────────┐
│  │  Next.js 前端               │    │  │  NestJS 后端                │
│  │  ├─ Pages                   │    │  │  ├─ Content Module          │
│  │  │  ├─ Posts                │    │  │  │  ├─ Schema              │
│  │  │  ├─ Projects             │    │  │  │  ├─ Service             │
│  │  │  └─ Detail Pages         │    │  │  │  └─ Controller          │
│  │  ├─ Components (本地库)      │    │  │  ├─ Comment Module         │
│  │  ├─ Hooks (本地库)           │    │  │  │  ├─ 匿名留言系统       │
│  │  └─ API 客户端              │    │  │  │  └─ 速率限制           │
│  └─────────────────────────────┘    │  │  ├─ Sync Module            │
│           ↓ HTTP ↑                   │  │  │  ├─ GitHub 全量同步    │
│                                      │  │  │  └─ 增量更新           │
│                                      │  │  ├─ Webhook Module        │
│                                      │  │  │  ├─ Issue 事件         │
│                                      │  │  │  └─ Comment 事件       │
│                                      │  │  ├─ RSS Module            │
│                                      │  │  ├─ User Module           │
│                                      │  │  ├─ Auth Module           │
│                                      │  │  └─ Admin Module          │
│                                      │  └─────────────────────────────┘
│                                      │           ↓ MongoDB API ↑
│                                      │
│  ┌─────────────────────────────┐    │  ┌─────────────────────────────┐
│  │  UI Component Library        │    │  │  MongoDB Database           │
│  │  (@wuh.site/components)      │    │  │  ├─ Content Collection     │
│  └─────────────────────────────┘    │  │  ├─ Comment Collection     │
│                                      │  │  └─ User Collection       │
│  ┌─────────────────────────────┐    │  └─────────────────────────────┘
│  │  Hook Library                │    │
│  │  (@wuh.site/hooks)           │    │  ┌─────────────────────────────┐
│  └─────────────────────────────┘    │  │  External Services          │
│                                      │  │  ├─ GitHub API              │
│                                      │  │  ├─ GitHub Webhook         │
│                                      │  │  └─ Sentry (监控)          │
│                                      │  └─────────────────────────────┘
│                                      │
└─────────────────────────────────────────────────────────────────┘
```

## 数据流

### 1. 内容流

```
GitHub Issues
    ↓
Sync Service (fullSync / syncIssue)
    ↓ GitHub REST API
    ↓
MongoDB (Content Collection)
    ↓
Content API (GET /content/posts)
    ↓
Frontend (wuh.site.next)
    ↓
用户浏览
```

### 2. 增量更新流

```
GitHub Webhook Event
    ↓
Webhook Controller (验证签名)
    ↓
Sync Service (syncIssue / syncComment)
    ↓ GitHub REST API
    ↓
MongoDB (Content / Comment Collection)
    ↓
前端通过 API 获取更新
```

### 3. 留言流

```
前端表单
    ↓ POST /comments
    ↓
Comment Controller (速率限制)
    ↓
Sync Service.postCommentToGitHub()
    ↓ GitHub API
    ↓
GitHub Issue Comment
    ↓
MongoDB (Comment Collection)
    ↓
前端显示留言
    ↓
Webhook 触发同步
```

### 4. RSS 订阅流

```
GET /rss.xml
    ↓
RSS Service (查询缓存)
    ↓ Cache Miss
    ↓
MongoDB 查询 Content
    ↓
Feed 库生成 XML
    ↓
缓存 1 小时
    ↓
返回 RSS 源
```

## 模块依赖关系

```
App Module
├── Config Module
├── Mongoose Module
├── Throttler Module (速率限制)
│
├── Content Module
│   └── Content Schema + Service + Controller
│
├── Comment Module
│   └── Comment Schema + Service + Controller
│
├── Sync Module
│   ├── Content Module
│   ├── Comment Module
│   └── Sync Service (GitHub API 集成)
│
├── Webhook Module
│   └── Sync Module
│       └── GitHub 事件处理
│
├── RSS Module
│   ├── Content Module
│   └── RSS Service + Controller
│
├── User Module
│   └── User Schema + Service
│
├── Auth Module
│   ├── JWT Strategy
│   └── Passport Integration
│
└── Admin Module
    └── Content Module
        └── 权限保护的管理接口
```

## 数据库 Schema 关系

```
┌─────────────────────────────────┐
│       Content Collection         │
├─────────────────────────────────┤
│ externalId (PK)                 │
│ number                          │
│ title                           │
│ body, bodyHtml                  │
│ labels[]                        │
│ metadata {                      │
│   slug, summary, cover,         │
│   keywords[], rssExcluded       │
│ }                               │
│ author { login, avatar }        │
│ comments (count)                │
│ createdAtGitHub, updatedAtGitHub│
│ timestamps (Mongoose)           │
└─────────────────────────────────┘
          ↓ 1:N
┌─────────────────────────────────┐
│      Comment Collection          │
├─────────────────────────────────┤
│ externalId (PK)                 │
│ issueNumber (FK)                │
│ body, bodyHtml                  │
│ user { login, avatar }          │
│ nickname (匿名)                 │
│ email (匿名)                    │
│ footprint (UUID)                │
│ clientIp, userAgent             │
│ createdAtGitHub, updatedAtGitHub│
│ timestamps (Mongoose)           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│       User Collection            │
├─────────────────────────────────┤
│ githubId (PK)                   │
│ login                           │
│ email                           │
│ role (root/writer/reader)       │
│ isActive                        │
│ lastLoginAt                     │
│ timestamps (Mongoose)           │
└─────────────────────────────────┘
```

## API 路由图

```
REST API 端点
├── /health
│   └── GET 健康检查
│
├── /content
│   ├── /posts
│   │   ├── GET 列表 (分页、过滤)
│   │   └── /:slugOrNumber
│   │       └── GET 详情
│   └── /projects
│       └── GET 列表
│
├── /comments
│   ├── GET 列表 (分页)
│   └── POST 发布匿名留言 (速率限制)
│
├── /rss.xml
│   └── GET RSS 订阅源
│
├── /webhook
│   └── /github
│       └── POST GitHub Webhook (签名验证)
│
├── /admin
│   └── /content/:id/metadata
│       └── PATCH 编辑 metadata (权限保护)
│
└── /auth (可选)
    ├── /github
    │   └── GET GitHub OAuth
    └── /refresh
        └── POST 刷新 Token
```

## 环境配置

```
.env 配置项
├── 服务器
│   ├── PORT=3000
│   ├── NODE_ENV=development
│   └── CORS_ORIGIN=*
│
├── 数据库
│   └── MONGO_URI=mongodb://localhost:27017/wuh_site
│
├── GitHub
│   ├── GITHUB_PERSONAL_TOKEN=ghp_xxx
│   ├── GITHUB_WEBHOOK_SECRET=secret
│   ├── CONTENT_REPO_OWNER=stack-wuh
│   ├── CONTENT_REPO_NAME=blog
│   └── COMMENT_ISSUE_NUMBER=123
│
├── 身份验证
│   ├── GITHUB_CLIENT_ID=...
│   ├── GITHUB_CLIENT_SECRET=...
│   ├── JWT_SECRET=...
│   └── JWT_EXPIRATION=24h
│
├── 管理员
│   └── ROOT_GITHUB_IDS=123,456,789
│
├── 日志与监控
│   ├── LOG_LEVEL=info
│   └── SENTRY_DSN=https://...
```

## 开发与部署流程

### 开发环境

```
pnpm install              # 安装依赖
cp .env.example .env      # 配置环境变量
pnpm start:dev            # 启动开发服务
pnpm sync:init            # 初次同步数据
```

### 测试

```
pnpm test                 # 运行单元测试
pnpm lint                 # 代码检查
```

### 生产部署

```
pnpm build                # 构建生产版本
pnpm sync:init            # 初次同步（或迁移前）
pnpm start:prod           # 启动生产服务

# 或 Docker 部署
docker build -t wuh.site.nest .
docker run -e MONGO_URI=... -e GITHUB_TOKEN=... wuh.site.nest
```

## 扩展点

### 认证方案
- [ ] GitHub OAuth 流程
- [ ] JWT Token 签发与验证
- [ ] Refresh Token 机制

### 权限系统
- [ ] Admin Guard（验证 root/writer）
- [ ] Resource-level 权限检查
- [ ] 细粒度权限配置

### 高级功能
- [ ] 全文搜索（Elasticsearch 或 MongoDB Atlas Search）
- [ ] 内容版本控制
- [ ] 统计面板
- [ ] 邮件通知
- [ ] Captcha 防 spam

### 性能优化
- [ ] Redis 缓存层（RSS、热门文章）
- [ ] 数据库查询优化
- [ ] CDN 集成
- [ ] 数据库分片

## 故障排查

| 问题 | 症状 | 解决方案 |
|------|------|---------|
| 初次同步失败 | `sync:init` 抛错 | 检查 GITHUB_TOKEN、MONGO_URI |
| Webhook 验证失败 | 400 Bad Request | 验证 GITHUB_WEBHOOK_SECRET |
| MongoDB 连接错误 | 连接超时 | 检查 MongoDB 服务、防火墙 |
| GitHub 速率限制 | API 返回 429 | 等待 1 小时或使用 GitHub App |
| RSS 过期 | 旧数据显示 | 清理缓存或等待 1 小时 |

## 参考链接

- [项目 README](./README.md)
- [开发指南](./DEVELOPMENT.md)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [NestJS 文档](https://docs.nestjs.com/)
- [MongoDB 文档](https://docs.mongodb.com/)
