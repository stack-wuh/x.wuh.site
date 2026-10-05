---
title: 组件包
domain: components
keywords: [组件库, Image组件, ImagePreview, exports map, 语义角色, 图片角色, Divider, 分割线]
scope:
  - packages/components
  - packages/hooks
status: active
source:
  - changes/archive/2026-07-12-P-component-standardization/brief.md
  - changes/archive/2026-07-25-P-semantic-image-roles/brief.md
  - changes/archive/20260524_P_image_preview_optimize/brief.md
  - changes/20260829-feature-guestbook-letter-style/brief.md
  - changes/20260902-style-post-detail-polish/brief.md
  - changes/20260903-style-post-toc-mobile-polish/brief.md
  - changes/20260928-feature-music-player/brief.md
  - changes/20260928-style-player-responsive-redesign/brief.md
  - changes/20260929-style-player-collapse-ear/brief.md
  - changes/20260930-feature-progress-component/brief.md
  - changes/20261005-refactor-player-split/brief.md
verified: 2026-10-05
verified-depth: runtime
verified-scope: AudioPlayer 书耳收起交互——四主题（wine/plain × light/dark）展开/收起双态截图、耳页接缝特写、往返点击与 `matches(':hover')` 计算样式（观察点见 change 交付记录）；20260930-feature-progress-component：Progress 守卫 7/7 + audio-player 全门禁 36/36 + tsc/oxlint 干净 + 四主题试墨截图（wine/plain × light/dark 全态）+ 交互链路原生步进 47→55（填充 matrix 与印面 left 同步跟随）+ a11y 快照（slider×2 / progressbar）+ MiniPlayer sm 上屏实证；20261005-refactor-player-split（拆分段落，unit 深度）：域守卫逐文件全绿 provider 6/6 + style 19/19 + player-panel 22/22 + mini-player 8/8 + typecheck 1/1 + 站点 wiring 10/10 + 根 tsc exit 0 + oxlint 25 文件 0/0 + `next build` exit 0（14/14 页）；行为零变化三重证据=声明普查 100+35 条无丢失无重复 / JSX 元素多重集与拆分前一致（唯一差异为 QueueRows 两处队列行去重，属预期）/ indexOf 锚点切片语义经 panel-sources 拼接保持；runtime 目检按惯例移至部署后生产复验；其余段落沿承各自变更时的既有验证。
---

# 组件包

## 当前结论

组件包通过 `exports` map 导出，消费者使用 `@wuh.site/components/<name>` 直接映射到子路径，无需桶文件。

Image 组件支持语义角色（`avatar`、`book-cover`、`content`、`cover`、`thumbnail`、`logo`、`qr`），每个角色自动应用对应的 Wrapper 圆角、背景、边框、裁切、Skeleton 和 fallback 样式。图片外轮廓由 Wrapper 单点负责，Skeleton 和 fallback 继承相同外轮廓。消费者可通过 `imageClassName` 或 `imageStyle` 对内部图片应用专用样式。未传 `role` 时保持向后兼容，开发环境输出迁移提示，生产环境不输出。

ImagePreview 图片切换有过渡动画（淡入淡出 + 方向滑动），缩放和旋转使用 spring 弹性动画。组件按 types、hooks、Toolbar、MoreMenu、ThumbnailRail 拆分独立文件，主组件不超过 500 行。

ScrollArea 为 shadcn ScrollArea 移植（`@radix-ui/react-scroll-area` 封装），滚动条独立 DOM 渲染、hover 浮现、不虚拟化；`viewportRef` prop 供消费方监听滚动与程序化滚动。MessageCard 组件集（message-card 包）为信笺风留言卡片：MessageCard / MessageAvatar / MessageMeta / MessageName / MessageTime / MessageStatus / MessageContent，只负责视觉（长什么样），布局（怎么摆）由消费方组合。

