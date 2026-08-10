# 留言板虚拟滚动容器与独立分页页面

> 原始变更名：`20260728_P_virtual_guestbook_scroll`

## 元数据
- 日期：2026-07-28
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
留言板弹窗 `GuestbookBarrageDialog` 目前把全部已加载留言一次性渲染成 DOM。`ChatFeed` 已经是弹窗内部的独立滚动容器（`overflow: auto`），并不是 window 滚动，但它直接使用浏览器默认滚动条外观，与站点的纸张质感和酒红强调色不协调；同时列表每次状态更新都重建全部气泡节点，留言变多后滚动出现掉帧。

留言数据本身没有上限，而弹窗是一个聊天式的即时场景，不适合承担全部历史留言的浏览。本次变更做两件事：抽出一个可复用的虚拟滚动容器（含主题化 Y 轴滚动条）供弹窗使用，并新增一个独立的留言板页面承载完整历史的页码分页浏览。

## 引用规范
- `specs/guestbook/spec.md`

## 决策
# Design: 留言板虚拟滚动容器与独立分页页面

## 技术方案

### 选型

| 方向 | 选择 | 理由 |
|------|------|------|
| 虚拟列表引擎 | react-virtuoso | 专为聊天/消息场景设计，内置 `followOutput`、`initialTopMostItemIndex`、动态高度测量，无需手动管理滚动位置 |
| 滚动条样式 | CSS 原生 scrollbar-width / scrollbar-color + ::-webkit-scrollbar | 不拦截任何原生滚动事件，保留触控板惯性、键盘操作和辅助技术兼容性 |
| 分页组件 | 现有 `Pagination`（`@wuh.site/components/pagination`） | 已有 `getPageUrl` URL 驱动模式，直接复用 |
| 数据请求 | Next.js `fetch` + `cache: 'no-store'` (弹窗) / ISR (独立页面) | 弹窗需要实时数据，独立页面可缓存 |

### 关键约束（已验证）

- 后端 `limit` 无上限校验，`limit=500` 可直接传入，无需后端改动。
- 后端固定按 `createdAt: -1`（最新在前）返回；前端拿到数组后 `.reverse()` 得到旧→新顺序供虚拟列表渲染。
- `buildPaginatedResult` 返回 `{ data, pagination: { page, total, totalPages, hasNextPage, hasPreviousPage } }`；`totalPages` 可直接传给现有 `Pagination` 组件的 `totalPages` prop。
- `Pagination` props: `{ currentPage: number; totalPages: number; getPageUrl: (page: number) => string }`。

---

## 模块划分

```
packages/components/
└── virtual-scroll/
    ├── index.tsx         # VirtualScroll 组件主体
    └── styles.ts         # 主题化 Y 轴滚动条样式

packages/wuh.site.next/app/
├── about/components/
│   ├── GuestbookBarrageDialog.tsx   # 改用 VirtualScroll，加入跟随/提示/入口
│   └── guestbook-barrage.styles.ts  # 调整 ChatFeed 布局，新增 NewMessageBanner 样式
└── guestbook/
    ├── page.tsx                      # 服务端分页页面
    └── GuestbookPageView.tsx         # 客户端视图（列表 + Pagination）
```

---

## VirtualScroll 组件接口

```tsx
// packages/components/virtual-scroll/index.tsx

interface VirtualScrollProps<T> {
  /** 列表数据 */
  items: T[]
  /** 渲染单条数据 */
  renderItem: (item: T, index: number) => React.ReactNode
  /** 追加新条目时是否跟随到底部（传入函数可做条件判断） */
  followOutput?: boolean | ((isAtBottom: boolean) => boolean)
  /** 初始定位到哪条（'LAST' 表示最后一条） */
  initialTopMostItemIndex?: number | 'LAST'
  /** 容器 className，可自定义高度等 */
  className?: string
  /** aria-label，无障碍使用 */
  'aria-label'?: string
  /** 键盘可聚焦，默认 true */
  tabIndex?: number
  /** overscan 行数，默认 5 */
  overscan?: number
  /** 列表为空时显示的内容 */
  emptyContent?: React.ReactNode
  /** 列表底部追加的内容（如加载中占位） */
  footer?: React.ReactNode
}
```

