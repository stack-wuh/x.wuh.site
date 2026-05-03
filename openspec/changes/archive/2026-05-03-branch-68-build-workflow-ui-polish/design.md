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
