---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-feature-responsive-layout-components",
  "type": "feature",
  "scope": "packages/components",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261006-feature-responsive-layout-components",
  "files": [
    "packages/components/col/index.test.mjs",
    "packages/components/col/index.tsx",
    "packages/components/col/readme.md",
    "packages/components/flex/index.test.mjs",
    "packages/components/flex/index.tsx",
    "packages/components/flex/readme.md",
    "packages/components/flex/specs.tsx",
    "packages/components/row/index.test.mjs",
    "packages/components/row/index.tsx",
    "packages/components/row/readme.md",
    "packages/components/stagger/index.test.mjs",
    "packages/components/stagger/index.tsx",
    "packages/components/stagger/readme.md",
    "packages/components/themes/responsive.test.mjs",
    "packages/components/themes/responsive.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 483,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/483",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "214dab7a6bb36354ece841575c4247bc568d9cf4",
    "verifiedAt": "2026-10-06T09:32:56.219Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:483",
    "planHash": "c57b90715b08313d1167a7eacc8fdd97a6f7b33708882af4c8fefc27a83f9c1a",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 响应式组合式布局组件：Row/Col 12 分栏栅格 + Flex 重写 + Stagger 动效子包",
      "titleRaw": "响应式组合式布局组件：Row/Col 12 分栏栅格 + Flex 重写 + Stagger 动效子包",
      "supplement": "以 GitHub Issues 作为 CMS 的站点布局底座重立契约：Row/Col（12 分栏 grid 语义，数组断点语法）、Flex 重写（响应式分布原语）、Stagger 动效子包（错峰入场，字面值节奏，reduced-motion 降级）。详细方案、任务拆分与验收标准见 shadow-docs/changes/20261006-feature-responsive-layout-components/brief.md",
      "body": "## 动机\n站点约 10 个文件、99 处手写 `@media` 布局样式缺乏统一原语，后续将分批替换进代码；现有 `packages/components/flex`（271 行完整实现）零响应式能力且全仓零消费者，`row/`、`col/`、`space/` 为 0 行占位。本次为布局系统重立契约：一套移动优先、断点语义化、动效与内核分层的组合式布局组件，作为后续替换的唯一布局底座。本次不触碰任何存量页面。\n\n## 引用规范\n- norms/ui-patterns.md\n  - 当前结论: 响应式三档必须覆盖、禁止横向滚动；动效过渡 150–300ms ease-out、禁止布局位移类动画（width/height/top/left 过渡）、必须响应 prefers-reduced-motion；设计规范先行、组件复用优先\n  - 适用 scope: packages/components/*, 未来 apps/site 消费方\n- norms/code-style-frontend.md（React 组件库段）\n  - 当前结论: 组件库不依赖业务/Next 页面；styled-components 一律 `$` 前缀 transient props；主题色/间距用 CSS 变量或主题令牌\n  - 适用 scope: packages/components\n- norms/tdd-verification.md\n  - 当前结论: M 级 = 绿灯测试（写测试不强制先红）+ unit + 走查；先建功能分支再写代码\n  - 适用 scope: 全流程\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 断点体系 `BREAKPOINTS = { mobile: 640(max), small: 520(max), tablet: 1024(min) }`，新代码必须用语义常量、禁新裸断点；spaces md~3xl 为 clamp 响应值（窄屏收缩、桌面封顶）\n  - 适用 scope: packages/components/themes, packages/components/{flex,row,col}\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 「微光呼吸 × 书写显现」语言；packages/components 共享组件不得引用 `--motion-*`（console 不注入主题变量）；禁止 JS scroll/resize 监听做动画；关键帧唯一性规则 scope 为站点 MotionStyles，组件包自持关键帧有 Progress/audio-player 先例（守卫要求 css 包裹 + reduced-motion 块在场）\n  - 适用 scope: packages/components/stagger, apps/site/app/styles/motion.ts\n- shadow-docs/knowledge/components.md\n  - 当前结论: `exports` map 子路径直接消费（无桶文件）；样式纪律由同目录 `index.test.mjs` 守卫固化（禁裸 hex、禁裸断点、禁 `--motion-*`、transition 禁布局属性、reduced-motion 在场）\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** CSS-first 双原语 + 用户批准的四项微调（propose 会话确认）：\n  1. `Row`/`Col` 直接落在现有占位目录，不单设 `Grid`；对外承诺 **12 分栏词汇**（`span` 1–12），底层实现为 `grid-template-columns: repeat(12, 1fr)` + `grid-column: span n`，无负 margin；\n  2. 响应式 props 一律**数组断点语法** `[base, tablet?]`——索引 0 为 <1024 基线（移动/窄平板合并），索引 1 在 `min-width: BREAKPOINTS.tablet` 生效；超窄 small 档由既有 clamp 间距与基线堆叠承担，布局组件不开第三槽；\n  3. `Flex` 重写为分布/对齐原语（direction/gap/justifyContent/alignItems/wrap/padding/margin 等同支持数组），收敛原 20 个 styled attrs 别名（`Row` 别名从 flex 移除，避免与 row 目录冲突；其余纯 flex 对齐别名按消费价值保留或删减，零消费者无兼容义务）；\n  4. 动效层**单独导出子包** `@wuh.site/components/stagger`：不并入站点 MotionStyles；自持关键帧（`css` 包裹，Progress 守卫同法），节奏用与 motion tokens 对齐的**字面值**（600ms / cubic-bezier(0.22,1,0.36,1)，即 dur-reveal / ease-out-soft 的展开值）而**不引用 `--motion-*` 变量**，console 无主题变量亦可安全消费；子项错峰入场：仅 opacity + translateY，`nth-child` 枚举步长延迟（默认 60ms，枚举上限 12），reduced-motion 降级直显。\n- **对比方案:**\n  - 方案 A（Ant 式负 margin gutter 12 栅格）：词汇同样大众熟悉，但负 margin 与站点 `html/body overflow-x: clip` 滚动纪律有冲突风险，百分比宽度表达不了内容自适应，属浮动时代劣解——未选；\n  - 方案 C（单一 Stack 原子组件）：flex/grid 两套语义混装，组合式可读性差，areas/跨列表达吃力——未选；\n  - 原方案 B（新增 grid 目录 + 动效并入站点 MotionStyles）：被用户四项微调取代（Row/Col 目录复用、12 分栏语义、数组语法、动效子包化）。\n- **理由:** 项目真正的响应式基建已齐（BREAKPOINTS 语义常量、clamp 间距 token、动效降级语言），本方案不新造任何平行机制；12 分栏对外词汇 + grid-column span 对内实现，兼得替换可读性与 CSS 现代性；动效与内核分层满足「两端可用」消费边界，`--motion-*` 禁令通过字面值展开规避而非破例。\n\n## 任务\n### Phase 1 — 响应式内核（依赖 themes/breakpoints.ts 既有常量）\n\n- [ ] 断点数组 helper — `packages/components/themes/responsive.ts` — `responsive<T>(value: T | [T, T?])` → styled-components css 片段生成器，media 只经 `BREAKPOINTS` 语义常量；附单测 — `packages/components/themes/responsive.test.mjs`\n- [ ] Flex 重写 — `packages/components/flex/index.tsx` `packages/components/flex/specs.tsx` — 核心 props 升级为 `T | [T, tablet?]` 数组语法；gap/padding/margin 经 `getSpacingValue` 走 spaces token；移除 `Row` attrs 别名并收敛别名面\n- [ ] Row 实现 — `packages/components/row/index.tsx` — 12 分栏 grid 容器：默认 `repeat(12,1fr)`、`cols` 可覆盖列数、`gap` 数组响应式、`alignItems`/`justifyContent`（grid 语义映射）、`$` transient props\n- [ ] Col 实现 — `packages/components/col/index.tsx` — `span`（1–12，默认 12=整行堆叠）/`offset`/`order` 支持数组断点；渲染 `grid-column: span n`\n- [ ] 内核守卫 — `packages/components/flex/index.test.mjs` `packages/components/row/index.test.mjs` `packages/components/col/index.test.mjs` — 禁裸断点数值（仅 BREAKPOINTS）、禁裸 hex、禁 `--motion-*` 引用、禁业务/Next 导入、transient props 命名\n### Phase 2 — 动效层\n\n- [ ] Stagger 子包 — `packages/components/stagger/index.tsx` — 自持 keyframes（css 包裹、命名不与站点 MotionStyles 冲突）；props `step`/`duration`/`as`；nth-child 步长延迟枚举（上限 12）；仅 opacity/transform；`prefers-reduced-motion: reduce` 直显降级；SSR 双写安全（不依赖跨组件插值选择器）\n- [ ] Stagger 守卫 — `packages/components/stagger/index.test.mjs` — reduced-motion 块在场、禁 `--motion-*` 与 CSS 变量引用（时序取字面值）、禁布局属性过渡、keyframes css 包裹\n### Phase 3 — 文档与全量验证\n\n- [ ] 使用文档 — `packages/components/{flex,row,col,stagger}/readme.md` — 12 分栏语义与常用分栏预设（12/6/4/3）、数组断点语法说明、`Stagger × Row/Col` 组合示例、console 消费指引\n- [ ] 全量验证 — 根 `pnpm exec tsc --noEmit` + 各守卫测试 + oxlint，贴命令与输出\n\n## 补充\n以 GitHub Issues 作为 CMS 的站点布局底座重立契约：Row/Col（12 分栏 grid 语义，数组断点语法）、Flex 重写（响应式分布原语）、Stagger 动效子包（错峰入场，字面值节奏，reduced-motion 降级）。详细方案、任务拆分与验收标准见 shadow-docs/changes/20261006-feature-responsive-layout-components/brief.md\n\n完整 brief：shadow-docs/changes/20261006-feature-responsive-layout-components/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-feature-responsive-layout-components\",\"type\":\"feature\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-feature-responsive-layout-components/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "AGENTS.md",
        "packages/components/col/index.test.mjs",
        "packages/components/col/index.tsx",
        "packages/components/col/readme.md",
        "packages/components/flex/index.test.mjs",
        "packages/components/flex/index.tsx",
        "packages/components/flex/readme.md",
        "packages/components/flex/specs.tsx",
        "packages/components/row/index.test.mjs",
        "packages/components/row/index.tsx",
        "packages/components/row/readme.md",
        "packages/components/stagger/index.test.mjs",
        "packages/components/stagger/index.tsx",
        "packages/components/stagger/readme.md",
        "packages/components/themes/responsive.test.mjs",
        "packages/components/themes/responsive.ts",
        "shadow-docs/changes/20261006-feature-responsive-layout-components/brief.md",
        "shadow-docs/knowledge/layout-components.md",
        "shadow-docs/menu.md"
      ],
      "message": "feat(components): 响应式组合式布局组件 Row/Col 栅格 + Flex 重写 + Stagger 动效层 (#483)",
      "title": "[feature] 响应式组合式布局组件：Row/Col 12 分栏栅格 + Flex 重写 + Stagger 动效子包",
      "body": "Closes #483\n\n完整 brief：shadow-docs/changes/20261006-feature-responsive-layout-components/brief.md"
    }
  },
  "knowledge": {
    "action": "新增",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "本 change 确立的布局契约跨变更长期有效：12 分栏词汇 + grid-column span 实现契约、[base, tablet] 数组断点两槽语法（responsive helper 唯一编译口）、Stagger 字面值节奏与 --motion-* 禁令规避法、纯 styled 布局组件必须挂 'use client' 的消费边界——后续存量替换 change 以此为唯一执行依据，且 image 布局重构后不存在承载这些事实的既有卡片（design-system 卡管 token 层，components 卡管组件包纪律，均不重叠），故新增卡片并以本 change 为 source；release 阶段同步更新 components.md 组件清单补 Row/Col/Flex/Stagger 条目。"
  }
}
---

