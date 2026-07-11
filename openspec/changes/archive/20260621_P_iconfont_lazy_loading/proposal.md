# Icon 组件 iconfont 加载重构

## 背景

当前 iconfont CSS 通过 `ahooks` 的 `useExternal` 钩子在 `AppProviders.tsx` 中加载：

```tsx
useExternal('//at.alicdn.com/t/c/font_2595178_z5oq1y0t12.css', { type: 'css' })
```

三个问题：
1. 依赖阿里 CDN，不可用时所有 iconfont 图标失效
2. 组件挂载即加载，阻塞首页关键渲染路径
3. 加载逻辑与 Icon 组件分离，不用 iconfont 的页面也会加载

## 目标

- iconfont CSS 在 `load` 事件之后加载，不阻塞首页渲染
- 加载逻辑内聚在图标系统中，`<IconfontStyle />` 统一管理
- iconfont 加载失败时自动降级到 SVG fallback（lucide-react + 手写品牌 SVG）

## 影响范围

- `packages/components/icons/` — 新增 `iconfont-context.tsx` + `fallbacks/`，修改 `icofont.tsx`、`index.tsx`
- `packages/wuh.site.next/app/components/AppProviders.tsx` — 删除 `useExternal`，换 `<IconfontStyle />`
- 消费者（所有使用 iconfont Icon 的组件）— 不改，API 向后兼容
