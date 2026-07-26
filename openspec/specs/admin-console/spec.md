---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^#### Scenario: .+'
---

# Spec: 后台 Console 与权限控制

## ADDED Requirements

### Requirement: 独立后台 Console 应作为单独前端应用存在
后台管理系统 SHALL 作为独立的前端应用运行，与主站前端保持应用边界分离。

#### Scenario: Console 与主站前端独立部署
- **GIVEN** monorepo 中已有主站前端 `packages/wuh.site.next`
- **WHEN** 实现后台管理系统
- **THEN** 应新增独立 Console 前端 package，而不是把后台页面放入主站 `/admin` 路由
- **AND** Console 应拥有独立的开发、构建、启动脚本和环境变量配置

### Requirement: Console 应使用 GitHub 认证登录
Console SHALL 通过 GitHub OAuth 完成用户身份认证，并向已认证用户提供后台 API 所需的认证凭据。

#### Scenario: 用户完成 GitHub OAuth 登录
- **GIVEN** 用户访问 Console 未登录状态下的受保护页面
- **WHEN** 用户点击 GitHub 登录并完成 OAuth 授权
- **THEN** NestJS 应验证 GitHub 用户身份并为 Console 发放可用于后续 API 调用的认证凭据
- **AND** Console 应能读取当前登录用户的 GitHub login、头像、角色与权限

### Requirement: 首次登录用户应自动注册为只读用户
首次通过 Console 登录且不是 `stack-wuh` 的 GitHub 用户 SHALL 自动注册或更新为 `reader`，并仅获得只读权限。

#### Scenario: 普通 GitHub 用户首次登录
- **GIVEN** 任意 GitHub 用户首次通过 Console 登录
- **WHEN** 该用户不是 `stack-wuh`
- **THEN** 后端应自动创建或更新该用户记录，并将角色固定为 `reader`
- **AND** reader 用户只能读取后台资源，不能执行任何写操作

### Requirement: stack-wuh 应是唯一 Root 管理员
后台系统 SHALL 根据 GitHub login 固定计算 root 身份，只有 `stack-wuh` 可以获得 root 角色与全部后台管理权限。

#### Scenario: root 用户身份固定
- **GIVEN** GitHub 登录用户的 login 为 `stack-wuh`
- **WHEN** 后端创建或更新用户记录并计算权限
- **THEN** 该用户应获得 `root` 角色与全部后台管理权限
- **AND** 非 `stack-wuh` 用户不得通过请求参数、数据库已有角色或客户端状态提升为 root/writer

### Requirement: 服务端应强制区分读取权限与写入权限
后台 API SHALL 在服务端校验用户角色，区分只读查询与管理写操作的授权范围。

#### Scenario: reader 读取和写入后台 API
- **GIVEN** 已登录 reader 用户调用后台 API
- **WHEN** 请求为 GET 或只读查询
- **THEN** 服务端应允许访问其授权的后台只读数据
- **AND** 当 reader 调用创建、更新、删除、审核、同步等写操作时，服务端应返回权限不足错误

### Requirement: 后台应支持博客管理
Console SHALL 提供博客内容的查询与 root-only 管理能力，并复用既有 GitHub Issues CMS 内容服务。

#### Scenario: root 和 reader 管理博客
- **GIVEN** 后端已有内容管理与 GitHub Issues CMS 同步能力
- **WHEN** root 或 reader 用户进入博客管理模块
- **THEN** Console 应支持查看博客列表、详情、状态、标签、封面、metadata、GitHub Issue 关联信息
- **AND** 仅 root 用户可执行博客 metadata 更新、状态变更、同步触发等写操作

### Requirement: 后台应支持留言板管理
Console SHALL 提供留言板数据查询，并提供仅限 root 使用的留言处理管理能力。

#### Scenario: root 和 reader 管理留言板
- **GIVEN** 后端已有留言板或匿名留言相关模块
- **WHEN** root 或 reader 用户进入留言板管理模块
- **THEN** Console 应支持查看留言列表、详情、提交人信息、创建时间、处理状态与错误信息
- **AND** 仅 root 用户可执行审核、隐藏、删除、同步或状态更新等写操作

### Requirement: 后台应支持博客评论管理
Console SHALL 提供博客评论审核数据查询与 root-only 审核、删除及同步重试能力。

#### Scenario: root 和 reader 管理博客评论
- **GIVEN** 后端已有博客评论提交、审核后发布到 GitHub Issue、重复审批拦截等能力
- **WHEN** root 或 reader 用户进入博客评论管理模块
- **THEN** Console 应支持查看评论列表、所属博客、评论内容、审核状态、GitHub 同步状态与失败原因
- **AND** 仅 root 用户可执行通过、拒绝、删除、重试同步等写操作

### Requirement: Console UI 应基于角色展示操作能力
Console 前端 SHALL 根据当前用户角色展示可用操作，但所有权限决策仍必须由服务端强制执行。

#### Scenario: reader 使用 Console
- **GIVEN** 当前登录用户角色为 reader
- **WHEN** Console 渲染博客、留言板、评论等管理页面
- **THEN** 写操作按钮应隐藏或禁用，并说明当前账号仅可读取
- **AND** 前端权限展示不能替代服务端权限校验

### Requirement: 后台 API 应遵循既有 API 标准
后台 API SHALL 遵循项目现有的认证、分页、异常响应与 Swagger 文档约定，并保持公开内容 API 兼容。

#### Scenario: Console 调用后台 API
- **GIVEN** Console 调用 NestJS 后台 API
- **WHEN** API 返回列表、错误或 Swagger 文档
- **THEN** 列表应复用统一分页响应格式，错误应复用统一异常格式，接口应可被 Swagger 文档发现
- **AND** 新增接口不应破坏现有公开内容 API 与主站展示行为

