# x.wuh.site

基于 Next.js 15 + React 19 + NestJS 10 + MongoDB 的个人博客 monorepo，使用 GitHub Issues 作为 CMS。

## 仓库结构

```
apps/
├── site               # 主站前端 (Next.js 15 App Router, port 3000)
├── server             # 后端 API (NestJS 10 + Mongoose 8, port 3200)
└── console            # 管理后台 (Vite + React)
packages/
├── components         # UI 组件库 @wuh.site/components
├── hooks              # 共享 hooks @wuh.site/hooks (useTheme, useFetch, useDialog, etc.)
├── core               # 核心共享 @wuh.site/core (DTO 类型 + API 端点 + 站点常量)
└── docs               # 文档预留
codex/                 # Codex 工作流历史，可参考但不再使用
```

## 技术栈

- **前端**: Next.js 15.1 (App Router), React 19.2, TypeScript 5, styled-components 6
- **后端**: NestJS 10, Mongoose 8, Octokit (GitHub API), Pino (日志), Sentry
- **数据库**: MongoDB (via Mongoose)
- **包管理**: pnpm workspace, lockfile v9
- **CI/CD**: GitHub Actions → Docker → SSH 部署
- **环境要求**: Node.js >= 20, pnpm >= 9

## 常用命令

```bash
# 前端
pnpm dev:next        # Next.js 开发服务器 (port 3000)
pnpm build:next      # 构建 Next.js
pnpm start:next      # 生产启动 Next.js

# 后端
pnpm dev:nest        # NestJS 开发服务器 (port 3200, watch 模式)
pnpm build:nest      # 构建 NestJS
pnpm start:nest      # 生产启动 NestJS
pnpm sync:init       # 从 GitHub Issues 全量同步数据到 MongoDB

# 全局
pnpm install         # 安装所有依赖
pnpm exec tsc --noEmit  # TypeScript 类型检查
```

## 开发规范

### 导入路径
- 组件导入使用 `@wuh.site/components/<name>`（如 `@wuh.site/components/button`）
- hooks 从 `packages/hooks` 导入
- 共享类型从 `@wuh.site/core` 导入
- 前端内部路径使用 `@/*` 别名映射到项目根目录

### 前端规范
- **客户端组件**: 交互式组件必须添加 `'use client'` 指令
- **SSR 安全**: 浏览器 API（`window`/`document`）需要 `typeof window !== 'undefined'` guard
- **样式**: 使用 styled-components 瞬态 props（`$` 前缀，如 `$variant`），CSS 变量主题令牌
- **主题**: `ThemeProvider` → `StyledComponentsRegistry` → `CssVariableStyles`（已在 app layout 中配置）
- **路由**: `/`(首页), `/blog`(博客列表), `/post/[number]`(博客详情), `/about`, `/design/system-color`
- **数据源**: GitHub API (repos, issues, markdown rendering)，使用 `fetch` + `revalidate` 做 ISR

### 后端规范
- **架构**: Module → Controller → Service → DTO/validation → Schema
- **DTO 验证**: 使用 class-validator 装饰器
- **日志**: 使用 Pino (`private logger = new Logger(ServiceName.name)`)
- **错误处理**: 使用 NestJS 内置异常 (`BadRequestException`, `NotFoundException` 等)
- **数据库**: 使用 Mongoose `lean()` 优化读取，Upsert 模式处理同步

### Monorepo 约定
- 保持包边界清晰，避免不必要的跨包耦合
- 小步快跑，优先多次小 PR
- 使用 conventional commits（commitlint 强制）

## 组件库清单

### 已实现组件
`Alert`, `Button`, `Card`, `Dialog`, `Empty`, `Skeleton`, `Result`, `Flex/Row/Column`, `Image`, `ImagePreview`, `LinkGroup`, `SharedLinkGroup`, `Tag`, `Message`, `AudioPlayer` (含 Provider + Mini Player + Panel), `Layout` (footer/main)

### 占位组件（使用前需实现）
`Col`, `ConfigProvider`, `Divider`, `FloatButton`, `Modal`, `Row`, `Space`, `Spin`, `VideoPlayer`

### Hooks
- `useDialog` - Dialog 打开/关闭状态，提供 `bind: { open, onClose }`
- `useImagePreview` - 图片预览索引/循环状态，提供 `bind: { open, currentIndex, onClose, onIndexChange }`
- `useTokens` / `useTheme` - 从 ThemeProvider context 获取主题令牌
- `useFetch` - 请求封装

## 后端模块架构

```
src/modules/
├── content/      # 内容管理 (博客/项目 CRUD)
├── comment/      # 留言系统 (匿名评论 -> GitHub sync)
├── sync/         # GitHub Issues 全量/增量同步
├── webhook/      # GitHub Webhook 事件处理
├── rss/          # RSS 2.0 订阅源
├── user/         # 用户角色管理 (root/writer/reader)
├── auth/         # GitHub OAuth + JWT
├── admin/        # 管理接口
├── repos/        # GitHub 仓库数据
├── weread/       # 微信读书书架同步与展示
└── api-v2/       # 新版统一 API
```

## Knowledge 沉淀

- 长期有效的项目事实进入 `shadow-docs/knowledge/`，并通过 `shadow-docs/menu.md` 路由。
- 单次问题、调查过程和验证结果留在当前 change brief。
- 跨项目稳定经验进入 shadow-dev-workflow `knowledge/`。
- 项目外 memory 不作为执行依据；未复现或已失效的临时故障不沉淀为 active Knowledge。
