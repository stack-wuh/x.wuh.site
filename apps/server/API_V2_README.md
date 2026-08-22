# wuh.site API v2

## 概述

wuh.site API v2 是 x.wuh.site 项目的后端 API，提供博客内容管理、评论系统、RSS 订阅等功能。

## 基础信息

- **版本**: v2
- **基础URL**: `http://localhost:3200/v2`
- **认证**: JWT (管理员接口需要)

## 接口列表

### 系统接口

#### 健康检查
- **GET** `/v2/health`
- 描述: 检查服务运行状态

#### API 文档
- **GET** `/v2`
- 描述: 获取完整的 API 文档和接口列表

- **GET** `/v2/endpoints`
- 描述: 获取所有接口端点列表

### 内容接口

#### 获取文章列表
- **GET** `/v2/content/posts`
- 参数:
  - `page` (可选): 页码，默认 1
  - `limit` (可选): 每页数量，默认 20
  - `labels` (可选): 标签过滤
  - `state` (可选): 状态过滤

#### 获取单篇文章
- **GET** `/v2/content/posts/{slugOrNumber}`
- 参数:
  - `slugOrNumber` (必需): 文章 slug 或编号

#### 获取项目列表
- **GET** `/v2/content/projects`
- 参数:
  - `page` (可选): 页码，默认 1
  - `limit` (可选): 每页数量，默认 20

### 评论接口

#### 获取评论列表
- **GET** `/v2/comments`
- 参数:
  - `page` (可选): 页码，默认 1
  - `limit` (可选): 每页数量，默认 20
  - `issueNumber` (可选): Issue 编号过滤

#### 创建评论
- **POST** `/v2/comments`
- 请求体:
  ```json
  {
    "nickname": "用户名",
    "content": "评论内容",
    "email": "邮箱（可选）",
    "website": "网站（可选）"
  }
  ```

### RSS 接口

#### 获取 RSS 订阅
- **GET** `/v2/rss.xml`
- 返回: RSS XML 格式的订阅内容

### Webhook 接口

#### GitHub Webhook
- **POST** `/v2/webhook/github`
- 描述: 处理 GitHub Webhook 事件
- 请求头:
  - `X-GitHub-Event`: 事件类型
  - `X-GitHub-Delivery`: 交付 ID
  - `X-Hub-Signature-256`: 签名

### 管理员接口

#### 更新内容元数据
- **PATCH** `/v2/admin/content/{id}/metadata`
- 认证: 需要 JWT 令牌
- 参数:
  - `id` (必需): 内容 ID
- 请求头:
  - `Authorization`: Bearer {token}

## 响应格式

所有 API 响应都遵循以下格式:

```json
{
  "data": "...",
  "total": 100,
  "page": 1,
  "limit": 20
}
```

## 错误处理

API 使用标准的 HTTP 状态码:

- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权
- `404`: 资源不存在
- `429`: 请求过于频繁

错误响应格式:

```json
{
  "message": "错误信息",
  "error": "错误类型",
  "statusCode": 400
}
```

## 开发和部署

### 本地开发
```bash
cd apps/server
npm run start:dev
```

### 构建
```bash
npm run build
```

### 生产运行
```bash
npm run start:prod
```

## 环境变量

- `PORT`: 服务端口 (默认: 3200)
- `MONGO_URI`: MongoDB 连接字符串
- `JWT_SECRET`: JWT 密钥
- `JWT_EXPIRATION`: JWT 过期时间
- `GITHUB_PERSONAL_TOKEN`: GitHub 个人访问令牌
- `CONTENT_REPO_OWNER`: GitHub 仓库所有者
- `CONTENT_REPO_NAME`: GitHub 仓库名称
- `SENTRY_DSN`: Sentry DSN (可选)
- `CORS_ORIGIN`: CORS 允许的源 (默认: *)

## 许可证

ISC License