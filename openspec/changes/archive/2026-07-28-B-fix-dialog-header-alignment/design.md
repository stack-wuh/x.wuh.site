# 设计文档

## 架构

本次修复只调整共享 Dialog 的样式层，不改变组件结构和调用接口。`DialogHeader` 负责让标题组与关闭按钮沿交叉轴居中，`CloseButton` 负责让 `×` 在现有点击区域内居中。

```
DialogHeader（交叉轴居中）
├── DialogHeaderContent（标题 / 副标题）
└── CloseButton（44×44，图标居中）
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Header 对齐 | `align-items: center` | 同时覆盖单标题和标题组，保持 flex 正常布局流，改动最小 |
| 图标对齐 | `CloseButton` 使用 `align-items: center` | 保留 44×44 点击区域，并消除图标在按钮内部顶对齐的问题 |
| 实现位置 | 共享 Dialog 样式 | 一次修复所有使用方，避免页面级覆盖和样式分叉 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### DialogHeader

保留现有 `display: flex`、`justify-content: space-between`、间距、内边距和分割线，只将交叉轴对齐从顶部改为居中。无副标题时，标题与关闭按钮整体居中；有副标题时，关闭按钮相对标题组整体居中。

### CloseButton

保留现有语义、44×44 最小点击区域、hover、focus 和关闭行为，只将按钮内部图标的交叉轴对齐从顶部改为居中。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| > 640px | center placement 的 Dialog 标题组与关闭按钮垂直居中 |
| <= 640px | bottom placement 的 Dialog 保持拖拽指示条和现有间距，标题组与关闭按钮垂直居中 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** Dialog Props、DOM 结构、点击区域和交互保持兼容；所有共享 Dialog 统一获得修复
- **性能影响:** 仅修改两处静态 CSS 对齐属性，无可感知性能影响
