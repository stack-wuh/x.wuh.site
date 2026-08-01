# 重新设计404/500页面

> 原始变更名：`20260510_P_redesign-error-pages`

## 元数据
- 日期：2026-05-10
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
1. **Result 组件的 card/border/badge 风格偏通用 UI 库** — 与首页、博客列表、文章详情页的开放布局、无边框设计语言不统一
2. **404 页面有自定义 GlobalLayout** — 重复设置 body 样式，与根 layout 冲突
3. **视觉脱节** — 用户从首页/博客页跳转到 404/500 时，明显感觉进入了不同风格的页面

重新设计后，错误页将采用网站统一的 typography 驱动、无边卡、酒红氛围的 editorial 风格。

## 引用规范
- `specs/redesign-error-pages/spec.md`

## 决策
# 设计文档

## 架构对比

### 之前

```
not-found.tsx
  ├── createGlobalStyle — 重复设置 body 样式
  ├── Root (flex centering)
  └── Result (status='404')
        ├── Card (border + shadow + grid 布局)
        ├── Status badge (danger color pill)
        ├── Title / Description
        ├── Link pills
        └── Button actions

error.tsx
  └── Result (status='500')
        └── 同上 Card 布局
```

### 之后

```
not-found.tsx
  └── 与首页一致的开放布局
        ├── 大号状态数字 (404/500) — typography 驱动
        ├── 标题 + 描述文字
        └── 操作按钮组

error.tsx
  └── 同 not-found.tsx 的布局
        └── 额外: reset() 重试按钮
```

## 视觉方向

- **无边卡** — 移除 `border` + `box-shadow` + `background` card 容器
- **Typography 驱动** — 大号状态数字作为视觉焦点，标题/描述文字层次分明
- **酒红氛围** — 使用 `var(--primary-color)` 点缀状态数字
- **居中布局** — 与首页一致的 `min-height: 70vh` 垂直居中
- **共享样式组件** — 两个页面复用同一套样式

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/not-found.tsx` | 重写 | 移除 Result + GlobalLayout，改为 editorial 风格 |
| `app/error.tsx` | 重写 | 同上布局，保留 reset() |
| `app/post/[number]/error.tsx` | 重写 | 同上布局，博客相关文案 |

## 任务
### Phase 1 — 重写 404 页面
- [x] T1: 重写 `app/not-found.tsx` — 移除 Result 组件和 GlobalLayout，改为 typography 驱动的 editorial 风格布局
### Phase 2 — 重写 500 页面
- [x] T2: 重写 `app/error.tsx` — 与 not-found.tsx 保持一致的布局，保留 reset() 重试按钮
- [x] T3: 重写 `app/post/[number]/error.tsx` — 同布局，博客相关文案
### Phase 3 — 验证
- [ ] T4: TypeScript 类型检查通过
- [ ] T5: 本地 dev server 手动验证 404/500 页面风格与首页一致

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 重新设计404/500页面
change: redesign-error-pages
date: 2026-05-10
type: P
status: applied
```

### `design.md`
# 设计文档

## 架构对比

### 之前

```
not-found.tsx
  ├── createGlobalStyle — 重复设置 body 样式
  ├── Root (flex centering)
  └── Result (status='404')
        ├── Card (border + shadow + grid 布局)
        ├── Status badge (danger color pill)
        ├── Title / Description
        ├── Link pills
        └── Button actions

error.tsx
  └── Result (status='500')
        └── 同上 Card 布局
```

### 之后

```
not-found.tsx
  └── 与首页一致的开放布局
        ├── 大号状态数字 (404/500) — typography 驱动
        ├── 标题 + 描述文字
        └── 操作按钮组

error.tsx
  └── 同 not-found.tsx 的布局
        └── 额外: reset() 重试按钮
```

## 视觉方向

- **无边卡** — 移除 `border` + `box-shadow` + `background` card 容器
- **Typography 驱动** — 大号状态数字作为视觉焦点，标题/描述文字层次分明
- **酒红氛围** — 使用 `var(--primary-color)` 点缀状态数字
- **居中布局** — 与首页一致的 `min-height: 70vh` 垂直居中
- **共享样式组件** — 两个页面复用同一套样式

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/not-found.tsx` | 重写 | 移除 Result + GlobalLayout，改为 editorial 风格 |
| `app/error.tsx` | 重写 | 同上布局，保留 reset() |
| `app/post/[number]/error.tsx` | 重写 | 同上布局，博客相关文案 |

### `proposal.md`
# 重新设计404/500页面

## What

重新设计博客的 404 (not-found.tsx) 和 500 (error.tsx) 错误页面，使其视觉风格与网站整体保持一致。当前这两个页面使用通用 UI 库风格的 Result 组件（card + border + status badge），与网站的酒红 editorial 风格不搭配。

## Why

1. **Result 组件的 card/border/badge 风格偏通用 UI 库** — 与首页、博客列表、文章详情页的开放布局、无边框设计语言不统一
2. **404 页面有自定义 GlobalLayout** — 重复设置 body 样式，与根 layout 冲突
3. **视觉脱节** — 用户从首页/博客页跳转到 404/500 时，明显感觉进入了不同风格的页面

重新设计后，错误页将采用网站统一的 typography 驱动、无边卡、酒红氛围的 editorial 风格。

### `specs/redesign-error-pages/spec.md`
# 重新设计404/500页面

## R1 — 404 页面 editorial 风格

移除 Result 组件和 GlobalLayout，改为 typography 驱动的开放布局：
- 大号 "404" 数字作为视觉焦点，使用 primary-color 点缀
- 标题 + 描述文字层次分明
- 操作按钮（返回首页 + 知识库链接）
- 无边卡、无阴影，融入网站整体氛围

## R2 — 500 页面 editorial 风格

与 404 页面保持一致的布局，额外提供 reset() 重试按钮。post/[number] 下的 500 页面使用博客相关文案。

## R3 — 移除冗余样式

删除 not-found.tsx 中的 `createGlobalStyle` body 样式覆盖，信任根 layout 的全局样式。

## R4 — 保留现有功能

以下功能不受影响：
- 404 页面：返回首页、GitHub/语雀/微信公众号链接
- 500 页面：重试按钮、返回首页、GitHub/语雀链接
- post/[number]/error.tsx：GitHub/知识库链接

### `tasks.md`
# 任务拆分

## Phase 1 — 重写 404 页面

- [x] T1: 重写 `app/not-found.tsx` — 移除 Result 组件和 GlobalLayout，改为 typography 驱动的 editorial 风格布局
  - 涉及文件: `app/not-found.tsx`
  - 预计耗时: 30min

## Phase 2 — 重写 500 页面

- [x] T2: 重写 `app/error.tsx` — 与 not-found.tsx 保持一致的布局，保留 reset() 重试按钮
  - 涉及文件: `app/error.tsx`
  - 预计耗时: 20min

- [x] T3: 重写 `app/post/[number]/error.tsx` — 同布局，博客相关文案
  - 涉及文件: `app/post/[number]/error.tsx`
  - 预计耗时: 15min

## Phase 3 — 验证

- [ ] T4: TypeScript 类型检查通过
- [ ] T5: 本地 dev server 手动验证 404/500 页面风格与首页一致
