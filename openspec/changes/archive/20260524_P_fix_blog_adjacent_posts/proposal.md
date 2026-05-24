# 优化博客详情页底部上一条/下一条的数据来源

## 动机

博客详情页（`/post/[number]`）底部的「上一条/下一条」导航使用 `issueNumber ± 1` 查找相邻文章，与 `/blog` 列表页的数据源和排序规则不一致。

`/blog` 列表页按 `createdAtGitHub` 降序排列，只展示 `state: 'open'` 的文章。而详情页的 prev/next 仅基于 GitHub Issue 编号 ±1，存在以下问题：

- Issue 编号可能存在空缺（PR、已删除 Issue、非博客文章）
- Issue 编号顺序不等于发布时间顺序
- 未过滤 `state`，可能导航到已关闭的文章

## 变更范围

- 后端新增 `ContentService.findAdjacentPosts` 方法，基于 `createdAtGitHub` 排序查找前后文章
- 后端 `ContentController.getPostDetail` 在响应中附带 `prev`/`next`
- 前端删除 `getAdjacentIssue` 函数，直接从 API 响应获取 prev/next
- 前端 `PostView` / `PostToolbar` 组件无需改动（props 接口保持不变）

## 非目标

- 不修改 `/blog` 列表页的排序逻辑
- 不修改 `PostToolbar` 的 UI 样式
- 不新增 API 端点
