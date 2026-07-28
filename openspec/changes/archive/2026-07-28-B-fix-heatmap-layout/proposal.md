# 修复 About 综合热力图布局错位与裁切

## 背景

About 综合热力图虽然已统一站点活动与 GitHub 贡献，但当前布局存在三个可见缺陷：热力图区域出现横向滚动条，月份标题与周列及星期标题没有共享同一坐标，第一行及边缘单元格的 Tooltip 会被容器裁切。

根因集中在 Heatmap 组件布局：网格使用固定 12px 单元格并设置 `overflow-x: auto`；月份位置通过 `weekIndex * 15` 和独立的 `margin-left` 手工计算；Tooltip 固定向上、单行展示，并位于带溢出裁切的网格容器内。

## 目标

- Heatmap 在桌面端和移动端均不产生组件内部横向滚动条或页面横向溢出。
- 月份标题、星期标题和日期单元格使用同一套网格轨道，保持准确对齐。
- 365 天数据完整展示，单元格尺寸根据可用宽度响应式调整。
- 首行、末行及左右边缘单元格的 Tooltip 完整可见，并允许综合活动明细合理换行。
- 保留 hover、click、focus 交互和既有 GitHub Heatmap 调用兼容性。

## 非目标（明确不做）

- 不修改综合活动接口、DTO、聚合算法或等级计算。
- 不改变热力图颜色方案、数据范围和明细字段。
- 不增加月份分页、日期区间切换或新的图表依赖。
- 不调整 About 页面其他板块布局。

## 影响范围

- `packages/components/heatmap/index.tsx` — 月份定位和 Tooltip 边缘方向语义。
- `packages/components/heatmap/styles.tsx` — 共享网格轨道、响应式单元格和 Tooltip 防裁切布局。
- Heatmap 既有测试目录或最小布局回归测试 — 固化无滚动、轨道对齐和 Tooltip 可见性。
