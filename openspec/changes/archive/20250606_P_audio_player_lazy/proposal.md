# 音乐播放器延迟加载优化

## 概述

优化音乐播放器加载和挂载时机，解决首屏长任务和动画闪烁问题。

## 需求

- GlobalAudioPlayer 改为 `next/dynamic` 动态导入，从首屏 bundle 分离
- MiniPlayer collapsed 状态从 localStorage 初始化，消除页面加载时的折叠动画闪动
- 歌单 fetch 用 `requestIdleCallback` 延迟到浏览器空闲时执行
