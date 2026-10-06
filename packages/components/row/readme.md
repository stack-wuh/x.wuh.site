# Row 响应式栅格容器

`@wuh.site/components/row` — 对外承诺 **12 分栏**语义的 grid 容器；列项用 `@wuh.site/components/col`。

```tsx
import Row from '@wuh.site/components/row'
import Col from '@wuh.site/components/col'

// 手机整行堆叠，桌面三等分：Col 自带响应，Row 只给节奏
<Row gap={[12, 'md']}>
  <Col span={[12, 4]}>…</Col>
  <Col span={[12, 4]}>…</Col>
  <Col span={[12, 4]}>…</Col>
</Row>
```

## 语义

- 实现为 `display: grid; grid-template-columns: repeat(cols, 1fr)`，**无负 margin、无百分比宽度**；`cols` 默认 12。
- 断点数组语法与 Flex/Col 同契约：`[base, tablet]`，tablet 槽在 `min-width: 1024px` 生效。
- 常用分栏预设（配 Col span）：`12` 整行 / `6` 半行 / `4` 三等分 / `3` 四等分 / `8` 三分之二。
- 少数场景可离开 12 词汇直接用其他列数：`cols={[2, 5]}`——此时 Col span 按该列数理解。

## Props

`cols`（分栏列数）、`gap`（spaces token / 数字 / CSS 长度）、`alignItems`（`start|center|end|stretch`）、`justifyContent`（`start|center|end|space-between|space-around|space-evenly`）、`inline`，均可数组响应式；`className` `style` `onClick` `title` 透传。

`gap` 的 token 名解析依赖 styled `ThemeProvider`；无主题提供者时不输出（数字与 CSS 字符串同理），消费侧需预接主题。

## 与 Stagger 组合

```tsx
<Stagger as={Row} gap="md">
  <Col span={[12, 4]}>…</Col>
  …
</Stagger>
```
