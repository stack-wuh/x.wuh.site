# 页面刷新闪烁修复规范

## 同步脚本规范

### 内联 script 执行顺序

```javascript
(function() {
  // Step 1: 禁用过渡
  document.documentElement.setAttribute('data-no-transition', '');
  // Step 2: 强制重排
  void document.documentElement.offsetHeight;
  // Step 3: 设置主题
  document.documentElement.dataset.colorScheme = scheme;
  document.documentElement.dataset.themeFamily = stored;
  // Step 4: 恢复过渡
  document.documentElement.removeAttribute('data-no-transition');
})();
```

### 关键要求

1. **必须使用 `setAttribute`** 而非 dataset API 设置 `data-no-transition`，确保 DOM 属性名与 CSS 选择器一致
2. **必须先禁用过渡再设置 data 属性**，顺序不可颠倒
3. **必须强制 reflow**（`void offsetHeight`），确保浏览器已应用 `transition: none` 后才切换 CSS 变量
4. **必须在同一同步块中完成** 以上所有操作，避免浏览器在两个帧之间渲染

## CSS 规范

### color-scheme 声明

- **ONLY** 通过 `layout.tsx` 的 `Viewport` export 声明 `colorScheme: 'light dark'`
- **NOT** 在 `cssVariableProvider.tsx` 或任何 styled-components 中使用 `@media (prefers-color-scheme: dark)` 声明 `color-scheme`
- **原因:** viewport 的 `<meta name="color-scheme">` 在 HTML 解析阶段立即生效，而 styled-components 注入的 CSS 要等 hydration 后才生效，两者之间存在时间差可能导致闪烁
