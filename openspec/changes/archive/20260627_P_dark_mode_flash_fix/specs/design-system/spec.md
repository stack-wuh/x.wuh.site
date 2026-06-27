# Design System

## ADDED

### Requirement: 首屏主题无闪动
- **GIVEN** 用户首次访问页面或刷新页面
- **WHEN** 浏览器解析 HTML
- **THEN** `<head>` 中的同步脚本在首次渲染前设置 `data-color-scheme` 和 `data-theme-family`
- **AND** 页面首次渲染时 CSS 选择器匹配正确的主题色
- **AND** 不出现亮→暗或暗→亮的视觉闪烁

### Requirement: 首屏禁用过渡动画
- **GIVEN** `<head>` 脚本执行完毕
- **WHEN** 页面首次渲染
- **THEN** `<html>` 元素带有 `data-no-transition` 属性
- **AND** 所有元素的 `transition` 被禁用，防止颜色从默认值过渡到目标值产生反向闪动
- **AND** React hydration 后 `ThemeModeProvider` 移除 `data-no-transition`

### Requirement: 全局主题色过渡动画
- **GIVEN** 系统或用户切换亮暗主题
- **WHEN** `data-color-scheme` 或 `data-theme-family` 属性值变化
- **THEN** 所有元素的 background-color、color、border-color、box-shadow 以 0.3s ease 平滑过渡
- **AND** 过渡覆盖所有元素及其伪元素
