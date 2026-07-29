# 修复博客详情页目录不展示

## 背景

博客详情页的目录组件完全不展示。根因是详情页当前优先使用 API 返回的 `body_html`；部分 `body_html` 中的标题没有经过 `rehypeSlug` 处理，因此标题缺少 `id`。`useToc` 只收集同时拥有文本和 `id` 的 `h1`/`h2`/`h3`，最终目录为空，桌面端和移动端目录都不会渲染。

## 目标

- 详情页优先从 Markdown `body` 通过统一 renderer 生成正文 HTML。
- 确保正文标题包含稳定的 `id` 和锚点，使目录能够正常生成和跳转。
- 保留 `body` 缺失时对有效 `body_html` 的兼容回退。
- 增加回归检查，防止详情页再次绕过统一 Markdown renderer 导致目录消失。

## 非目标（明确不做）

- 不修改后端内容同步、MongoDB 数据或历史文章数据。
- 不重写 `useToc`、目录样式或标题观察逻辑。
- 不新增第三方依赖或改变目录交互设计。

## 影响范围

- `packages/wuh.site.next/app/post/[number]/page.tsx` — 调整正文 HTML 的来源优先级。
- `packages/wuh.site.next/test/post-detail-runtime-regression.test.mjs` — 增加正文标题锚点回归检查。
- `openspec/specs/post/spec.md` — 补充目录生成与标题锚点规范。
