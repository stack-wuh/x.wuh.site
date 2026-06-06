# 设计文档

## 问题

`useToc` hook 中 DOMParser 解析在 `useMemo` 内执行，通过 `typeof window === 'undefined'` guard 分支：
- SSR: 返回 `toc: []`
- 客户端 hydration: 返回真实 TOC 数据

导致 `<TocMobile>` 和 `<TocAside>` 在服务端 HTML 中不存在但客户端 React tree 中存在，触发 hydration mismatch。

## 修复

将 DOMParser 解析从 `useMemo` 移到 `useEffect` + `useState`：首次渲染始终返回 `toc: []`（SSR 和客户端一致），hydration 后再异步解析 TOC。
