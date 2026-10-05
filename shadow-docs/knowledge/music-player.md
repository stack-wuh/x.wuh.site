---
title: 音乐播放器与网易云接入
domain: music
keywords: [音乐, 播放器, 歌单, 年度歌单, 网易云, netease, NeteaseCloudMusicApi, 歌词, 音频, 不可播跳过, MUSIC_U, music.126.net, 混合内容, 播放次数, user_record, 听歌排行]
scope:
  - apps/server/src/modules/music
  - apps/site/app/music
  - apps/site/app/components/player
  - packages/components/audio-player
status: active
source:
  - changes/20260928-feature-music-player/brief.md
  - changes/20260928-feature-music-annual-playlists/brief.md
  - changes/20260929-build-music-token-watch/brief.md
  - changes/20260929-feature-music-yearbook/brief.md
  - changes/20260929-fix-music-user-record-uid/brief.md
  - changes/20260929-style-music-chronicle/brief.md
  - changes/20260929-style-music-mobile/brief.md
  - changes/20260929-style-player-panel-inkwash/brief.md
  - changes/20260929-feature-music-skeleton/brief.md
  - changes/20260930-style-player-panel-deck/brief.md
  - changes/archive/20260929-style-music-interaction-polish/brief.md
  - changes/20260930-style-player-dock-ruler/brief.md
  - changes/20260930-feature-player-dock-progress-seal/brief.md
  - changes/archive/20260930-fix-mode-band-underline-inversion/brief.md
  - changes/archive/20260930-fix-player-active-state-recalc/brief.md
  - changes/archive/20260930-style-player-mobile-album-leaf/brief.md
  - changes/archive/20260930-fix-panel-progress-double-scale/brief.md
  - changes/archive/20260930-style-lyrics-empty-copy/brief.md
  - changes/archive/20260930-fix-panel-progress-double-scale/brief.md
  - changes/archive/20260930-style-lyrics-empty-copy/brief.md
  - changes/20260930-fix-panel-lyric-scroll-bleed/brief.md
  - changes/20260930-style-player-favorite-ai-seal/brief.md
  - changes/20260930-feature-player-length-adaptive/brief.md
  - changes/20261001-fix-mini-player-marquee-undefined/brief.md
  - changes/20261001-style-player-stage-budget/brief.md
  - changes/20261001-style-player-queue-fold/brief.md
  - changes/20261002-fix-player-queue-fold-hotfix/brief.md
  - changes/archive/20261002-style-player-ghost-depth/brief.md
  - changes/archive/20261002-style-player-cover-disc/brief.md
verified: 2026-10-05
verified-depth: unit
verified-scope: audio-player 守卫 47/47（含 20261001 新守卫 7 条：跑马灯三处同源/模式钮 icon-only/音量 popover aria/墨痕 aria-hidden/QueueArtist 限宽/[lang=en] 钩子/显隐组件行内样式免疫，并并归 favorite-ai-seal 与 lyric-scroll-bleed 两套守卫）+ locales 词典 13/13 + wiring 10/10 + 根 tsc 净 + oxlint 0/0 + 生产构建通过 + 实现走查（与 favorite-ai-seal 的 merge 冲突语义并档：overflow: clip、禁 scrollIntoView、最愛印 glyph 三元、Track.playCount 全部移植进留白独奏重写版）；runtime 目检（四主题×三语×关键态）移至部署后生产复验（v1.4.43 先例），历史 runtime 结论沿承各变更验证记录。20260930-fix-panel-lyric-scroll-bleed：弹层定位纪律 runtime 验证（audio-player 守卫 40/40 含全文件禁 scrollIntoView 与 overflow: clip ≥2 守卫、根 tsc 净、oxlint 0 errors；mock 后端本地复现——面板壳 scrollTop/scrollLeft 全程恒 0 且 118px 隐藏可滚溢出不可达、歌词内滚深居中 scrollTop 1589 正常、队列当前项对齐、明暗双主题截图无底带无眉标裁切）。20260930-style-player-favorite-ai-seal：最爱换印 runtime 验证（audio-player 守卫 40/40 含最爱口径/印面三元/音量无 glyph/Track.playCount 契约守卫、根 tsc 净、oxlint 0 errors、build:next 绿；mock 数据本地实测——最爱曲进度印=愛、音量印=樂、印面 fontFamily=Noto Serif SC，playCount 经队列流入面板；非最爱探针受本地 dev 水合断树阻塞未跑通，由守卫钉死的三元表达式 + Progress 既有默认樂覆盖，部署后生产可即时目检）。
---

# 音乐播放器与网易云接入

## 当前结论

**数据源归属**：网易云能力由 `apps/server` 的 `music` 模块提供（`GET /v2/music/playlist|track|search`），实现方式是**库方式内嵌** `NeteaseCloudMusicApi@4.32.0`（精确锁定版本，只消费其模块函数；不启动该包自带的 express server），因此不新增容器与端口，`Dockerfile`/`docker-compose.yml`/`deploy-docker.sh` 均不参与。站点侧不再自持代理 route（旧的 `apps/site/app/api/music/**` 已删除），`/api/music/*` 经 Next 既有的 `/api/:path*` → Nest rewrite 落到 `/v2/music/*`。

