# Proposal: 分支 68 — 构建调整 + UI 重设计 + 工作流体系

> 原始变更名：`2026-05-03-branch-68-build-workflow-ui-polish`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
分支 68 是该 monorepo 的基础设施和体验升级分支，覆盖四大领域：

1. **构建与环境变量**: nest 项目构建脚本依赖手动设置环境变量，启动不稳定
2. **API 标准化**: 前后端 API 缺乏统一契约，错误处理不一致
3. **协同工作流**: 缺乏规格驱动的 AI 协同开发流程
4. **UI 体验**: 首页和博客详情页视觉风格与文青写作气质不匹配

## 引用规范
- `specs/api-standardization/spec.md`
- `specs/build-config/spec.md`
- `specs/design-system/spec.md`
- `specs/openspec-workflow/spec.md`

## 决策
- **dotenv 注入**: 所有 nest 命令通过 `dotenv-cli` / `cross-env` 加载 `.env`
- **AppModule 启动**: `sync:init` 改为完整 NestJS bootstrap，走同样的 ConfigService → MongooseModule 路径
- **异步工厂**: MongooseModule 改为 `forRootAsync` + `useFactory` 从 ConfigService 读取配置
- **Health 检查**: 增强 `/health` 端点返回 MongoDB 连接状态
- **Sync 过滤**: GitHub issues 只同步 `state: 'open'`，减少数据量

- nest 脚本 (`dev`, `start`, `sync:init`) 不加载 `.env`，导致 MongoDB URI 等关键环境变量缺失
- `sync:init` 直接调 MongooseModule.forRoot() 绕过 ConfigService，时序不统一
- MongoDB 连接时序依赖隐式顺序，content 模块先于 MongoDB 连接完成即报 500

