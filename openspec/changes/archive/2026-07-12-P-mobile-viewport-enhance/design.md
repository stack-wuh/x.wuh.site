# 设计文档

## 技术方案

在已有 `layout.tsx` 的 `viewport` 导出中新增两项配置。

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b91c1c' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0a0a' },
  ],
  colorScheme: 'light dark',
}
```

- `themeColor` — 通过 media query 区分亮暗，亮色 #b91c1c（wine primary），暗色 #1a0a0a（深黑红）
- `colorScheme` — 设为 `'light dark'`，浏览器加载时按系统偏好立即应用正确主题，消除闪白

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 完全兼容，旧浏览器忽略不识别的 meta
- **性能影响:** 无