**接口契约**（桌面端等其它消费者按此对接，不再复制站点实现）：
- `GET /v2/music/playlist?playlistId=`（缺省取 `NETEASE_DEFAULT_PLAYLIST_ID`，默认 `3778678` 热歌榜）→ `{ playlistId, name, description, coverUrl, tracks: [{ id, name, artist, album, coverUrl, duration, playCount? }] }`；配置 `MUSIC_U` 时曲目联表**听歌排行**（`user_record` type=0 全期 top 1000）写入可选 `playCount`，未上榜/未配置登录态/联表上游失败 → 字段缺省不报错（联表属元数据可缓存）。**`user_record` 入参名是 `uid` 不是 `id`**（库模块读 `query.uid`），误传 `id` 上游返 400（库包装 502）再被联表降级 catch 吞成空 Map，播放次数与最爱标记整体静默消失——2026-09-29 线上事故即此因；联表断言必须覆盖参数名
- `GET /v2/music/track?id=&level=`（`level` 默认 `exhigh`，可选 `standard|higher|exhigh|lossless|hires|jyeffect|sky|jymaster`）→ `{ streamUrl, duration, lyrics }`；**不可播曲目返回 `streamUrl: null`（HTTP 200），不抛错**
- `GET /v2/music/search?keywords=&limit=`（`limit` 1–50，默认 30）→ `{ keywords, tracks: [...] }`
- `GET /v2/music/user-playlists` → `{ playlists: [{ id, name, coverUrl, trackCount }], profile?: { nickname, avatarUrl, level } }`——「我的年度歌单」：**名字含「年度」的创建歌单**，年份倒序（歌单名 4 位年份正则，无年份排最后按名称）；单页 `limit: 100` 不翻页（`more: true` 记 warn 只处理首屏）；`profile` 复用既有的 `user_account` 调用暴露（avatarUrl 已改写 https 并带 `param=120y120` 小图），未配置登录态或 uid 解析失败时缺省

**年度歌单选择语义**：筛选/排序/登录态语义只在服务端持有，消费方不得复制实现。`MUSIC_U` 未配置 → 不发上游直接空列表（200，正常业务态）；上游成功但解析不出 uid（登录失效）→ warn + 空列表；上游失败走既有 502/503。站点侧（`/music` 页与迷你播放器）对空列表与失败**一律隐藏年度入口并回落 `NEXT_PUBLIC_NETEASE_PLAYLIST_ID` 兜底歌单**，行为一致；`/music` 未指定 `?playlist=` 时缺省选中最新一年，迷你播放器默认队列同源（先取年度首项再拉歌单）。官方榜单预设（热歌/飙升/新歌 tab）已从音乐页移除，`/v2/music/playlist` 端点本身仍可取任意公开歌单。

**/music 页呈现**（2026-09-29 起，替代此前的书架书脊方案）：年度切换为「年轮编年·碟心封面」——左侧衬线年份纵轨（选中 `aria-current` 主色高亮，未选中按距选中距离淡化）+ 内容区右上超大水印年份（≤640px 隐藏）+ 面板头 64px 小黑胶碟（歌单封面做碟心圆标；切年淡出→轻转 120°（累计）→换面淡入，2 秒内连切自动收短；`status==='playing'` 且队列属当前卷时慢转；`prefers-reduced-motion` 下静止）+ 按语（本卷 `playCount` 最高曲目，缺省不展示）；歌单 `description` 渲染为描述位，`tags` 为服务端预留字段（前端已按 `tags?: string[]` 渲染 chips，服务端补字段即点亮）。曲目行语言（悬停编号翻播放键/次数/最爱徽标/时长）与书架期一致。**路由骨架**（2026-09-29 起）：路由带 `app/music/loading.tsx`，与 `/post` 撤销 loading.tsx 的结论相反——/music 冷缓存要 Next→Nest→网易云双重上游跳转（秒级白屏），骨架有真实反馈价值；页头「音乐」标题/副题是静态常量**直接出真容**（骨架不作 FCP 元素，循 first-load-performance 教训），数据未知区域（纵轨/碟心/面板文案/简介/曲目行×8，共 53 块）复用 `./styles` 布局容器 + 组件库 `Skeleton` 同源布局，骨架壳实测 +29.5KB（基线 71KB），缓存命中骨架短闪为已知代价；button 类容器（`RailItem`/`TrackButton`）因无可聚焦元素约束不可复用，以局部非交互容器（`RailSlot`/`NameSlot`/`styled(TrackRow)` 去 pointer）替代。

**/music 移动端呈现**（2026-09-29 起，≤ `BREAKPOINTS.mobile`）：年度切换收成「年谱刻度带」——纯文字衬线年份沿基线排开（选中年 27px/600 主色 + 2px 下划标，其余按距离 16px 淡化，同一套 `$dist` 语言），两端渐隐 mask 提示横滑、滚动条全隐藏（`scrollbar-width: none` + `::-webkit-scrollbar`，组件级 specific 于全局滚动条）、切年后选中卷 `scrollIntoView` 居中（reduced-motion 瞬移）、桌面 `pointer: fine` 下鼠标可拖拽横滑（拖动后 click capture 拦截误触）。曲目行两行制：歌名独占一行省略、艺术家退第二行、次数/时长/最爱在右列竖排（`TrackSide` 桌面 `display: contents` 溶入单行布局与历史渲染一致，移动端网格两行右锚）；触屏无 hover——`:active` 翻出播放键、播放中歌名常驻主色；行 `min-height: 54px` 触控目标。碟心 56→72px；页头身份栏已整体移除（20260929 起：头像/昵称/Lv/「自 X 年记录」全删，页头只留标题+副题与全站同构，记录跨度由年份纵轨表达；`profile` prop 不再下传，但服务端 `/v2/music/user-playlists` 契约仍暴露该字段）。陷阱：两行制下 `TrackButton` 移动端必须 `align-items: stretch`（`flex-start` 会让 `TrackName` 保持内容宽不截断、溢出盖住右列——短名行看不出来，长名行必现）。

