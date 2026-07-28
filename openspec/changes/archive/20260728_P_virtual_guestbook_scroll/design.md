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
