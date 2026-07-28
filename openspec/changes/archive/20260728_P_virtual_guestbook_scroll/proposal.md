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