**播放面板桌面形态**（2026-10-01 起，「留白独奏」定稿，**替代桌面三栏布局**——下述晕染纸底五层配方、移动册页、甲板传输语言全部延续）：桌面为居中单焦点舞台 `grid-template-areas 'stage' 'dock'`——主舞台后一团主题色暖晕（radial 7% + blur 12px）；封面**黑胶大碟嵌方裱**（20261002 碟化定稿，月洞窗构图：碟面纯 CSS 深色底+同心纹刻+斜向高光，碟心 42% 封面圆标换曲换图，纸色轴点；播放 26s/圈随转、暂停冻结当前角度不复位、reduced-motion 静止；碟径沿用舞台预算三档帽，移动册页图版 LeafPlateArt 自持方形不动）+ 竖排 mono 朱砂题签「曲 · N / 总数」（`html[lang='en']` 字距降档钩子，lang 由 i18n 同步保证）；题名 serif 25px **手卷**（溢出才徐展——`useMarquee.ts` 三处同源：迷你条/面板题名/词卷题头，ghost 量尺 + 双拷贝轨道 + 暂停停走 + reduced-motion 回落省略号，`title` 悬浮全名）；**界格笺题跋**三行（上/下句淡墨 + 当前句大字居格 + 朱砂句读环，行间发丝界线，垂直 mask 渐隐；无词回落「暂无歌词」）；「樂」印进度 460px 居中；**单行钮群**居中「模式 | 上一曲/播放/下一曲 | 音量」（playbar 同构）。**循环模式钮 icon-only**：图标随当前模式换装（`IconRepeat`/`IconRepeatOne`/`IconShuffle`，icons 包既有导出），朱砂染色即当前模式，点击 order→repeat-one→shuffle 循环，aria/title 用 `player.panel.modeDialLabel`（'{mode}，点击切换'）——任一语言宽度归零；下划线三钮文字带退役。**词卷展开态**：右上印章字钮「詞」（字形跨语言不变、语义走 aria，`aria-pressed`；选中显隐**行内样式**驱动）；题头小装裱 + 全篇歌词竖排（`writing-mode: vertical-rl`）成卷——界格转**朱丝栏**（列间发丝竖线），当前句大字 + 3px 朱砂侧标，随播逐列左移（随播定位手动 `scrollTo` 只滚词卷容器：竖排 vertical-rl 走负向 scrollLeft 几何换算、en 横排回退 top 公式——全文件禁 scrollIntoView），点行跳播；en 语境竖排可读性差，`html[lang='en']` 回退横排界格笺。**播放列表抽屉**：右上 `IconListMusic` 钮（`aria-expanded`），自右滑入纸卡 + 遮罩点击收回；歌手列 `QueueArtist` 限宽 92px 省略 + title 全名。**音量 popover**：钮群右端图标钮（`aria-haspopup`/`aria-expanded`，外点/Esc 收）上弹小纸卡——**竖向樂印滑杆**（112px，组件内实现共享 Progress 的竖向同语言变体：`role='slider'` + `aria-orientation='vertical'` + 方向键/Home/End + 指针拖拽，印光标随值上浮；共享 Progress 组件本身只支持横向）。**墨痕歌词**（20261002 定稿，视觉稿 shadow-docs/changes/archive/20261002-style-player-ghost-depth/prototype.html）：竖排**五列两翼**——左翼当前侧 3 列（当前句 27%/6% 墨 15% + 前一句 16%/14% 墨 5.5% + 前二句 6%/30% 墨 4.2%）+ 右翼淡墨回声 2 列（前三句 64.5%/6% 墨 3.4% + 前四句 73%/13% 墨 2.6%，右缘已有队列翻页屏故激活居左）；深度五档 Z 0/−130/−260/−340/−400 经每列 transform **自带 perspective(1000px) 投影**（GhostLayer 的 overflow:hidden 属 grouping 属性，preserve-3d 透传静默失效——铁律②变体，原型帧实测），站点锚点为面板百分比常量（GHOST_STATIONS，均经原型遮挡实测：封面/题名带/题跋/队列屏净空）；换句 = 各站按「站+句索引」重挂载 ghostIn 从站深 −150px 浮入（铁律①），字号 clamp(26px,2.9vw,40px) + 字距 0.22em 竖排行气，长句列内 mask 渐隐（墨尽）；词卷态/无词/暂停自动隐去；纯装饰 `aria-hidden`，reduced-motion 瞬切。**显隐态组件纪律**：词卷开关选中、抽屉/遮罩显隐一律**行内样式驱动**（JSX style 挂 transform/visibility/opacity），禁 styled 动态类插值与属性选择器——与模式带同源的规则删除竞态/属性翻转失灵两连败教训全覆盖；Escape 按层收起（popover→抽屉→词卷→面板）。移动端册页定稿形态不变，仅题名改单行省略 + title 防御（i18n 长度自适应）。

