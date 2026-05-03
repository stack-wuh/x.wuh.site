# Design: About 重设计

## 视觉层次

```
Hero（无卡，居中大字）
  │
  ├─ OrnamentDivider ───────────────── (仅首)
  │
  ├─ About（无卡，头像 + 文字横排)
  ├─ 平台热力图（无卡，hotmap 直出）
  ├─ 最近日志（无卡，纯时间线）
  ├─ 平台概况（无卡，轻量项目卡片）
  │
  ├─ 联系与社交（纸张风卡片）─── (唯一卡片)
  │
  └─ OrnamentDivider ───────────────── (仅尾)
```

## 关键设计决定

### Hero 去卡片化
- 移除 HeroCard 包裹
- 标题大字 + 副标题直接放页面背景
- Metrics 改为横排 `值 · 标签` 格式，轻量展示

### Section 标题
- 保留 `var(--font-serif)` + `font-weight: 700`
- 每个 Section 有 subtitle 辅助说明

### 平台概况（无卡）
- 平台条目改为轻量 div，底部分隔线区分
- 不用 Card 组件

### 最近日志（按日期聚合时间线）
- InkDot + 日期 + 摘要 + 内联链接
- 链接用 · 分隔，compact 排在一行
- hover 左移动效保留

### 唯一卡片
- 联系与社交区：纸张风卡片 (`background-100` + `radius-card` + elevation + inset)
- 暗色模式精细适配
