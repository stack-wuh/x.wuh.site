# 设计：文章上下篇导航

## 方案

### 1. 数据获取

- 在 page.tsx 中获取当前文章的相邻文章信息
- 排序规则: 按 issue.number 或 created_at
- 查询范围: 仅 open issues
- 传递 prevIssue/nextIssue 给 PostView

### 2. Toolbar 布局

```
[← 上一条标题...]                    [下一条标题... →]
```

- `display: flex; justify-content: space-between`
- 按钮: `max-width: 45%`, `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`
- 禁用态: `aria-disabled`, 透明度降低, 无 pointer-events

### 3. 禁用态

- 无上一条/下一条: 按钮文案 "空空如也"
- 不可点击
- 视觉弱化

## 依赖

- 零新依赖
