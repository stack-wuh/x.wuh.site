# 移动端 viewport 增强 — themeColor + colorScheme

> 原始变更名：`2026-07-12-P-mobile-viewport-enhance`

## 元数据
- 日期：2026-07-12
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
移动端打开站点时缺少两项浏览器级别的体验优化：

1. Chrome 地址栏/Safari 顶部栏颜色为默认色，与站点亮暗主题不协调
2. 站点加载时可能出现短暂白屏，因为浏览器不知道站点支持暗色模式

## 引用规范
- `specs/mobile-viewport/spec.md`

## 决策
# 设计文档

## 技术方案

在已有 `layout.tsx` 的 `viewport` 导出中新增两项配置。

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b91c1c' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0a0a' },
  ],
  colorScheme: 'light dark',
}
```

- `themeColor` — 通过 media query 区分亮暗，亮色 #b91c1c（wine primary），暗色 #1a0a0a（深黑红）
- `colorScheme` — 设为 `'light dark'`，浏览器加载时按系统偏好立即应用正确主题，消除闪白

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 完全兼容，旧浏览器忽略不识别的 meta
- **性能影响:** 无

## 任务
### Phase 1: 扩展 Viewport 配置
- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在 `viewport` 导出中添加 `themeColor` 数组（亮/暗各一条）
- [ ] 添加 `colorScheme: 'light dark'`
- [ ] **验证:** `oxlint` 零错误
- [ ] oxlint 零错误
- [ ] 亮色模式移动端浏览器工具栏显示暗红色
- [ ] 暗色模式移动端浏览器工具栏显示深黑色
- [ ] 首屏加载无闪白

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-12-P-mobile-viewport-enhance
date: 2026-07-12
type: P
status: archived
issue: https://github.com/stack-wuh/x.wuh.site/issues/197
domain:
  name: 移动端 viewport 增强
  keywords: [viewport, themeColor, colorScheme, 移动端, 浏览器主题色, 闪白修复]
  description: 为 site 的 Viewport 导出增加 themeColor 和 colorScheme 配置
```

### `design.md`
# 设计文档

## 技术方案

在已有 `layout.tsx` 的 `viewport` 导出中新增两项配置。

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b91c1c' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0a0a' },
  ],
  colorScheme: 'light dark',
}
```

- `themeColor` — 通过 media query 区分亮暗，亮色 #b91c1c（wine primary），暗色 #1a0a0a（深黑红）
- `colorScheme` — 设为 `'light dark'`，浏览器加载时按系统偏好立即应用正确主题，消除闪白

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 完全兼容，旧浏览器忽略不识别的 meta
- **性能影响:** 无

### `proposal.md`
# 移动端 viewport 增强 — themeColor + colorScheme

## 背景

移动端打开站点时缺少两项浏览器级别的体验优化：

1. Chrome 地址栏/Safari 顶部栏颜色为默认色，与站点亮暗主题不协调
2. 站点加载时可能出现短暂白屏，因为浏览器不知道站点支持暗色模式

## 目标

- 亮色模式浏览器工具栏显示暗红色（与 wine 主题主色一致）
- 暗色模式浏览器工具栏显示深黑色（与暗色背景融合）
- 通过 `colorScheme: 'light dark'` 告知浏览器站点原生支持双主题

## 非目标（明确不做）

- 不修改任何样式文件
- 不影响 viewport 现有的禁用缩放配置

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 扩展 Viewport 导出

### `specs/mobile-viewport/spec.md`
# Spec: 移动端 viewport 增强

## ADDED

### Requirement: 亮/暗主题工具栏颜色
- **GIVEN** 用户在移动端浏览器访问站点
- **WHEN** 系统处于亮色模式
- **THEN** 浏览器工具栏（地址栏/顶部栏）应显示暗红色 #b91c1c
- **AND** 当系统处于暗色模式时，工具栏应显示深黑色 #1a0a0a

### Requirement: colorScheme 声明
- **GIVEN** 浏览器加载页面
- **WHEN** HTML `<meta name="color-scheme">` 已设置 `light dark`
- **THEN** 浏览器应在加载阶段就按系统偏好应用主题色，避免闪白

### `tasks.md`
# 任务清单

## Phase 1: 扩展 Viewport 配置

### Task 1: 添加 themeColor 和 colorScheme

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在 `viewport` 导出中添加 `themeColor` 数组（亮/暗各一条）
- [ ] 添加 `colorScheme: 'light dark'`
- [ ] **验证:** `oxlint` 零错误

## 验收

- [ ] oxlint 零错误
- [ ] 亮色模式移动端浏览器工具栏显示暗红色
- [ ] 暗色模式移动端浏览器工具栏显示深黑色
- [ ] 首屏加载无闪白