**播放面板视觉语义**（2026-09-29 起，「封面晕染纸底」定稿，替代 #402 的原图 1:1 铺 + 渐变罩——旧法照片结构完整可辨、歌词列压脸，对比度失败；其中桌面布局与模式带形态已被上述「留白独奏」与循环模式钮替代，晕染配方/册页/控制语言继续有效）：面板背景是**五层配方**——① 封面图 `blur(64px) saturate(0.92)`，亮色 `brightness(1.18)`/暗色 `0.62`（照片失去轮廓退化成色场）→ ② 纸色罩 `color-mix(var(--background-100) 72%, transparent)` 全幅压平 → ③ feTurbulence 纸纹 `multiply 6%`（暗色 `soft-light 9%`）经 Panel::after 叠印 → ④ 歌词/列表栏局部纸罩 40%→26% 纵向渐变 → ⑤ 颜色只经主题变量。左栏拆 `NowHeader`（装裱封面+题名）与 `NowDock`（进度+控制+模式+音量）两个 grid 区：桌面 `grid-template-areas 'now lyrics queue' / 'dock lyrics queue'`（dock 锚面板底边），移动端 **20260930 册页起**为 `'pages' 'ticks' 'dock'` 三行：词页=装裱图版主角（纸框发丝线 + 纸边 + 图版内发丝线，mono 朱砂题签「曲 · N / 总数」）+ 两行居中衬线题名（去 ellipsis）+ 短词窗（mask 上下渐隐、当前句加重、点按行 `seek(line.time)` 跳播）；目次为横翻对页（scroll-snap 容器），页缘 ticks 即两个翻页钮（`aria-current` 联动，swipe 之外保键盘/读屏路径，非激活页 `inert`）；grab 下滑关闭手柄 + 图版同作拖拽面（阈值 96px 过即 `togglePanel`，不足回弹）；无词曲目词窗渲染「全体欣赏音乐」印章空态（朱砂 45% 印框）替代死黑；甲板（度曲尺/传输/模式带）两轮定稿不随动。**陷阱：外层 snap 页内的移动容器定位禁用 `scrollIntoView`**——它会连横向一起滚、把面板带去另一页且页缘钮失同步（实测复现），改手动垂直 `scrollTop`（offsetParent 需 `position: relative`）；IAB 自动化环境对程序化滚动抑制 scroll 事件，onScroll 同步链路只能靠源码守卫固化。歌词是签名元素：当前句 serif `--font-size-lg` 实墨 + 3px 朱砂侧标 + `writeIn` 书写显现（audio-player 本地 keyframes），相邻句淡墨其余隐墨；「墨随声走」墨晕（朱砂 9% + 墨 6%，blur 10px）经读取当前句 `offsetTop` 设 transform 跟随（禁 scroll/resize 监听）。播放列表 01–10 序号（mono 淡墨）+ 当前项朱砂左标（非粉底 pill）；栏间通高发丝线、眉标短朱砂 tick。**控制甲板**（2026-09-30 起，补齐 #415 未落地的家具——晕染只铺了纸底，桌面左栏 gutter 缺失、滑杆是原生 `accent-color` 默认形态）：桌面 `NowHeader` padding `xl 0 0 xl`、`NowDock` `0 lg xl xl`（封面装裱 inset、进度/甲板离开面板圆角与列罩边界，矮视口封面收缩档随之 230→220px）；音量条为共享 `Progress` 交互态 120px 原位（20260930-feature-player-dock-progress-seal 起，凹槽私有实现退役——凹槽几何与印光标内聚在组件内）。**进度=白文方印「樂」**（同 change 起，度曲尺两轮服役后退役、用户拍板进度语言统一到共享组件）：`Progress` 交互态 `value={progressPct}` 直传（**progressPct 已是 0–100 百分数，禁二次 ×100**——`value={progressPct*100}` 灌 0–10000 被钳 100、印光标钉死末端刻度，#435 生产实锤：真实进度 0/71/90/51% 下 range 只输出 0 或 100）/ `onChange={(pct)=>seek((pct/100)*totalDuration)}`（onChange 收 0–100 再除回秒，seek 方向生产实测健康）、`breathing={playing}` 播放态微光呼吸晕接真实播放、印光标悬停微浮/拖拽按印入泥；`TimeCode` 两端保留（布局行沿用）；触控档由组件侧 `pointer: coarse` 命中区 44px 承接；**消费方换算必须防 0/0**——`totalDuration=0` 时 `progressPct` 为 NaN，Progress 组件内 `Number.isFinite` 钳 0（NaN 会灌穿受控 range）；**换算口径类守卫要断言语义、不能只镜像实现**——守卫把错误公式一并钉死后门禁全绿照样放行回归（#435 教训）。传输钮层级「幽灵 + 唯一实心盘」且**桌面居中**（修复首轮左聚失衡）——上/下一曲去常驻描边（hover 主色 8% 纸面晕），播放钮 64px 主色盘 + `::after` 内缩碟面标签环（静态不旋转——面板内的旋转语言统一归封面黑胶碟，20261002 碟化定稿后碟随播放转、播放钮环仍静态，职责分离）；播放模式为下划线文字带（纯文字去图标，active 主色 + 2px 下划标，复用页缘钮/年谱刻度带选中语言），与音量合成一行 `space-between`（移动端音量隐藏、模式居中）；**激活态必须行内自定义属性驱动**（20260930 二次修复起：静态规则消费 `var(--mode-line/--mode-ink/--tick-*)`，JSX 激活时经 `style` 挂载、值引 `var(--primary-color)`，aria-pressed/aria-current 语义保留但不参与样式）——选择器驱动的激活态在这张生产行为表上两连败：① transient 动态类有**规则删除竞态**（v6 按使用计数清理，激活变体规则被整条移除，v1.4.36–38 实测）；② `&[aria-pressed]` 属性选择器又遇 **React 属性翻转后失效失灵**（v1.4.41 生产实测：规则恒在、matches() 命中但计算样式不跟随，手动摘戴属性才恢复；页头导航 aria-current 不受影响、dev 不复现）——内联样式变更是引擎保证失效的唯一纯 CSS 令牌通路。`LyricLine`/`QueueItem` 等动态类组件后续触碰应一并转行内自定义属性驱动；CloseButton 常驻描边改透明、hover 显形（位置尺寸与焦点管理不动）。**弹层滚动锁**（2026-09-30 起）：面板打开期间 body 按 Dialog `lockScroll` 配方锁定（`overflow hidden + position fixed + top=-scrollY 补偿 + width 100%`，iOS 触屏同锁），关闭原样还原并 `scrollTo` 回补滚动位置——`aria-modal` 弹层必须配滚动锁，否则背景页可滚。