Divider 组件（`@wuh.site/components/divider`）负责页面结构性分割线，用色分工：variant `hairline`（默认，灰发丝线 `color-mix(in oklab, var(--normal-400) 55%, transparent)`，承载结构性分段）/ `ornament`（中置朱砂点缀线——两侧线由 transparent 渐入 `var(--primary-color)` 45%、右线镜像，点缀字符同 `--primary-color`，children 可替换），渲染为 `role='separator'`；颜色仅语义 token、禁用 `prefers-color-scheme`，暗色随站点 `data-color-scheme` 自动生效。正文章节记号、列表条目分隔线等排版语言不使用 Divider。

Progress 组件（`@wuh.site/components/progress`，20260930-feature-progress-component 起）是纸墨「运笔」双模态进度条：发丝轨道（Divider 同款 color-mix；md 3px / sm 2px 档）+ 朱砂 `scaleX` 自左铺墨（导航下划线同款笔顺，合成器动画不触布局属性）。传 `onChange` 即交互态——原生 range 透明覆盖整条（拖拽/键盘/读屏零降级，GrooveSlider 同技术），缺 `value` 进不确定态（两端渐隐墨迹行笔 1.9s：72% 行笔 + 空轨半拍）。印光标 = 白文方印「樂」（15×15 实心印面 radius 3px + 纸色阴文衬线，字面比 10/15 与 Header「墨」印同比例），悬停 `scale(1.12)` + 主色软晕、拖拽按印入泥（brightness 0.92）。**态语义形动正交**：`glyph="愛"` = 最爱（形）、`breathing={playing}` = 播放态微光呼吸晕（2.4s，reduced-motion 静态晕）——组件不含「最爱/播放」领域知识，两信号由消费方组合。客制化经 `--progress-thumb-size/-thumb-color/-thumb-glyph-size`、`--progress-height/-fill-color`；`glyph=""` 落无字阴线框回退；`showLabel` 为 mono 淡墨百分比。纪律由同目录 index.test.mjs 守卫固化：禁裸十六进制、keyframes 必须 `css` 包裹（MiniPlayer 涟漪崩溃陷阱同源）、reduced-motion 块在场、aria 在场、禁 `--motion-*` 与滚动监听。印面 hover/按压经 SBar 静态类 `.wuh-progress-thumb` 下探（跨组件插值选择器 SSR 不可靠同规避）。MiniPlayer 底行已接入 `size="sm"` 读态；PlayerPanel 进度/音量替换等 dock-ruler 系落地后另起 change。

AudioPlayer（`@wuh.site/components/audio-player`）的降级语义：曲目拿不到播放地址（`TrackResolver` 返回空 `streamUrl`）或音频元素报错时**按队列顺序自动跳过**，整轮尝试不超过队列长度，提示 `已跳过 N 首不可播放的曲目` 占用迷你播放器歌手行（`role='status'`，卡片高度不变），且**只在用户操作播放器时清空**（自动起播不擦除）；整轮不可播则回落 `idle` 并给出结论文案。公开 API（`TrackSource`/`TrackResolver`/`AudioPlayerActions`/`AudioPlayerState`）保持兼容，跳过语义不新增 action。

