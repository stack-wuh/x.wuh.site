# useFetch fetcher 请求库简化

## 为什么做

当前 `fetcher.ts`（215 行）存在三个问题：

1. **跨平台兼容性差**：`buildUrl` 硬编码 `window.location.origin` 作为 base URL，在 React Native 环境无法运行；`NodeJS.Timeout` 类型在非 Node 运行时失效
2. **过度设计**：回调模式（onStart/onSuccess/onError/onFinally）在 fetcher 和 useFetch 两层都有定义，实际零消费者；useFetch 整个 hook 项目中无运行时引用
3. **Next.js 耦合**：`RequestInit & { next?: NextFetchConfig }` 类型扩展在纯 fetch 层面绑定了 Next.js 语义

目标：精简 fetcher 为核心 fetch 包装器，移除平台相关代码，方便后续 RN 和 Electron 应用共用。

## 做什么

- 修复 `buildUrl` 移除 `window` 依赖，改用环境无关的 URL 构造方式
- `NodeJS.Timeout` 改为 `ReturnType<typeof setTimeout>`
- 移除 fetcher 和 useFetch 中的回调模式（无消费者）
- 将 Next.js ISR 的 `next` 选项从核心类型中解耦
- 清理 useFetch 中未使用的 `createOptionsKey`、`mergeOptions` 等辅助函数

## 影响范围

- `packages/hooks/useFetch/fetcher.ts` — 核心修改
- `packages/hooks/useFetch/useFetch.ts` — 精简
- `packages/hooks/useFetch/index.ts` — 导出调整（如有）
- `packages/wuh.site.next/app/lib/api.ts` — 适配新接口

## 不改什么

- 不改变 `FetchResult` 模式（不 throw 的返回约定保持不变）
- 不改变 `api.ts` 中业务 API 的对外接口（content/repos/comments）
- 不删除 `useFetch.ts`（保留为可选 React 绑定，未来 RN/Electron 可能用到）
