# Empty 组件

## 为什么做

博客详情页底部留言区域缺少占位提示。需要新增 Empty 空状态组件，在留言系统未实现时提供清晰的占位语义。

## 做什么

- 在 `packages/components/empty/` 实现可复用 Empty 组件
- 样式使用 CSS 变量 token
- 在博客详情页底部接入作为"留言系统预留区"占位
- 支持可选 title/description/icon 插槽

## 影响范围

- `packages/components/empty/` — 新增
- `packages/wuh.site.next/app/post/PostView.tsx` — 底部接入

## 不改什么

- 不接入真实留言系统接口
- 不新增第三方依赖
