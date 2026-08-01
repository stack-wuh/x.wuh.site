# 音乐播放器延迟加载优化

> 原始变更名：`20250606_P_audio_player_lazy`

## 元数据
- 日期：2026-06-06
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计文档

## 改动

1. **layout.tsx** — `GlobalAudioPlayer` 从静态 import 改为 `next/dynamic(() => import('...').then(m => m.GlobalAudioPlayer), { ssr: false })`
2. **MiniPlayer.tsx** — `collapsed` 状态从 `useState(false)` + `useEffect` 读 localStorage 改为 `useState(() => localStorage check)` 直接初始化
3. **GlobalAudioPlayer.tsx** — 歌单 fetch 从直接调用改为 `requestIdleCallback(bootstrap, { timeout: 2000 })`

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
change: audio-player-lazy
date: 2026-06-06
type: P
status: applied
```

### `design.md`
# 设计文档

## 改动

1. **layout.tsx** — `GlobalAudioPlayer` 从静态 import 改为 `next/dynamic(() => import('...').then(m => m.GlobalAudioPlayer), { ssr: false })`
2. **MiniPlayer.tsx** — `collapsed` 状态从 `useState(false)` + `useEffect` 读 localStorage 改为 `useState(() => localStorage check)` 直接初始化
3. **GlobalAudioPlayer.tsx** — 歌单 fetch 从直接调用改为 `requestIdleCallback(bootstrap, { timeout: 2000 })`

### `proposal.md`
# 音乐播放器延迟加载优化

## 概述

优化音乐播放器加载和挂载时机，解决首屏长任务和动画闪烁问题。

## 需求

- GlobalAudioPlayer 改为 `next/dynamic` 动态导入，从首屏 bundle 分离
- MiniPlayer collapsed 状态从 localStorage 初始化，消除页面加载时的折叠动画闪动
- 歌单 fetch 用 `requestIdleCallback` 延迟到浏览器空闲时执行
