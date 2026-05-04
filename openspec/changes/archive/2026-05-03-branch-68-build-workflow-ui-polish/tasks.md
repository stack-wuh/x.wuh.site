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