`VirtualScroll` 直接透传 `Virtuoso` 的 `ref`，暴露 `VirtualScrollHandle`（含 `scrollToBottom(behavior?: ScrollBehavior)`）以便父组件在需要时命令式滚动到底部（例如「有新留言 ↓」按钮点击）。

---

## 自定义 Y 轴滚动条 CSS 规则

```css
/* 应用于 VirtualScroll 内部滚动容器 */

/* W3C 标准：Firefox 等 */
scrollbar-width: thin;
scrollbar-color: var(--primary-color) color-mix(in oklab, var(--normal-300) 30%, transparent);

/* WebKit */
&::-webkit-scrollbar          { width: 7px; }
&::-webkit-scrollbar-track    { background: color-mix(in oklab, var(--normal-300) 20%, transparent); border-radius: 99px; }
&::-webkit-scrollbar-thumb    {
  background: linear-gradient(180deg, var(--primary-color), color-mix(in oklab, var(--primary-color) 70%, black));
  border-radius: 99px;
}
&::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, color-mix(in oklab, var(--primary-color) 110%, white), var(--primary-color));
}

/* 深色模式：降低发光感 */
[data-color-scheme="dark"] & {
  scrollbar-color: color-mix(in oklab, var(--primary-color) 80%, black) color-mix(in oklab, var(--normal-600) 30%, transparent);
}

/* 移动端：让系统覆盖式滚动条生效 */
@media (pointer: coarse) {
  scrollbar-width: auto;
  &::-webkit-scrollbar { display: none; }
}
```

---

## 弹窗留言列表数据流

```
打开弹窗
  → fetch /api/comments?issueNumber=999999&page=1&limit=500
  → 后端返回最新 500 条（newest first）
  → 前端 normalizeGuestbookComments().reverse() → 旧→新数组
  → 传入 VirtualScroll，initialTopMostItemIndex='LAST'，followOutput 依底部状态判断
  → 接口 pagination.total → 入口文案「查看全部 N 条留言」
```

**followOutput 策略**（Virtuoso 内置逻辑）：
- `followOutput={(isAtBottom) => isAtBottom}` — 用户在底部时跟随新消息；上滚阅读时不跟随。
- `isAtBottom` 由 Virtuoso 内部检测（距底部阈值约 50px）。

**「有新留言 ↓」提示**：
- 弹窗组件持有 `atBottom` 状态（由 `Virtuoso` `atBottomStateChange` 回调更新）。
- 当 `atBottom === false` 且 `localMessages` 有新追加项时显示浮动按钮。
- 点击后调用 `virtualScrollRef.current?.scrollToBottom('smooth')`。

---

## 独立留言板页面

**路由**: `/guestbook?page=1`（Next.js App Router Server Component）

```tsx
// app/guestbook/page.tsx（Server Component）
export default async function GuestbookPage({ searchParams }) {
  const page = clampPage(Number(searchParams?.page ?? 1))
  const res = await fetch(`${nestApiUrl}/comments?issueNumber=999999&page=${page}&limit=20`, ...)
  // ISR revalidate: 60 秒
  return <GuestbookPageView comments={data} pagination={pagination} currentPage={page} />
}
```

- 无效页码（超出 totalPages、非整数）在 Server Component 中归一到第 1 页，通过 `redirect('/guestbook?page=1')` 处理，不需要客户端路由。
- 空数据（totalPages === 0）展示空状态 + 返回留言板入口。
- 加载失败使用 Next.js `error.tsx` 捕获，显示重试链接。
- 列表按 `createdAt` 最新在前展示，不再反转（与弹窗相反）。

**GuestbookPageView** 是 Client Component，负责渲染评论卡片列表和底部 `Pagination`；`getPageUrl` 实现为 `(p) => '/guestbook?page=' + p`。

---

## 弹窗入口文案

弹窗 `GuestbookStage` 底部或顶部的固定工具栏，文案：

```
查看全部 {total} 条留言 →
```

- `total` 来自弹窗加载时接口返回的 `pagination.total`；加载中占位为破折号，加载失败隐藏入口。
- 点击后导航到 `/guestbook`（`<a href="/guestbook">` 或 Next.js `<Link>`）。

---

## 状态与异常处理