### Requirement: Console 以独立静态镜像发布
Console 生产环境 SHALL 以 Nginx Alpine 容器运行 Vite 构建产物，与 Next.js 主站保持独立部署。

#### Scenario: Console 镜像构建与端口绑定
- **GIVEN** `packages/wuh.site.console` 的 `pnpm run build:console` 成功生成 `dist/`
- **WHEN** 构建 runner-console 镜像
- **THEN** 镜像使用 `nginx:alpine` 基础镜像
- **AND** `dist/` 内容复制到 `/usr/share/nginx/html`
- **AND** 生产容器端口绑定在 `127.0.0.1:3300`

### Requirement: Console 容器支持 SPA 路由
Console 容器内 Nginx SHALL 为前端路由提供 SPA fallback。

#### Scenario: SPA 路由刷新不返回 404
- **GIVEN** 用户访问 `https://console.wuh.site/content` 等前端路由
- **WHEN** 浏览器刷新或直接访问该路径
- **THEN** 容器内 Nginx 通过 `try_files $uri $uri/ /index.html` 回退到 `index.html`
- **AND** 不返回 Nginx 404 页面

### Requirement: 外部 Nginx 代理保持原始路径
外层 Nginx SHALL 将 `/v2/` 请求以原始路径转发至 NestJS，不修改请求路径。

#### Scenario: /v2 请求原路径转发
- **GIVEN** 外部 Nginx 配置 `location /v2/`
- **WHEN** 请求 `https://console.wuh.site/v2/auth/me` 到达
- **THEN** 代理至 `http://127.0.0.1:3200/v2/auth/me`，路径保持原样
- **AND** 不因 `proxy_pass` 配置导致路径被截断或改变

### Requirement: Console 使用同源 API
Console 前端 SHALL 通过同源路径 `/v2` 访问 NestJS API，避免跨域和 Cookie 配置复杂度。

#### Scenario: 生产环境 API 地址
- **GIVEN** 生产构建
- **WHEN** Vite 构建 Console
- **THEN** `VITE_API_BASE_URL` 为 `/v2`
- **AND** 不依赖容器运行时环境变量或全局注入

#### Scenario: 本地开发覆盖
- **GIVEN** 本地开发环境
- **WHEN** 启动 Console 开发服务器
- **THEN** 可通过 `.env.local` 覆盖为 `http://localhost:3200/v2`

### Requirement: 生产 OAuth Callback 使用 Console 域名
生产 GitHub OAuth SHALL 回调至 `https://console.wuh.site/v2/auth/github/callback` 且 Cookie 满足安全属性。

#### Scenario: 生产环境 OAuth 配置
- **GIVEN** 生产 GitHub OAuth App 配置完成
- **WHEN** 用户通过 Console 登录
- **THEN** NestJS 校验 state、交换 GitHub code 并写入用户记录
- **AND** `access_token` Cookie 为 `HttpOnly=true; Secure=true; SameSite=Lax; Path=/`
- **AND** 登录后重定向到 `https://console.wuh.site/`

### Requirement: 环境变量不向 Console 前端注入 Secret
Console 构建阶段注入的环境变量 SHALL 不包含任何 Secret。

#### Scenario: 禁止注入前端的变量
- **GIVEN** Console 的 `VITE_*` 环境变量在构建时注入
- **WHEN** 检查构建产物
- **THEN** 不得包含 `GITHUB_OAUTH_CLIENT_SECRET`、`JWT_SECRET`、`MONGO_URI` 或 `GITHUB_PERSONAL_TOKEN`

### Requirement: CI/CD 中 Console 参与构建与发布
CI/CD 流水线 SHALL 将 Console 纳入质量门禁、镜像构建、staging 和发布流程。

#### Scenario: quality gate 包含 Console 构建
- **GIVEN** GitHub Actions 执行 quality gate
- **WHEN** 运行 `pnpm run build:console`
- **THEN** 构建失败阻断后续流程

#### Scenario: staging 三服务健康检查
- **GIVEN** staging 容器启动
- **WHEN** 执行健康检查
- **THEN** `curl -f http://127.0.0.1:3301/` 返回成功
- **AND** `curl -f http://127.0.0.1:3201/v2/health` 返回成功
- **AND** `curl -f http://127.0.0.1:3001/` 返回成功

### Requirement: 首次上线 Console 与 NestJS 同步发布
Console 首次上线 SHALL 与 NestJS 同步发布，确保 OAuth、API 和权限契约一致。

#### Scenario: 首次上线发布序列
- **GIVEN** Console 与 NestJS 变更为首次生产部署
- **WHEN** 合并到 `main` 并触发发布
- **THEN** 两个服务在同一发布中构建与切换
- **AND** 发布含 Console 容器、NestJS 容器与生产 GitHub OAuth App 配置

### Requirement: 后续纯静态变更独立发布
Console 纯前端静态变更 SHALL 可独立发布，不影响 NestJS。

#### Scenario: 独立发布条件
- **GIVEN** Console 变更仅涉及样式、布局、文案或前端交互
- **WHEN** 打包 Console 镜像并部署
- **THEN** NestJS 不强制同步发布
- **AND** 不改变 API 请求格式、OAuth 流程或权限逻辑

### Requirement: 静态资源缓存策略
Console 静态资源 SHALL 按文件类型区分缓存策略。

#### Scenario: HTML 与带 hash 资源分别缓存
- **GIVEN** Console 的 Nginx 配置
- **WHEN** 响应请求
- **THEN** `index.html` 不进行长期缓存
- **AND** 带 hash 的 JS、CSS 与字体使用长期缓存
