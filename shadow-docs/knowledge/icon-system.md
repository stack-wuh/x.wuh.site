---
title: 图标系统
domain: components
keywords: [图标, outline, lucide, SVG, strokeWidth, 线框风格, 图标系统]
scope:
  - packages/components/icons
status: active
source:
  - changes/archive/2026-05-04-extract-icons/brief.md
  - changes/archive/统一图标风格-2026-05-17/brief.md
  - changes/20260903-style-post-toc-mobile-polish/brief.md
  - changes/20260903-style-icon-actions-redesign/brief.md
verified: 2026-09-03
---

# 图标系统

## 当前结论

所有图标使用线框风格（`stroke='currentColor' fill='none'`），strokeWidth 统一为 2，strokeLinecap 和 strokeLinejoin 为 round。统一 Props 接口：`size`（默认 24）、`color`（默认 currentColor）、`strokeWidth`（默认 2）。

品牌图标（微信、QQ、GitHub 等）使用自定义 SVG 但风格与 lucide outline 图标一致，支持相同的 Props。旧版实心填充图标和混合风格图标已全部移除，引用指向 lucide-react 或重绘组件。品牌/社交族图标（wechat、qq、weibo、twitter、discord、netease、douban、github、email）经 `makeIcon` 的 `outline` 选项**恒用描边 fallback 渲染**——iconfont 字体中的品牌 glyph 为 `-circle` 实心风格，与全站描边语言冲突，禁止回退到字体 glyph（否则实心/描边随字体加载状态随机混搭）。业务页需要新通用图标时在 `icons/index.tsx` 从 lucide-react 按需具名导出（如曾用于页头标签的 `IconPaperclip`；下线业务引用后导出可保留在库中），不在业务目录散落 SVG。

移动端 Header 菜单按钮始终显示 20x20 的 IconBars outline SVG，保持 44x44 触摸区域。

## 执行约束

- 通用图标保持 currentColor 线框和统一 Props；业务代码从组件包图标子路径导入，不新增散落 SVG。

## 适用边界

品牌图标可保留品牌形状，但尺寸、颜色继承和可访问命名仍需统一。

## 验证方式

检查 icons 导出和 Props，搜索业务目录中的内联 `<svg` 与旧 iconfont 引用。

## 关联知识

- [components](./components.md)
- [design system](./design-system.md)