**播放面板视觉语义**（2026-09-29 起，「封面晕染纸底」定稿，替代 #402 的原图 1:1 铺 + 渐变罩——旧法照片结构完整可辨、歌词列压脸，对比度失败）：面板背景是**五层配方**——① 封面图 `blur(64px) saturate(0.92)`，亮色 `brightness(1.18)`/暗色 `0.62`（照片失去轮廓退化成色场）→ ② 纸色罩 `color-mix(var(--background-100) 72%, transparent)` 全幅压平 → ③ feTurbulence 纸纹 `multiply 6%`（暗色 `soft-light 9%`）经 Panel::after 叠印 → ④ 歌词/列表栏局部纸罩 40%→26% 纵向渐变 → ⑤ 颜色只经主题变量。左栏拆 `NowHeader`（装裱封面+题名）与 `NowDock`（进度+控制+模式+音量）两个 grid 区：桌面 `grid-template-areas 'now lyrics queue' / 'dock lyrics queue'`（dock 锚面板底边），移动端 **20260930 册页起**为 `'pages' 'ticks' 'dock'` 三行：词页=装裱图版主角（纸框发丝线 + 纸边 + 图版内发丝线，mono 朱砂题签「曲 · N / 总数」）+ 两行居中衬线题名（去 ellipsis）+ 短词窗（mask 上下渐隐、当前句加重、点按行 `seek(line.time)` 跳播）；目次为横翻对页（scroll-snap 容器），页缘 ticks 即两个翻页钮（`aria-current` 联动，swipe 之外保键盘/读屏路径，非激活页 `inert`）；grab 下滑关闭手柄 + 图版同作拖拽面（阈值 96px 过即 `togglePanel`，不足回弹）；无词曲目词窗渲染「全体欣赏音乐」印章空态（朱砂 45% 印框）替代死黑；甲板（度曲尺/传输/模式带）两轮定稿不随动。**陷阱：面板内一切程序化定位只滚目标容器，全文件禁用 `scrollIntoView`**——它沿祖先链滚动所有可滚容器：移动端会把 snap 横翻页连带滚走、页缘钮失同步（20260930 册页实测复现）；桌面更把 `overflow` 壳的面板本体连带滚走（20260930 生产实证：晕染层 `inset:-12%` 给壳撑出 118px 纵向 / 139px 横向隐藏可滚溢出，壳 scrollTop 实测 19.5px——三栏内容整体上移、顶部眉标被面板上缘裁切、底边露出未罩纸底的晕染色带，观感即「弹窗下方多了条滚动条」）。修法（20260930-fix-panel-lyric-scroll-bleed 定稿）：歌词居中手动 `LyricsScroll.scrollTo({ top: offsetTop - clientHeight/2 + offsetHeight/2 })`（与移动词窗同式）、队列 nearest 语义手动 scrollTop（可见不动、越界对齐），offsetParent 需 `position: relative`；面板壳 `overflow: clip`——`hidden` 仍是程序化可滚容器，`clip` 才使壳彻底不可滚（基础与移动媒体查询两处），守卫钉死 PlayerPanel 全文件禁 `scrollIntoView` 且 `overflow: clip` ≥2 处；IAB 自动化环境对程序化滚动抑制 scroll 事件，onScroll 同步链路只能靠源码守卫固化。歌词是签名元素：当前句 serif `--font-size-lg` 实墨 + 3px 朱砂侧标 + `writeIn` 书写显现（audio-player 本地 keyframes），相邻句淡墨其余隐墨；「墨随声走」墨晕（朱砂 9% + 墨 6%，blur 10px）经读取当前句 `offsetTop` 设 transform 跟随（禁 scroll/resize 监听）。播放列表 01–10 序号（mono 淡墨）+ 当前项朱砂左标（非粉底 pill）；栏间通高发丝线、眉标短朱砂 tick。**控制甲板**（2026-09-30 起，补齐 #415 未落地的家具——晕染只铺了纸底，桌面左栏 gutter 缺失、滑杆是原生 `accent-color` 默认形态）：桌面 `NowHeader` padding `xl 0 0 xl`、`NowDock` `0 lg xl xl`（封面装裱 inset、进度/甲板离开面板圆角与列罩边界，矮视口封面收缩档随之 230→220px）；音量条为共享 `Progress` 交互态 120px 原位（20260930-feature-player-dock-progress-seal 起，凹槽私有实现退役——凹槽几何与印光标内聚在组件内）。**进度=白文方印「樂」**（同 change 起，度曲尺两轮服役后退役、用户拍板进度语言统一到共享组件）：`Progress` 交互态 `value={progressPct}` 直传（**progressPct 已是 0–100 百分数，禁二次 ×100**——`value={progressPct*100}` 灌 0–10000 被钳 100、印光标钉死末端刻度，#435 生产实锤：真实进度 0/71/90/51% 下 range 只输出 0 或 100）/ `onChange={(pct)=>seek((pct/100)*totalDuration)}`（onChange 收 0–100 再除回秒，seek 方向生产实测健康）、`breathing={playing}` 播放态微光呼吸晕接真实播放、印光标悬停微浮/拖拽按印入泥；`TimeCode` 两端保留（布局行沿用）；触控档由组件侧 `pointer: coarse` 命中区 44px 承接；**消费方换算必须防 0/0**——`totalDuration=0` 时 `progressPct` 为 NaN，Progress 组件内 `Number.isFinite` 钳 0（NaN 会灌穿受控 range）；**换算口径类守卫要断言语义、不能只镜像实现**——守卫把错误公式一并钉死后门禁全绿照样放行回归（#435 教训）。**最爱换印**（20260930-style-player-favorite-ai-seal 起）：本卷 playCount 最高曲目播放时进度印传 `glyph='愛'`（其余 '樂'；音量印恒默认樂）——口径与 /music 最爱徽标同源（`maxPlays>0 && currentTrack.playCount===maxPlays`，含并列全标），`Track` 契约补可选 `playCount`（镜像 /v2/music 联表）；连带把印章字形 樂(U+6A02)/墨(U+58A8) 补入 CJK 子集——五印（樂/愛/念/音/墨）全 webfont（此前 樂/墨 走系统回退，管线见 first-load-performance 卡）。传输钮层级「幽灵 + 唯一实心盘」且**桌面居中**（修复首轮左聚失衡）——上/下一曲去常驻描边（hover 主色 8% 纸面晕），播放钮 64px 主色盘 + `::after` 内缩碟面标签环（静态不旋转——面板内的旋转语言统一归封面黑胶碟，20261002 碟化定稿后碟随播放转、播放钮环仍静态，职责分离）；播放模式为下划线文字带（纯文字去图标，active 主色 + 2px 下划标，复用页缘钮/年谱刻度带选中语言），与音量合成一行 `space-between`（移动端音量隐藏、模式居中）；**激活态必须行内自定义属性驱动**（20260930 二次修复起：静态规则消费 `var(--mode-line/--mode-ink/--tick-*)`，JSX 激活时经 `style` 挂载、值引 `var(--primary-color)`，aria-pressed/aria-current 语义保留但不参与样式）——选择器驱动的激活态在这张生产行为表上两连败：① transient 动态类有**规则删除竞态**（v6 按使用计数清理，激活变体规则被整条移除，v1.4.36–38 实测）；② `&[aria-pressed]` 属性选择器又遇 **React 属性翻转后失效失灵**（v1.4.41 生产实测：规则恒在、matches() 命中但计算样式不跟随，手动摘戴属性才恢复；页头导航 aria-current 不受影响、dev 不复现）——内联样式变更是引擎保证失效的唯一纯 CSS 令牌通路。`LyricLine`/`QueueItem` 等动态类组件后续触碰应一并转行内自定义属性驱动；CloseButton 常驻描边改透明、hover 显形（位置尺寸与焦点管理不动）。**弹层滚动锁**（2026-09-30 起）：面板打开期间 body 按 Dialog `lockScroll` 配方锁定（`overflow hidden + position fixed + top=-scrollY 补偿 + width 100%`，iOS 触屏同锁），关闭原样还原并 `scrollTo` 回补滚动位置——`aria-modal` 弹层必须配滚动锁，否则背景页可滚。

