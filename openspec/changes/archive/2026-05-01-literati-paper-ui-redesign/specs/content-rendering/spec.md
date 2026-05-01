# Content Rendering

## ADDED

### Requirement: 前端 markdown 回退渲染
当 blog bodyHtml 缺失时，前端使用 marked 库渲染 markdown body。

- **GIVEN** API 返回文章数据，bodyHtml 为空
- **WHEN** PostView 组件渲染文章内容
- **THEN** 使用 `marked.parse(body)` 生成 HTML，再提取目录并渲染

### Requirement: PostView renderedHtml memo
PostView 新增 renderedHtml memo 统一处理 HTML 内容源。

- **GIVEN** issue 数据包含 body 和 body_html 字段
- **WHEN** PostView 挂载
- **THEN** renderedHtml = body_html ? body_html : body ? marked.parse(body) : ''

### Requirement: 独立数据同步脚本
同步脚本从数据库同步与 issue 同步，绕过 NestJS 启动。

- **GIVEN** `pnpm sync:init` 执行
- **WHEN** node 运行 scripts/sync-init.mjs
- **THEN** 直接连接 Mongoose + Octokit，从 GitHub Issues 同步数据到 MongoDB

## MODIFIED

### Requirement: 博客详情页面内容展示
详情页正确渲染博客内容，无论是 HTML 还是 markdown 格式。

- **GIVEN** 用户访问 /post/[number]
- **WHEN** 页面加载文章数据
- **THEN** 无论 bodyHtml 是否存在，内容均可正常渲染显示
