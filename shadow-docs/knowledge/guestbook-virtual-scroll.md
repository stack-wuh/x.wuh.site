---
keywords: [虚拟滚动, VirtualScroll, 留言板, 分页, 动态行高, 滚动条, 键盘可访问, 新留言提示]
---

# 留言板虚拟滚动与分页

VirtualScroll 组件基于动态行高渲染，不要求固定行高。仅渲染可视区域及 overscan（默认 5）范围内的条目，500 条时 DOM 节点数不超过 30。`initialTopMostItemIndex: 'LAST'` 时直接定位末尾不播放长距离滚动动画。

`followOutput` 开启时：用户距底部 50px 内自动跟随新条目；用户已上滚则保持当前位置并显示「有新留言 ↓」浮动按钮。按钮出现/消失无位移动画，`prefers-reduced-motion` 时使用 `instant` 滚动。

滚动条主题化：滑块显示主题主色渐变，轨道低对比中性色，默认 7px 宽，hover 仅增强对比度不改变宽度。触控设备（`pointer: coarse`）恢复系统覆盖式滚动条。容器 focus 时显示 2px primary-color 焦点环，Page Up/Down/方向键正常滚动。

独立留言板页面 `/guestbook?page=N` 每页 20 条最新在前，使用 Pagination 组件，浏览器前进/后退可恢复页码。无效页码重定向到 page=1。评论数为 0 时显示空状态与返回入口。历史数据加载失败时保留已有本地消息、顶部显示 error Banner（`role="alert"`），发送失败的消息保留在原位置显示失败状态。
