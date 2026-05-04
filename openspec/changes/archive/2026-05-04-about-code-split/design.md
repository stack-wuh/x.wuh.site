# Design: About 代码拆分

## 文件规划

```
app/about/
├── page.tsx              (~50行) 组合入口，拼装各区块
├── data.ts               (~120行) 静态数据/常量/工具函数
├── styles.ts             (~270行) 公共 styled-components
├── OrnamentDivider.tsx    (~15行) 装饰分隔线
├── HeatmapSection.tsx    (~200行) 热力图区块 + 专属样式
├── TimelineSection.tsx   (~130行) 时间线日志区块 + 专属样式
└── PlatformSection.tsx    (~90行) 平台概况区块 + 专属样式
```

## 导入关系

```
page.tsx
  ├── data.ts (metrics, expertiseTags)
  ├── styles.ts (PageRoot, Hero*, Section*, About*, Contact*)
  ├── OrnamentDivider.tsx (→ styles.ts DividerRow/Line/Diamond)
  ├── HeatmapSection.tsx (→ data.ts + styles.ts Section*)
  ├── TimelineSection.tsx (→ data.ts + styles.ts Section*)
  └── PlatformSection.tsx (→ data.ts + styles.ts Section*)
```

## 样式归属

- **styles.ts**: 公共组件（PageRoot、Hero、Section、About、Contact、分隔线）
- **Section 专属样式**: 每个 Section 组件文件内定义，不污染全局样式文件
