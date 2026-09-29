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

## 移动端（≤ `BREAKPOINTS.mobile`）

- 年度切换收成「年谱刻度带」：纯文字衬线年份沿基线排开，选中年放大 + 下划标，其余按距离淡化；两端渐隐 mask 提示横滑，滚动条全隐藏；切年后选中卷 `scrollIntoView` 居中，桌面鼠标可拖拽横滑（`pointer: fine` 才启用，拖动后拦截误触点击）。
- 曲目行两行制：歌名独占一行省略、艺术家退第二行、次数/时长/最爱在右列竖排；触屏无 hover——按住行即翻出播放键，播放中歌名常驻主色。
- 页头身份栏收进标题行（头像 28px + 昵称截断保护 + Lv 徽章），副题独占下行。
- 碟心 72px（桌面 64px），水印年份移动端隐藏。
