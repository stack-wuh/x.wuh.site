---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
  - '^- \*\*WHEN\*\* .+'
  - '^- \*\*THEN\*\* .+'
---

# Spec: 移动端 Header 菜单图标显示

## ADDED

### Requirement: 移动端菜单按钮始终显示汉堡图标
- **GIVEN** 用户在视口宽度小于 768px 的页面访问 Header
- **WHEN** Header 初始渲染且移动菜单未展开
- **THEN** 右侧菜单按钮渲染可见的 `IconBars` outline SVG
- **AND** SVG 具有明确的 20×20 尺寸，不因 flex 收缩或通用按钮默认样式消失

### Requirement: 菜单按钮交互和触摸目标保持兼容
- **GIVEN** 用户使用触摸设备或键盘访问移动 Header
- **WHEN** 用户聚焦或点击菜单按钮
- **THEN** 按钮保持 44×44 触摸区域、清晰 focus-visible 状态和原有展开/收起行为
- **AND** `aria-expanded` 与 `aria-controls` 继续反映菜单状态

## MODIFIED

### Requirement: Header 菜单按钮样式隔离
- **GIVEN** 移动菜单按钮需要显示 Lucide SVG 图标
- **WHEN** 样式应用到按钮
- **THEN** 菜单按钮使用独立的原生 `styled.button` 样式
- **AND** 不依赖通用 Button 的内部图标包装或默认视觉变体

## REMOVED

### Requirement: 无
- 本次变更不移除任何公共图标组件或全局图标能力。
