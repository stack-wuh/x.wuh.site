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
