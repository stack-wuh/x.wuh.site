# 博客多标签过滤体验优化

## 背景

当前博客列表页已经提供 `Labels` 分类入口，并展示 open 博客 labels 汇总，但筛选状态仍是单标签。用户无法叠加多个 label 精确查找同时包含多类主题的文章。

过滤条视觉也存在两个体验问题：标签汇总数量与标签名分离，阅读成本较高；过滤条背景色与主题色不够一致，active/hover/token 状态的主题感不统一。

## 目标

- 支持博客列表多 label 查询，多个 label 之间采用 AND 语义，即文章必须同时包含所有已选标签。
- 分类入口和标签选项展示数量提示：标签项显示为 `javascript(+8)`，已选标签时入口显示当前 AND 查询结果数，例如 `Labels(+2)`。
- 已选标签以多个纯标签名 token 展示，可单独移除某个标签，也可回到无筛选状态。
- 移除过滤条里的结果提示文案，例如 `6 open posts filtered by`。
- 过滤条、下拉、active、hover、token 背景色统一使用主题色相关 CSS 变量。

## 非目标（明确不做）

- 不实现 OR 语义的多标签查询。
- 不新增标签管理、排序切换、全文搜索或服务端标签颜色存储。
- 不改博客详情页文章内容渲染、文章卡片列表结构或分页器组件 API。

## 影响范围

- `packages/wuh.site.next/app/blog/page.tsx` — 解析多个 `labels` 查询参数，并传递给列表请求与视图组件。
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 支持多选标签 URL 生成、多个筛选 token、标签数量文案。
- `packages/wuh.site.next/app/blog/styles/index.ts` — 统一过滤条主题色背景、active/hover/token 状态样式。
- `packages/wuh.site.nest/src/modules/content/content.controller.ts` — 将多 label 查询语义调整为 AND。
- `packages/wuh.site.nest/src/modules/content/content.controller.spec.ts` — 覆盖多 label AND 查询条件。
- `openspec/specs/blog-category-filter/spec.md` — 更新博客分类查询交互规范。
- `openspec/specs/content-api/spec.md` — 更新内容 API labels 查询语义。
