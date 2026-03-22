# x.wuh.site

基于 `Next.js 15 + React 19 + styled-components` 的个人站点 monorepo，包含站点应用、组件库、共享 hooks 与类型配置。内容主要来自 GitHub Issues（博客）与 GitHub Repos（项目）。

## 亮点

- **GitHub Issues 作为 CMS**：博客列表与详情直接读取 Issues，支持分页与详情渲染。
- **App Router + ISR**：页面数据采用 `fetch` + `revalidate`，兼顾性能与新鲜度。
- **统一组件与主题**：`@wuh.site/components` 提供 UI 组件和主题变量体系。
- **错误与加载体验**：提供 Result 组件与骨架屏，提升 404/500 与页面切换体验。

## 仓库结构

```text
.
├── packages
│   ├── wuh.site.next     # 主站应用 (Next.js)
│   ├── components        # 组件库（@wuh.site/components）
│   ├── hooks             # 共享 hooks
│   ├── config            # 类型/配置包（@wuh.site/config）
│   └── docs              # 文档预留
├── codex                 # Codex 任务计划/技能文档
└── README.md
```

## 技术栈

- Next.js 15（App Router）
- React 19
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
# 启动 Next 应用
pnpm dev:next

# 构建 Next 应用
pnpm build:next

# 生产环境启动
pnpm start:next

# Lint（仅 next 包）
pnpm --filter @wuh.site/next run lint

# 生成 changelog
pnpm changelog

# 语义化版本（major/minor/patch）
pnpm version:major
pnpm version:minor
pnpm version:patch
```

> 说明：根目录里 `dev:web`、`build:web`、`dev:astro` 等脚本属于历史遗留，不是当前推荐入口。

## 页面与路由

- `/`：首页（展示 GitHub 仓库与精选博客）
- `/blog`：博客列表（Issues 分页、按创建时间倒序）
- `/post/[number]`：博客详情（Issues 单篇 + GitHub Markdown 渲染）
- `/about`：关于页
- `/design/system-color`：色彩系统展示页
- `not-found`/`error`：全局 404/500 处理

## 数据来源与缓存

- GitHub Repos：`https://api.github.com/users/stack-wuh/repos`
- GitHub Issues：`https://api.github.com/repos/stack-wuh/blog/issues`
- Markdown 渲染：`https://api.github.com/markdown`

所有请求使用 `fetch` 并设置 `revalidate`，避免频繁请求。

> 注意：本地频繁刷新可能触发 GitHub 匿名请求频率限制，列表与详情可能返回空数据。

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

## 提交规范

- `commit-msg` hook 使用 `pnpm exec commitlint` 校验提交信息。
- 支持的 commit type：`build`、`feat`、`chore`、`style`、`docs`、`ui`、`fix`、`refactor`、`ci`、`test`。

## License

ISC
