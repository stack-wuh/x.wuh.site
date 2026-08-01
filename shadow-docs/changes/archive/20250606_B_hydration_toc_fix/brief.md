# 设计文档

> 原始变更名：`20250606_B_hydration_toc_fix`

## 元数据
- 日期：2025-06-06
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
`useToc` hook 中 DOMParser 解析在 `useMemo` 内执行，通过 `typeof window === 'undefined'` guard 分支：
- SSR: 返回 `toc: []`
- 客户端 hydration: 返回真实 TOC 数据

导致 `<TocMobile>` 和 `<TocAside>` 在服务端 HTML 中不存在但客户端 React tree 中存在，触发 hydration mismatch。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
将 DOMParser 解析从 `useMemo` 移到 `useEffect` + `useState`：首次渲染始终返回 `toc: []`（SSR 和客户端一致），hydration 后再异步解析 TOC。

`useToc` hook 中 DOMParser 解析在 `useMemo` 内执行，通过 `typeof window === 'undefined'` guard 分支：
- SSR: 返回 `toc: []`
- 客户端 hydration: 返回真实 TOC 数据

导致 `<TocMobile>` 和 `<TocAside>` 在服务端 HTML 中不存在但客户端 React tree 中存在，触发 hydration mismatch。

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: hydration-toc-fix
date: 2025-06-06
type: B
status: applied
```

### `design.md`
# 设计文档

## 问题

`useToc` hook 中 DOMParser 解析在 `useMemo` 内执行，通过 `typeof window === 'undefined'` guard 分支：
- SSR: 返回 `toc: []`
- 客户端 hydration: 返回真实 TOC 数据

导致 `<TocMobile>` 和 `<TocAside>` 在服务端 HTML 中不存在但客户端 React tree 中存在，触发 hydration mismatch。

## 修复

将 DOMParser 解析从 `useMemo` 移到 `useEffect` + `useState`：首次渲染始终返回 `toc: []`（SSR 和客户端一致），hydration 后再异步解析 TOC。

### `proposal.md`
# 设计文档

## 问题

`useToc` hook 中 DOMParser 解析在 `useMemo` 内执行，通过 `typeof window === 'undefined'` guard 分支：
- SSR: 返回 `toc: []`
- 客户端 hydration: 返回真实 TOC 数据

导致 `<TocMobile>` 和 `<TocAside>` 在服务端 HTML 中不存在但客户端 React tree 中存在，触发 hydration mismatch。

## 修复

将 DOMParser 解析从 `useMemo` 移到 `useEffect` + `useState`：首次渲染始终返回 `toc: []`（SSR 和客户端一致），hydration 后再异步解析 TOC。
