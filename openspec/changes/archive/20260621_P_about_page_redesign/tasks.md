# 任务清单

## Task 1: 重写 styles.ts

- [x] **文件:** `packages/wuh.site.next/app/about/styles.ts`
- [x] PageRoot 缩小到 640px，增大 padding
- [x] Hero 样式：HeroLabel（accent-color）、HeroTitle（serif）、HeroSub
- [x] SectionHeader + SectionLabel 组件
- [x] AboutTimeline + TimelineTrack + TimelineDot（桌面端 2px 竖线，移动端 hidden）
- [x] Profile 样式：Avatar（56px 圆形渐变）、ProfileRow、Bio（serif 15px）
- [x] PlatformCard：浅暖色背景 + hover 效果 + 暗色模式
- [x] ContactRow + ContactItem
- [x] MetricRow + MetricItem + MetricSep + MetricLabel
- [x] Heatmap 样式：HeatmapGrid、Cell、ChipButton、Legend
- [x] Timeline 样式：TimelineRow（hover 左移）、TimelineDate、TimelineSelect
- [x] **类型检查:** `npx tsc --noEmit`

## Task 2: 更新 data.ts

- [x] **文件:** `packages/wuh.site.next/app/about/data.ts`
- [x] metrics 去掉 `detail` 字段，仅保留 `label` 和 `value`
- [x] platformStories 精简 description
- [x] **类型检查:** `npx tsc --noEmit`

## Task 3: 重写 page.tsx

- [x] **文件:** `packages/wuh.site.next/app/about/page.tsx`
- [x] 4-section 结构：Hero → 关于我(合并) → 热力图 → 时间线
- [x] 关于我内嵌 Profile + Platforms + Contact + Metrics
- [x] TimelineTrack 装饰线含 3 个 TimelineDot
- [x] 热力图含 FilterGroup + HeatmapGrid + Legend
- [x] 时间线含 TimelineSelect + TimelineList
- [x] **类型检查:** `npx tsc --noEmit`

## Task 4: 删除旧组件

- [x] 删除 `HeatmapSection.tsx`
- [x] 删除 `PlatformSection.tsx`
- [x] 删除 `TimelineSection.tsx`
- [x] 删除 `OrnamentDivider.tsx`
- [x] grep 确认无残留引用

## Task 5: 构建验证

- [x] `npx tsc --noEmit` — 零错误
- [x] About 目录从 9 个文件精简到 4 个（+ 空 md）
