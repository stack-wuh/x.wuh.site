# Spec: 留言板浮动输入条

## ADDED

### Requirement: 浮动输入条布局
- **GIVEN** 用户打开留言板弹窗
- **WHEN** 输入区渲染
- **THEN** 输入条应通过负 margin 重叠聊天面板底部，产生悬浮效果
- **AND** 输入条有 backdrop-filter 毛玻璃和 box-shadow 阴影

### Requirement: 单行文本输入
- **GIVEN** 留言板输入区
- **WHEN** 用户在输入框中输入文本
- **THEN** 输入框应撑满除按钮外的剩余宽度
- **AND** 输入框透明无边框

### Requirement: Enter 发送
- **GIVEN** 用户在留言板输入区输入文本
- **WHEN** 用户按下 Enter（不按 Shift）
- **THEN** 应触发表单提交发送消息

### Requirement: 圆形发送按钮
- **GIVEN** 留言板输入区
- **WHEN** 渲染发送按钮
- **THEN** 按钮应为 40x40 圆形，填充主题色 `var(--primary-color)`
- **AND** 按钮内置箭头图标
- **AND** 按钮不可用时 opacity 0.3

### Requirement: 昵称徽标编辑
- **GIVEN** 用户已设置昵称
- **WHEN** 浮动条左侧展示昵称首字母徽标
- **AND** 用户点击徽标
- **THEN** 输入框切换为昵称编辑模式
- **AND** Enter 或失焦退出编辑模式

### Requirement: 暗色模式同步
- **GIVEN** 站点处于暗色模式（`[data-color-scheme="dark"]`）
- **WHEN** 浮动输入条渲染
- **THEN** 背景和阴影应与亮色模式不同，使用站点暗色主题变量
