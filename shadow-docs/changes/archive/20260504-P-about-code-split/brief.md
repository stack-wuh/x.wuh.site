# About 页面代码拆分

> 原始变更名：`2026-05-04-about-code-split`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
`app/about/page.tsx` 728 行，样式（450行）和数据（100行）与组件逻辑混在一起，维护困难。

## 引用规范
- `specs/code-split.md`

## 决策
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

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `design.md`
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

### `proposal.md`
# About 页面代码拆分

## 问题

`app/about/page.tsx` 728 行，样式（450行）和数据（100行）与组件逻辑混在一起，维护困难。

## 方案

激进拆分：7 个文件，各司其职。

## Scope

`packages/wuh.site.next/app/about/` 目录下 7 个文件

### `specs/code-split.md`
# Spec: About 代码拆分

## 验收标准

- [ ] page.tsx < 80 行
- [ ] 每个文件职责单一
- [ ] 功能与拆分前完全一致（无回归）
- [ ] TypeScript 类型检查通过

### `tasks.md`
# Tasks

| # | 任务 | 文件 | 状态 |
|---|------|------|------|
| 1 | 提取静态数据 + 工具函数 | `data.ts` | ✅ |
| 2 | 提取公共 styled-components | `styles.ts` | ✅ |
| 3 | 抽离 OrnamentDivider | `OrnamentDivider.tsx` | ✅ |
| 4 | 抽离热力图区块 | `HeatmapSection.tsx` | ✅ |
| 5 | 抽离时间线区块 | `TimelineSection.tsx` | ✅ |
| 6 | 抽离平台概况区块 | `PlatformSection.tsx` | ✅ |
| 7 | 重写 page.tsx 为组合入口 | `page.tsx` | ✅ |
