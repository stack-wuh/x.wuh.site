# server - Backend for x.wuh.site

NestJS + MongoDB 博客后端服务

## 快速开始

### 环境准备

1. 复制环境变量文件：
   ```bash
   cp .env.example .env
   ```

2. 配置 `.env` 中的必要变量：
   - `MONGO_URI` - MongoDB 连接字符串
   - `GITHUB_PERSONAL_TOKEN` - GitHub API Token
   - `GITHUB_WEBHOOK_SECRET` - GitHub Webhook 签名密钥
   - 其他配置项

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start:dev
```

服务器将在 `http://localhost:3200` 启动。

### 初次数据同步

```bash
pnpm sync:init
```

此命令从 GitHub Issues 仓库拉取所有数据并存储到 MongoDB。

## 项目结构

```
src/
├── main.ts                    # 应用入口
├── app.module.ts              # 根模块
├── app.controller.ts          # 根控制器
├── app.service.ts             # 根服务
├── common/                    # 共享工具（拦截器、装饰器等）
├── config/                    # 配置管理
└── modules/
    ├── auth/                  # GitHub OAuth + JWT 认证
    ├── user/                  # 用户角色管理
    ├── content/               # 内容管理（Issue 数据）
    ├── comment/               # 留言系统
    ├── sync/                  # GitHub 数据同步
    ├── webhook/               # GitHub Webhook 处理
    ├── rss/                   # RSS 订阅
    └── admin/                 # 管理接口
```

## API 端点

### 内容 API
- `GET /content/posts` - 获取博客列表
- `GET /content/posts/:slugOrNumber` - 获取博客详情
- `GET /content/projects` - 获取项目列表

### 留言 API
- `GET /comments` - 获取留言列表
- `POST /comments` - 发布匿名留言（受速率限制）

### RSS
- `GET /rss.xml` - RSS 订阅源

### 健康检查
- `GET /health` - 服务健康状态

## 核心功能

### 1. GitHub 数据同步
- **全量同步**：初次启动时运行 `npm run sync:init`，从 GitHub Issues 拉取所有数据
- **增量更新**：通过 GitHub Webhook 自动同步新增或更新的 Issue 和评论
- **数据缓存**：所有数据存储在 MongoDB，查询仅访问本地数据库

### 2. 匿名留言系统
- 支持没有 GitHub 账号的用户提交留言
- 留言自动同步到 GitHub Issue 评论
- 防 spam 防护：速率限制（Rate Limit）

### 3. RSS 订阅
- 提供 RSS 2.0 格式的订阅源
- 支持缓存优化，1小时更新一次
- 支持 `metadata.rssExcluded` 字段过滤内容

### 4. 角色管理
- **Root**：超级管理员，可编辑 metadata
- **Writer**：内容作者，可编辑自己的 metadata
- **Reader**：普通读者，只读访问

## 环境变量

| 变量名 | 说明 | 示例 |
|-------|------|------|
| PORT | 服务端口 | 3200 |
| MONGO_URI | MongoDB 连接字符串 | mongodb://localhost:27017/wuh_site |
| GITHUB_PERSONAL_TOKEN | GitHub API Token | ghp_xxx |
| GITHUB_WEBHOOK_SECRET | Webhook 签名密钥 | your_secret_key |
| CONTENT_REPO_OWNER | 博客仓库所有者 | stack-wuh |
| CONTENT_REPO_NAME | 博客仓库名称 | blog |
| COMMENT_ISSUE_NUMBER | 留言所用 Issue 编号 | 123 |
| ROOT_GITHUB_IDS | 根用户的 GitHub ID | 12345,67890 |
| JWT_SECRET | JWT 签名密钥 | your_jwt_secret |
| LOG_LEVEL | 日志级别 | info |
| SENTRY_DSN | Sentry 错误追踪 DSN | https://xxx@sentry.io/xxx |

## 开发指南

### 添加新模块

1. 在 `src/modules/` 下创建新文件夹
2. 创建 `.module.ts`, `.service.ts`, `.controller.ts`
3. 在 `app.module.ts` 中注册模块

### 运行测试

```bash
pnpm test
```

### 代码质量检查

```bash
pnpm lint
```

### 构建生产版本

```bash
pnpm build
pnpm start:prod
```

## 生产部署

1. 构建：`pnpm build`
2. 配置 MongoDB、GitHub Token 等环境变量
3. 运行初次同步：`pnpm sync:init`
4. 启动服务：`pnpm start:prod`
5. 配置 GitHub Webhook，指向 `POST /webhook/github`

## 常见问题

### GitHub API 速率限制
- 使用 GitHub Personal Token 可获得更高的速率限制（5000 请求/小时）
- 生产环境建议使用 GitHub App，获得更高的限制

### MongoDB 连接问题
- 确保 MongoDB 服务运行
- 检查 `MONGO_URI` 环境变量配置

### Webhook 验证失败
- 确保 `GITHUB_WEBHOOK_SECRET` 与 GitHub 设置中的 Secret 一致
- 检查日志了解签名验证详情

## 后续任务

- [ ] 完善 Auth Module（GitHub OAuth）
- [ ] 增强 Comment 模块（匿名评论与 GitHub 同步）
- [ ] 实现完整的权限系统
- [ ] 添加 Captcha 防 spam
- [ ] 完善监控和错误追踪（Sentry）
- [ ] 单元测试和集成测试

## License

ISC