## 任务
### Phase 1: 构建与环境变量
- [x] 调整包的构建模式，nest 接入 dotenv 加载 `.env`
- [x] `sync:init` 脚本改用完整 AppModule 启动 (ConfigService → MongooseModule)
- [x] MongooseModule 改用 ConfigService 异步工厂 (`forRootAsync` + `useFactory`)
- [x] health 检查增强，返回 MongoDB 连接状态
- [x] GitHub sync 仅同步 open 状态 issues
- [x] 依赖升级: `@nestjs/cli` ^10.4.9, 新增 `cross-env`/`dotenv-cli`
### Phase 2: API 标准化
- [x] OpenAPI 标准化 — NestJS SwaggerModule 生成 `/api-docs`
- [x] repos 接口 — `GET /v2/repos` 返回 GitHub 仓库列表
- [x] 前端 API 迁移 — HomeView/BlogListView 改用 NestJS API
### Phase 3: OpenSpec 工作流体系
- [x] 接入 OpenSpec 规格驱动开发工作流
- [x] 中文 command 别名，自然语言驱动
- [x] 中文 OpenSpec 命令合并为单一 Skill (`openspec-cn`)
- [x] 新增代码审查 (review) 环节，含 ESLint 自动检查
- [x] apply 环节新增耗时预估 + 并行 Agent 执行
- [x] 工作流精简 7 步 → 5 步，失败回环机制
- [x] smart-commit 规则优化，强制 docs/feat 分拆提交
- [x] 联调变更归档 + 更新项目文档入口
### Phase 4: 文青纸张风 UI 重设计
- [x] 设计令牌改造 — generator-color.ts 重写文青暖纸色系
- [x] CSS 变量 4 分支覆盖 (light/dark × root/plain)
- [x] 首页文青纸张风 UI 重新设计 (HomeView.tsx 重写)
- [x] 博客详情页文青纸张风重设计 + 拆分 PostView 组件
- [x] 前端 marked 解析 markdown，修复详情页 bodyHtml 空白
- [x] MarkdownBody 排版细化（字体/间距/表格/引用块/代码块）
- [x] 修复 `--text-color` CSS 变量引用 (`background.light[100]` → `normal.light[900]`)
- [x] 博客详情页变更文档归档

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-03
```

### `design.md`
# Design: 分支 68 技术方案

## 1. 构建与环境变量

### 问题
- nest 脚本 (`dev`, `start`, `sync:init`) 不加载 `.env`，导致 MongoDB URI 等关键环境变量缺失
- `sync:init` 直接调 MongooseModule.forRoot() 绕过 ConfigService，时序不统一
- MongoDB 连接时序依赖隐式顺序，content 模块先于 MongoDB 连接完成即报 500

### 方案
- **dotenv 注入**: 所有 nest 命令通过 `dotenv-cli` / `cross-env` 加载 `.env`
- **AppModule 启动**: `sync:init` 改为完整 NestJS bootstrap，走同样的 ConfigService → MongooseModule 路径
- **异步工厂**: MongooseModule 改为 `forRootAsync` + `useFactory` 从 ConfigService 读取配置
- **Health 检查**: 增强 `/health` 端点返回 MongoDB 连接状态
- **Sync 过滤**: GitHub issues 只同步 `state: 'open'`，减少数据量

## 2. API 标准化

### 问题
- 前端直连 GitHub GraphQL API，路由与 NestJS 接口混用
- 无统一错误格式、无 API 文档
- 缺少 repos 接口，前端需自行拼装 GitHub project 数据

### 方案
- **OpenAPI/Swagger**: NestJS SwaggerModule 生成 `/api-docs`
- **Repos 接口**: `GET /v2/repos` — 从 GitHub API 拉取仓库列表并缓存
- **前端迁移**: `HomeView`、`BlogListView` 等组件改用 NestJS API 替代 GitHub GraphQL
- **错误标准化**: 统一异常过滤器 + 共享 DTO 类型

## 3. OpenSpec 工作流体系

### 问题
- AI 协同开发缺乏标准化流程
- 需求、设计、执行、审查、归档各环节割裂

### 方案
- **5 环节工作流**: propose → discuss → apply → review → archive
- **中文 Skill**: 单文件 `openspec-cn` Skill，自然语言意图路由
- **Review 环节**: ESLint 自动检查 + 需求覆盖验证 + 代码质量审查
- **并行执行**: apply 阶段无依赖 task 并行 Agent 执行，带动耗时预估
- **失败回环**: review 审查不通过自动回到 apply 修复

## 4. 文青纸张风 UI

### 设计令牌
- **色板重写**: `generator-color.ts` — 暖赭 (primary) + 象牙纸底 (background) + 深棕墨迹 (normal)
- **CSS 变量**: 4 分支覆盖 — `:root` light/dark + `[data-theme='plain']` light/dark
- **排版**: 衬线字体 `font-serif` 栈，增大行高和间距

### 首页
- `HomeView.tsx` 完全重写：Hero 区域 + 格言展示 + CTA + 社交链接组 + 博客时间线 + 项目列表
- 装饰分隔线 (OrnamentDivider) 划分 section

### 博客详情页
- `PostView.tsx` 拆分：Header/MarkdownBody/ShareCard 独立子组件
- `marked` 前端解析 markdown → sanitized HTML
- MarkdownBody 排版：字体/间距/表格/引用块/代码块全面细化

### `proposal.md`
# Proposal: 分支 68 — 构建调整 + UI 重设计 + 工作流体系

## 动机

分支 68 是该 monorepo 的基础设施和体验升级分支，覆盖四大领域：

1. **构建与环境变量**: nest 项目构建脚本依赖手动设置环境变量，启动不稳定
2. **API 标准化**: 前后端 API 缺乏统一契约，错误处理不一致
3. **协同工作流**: 缺乏规格驱动的 AI 协同开发流程
4. **UI 体验**: 首页和博客详情页视觉风格与文青写作气质不匹配

## 变更范围

### Phase 1: 构建与环境变量 (packages/wuh.site.nest)
1. nest 所有启动命令接入 dotenv 加载 `.env`
2. `sync:init` 脚本改用完整 AppModule 启动
3. MongooseModule 改用 ConfigService 异步工厂，修复 MongoDB 连接时序 500
4. health 检查增强 + GitHub sync 仅同步 open 状态 issues
5. 依赖调整: 新增 `cross-env`、`dotenv-cli`；`@nestjs/cli` 升级至 ^10.4.9

### Phase 2: API 标准化 (packages/wuh.site.nest + shared-contracts)
6. OpenAPI 标准化: Swagger 文档生成
7. repos 接口: 返回 GitHub 仓库列表
8. 前端 API 从 GitHub GraphQL 迁移至自有 NestJS API

### Phase 3: OpenSpec 工作流体系
9. 接入 OpenSpec 规格驱动开发工作流
10. 中文命令别名 + 合并为单一 Skill
11. 新增代码审查 (review) 环节 + ESLint 检查
12. apply 环节新增耗时预估 + 并行 Agent 执行
13. 工作流精简 7 步 → 5 步，失败回环机制
14. smart-commit 规则优化（docs/feat 分拆）

### Phase 4: 文青纸张风 UI 重设计
15. 首页完全重写: 小 Hero + 格言区 + CTA + 时间线博客
16. 博客详情页重设计: 拆分 PostView 组件，纸张风格排版
17. 前端 marked 解析 markdown，修复详情页 bodyHtml 空白
18. MarkdownBody 排版细化（字体、间距、表格、引用块、代码块）
19. 修复 `--text-color` CSS 变量引用错误的 theme 字段

## 非目标

- 不改变双主题切换机制 (money/plain)
- 不更换外部字体
- 不动后端 NestJS 接口契约（仅新增 repos 接口）

### `specs/api-standardization/spec.md`
# API Standardization

## ADDED: repos 接口

### Requirement: GET /v2/repos
- **GIVEN** 已认证的 GitHub API 访问权限
- **WHEN** 请求 `GET /v2/repos`
- **THEN** 返回 GitHub 仓库列表 (name, description, stars, language, url)
- **AND** 结果按 stars 降序排列
- **AND** 包含缓存层减少 GitHub API 调用

## MODIFIED: OpenAPI 文档

### Requirement: Swagger 文档自动生成
- **GIVEN** NestJS SwaggerModule 已配置
- **WHEN** 访问 `/api-docs`
- **THEN** 展示所有 API 端点的交互式文档
- **AND** DTO schema 自动从 class-validator 装饰器推断

## MODIFIED: 错误处理标准化

### Requirement: 统一异常过滤器
- **GIVEN** 任何 NestJS 异常抛出
- **WHEN** 请求处理中发生错误
- **THEN** 返回统一格式 `{ statusCode, message, timestamp, path }`
- **AND** 日志通过 Pino 记录

## MODIFIED: 前端 API 迁移

### Requirement: 前端使用 NestJS API
- **GIVEN** HomeView / BlogListView 等前端组件
- **WHEN** 组件挂载并请求数据
- **THEN** 通过 NestJS API (port 3200) 而非 GitHub GraphQL API 获取数据
- **AND** 请求通过 `fetch` + ISR `revalidate` 策略

### `specs/build-config/spec.md`
# Build Config

## MODIFIED: nest 启动命令

### Requirement: dotenv 环境变量加载
- **GIVEN** nest 项目需要 `.env` 中的 MongoDB URI 等配置
- **WHEN** 执行 `pnpm dev:nest` / `pnpm start:nest` / `pnpm sync:init`
- **THEN** dotenv 自动加载项目根目录 `.env` 文件
- **AND** 环境变量可通过 `process.env.*` 访问

### Requirement: sync:init 使用完整 NestJS 启动
- **GIVEN** 需要从 GitHub Issues 全量同步数据
- **WHEN** 执行 `pnpm sync:init`
- **THEN** 走完整 NestJS bootstrap → AppModule → ConfigService → MongooseModule
- **AND** 不再绕过 NestJS 独立连接 MongoDB

### Requirement: MongooseModule 异步工厂
- **GIVEN** MongoDB 连接需要从 ConfigService 读取配置
- **WHEN** AppModule 初始化
- **THEN** MongooseModule 使用 `forRootAsync` + `useFactory` 从 ConfigService 获取 URI
- **AND** 连接时序与 IoC 容器其他依赖一致

### Requirement: health 检查 MongoDB 状态
- **GIVEN** `/health` 端点
- **WHEN** 请求到达
- **THEN** 返回 MongoDB 连接状态 (connected/disconnected)
- **AND** HTTP 200 正常 / 503 连接异常

### Requirement: sync 仅同步 open issues
- **GIVEN** GitHub Issues 作为 CMS 数据源
- **WHEN** 执行增量/全量同步
- **THEN** 仅拉取 `state: 'open'` 的 issues
- **AND** 已关闭的 issues 不同步

### `specs/design-system/spec.md`
# Design System

## MODIFIED: 文青纸张风设计令牌

### Requirement: 暖纸色系色板
- **GIVEN** 设计令牌生成器 `generator-color.ts`
- **WHEN** 应用构建
- **THEN** primary 使用暖赭色系 (#C89060 + 9 级色阶)
- **AND** normal 使用深棕墨迹色系 (#2A2218 文本 / #9B8D78 辅助)
- **AND** background 使用象牙纸底色系 (#FFFDF9 卡片 / #F2EDE4 页面)
- **AND** 每个色系包含 light 和 dark 两套

### Requirement: 4 分支 CSS 变量
- **GIVEN** `cssVariableProvider.tsx` 全局样式
- **WHEN** 浏览器加载页面
- **THEN** `:root` 注入基础 (money 模式) light 变量
- **AND** `:root[data-theme='plain']` 注入文青纸风格 light 覆盖
- **AND** `@media (prefers-color-scheme: dark) :root` 注入 dark 变量
- **AND** `@media (prefers-color-scheme: dark) :root[data-theme='plain']` 注入 plain dark 覆盖

### Requirement: CSS 变量命名规范
- **GIVEN** 组件使用 CSS 变量
- **THEN** 颜色: `--primary-color`, `--primary-{100-900}`, `--normal-{100-900}`, `--background-{100-900}`
- **AND** 语义: `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-color`
- **AND** 排版: `--font-serif`, `--font-size-{scale}`, `--space-{scale}`
- **AND** 视觉: `--elevation-{soft|card|card-hover}`, `--radius-card`, `--page-bg`

## MODIFIED: 首页组件

### Requirement: HomeView 重设计
- **GIVEN** 用户访问首页 `/`
- **WHEN** 页面渲染
- **THEN** 展示: 小 Hero (头像+引言) → 格言区 → CTA 按钮组 → 社交链接 → 博客时间线 → 项目列表 → 页脚
- **AND** 装饰分隔线 (OrnamentDivider) 划分各 section
- **AND** 博客列表以单列时间线展示代替卡片网格

## MODIFIED: 博客详情页

### Requirement: PostView 组件拆分
- **GIVEN** 用户访问博客详情 `/post/[number]`
- **WHEN** 页面渲染
- **THEN** 拆分独立子组件: PostHeader / MarkdownBody / ShareCard
- **AND** 样式使用文青纸张风排版（衬线字体、增大的行高和间距）

### Requirement: marked 前端解析 markdown
- **GIVEN** GitHub API 不再返回 `body_html`
- **WHEN** 获取到 issue body (原始 markdown)
- **THEN** 前端使用 `marked` 库解析为 HTML
- **AND** 通过 sanitize 处理 XSS 风险
- **AND** 渲染到 MarkdownBody 组件

### Requirement: MarkdownBody 排版细化
- **GIVEN** 解析后的 HTML 内容
- **WHEN** MarkdownBody 组件渲染
- **THEN** 标题使用衬线字体、适当字重
- **AND** 代码块使用暗色背景 + 圆角 + 复制按钮
- **AND** 表格有边框、斑马纹、溢出处理
- **AND** 引用块有左侧色条 + 斜体 + 背景色
- **AND** 链接使用虚线下划线，hover 变实线
- **AND** 图片有圆角 + 阴影 + 边框

### `specs/openspec-workflow/spec.md`
# OpenSpec Workflow

## ADDED: 5 环节中文工作流

### Requirement: propose — 创建新需求
- **GIVEN** 用户描述新功能或修复需求
- **WHEN** 用户说 "新需求" / "propose"
- **THEN** 自动创建变更目录，生成 proposal.md + design.md + tasks.md + specs/
- **AND** 所有文档使用中文，关键字保留英文

### Requirement: discuss — 需求讨论
- **GIVEN** 已有 OpenSpec change
- **WHEN** 用户说 "需求讨论" / "discuss" / "explore"
- **THEN** 进入只讨论模式，读取代码/搜索调研，不写代码
- **AND** 按需求/架构方向自适应深度

### Requirement: apply — 开始执行
- **GIVEN** proposal + design + tasks 已明确
- **WHEN** 用户说 "开始执行" / "apply"
- **THEN** 按 tasks.md 顺序执行，同 Phase 无依赖 task 并行 Agent
- **AND** 每个 task 显示预估耗时和实际耗时
- **AND** 失败 task 不阻塞独立 task

### Requirement: review — 代码审查
- **GIVEN** apply 所有 task 已完成
- **WHEN** 用户说 "代码审查" / "review"
- **THEN** 执行 7 维度审查: 任务完成度/需求覆盖/设计一致性/ESLint/代码质量/安全性/性能
- **AND** ESLint error → 阻塞；warning → 用户决定
- **AND** 审查不通过 → 自动回环到 apply 修复阻塞项

### Requirement: archive — 归档
- **GIVEN** review 通过或用户决定归档
- **WHEN** 用户说 "归档" / "archive"
- **THEN** 变更目录移入 `openspec/changes/archive/`
- **AND** specs 合并到 `openspec/specs/`

## MODIFIED: 工作流精简

### Requirement: 7 步 → 5 步
- **GIVEN** 原始 7 步工作流 (init → research → plan → implement → test → review → done)
- **WHEN** 工作流触发
- **THEN** 精简为 5 步 (propose → discuss → apply → review → archive)
- **AND** test 合并入 review 环节

## MODIFIED: Skill 架构

### Requirement: 单一 Skill 入口
- **GIVEN** 多个独立 openspec 命令 Skill
- **WHEN** 用户调用任意 openspec 命令
- **THEN** 通过单一 `openspec-cn` Skill 路由到对应子流程
- **AND** 自然语言意图识别自动匹配

### `tasks.md`
# Tasks: 分支 68

## Phase 1: 构建与环境变量

- [x] 调整包的构建模式，nest 接入 dotenv 加载 `.env`
- [x] `sync:init` 脚本改用完整 AppModule 启动 (ConfigService → MongooseModule)
- [x] MongooseModule 改用 ConfigService 异步工厂 (`forRootAsync` + `useFactory`)
- [x] health 检查增强，返回 MongoDB 连接状态
- [x] GitHub sync 仅同步 open 状态 issues
- [x] 依赖升级: `@nestjs/cli` ^10.4.9, 新增 `cross-env`/`dotenv-cli`

## Phase 2: API 标准化

- [x] OpenAPI 标准化 — NestJS SwaggerModule 生成 `/api-docs`
- [x] repos 接口 — `GET /v2/repos` 返回 GitHub 仓库列表
- [x] 前端 API 迁移 — HomeView/BlogListView 改用 NestJS API

## Phase 3: OpenSpec 工作流体系

- [x] 接入 OpenSpec 规格驱动开发工作流
- [x] 中文 command 别名，自然语言驱动
- [x] 中文 OpenSpec 命令合并为单一 Skill (`openspec-cn`)
- [x] 新增代码审查 (review) 环节，含 ESLint 自动检查
- [x] apply 环节新增耗时预估 + 并行 Agent 执行
- [x] 工作流精简 7 步 → 5 步，失败回环机制
- [x] smart-commit 规则优化，强制 docs/feat 分拆提交
- [x] 联调变更归档 + 更新项目文档入口

## Phase 4: 文青纸张风 UI 重设计

- [x] 设计令牌改造 — generator-color.ts 重写文青暖纸色系
- [x] CSS 变量 4 分支覆盖 (light/dark × root/plain)
- [x] 首页文青纸张风 UI 重新设计 (HomeView.tsx 重写)
- [x] 博客详情页文青纸张风重设计 + 拆分 PostView 组件
- [x] 前端 marked 解析 markdown，修复详情页 bodyHtml 空白
- [x] MarkdownBody 排版细化（字体/间距/表格/引用块/代码块）
- [x] 修复 `--text-color` CSS 变量引用 (`background.light[100]` → `normal.light[900]`)
- [x] 博客详情页变更文档归档
