# 设计文档：页面刷新闪烁修复

## 现状

内联 script 执行流程:
1. 读取 `matchMedia` 设置 `data-colorScheme`
2. 读取 `localStorage` 设置 `data-themeFamily`
3. 设置 `dataset.noTransition = 'true'`（实际 DOM 属性: `data-notransition`）

CSS 变量路由依赖 `[data-color-scheme="dark"]` 选择器，切换时所有使用 CSS 变量的元素颜色变化。

## 问题分析

### 核心问题链

```
误用 dataset API → data-notransition 与 data-no-transition 不匹配
    ↓
transition: none 从未生效
    ↓
data-colorScheme 切换触发 CSS 变量变化
    ↓
全局 * { transition: 0.3s } 让颜色变化产生动画
    ↓
视觉上看到从 light 到 dark 的"闪烁"过渡
```

### 次级问题

`cssVariableProvider.tsx` 中的 `@media (prefers-color-scheme: dark) { html { color-scheme: dark; } }` 与 `layout.tsx` viewport 的 `colorScheme: 'light dark'` 功能重复。后者通过 `<meta name="color-scheme">` 标签在 HTML 解析阶段就已生效，前者在 styled-components 注入后才生效，有可能造成短暂的滚动条色差。

## 修复设计

### 同步脚本执行顺序（修正后）

```
[setAttribute('data-no-transition', '')]
    ↓ 禁用所有过渡动画
[void offsetHeight]  ← 强制浏览器重排
    ↓ 确保 transition: none 已实际应用
[set data-colorScheme]
[set data-themeFamily]
    ↓ 现在切换 CSS 变量 → 无动画，无闪烁
[removeAttribute('data-no-transition')]
    ↓ 恢复过渡动画
```

### 改动范围

| 文件 | 改动 |
|---|---|
| `packages/wuh.site.next/app/layout.tsx` | 修正 dataset → setAttribute；调整执行顺序；强制 reflow；立即移除 |
| `packages/components/themes/cssVariableProvider.tsx` | 移除与 viewport 冲突的 @media 规则 |
