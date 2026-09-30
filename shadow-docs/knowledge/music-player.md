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
verified: 2026-09-30
verified-depth: runtime
verified-scope: 服务端 jest 35/35（登录态边界、creator+年度过滤、年份倒序、502/503 映射、听歌排行联表与降级、profile 暴露、user_record 入参 uid 断言）；生产实测 /v2/music/user-playlists 返回 8 张年度歌单（2018-2025 年份倒序）；上游干跑 user_record{uid:398326271,type:0} 匿名 200 + allData 100 条（uid 误传 id 为 502）；站点侧 wiring 7/7、oxlint 0/0、实现截图（桌面夜/移动 500px）与认可原型构图比对一致；20260929-feature-music-skeleton：骨架 runtime 验证（tsc/build/oxlint 干净、wiring 10/10、骨架壳 HTML 增量 +29.5KB 实测、四主题×桌面/移动驻留截图与换容目检）。失效探测：workflow YAML 结构解析、5 个 step 脚本 bash -n、判定逻辑对生产端点干跑（200+healthy；空/非空边界样例）通过；dispatch 正负路径实测见 changes/archive/20260929-build-music-token-watch 交付记录。20260930-style-player-panel-deck：控制甲板 runtime 验证（node --test 29/29 含新增 gutter/凹槽/幽灵钮/模式带守卫、根 tsc 与 oxlint 干净、素雅/酒红 × 明暗四主题桌面 1280 + 矮视口 1366×768 + 移动 390 截图目检、播放态进度推进、模式带切换、focus-visible 走查）。20260929-style-music-interaction-polish：收起态声源指示与身份栏移除验证（audio-player 守卫 33/33、根 tsc 净、oxlint 0/0；dev 实测桌面/移动页头无身份栏 DOM+截图、收起耳暂停态=箭头、印章暂停态涟漪 animationName=none；播放态换装目测因自动化输入管线失效未做，守卫覆盖三元结构，keyframes 裸串插值崩溃已实测复现并修复为 css`` 包裹）。20260930-style-player-mobile-album-leaf：移动端册页 runtime 验证（node --test 40/40 含 5 条册页守卫、根 tsc/oxlint 净、wine/plain × 明暗四主题词页+目次页 390 截图与认可原型 A 构图比对一致、词未录空态与桌面回归截图、歌词点按跳播 10.6s→62.6s 实测、页缘钮翻页 aria-current 联动、合成 Touch 下拉关闭阈值生效；scrollIntoView 横向外滚缺陷实测复现并修复为手动 scrollTop）。20260930-feature-player-dock-progress-seal：面板替换 runtime 验证（progress 守卫 9/9 含触屏 44px 命中与 NaN 钳制、audio-player 全门禁 35/35、tsc/oxlint 干净、四主题面板截图、音量端到端 80→85（fill matrix 与印位 102px 同步）、播放态呼吸实播实证（thumb breathe 动画 2.4s 挂载）、空队列 0/0 边界复验 seek=0 印归零位）。20260930-fix-mode-band-underline-inversion：模式带反转修复 runtime 验证（node --test 36/36、根 tsc/oxlint 净；生产取证点击后 0.5–1s 激活变体规则从 cssRules 消失、约 1s 随下一次 styled 插入自愈；dev 实测三钮共享同一静态类 + `[aria-pressed="true"]` 属性规则恒在（CSSOM 规范化双引号，探针须双引号匹配）、各采样点计算样式正确、选中态视觉留档）。20260930-fix-player-active-state-recalc：选中态行内自定义属性驱动 runtime 验证（node --test 40/40 含免疫断言、tsc/oxlint 净；v1.4.42 生产复验通过——模式带三向切换 aria/行内变量/计算样式全一致（v1.4.41 同探针失败的路径），页缘钮稳态 4/4 翻转全对，display:none→flex 后首击背景色一次性迟滞自愈已记录）。20260930-fix-panel-progress-double-scale：双重百分比换算定位与修复 runtime 验证（生产基线四点采样——真实进度 0%/71%/90%/51% 下 range 仅输出 0 或 100、seek 50% 时间码跳 01:43 证 onChange 方向健康；修复后 node --test 48/48、根 tsc 净；dev 全栈实播因本机无 MongoDB/Docker 不可用，实播终验移至部署后生产复验——v1.4.43 部署（switch-traffic 全绿）后生产实测通过：range 随播放逐格推进（00:05→3、00:11→6，与 208s 时长换算一致）、seek 50 时间码跳 01:45、印光标中心实测 53.6% 条宽处；空态文案生产实测渲染「全体欣赏音乐」）。
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

