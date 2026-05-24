# OpenSpec 规范索引

> 新需求开始前，先查阅此索引了解当前系统规范，避免设计与已有规范冲突。
> 每个领域列出核心需求和关键词，匹配后可深入阅读对应 spec.md。

## content-api — 内容 API
- **关键词:** 内容API, 分页, REST, 博客, 项目, 404, 查询参数, 相邻文章
- **需求:** Paginated response format, Post not found returns 404, Query parameter type coercion, Labels comma-separated, findAll returns PaginatedResult, Post detail includes prev/next adjacent posts
- **路径:** `openspec/specs/content-api/spec.md`

## repos-api — 仓库 API
- **关键词:** GitHub API, 仓库, 缓存, Octokit
- **需求:** Get GitHub repositories, 5-minute memory cache, Stale cache fallback
- **路径:** `openspec/specs/repos-api/spec.md`

## api-standardization — API 标准化
- **关键词:** API标准化, 前后端联调, OpenAPI, Swagger, 异常过滤器
- **需求:** GET /v2/repos, Swagger 文档自动生成, 统一异常过滤器, 前端使用 NestJS API
- **路径:** `openspec/specs/api-standardization/spec.md`

## design-system — 设计系统
- **关键词:** UI设计, 纸张风, 主题, CSS变量, 酒红, 素雅, 排版
- **需求:** 暖纸色系色板, 4分支CSS变量, CSS变量命名规范, HomeView重设计, PostView组件拆分, MarkdownBody排版
- **路径:** `openspec/specs/design-system/spec.md`

## blog-detail — 博客详情页
- **关键词:** 博客详情, 排版, 暗黑模式, WCAG, 对比度, 代码块
- **需求:** 正文字号与行高, 标题层级字号, 文字色彩对比度, 代码块可读性, 素雅Dark模式完整性
- **路径:** `openspec/specs/blog-detail/spec.md`

## blog-code-highlighting — 代码高亮
- **关键词:** 代码高亮, Markdown, unified, rehype, 服务端渲染
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/blog-code-highlighting/spec.md`

## blog-scroll-flicker-fix — 滚动闪屏修复
- **关键词:** 滚动, 性能, CSS动画, scroll-driven, 阅读进度
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/blog-scroll-flicker-fix/spec.md`

## contact-dialog — 联系弹窗
- **关键词:** 联系, QQ, 微信, 弹窗, 纸张风
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/contact-dialog/spec.md`

## icon-system — 图标系统
- **关键词:** 图标, lucide-react, Outline风格, SVG, 组件库
- **需求:** 统一Outline图标风格, 统一图标接口, 移除混用fill/stroke旧图标, Brand图标风格对齐
- **路径:** `openspec/specs/icon-system/spec.md`

## error-handling — 错误处理
- **关键词:** 错误处理, 异常, 过滤器, Swagger, Sentry
- **需求:** Global exception filter, Swagger API documentation
- **路径:** `openspec/specs/error-handling/spec.md`

## redesign-error-pages — 错误页面重设计
- **关键词:** 404, 500, 错误页面, editorial风格
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/redesign-error-pages/spec.md`

## build-config — 构建配置
- **关键词:** 构建, 环境变量, dotenv, MongoDB, health check, sync
- **需求:** dotenv环境变量加载, sync:init使用完整NestJS启动, MongooseModule异步工厂, health检查, sync仅同步open issues
- **路径:** `openspec/specs/build-config/spec.md`

## code-split — 代码拆分
- **关键词:** 代码拆分, 重构, About页面, 组件化
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/code-split/spec.md`

## openspec-workflow — 工作流规范
- **关键词:** OpenSpec, 工作流, propose, discuss, apply, review, archive
- **需求:** propose, discuss, apply, review, archive, 单一Skill入口
- **路径:** `openspec/specs/openspec-workflow/spec.md`
