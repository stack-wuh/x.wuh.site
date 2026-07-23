---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
  - '^- \*\*WHEN\*\* .+'
  - '^- \*\*THEN\*\* .+'
---

# Spec: 后台 Console 与权限控制

## ADDED

### Requirement: 独立后台 Console 应作为单独前端应用存在
- **GIVEN** monorepo 中已有主站前端 `packages/wuh.site.next`
- **WHEN** 实现后台管理系统
- **THEN** 应新增独立 Console 前端 package，而不是把后台页面放入主站 `/admin` 路由
- **AND** Console 应拥有独立的开发、构建、启动脚本和环境变量配置

### Requirement: Console 应使用 GitHub 认证登录
- **GIVEN** 用户访问 Console 未登录状态下的受保护页面
- **WHEN** 用户点击 GitHub 登录并完成 OAuth 授权
- **THEN** NestJS 应验证 GitHub 用户身份并为 Console 发放可用于后续 API 调用的认证凭据
- **AND** Console 应能读取当前登录用户的 GitHub login、头像、角色与权限

### Requirement: 首次登录用户应自动注册为只读用户
- **GIVEN** 任意 GitHub 用户首次通过 Console 登录
- **WHEN** 该用户不是 `stack-wuh`
- **THEN** 后端应自动创建或更新该用户记录，并将角色固定为 `reader`
- **AND** reader 用户只能读取后台资源，不能执行任何写操作

### Requirement: stack-wuh 应是唯一 Root 管理员
- **GIVEN** GitHub 登录用户的 login 为 `stack-wuh`
- **WHEN** 后端创建或更新用户记录并计算权限
- **THEN** 该用户应获得 `root` 角色与全部后台管理权限
- **AND** 非 `stack-wuh` 用户不得通过请求参数、数据库已有角色或客户端状态提升为 root/writer

### Requirement: 服务端应强制区分读取权限与写入权限
- **GIVEN** 已登录 reader 用户调用后台 API
- **WHEN** 请求为 GET 或只读查询
- **THEN** 服务端应允许访问其授权的后台只读数据
- **AND** 当 reader 调用创建、更新、删除、审核、同步等写操作时，服务端应返回权限不足错误

### Requirement: 后台应支持博客管理
- **GIVEN** 后端已有内容管理与 GitHub Issues CMS 同步能力
- **WHEN** root 或 reader 用户进入博客管理模块
- **THEN** Console 应支持查看博客列表、详情、状态、标签、封面、metadata、GitHub Issue 关联信息
- **AND** 仅 root 用户可执行博客 metadata 更新、状态变更、同步触发等写操作

### Requirement: 后台应支持留言板管理
- **GIVEN** 后端已有留言板或匿名留言相关模块
- **WHEN** root 或 reader 用户进入留言板管理模块
- **THEN** Console 应支持查看留言列表、详情、提交人信息、创建时间、处理状态与错误信息
- **AND** 仅 root 用户可执行审核、隐藏、删除、同步或状态更新等写操作

### Requirement: 后台应支持博客评论管理
- **GIVEN** 后端已有博客评论提交、审核后发布到 GitHub Issue、重复审批拦截等能力
- **WHEN** root 或 reader 用户进入博客评论管理模块
- **THEN** Console 应支持查看评论列表、所属博客、评论内容、审核状态、GitHub 同步状态与失败原因
- **AND** 仅 root 用户可执行通过、拒绝、删除、重试同步等写操作

### Requirement: Console UI 应基于角色展示操作能力
- **GIVEN** 当前登录用户角色为 reader
- **WHEN** Console 渲染博客、留言板、评论等管理页面
- **THEN** 写操作按钮应隐藏或禁用，并说明当前账号仅可读取
- **AND** 前端权限展示不能替代服务端权限校验

### Requirement: 后台 API 应遵循既有 API 标准
- **GIVEN** Console 调用 NestJS 后台 API
- **WHEN** API 返回列表、错误或 Swagger 文档
- **THEN** 列表应复用统一分页响应格式，错误应复用统一异常格式，接口应可被 Swagger 文档发现
- **AND** 新增接口不应破坏现有公开内容 API 与主站展示行为
