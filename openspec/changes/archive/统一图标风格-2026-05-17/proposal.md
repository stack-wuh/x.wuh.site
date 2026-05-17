# 提案：统一图标风格

## 动机

当前 `@wuh.site/components/icons` 中 37 个图标存在严重的风格不一致：

- **描边 vs 填充混用**：UI 图标多为 `stroke` 线框，Status/Brand 多为 `fill` 实心
- **viewBox 不统一**：16、24、48 三种尺寸乱用
- **尺寸不一致**：有的设了 `width/height`，有的靠 CSS 继承
- **包裹元素不一致**：IconChevronLeft/Right 多包了 `<span>`，其他没有
- **缺失属性**：部分图标无 `fill`/`stroke` 声明，走默认黑色

## 变更范围

将全部图标统一为 **全 Outline（线框）风格**，引入 `lucide-react` 替代手写 SVG。

- **UI 图标 (18个)**：替换为 lucide-react 对应图标
- **Status 图标 (10个)**：替换为 lucide-react 对应图标
- **Brand 图标 (9个)**：保留自定义 SVG，重绘为 Outline 风格以匹配 lucide
- **装饰元素 (1个)**：保留不变

## 非目标

- 不新增图标
- 不改变图标的语义和交互行为
- 不修改图标以外的 UI 组件

## 影响

| 包 | 影响 |
|----|------|
| `@wuh.site/components` | 新增 lucide-react 依赖，删除 28 个自定义 SVG 组件，重绘 9 个 brand 图标 |
| `@wuh.site/next` | 更新图标 import 路径（如有直接引用） |
