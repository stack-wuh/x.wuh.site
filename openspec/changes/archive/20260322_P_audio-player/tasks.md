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
