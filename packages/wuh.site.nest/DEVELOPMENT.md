# wuh.site.nest 开发指南

## 项目概览

`wuh.site.nest` 是 x.wuh.site 的 NestJS + MongoDB 后端实现，主要功能包括：

- 📰 GitHub Issues 数据缓存与同步
- 💬 匿名留言系统（与 GitHub 同步）
- 📡 RSS 订阅
- 🔐 角色权限管理
- 📊 监控与日志

## 快速启动

### 1. 初始化项目

```bash
cd packages/wuh.site.nest
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入必要的配置：

```env
# 必需配置
MONGO_URI=mongodb://localhost:27017/wuh_site
GITHUB_PERSONAL_TOKEN=your_token_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# GitHub 仓库信息
CONTENT_REPO_OWNER=stack-wuh
CONTENT_REPO_NAME=blog
COMMENT_ISSUE_NUMBER=123

# 其他配置
PORT=3000
LOG_LEVEL=info
```

### 3. 启动开发服务

```bash
pnpm start:dev
```

### 4. 初次数据同步

```bash
pnpm sync:init
```

## 项目结构详解

### 模块设计

```
src/modules/
├── content/           # 内容管理（博客、项目）
│   ├── schemas/      # Content MongoDB Schema
│   ├── content.service.ts  # 业务逻辑
│   ├── content.controller.ts  # HTTP 接口
│   └── content.module.ts  # 模块定义
│
├── comment/           # 留言系统
│   ├── schemas/      # Comment MongoDB Schema
│   ├── comment.service.ts
│   ├── comment.controller.ts
│   └── comment.module.ts
│
├── sync/              # GitHub 数据同步
│   ├── sync.service.ts  # 核心同步逻辑
│   └── sync.module.ts
│
├── webhook/           # GitHub Webhook 处理
│   ├── webhook.controller.ts  # 接收 GitHub 事件
│   └── webhook.module.ts
│
├── rss/               # RSS 订阅
│   ├── rss.service.ts  # RSS 生成与缓存
│   ├── rss.controller.ts
│   └── rss.module.ts
│
├── user/              # 用户和角色管理
│   ├── schemas/      # User MongoDB Schema
│   ├── user.service.ts
│   └── user.module.ts
│
├── auth/              # 认证模块（GitHub OAuth + JWT）
│   └── auth.module.ts
│
└── admin/             # 管理接口
    ├── admin.controller.ts
    └── admin.module.ts
```

### 数据模型

#### Content Schema
存储 GitHub Issue 作为博客文章，包含：
- `externalId`: GitHub Issue ID
- `number`: Issue 编号
- `title`: 标题
- `body`: 内容（Markdown）
- `bodyHtml`: HTML 渲染
- `labels`: 标签
- `metadata`: 扩展信息（slug、cover、summary 等）

#### Comment Schema
存储评论，包含：
- `externalId`: GitHub Comment ID
- `issueNumber`: 所属 Issue
- `body`: 评论内容
- 匿名评论字段：`nickname`, `email`, `avatarUrl`, `footprint`

#### User Schema
用户角色信息：
- `githubId`: GitHub ID
- `role`: 角色（root/writer/reader）
- `isActive`: 活跃状态

## 核心功能实现

### 1. GitHub 数据同步

**SyncService** 负责：

```typescript
// 全量同步（首次运行）
await syncService.fullSync();

// 增量更新（通过 Webhook）
await syncService.syncIssue(number);
await syncService.syncComment(commentId);

// 发布评论到 GitHub
await syncService.postCommentToGitHub(issueNumber, body);
```

**流程**：
1. 从 GitHub REST API 分页拉取所有 Issues
2. 对每个 Issue 拉取其 Comments
3. Upsert 到 MongoDB
4. 处理速率限制

### 2. Webhook 处理

**WebhookController** 在 `POST /webhook/github` 接收 GitHub 事件：

```typescript
// 事件类型处理
- issues.opened/edited/closed → syncIssue()
- issue_comment.created/edited → syncComment() + syncIssue()

// 验证 GitHub 签名
verifySignature(signature, payload) // X-Hub-Signature-256
```

**配置 Webhook**：
1. GitHub 仓库设置 → Webhooks
2. Payload URL: `https://your-domain/webhook/github`
3. Content type: `application/json`
4. Secret: 与 `.env` 中的 `GITHUB_WEBHOOK_SECRET` 一致
5. Events: Issues, Issue comments

### 3. 匿名留言系统

**CommentController** 提供 `POST /comments`：

```typescript
// 请求体
{
  "nickname": "小明",
  "email": "xxx@example.com",  // 可选
  "content": "很好的文章！"
}

// 流程
1. 速率限制检查（Rate Limit Guard）
2. 生成随机头像（基于 email 或 nickname）
3. 调用 GitHub API 发布评论
4. 存储到 MongoDB
5. 返回评论信息
```

