# Spec: 组件标准化

## ADDED

### Requirement: Button 组件统一

- **GIVEN** 业务代码中的按钮区域
- **WHEN** 用户交互触发按钮功能
- **THEN** 按钮使用 `@wuh.site/components/button` 组件渲染
- **AND** 按钮样式与设计系统的 Theme Token 一致

### Requirement: 图标组件统一

- **GIVEN** 业务代码需要显示图标
- **WHEN** 图标渲染到页面
- **THEN** 使用 `@wuh.site/components/icons` 导出的图标组件
- **AND** 业务代码中不存在内联 `<svg>` 标签

### Requirement: Image 组件统一

- **GIVEN** 业务代码需要展示图片
- **WHEN** 图片渲染到页面
- **THEN** 使用 `@wuh.site/components/image` 组件
- **AND** 业务代码中不存在原生 `<img>` 标签（HTML 模板字面量除外）

## REMOVED

### Requirement: 移除 business code 中的 `styled.button`

- **GIVEN** 业务代码文件
- **WHEN** 通过代码审查和搜索确认
- **THEN** 自定义 `styled.button` 不再存在于业务代码
- **AND** 所有按钮功能通过共享 Button 组件实现
