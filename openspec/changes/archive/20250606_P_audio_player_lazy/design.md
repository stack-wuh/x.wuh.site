# 设计文档

## 改动

1. **layout.tsx** — `GlobalAudioPlayer` 从静态 import 改为 `next/dynamic(() => import('...').then(m => m.GlobalAudioPlayer), { ssr: false })`
2. **MiniPlayer.tsx** — `collapsed` 状态从 `useState(false)` + `useEffect` 读 localStorage 改为 `useState(() => localStorage check)` 直接初始化
3. **GlobalAudioPlayer.tsx** — 歌单 fetch 从直接调用改为 `requestIdleCallback(bootstrap, { timeout: 2000 })`