# 响应式组合式布局组件——Row/Col 12 分栏栅格 + Flex 重写 + Stagger 动效子包

## 动机

站点约 10 个文件、99 处手写 `@media` 布局样式缺乏统一原语，后续将分批替换进代码；现有 `packages/components/flex`（271 行完整实现）零响应式能力且全仓零消费者，`row/`、`col/`、`space/` 为 0 行占位。本次为布局系统重立契约：一套移动优先、断点语义化、动效与内核分层的组合式布局组件，作为后续替换的唯一布局底座。本次不触碰任何存量页面。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——无（纯新增 + 重写零消费者的 Flex，不影响任何在用的行为契约）；触及面——packages/components 共享包内的独立组件，不碰宿主核心与跨模块数据流；可发现性——守卫测试钉死纪律（裸断点/裸色值/--motion-* 引用/reduced-motion 缺失即红），改坏立刻可见。
- **期望验证深度:** unit

## 引用规范

- norms/ui-patterns.md
  - 当前结论: 响应式三档必须覆盖、禁止横向滚动；动效过渡 150–300ms ease-out、禁止布局位移类动画（width/height/top/left 过渡）、必须响应 prefers-reduced-motion；设计规范先行、组件复用优先
  - 适用 scope: packages/components/*, 未来 apps/site 消费方
- norms/code-style-frontend.md（React 组件库段）
  - 当前结论: 组件库不依赖业务/Next 页面；styled-components 一律 `$` 前缀 transient props；主题色/间距用 CSS 变量或主题令牌
  - 适用 scope: packages/components
- norms/tdd-verification.md
  - 当前结论: M 级 = 绿灯测试（写测试不强制先红）+ unit + 走查；先建功能分支再写代码
  - 适用 scope: 全流程
- shadow-docs/knowledge/design-system.md
  - 当前结论: 断点体系 `BREAKPOINTS = { mobile: 640(max), small: 520(max), tablet: 1024(min) }`，新代码必须用语义常量、禁新裸断点；spaces md~3xl 为 clamp 响应值（窄屏收缩、桌面封顶）
  - 适用 scope: packages/components/themes, packages/components/{flex,row,col}
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 「微光呼吸 × 书写显现」语言；packages/components 共享组件不得引用 `--motion-*`（console 不注入主题变量）；禁止 JS scroll/resize 监听做动画；关键帧唯一性规则 scope 为站点 MotionStyles，组件包自持关键帧有 Progress/audio-player 先例（守卫要求 css 包裹 + reduced-motion 块在场）
  - 适用 scope: packages/components/stagger, apps/site/app/styles/motion.ts
- shadow-docs/knowledge/components.md
  - 当前结论: `exports` map 子路径直接消费（无桶文件）；样式纪律由同目录 `index.test.mjs` 守卫固化（禁裸 hex、禁裸断点、禁 `--motion-*`、transition 禁布局属性、reduced-motion 在场）
  - 适用 scope: packages/components

## 决策

- **选型:** CSS-first 双原语 + 用户批准的四项微调（propose 会话确认）：
  1. `Row`/`Col` 直接落在现有占位目录，不单设 `Grid`；对外承诺 **12 分栏词汇**（`span` 1–12），底层实现为 `grid-template-columns: repeat(12, 1fr)` + `grid-column: span n`，无负 margin；
  2. 响应式 props 一律**数组断点语法** `[base, tablet?]`——索引 0 为 <1024 基线（移动/窄平板合并），索引 1 在 `min-width: BREAKPOINTS.tablet` 生效；超窄 small 档由既有 clamp 间距与基线堆叠承担，布局组件不开第三槽；
  3. `Flex` 重写为分布/对齐原语（direction/gap/justifyContent/alignItems/wrap/padding/margin 等同支持数组），收敛原 20 个 styled attrs 别名（`Row` 别名从 flex 移除，避免与 row 目录冲突；其余纯 flex 对齐别名按消费价值保留或删减，零消费者无兼容义务）；
  4. 动效层**单独导出子包** `@wuh.site/components/stagger`：不并入站点 MotionStyles；自持关键帧（`css` 包裹，Progress 守卫同法），节奏用与 motion tokens 对齐的**字面值**（600ms / cubic-bezier(0.22,1,0.36,1)，即 dur-reveal / ease-out-soft 的展开值）而**不引用 `--motion-*` 变量**，console 无主题变量亦可安全消费；子项错峰入场：仅 opacity + translateY，`nth-child` 枚举步长延迟（默认 60ms，枚举上限 12），reduced-motion 降级直显。
- **对比方案:**
  - 方案 A（Ant 式负 margin gutter 12 栅格）：词汇同样大众熟悉，但负 margin 与站点 `html/body overflow-x: clip` 滚动纪律有冲突风险，百分比宽度表达不了内容自适应，属浮动时代劣解——未选；
  - 方案 C（单一 Stack 原子组件）：flex/grid 两套语义混装，组合式可读性差，areas/跨列表达吃力——未选；
  - 原方案 B（新增 grid 目录 + 动效并入站点 MotionStyles）：被用户四项微调取代（Row/Col 目录复用、12 分栏语义、数组语法、动效子包化）。
- **理由:** 项目真正的响应式基建已齐（BREAKPOINTS 语义常量、clamp 间距 token、动效降级语言），本方案不新造任何平行机制；12 分栏对外词汇 + grid-column span 对内实现，兼得替换可读性与 CSS 现代性；动效与内核分层满足「两端可用」消费边界，`--motion-*` 禁令通过字面值展开规避而非破例。

## 任务

### Phase 1 — 响应式内核（依赖 themes/breakpoints.ts 既有常量）

- [x] 断点数组 helper — `packages/components/themes/responsive.ts` — `responsive<T>(value: T | [T, T?])` → styled-components css 片段生成器，media 只经 `BREAKPOINTS` 语义常量；附单测 — `packages/components/themes/responsive.test.mjs`
- [x] Flex 重写 — `packages/components/flex/index.tsx` `packages/components/flex/specs.tsx` — 核心 props 升级为 `T | [T, tablet?]` 数组语法；gap/padding/margin 经 `getSpacingValue` 走 spaces token；移除 `Row` attrs 别名并收敛别名面
- [x] Row 实现 — `packages/components/row/index.tsx` — 12 分栏 grid 容器：默认 `repeat(12,1fr)`、`cols` 可覆盖列数、`gap` 数组响应式、`alignItems`/`justifyContent`（grid 语义映射）、`$` transient props
- [x] Col 实现 — `packages/components/col/index.tsx` — `span`（1–12，默认 12=整行堆叠）/`offset`/`order` 支持数组断点；渲染 `grid-column: span n`
- [x] 内核守卫 — `packages/components/flex/index.test.mjs` `packages/components/row/index.test.mjs` `packages/components/col/index.test.mjs` — 禁裸断点数值（仅 BREAKPOINTS）、禁裸 hex、禁 `--motion-*` 引用、禁业务/Next 导入、transient props 命名
### Phase 2 — 动效层

- [x] Stagger 子包 — `packages/components/stagger/index.tsx` — 自持 keyframes（css 包裹、命名不与站点 MotionStyles 冲突）；props `step`/`duration`/`as`；nth-child 步长延迟枚举（上限 12）；仅 opacity/transform；`prefers-reduced-motion: reduce` 直显降级；SSR 双写安全（不依赖跨组件插值选择器）
- [x] Stagger 守卫 — `packages/components/stagger/index.test.mjs` — reduced-motion 块在场、禁 `--motion-*` 与 CSS 变量引用（时序取字面值）、禁布局属性过渡、keyframes css 包裹
### Phase 3 — 文档与全量验证

- [x] 使用文档 — `packages/components/{flex,row,col,stagger}/readme.md` — 12 分栏语义与常用分栏预设（12/6/4/3）、数组断点语法说明、`Stagger × Row/Col` 组合示例、console 消费指引
- [x] 全量验证 — 根 `pnpm exec tsc --noEmit` + 各守卫测试 + oxlint，贴命令与输出

## 结果

- 实际耗时: —
- 验证: —
- **apply 发现（不顺手修，另立 change）:** `packages/components/test/image-role-contract.test.mjs` 3 条红为 main 基线既有问题（测试期望 `export type ImageRole` 在 image/index.tsx，代码实际已迁移至 specs.tsx；image 源码与该测试均不在本 change diff 内）。
- **apply 发现（环境）:** 工作区同期存在 `20261006-feature-player-playlist-seal` 的未提交改动（audio-player/apps/site 侧），与本 change 文件清单零交集，conflict inspect 全程无重叠。

## 知识评估

- **预期影响:** 新增 + 更新
- **候选卡片:** 新增 `shadow-docs/knowledge/layout-components.md`（12 分栏契约、数组断点语法、Stagger 字面值节奏纪律——后续替换 change 的长期执行依据）；更新 `shadow-docs/knowledge/components.md`（组件清单补 Row/Col/Flex/Stagger 条目）
- **理由:** 本 change 确立的布局契约跨变更长期有效，属项目事实而非单次过程；卡片边界：design-system.md 管 token 层，新卡管布局组件层，不重叠。
