# Pagination 分页器

## ADDED

### Requirement: W-u-H 字母式分页
- **GIVEN** 博客列表有超过 1 页内容
- **WHEN** 页面渲染分页器
- **THEN** W 字母链接到第 1 页
- **AND** 中间页码用 'u' 字母链接到对应的页码（第 2 页至倒数第 2 页）
- **AND** H 字母链接到最后一页
- **AND** 当前页码对应的字母替换为该页码数字，颜色为 `--primary-color`
- **AND** 其余字母颜色为 `--text-muted`

### Requirement: 窗口裁剪
- **GIVEN** 总页数超过 5 页
- **WHEN** 渲染分页器
- **THEN** 仅展示当前页 ±2 范围内的 'u' 字母
- **AND** 超出范围的 'u' 用 `...` 省略号替代
- **AND** 总页数 ≤ 5 时不显示省略号

### Requirement: 导航按钮
- **GIVEN** 分页器渲染
- **WHEN** 用户查看
- **THEN** 左侧显示 "← 上一页" 链接
- **AND** 右侧显示 "下一页 →" 链接
- **AND** 当前在第一页时 "上一页" 禁用
- **AND** 当前在最后一页时 "下一页" 禁用

### Requirement: 空状态不渲染
- **GIVEN** 总页数 ≤ 1
- **WHEN** 分页器初始化
- **THEN** 组件返回 null，不渲染任何 DOM

### Requirement: 组件导出遵循 exports map
- **GIVEN** 消费者导入 `@wuh.site/components/pagination`
- **WHEN** 构建工具解析路径
- **THEN** 通过组件的 exports map 解析到 `packages/components/pagination/index.tsx`

### Requirement: 替换博客列表内联分页
- **GIVEN** BlogListView 组件
- **WHEN** 渲染博客列表底部
- **THEN** 使用新的 Pagination 组件替代内联分页
- **AND** 删除内联的 Pagination、PaginationLink、PaginationText、PageMeta 样式组件
- **AND** 删除 `getPageNumbers()` 函数
- **AND** 使用 `shared-contracts` 的 `PaginationMeta` 类型替代本地 `PaginationState`