AudioPlayer 响应式与视觉（20260928-style-player-responsive-redesign 起）：全组件纸墨语言——颜色只走主题 token、断点只用 `BREAKPOINTS`、图标用 `@wuh.site/components/icons` 播放族具名导出（禁裸字符与散落 SVG）。MiniPlayer 桌面为纸卡 dock + 右缘书耳（20260929-style-player-collapse-ear 起：展开耳必须是 MiniCard **子元素**——absolute 右缘垂直居中 24×44、三边发丝线、左边借卡片边框并以不透明纸面盖住身后段，命中区经 `::before` 外扩；收起耳为屏幕左缘 fixed 小耳 28×48、与展开耳同一水平线；独立 fixed 元素靠坐标拼合必然产生「两张纸」拼贴缝，禁止回退）、移动端为全宽底栏（`safe-area-inset-bottom`、触摸目标 ≥44px），收起态桌面为左缘小耳、移动端为朱砂「音」印章钮，开合只做 opacity/transform/visibility 过渡；PlayerPanel 桌面形态（20260928 三栏纸卡弹层起，20261001 起**留白独奏**居中单焦点舞台替代——见 music-player.md 播放面板桌面形态段：晕染配方/词卷/抽屉/音量 popover/墨痕歌词/单行钮群）、移动端为全屏沉浸册页（词页/目次横翻），面板 z 层（backdrop 2600 / panel 2610）必须高于迷你条（2500）；面板背景为封面晕染纸底（blur 64 色场 + 纸色罩 72%，20260929 起，原图水印层已退役），无封面回退素纸；Escape 关闭、焦点移入/移回、`prefers-reduced-motion` 降级、`role='dialog'` + `aria-modal`；显隐态组件（词卷开关/抽屉/遮罩）与选中态一律行内样式/行内自定义属性驱动（选择器与动态类驱动在生产行为表上两连败，禁入）。以上纪律由同目录 `style.test.mjs` 门禁固化：禁裸十六进制色、禁裸断点数值、禁 `--text-secondary`、transition 禁布局属性、断言 aria-label / `prefers-reduced-motion` / `role='status'` / Escape / safe-area / 跑马灯同源 / 模式钮 icon-only / popover aria / 墨痕 aria-hidden / 显隐行内样式在场——改播放器样式先保此测试绿。

**AudioPlayer 文件布局（20261005 拆分定稿，行为零变化纯结构拆分）**：对标 ImagePreview 先例「主组件 ≤500 行」——PlayerPanel.tsx 2089→467 行（只留 refs/state/effects/Escape 分层/滚动锁/词卷跟随 + JSX 骨架），MiniPlayer.tsx 634→178 行。面板样式按区块拆至 `panel/styles/`（tokens/shell/ghost/stage/dock/words/queue/mobile 八模块，模块间依赖单向：区块 → tokens），MiniPlayer 样式至 `mini/styles.tsx`；三个自包含叶子组件 `panel/PanelVolume`（音量 popover 开合/拖拽/键盘内聚，volOpen 态仍由面板持有）、`panel/PanelQueue`（遮罩 + 翻页屏，含共用 `QueueRows`）、`panel/PanelMobile`（册页态 mobilePage/拖拽手势/词窗跟随内聚；dragY 面板壳位移态留主文件经 props 接线）。守卫读取纪律：面板源码经 `panel-sources.mjs` 的 `PANEL_SOURCES` **规范顺序**（tokens→…→mobile→PlayerPanel→PanelVolume→PanelQueue→PanelMobile）拼接读取，既有 indexOf 声明名切片语义不变——清单顺序 = 原单文件声明顺序，由「拆分纪律」守卫钉死禁重排；禁裸 hex/断点/令牌完整性等全文件断言升级为逐文件遍历。**拆分铁律**：叶子组件 props 沿用原标识符名（volOpen/queueOpen/foldLatch 等），行为不变重构的 effect 依赖数组必须与原形同构（传稳定 setState 而非每次 render 新箭头）；跨列表/跨区块的程序化定位 effect 可按可见性拆分到各自组件（依赖收窄到自身可见列表等价）。

## 执行约束

- 消费者使用 `@wuh.site/components/<name>` 子路径；Image 外轮廓由 Wrapper 单点负责，预览组件保持职责拆分。
- audio-player 主组件文件（PlayerPanel/MiniPlayer）≤500 行由守卫钉死；触碰面板源码守卫测试须按 `panel-sources.mjs` 规范顺序读取（清单重排 = 锚点失效 = 红）。

## 适用边界

具体业务页面的组合和文案不属于组件包约束。

## 验证方式

检查 `packages/components/package.json` exports、Image role 实现和 ImagePreview 文件边界，并搜索消费者的 `/index` 导入。

## 关联知识

- [icon system](./icon-system.md)
- [pagination](./pagination.md)
- [design system](./design-system.md)
