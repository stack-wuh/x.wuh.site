# x.wuh.site

基于 `Next.js 15 + React 19 + styled-components` 的个人站点 monorepo，包含站点应用、组件库、共享 hooks 与类型配置。

## 项目概览

- 首页聚合 GitHub 仓库与文章信息。
- 博客详情页通过 GitHub Issues API 拉取内容并渲染 Markdown。
- 组件与主题能力拆分到 `@wuh.site/components`，支持统一设计 token。
- 使用 `pnpm workspace` 管理多包依赖。

## 技术栈

- Next.js 15（App Router）
- React 19
- TypeScript 5
- styled-components 6
- pnpm workspace（lockfile v9）
- Husky + Commitlint（提交信息校验）

## 仓库结构

```text
.
├── packages
│   ├── wuh.site.next     # 主站应用
│   ├── components        # 组件库（@wuh.site/components）
│   ├── hooks             # 共享 hooks（按目录管理）
│   ├── config            # 类型/配置包（@wuh.site/types）
│   └── docs              # 预留目录
├── codex                 # Codex 任务与技能相关文档
└── README.md
```

## 快速开始

### 环境要求

- Node.js `>= 20`（建议）
- pnpm `>= 9`

### 安装依赖

```bash
pnpm install
```

### 启动开发

```bash
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

## 页面与数据来源

- `/`：首页（拉取 `stack-wuh` GitHub 仓库与博客 issue 列表）
- `/post/[number]`：博客详情（读取单篇 issue 并调用 GitHub Markdown API 渲染）
- `/about`：关于页
- `/design/system-color`：色彩系统展示页

因为依赖 GitHub API，本地开发若频繁刷新可能触发匿名请求频率限制。

## 组件库使用示例

```tsx
import Button from '@wuh.site/components/button'

export default function Demo() {
  return <Button variant='filled'>Hello</Button>
}
```

更多组件可查看 [`packages/components`](./packages/components) 下各组件目录的 `readme.md`。

## 提交规范

- `commit-msg` hook 使用 `pnpm exec commitlint` 校验提交信息。
- 支持的 commit type：`build`、`feat`、`chore`、`style`、`docs`、`ui`、`fix`、`refactor`、`ci`、`test`。

## License

ISC