| 场景 | 行为 |
|------|------|
| 弹窗数据加载中 | 稳定占位（现有实现），已存在的 `localMessages` 继续显示 |
| 弹窗数据加载失败 | 保留已存数据，顶部显示错误 Banner（`role="alert"`），不清空列表 |
| 发送失败 | 气泡保留在列表原位置，显示失败状态标记 |
| `/guestbook` 页加载失败 | Next.js error boundary 显示重试按钮 |
| `/guestbook` 页码越界 | Server Component `redirect` 归一到第 1 页 |

---

## 可访问性

- `VirtualScroll` 容器元素设置 `tabIndex={0}` + `role="list"`（或由 Virtuoso 的 `listRef` 指向），键盘 Tab 进入后 Page Up/Down、Arrow 键保持原生滚动。
- 容器获得焦点时有可见焦点环（`outline: 2px solid var(--primary-color); outline-offset: 2px`）。
- 「有新留言 ↓」按钮用 `aria-label="有新留言，跳到最新"` 表达意图。
- 加载状态、新消息追加和错误使用 `aria-live="polite"` 区域播报，避免打断用户操作。
- `prefers-reduced-motion: reduce` 时所有 `smooth` 滚动改为 `instant`，新消息提示按钮出现时不做位移动画。

---

## 影响分析

| 变更 | 风险 | 缓解 |
|------|------|------|
| 新增 react-virtuoso 依赖 | bundle 增大约 30 kB gzip | 仅在留言板组件路径按需导入；bespoke 体积可接受 |
| limit=500 请求体积 | 每次打开弹窗传输约 500 条留言 JSON | 数据量数量级与现有 limit=50 差距为 10×；留言文本短（≤100字），估算 < 200 KB，可接受 |
| 前端反转数组 | 额外一次 O(n) 操作 | 500 条上限下约 0.1ms，可忽略 |
| `/guestbook` 新路由 | 无冲突 | 现有路由未使用该路径 |

**回滚策略**：`VirtualScroll` 是新增组件，弹窗只是替换列表渲染层；若出现问题可将 `ChatFeed` 恢复为普通 `div` + `chatMessages.map()`，两处改动相互独立。

## 任务
### Phase 1：历史任务
- [x] 完成（实际耗时：约 8 分钟）
- [x] 完成（实际耗时：约 10 分钟）
- [x] 完成（实际耗时：约 7 分钟）
- [ ] 进行中

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: virtual-guestbook-scroll
date: 2026-07-28
type: P
status: proposed
```

### `design.md`
# Design: 留言板虚拟滚动容器与独立分页页面

## 技术方案

### 选型

| 方向 | 选择 | 理由 |
|------|------|------|
| 虚拟列表引擎 | react-virtuoso | 专为聊天/消息场景设计，内置 `followOutput`、`initialTopMostItemIndex`、动态高度测量，无需手动管理滚动位置 |
| 滚动条样式 | CSS 原生 scrollbar-width / scrollbar-color + ::-webkit-scrollbar | 不拦截任何原生滚动事件，保留触控板惯性、键盘操作和辅助技术兼容性 |
| 分页组件 | 现有 `Pagination`（`@wuh.site/components/pagination`） | 已有 `getPageUrl` URL 驱动模式，直接复用 |
| 数据请求 | Next.js `fetch` + `cache: 'no-store'` (弹窗) / ISR (独立页面) | 弹窗需要实时数据，独立页面可缓存 |

### 关键约束（已验证）

- 后端 `limit` 无上限校验，`limit=500` 可直接传入，无需后端改动。
- 后端固定按 `createdAt: -1`（最新在前）返回；前端拿到数组后 `.reverse()` 得到旧→新顺序供虚拟列表渲染。
- `buildPaginatedResult` 返回 `{ data, pagination: { page, total, totalPages, hasNextPage, hasPreviousPage } }`；`totalPages` 可直接传给现有 `Pagination` 组件的 `totalPages` prop。
- `Pagination` props: `{ currentPage: number; totalPages: number; getPageUrl: (page: number) => string }`。

---

## 模块划分

```
packages/components/
└── virtual-scroll/
    ├── index.tsx         # VirtualScroll 组件主体
    └── styles.ts         # 主题化 Y 轴滚动条样式

packages/wuh.site.next/app/
├── about/components/
│   ├── GuestbookBarrageDialog.tsx   # 改用 VirtualScroll，加入跟随/提示/入口
│   └── guestbook-barrage.styles.ts  # 调整 ChatFeed 布局，新增 NewMessageBanner 样式
└── guestbook/
    ├── page.tsx                      # 服务端分页页面
    └── GuestbookPageView.tsx         # 客户端视图（列表 + Pagination）
