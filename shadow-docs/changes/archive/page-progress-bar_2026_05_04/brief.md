# 页面加载进度条

> 原始变更名：`page-progress-bar_2026_05_04`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- `specs/page-progress-bar/spec.md`

## 决策
# 设计：顶部 NProgress 风格进度条

## 原理

`@bprogress/next` 封装 `next/navigation` 的 `useRouter`，拦截 `push`/`replace` 调用 + 监听 `usePathname()` 变化来驱动 NProgress 进度条。

```
layout.tsx (持久化)
  ├── SiteHeader
  ├── ProgressProvider
  │   └── {children}
  └── Footer
```

## 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| height | 3px | 进度条高度 |
| color | var(--primary-color) | 跟随主题 |
| delay | 80ms | 80ms 内完成的导航不显示进度条 |
| shallowRouting | true | 仅 pathname 变化触发，query 不变不触发 |
| options.showSpinner | false | 不显示右上角 spinner |

## 依赖

- `@bprogress/next` — NProgress 的 Next.js 15 App Router 封装
- 底层 `nprogress` CSS + JS，零额外运行时依赖

## 任务
### Phase 1 — 实现
- [x] T1: 安装 `@bprogress/next` 依赖
- [x] T2: `app/layout.tsx` 集成 `ProgressProvider`
### Phase 2 — 验证
- [x] T3: `oxlint app` 确认无 lint 错误

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-04
```

### `design.md`
# 设计：顶部 NProgress 风格进度条

## 原理

`@bprogress/next` 封装 `next/navigation` 的 `useRouter`，拦截 `push`/`replace` 调用 + 监听 `usePathname()` 变化来驱动 NProgress 进度条。

```
layout.tsx (持久化)
  ├── SiteHeader
  ├── ProgressProvider
  │   └── {children}
  └── Footer
```

## 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| height | 3px | 进度条高度 |
| color | var(--primary-color) | 跟随主题 |
| delay | 80ms | 80ms 内完成的导航不显示进度条 |
| shallowRouting | true | 仅 pathname 变化触发，query 不变不触发 |
| options.showSpinner | false | 不显示右上角 spinner |

## 依赖

- `@bprogress/next` — NProgress 的 Next.js 15 App Router 封装
- 底层 `nprogress` CSS + JS，零额外运行时依赖

### `proposal.md`
# 页面加载进度条

## 为什么做

路由切换时缺少导航反馈。虽然 loading.tsx 骨架屏在 Suspense 悬起时提供占位，但从点击 Link 到骨架屏出现的间隙没有任何视觉信号。需要一个顶部进度条来覆盖完整的导航生命周期。

## 做什么

- 安装 `@bprogress/next`（专为 Next.js 15 App Router 设计）
- 在 `app/layout.tsx` 中集成 `ProgressProvider`，包裹页面内容
- 进度条高度 3px，颜色跟随主题 `--primary-color`
- `delay={80}` 快速导航不显示，避免闪烁
- `shallowRouting` 仅 pathname 变化触发

## 影响范围

- `packages/wuh.site.next/package.json` — 新增 `@bprogress/next` 依赖
- `packages/wuh.site.next/app/layout.tsx` — 包裹 `ProgressProvider`

## 不改什么

- 不删除 `loading.tsx`（骨架屏互补）
- 不修改 `useRouter` 用法（项目当前未用）

### `specs/page-progress-bar/spec.md`
# Spec: page-progress-bar

## ADDED

### Requirement: 导航进度反馈

GIVEN 用户点击 Link 或调用 router.push
WHEN 路由切换开始
THEN 页面顶部显示 3px 进度条
AND 进度条颜色跟随当前主题 `--primary-color`
AND 导航完成后进度条消失

### Requirement: 快速导航不闪烁

GIVEN 导航在 80ms 内完成
WHEN 进度条 delay 机制生效
THEN 不显示进度条

### Requirement: shallow 路由不触发

GIVEN 仅 searchParams/query 参数变化
WHEN pathname 未变化
THEN 不显示进度条

### `tasks.md`
# 任务拆分

## Phase 1 — 实现

- [x] T1: 安装 `@bprogress/next` 依赖
- [x] T2: `app/layout.tsx` 集成 `ProgressProvider`

## Phase 2 — 验证

- [x] T3: `oxlint app` 确认无 lint 错误