**播放列表翻页屏**（20261001 起，**替代右滑纸卡抽屉**）：桌面/平板队列以右边框为翻页轴常驻右缘——静止斜倚 `rotateY(-40deg)`（半透明 0.45 可读、`pointer-events: none` 不可点、定宽 340px 布局零位移），鼠标移入右缘热区沿轴**翻页转正**至 0°（实墨 1、浮起投影 `−24px 12px 48px`、可点选），移出 160ms 宽限后原路翻回；转正曲线 `--motion-ease-in-out-soft` 520ms。**三条铁律**：① 静止姿态 = 动画起点（两端角度一致，第一帧零跳变；起势角与静止角分离必产生闪跳）；② 透视只作用于直接子级——`perspective:1400px` 挂 Panel 后，热区隔层必须 `transform-style: preserve-3d` 透传，漏配 = 3D 静默退化为平面缩放（无报错，只能靠帧采样或目检发现）；③ transition 简写引用的 `--motion-*` 令牌必须在站点注入的五令牌名单内（ease-out-soft/ease-in-out-soft/dur-quick/dur-reveal/dur-write）——引用未定义令牌 = 声明 invalid at computed-value time 整条回退 `all 0s`，动画静默消失（帧采样实证：转角第 9ms 即跳终值）。hover 进出场由纯 CSS `:hover`/`:focus-within` 引擎驱动（非 React 态翻转）；转正挂点用静态 `data-fold-screen` 属性（跨组件插值选择器禁用）；pinned（列表钮 `aria-expanded`）仍走 queueOpen 行内样式驱动；hover 门控 `@media (hover: hover) and (pointer: fine)`，触屏/平板走按钮 pinned 等价路径；dock/TopTools/CloseButton 升 `z-index: 9`（z8 热区之上，hover 不得劫持音量/詞/列表/关闭）。行 hover 整行左引 4px + 序号翻朱砂播放键（/music 目次行既有语言），当前项底/标转行内自定义属性 `--q-active` 驱动（$active 动态类退役）。遮罩仅 pinned 态呈现；Esc 分层不变（屏=抽屉层）。**粘性开合**（20261002 hotfix）：进入右缘热区即锁存 `foldLatch`「开」，指针在面板内漫游（列表末行移出/dock/舞台边缘）不收拢，**离开面板**（Panel pointerleave）才折回；`foldOpen = queueOpen || foldLatch` 走行内样式驱动，CSS `:hover` 保留作零延迟开启；面板关闭时 latch 复位。两点选曲后指针在屏上则保持展开，离场即收拢。**碟面环包含块**（20261002 hotfix）：`perspective ≠ none` 的面板会成为 absolute 后代的包含块——播放盘 `::after` 碟面环（absolute inset）因 PlayButton 缺 `position: relative`，包含块落到 NowDock，白环画成横贯 dock 的 1138×116 巨椭圆（无报错，v1.4.54 生产实证）；凡在 perspective/transform/filter 面板内用 absolute 伪元素贴元素装饰，宿主必须自带 `position: relative`，守卫已钉。