**播放面板视觉语义**（2026-09-29 起，「封面晕染纸底」定稿，替代 #402 的原图 1:1 铺 + 渐变罩——旧法照片结构完整可辨、歌词列压脸，对比度失败）：面板背景是**五层配方**——① 封面图 `blur(64px) saturate(0.92)`，亮色 `brightness(1.18)`/暗色 `0.62`（照片失去轮廓退化成色场）→ ② 纸色罩 `color-mix(var(--background-100) 72%, transparent)` 全幅压平 → ③ feTurbulence 纸纹 `multiply 6%`（暗色 `soft-light 9%`）经 Panel::after 叠印 → ④ 歌词/列表栏局部纸罩 40%→26% 纵向渐变 → ⑤ 颜色只经主题变量。左栏拆 `NowHeader`（装裱封面+题名）与 `NowDock`（进度+控制+模式+音量）两个 grid 区：桌面 `grid-template-areas 'now lyrics queue' / 'dock lyrics queue'`（dock 锚面板底边），移动端 **20260930 册页起**为 `'pages' 'ticks' 'dock'` 三行：词页=装裱图版主角（纸框发丝线 + 纸边 + 图版内发丝线，mono 朱砂题签「曲 · N / 总数」）+ 两行居中衬线题名（去 ellipsis）+ 短词窗（mask 上下渐隐、当前句加重、点按行 `seek(line.time)` 跳播）；目次为横翻对页（scroll-snap 容器），页缘 ticks 即两个翻页钮（`aria-current` 联动，swipe 之外保键盘/读屏路径，非激活页 `inert`）；grab 下滑关闭手柄 + 图版同作拖拽面（阈值 96px 过即 `togglePanel`，不足回弹）；无词曲目词窗渲染「全体欣赏音乐」印章空态（朱砂 45% 印框）替代死黑；甲板（度曲尺/传输/模式带）两轮定稿不随动。**陷阱：外层 snap 页内的移动容器定位禁用 `scrollIntoView`**——它会连横向一起滚、把面板带去另一页且页缘钮失同步（实测复现），改手动垂直 `scrollTop`（offsetParent 需 `position: relative`）；IAB 自动化环境对程序化滚动抑制 scroll 事件，onScroll 同步链路只能靠源码守卫固化。歌词是签名元素：当前句 serif `--font-size-lg` 实墨 + 3px 朱砂侧标 + `writeIn` 书写显现（audio-player 本地 keyframes），相邻句淡墨其余隐墨；「墨随声走」墨晕（朱砂 9% + 墨 6%，blur 10px）经读取当前句 `offsetTop` 设 transform 跟随（禁 scroll/resize 监听）。播放列表 01–10 序号（mono 淡墨）+ 当前项朱砂左标（非粉底 pill）；栏间通高发丝线、眉标短朱砂 tick。**控制甲板**（2026-09-30 起，补齐 #415 未落地的家具——晕染只铺了纸底，桌面左栏 gutter 缺失、滑杆是原生 `accent-color` 默认形态）：桌面 `NowHeader` padding `xl 0 0 xl`、`NowDock` `0 lg xl xl`（封面装裱 inset、进度/甲板离开面板圆角与列罩边界，矮视口封面收缩档随之 230→220px）；音量条为共享 `Progress` 交互态 120px 原位（20260930-feature-player-dock-progress-seal 起，凹槽私有实现退役——凹槽几何与印光标内聚在组件内）。**进度=白文方印「樂」**（同 change 起，度曲尺两轮服役后退役、用户拍板进度语言统一到共享组件）：`Progress` 交互态 `value={progressPct}` 直传（**progressPct 已是 0–100 百分数，禁二次 ×100**——`value={progressPct*100}` 灌 0–10000 被钳 100、印光标钉死末端刻度，#435 生产实锤：真实进度 0/71/90/51% 下 range 只输出 0 或 100）/ `onChange={(pct)=>seek((pct/100)*totalDuration)}`（onChange 收 0–100 再除回秒，seek 方向生产实测健康）、`breathing={playing}` 播放态微光呼吸晕接真实播放、印光标悬停微浮/拖拽按印入泥；`TimeCode` 两端保留（布局行沿用）；触控档由组件侧 `pointer: coarse` 命中区 44px 承接；**消费方换算必须防 0/0**——`totalDuration=0` 时 `progressPct` 为 NaN，Progress 组件内 `Number.isFinite` 钳 0（NaN 会灌穿受控 range）；**换算口径类守卫要断言语义、不能只镜像实现**——守卫把错误公式一并钉死后门禁全绿照样放行回归（#435 教训）。传输钮层级「幽灵 + 唯一实心盘」且**桌面居中**（修复首轮左聚失衡）——上/下一曲去常驻描边（hover 主色 8% 纸面晕），播放钮 64px 主色盘 + `::after` 内缩碟面标签环（静态，不旋转——音乐页已有大碟心旋转语言，面板内再转重复且抢歌词签名）；播放模式为下划线文字带（纯文字去图标，active 主色 + 2px 下划标，复用页缘钮/年谱刻度带选中语言），与音量合成一行 `space-between`（移动端音量隐藏、模式居中）；**激活态必须行内自定义属性驱动**（20260930 二次修复起：静态规则消费 `var(--mode-line/--mode-ink/--tick-*)`，JSX 激活时经 `style` 挂载、值引 `var(--primary-color)`，aria-pressed/aria-current 语义保留但不参与样式）——选择器驱动的激活态在这张生产行为表上两连败：① transient 动态类有**规则删除竞态**（v6 按使用计数清理，激活变体规则被整条移除，v1.4.36–38 实测）；② `&[aria-pressed]` 属性选择器又遇 **React 属性翻转后失效失灵**（v1.4.41 生产实测：规则恒在、matches() 命中但计算样式不跟随，手动摘戴属性才恢复；页头导航 aria-current 不受影响、dev 不复现）——内联样式变更是引擎保证失效的唯一纯 CSS 令牌通路。`LyricLine`/`QueueItem` 等动态类组件后续触碰应一并转行内自定义属性驱动；CloseButton 常驻描边改透明、hover 显形（位置尺寸与焦点管理不动）。**弹层滚动锁**（2026-09-30 起）：面板打开期间 body 按 Dialog `lockScroll` 配方锁定（`overflow hidden + position fixed + top=-scrollY 补偿 + width 100%`，iOS 触屏同锁），关闭原样还原并 `scrollTo` 回补滚动位置——`aria-modal` 弹层必须配滚动锁，否则背景页可滚。

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

## 适用边界

适用于站点 web 播放器与 `/music` 页。`apps/desktop` 是独立子仓库，可复用 `/v2/music/*` 契约，但不消费站点组件库（桌面 UI 自持、颜色只走主题变量）——桌面端实现属其仓库内的独立变更。上游库因版权法务通知已下架 GitHub 仓库（npm 侧仍在发版），自建只解决服务可用性，不改变曲目版权属性；对外公开分发场景不在本卡片覆盖范围内。

## 验证方式

`apps/server`：`npx jest src/modules/music`（归一化、`url=null`、`http→https`、超时与库失败映射、凭证脱敏、匿名/带 cookie 两条路径）。站点：`node --test apps/site/test/music-player-wiring.test.mjs` 与 `node --test packages/components/audio-player/provider.test.mjs`。接口实测：`curl localhost:3200/v2/music/playlist` 返回 tracks，`curl "localhost:3200/v2/music/track?id=186016"` 返回 `streamUrl: null`（匿名态），任一返回的播放地址 `https` 可直接 206。

## 关联知识

- [components](./components.md)
- [design system](./design-system.md)
- [build config](./build-config.md)
