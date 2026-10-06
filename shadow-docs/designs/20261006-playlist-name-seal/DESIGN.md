# 歌单名题签姊妹列 · 设计决策清单（定稿 2026-10-06）

- 视觉稿：`shadow-docs/designs/20261006-playlist-name-seal/prototype.html`（常驻预览 `http://127.0.0.1:8151/prototype.html?prop=B&scene=normal`，按钮切 构/景/主题；`scene=ghost` 为墨痕五站遮挡探针）
- 截图链：`shots/`（选型轮 A/B0/C/D + 定稿 B-1 两帧；C/D 与否决位 B0 为留档，不得在本需求内复活）
- 选型拍板：构 B「题签姊妹列」；A 为备选（用户未选，落选留档）

## 骨法

歌单名 → 立轴「卷题签」：印面永远单字「卷」（宽度恒定，长度不可控的名由竖列自身消化），与曲题签「曲 · N / 总数」成对贴装裱左右——右曲次、左卷名，一卷一曲对读。签名记忆点仅此一枚落款印；朱砂描边阴文（同「全体欣赏音乐」空态印框静配重），面板唯一饱和件纪律不破。

## 决策清单（逐条 → 实现文件 / 词典 key / 守卫断言）

1. **契约扩展** — `loadQueue(tracks, { startIndex?, autoPlay?, playlistName? })`，`AudioPlayerState.playlistName?: string`；每次 loadQueue 整体替换（换卷语义），未传即隐位。向后兼容，公开 API 只增不改。
   — 文件 `packages/components/audio-player/specs.tsx` + `provider.tsx`
   — 守卫 `provider.test.mjs`：playlistName 入 state、换队列覆盖、缺省 undefined。
2. **消费者接线** — `/music` 页 `apps/site/app/music/MusicView/index.tsx` 传 `playlist.name`（卷名同源服务端）；`apps/site/app/components/player/GlobalAudioPlayer.tsx` 兜底队列传其歌单 name。
   — 文件 上述两处
   — 守卫 `apps/site/test/music-player-wiring.test.mjs`：两处 loadQueue 均带 playlistName。
3. **卷题签列（VolumeTab）** — 竖排 serif 11px / `--ink-faint` / letter-spacing .3em，宽 22px、`max-height 208px`、`overflow: hidden` + `mask-image: linear-gradient(180deg, black 78%, transparent)`（墨尽渐隐，同 GhostLine 语言）；绝对定位挂 PlateWrap，锚 `right: calc(100% + 26px); bottom: -4px`——实测与 x27% 墨痕站净空 73px，不撞站（原型量测 shots/final-B1-ghost-dark.png）。
   — 文件 新建 `panel/styles/volume.tsx`（PANEL_SOURCES 清单**末尾追加**，不重排既有条目）
   — 守卫 `style.test.mjs`：writing-mode/ mask-image/ 锚点表达式在场；拆分纪律守卫同步更新清单断言。
4. **卷印（VolumeSeal）** — 20×20、`border: 1px solid color-mix(primary 55%)`、radius 4、serif 12px 主色字，行内流随列尾（列脚印）；字面常量 `VOLUME_SEAL_GLYPH = '卷'` 入 `panel/styles/tokens.ts` 钉死。
   — 文件 `panel/styles/volume.tsx` + `panel/styles/tokens.ts`
   — 守卫：常量断言 + 印随列尾结构断言（VolumeSeal 在 VolumeTab 声明之后、同文件）。
5. **渲染位** — PlayerPanel JSX：`<PlateWrap>` 内 `{playlistName ? <VolumeTab title={playlistName} aria-label={playlistName}>…<VolumeSeal/></VolumeTab> : null}`——**空态条件渲染整位隐去**，禁灰字占位；title 悬浮全名；aria 用数据原文不加前缀词（无新词典 key）。
   — 文件 `PlayerPanel.tsx`
   — 守卫：条件渲染存在断言 + `doesNotMatch` 空态渲染分支；行数 ≤500 由拆分纪律守卫继续兜底（现 470 行，余量充足）。
6. **换卷重挂载** — VolumeTab 以 `key={playlistName}` 重挂载，淡入走 ghostIn 同语言（可选装饰，起步先静）；无播放联动动效 → 无 reduced-motion 负担。
   — 文件 `PlayerPanel.tsx`
   — 守卫：key 表达式断言。
7. **态覆盖** — 词卷态：WordsView（z3 纸底 88%）盖舞台，卷题签随之隐没，不另作处理（与曲题签同命，空间承诺一致）；翻页屏/音量 popover/z 层序：零影响；移动册页：`@media (max-width: BREAKPOINTS.mobile)` 隐藏 VolumeTab（与 StageTab 移动策略对齐——**实现时核对 StageTab 现状**，若其移动态可见则卷题签随其语义决定，不得悬空新行为）。
   — 文件 `panel/styles/volume.tsx`
   — 守卫：移动媒体查询断言与 StageTab 一致性检查。
8. **webfont 子集** — 印面字「卷」(U+5377) 不在五印子集（樂/愛/念/音/墨），随 first-load-performance 卡记录的 CJK 子集管线扩档；扩档前系统宋体兜底可接受（印面单字、失败态仅字形朴素）。
   — 文件 站点字体管线（apps/site，具体挂点按 first-load-performance 卡「验证方式」定位）
   — 守卫：子集名单断言（若管线有源码清单）。

## 生产禁令对验

无 scrollIntoView / 无 styled 动态类驱动显隐（此处为条件渲染，天然免疫）/ 颜色只 token / 布局零位移（题签绝对定位不占 grid 流）/ aria 与键盘路径不受影响（纯展示件）。