**失效探测**：`music-token-watch` workflow 每日北京时间 10:00（cron `0 2 * * *`）SSH 到部署主机探测 `GET /v2/music/user-playlists`。双通道判定：HTTP 200 + 空列表 = 登录态失效 → 自动开/保持 `music-token` 标签报警 issue（恢复后自动关闭，issue 即状态机），run 同时失败触发邮件；SSH/网络/上游 5xx = 传输层故障 → 只让 run 失败，**不修改**报警 issue（避免服务抖动误报 token 失效）。`workflow_dispatch` 支持 `force_fail` 演练告警分支。判定前提：账号存在名字含「年度」的创建歌单。

**匿名态能力边界**（未配置 `MUSIC_U`）：榜单/新歌类歌单可完整播放（实测热歌榜 200 首在 exhigh/standard/lossless 三档均 200/200 返回地址，320k 70 首、128k 130 首属匿名降级而非失败）；**VIP 与版权受限曲目返回 `url: null` + `code 404` + `cannotListenReason`**（如周杰伦《晴天》id `186016`），匿名搜不到原版（只出翻唱/纯音乐）；部分曲目匿名态只给 30 秒试听片（播放地址的 `time` 字段即真实流时长，与歌单元数据 `dt` 不一致属上游行为）。

**登录态**：单份 `MUSIC_U` 经 env 注入（`NETEASE_MUSIC_U`，可填裸 token 或整串 cookie），服务端只读、只用于上游请求，**不得出现在日志、报错或客户端响应中**（适配层做 `MUSIC_U=***` 脱敏）。库的匿名 device cookie 会自动落在 `os.tmpdir()/anonymous_token`，无需人工维护。

**播放地址处理（必须遵守）**：网易云返回的播放地址与封面都是 `http://...music.126.net/...`，站点是 https，**必须在适配层改写成 https**，否则浏览器按混合内容拦截（实测同 URL 换 https 音频 206、封面 200 均可用）；播放地址有效期约 20 分钟（`expi: 1200`），只能按需获取、**禁止长缓存**；歌单元数据可缓存（站点页 `revalidate: 600`）。

**播放器降级语义**（`packages/components/audio-player`）：曲目拿不到播放地址或音频元素报错时，**按队列顺序自动跳过，整轮尝试不超过队列长度**，提示 `已跳过 N 首不可播放的曲目` 占用迷你播放器的歌手行（卡片高度不变，`role='status'`）；该提示**只在用户操作播放器时清空**（自动起播不擦除，否则用户看不到）；整轮都不可播则回落 `idle` 并置 `这个歌单暂时没有可播放的曲目`。组件公开 API（`TrackSource`/`TrackResolver`/`AudioPlayerActions`/`AudioPlayerState`）保持不变。

**收起态声源指示**（20260929 起）：迷你播放器收起后不再是无声源线索的死 UI——桌面书耳播放中把展开箭头换装成展开卡同款三根墨柱等化器（复用 `equalize`，暂停/空闲回 `IconChevronRight`），移动端「音」印章播放中外圈泛朱砂涟漪环（`::after` + `ripple` keyframes 2.2s 循环，暂停 `animation: none`）；两者 `prefers-reduced-motion` 下静止，可访问名保持「展开播放器」。陷阱：styled-components 的 keyframes 插值进 props 三元字符串必须用 `css` 帮助函数包裹，裸模板串会在运行时抛 `interpolating a keyframe declaration into an untagged string` 把整页打崩（dev 实测踩坑，源码守卫已固化 `? css` 写法）。

