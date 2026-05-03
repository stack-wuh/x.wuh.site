# About 页面重设计

## 问题

上一版将所有 Section 套入纸张风卡片，导致"全是白方块"，缺层次感和节奏。OrnamentDivider 每个 Section 都放，从装饰变成了噪音。

## 设计方向

| 决策 | 选择 |
|------|------|
| Hero | 去卡片化，内容直接放在页面背景上 |
| 分隔 | OrnamentDivider 只保留首尾 |
| 卡片策略 | 仅 Contact 保留纸张风卡片，其他区块无卡片 |
| 日志布局 | 按日期聚合的纯时间线（一行一条日志） |

## Scope

单文件：`packages/wuh.site.next/app/about/page.tsx`
