---
keywords: [图标, outline, lucide, SVG, strokeWidth, 线框风格, 图标系统]
---

# 图标系统

所有图标使用线框风格（`stroke='currentColor' fill='none'`），strokeWidth 统一为 2，strokeLinecap 和 strokeLinejoin 为 round。统一 Props 接口：`size`（默认 24）、`color`（默认 currentColor）、`strokeWidth`（默认 2）。

品牌图标（微信、QQ、GitHub 等）使用自定义 SVG 但风格与 lucide outline 图标一致，支持相同的 Props。旧版实心填充图标和混合风格图标已全部移除，引用指向 lucide-react 或重绘组件。

移动端 Header 菜单按钮始终显示 20x20 的 IconBars outline SVG，保持 44x44 触摸区域。
