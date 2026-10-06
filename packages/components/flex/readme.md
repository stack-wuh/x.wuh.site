# Flex 响应式分布原语

`@wuh.site/components/flex` — flex 容器：方向、对齐、分布与间距。栅格分栏请用 `row/col`；入场动效叠加请用 `stagger`。

## 断点数组语法（全族统一契约）

```tsx
import { Flex, Column, Center } from '@wuh.site/components/flex'

// 基线（<1024）纵向堆叠，桌面带（≥BREAKPOINTS.tablet）转横向行
<Flex direction={['column', 'row']} gap={[12, 'md']} alignItems="center">
  …
</Flex>
```

- 标量 = 全视口生效；`[base, tablet]` = 索引 0 为 <1024 基线，索引 1 在 `min-width: 1024px` 生效；`[base]` 等价标量。
- 只开两槽（`themes/responsive.ts`），超窄屏由 clamp 间距 token 与基线堆叠承担。
- **顶层数组一律 = 断点槽**。非对称盒式简写不占数组语法：`padding="8px 16px"`（CSS 字符串透传）。

## Props

响应式（数组可用）：`direction` `justifyContent` `alignItems` `gap` `wrap` `padding` `margin`。
固定：`inline` `width` `height` `fullWidth` `fullHeight` `flex` `flexGrow` `flexShrink` `flexBasis` `alignSelf` `order`（后五项编译进 `& > *`，作用于全部直接子项）。

`gap`/`padding`/`margin` 传 spaces token 名（`xs|sm|base|md|lg|xl|2xl|3xl`）、数字（按 px）或 CSS 长度。
token 名解析依赖 styled `ThemeProvider`：消费侧无主题提供者时这三个 spacing props 不输出，请预接主题或走 `style`。

## 别名（收敛后的最小集）

`Column` `ColumnReverse` `Center` `CenterHorizontal` `CenterVertical` `SpaceBetween` `SpaceAround` `SpaceEvenly` `InlineFlex`。
旧 `Row`/`RowReverse`/`Wrap`/`FlexEnd`/`AlignTop`/`Full*` 等单 prop 糖已删：方向别名归 `@wuh.site/components/row`，其余用 props 直给。
