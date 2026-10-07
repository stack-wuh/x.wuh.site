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
  - changes/20261006-refactor-responsive-layout-batch1/brief.md
  - changes/20261006-feature-flex-hidden-primitives/brief.md
  - changes/20261006-refactor-responsive-layout-batch2/brief.md
  - changes/20261007-refactor-responsive-layout-batch3/brief.md
verified: 2026-10-07
verified-depth: unit
verified-scope: 守卫 39/39 绿（responsive 阶梯 9 + spacing 3 + flex 8（含 maxWidth 用例）+ row 5 + col 6 + stagger 7 + layout typecheck guard）、域 guard tsc 手动实跑 EXIT=0、oxlint 0/0；站点消费累计（#495/#504 与批次3 八处：home PostRow/PostMeta/PostTags/ProjectLink/ProjectMeta、guestbook PageWrapper、TypewriterMotto maxWidth 首消费、GuestbookCard 编译口直用）apps/site tsc 计数与错误 (file,line,col,TSxxxx) 位集双侧持平（35=35）、逐块 prop 等价走查；runtime 目检随部署链补
---

# 响应式布局组件族

## 当前结论

布局底座为「内核共享 + 动效分层」四层组合，全部 `'use client'`、全部走 styled-components transient props：

**Flex**（分布/对齐原语）：响应式 props = `direction/justifyContent/alignItems/gap/wrap/padding/margin`（分布）+ `hidden`（`TResponsive<boolean>`，true 编译 `display:none`、false 按 `$inline` 恢复 flex/inline-flex，编译段置于模板尾部靠媒体级联让后段胜出——`[true,,false]` 即「基线隐藏、md 复显」）+ `width/height/maxWidth`（`TResponsive<string|number>`，`lengthValue` 放行 `auto/fit-content/max-content/min-content/none/…` 关键字直通，防 `getSpacingValue` 把 `auto` 拼成 `autopx`；maxWidth 与 width 同口同构，批次3 补全尺寸断点词汇）。其余 `flex/flexGrow/flexShrink/flexBasis/alignSelf/order/fullWidth/fullHeight/inline` 固定。别名面收敛为 9 个（Column/ColumnReverse/Center/CenterHorizontal/CenterVertical/SpaceBetween/SpaceAround/SpaceEvenly/InlineFlex）；旧 `Row` 别名让位给 row 目录的栅格 Row，其余单 prop 糖删除。Row/Col/Stagger 暂无 `hidden`/响应式 `width`（按需另立，模式同 Flex）。

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
- 替换存量手写 `@media` 时按此词汇迁移：方向/对齐分布 → Flex，显隐/换行占满/尺寸断点 → Flex 的 `hidden`/`width`/`height`/`maxWidth` 阶梯（`display:none@≤X` → `hidden=[true,,false]`，`width:100%` 换行占满 → 父 `wrap` 阶梯 + 子 `width=['100%','auto']`），分栏 → Row/Col，错峰入场 → Stagger；间距响应优先靠 clamp token，离散切换才用数组槽。
- 站点存量 @media→Flex 迁移备忘（#495/#504 实证，后续批次复用）：① grid 次列 `1fr`（如 `auto 1fr`）迁 Flex row 时，撑满列须补 `flex:1`（配 `min-width:0`），定宽块须 `flex-shrink:0`——否则 Flex 不自动撑满；② 对齐词汇不同源：Flex/Row/Col 的 `alignItems`/`justifyContent` 用 flex 词汇（`flex-start` 非 CSS grid 的 `start`），grid 单列 `justify-items:center` 的堆叠居中对应 column-flex 的 `alignItems='center'`；③ 站点存量约数十条类型错误（build-config），改动前后 `apps/site tsc` 计数须持平以证明零新增；④ **Flex 的 `flexShrink/flexBasis/flexGrow/order/alignSelf` 编译进 `& > *`（作用于子项），组件作为父 flex 子项自身的 `flex-shrink:0` 必须写进 css 块、不能走这些 prop**（迁移子项时最易踩，#504 PostTags/TimelineTrack 实证）；⑤ 非对称盒式简写（`margin: '0 0 0 calc(…)'`）经 `getSpacingValue` 透传——该纯函数已抽至 `themes/spacing.ts`，放行含空格/括号/CSS 关键字的串，兑现「CSS 字符串」承诺；⑥ **锚点行不可 Flex 化**：styled-components v6 的 `as` prop 是目标替换——`styled(Flex).attrs({as: Link})` 会把 direction/gap 等布局 props 原样灌给 Link→`<a>`、Flex 原语整体失效；`styled(Link)`/`styled.a` 载体的 wrap/gap/尺寸断点改在 css 块内直用 `themes/responsive` 编译口（批次3 PostRow/ProjectLink 实证，软导航语义不受损）；⑦ **载体非可换基座时同理走编译口**：如信笺气泡 `styled(MessageCard)`（基座 block div，Flex 化会改内部排版且违反「卡片视觉只维护在 message-card」），宽度断点 `${responsive([...], v => \`max-width: ${v};\`)}` 直用；站点深导入 `themes/*` 有 `themes/breakpoints` 八处先例；⑧ **CSS 块注释内禁写反引号**：`${}` 插值上下文的注释仍在 styled 模板字面量之内，一个 `` ` `` 即终结外层模板（批次3 实测 171 条语法错 + oxlint 解析错）；⑨ **新 worktree 无 node_modules 时 `layout-typecheck.test.mjs` 假绿**：其 spawnSync 只查 `result.error` 与 stdout 错误行，缺 tsc 二进制时 MODULE_NOT_FOUND 空输出被当作 0 错（批次3 实测），守卫跑绿后须以同配置手动 tsc 实跑复核 EXIT 码，或先对目标包 `pnpm install --filter`。

## 适用边界

- `gap`/`padding`/`margin` 的解析走 styled theme（`getSpacingValue`），**消费侧必须有 ThemeProvider**；console 预接主题后方可用这三个 props，否则静默不输出。width/height 无主题时回退 px 折算。
- Space（行内间距）仍为占位目录，未实现；组件族不含 display:contents、容器查询等未来机制——按需另立 change。
- 本卡管布局组件契约层；token 层（断点常量、clamp 间距、motion tokens）归 design-system.md，动效语言归 animation-system.md。

## 验证方式

`node --test packages/components/themes/responsive.test.mjs packages/components/themes/spacing.test.mjs packages/components/{flex,row,col,stagger}/index.test.mjs packages/components/layout-typecheck.test.mjs`（39 条，需 node ≥ 23 或等价 type-stripping；layout-typecheck 在无 node_modules 的新 worktree 会空转假绿，须按执行约束备忘⑨以手动域 tsc 实跑复核）；responsive 单测钉死四档边界由 `BREAKPOINTS + 1` 派生、稀疏槽跳过、超四档忽略、旧两槽 `[a,b]` 现指 sm(521) 的迁移；grep 组件源码无 `@media`、`--motion-`、裸断点（521/641/1024 等）、裸 hex；runtime 目检（实际页面渲染 + 断点拖拽）由首个消费 change 补齐后升级本卡 verified-depth。

## 关联知识

- [design system](design-system.md)
- [animation system](animation-system.md)
- [components](components.md)
