## AudioPlayer 音频播放器

`AudioPlayerProvider` 提供跨页面共享的播放状态，小组件 `AudioMiniPlayer` 与播放面板 `AudioPlayerPanel` 共用同一个上下文，可通过 `useAudioPlayer` 访问状态与控制方法。

```tsx
'use client'
import { AudioPlayerProvider, AudioMiniPlayer, AudioPlayerPanel } from '@wuh.site/components/audio-player'

export const App = () => (
  <AudioPlayerProvider trackResolver={(id) => fetch(`/api/music/track?id=${id}`).then((res) => res.json())}>
    {/** 页面内容 */}
    <AudioMiniPlayer />
    <AudioPlayerPanel />
  </AudioPlayerProvider>
)
```

在业务层通过 `useAudioPlayer().actions.loadQueue(tracks)` 注入网易云歌单数据，即可完成播放初始化。
