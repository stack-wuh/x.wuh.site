# Col 栅格列项

`@wuh.site/components/col` — Row 容器内的列项：`span` 占栏、`offset` 右移、`order` 调序、`alignSelf` 交叉轴对齐。

```tsx
<Row cols={12} gap="md">
  <Col span={8}>…</Col>
  <Col span={4} offset={0}>…</Col>
</Row>
```

## 语义

- `span` 1–12（可随 Row 的 `cols` 变化理解），**默认 12 = 整行堆叠**——移动优先写法里手机带什么都不传即全宽。
- `offset > 0` 编译为 `grid-column: {offset+1} / span {span}`（显式落位）；纯 span 编译为 `grid-column: span {n}`（自动流）。混用时显式项先占格、后续项顺排。
- `span` 与 `offset` **共用同一断点槽对**合成一条 `grid-column`：任一 prop 有 tablet 槽，另一 prop 的 tablet 位沿用自己的 base 补齐——不会出现两个独立 media 块互相错位。
- 断点数组语法与 Flex/Row 同契约：`span={[12, 6]}` 手机整行、桌面半行。
- `min-width: 0` 内置：长文/媒体不会撑破分栏。

```tsx
<Row gap={[12, 'md']}>
  <Col span={[12, 6]} order={[1, 0]}>…</Col>
  <Col span={[12, 6]}>…</Col>
</Row>
```

`order` 调整视觉顺序（CSS order，不改 DOM 语义顺序——a11y 场景慎用交换型 order）。
