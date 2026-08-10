# 博客列表页

> 原始变更名：`20260322_P_blog-list-page`

## 元数据
- 日期：2026-03-22
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：博客列表页

## 方案

### 1. 数据获取

```ts
// GitHub Issues API
const url = `https://api.github.com/repos/stack-wuh/blog/issues`
const params = { per_page: 10, page, state: 'open', sort: 'created', direction: 'desc' }
```

### 2. 分页

- URL 参数 `?page=` 控制页码
- 使用 GitHub API Link header 判断总页数
- 分页器使用 W-u-H 字母式分页组件

### 3. 页面布局

- 复用 HomeView 卡片样式
- 响应式: 桌面三列 / 平板两列 / 手机单列
- 每页 10 条

## 依赖

- 零新依赖

## 任务
### Phase 1 — 页面实现
- [ ] T1: 创建 /blog 页面与数据获取
- [ ] T2: 首页入口添加入口
### Phase 2 — 验证
- [ ] T3: 验证分页与列表

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 博客列表页
change: blog-list-page
date: 2026-03-22
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/35
```

### `design.md`
# 设计：博客列表页

## 方案

### 1. 数据获取

```ts
// GitHub Issues API
const url = `https://api.github.com/repos/stack-wuh/blog/issues`
const params = { per_page: 10, page, state: 'open', sort: 'created', direction: 'desc' }
```

### 2. 分页

- URL 参数 `?page=` 控制页码
- 使用 GitHub API Link header 判断总页数
- 分页器使用 W-u-H 字母式分页组件

### 3. 页面布局

- 复用 HomeView 卡片样式
- 响应式: 桌面三列 / 平板两列 / 手机单列
- 每页 10 条

## 依赖

- 零新依赖

### `proposal.md`
# 博客列表页

## 为什么做

首页无法看到所有博客，需要新增博客列表页，支持分页浏览所有文章。

## 做什么

- 首页新增入口，点击进入 `/blog` 博客列表页
- 列表页支持分页（每页 10 条，URL 参数 `?page=`）
- 按博客创建时间倒序排列
- 沿用首页卡片风格与间距
- 数据来源 GitHub Issues API

## 影响范围

- `packages/wuh.site.next/app/blog/page.tsx` — 新增
- `packages/wuh.site.next/app/HomeView.tsx` — 添加入口

### `tasks.md`
# 任务拆分

## Phase 1 — 页面实现

- [ ] T1: 创建 /blog 页面与数据获取
  - 涉及文件: `packages/wuh.site.next/app/blog/page.tsx`
  - 产出: SSR 数据获取 + 分页逻辑

- [ ] T2: 首页入口添加入口
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`

## Phase 2 — 验证

- [ ] T3: 验证分页与列表
  - 手动验证分页切换、时间排序、入口跳转
