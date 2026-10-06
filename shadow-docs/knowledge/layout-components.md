---
title: 响应式布局组件族
domain: components
keywords: [布局, Row, Col, Flex, Stagger, 栅格, 12分栏, 断点数组, 断点阶梯, RESPONSIVE_LADDER, 响应式, grid, 错峰入场, 组合式]
scope:
  - packages/components/flex
  - packages/components/row
  - packages/components/col
  - packages/components/stagger
  - packages/components/themes/responsive.ts
status: active
source:
  - changes/20261006-feature-responsive-layout-components/brief.md
  - changes/20261006-feature-responsive-breakpoint-ladder/brief.md
verified: 2026-10-06
verified-depth: unit
verified-scope: 守卫 33/33 绿（responsive 阶梯单测 9 + flex 6 + row 5 + col 6 + stagger 7）、根 tsc --noEmit exit 0、oxlint 0/0（12 文件）、全组件套件 144/147（3 红为 image-role-contract main 基线存量，与布局族无关）；组件尚无站点消费者，runtime 目检随首个替换 change 补
---

# 响应式布局组件族

## 当前结论

布局底座为「内核共享 + 动效分层」四层组合，全部 `'use client'`、全部走 styled-components transient props：

**Flex**（分布/对齐原语）：`direction/justifyContent/alignItems/gap/wrap/padding/margin` 七个 props 响应式（数组语法见下）；`flex/flexGrow/flexShrink/flexBasis/alignSelf/order/width/height/fullWidth/fullHeight/inline` 固定值。别名面收敛为 9 个（Column/ColumnReverse/Center/CenterHorizontal/CenterVertical/SpaceBetween/SpaceAround/SpaceEvenly/InlineFlex）；旧 `Row` 别名让位给 row 目录的栅格 Row，其余单 prop 糖删除。

**Row + Col**（12 分栏栅格，对外承诺 span 1–12 词汇）：Row = grid 容器，实现 `grid-template-columns: repeat(cols, 1fr)`（cols 默认 12），**无负 margin、无百分比宽度**；Col = 列项，`span` 默认 12（移动优先整行堆叠）、`offset > 0` 编译为显式落位 `grid-column: {offset+1} / span {span}`、纯 span 编译为自动流 `grid-column: span {n}`；Col 内置 `min-width: 0` 防长文撑破。常用预设：12 整行 / 6 半行 / 4 三等分 / 3 四等分。

**Stagger**（动效增强层）：直接子项错峰入场，仅 opacity + translateY 12px；`step` 默认 60ms、`duration` 默认 600ms（= 站点 dur-reveal 展开值）、缓动 `cubic-bezier(0.22, 1, 0.36, 1)`（= ease-out-soft 展开值）、`nth-child` 枚举上限 `count` 默认 12（超出者同批入场）；自持 keyframes（SC helper 哈希命名，不与站点 rise-fade 撞名）；`as={Row|Flex}` 可作渲染目标组合。

**断点阶梯语法（全族唯一契约，移动优先四档）**：编译口唯一——`themes/responsive.ts` 的 `responsive(value, decl)`。`TResponsive<T> = T | readonly (T | undefined)[]`，数组按视口升序占位 `[base, sm?, md?, lg?]`：index0 `base` 为 0+ 移动优先基线（含超窄段）；上三档边界由 `RESPONSIVE_LADDER = [BREAKPOINTS.small + 1(521), BREAKPOINTS.mobile + 1(641), BREAKPOINTS.tablet(1024)]` 派生，各自生成一个 `min-width` media 块。**缺位槽跳过、低档声明经媒体级联自然延续**——故「仅桌面变档」写作 `[base, , , lg]`（补两个缺位到 index3），**不是** `[base, lg]`。四档边界由语义常量 +1 翻转派生，源码不落裸断点。历史迁移：两槽时代 `[base, tablet]` 的第二槽是 1024，阶梯化后第二槽变 `sm`(521)，旧式 `[a,b]` 语义随之下移——凡「仅 1024 变」的旧写法必须补成 `[a, , , b]`（组件零消费者窗口期完成，readme 与站点替换批按此改写）。**布局 props 的顶层数组一律 = 阶梯槽**——旧 gap `[row, column]` / padding 四值盒式简写让位，非对称间距走 CSS 字符串值。

## 执行约束

- 布局组件族的断点逻辑只能经 `themes/responsive.ts` + `BREAKPOINTS` 语义常量；组件源码零 `@media` 字面量、零裸断点（各目录 `index.test.mjs` 剥注释扫描钉死）。
- 共享内核（flex/row/col）禁 `--motion-*` 引用、禁 hex 色值、禁 JS 事件监听；Stagger 允许自持 keyframes 但时序一律字面值、禁 `var(--`——console 无主题变量亦可消费。
- 纯 styled 布局组件必须挂 `'use client'` 首行（styled-components 内部 `useContext(ThemeContext)` 在 RSC 下不可渲染）；重写前的旧 flex 未挂是零消费历史遗留，不作先例。
- `span` 与 `offset` 必须**逐档 carry-forward 合成**单条 `grid-column`：某档任一 prop 有槽则该档出块、缺位方沿用最近低档值，禁止两 prop 各自独立出 media 块（互相错位）；上档全缺则回落标量，不产出空 media。
- `order`/`wrap` 等 falsy 合法值一律 `!== undefined` 判定，禁止真值短路。
- 动效语义正交：Stagger 管「进场顺序」（挂载即播、页内重渲染不重播），站点 `.reveal` 管「入视口点亮」，可叠加各计时长。
- 替换存量手写 `@media` 时按此词汇迁移：方向/对齐分布 → Flex，分栏 → Row/Col，错峰入场 → Stagger；间距响应优先靠 clamp token，离散切换才用数组槽。

## 适用边界

- `gap`/`padding`/`margin` 的解析走 styled theme（`getSpacingValue`），**消费侧必须有 ThemeProvider**；console 预接主题后方可用这三个 props，否则静默不输出。width/height 无主题时回退 px 折算。
- Space（行内间距）仍为占位目录，未实现；组件族不含 display:contents、容器查询等未来机制——按需另立 change。
- 本卡管布局组件契约层；token 层（断点常量、clamp 间距、motion tokens）归 design-system.md，动效语言归 animation-system.md。

## 验证方式

`node --test packages/components/themes/responsive.test.mjs packages/components/{flex,row,col,stagger}/index.test.mjs`（33 条，需 node ≥ 23 或等价 type-stripping）；responsive 单测钉死四档边界由 `BREAKPOINTS + 1` 派生、稀疏槽跳过、超四档忽略、旧两槽 `[a,b]` 现指 sm(521) 的迁移；grep 组件源码无 `@media`、`--motion-`、裸断点（521/641/1024 等）、裸 hex；runtime 目检（实际页面渲染 + 断点拖拽）由首个消费 change 补齐后升级本卡 verified-depth。

## 关联知识

- [design system](design-system.md)
- [animation system](animation-system.md)
- [components](components.md)
