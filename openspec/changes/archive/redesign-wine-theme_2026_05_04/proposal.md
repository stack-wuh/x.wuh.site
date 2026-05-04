# 酒红主题色彩搭配优化

## 为什么做

当前酒红主题背景是暖棕色（#7B5A5A，暗色），但文本色系 normalLight 是为浅色背景设计的深色文字（#1F1F1F ~ #A19090）。深色文字配深色背景，对比度极低（text-primary 仅 2.2:1，text-muted 仅 1.3:1），阅读吃力。

## 做什么

- 将酒红主题从"深色背景"改为"浅色背景"方案
- 重新设计 backgroundLight 色阶为暖粉/米色系（页面底 #F5F0EC）
- 重新设计 normalLight 色阶为深棕色系（在浅背景上有充足对比度）
- 保持酒红主色（#C94A44）和金色点缀（#E3B567）不变
- 简化 page-bg 为干净的线性渐变

## 影响范围

- `packages/components/themes/generator-color.ts` — backgroundLight, normalLight 色阶重设计
- `packages/components/themes/index.ts` — DefaultTheme.colors.background 更新
- `packages/components/themes/cssVariableProvider.tsx` — --page-bg 简化，--text-color 改为深色
- 首页 Hero/格言/博客列表/项目列表 — CSS 变量自动跟随
- SiteHeader — 自动跟随

## 不改什么

- 主色 primary（酒红 #C94A44）保持不变
- 素雅主题（plain）不受影响
- dark mode 色阶保持不变
- 组件结构/SiteHeader/HomeView 不动