```

---

## VirtualScroll 组件接口

```tsx
// packages/components/virtual-scroll/index.tsx

interface VirtualScrollProps<T> {
  /** 列表数据 */
  items: T[]
  /** 渲染单条数据 */
  renderItem: (item: T, index: number) => React.ReactNode
  /** 追加新条目时是否跟随到底部（传入函数可做条件判断） */
  followOutput?: boolean | ((isAtBottom: boolean) => boolean)
  /** 初始定位到哪条（'LAST' 表示最后一条） */
  initialTopMostItemIndex?: number | 'LAST'
  /** 容器 className，可自定义高度等 */
  className?: string
  /** aria-label，无障碍使用 */
  'aria-label'?: string
  /** 键盘可聚焦，默认 true */
  tabIndex?: number
  /** overscan 行数，默认 5 */
  overscan?: number
  /** 列表为空时显示的内容 */
  emptyContent?: React.ReactNode
  /** 列表底部追加的内容（如加载中占位） */
  footer?: React.ReactNode
}
```

`VirtualScroll` 直接透传 `Virtuoso` 的 `ref`，暴露 `VirtualScrollHandle`（含 `scrollToBottom(behavior?: ScrollBehavior)`）以便父组件在需要时命令式滚动到底部（例如「有新留言 ↓」按钮点击）。

---

## 自定义 Y 轴滚动条 CSS 规则

```css
/* 应用于 VirtualScroll 内部滚动容器 */

/* W3C 标准：Firefox 等 */
scrollbar-width: thin;
scrollbar-color: var(--primary-color) color-mix(in oklab, var(--normal-300) 30%, transparent);

/* WebKit */
&::-webkit-scrollbar          { width: 7px; }
&::-webkit-scrollbar-track    { background: color-mix(in oklab, var(--normal-300) 20%, transparent); border-radius: 99px; }
&::-webkit-scrollbar-thumb    {
  background: linear-gradient(180deg, var(--primary-color), color-mix(in oklab, var(--primary-color) 70%, black));
  border-radius: 99px;
}
&::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, color-mix(in oklab, var(--primary-color) 110%, white), var(--primary-color));
}

/* 深色模式：降低发光感 */
[data-color-scheme="dark"] & {
  scrollbar-color: color-mix(in oklab, var(--primary-color) 80%, black) color-mix(in oklab, var(--normal-600) 30%, transparent);
}

/* 移动端：让系统覆盖式滚动条生效 */
@media (pointer: coarse) {
  scrollbar-width: auto;
  &::-webkit-scrollbar { display: none; }
}
```

---

## 弹窗留言列表数据流

```
打开弹窗
  → fetch /api/comments?issueNumber=999999&page=1&limit=500
  → 后端返回最新 500 条（newest first）
  → 前端 normalizeGuestbookComments().reverse() → 旧→新数组
  → 传入 VirtualScroll，initialTopMostItemIndex='LAST'，followOutput 依底部状态判断
  → 接口 pagination.total → 入口文案「查看全部 N 条留言」
