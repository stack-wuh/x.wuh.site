# Spec: 博客分类查询

## ADDED

### Requirement: 博客列表支持分类查询
- **GIVEN** 用户访问博客列表页
- **WHEN** 用户选择一个分类 label
- **THEN** 页面跳转到包含 `labels=<label>` 的 `/blog` URL
- **AND** 列表仅展示该 label 下 open 状态的博客文章

### Requirement: 多标签 AND 分类查询
- **GIVEN** 用户访问博客列表页
- **WHEN** 用户选择多个 label 作为分类筛选条件
- **THEN** 页面 URL 包含全部已选 labels 查询参数
- **AND** 列表仅展示同时包含全部已选 labels 的 open 状态博客文章

### Requirement: 分类筛选状态可分享
- **GIVEN** 用户访问 `/blog?labels=frontend`
- **WHEN** 页面服务端渲染并请求博客列表数据
- **THEN** 请求参数包含 `state=open` 和 `labels=frontend`
- **AND** 页面展示当前筛选 token `frontend`

### Requirement: 多标签筛选状态可分享
- **GIVEN** 用户访问 `/blog?labels=javascript&labels=react`
- **WHEN** 页面服务端渲染并请求博客列表数据
- **THEN** 请求参数包含 `state=open` 和全部 labels
- **AND** 页面展示当前全部筛选 token

### Requirement: 分类入口展示完整 open 标签汇总
- **GIVEN** open 状态博客包含多个 Issue labels
- **WHEN** 用户打开博客列表页的 `Labels` 分类入口
- **THEN** 页面展示 open 状态博客的 labels 汇总
- **AND** 每个 label 包含名称和文章数量
- **AND** closed 状态 issues 的 labels 不参与汇总

### Requirement: 分类数量文案
- **GIVEN** open 状态博客包含 labels 汇总
- **WHEN** 用户打开博客列表页的分类过滤条
- **THEN** 每个分类选项以 `label(+count)` 格式展示名称和文章数量
- **AND** 外部已选 token 不展示文章数量
- **AND** 当用户选择一个或多个标签时，分类入口展示当前 AND 查询结果数，例如 `Labels(+2)`
- **AND** 当用户没有选择标签时，分类入口展示 `Labels`

### Requirement: 分类筛选与分页联动
- **GIVEN** 用户处于 `/blog?labels=frontend`
- **WHEN** 用户点击分页器进入第 2 页
- **THEN** 目标 URL 为 `/blog?labels=frontend&page=2`
- **AND** 当前分类筛选不会丢失

### Requirement: 多标签分类筛选与分页联动
- **GIVEN** 用户处于 `/blog?labels=javascript&labels=react`
- **WHEN** 用户点击分页器进入第 2 页
- **THEN** 目标 URL 保留全部已选 labels 并包含 `page=2`
- **AND** 当前多标签筛选不会丢失

### Requirement: 切换分类重置分页
- **GIVEN** 用户处于 `/blog?labels=frontend&page=3`
- **WHEN** 用户选择另一个分类 `nextjs`
- **THEN** 目标 URL 为 `/blog?labels=nextjs`
- **AND** 不保留旧的 `page=3`

### Requirement: 多个筛选 token 可单独移除
- **GIVEN** 用户处于 `/blog?labels=javascript&labels=react`
- **WHEN** 用户移除 `react` token
- **THEN** 页面跳转到仅保留 `javascript` 的筛选 URL
- **AND** 当最后一个 token 被移除时页面回到 `/blog`
- **AND** 外部已选 token 只展示标签名

### Requirement: GitHub Issues 风格过滤条
- **GIVEN** 博客列表页渲染
- **WHEN** 用户查看标题下方区域
- **THEN** 页面展示 GitHub Issues 风格的分类过滤条
- **AND** 过滤条包含 `Labels` 或 `Labels(+n)` 入口和当前筛选 token
- **AND** 过滤条背景、active、hover、token 状态与站点主题色保持一致
- **AND** 过滤条不展示 `open posts` 或 `filtered by` 结果提示文案

---

## MODIFIED

### Requirement: 博客列表分页 URL
- **GIVEN** 博客列表处于分类筛选状态
- **WHEN** 分页器生成页码链接
- **THEN** 页码链接保留当前全部 `labels` 查询参数
- **AND** 第 1 页链接省略 `page` 参数

---

## REMOVED

### Requirement: 无
- 本次不移除既有需求。
