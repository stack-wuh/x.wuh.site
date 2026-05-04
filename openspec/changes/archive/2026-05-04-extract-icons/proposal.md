# 图标抽离为公共组件

## 为什么做

项目内 14 个文件中散落着 40+ 个硬编码 SVG 图标，11 组重复定义（如 Twitter 图标在三处各自写了一遍）。维护困难、样式不统一、新增图标不知往哪放。

## 做什么

- 在 `packages/components/icons/` 下按用途拆为 4 个分类文件: brand、ui、status、ornament
- 统一 barrel 导出 `@wuh.site/components/icons`
- 替换 14 个消费文件的硬编码 SVG 为 import

## 影响范围

- 新建 5 个图标文件
- 修改 14 个消费文件
- 不改样式、不改 SVG 路径数据、不改渲染行为

## 不改什么

- SVG path 数据保持原样
- stroke/fill 风格各自保持
- 不影响任何业务逻辑
