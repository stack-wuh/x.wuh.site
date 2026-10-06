# Stagger 子项错峰入场

`@wuh.site/components/stagger` — 动效增强层：直接子项按序错峰「被照亮」入场（opacity + translateY 12px），与站点「微光呼吸 × 书写显现」语言同构，但**自持关键帧、两端可消费**。

```tsx
import Stagger from '@wuh.site/components/stagger'
import Row from '@wuh.site/components/row'
import Col from '@wuh.site/components/col'

// 作为渲染目标套在栅格上：列项依次浮现
<Stagger as={Row} gap="md" step={80}>
  <Col span={[12, , , 4]}>…</Col>
  <Col span={[12, , , 4]}>…</Col>
  <Col span={[12, , , 4]}>…</Col>
</Stagger>

// 独立包裹：默认 div 容器
<Stagger>
  <Card />
  <Card />
</Stagger>
```

## Props

- `step` 错峰步长 ms（第 k 项延迟 `(k-1)×step`），默认 **60**
- `duration` 单项时长 ms，默认 **600**（= 站点 `--motion-dur-reveal` 的展开值）
- `count` nth-child 枚举上限，默认 **12**（与分栏词汇同基数）；超出上限的子项获得 0 延迟与首项同批入场
- `as` styled-components 透传渲染目标（Row/Flex/自定义组件均可）；`className` `style` `onClick` `title` 照常

## 纪律

- 时序为**字面值**，不引用 `--motion-*` 或任何 CSS 变量——console 无主题变量注入亦可渲染（禁令见 animation-system 卡片）。
- `prefers-reduced-motion: reduce` 时 `animation: none` 直显。
- 只动 opacity/transform，不碰布局属性；无 JS 监听，入场发生在元素挂载的首次绘制，页内重渲染不重播。
- 与站点 `.reveal`（滚动渐入）正交：Stagger 管「进场顺序」，`.reveal` 管「入视口点亮」，可叠加但时长各计。
