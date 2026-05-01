# Proposal: 前后端联调 - OpenAPI 标准化 + 接口迁移

## 动机

当前前端直接调用 GitHub API 获取数据（repos、issues、markdown 渲染），存在以下问题：

- **耦合过紧**：前端与 GitHub API 强绑定，接口格式变化直接影响渲染
- **无契约层**：前后端之间缺乏可追溯的接口文档
- **后端不完整**：后端缺少 repos 接口，异常处理和分页格式不统一

## 变更范围

### 后端 (packages/wuh.site.nest)
1. 创建 common 基础设施（分页接口、异常过滤器）
2. 修复 DTO 类型转换问题（page/limit @Type, labels @Transform）
3. 标准化分页响应格式 `PaginatedResult<T>`
4. 接入 OpenAPI/Swagger，挂载 `/v2/docs`
5. 新增 `/v2/repos` 接口（Octokit + 5min 内存缓存）

### 前端 (packages/wuh.site.next)
6. 创建类型安全的 API 层 `app/lib/api.ts`
7. 三大页面从 GitHub API 迁移至后端接口
8. `next.config.ts` 添加 `/api/*` → NestJS rewrite

### 共享 (packages/shared-contracts)
9. 新增 `ContentItem`、`RepoDto`、`PaginatedResult<T>`、`PaginationMeta` 类型

## 非目标

- 不涉及 auth/user/admin 模块的接口调整
- 不涉及评论功能的前端集成
- 不涉及 RSS 订阅源的前端展示
