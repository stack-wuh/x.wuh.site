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
