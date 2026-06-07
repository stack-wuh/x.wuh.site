# 技术方案

## 组件架构

```
packages/components/pagination/
├── index.tsx          # Pagination 组件
└── styles.ts          # 样式组件
```

### API

```ts
type PaginationProps = {
  currentPage: number
  totalPages: number
  getPageUrl: (page: number) => string
}
```

- `currentPage` / `totalPages` — 直映射自 `PaginationMeta`
- `getPageUrl` — 回调控制 URL 生成，博客用 `/blog?page=N`，其他场景可自定义
- `totalPages <= 1` 时不渲染（返回 null）

### 字母映射规则

| 字母 | 映射 |
|------|------|
| W | 第 1 页（首页） |
| u | 中间页码（第 2 页至倒数第 2 页），当前页附近 ±2 窗口展示，其余省略号 |
| H | 最后一页 |

页数 ≤ 5 时不显示省略号。

### 视觉规范

- 字母 18px，letter-spacing 4px，水平排列
- 左右两侧 "← 上一页" / "下一页 →" 文字链接
- 当前页字母替换为页码数字，颜色 `--primary-color`
- 其余字母用 `--text-muted`，hover 变 `--text-primary`
- 首/末页时对应导航禁用（`--text-muted` + pointer-events: none）
- 使用纯 `<a>` 标签实现（SEO 友好）

### 导出路径

遵循组件包规范：`@wuh.site/components/pagination`

## 对现有模块的影响

### BlogListView.tsx（修改）

- 删除内联样式组件：`Pagination`、`PaginationLink`、`PaginationText`、`PageMeta`
- 删除 `getPageNumbers()` 函数
- 删除 `PaginationState` 类型（使用 `shared-contracts` 已有类型）
- 替换为 `<Pagination currentPage={...} totalPages={...} getPageUrl={...} />`

### loading.tsx（修改）

- 骨架屏适配新分页器样式

## 边界情况

| 场景 | 行为 |
|------|------|
| totalPages = 0 | 不渲染 |
| totalPages = 1 | 不渲染 |
| currentPage 超出范围 | 不渲染 |
| 首页（page=1） | "上一页" 禁用 |
| 末页（page=totalPages） | "下一页" 禁用 |
| 窗口展示 | 当前页 ±2，其余 'u' 省略为 `...` |
