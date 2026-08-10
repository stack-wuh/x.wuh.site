# QQ/微信弹窗纸张风改造

> 原始变更名：`2026-05-04-contact-dialog-paper-style`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
ContactCard 使用暗色渐变 + 玻璃质地 + backdrop-filter，与整体纸张风不搭。文字颜色硬编码不跟主题走。

## 引用规范
- `specs/contact-dialog.md`

## 决策
# Design: 弹窗纸张风

## ContactCard 改动

- Card: `background-100` + `radius-card` + elevation-card + inset 内发光
- Badge: 暗色透明 → 浅色 `background-200` tag 风格
- QR 区: 重阴影 → `var(--background-200)` 浅灰底板
- 文字: 硬编码色 → CSS 变量
- Avatar: 简化渐变，radius 统一 `var(--radius-card)`
- 去掉 `cardGradient`/`borderColor`/`hintColor` 定制化 prop

## HomeView 改动

- Dialog 加 `border-radius: var(--radius-card)`
- CONTACT_CONFIG 精简，去掉暗色定制字段

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `design.md`
# Design: 弹窗纸张风

## ContactCard 改动

- Card: `background-100` + `radius-card` + elevation-card + inset 内发光
- Badge: 暗色透明 → 浅色 `background-200` tag 风格
- QR 区: 重阴影 → `var(--background-200)` 浅灰底板
- 文字: 硬编码色 → CSS 变量
- Avatar: 简化渐变，radius 统一 `var(--radius-card)`
- 去掉 `cardGradient`/`borderColor`/`hintColor` 定制化 prop

## HomeView 改动

- Dialog 加 `border-radius: var(--radius-card)`
- CONTACT_CONFIG 精简，去掉暗色定制字段

### `proposal.md`
# QQ/微信弹窗纸张风改造

## 问题

ContactCard 使用暗色渐变 + 玻璃质地 + backdrop-filter，与整体纸张风不搭。文字颜色硬编码不跟主题走。

## 方案

全部改为纸张风，Cart 去掉暗色渐变，改用 `var(--background-100)` + 纸张风阴影 + `radius-card` 圆角。

## Scope

2 个文件：`ContactCard.tsx` + `HomeView.tsx`

### `specs/contact-dialog.md`
# Spec: 弹窗纸张风

## 验收

- [ ] ContactCard 使用 paper-style (background-100 + radius-card + elevation + inset)
- [ ] Dialog border-radius: var(--radius-card)
- [ ] 暗色模式正常
- [ ] 功能无回归（二维码预览、关闭弹窗）

### `tasks.md`
# Tasks

| # | 任务 | 状态 |
|---|------|------|
| 1 | ContactCard 纸张风重写 | ✅ |
| 2 | HomeView Dialog/CONTACT_CONFIG 适配 | ✅ |
