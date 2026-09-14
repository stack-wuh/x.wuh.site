---
{
  "schema": "shadow-dev/v1",
  "name": "20260914-style-desktop-ui-redesign",
  "type": "style",
  "scope": "apps/desktop",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/desktop"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "ad965faec36886892fe934ce4ffc44386c1fced3",
    "verifiedAt": "2026-09-14T16:03:33.401Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# desktop UI 按 x.wuh.site 设计语言重做（视觉+布局）

## 动机

desktop 第一期的 UI 是 IDE 默认风：蓝色主色、自造深/浅两主题、emoji 图标（📄 ⑂ ◉ ⚙ 🌙）、系统字体——与 x.wuh.site 站点的设计语言（酒红/素雅暖色系、四主题、lucide 线框图标、Noto/JetBrains 字体）完全不搭配，用户明确指出「设计语言与 x.wuh.site 完全不搭配」「图标体验不好」。需要按站点设计规范重做一套 UI：视觉层（色彩/图标/字体/控件/滚动条/过渡）全面重做，布局层同步向站点气质靠拢。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 双维度主题模型 wine/plain × light/dark 共四主题；三层 CSS 变量（raw 调色板 → selector 路由 → 非颜色 token）；语义变量 --primary-color/--normal-{100-900}/--background-{100-900}；字体只用 --font-sans/--font-serif/--font-mono 三个语义 token（Noto Sans SC/Noto Serif SC/JetBrains Mono），font-synthesis:none；滚动条 8px 主题色胶囊；主题切换 0.3s ease 过渡
  - 适用 scope: packages/components/themes（源头）。desktop 按相同结构快照复制，视觉同源
- shadow-docs/knowledge/icon-system.md
  - 当前结论: 全部图标 lucide 线框风格（stroke=currentColor, fill=none, strokeWidth=2, round cap/join），统一 size/color/strokeWidth Props，不散落 SVG
  - 适用 scope: packages/components/icons（源头）。desktop 直依赖 lucide-react 上游库获得同一图标语言
- shadow-docs/knowledge/components.md
  - 当前结论: 组件子路径导出、Divider 用色分工、MessageCard 视觉/布局分离等
  - 适用 scope: packages/components。desktop 自持实现，仅参考其视觉语言与职责分离思路

## 决策

- **选型:**
  1. **主题覆盖:** 四主题全量（wine/plain × light/dark），外观设置提供 主题族 × 色温 两组切换，localStorage key `wd.theme`（结构对齐站点 `wuh.site.theme`）
  2. **token 来源:** 快照复制——把 `packages/components/themes/generator-color.ts` 的调色板值与 `tokens.ts` 的 spaces/fontSizes/borderRadius 复制进 desktop `theme/tokens.ts`，保持相同语义变量名与三层 CSS 变量结构；文件头注明 source commit 便于追溯。组件库无发布管线，跨仓库消费不可行；token 变更频率极低，漂移风险可接受
  3. **图标:** desktop 直依赖 lucide-react（站点图标上游库），封装 `<AppIcon>` 统一 size 档位（14/16/20/24）与 strokeWidth=2/currentColor；替换全部 emoji（ActivityBar、主题切换、空状态、按钮、状态栏、树节点 caret 等）
  4. **字体:** 内置站点同款 Noto Sans SC（400/500/600/700）与 JetBrains Mono（400/500/700）WOFF2 子集，@font-face 本地加载；暴露 --font-sans/--font-mono token，font-synthesis:none；预览区正文可选衬线（Noto Serif SC 视体积决定是否内置，倾向不内置、预览用 sans）
  5. **范围:** 视觉+布局一起重构——保留三栏 IDE 骨架的可用性，但标题栏/侧栏/面板的圆角、间距、阴影、分隔线对齐站点组件语言；预览区排版向博客阅读态靠拢（行高、段距、标题装饰）；CodeMirror 主题跟随新 token；滚动条重做为站点同款 8px 主题色胶囊
- **对比方案:**
  - 共享 @wuh.site/tokens npm 包 → 放弃：需先建组件库发布管线，本期成本明显放大（挂起项，与上次「组件库发布化」同一触发条件）
  - 构建时读 monorepo 源码生成 token → 放弃：破坏 desktop 独立 clone 可构建的子模块设计
  - 拷贝站点 icons 封装（makeIcon）→ 放弃：依赖 iconfont/品牌图标体系，desktop 用不到，拷贝面大收益小
  - 只做酒红两主题 / 只换色和图标 → 放弃：用户明确选择四主题全量与视觉+布局重构
- **理由:** desktop 与站点的「同源」落在设计语言层（色彩/图标/字体/细节质感），不落在代码层（组件库跨仓库不可消费是既定事实）。快照复制 + 上游同库（lucide-react）+ 同款字体，三者都能在零跨仓依赖下达成视觉同源。遵循 design-system.md「颜色必须经主题变量暴露，不硬编码」与 icon-system.md「统一 Props 线框图标」的执行约束。

## 任务

### Phase 1 — Token 层（TDD）
- [x] 快照复制四主题调色板与非颜色 token 进 `theme/tokens.ts`，三层 CSS 变量结构 + 语义变量映射 — `src/renderer/src/theme/tokens.ts` — 重写
- [x] token 快照测试：四主题变量齐全、语义映射正确、与站点源值抽样一致 — `tests/theme.test.ts` — 重写

### Phase 2 — 主题机制
- [x] ThemeProvider 双维度重构（family × scheme，`wd.theme` 持久化，0.3s 过渡，无闪动初始化） — `src/renderer/src/theme/ThemeProvider.tsx` — 重写
- [x] 外观切换 UI（标题栏入口，主题族 × 色温选择） — `src/renderer/src/components/AppearanceMenu.tsx` — 新增

### Phase 3 — 字体
- [x] 下载并内置 Noto Sans SC / JetBrains Mono WOFF2 子集 + @font-face + --font-sans/--font-mono + font-synthesis:none — `src/renderer/src/theme/fonts.css` — 新增
- [x] 全局字体栈切换（UI sans / 编辑器与代码 mono） — `src/renderer/src/styles/global.css` — 修改

### Phase 4 — 图标体系
- [x] 引入 lucide-react，封装 AppIcon（size 档位/strokeWidth=2/currentColor） — `src/renderer/src/components/ui/AppIcon.tsx` — 新增
- [x] 替换全部 emoji：ActivityBar/主题切换/文件树 caret/空状态/按钮/状态栏 — `src/renderer/src/**` — 修改

### Phase 5 — 控件重样式
- [x] Button/Input/Textarea/Select/Tag/Empty/Dialog 按站点视觉重做（圆角/间距/hover/焦点态） — `src/renderer/src/components/ui/*` + `styles/ui.css` — 修改
- [x] 滚动条重做：8px 主题色胶囊，四主题适配，标准与 WebKit 双写 — `src/renderer/src/styles/global.css` — 修改

### Phase 6 — 布局与阅读态
- [x] 标题栏/侧栏/面板布局重构（分隔线、圆角、阴影、间距对齐站点语言） — `src/renderer/src/styles/global.css` + `App.tsx` — 修改
- [x] 预览区博客阅读态排版（行高/段距/标题装饰/引用块/代码块配色） — `src/renderer/src/styles/preview.css` — 新增
- [x] CodeMirror 主题对齐新 token（背景/选区/caret/gutter 随四主题） — `src/renderer/src/editor/CodeMirrorEditor.tsx` — 修改

### Phase 7 — 验收
- [x] 全量验证：vitest + tsc 双侧 + electron-vite build + 打包冒烟 — `apps/desktop` — 验证
- [x] 四主题 × 主要界面截图走查（对照站点观感） — `apps/desktop` — 验证

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 新增
- **候选卡片:** shadow-docs/knowledge/desktop-app-architecture.md（与前一 change 候选合并，追加「设计语言同源策略：token 快照 + lucide 上游同库 + 字体内置」结论）
- **理由:** 「跨仓库设计同源」的快照复制模式与触发升级条件（组件库发布化）是长期有效事实；desktop 域已有候选卡片，按查重规则更新而非另立
