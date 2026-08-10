# 分页器重新设计

> 原始变更名：`20260607_P_分页器重新设计`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
博客列表页的分页逻辑目前内联在 `BlogListView.tsx`（约 160 行），包括样式组件和页码计算逻辑。分页器风格为纯数字 + 上一页/下一页，视觉效果一般。需要：

1. 提取为独立可复用组件 `Pagination`
2. 仿照 Google 经典搜索页 "Goooooogle" 字母式分页，使用 `W-u-u-u-u-u-H` 字母载体实现独特的翻页体验

## 引用规范
- `specs/pagination/spec.md`

## 决策
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

## 任务
### Phase 1: 组件实现
### Phase 2: 验证
- [ ] 历史任务清单未提供

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 分页器重新设计
change: pagination
date: 2026-06-07
type: P
status: proposed
```

### `design.md`
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

### `proposal.md`
# 分页器重新设计

## 动机

博客列表页的分页逻辑目前内联在 `BlogListView.tsx`（约 160 行），包括样式组件和页码计算逻辑。分页器风格为纯数字 + 上一页/下一页，视觉效果一般。需要：

1. 提取为独立可复用组件 `Pagination`
2. 仿照 Google 经典搜索页 "Goooooogle" 字母式分页，使用 `W-u-u-u-u-u-H` 字母载体实现独特的翻页体验

## 变更范围

- **新增**: `packages/components/pagination/` — 分页器组件
- **修改**: `packages/wuh.site.next/app/blog/BlogListView.tsx` — 替换内联分页为 Pagination 组件
- **修改**: `packages/wuh.site.next/app/blog/loading.tsx` — 骨架屏适配新分页器

## 非目标

- 不修改后端 API 分页格式
- 不新增页码参数类型（复用 `shared-contracts` 的 `PaginationMeta`）
- 不在博客详情页添加分页

## 影响

- **前端**: 组件包新增分页器，博客列表页消费
- **后端**: 无影响

### `specs/pagination/spec.md`
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

### `tasks.md`
# 任务列表

## Phase 1: 组件实现

### Task 1: 创建 Pagination 组件 ✅
- **涉及文件**: `packages/components/pagination/index.tsx`
- **预计耗时**: 1h | **实际**: ~0.5h
- 实现 Pagination 组件：字母映射、窗口裁剪、导航、边界处理

### Task 2: 替换 BlogListView 内联分页 ✅
- **涉及文件**: `packages/wuh.site.next/app/blog/BlogListView.tsx`, `packages/wuh.site.next/app/blog/page.tsx`
- **预计耗时**: 0.5h | **实际**: ~0.3h
- 删除内联分页代码，替换为 Pagination 组件，清理多余类型（lastPage null → number）

### Task 3: 更新 loading 骨架屏 ✅
- **涉及文件**: `packages/wuh.site.next/app/blog/loading.tsx`
- **预计耗时**: 0.5h | **实际**: ~0.2h
- 适配新分页器样式

## Phase 2: 验证

### Task 4: 类型检查 ✅
- **涉及文件**: 所有修改文件
- **预计耗时**: 0.5h | **实际**: ~0.1h
- `npx tsc --noEmit --project packages/wuh.site.next/tsconfig.json` 通过
