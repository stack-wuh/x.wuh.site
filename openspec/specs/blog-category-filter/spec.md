# Spec: 博客分类查询

## ADDED

### Requirement: 博客列表支持分类查询
- **GIVEN** 用户访问博客列表页
- **WHEN** 用户选择一个分类 label
- **THEN** 页面跳转到包含 `labels=<label>` 的 `/blog` URL
- **AND** 列表仅展示该 label 下 open 状态的博客文章

### Requirement: 分类筛选状态可分享
- **GIVEN** 用户访问 `/blog?labels=frontend`
- **WHEN** 页面服务端渲染并请求博客列表数据
- **THEN** 请求参数包含 `state=open` 和 `labels=frontend`
- **AND** 页面展示当前筛选 token `frontend`

### Requirement: 分类入口展示完整 open 标签汇总
- **GIVEN** open 状态博客包含多个 Issue labels
- **WHEN** 用户打开博客列表页的 `Labels` 分类入口
- **THEN** 页面展示 open 状态博客的 labels 汇总
- **AND** 每个 label 包含名称和文章数量
- **AND** closed 状态 issues 的 labels 不参与汇总

### Requirement: 分类筛选与分页联动
- **GIVEN** 用户处于 `/blog?labels=frontend`
- **WHEN** 用户点击分页器进入第 2 页
- **THEN** 目标 URL 为 `/blog?labels=frontend&page=2`
- **AND** 当前分类筛选不会丢失

### Requirement: 切换分类重置分页
- **GIVEN** 用户处于 `/blog?labels=frontend&page=3`
- **WHEN** 用户选择另一个分类 `nextjs`
- **THEN** 目标 URL 为 `/blog?labels=nextjs`
- **AND** 不保留旧的 `page=3`

### Requirement: GitHub Issues 风格过滤条
- **GIVEN** 博客列表页渲染
- **WHEN** 用户查看标题下方区域
- **THEN** 页面展示 GitHub Issues 风格的分类过滤条
- **AND** 过滤条包含 `Labels` 入口、结果说明和当前筛选 token

---

## MODIFIED

### Requirement: 博客列表分页 URL
- **GIVEN** 博客列表处于分类筛选状态
- **WHEN** 分页器生成页码链接
- **THEN** 页码链接保留当前 `labels` 查询参数
- **AND** 第 1 页链接省略 `page` 参数

---

## REMOVED

### Requirement: 无
- 本次不移除既有需求。
