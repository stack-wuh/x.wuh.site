# Spec: 移动端 viewport 增强

## ADDED

### Requirement: 亮/暗主题工具栏颜色
- **GIVEN** 用户在移动端浏览器访问站点
- **WHEN** 系统处于亮色模式
- **THEN** 浏览器工具栏（地址栏/顶部栏）应显示暗红色 #b91c1c
- **AND** 当系统处于暗色模式时，工具栏应显示深黑色 #1a0a0a

### Requirement: colorScheme 声明
- **GIVEN** 浏览器加载页面
- **WHEN** HTML `<meta name="color-scheme">` 已设置 `light dark`
- **THEN** 浏览器应在加载阶段就按系统偏好应用主题色，避免闪白
