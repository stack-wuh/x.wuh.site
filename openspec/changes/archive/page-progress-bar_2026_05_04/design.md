# 设计：顶部 NProgress 风格进度条

## 原理

`@bprogress/next` 封装 `next/navigation` 的 `useRouter`，拦截 `push`/`replace` 调用 + 监听 `usePathname()` 变化来驱动 NProgress 进度条。

```
layout.tsx (持久化)
  ├── SiteHeader
  ├── ProgressProvider
  │   └── {children}
  └── Footer
```

## 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| height | 3px | 进度条高度 |
| color | var(--primary-color) | 跟随主题 |
| delay | 80ms | 80ms 内完成的导航不显示进度条 |
| shallowRouting | true | 仅 pathname 变化触发，query 不变不触发 |
| options.showSpinner | false | 不显示右上角 spinner |

## 依赖

- `@bprogress/next` — NProgress 的 Next.js 15 App Router 封装
- 底层 `nprogress` CSS + JS，零额外运行时依赖
