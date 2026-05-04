# 页面加载进度条

## 为什么做

路由切换时缺少导航反馈。虽然 loading.tsx 骨架屏在 Suspense 悬起时提供占位，但从点击 Link 到骨架屏出现的间隙没有任何视觉信号。需要一个顶部进度条来覆盖完整的导航生命周期。

## 做什么

- 安装 `@bprogress/next`（专为 Next.js 15 App Router 设计）
- 在 `app/layout.tsx` 中集成 `ProgressProvider`，包裹页面内容
- 进度条高度 3px，颜色跟随主题 `--primary-color`
- `delay={80}` 快速导航不显示，避免闪烁
- `shallowRouting` 仅 pathname 变化触发

## 影响范围

- `packages/wuh.site.next/package.json` — 新增 `@bprogress/next` 依赖
- `packages/wuh.site.next/app/layout.tsx` — 包裹 `ProgressProvider`

## 不改什么

- 不删除 `loading.tsx`（骨架屏互补）
- 不修改 `useRouter` 用法（项目当前未用）
