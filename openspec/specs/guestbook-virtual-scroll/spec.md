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