## 执行约束

- 新增音乐能力一律进 `apps/server/src/modules/music`，不在 Next 侧新建 route handler；站点与页面消费 `/api/music/*` 或 `API_BASE + /music/*`。
- 凭证只经 `MusicConfig` 读取并只发往上游；日志/异常/响应中不得出现 cookie 原文。
- 适配层必须保留超时（8s）、上游非 2xx → 502、库不可用/超时 → 503 的失败映射，以及 `http → https` 改写。
- 播放地址不得进入缓存层；只有歌单/搜索这类元数据可以缓存。
- 不可播是**正常业务态**（不是错误）：消费方必须按空 `streamUrl` 跳过，禁止把播放停在错误态。
- 年度歌单的筛选与排序语义只在服务端 `getUserPlaylists` 持有；消费方对空列表与失败一律隐藏入口并回落 env 兜底歌单，禁止把「拉不到年度歌单」渲染成错误页。
- 守卫语义化纪律（两连生产实锤，#450 定稿）：换算口径守卫只镜像公式曾放行 #435（progressPct 二次 ×100）；引用存在性守卫只断言用法、不断言 import，曾放行 #449 的 MiniPlayer 漏引 `MARQUEE_SPEED_PX_PER_S`（TS2304 → 生产 ReferenceError）。类型类约束一律并入 audio-player 域 `tsconfig.guard.json + typecheck.test.mjs` 守卫（域内 tsc 错误清零断言，域外存量错误不扩大打击面），不再以源码正则新守卫承担类型语义。跑马灯量尺 `useMarqueeOverflow` 为泛型挂载点（`<T extends HTMLElement>`），span/h2/h3 皆可挂。
- 舞台预算三档制（20261001 精修定稿）：面板高 = `100vh − 96px`（inset 48px），装裱封面是舞台预算**唯一因变量**——帽与面板高度同源且按**视口高度**分档（常态 `min(252px, (100vh−96)×0.3)` / max-height<960 → 224 / <860 → `min(184px, ×0.26)`），分档特征是高度不是宽度；题名/歌手行 `flex-shrink: 0` 空间承诺（舞台再穷不可挤压）；max-height<860 题跋非当前句 `display: none` 让位（静态 media query，不涉态驱动禁令）。style.test 舞台预算守卫四断言钉死（同源帽/分档常量/空间承诺/题跋缓冲），旧裸 `32vh` 帽禁入。
- 队列翻页屏守卫（20261001 定稿）：preserve-3d 透传在场、`FOLD_REST_ANGLE='-40deg'`/`FOLD_WIDTH_PX=340` 常量钉死、离场 160ms 宽限在场、`(hover:hover) and (pointer:fine)` 门控在场、dock/工具组 `z-index: 9` ≥3 处；motion 令牌引用完整性断言（引用 ∉ 站点注入五令牌 = 红）——两条静默失效（3D 退化平面、transition 回退 0s）都无报错，只能靠守卫拦。
- 墨痕五列两翼守卫（20261002 定稿）：GhostLine transform 内 `perspective(1000px)` 投影函数在场、GhostLayer 禁 `transform-style: preserve-3d`（overflow: hidden 属 grouping 属性会使其静默失效——铁律②变体，原型帧实测 translateZ 全程压扁）、`GHOST_STATIONS` 五站锚点/`GHOST_LIFT=150px` 常量钉死、换句 key 按「站+句索引」重挂载断言、reduced-motion 局部降级在场。
- 封面碟化守卫（20261002 定稿）：碟面 `border-radius: 50%` + `repeating-radial-gradient` 纹刻在场、碟心圆标/轴点结构在场、`discSpin` 动画与 `animation-play-state` 由 `$playing` 驱动断言（播放随转/暂停冻结，冻结即不复位）、reduced-motion 降级在场；碟径沿用舞台预算三档帽（唯一因变量关系不破坏），移动册页 `LeafPlateArt` 自持方形、禁继承桌面碟形态。

## 适用边界

适用于站点 web 播放器与 `/music` 页。`apps/desktop` 是独立子仓库，可复用 `/v2/music/*` 契约，但不消费站点组件库（桌面 UI 自持、颜色只走主题变量）——桌面端实现属其仓库内的独立变更。上游库因版权法务通知已下架 GitHub 仓库（npm 侧仍在发版），自建只解决服务可用性，不改变曲目版权属性；对外公开分发场景不在本卡片覆盖范围内。

## 验证方式

`apps/server`：`npx jest src/modules/music`（归一化、`url=null`、`http→https`、超时与库失败映射、凭证脱敏、匿名/带 cookie 两条路径）。站点：`node --test apps/site/test/music-player-wiring.test.mjs` 与 `node --test packages/components/audio-player/provider.test.mjs`。接口实测：`curl localhost:3200/v2/music/playlist` 返回 tracks，`curl "localhost:3200/v2/music/track?id=186016"` 返回 `streamUrl: null`（匿名态），任一返回的播放地址 `https` 可直接 206。

## 关联知识

- [components](./components.md)
- [design system](./design-system.md)
- [build config](./build-config.md)
