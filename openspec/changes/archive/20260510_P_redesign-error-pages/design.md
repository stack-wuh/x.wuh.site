# 设计文档

## 架构对比

### 之前

```
not-found.tsx
  ├── createGlobalStyle — 重复设置 body 样式
  ├── Root (flex centering)
  └── Result (status='404')
        ├── Card (border + shadow + grid 布局)
        ├── Status badge (danger color pill)
        ├── Title / Description
        ├── Link pills
        └── Button actions

error.tsx
  └── Result (status='500')
        └── 同上 Card 布局
```

### 之后

```
not-found.tsx
  └── 与首页一致的开放布局
        ├── 大号状态数字 (404/500) — typography 驱动
        ├── 标题 + 描述文字
        └── 操作按钮组

error.tsx
  └── 同 not-found.tsx 的布局
        └── 额外: reset() 重试按钮
```

## 视觉方向

- **无边卡** — 移除 `border` + `box-shadow` + `background` card 容器
- **Typography 驱动** — 大号状态数字作为视觉焦点，标题/描述文字层次分明
- **酒红氛围** — 使用 `var(--primary-color)` 点缀状态数字
- **居中布局** — 与首页一致的 `min-height: 70vh` 垂直居中
- **共享样式组件** — 两个页面复用同一套样式

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/not-found.tsx` | 重写 | 移除 Result + GlobalLayout，改为 editorial 风格 |
| `app/error.tsx` | 重写 | 同上布局，保留 reset() |
| `app/post/[number]/error.tsx` | 重写 | 同上布局，博客相关文案 |
