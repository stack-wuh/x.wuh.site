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

# Spec: 首页主题切换控件

## ADDED

### Requirement: 桌面端现代主题胶囊控件
- **GIVEN** 用户在视口宽度不小于 768px 的首页访问头部
- **WHEN** 主题切换控件渲染
- **THEN** 控件以轻量胶囊布局展示主题图标、当前主题名称和可切换提示
- **AND** 控件不呈现通用 Button 的默认实心渐变视觉
- **AND** hover、active、focus-visible 状态具有清晰且不突兀的反馈

### Requirement: 移动端主题操作项始终显示图标
- **GIVEN** 用户在视口宽度小于 768px 的首页打开移动菜单
- **WHEN** 主题操作项渲染
- **THEN** 操作项以不小于 44px 的整行触摸目标展示
- **AND** 主题图标、操作文案和当前主题名称均可见
- **AND** 图标不会因 flex 收缩、容器宽度或通用按钮默认样式而消失

### Requirement: 主题切换行为保持不变
- **GIVEN** 当前主题为 `wine` 或 `plain`
- **WHEN** 用户点击桌面端或移动端主题控件
- **THEN** 主题在两个主题家族之间循环切换
- **AND** 更新 `document.documentElement.dataset.themeFamily`
- **AND** 持久化到 `wuh.site.theme`
- **AND** 移动端点击后关闭菜单

### Requirement: 主题控件可访问
- **GIVEN** 用户使用键盘或屏幕阅读器访问主题控件
- **WHEN** 控件获得焦点或被触发
- **THEN** 控件提供动态描述当前主题和切换动作的 `aria-label`
- **AND** `type` 为 `button`
- **AND** focus-visible 状态具有清晰焦点环