### 4. RSS 订阅

**RssService** 生成 RSS 2.0 源：

```typescript
// 获取所有未排除的 Content
const contents = await contentModel.find({
  'metadata.rssExcluded': { $ne: true }
}).sort({ createdAtGitHub: -1 }).limit(50);

// 使用 `feed` 包生成 XML
feed.addItem({
  title, id, link, content, author, date
});

// 缓存 1 小时（可通过 Webhook 清理）
```

## API 合同

### Content API

```
GET /content/posts?page=1&limit=20&labels=blog,guide&state=open
Response: {
  data: Content[],
  total: number,
  page: number
}

GET /content/posts/:slugOrNumber
Response: Content
```

### Comment API

```
GET /comments?issueNumber=123&page=1
Response: {
  data: Comment[],
  total: number,
  page: number
}

POST /comments
Body: { nickname, email?, content }
Response: Comment
```

### RSS

```
GET /rss.xml
Response: XML (application/xml)
```

## 下一步开发任务

### M1: 基础数据同步 ✅
- [x] MongoDB Schema 定义
- [x] SyncService 实现
- [x] 初次同步脚本
- [x] Content API

### M2: Webhook & 评论 ✅
- [x] Webhook 验证与处理
- [x] 增量同步
- [x] Comment API
- [x] 匿名留言（基础版）

### M3: RSS & 日志 ✅
- [x] RSS 生成与缓存
- [x] Content 过滤（rssExcluded）
- [x] 日志框架（Pino）
- [x] Sentry 集成框架

### M4: 认证与权限 ⏳
- [ ] GitHub OAuth 流程
- [ ] JWT Token 生成与验证
- [ ] Admin Guard（验证角色）
- [ ] 权限保护的 Admin 接口

### M5: 高级功能 ⏳
- [ ] 匿名评论与 GitHub 同步完成
- [ ] Email 通知系统
- [ ] Captcha 防 spam（可选）
- [ ] 内容搜索功能
- [ ] 统计面板

### M6: 部署与监控 ⏳
- [ ] Docker 化
- [ ] Sentry 完整集成
- [ ] 性能优化
- [ ] 生产环境部署

## 开发规范

### 代码风格

```typescript
// 使用 Pino 记录日志
private logger = new Logger(ServiceName.name);
this.logger.log('操作信息');
this.logger.error('错误信息');

// 使用 Sentry 捕获异常
try {
  // 业务逻辑
} catch (error) {
  this.logger.error(`失败: ${error.message}`);
  throw error;  // Sentry 由全局过滤器捕获
}

// DTOs 用于请求/响应验证
export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  content: string;
}
```

### 数据库操作

```typescript
// 使用 Mongoose lean() 优化读取性能
const content = await this.contentModel
  .findOne({ externalId })
  .lean()
  .exec();

// Upsert 模式
const existing = await this.findByExternalId(id);
if (existing) {
  return this.model.findByIdAndUpdate(id, data, { new: true });
} else {
  return this.create(data);
}
```

### 错误处理

```typescript
// 使用 NestJS 内置异常
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Access denied');
throw new InternalServerErrorException('Database error');
```

## 常见开发任务

### 添加新的 Content 字段

1. 在 `content.schema.ts` 中添加 `@Prop()`
2. 更新 `CreateContentDto` 和 `UpdateContentMetadataDto`
3. 在 `SyncService.syncIssue()` 中赋值
4. 更新 API 文档

### 添加新的 API 端点

1. 在相应 Controller 中添加方法
2. 在 Service 中实现业务逻辑
3. 添加请求验证（DTO）
4. 添加错误处理和日志

### 调试 Webhook

```bash
# 查看最近的 Webhook 交付（GitHub 仓库 Settings → Webhooks）
# 或使用 ngrok 本地测试：
ngrok http 3000
# 将 ngrok URL 配置到 GitHub Webhook
```

## 常见问题

**Q: 初次同步失败？**
A: 检查环境变量、GitHub Token 有效性、MongoDB 连接、GitHub API 速率限制

**Q: Webhook 验证失败？**
A: 确保 Secret 一致，检查请求头中的 `x-hub-signature-256`

**Q: RSS 过期内容不更新？**
A: RSS 缓存 1 小时，Webhook 触发时自动清理；可手动调用清理接口

**Q: 匿名评论如何同步到 GitHub？**
A: 需要使用 GITHUB_PERSONAL_TOKEN 调用 GitHub API `issues.createComment()`

## 参考资源

- [NestJS 文档](https://docs.nestjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Octokit.js (GitHub API)](https://github.com/octokit/octokit.js)
- [Feed.js (RSS 生成)](https://github.com/jpmonette/feed)
- [Pino (日志库)](https://getpino.io/)

## License

ISC
