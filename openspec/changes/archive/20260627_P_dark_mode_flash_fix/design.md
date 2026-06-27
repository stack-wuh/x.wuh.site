# 设计文档

## 架构

```
浏览器解析 HTML
    │
    ▼
<head> 同步脚本执行（无依赖，纯 DOM API）
    ├── 读 prefers-color-scheme → 设 data-color-scheme
    ├── 读 localStorage → 设 data-theme-family
    └── 设 data-no-transition（阻止首屏过渡）
    │
    ▼
CSS 匹配正确的选择器 → 首屏无闪动（且无过渡动画）
    │
    ▼
React hydration
    │
    ▼
ThemeModeProvider useEffect
    ├── 注册系统主题变化监听
    └── 移除 data-no-transition → 后续切换有过渡动画
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 脚本位置 | `<head>` 同步 `<script>` | 浏览器在脚本执行完之前不渲染任何像素 |
| data 属性 | dataset API | 与现有 ThemeModeProvider 保持一致 |
| 过渡方式 | 全局 `*` 选择器 CSS transition | 覆盖面完整，零侵入组件代码 |
| 首屏过渡禁用 | `data-no-transition` attribute guard | 脚本→hydration 间禁止过渡，hydration 后移除 |

## 细节

### `<head>` 脚本

- 用 IIFE 包裹避免变量污染
- 无需任何外部依赖，纯 DOM API
- 执行顺序：先 colorScheme（系统级）→ 再 themeFamily（用户偏好，可覆盖默认）

### 全局过渡 CSS

```css
html[data-no-transition] *,
html[data-no-transition] *::before,
html[data-no-transition] *::after {
  transition: none !important;
}

*, *::before, *::after {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}
```

### ThemeModeProvider 改动

在第一个 `useEffect` 末尾追加一行移除 `data-no-transition`：

```ts
document.documentElement.removeAttribute('data-no-transition')
```

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 完全兼容，脚本只设置已有 data 属性
- **性能影响:** `<head>` 脚本 < 1KB，同步执行 < 1ms，无网络请求
