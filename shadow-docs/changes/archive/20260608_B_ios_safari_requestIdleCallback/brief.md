# iOS Safari 兼容性修复 — requestIdleCallback

> 原始变更名：`20260608_B_ios_safari_requestIdleCallback`

## 元数据
- 日期：2026-06-08
- 类型：B
- 状态：archived
- Issue：历史记录未提供

## 动机
iOS Safari 浏览器访问网站时报错 "Application error: a client-side exception has occurred"，页面完全不可用。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
历史记录未提供

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: ios-safari-requestIdleCallback
date: 2026-06-08
type: B
status: archived
```

### `proposal.md`
# iOS Safari 兼容性修复 — requestIdleCallback

## 问题

iOS Safari 浏览器访问网站时报错 "Application error: a client-side exception has occurred"，页面完全不可用。

## 根因

`GlobalAudioPlayer` 组件的 `useEffect` 中调用了 `requestIdleCallback`，该 API 仅在 Chromium 系浏览器中可用，Safari（桌面 + iOS）均不支持。

错误发生在 `layout.tsx` 中的动态组件，页面的 `error.tsx` 无法捕获，触发 Next.js 全局 error overlay。

## 修复

添加运行时检测，`requestIdleCallback` 不可用时退化为 `setTimeout`/`clearTimeout`。

## 影响

- Chromium 浏览器行为不变
- Safari/iOS Safari 上歌单延迟加载正常工作（退化为固定延迟）