```

**followOutput 策略**（Virtuoso 内置逻辑）：
- `followOutput={(isAtBottom) => isAtBottom}` — 用户在底部时跟随新消息；上滚阅读时不跟随。
- `isAtBottom` 由 Virtuoso 内部检测（距底部阈值约 50px）。

**「有新留言 ↓」提示**：
- 弹窗组件持有 `atBottom` 状态（由 `Virtuoso` `atBottomStateChange` 回调更新）。
- 当 `atBottom === false` 且 `localMessages` 有新追加项时显示浮动按钮。
- 点击后调用 `virtualScrollRef.current?.scrollToBottom('smooth')`。

---

## 独立留言板页面

**路由**: `/guestbook?page=1`（Next.js App Router Server Component）

```tsx
// app/guestbook/page.tsx（Server Component）
export default async function GuestbookPage({ searchParams }) {
  const page = clampPage(Number(searchParams?.page ?? 1))
  const res = await fetch(`${nestApiUrl}/comments?issueNumber=999999&page=${page}&limit=20`, ...)
  // ISR revalidate: 60 秒
  return <GuestbookPageView comments={data} pagination={pagination} currentPage={page} />
}
```

- 无效页码（超出 totalPages、非整数）在 Server Component 中归一到第 1 页，通过 `redirect('/guestbook?page=1')` 处理，不需要客户端路由。
- 空数据（totalPages === 0）展示空状态 + 返回留言板入口。
- 加载失败使用 Next.js `error.tsx` 捕获，显示重试链接。
- 列表按 `createdAt` 最新在前展示，不再反转（与弹窗相反）。

**GuestbookPageView** 是 Client Component，负责渲染评论卡片列表和底部 `Pagination`；`getPageUrl` 实现为 `(p) => '/guestbook?page=' + p`。

---

## 弹窗入口文案

弹窗 `GuestbookStage` 底部或顶部的固定工具栏，文案：

```
查看全部 {total} 条留言 →
```

- `total` 来自弹窗加载时接口返回的 `pagination.total`；加载中占位为破折号，加载失败隐藏入口。
- 点击后导航到 `/guestbook`（`<a href="/guestbook">` 或 Next.js `<Link>`）。

---

## 状态与异常处理

| 场景 | 行为 |
|------|------|
| 弹窗数据加载中 | 稳定占位（现有实现），已存在的 `localMessages` 继续显示 |
| 弹窗数据加载失败 | 保留已存数据，顶部显示错误 Banner（`role="alert"`），不清空列表 |
| 发送失败 | 气泡保留在列表原位置，显示失败状态标记 |
| `/guestbook` 页加载失败 | Next.js error boundary 显示重试按钮 |
| `/guestbook` 页码越界 | Server Component `redirect` 归一到第 1 页 |

---

## 可访问性

- `VirtualScroll` 容器元素设置 `tabIndex={0}` + `role="list"`（或由 Virtuoso 的 `listRef` 指向），键盘 Tab 进入后 Page Up/Down、Arrow 键保持原生滚动。
- 容器获得焦点时有可见焦点环（`outline: 2px solid var(--primary-color); outline-offset: 2px`）。
- 「有新留言 ↓」按钮用 `aria-label="有新留言，跳到最新"` 表达意图。
- 加载状态、新消息追加和错误使用 `aria-live="polite"` 区域播报，避免打断用户操作。
- `prefers-reduced-motion: reduce` 时所有 `smooth` 滚动改为 `instant`，新消息提示按钮出现时不做位移动画。

---

## 影响分析

| 变更 | 风险 | 缓解 |
|------|------|------|
| 新增 react-virtuoso 依赖 | bundle 增大约 30 kB gzip | 仅在留言板组件路径按需导入；bespoke 体积可接受 |
| limit=500 请求体积 | 每次打开弹窗传输约 500 条留言 JSON | 数据量数量级与现有 limit=50 差距为 10×；留言文本短（≤100字），估算 < 200 KB，可接受 |
| 前端反转数组 | 额外一次 O(n) 操作 | 500 条上限下约 0.1ms，可忽略 |
| `/guestbook` 新路由 | 无冲突 | 现有路由未使用该路径 |

**回滚策略**：`VirtualScroll` 是新增组件，弹窗只是替换列表渲染层；若出现问题可将 `ChatFeed` 恢复为普通 `div` + `chatMessages.map()`，两处改动相互独立。

### `proposal.md`
# 留言板虚拟滚动容器与独立分页页面

## 背景

留言板弹窗 `GuestbookBarrageDialog` 目前把全部已加载留言一次性渲染成 DOM。`ChatFeed` 已经是弹窗内部的独立滚动容器（`overflow: auto`），并不是 window 滚动，但它直接使用浏览器默认滚动条外观，与站点的纸张质感和酒红强调色不协调；同时列表每次状态更新都重建全部气泡节点，留言变多后滚动出现掉帧。

留言数据本身没有上限，而弹窗是一个聊天式的即时场景，不适合承担全部历史留言的浏览。本次变更做两件事：抽出一个可复用的虚拟滚动容器（含主题化 Y 轴滚动条）供弹窗使用，并新增一个独立的留言板页面承载完整历史的页码分页浏览。

## 目标

- 新增组件库级 `VirtualScroll` 容器，基于 React Virtuoso 做窗口化渲染，只挂载可视区域及少量 overscan 项，不要求调用方提供固定行高。
- 容器内置主题化的原生 Y 轴滚动条：滑块使用主题主色渐变，轨道保持低对比中性色，默认宽度 7px，hover 只增强对比不改变宽度。
- 留言板弹窗改用 `VirtualScroll` 渲染最近 500 条留言，按旧到新排列，打开后直接定位到最新一条。
- 弹窗保留贴近底部时自动跟随新留言的行为；用户上滚阅读历史时保持当前位置，并提供「有新留言 ↓」按钮由用户主动返回底部。
- 新增独立留言板页面 `/guestbook`，以 URL 页码参数做每页 20 条、最新在前的传统分页，展示全部历史留言。
- 弹窗中始终显示进入独立页面的入口，文案包含留言总数。
- 满足键盘滚动、焦点可见、动态内容播报、深色模式对比度、移动端触控与 `prefers-reduced-motion` 要求。

## 非目标（明确不做）

- 不自绘滚动条覆盖层替代原生滚动机制，不接管滚轮、触控板惯性或触屏拖动行为。
- 不改动评论后端接口、DTO、Schema 与分页实现，不新增后端字段。
- 不改动文章详情页的 `PostComments`，本次不统一评论与留言的列表方案。
- 不引入无限滚动或「加载更多」，独立页面只做页码分页。
- 不新增留言的编辑、删除、回复、点赞等能力。
- 不调整留言提交流程、昵称存储、字数限制与失败重试语义。
- 不改造弹窗组件 `Dialog` 的公共 API。

## 影响范围

- `packages/components/virtual-scroll/` — 新增 `VirtualScroll` 容器及主题化滚动条样式，导出为 `@wuh.site/components/virtual-scroll`。
- `packages/components/package.json` — 新增 `react-virtuoso` 依赖并声明子路径导出。
- `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx` — 列表改用 `VirtualScroll`，加入底部跟随、新留言提示与独立页面入口。
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 调整 stage/feed 布局以适配虚拟列表，新增新留言提示与入口样式。
- `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.js` — 补充按时间升序排列与总数提取的纯函数。
- `packages/wuh.site.next/app/guestbook/` — 新增独立留言板页面与视图组件，使用现有 `Pagination`。
- 影响包：`@wuh.site/components`、`@wuh.site/next`。

### `specs/guestbook/spec.md`
# Spec: 留言板虚拟滚动容器与独立分页页面

## ADDED

### Requirement: VirtualScroll 组件 — 基础渲染
- **GIVEN** 调用方传入 `items` 数组和 `renderItem` 函数
- **WHEN** `VirtualScroll` 挂载
- **THEN** 只渲染可视区域内的条目及 `overscan`（默认 5）范围内的条目
- **AND** 挂载的 DOM 节点数量显著少于 `items.length`（500 条时节点数 ≤ 30）
- **AND** 条目高度由内容决定，组件不要求固定行高

### Requirement: VirtualScroll 组件 — 初始定位
- **GIVEN** `initialTopMostItemIndex` 为 `'LAST'`
- **WHEN** 数据首次加载完成
- **THEN** 列表直接定位到最后一条，不播放长距离平滑滚动动画

### Requirement: VirtualScroll 组件 — followOutput 跟随
- **GIVEN** `followOutput` 开启且用户停留在底部附近（距底部 ≤ 50px）
- **WHEN** `items` 追加新条目
- **THEN** 列表自动滚动到新的最底部
- **GIVEN** 用户已上滚离开底部区域
- **WHEN** `items` 追加新条目
- **THEN** 列表保持当前滚动位置，不发生位移

### Requirement: VirtualScroll 组件 — 主题化 Y 轴滚动条
- **GIVEN** 任意主题（wine / plain）下的亮色模式
- **WHEN** VirtualScroll 容器渲染
- **THEN** 滑块显示主题主色渐变，轨道显示低对比中性色，默认宽度 7px
- **AND** 滑块 hover 时仅增强对比度，宽度保持 7px，不造成布局位移
- **GIVEN** 深色模式（`data-color-scheme="dark"`）
- **WHEN** VirtualScroll 容器渲染
- **THEN** 滑块与轨道降低发光感，仍保证两者可辨识
- **GIVEN** 触控设备（`pointer: coarse`）
- **WHEN** VirtualScroll 容器渲染
- **THEN** 恢复系统覆盖式滚动条，不强制显示自定义滚动条

### Requirement: VirtualScroll 组件 — 键盘与可访问性
- **GIVEN** 用户通过 Tab 将焦点移入 VirtualScroll 容器
- **WHEN** 容器获得焦点
- **THEN** 容器显示可见焦点环（2px primary-color outline）
- **AND** Page Up / Page Down / 方向键可正常滚动列表
- **AND** 滚轮、触控板惯性、触屏拖动保持浏览器原生行为

### Requirement: 留言板弹窗 — 虚拟列表
- **GIVEN** 弹窗打开且留言数据加载完成
- **WHEN** 列表渲染
- **THEN** 使用 VirtualScroll 展示最近 500 条留言（旧→新排列），初始定位最新一条
- **AND** DOM 节点数量显著少于留言总数，滚动无持续掉帧（60fps）

### Requirement: 留言板弹窗 — 新留言提示
- **GIVEN** 用户已上滚离开底部区域
- **WHEN** 有新留言追加到列表
- **THEN** 显示「有新留言 ↓」浮动按钮，`aria-label="有新留言，跳到最新"`
- **WHEN** 用户点击该按钮
- **THEN** 列表滚动到最底部，按钮消失
- **GIVEN** 用户返回底部区域
- **WHEN** `atBottom` 状态变为 true
- **THEN** 按钮消失
- **GIVEN** `prefers-reduced-motion: reduce`
- **WHEN** 用户点击按钮
- **THEN** 使用 `instant` 而非 `smooth` 滚动到底部，按钮出现时无位移动画

### Requirement: 留言板弹窗 — 独立页面入口
- **GIVEN** 弹窗数据加载完成
- **WHEN** 留言区域渲染
- **THEN** 始终显示「查看全部 N 条留言 →」入口，N 来自接口 `pagination.total`
- **GIVEN** 数据加载中
- **WHEN** 入口渲染
- **THEN** 显示占位破折号，不展示真实数字
- **GIVEN** 数据加载失败
- **WHEN** 入口渲染
- **THEN** 隐藏入口，不显示错误数字

### Requirement: 独立留言板页面 — 列表展示
- **GIVEN** 用户访问 `/guestbook?page=N`
- **WHEN** 页面渲染
- **THEN** 展示第 N 页留言，每页 20 条，按最新在前排列
- **AND** 页面底部显示页码导航（使用现有 `Pagination` 组件）
- **AND** URL 包含正确的 `page` 参数，浏览器前进/后退可恢复对应页

### Requirement: 独立留言板页面 — 无效页码
- **GIVEN** 用户访问 `page` 参数为非整数、小于 1 或大于总页数的 URL
- **WHEN** Server Component 处理请求
- **THEN** 重定向到 `/guestbook?page=1`，不返回 404 也不渲染空白页

### Requirement: 独立留言板页面 — 空状态
- **GIVEN** 留言总数为 0
- **WHEN** 页面渲染
- **THEN** 显示空状态提示，并提供返回 About 页留言的操作入口

### Requirement: 独立留言板页面 — 加载失败
- **GIVEN** 后端接口请求失败
- **WHEN** Next.js error boundary 捕获错误
- **THEN** 展示错误提示与重试链接，不渲染残缺页面

---

## MODIFIED

### Requirement: 留言板弹窗 — 数据加载异常
- **GIVEN** 弹窗已展示部分 `localMessages`，此时拉取历史数据失败
- **WHEN** 错误发生
- **THEN** 保留已存在的 `localMessages`，顶部显示错误 Banner（`role="alert"`），不清空列表
- （变更前：仅显示「留言加载失败」文字，无 Banner 语义）

### Requirement: 留言板弹窗 — 发送失败保留
- **GIVEN** 某条留言发送失败
- **WHEN** 列表渲染
- **THEN** 失败条目保留在列表原位置，显示失败状态标记
- （不变更语义，确认虚拟列表渲染下行为一致）

### `tasks.md`
# OpenSpec 实施进度

## T1 — 新增 VirtualScroll 组件库组件
- [x] 完成（实际耗时：约 8 分钟）

## T2 — 改造留言板弹窗列表为虚拟列表
- [x] 完成（实际耗时：约 10 分钟）

## T3 — 新增独立留言板页面
- [x] 完成（实际耗时：约 7 分钟）

## T4 — 类型检查与端到端验收
- [ ] 进行中
