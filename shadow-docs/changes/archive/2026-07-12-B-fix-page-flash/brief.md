# 修复刷新页面时主题切换导致的闪烁

> 原始变更名：`2026-07-12-B-fix-page-flash`

## 元数据
- 日期：2026-07-12
- 类型：B
- 状态：archived
- Issue：历史记录未提供

## 动机
用户反馈刷新页面时出现颜色闪烁。经排查发现防闪烁机制存在两个 bug。

## 引用规范
- `specs/page-flash-fix/spec.md`

## 决策
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

## 任务
### Phase 1: 修复防闪烁机制
- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 用 `setAttribute('data-no-transition', '')` 替代 `dataset.noTransition = 'true'`
- [x] **原因:** dataset API 将驼峰转全小写，导致 `data-notransition` 与 CSS `[data-no-transition]` 不匹配
- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 先禁用过渡 → 强制 reflow → 设置 data 属性 → 恢复过渡
- [x] 添加 `void document.documentElement.offsetHeight` 确保 CSS 已重新计算
- [x] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [x] 移除 `@media (prefers-color-scheme: dark) { html { color-scheme: dark; } }`
- [x] 由 viewport 的 `colorScheme: 'light dark'` 统一管理
- [x] TypeScript 编译通过
- [ ] 手动测试：刷新页面无闪烁
- [ ] 手动测试：dark/light 模式切换正常

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-12-B-fix-page-flash
date: 2026-07-12
type: B
status: archived
issue: https://github.com/stack-wuh/x.wuh.site/issues/199
pr: https://github.com/stack-wuh/x.wuh.site/pull/200
domain:
  name: 页面刷新闪烁修复
  keywords: [闪烁, flash, data-no-transition, reflow, 过渡动画]
  description: 修复首屏加载时因防闪烁机制失效导致主题切换出现视觉闪烁
```

### `design.md`
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

### `proposal.md`
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

### `specs/page-flash-fix/spec.md`
# 页面刷新闪烁修复规范

## 同步脚本规范

### 内联 script 执行顺序

```javascript
(function() {
  // Step 1: 禁用过渡
  document.documentElement.setAttribute('data-no-transition', '');
  // Step 2: 强制重排
  void document.documentElement.offsetHeight;
  // Step 3: 设置主题
  document.documentElement.dataset.colorScheme = scheme;
  document.documentElement.dataset.themeFamily = stored;
  // Step 4: 恢复过渡
  document.documentElement.removeAttribute('data-no-transition');
})();
```

### 关键要求

1. **必须使用 `setAttribute`** 而非 dataset API 设置 `data-no-transition`，确保 DOM 属性名与 CSS 选择器一致
2. **必须先禁用过渡再设置 data 属性**，顺序不可颠倒
3. **必须强制 reflow**（`void offsetHeight`），确保浏览器已应用 `transition: none` 后才切换 CSS 变量
4. **必须在同一同步块中完成** 以上所有操作，避免浏览器在两个帧之间渲染

## CSS 规范

### color-scheme 声明

- **ONLY** 通过 `layout.tsx` 的 `Viewport` export 声明 `colorScheme: 'light dark'`
- **NOT** 在 `cssVariableProvider.tsx` 或任何 styled-components 中使用 `@media (prefers-color-scheme: dark)` 声明 `color-scheme`
- **原因:** viewport 的 `<meta name="color-scheme">` 在 HTML 解析阶段立即生效，而 styled-components 注入的 CSS 要等 hydration 后才生效，两者之间存在时间差可能导致闪烁

### `tasks.md`
# 任务清单

## Phase 1: 修复防闪烁机制

### Task 1: 修正 data-no-transition 属性名
- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 用 `setAttribute('data-no-transition', '')` 替代 `dataset.noTransition = 'true'`
- [x] **原因:** dataset API 将驼峰转全小写，导致 `data-notransition` 与 CSS `[data-no-transition]` 不匹配

### Task 2: 调整执行顺序
- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 先禁用过渡 → 强制 reflow → 设置 data 属性 → 恢复过渡
- [x] 添加 `void document.documentElement.offsetHeight` 确保 CSS 已重新计算

### Task 3: 移除冲突的 color-scheme
- [x] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [x] 移除 `@media (prefers-color-scheme: dark) { html { color-scheme: dark; } }`
- [x] 由 viewport 的 `colorScheme: 'light dark'` 统一管理

## 验收

- [x] TypeScript 编译通过
- [ ] 手动测试：刷新页面无闪烁
- [ ] 手动测试：dark/light 模式切换正常
