# 设计：About 页面 + 多平台热力图

## 方案

### 1. 数据契约

```ts
type Contribution = {
  date: string // YYYY-MM-DD
  platform: 'github' | 'yuque' | 'wechat'
  count: number
  title?: string[]
  links?: string[]
}

type HeatmapResult = {
  contributions: Contribution[]
  range: { start: string; end: string }
}
```

### 2. 热力图渲染

- 7 行（周一至周日）× N 周格子
- 格子大小: 14-16px
- 颜色梯度: 0=透明、1=微绿、2=中绿、3+=深绿
- 平台筛选 + 时间窗口切换
- Tooltip: hover 显示详细数据
- SSR + ISR（revalidate 30 分钟）

### 3. 页面布局

- Hero: 短标题 + 副标题 + 关键指标卡片
- About: 左人像/图形 + 右文字 + 技能标签
- Heatmap: 全宽热力图 + 平台/时间筛选器
- 日志列表区: 可折叠，默认展开最近 7 天
- Contact: 头像 + 联系方式 + CTA

## 依赖

- 零新依赖（复用 Card、Tag 组件）
