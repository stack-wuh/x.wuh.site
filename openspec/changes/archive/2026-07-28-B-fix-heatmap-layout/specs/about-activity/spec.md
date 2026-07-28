# Spec: Heatmap 响应式布局

## MODIFIED Requirements

### Requirement: 展示单一综合热力图
About 页面 MUST 在可用宽度内完整展示单一综合热力图，且布局标题与数据轨道准确对齐。

#### Scenario: 不同视口展示完整热力图
- **GIVEN** About 页面加载到最近 365 天统一活动数据
- **WHEN** 页面在桌面、平板或移动视口渲染综合热力图
- **THEN** 热力图完整展示 53 个周列且不产生组件内部横向滚动条
- **AND** 热力图不得导致页面横向溢出
- **AND** 月份标题与对应周列使用同一坐标轨道
- **AND** 星期标题与对应日期行准确对齐

### Requirement: Heatmap 组件支持多种数据语义
Heatmap 组件 MUST 在保持既有调用兼容的同时，提供不会被边界裁切的活动详情。

#### Scenario: 查看边缘单元格详情
- **GIVEN** Heatmap 渲染包含综合活动明细的日期单元格
- **WHEN** 用户 hover、点击或键盘聚焦首行、末行或左右边缘单元格
- **THEN** Tooltip 根据单元格位置向组件内部展开
- **AND** Tooltip 使用受限宽度和多行文本完整显示日期、总量及分类明细
- **AND** Tooltip 不被热力图容器裁切
- **AND** 单元格继续提供可访问名称和键盘焦点

## ADDED Requirements

### Requirement: Heatmap 加载态保持稳定布局
Heatmap 加载态 MUST 与真实数据态使用相同的响应式轨道。

#### Scenario: 数据从加载态切换到成功态
- **GIVEN** About 页面正在加载综合活动数据
- **WHEN** Heatmap 从 Skeleton 切换到 365 天真实数据
- **THEN** 星期轨道、周列宽度和整体占用宽度保持一致
- **AND** 页面不会因状态切换出现横向滚动或可见布局跳变
