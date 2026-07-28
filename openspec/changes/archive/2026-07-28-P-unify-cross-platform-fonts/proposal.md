# 主站跨平台字体统一：Noto 双家族全量自托管方案

## 背景

主站目前加载了 Inter（仅 Latin 子集）和 Noto Serif SC（仅 400/700），但中文无衬线内容仍会回退到操作系统字体。macOS 通常使用苹方，Windows 通常使用微软雅黑，二者字形、字宽、标点位置和 synthetic bold 方式不同，导致：

- 同一标题在 Windows 提前换行；
- 按钮与标签宽度不一致；
- font-weight 500/600 的视觉粗细在两个平台不同；
- 中英文混排的基线和密度不一致。

单纯统一 CSS font-family 名称或排版指标（line-height、font-size）无法解决这些由字体度量本身决定的差异。

## 目标

- 主站中文、英文、数字和标点全部使用同一套自托管 Web Font，消除中文回退系统字体。
- 提供 400/500/600/700 真实字重，禁止浏览器对缺失字重进行 synthetic bold/italic。
- CJK 字体按 unicode-range 分片加载，首屏只下载页面实际命中的分片。
- 字体 token（--font-sans / --font-serif / --font-mono）作为全站唯一字体入口，禁止组件直接声明系统字体栈。
- 在 macOS/Windows 的 Chrome、Edge、Safari 上验证字形、字宽、换行和 CLS 一致。

## 非目标（明确不做）

- 不消除 macOS CoreText 与 Windows DirectWrite 的抗锯齿差异（像素灰度级一致不是承诺目标）。
- 不覆盖后台 Console（wuh.site.console）。
- 不替换 iconfont 和彩色 Emoji 字体。
- 不修改字号、行高、字重的语义 token 值，只改字体来源。

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 替换 Inter 为 Noto Sans SC，补充 400/500/600/700，JetBrains Mono 从 post layout 提升到 root layout 注入。
- `packages/wuh.site.next/app/post/layout.tsx` — 移除 JetBrains Mono 注入，由 root layout 统一提供。
- `packages/components/themes/cssVariableProvider.tsx` — 更新 --font-sans / --font-serif / --font-mono 的 fallback 栈；增加 font-synthesis: none。
- `packages/wuh.site.next/app/post/styles/post-markdown.ts` — 移除代码字体硬编码，改用 var(--font-mono)。
- 全站组件中直接声明 Georgia、system-ui、Menlo、Consolas 等的引用 — 统一改为字体 token。
