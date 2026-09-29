# MusicView

/music 页面视图组件：年轮编年·碟心封面。

## 用法

```tsx
<MusicView
  playlistId={playlistId}
  playlist={playlist}
  annualPlaylists={annualPlaylists}
  profile={profile}
/>
```

## 说明

- 年度切换为「年轮编年」：左侧衬线年份纵轨（选中 `aria-current` 主色，未选中按距离淡化），键盘 ↑↓←→ 沿轨切换。
- 面板头是小黑胶碟（歌单封面做碟心圆标）：切年淡出→轻转 120°→换面淡入，播放时慢转。
- 内容区右上超大水印年份；按语引用本卷 `playCount` 最高的曲目（缺省不展示）。
- 歌单 `description` 渲染为描述位；`tags` 为服务端预留字段，有值即渲染 chips。
- 样式从 `music/styles` 共享导出，本目录只保留逻辑与组合。
