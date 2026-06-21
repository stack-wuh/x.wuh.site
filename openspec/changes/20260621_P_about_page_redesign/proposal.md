# About 页面重设计

## 背景

现有 About 页面是纯静态页面，6 个 section 按固定顺序排列。视觉上偏向简洁学术风，存在信息重复、层级不够清晰的问题。

## 目标

- 视觉风格：保持简洁学术底子，注入温润人文气质（沿用 `plain` 主题色板）
- 内容结构：合并个人简介+平台+联系为"关于我"，信息层级重新排布为 Hero → 关于我 → 热力图 → 时间线
- 响应式：桌面端 Timeline 装饰线叙事，移动端退化为干净列表
- 配色不引入新变量，排版区分 Serif（叙事）和 Sans（信息）

## 影响范围

- `packages/wuh.site.next/app/about/styles.ts` — 完全重写
- `packages/wuh.site.next/app/about/data.ts` — 精简 metrics 和 platformStories
- `packages/wuh.site.next/app/about/page.tsx` — 重写为 4-section 结构
- 删除 `HeatmapSection.tsx`、`PlatformSection.tsx`、`TimelineSection.tsx`、`OrnamentDivider.tsx`
- `app/about/layout.tsx` — 不变
