# Flex 响应式分布原语

`@wuh.site/components/flex` — flex 容器：方向、对齐、分布与间距。栅格分栏请用 `row/col`；入场动效叠加请用 `stagger`。

## 断点阶梯语法（全族统一契约）

```tsx
import { Flex } from '@wuh.site/components/flex'

// 基线纵向堆叠，桌面档（≥1024）转横向行——用缺位槽只命中 lg
<Flex direction={['column', , , 'row']} gap={[12, , , 'md']} alignItems="center">
  …
</Flex>

// 手机带（<641）堆叠、平板带起转行——命中 md
<Flex direction={['column', , 'row']} />
```

- 值形态：标量 = 全视口；`[base]` 等价标量；`[base, sm?, md?, lg?]` = 升序 min-width 阶梯。
- 四档边界（`themes/responsive.ts` 的 `RESPONSIVE_LADDER`，全部由 `BREAKPOINTS` +1 派生，禁裸断点）：
  - `base`：0+，移动优先基线（含超窄段）
  - `sm`：≥521（`BREAKPOINTS.small + 1`，原 `≤520` 负声明档转正）
  - `md`：≥641（`BREAKPOINTS.mobile + 1`，原 `≤640` 档转正）
  - `lg`：≥1024（`BREAKPOINTS.tablet`，桌面带）
- **缺位槽跳过、低档声明自然延续**：`[a, , , b]` 里 sm/md 不重述，靠媒体级联延续 a 直到 1024 换 b。
- ⚠️ 迁移：两槽时代 `[base, tablet]` 的第二槽曾是 1024；阶梯化后第二槽是 `sm`(521)。「仅桌面变档」必须写 `[base, , , lg]`（三个缺位）。
- **顶层数组一律 = 断点槽**。非对称盒式简写不占数组语法：`padding="8px 16px"`（CSS 字符串透传）。

## Props

响应式（数组可用）：`direction` `justifyContent` `alignItems` `gap` `wrap` `padding` `margin`。
固定：`inline` `width` `height` `fullWidth` `fullHeight` `flex` `flexGrow` `flexShrink` `flexBasis` `alignSelf` `order`（后五项编译进 `& > *`，作用于全部直接子项）。

`gap`/`padding`/`margin` 传 spaces token 名（`xs|sm|base|md|lg|xl|2xl|3xl`）、数字（按 px）或 CSS 长度。
token 名解析依赖 styled `ThemeProvider`：消费侧无主题提供者时这三个 spacing props 不输出，请预接主题或走 `style`。

## 别名（收敛后的最小集）

`Column` `ColumnReverse` `Center` `CenterHorizontal` `CenterVertical` `SpaceBetween` `SpaceAround` `SpaceEvenly` `InlineFlex`。
旧 `Row`/`RowReverse`/`Wrap`/`FlexEnd`/`AlignTop`/`Full*` 等单 prop 糖已删：方向别名归 `@wuh.site/components/row`，其余用 props 直给。
