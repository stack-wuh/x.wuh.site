# 设计：音乐播放器

## 方案

### 1. 全局状态管理

- React Context 在 app/layout.tsx 顶层挂载 PlayerProvider
- 状态: currentTrack, queue, playing, volume, progress, mode
- 音频播放通过 HTMLAudioElement wrapper 实现

### 2. 组件结构

```
PlayerProvider
├── MiniPlayer（迷你小组件）
│   ├── 封面缩略图
│   ├── 曲目信息
│   ├── 播放/暂停
│   └── 展开面板按钮
├── PlayerPanel（播放面板）
│   ├── 封面大图
│   ├── 歌词滚动
│   ├── 进度条（可拖拽）
│   ├── 播放控制（上/下/播放/暂停）
│   ├── 音量控制
│   └── 播放队列
└── usePlayer hook
```

### 3. 技术要点

- 仅在浏览器端运行，SSR 需 guard window
- 音频 service: HTMLAudioElement + 事件转发
- 跨路由保持: Layout 单例 Provider
- 移动端适配: Mini 组件固定底部

## 依赖

- 零新依赖
