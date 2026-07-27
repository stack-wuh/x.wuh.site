# Spec: 联系弹窗

## ADDED Requirements

### Requirement: Dialog 标题栏垂直对齐
The shared Dialog title area and close button MUST be vertically centered within the Header.

#### Scenario: 单标题 Dialog 标题栏对齐
- **GIVEN** 共享 Dialog 显示标题且关闭按钮可见
- **WHEN** Dialog Header 渲染
- **THEN** 标题区域与关闭按钮沿 Header 交叉轴垂直居中
- **AND** 关闭图标在 44×44 像素点击区域内水平、垂直居中

### Requirement: Dialog 副标题场景对齐
A shared Dialog with a subtitle MUST use the complete title group as the vertical alignment reference for the close button.

#### Scenario: 标题组与关闭按钮对齐
- **GIVEN** 共享 Dialog 同时显示标题和副标题
- **WHEN** Dialog Header 渲染
- **THEN** 关闭按钮相对“标题 + 副标题”组成的标题组整体垂直居中
- **AND** 桌面 center placement 与移动端 bottom placement 使用相同对齐规则

## MODIFIED Requirements

### Requirement: Dialog 圆角和间距
The Dialog MUST preserve its existing radius and spacing while vertically centering the title area and close button within the Header.

#### Scenario: 桌面端 Dialog 布局
- **GIVEN** Dialog 在桌面端打开并显示标题栏
- **WHEN** 弹窗渲染
- **THEN** 四角 border-radius 为 16px
- **AND** Header padding 为 12px 22px，底部带分割线
- **AND** 标题区域与关闭按钮在 Header 内垂直居中
- **AND** Body padding 为 12px 22px 18px
- **AND** 默认宽度 max 480px
