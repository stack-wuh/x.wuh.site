# 修复刷新页面时主题切换导致的闪烁

## 背景

用户反馈刷新页面时出现颜色闪烁。经排查发现防闪烁机制存在两个 bug。

## 问题 1: data-noTransition 与 CSS 选择器不匹配

内联 script 使用 `dataset.noTransition = 'true'` 设置属性。JavaScript 的 dataset API 会将驼峰转为全小写，因此实际 DOM 属性为 `data-notransition`。但 CSS 选择器写的是 `[data-no-transition]`（带连字符）。两者从未匹配过，`transition: none !important` 的保护从未生效。

## 问题 2: 执行顺序错误

内联 script 中先设置 `data-colorScheme="dark"`（触发 CSS 变量切换），之后才设置 `data-noTransition`（且因上述原因无效）。相当于先触发颜色变化动画，再穿防弹衣。

## 修复方案

1. 用 `setAttribute('data-no-transition', '')` 替代 dataset API
2. 先设置 `data-no-transition` → 强制 reflow（`void offsetHeight`）确保 `transition: none` 生效 → 再设置 `data-colorScheme` 和 `data-themeFamily` → 最后移除 `data-no-transition`
3. 移除 `cssVariableProvider.tsx` 中与 `viewport colorScheme` 冲突的 `@media (prefers-color-scheme: dark)` 规则
