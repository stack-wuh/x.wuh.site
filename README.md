# x.wuh.site

基于 `Next.js 15 + React 19 + NestJS 10 + MongoDB` 的个人站点 monorepo，包含前端应用、后端 API、组件库、共享 hooks 与类型配置。内容通过 NestJS 后端聚合 GitHub Issues（博客）与 GitHub Repos（项目）。

## 亮点

- **GitHub Issues 作为 CMS**：通过 NestJS 后端聚合 Issues 与 Repos，前端调用统一 API。
- **App Router + ISR**：页面数据采用 `fetch` + `revalidate`，兼顾性能与新鲜度。
- **OpenAPI/Swagger**：后端挂载 `/v2/docs`，接口契约清晰可追溯。
- **统一组件与主题**：`@wuh.site/components` 提供 UI 组件和主题变量体系。
- **错误与加载体验**：提供 Result 组件与骨架屏，提升 404/500 与页面切换体验。

## 仓库结构

```text
.
├── packages
│   ├── wuh.site.next     # 前端 (Next.js 15 App Router)
│   ├── wuh.site.nest     # 后端 (NestJS 10 + Mongoose 8)
│   ├── components        # 组件库（@wuh.site/components）
│   ├── hooks             # 共享 hooks
│   ├── config            # 类型/配置包（@wuh.site/config）
│   ├── shared-contracts  # 前后端共享 DTO 类型
│   └── docs              # 文档预留
├── openspec              # OpenSpec 规格与变更记录
└── README.md
```

## 技术栈

- Next.js 15（App Router）
- React 19
- NestJS 10
- MongoDB (Mongoose 8)
- TypeScript 5
- styled-components 6
- pnpm workspace（lockfile v9）
- Husky + Commitlint

## 环境要求

- Node.js `>= 20`
- pnpm `>= 9`

## 快速开始

```bash
pnpm install
pnpm dev:next
```

默认访问：`http://localhost:3000`

## 常用命令

```bash
# 前端 (port 3000)
pnpm dev:next        # 启动 Next.js 开发服务器
pnpm build:next      # 构建 Next.js
pnpm start:next      # 生产启动 Next.js

# 后端 (port 3200)
pnpm dev:nest        # 启动 NestJS 开发服务器 (watch 模式)
pnpm build:nest      # 构建 NestJS
pnpm start:nest      # 生产启动 NestJS
pnpm sync:init       # GitHub Issues 全量同步到 MongoDB

# 全局
pnpm exec tsc --noEmit  # TypeScript 类型检查
```

> 根目录 `dev:web`、`build:web`、`dev:astro` 等脚本属于历史遗留，不推荐使用。

## 页面与路由

- `/`：首页（展示 GitHub 仓库与精选博客）
- `/blog`：博客列表（Issues 分页、按创建时间倒序）
- `/post/[number]`：博客详情（Issues 单篇 + GitHub Markdown 渲染）
- `/about`：关于页
- `/design/system-color`：色彩系统展示页
- `not-found`/`error`：全局 404/500 处理

## 数据来源与缓存

- 前端通过 Next.js rewrite 代理到 NestJS 后端（`/api/*` → `localhost:3200/v2/*`）
- 后端聚合 GitHub API（Repos、Issues），5 分钟内存缓存 + stale fallback
- 所有请求使用 `fetch` + `revalidate`，避免频繁请求

> API 文档：启动后端后访问 `http://localhost:3200/v2/docs` 查看 Swagger UI。

## 组件库使用示例

```tsx
import Button from '@wuh.site/components/button'

export default function Demo() {
  return <Button variant='filled'>Hello</Button>
}
```

常用组件：
- `Result`：404/500 引导页组件
- `Skeleton`：骨架屏加载组件
- `Button`/`Card`/`Tag`/`Empty` 等基础 UI

更多组件可查看 `packages/components/*/readme.md`。

## 团队协作

详细的开发流程、OpenSpec 工作流、目录结构说明和提交规范见 **[CONTRIBUTING.md](./CONTRIBUTING.md)**。

## License

ISC
