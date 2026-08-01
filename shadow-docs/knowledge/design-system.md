---
keywords: [主题系统, CSS变量, 暗黑模式, 主题切换, 字体, 无闪动, 打字动画, Header导航, 外观设置]
---

# 设计系统

双维度主题模型：`data-theme-family`（wine/plain）和 `data-color-scheme`（light/dark），组合为 4 种主题，存储于 localStorage key `wuh.site.theme`。

CSS 变量分三层：`:root` 注入 raw 调色板；4 个 selector 路由映射到公开变量；非颜色 tokens（spaces/fontSizes/borderRadius）通过 theme props 注入。颜色变量命名使用 `--primary-color`、`--text-primary`、`--background-{100-900}` 等语义化 token。三个字体 token（`--font-sans`、`--font-serif`、`--font-mono`）由 Noto Sans SC、Noto Serif SC、JetBrains Mono 自托管提供，真实字重覆盖 400/500/600/700，全局 `font-synthesis: none` 禁止浏览器合成粗体或斜体。全站任何组件声明 font-family 只能引用这三个语义 token，不直接写平台字体名。

首屏主题无闪动：`<head>` 中的同步脚本在首次渲染前设置 `data-no-transition` 禁用过渡、强制重排、设置主题属性、再移除 `data-no-transition` 恢复过渡，整个过程在同一同步块完成。主题切换时所有元素的 background-color、color、border-color、box-shadow 以 0.3s ease 平滑过渡。

首页标语使用 TypewriterMotto 打字机效果逐字显示，两句循环："写作是抵抗遗忘的方式，代码是构建世界的语言。" / "不要停步不前，每一天都要做出改变。"

桌面端 Header 导航项悬停时显示 1px 高、两端透明、中段使用 `--primary-color` 的渐隐装饰下划线，不使用胶囊背景或位移动效。桌面端外观入口与导航风格统一，外观选项由共享 `AppearanceOptions` 组件统一管理。移动端外观设置在菜单内展开，不弹出独立 Bottom Sheet。主题色板预览使用固定渐变色值，不读取页面 CSS 变量。
