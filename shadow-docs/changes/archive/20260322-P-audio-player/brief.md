# 音乐播放器

> 原始变更名：`20260322_P_audio-player`

## 元数据
- 日期：2026-03-22
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1 — 基础设施
- [ ] T1: 定义 TypeScript 接口与音频 Service
- [ ] T2: 实现全局 PlayerProvider
### Phase 2 — 组件实现
- [ ] T3: 实现 MiniPlayer 小组件
- [ ] T4: 实现 PlayerPanel 播放面板
### Phase 3 — 集成与验证
- [ ] T5: 在 Layout 挂载 PlayerProvider
- [ ] T6: 验证播放功能与跨页面持久化

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 音乐播放器
change: audio-player
date: 2026-03-22
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/48
```

### `design.md`
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

### `proposal.md`
# 音乐播放器

## 为什么做

站点尚无全局播放器。需要实现网易云风格全站音乐体验，支持迷你播放器小组件 + 播放面板，跨页面共享播放状态。

## 做什么

- 迷你播放器小组件（显示曲目、播放/暂停、上一首/下一首、进度/音量）
- 网易云风格播放面板（播放队列、封面/歌词、播放模式、音量、拖拽进度）
- 小组件与播放面板共享全局播放状态，即时同步
- 路由切换时保持播放不断流
- 集成开放音乐 API 服务商

## 影响范围

- `packages/components/player/` — 新增
- `packages/wuh.site.next/app/` — PlayerProvider 挂载

## 不改什么

- 不实现网易云账号登录
- 不新增第三方依赖（除非获批）

### `tasks.md`
# 任务拆分

## Phase 1 — 基础设施

- [ ] T1: 定义 TypeScript 接口与音频 Service
  - 涉及文件: `packages/components/player/types.ts`, `audioService.ts`
  - 产出: 数据契约、HTMLAudioElement wrapper

- [ ] T2: 实现全局 PlayerProvider
  - 涉及文件: `packages/components/player/PlayerProvider.tsx`
  - 产出: Context + useReducer 全局状态

## Phase 2 — 组件实现

- [ ] T3: 实现 MiniPlayer 小组件
  - 涉及文件: `packages/components/player/MiniPlayer.tsx`
  - 产出: 迷你播放器 UI + 控制逻辑

- [ ] T4: 实现 PlayerPanel 播放面板
  - 涉及文件: `packages/components/player/PlayerPanel.tsx`
  - 产出: 全功能播放面板（队列、歌词、封面、进度）

## Phase 3 — 集成与验证

- [ ] T5: 在 Layout 挂载 PlayerProvider
  - 涉及文件: `packages/wuh.site.next/app/layout.tsx`

- [ ] T6: 验证播放功能与跨页面持久化
  - `pnpm --filter @wuh.site/next lint && pnpm --filter @wuh.site/next build`
  - 手动验证播放不断流、切页行为、移动端
