---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-style-player-panel-deck",
  "type": "style",
  "scope": "packages/components/audio-player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260930-style-player-panel-deck",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 417,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/417",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "0d2fb8539808872dfaccf851e36ab51fbca834a5",
    "verifiedAt": "2026-09-29T17:21:38.628Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:417",
    "planHash": "75ed4cf99a9f31389fd5e9b70a4a34c6e0249c55ce6c8c94c0e0d192a2ec44bf",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 播放面板「控制甲板」重设计——边距栅格与传输控件语言",
      "titleRaw": "[style] 播放面板「控制甲板」重设计——边距栅格与传输控件语言",
      "supplement": "完整 brief：shadow-docs/changes/20260930-style-player-panel-deck/brief.md",
      "body": "## 动机\n晕染纸底（#415）上线后用户实测截图圈出两类问题，代码定位均属实：\n\n1. **边距没了**：桌面端 `NowHeader`/`NowDock` 只写了移动端 padding，桌面栅格 gutter 整体缺失——封面 `CoverHero` 直怼面板左上圆角（被 `overflow: hidden` 裁切观感），进度条从面板边缘顶到边，时间码贴边；而歌词列（`padding: 0 2xl 0 lg`）与列表列（`0 lg`）有 gutter，三栏只有左栏「裸奔」。\n2. **控件是默认形态**：进度条与音量条是只加了 `accent-color` 的原生 `<input type=\"range\">`（白色系统轨道 + 系统滑块）；播放模式是三枚描边 pill（icon 13px + 文字），与面板纸墨语言和站点既有的「下划线标记」语言（MobileTab、年谱刻度带）双重脱节；传输钮三枚描边圆 + 一枚实心盘，四环并列层级不清。\n\n纸底已铺，家具未进场。本变更补齐面板的控制甲板：栅格 gutter + 控件设计语言。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 面板为晕染纸底五层配方 + 歌词签名（writeIn/朱砂侧标/墨随声走）+ dock grid-areas 结构；接口契约与降级语义不在样式层\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只经语义 token；淡化色统一 `color-mix(in oklab, var(--text-color) 72%, transparent)`；断点只用 `BREAKPOINTS` 语义常量；动态状态挂 transient prop 不用跨组件插值选择器；`font` 简写不得排在 `font-size` 之后\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: audio-player 站点专属例外（本地 keyframes + `--motion-*` 引用自持）；reduced-motion 必须降级；transition 禁布局属性（滑块缩放用 transform，不改 width/height）\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/icon-system.md\n  - 当前结论: 图标恒为 outline 线框，从 `@wuh.site/components/icons` 具名导出；模式带改纯文字后 `IconRepeat/IconRepeatOne/IconShuffle` 移除导入，其余图标不动\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/components.md\n  - 当前结论: 播放器纸墨语言纪律由 style 门禁固化：禁裸十六进制色、禁裸断点数值、transition 禁布局属性、aria-label / `prefers-reduced-motion` 在场\n  - 适用 scope: packages/components/audio-player\n- norms/ui-patterns.md\n  - 当前结论: 组件复用优先；暗色全覆盖；动效 150–300ms ease-out；必须响应 `prefers-reduced-motion`\n  - 适用 scope: 全量\n- norms/code-style.md\n  - 当前结论: 渐进式治理，只做与当前改动直接相关的事，不顺手扩大范围\n  - 适用 scope: 全量\n\n## 决策\n- **选型:** 方案 A「控制甲板」——五件事，全部走主题 token：\n  1. **栅格 gutter**：`NowHeader` 桌面 `padding: var(--space-xl) 0 0 var(--space-xl)`，`NowDock` 桌面 `padding: 0 var(--space-lg) var(--space-xl) var(--space-xl)`——左 gutter 与歌词列 `padding-left: lg` 同韵，右 gutter 让进度条离开列罩边界，底部 gutter 让甲板离开面板圆角；封面由此获得 #415 brief 许诺但未落地的「装裱」inset。`TrackHeading` margin-top lg→base（外距让位给 gutter）。\n  2. **凹槽滑杆**（签名元素）：`Slider` 重写为定制 range——`-webkit-appearance: none`，视觉轨道 4px 圆角发丝线（HAIRLINE），已播段主色填充（WebKit 经 transient `$fill` 驱动 `background-size`，Firefox 用 `::-moz-range-progress`）；滑块 12px 纸色圆点（`--background-100` + 发丝描边），hover/active `transform: scale(1.18)` + 主色软环（不改几何尺寸）；命中区维持 28px、coarse 指针 44px；进度与音量共用同一套凹槽几何，音量条限宽 120px。\n  3. **幽灵传输钮**：`SkipButton` 去常驻描边（border none、背景 none），hover 主色 8% 纸面 + 图标转主色（与 CloseButton hover 同语言）；`PlayButton` 60px 主色实心盘维持「唯一饱和元素」，新增 `::after` 内缩环（`inset: 9px`、发丝线、`color-mix(--background-100 35%)`）作碟面标签环——唱片语言点到即止，不旋转不发光。\n  4. **下划线模式带**：三枚 pill 换成一条文字带（顺序/单曲/随机，纯文字去图标，sans xs + letter-spacing），active = 主色 + 2px 下划标（复用 MobileTab/年谱刻度带语言），inactive = INK_MUTED，hover = 主色；`aria-pressed` 保留，与音量合成一行（`justify-content: space-between`）。\n  5. **CloseButton 减噪**：常驻描边改透明（`border: 1px solid transparent`，hover 显 HAIRLINE + 主色晕），位置尺寸不动。\n- **对比方案:**\n  - 方案 B「仅补边距」——否决：滑杆仍是浏览器默认形态，不命中「控件都需要设计」的诉求。\n  - 方案 C「仅重设计控件、不动栅格」——否决：封面仍怼面板圆角，边距问题才是截图第一痛点。\n  - 方案 D「播放钮做旋转黑胶碟」（封面做碟心 + 慢转）——否决：音乐页已有大碟心旋转语言，面板内再转一份重复且抢歌词签名；降级为静态碟面环。\n- **理由:** 全部要素都从既有语言里长出来：凹槽几何呼应唱片沟槽与纸面刻线，下划线标是站点已验证的选中态语言，幽灵钮/减噪关闭钮统一「纸面无描边、hover 显性」的层级策略——不引入新颜色、新字体、新断点；暗色经 token 自动跟随。矮视口 `max-height: 840px` 封面收缩档随 gutter 复核（gutter 占掉约 48px 纵向空间，必要时 230→220px）。\n- **边界:** 只动 `PlayerPanel.tsx` 样式层与 `player-panel.test.mjs` 门禁；不改 provider/specs/MiniPlayer/公开 API；移动端布局骨架（header/tabs/body/dock）不动，仅继承凹槽滑杆、幽灵传输钮与下划线模式带；`CloseButton` 行为（焦点管理/Escape）不动。\n\n## 任务\n### Phase 1\n\n- [ ] task 1 — `packages/components/audio-player/player-panel.test.mjs` — source guard 先行：新增凹槽滑杆断言（`-webkit-appearance: none`、`::-webkit-slider-thumb`、`::-moz-range-progress`、`$fill`、纸色滑块）、幽灵传输（`border: none` 于 SkipButton、hover 主色晕）、模式带（`border-bottom: 2px solid` 下划标、`IconRepeat/IconRepeatOne/IconShuffle` 不再导入）、碟面环、桌面 gutter（`--space-xl` padding 断言）；保留晕染/歌词/dock/交互既有断言全绿\n- [ ] task 2 — `packages/components/audio-player/PlayerPanel.tsx` — 按决策实施五件事：NowHeader/NowDock 桌面 gutter、GrooveSlider（进度 $fill + 音量限宽）、SkipButton 幽灵化 + PlayButton 碟面环、ModeGroup→ModeBand（下划标、去图标、与音量同行）、CloseButton 描边透明化、TrackHeading 外距收紧、矮视口封面档复核\n\n### Phase 2\n\n- [ ] task 3 — 验证 — `node --test packages/components/audio-player/*.test.mjs` 全绿；根 tsc + oxlint 干净；浏览器截图目检：wine × light/dark、plain × light 至少三组合 × 桌面 1280 + 矮视口 1366×768 + 移动 390，覆盖播放/暂停两态、进度/音量凹槽拖动态、模式三态；reduced-motion 下无动画；focus-visible 走查\n- [ ] task 4 — `shadow-docs/knowledge/music-player.md` — 面板段补「控制甲板」事实（gutter、凹槽滑杆、幽灵传输、下划线模式带、碟面环），标注 verified-depth: runtime\n\n## 补充\n完整 brief：shadow-docs/changes/20260930-style-player-panel-deck/brief.md\n\n完整 brief：shadow-docs/changes/20260930-style-player-panel-deck/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-style-player-panel-deck\",\"type\":\"style\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-style-player-panel-deck/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/changes/20260930-style-player-panel-deck",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(player): 播放面板「控制甲板」重设计——边距栅格、凹槽滑杆与弹层滚动锁",
      "title": "style(player): 播放面板「控制甲板」重设计——边距栅格、凹槽滑杆与弹层滚动锁 (#417)",
      "body": "Closes #417\n\n完整 brief：shadow-docs/changes/20260930-style-player-panel-deck/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "控制甲板（gutter 栅格/凹槽滑杆/幽灵传输+碟面环/下划线模式带）与弹层滚动锁是面板长期视觉与交互事实，已在 apply 阶段按 runtime verified-depth 落入 music-player.md 播放面板段并补 source 与 verified-scope；design-system/animation-system/icon-system/components 结论全部沿用无需改卡"
  }
}
---

# 播放面板「控制甲板」重设计——边距栅格与传输控件语言

## 动机

晕染纸底（#415）上线后用户实测截图圈出两类问题，代码定位均属实：

1. **边距没了**：桌面端 `NowHeader`/`NowDock` 只写了移动端 padding，桌面栅格 gutter 整体缺失——封面 `CoverHero` 直怼面板左上圆角（被 `overflow: hidden` 裁切观感），进度条从面板边缘顶到边，时间码贴边；而歌词列（`padding: 0 2xl 0 lg`）与列表列（`0 lg`）有 gutter，三栏只有左栏「裸奔」。
2. **控件是默认形态**：进度条与音量条是只加了 `accent-color` 的原生 `<input type="range">`（白色系统轨道 + 系统滑块）；播放模式是三枚描边 pill（icon 13px + 文字），与面板纸墨语言和站点既有的「下划线标记」语言（MobileTab、年谱刻度带）双重脱节；传输钮三枚描边圆 + 一枚实心盘，四环并列层级不清。

纸底已铺，家具未进场。本变更补齐面板的控制甲板：栅格 gutter + 控件设计语言。

## 复杂度评级

- **评级:** S
- **理由:** 无契约变更（provider/specs/公开 API、播放与降级语义、焦点管理全部不动）；触及面单文件样式层（`PlayerPanel.tsx`）+ 门禁测试；可发现性高——`player-panel.test.mjs` source guard 既有模式直接扩展。
- **期望验证深度:** runtime（node --test 三件套全绿 + tsc/oxlint 干净 + 四主题×三视口截图目检）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 面板为晕染纸底五层配方 + 歌词签名（writeIn/朱砂侧标/墨随声走）+ dock grid-areas 结构；接口契约与降级语义不在样式层
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只经语义 token；淡化色统一 `color-mix(in oklab, var(--text-color) 72%, transparent)`；断点只用 `BREAKPOINTS` 语义常量；动态状态挂 transient prop 不用跨组件插值选择器；`font` 简写不得排在 `font-size` 之后
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/animation-system.md
  - 当前结论: audio-player 站点专属例外（本地 keyframes + `--motion-*` 引用自持）；reduced-motion 必须降级；transition 禁布局属性（滑块缩放用 transform，不改 width/height）
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/icon-system.md
  - 当前结论: 图标恒为 outline 线框，从 `@wuh.site/components/icons` 具名导出；模式带改纯文字后 `IconRepeat/IconRepeatOne/IconShuffle` 移除导入，其余图标不动
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/components.md
  - 当前结论: 播放器纸墨语言纪律由 style 门禁固化：禁裸十六进制色、禁裸断点数值、transition 禁布局属性、aria-label / `prefers-reduced-motion` 在场
  - 适用 scope: packages/components/audio-player
- norms/ui-patterns.md
  - 当前结论: 组件复用优先；暗色全覆盖；动效 150–300ms ease-out；必须响应 `prefers-reduced-motion`
  - 适用 scope: 全量
- norms/code-style.md
  - 当前结论: 渐进式治理，只做与当前改动直接相关的事，不顺手扩大范围
  - 适用 scope: 全量

## 决策

- **选型:** 方案 A「控制甲板」——五件事，全部走主题 token：
  1. **栅格 gutter**：`NowHeader` 桌面 `padding: var(--space-xl) 0 0 var(--space-xl)`，`NowDock` 桌面 `padding: 0 var(--space-lg) var(--space-xl) var(--space-xl)`——左 gutter 与歌词列 `padding-left: lg` 同韵，右 gutter 让进度条离开列罩边界，底部 gutter 让甲板离开面板圆角；封面由此获得 #415 brief 许诺但未落地的「装裱」inset。`TrackHeading` margin-top lg→base（外距让位给 gutter）。
  2. **凹槽滑杆**（签名元素）：`Slider` 重写为定制 range——`-webkit-appearance: none`，视觉轨道 4px 圆角发丝线（HAIRLINE），已播段主色填充（WebKit 经 transient `$fill` 驱动 `background-size`，Firefox 用 `::-moz-range-progress`）；滑块 12px 纸色圆点（`--background-100` + 发丝描边），hover/active `transform: scale(1.18)` + 主色软环（不改几何尺寸）；命中区维持 28px、coarse 指针 44px；进度与音量共用同一套凹槽几何，音量条限宽 120px。
  3. **幽灵传输钮**：`SkipButton` 去常驻描边（border none、背景 none），hover 主色 8% 纸面 + 图标转主色（与 CloseButton hover 同语言）；`PlayButton` 60px 主色实心盘维持「唯一饱和元素」，新增 `::after` 内缩环（`inset: 9px`、发丝线、`color-mix(--background-100 35%)`）作碟面标签环——唱片语言点到即止，不旋转不发光。
  4. **下划线模式带**：三枚 pill 换成一条文字带（顺序/单曲/随机，纯文字去图标，sans xs + letter-spacing），active = 主色 + 2px 下划标（复用 MobileTab/年谱刻度带语言），inactive = INK_MUTED，hover = 主色；`aria-pressed` 保留，与音量合成一行（`justify-content: space-between`）。
  5. **CloseButton 减噪**：常驻描边改透明（`border: 1px solid transparent`，hover 显 HAIRLINE + 主色晕），位置尺寸不动。
- **对比方案:**
  - 方案 B「仅补边距」——否决：滑杆仍是浏览器默认形态，不命中「控件都需要设计」的诉求。
  - 方案 C「仅重设计控件、不动栅格」——否决：封面仍怼面板圆角，边距问题才是截图第一痛点。
  - 方案 D「播放钮做旋转黑胶碟」（封面做碟心 + 慢转）——否决：音乐页已有大碟心旋转语言，面板内再转一份重复且抢歌词签名；降级为静态碟面环。
- **弹层滚动锁**（2026-09-30 用户验收反馈补强）：面板打开期间背景页面可继续滚动——`aria-modal` 弹层的标准缺陷。复用组件库 `Dialog` 既有 `lockScroll` 配方（`body.style.overflow='hidden' + position='fixed' + top=-scrollY 补偿 + width 100%`，关闭原样还原并 `scrollTo` 回补），iOS 触屏同样被锁；不引新依赖、不改 provider。
- **理由:** 全部要素都从既有语言里长出来：凹槽几何呼应唱片沟槽与纸面刻线，下划线标是站点已验证的选中态语言，幽灵钮/减噪关闭钮统一「纸面无描边、hover 显性」的层级策略——不引入新颜色、新字体、新断点；暗色经 token 自动跟随。矮视口 `max-height: 840px` 封面收缩档随 gutter 复核（gutter 占掉约 48px 纵向空间，必要时 230→220px）。
- **边界:** 只动 `PlayerPanel.tsx`（样式层 + 弹层滚动锁 effect）与 `player-panel.test.mjs` 门禁；不改 provider/specs/MiniPlayer/公开 API；移动端布局骨架（header/tabs/body/dock）不动，仅继承凹槽滑杆、幽灵传输钮与下划线模式带；`CloseButton` 行为（焦点管理/Escape）不动。

## 任务

### Phase 1

- [x] task 1 — `packages/components/audio-player/player-panel.test.mjs` — source guard 先行：新增凹槽滑杆断言（`-webkit-appearance: none`、`::-webkit-slider-thumb`、`::-moz-range-progress`、`$fill`、纸色滑块）、幽灵传输（`border: none` 于 SkipButton、hover 主色晕）、模式带（`border-bottom: 2px solid` 下划标、`IconRepeat/IconRepeatOne/IconShuffle` 不再导入）、碟面环、桌面 gutter（`--space-xl` padding 断言）；保留晕染/歌词/dock/交互既有断言全绿
- [x] task 2 — `packages/components/audio-player/PlayerPanel.tsx` — 按决策实施五件事：NowHeader/NowDock 桌面 gutter、GrooveSlider（进度 $fill + 音量限宽）、SkipButton 幽灵化 + PlayButton 碟面环、ModeGroup→ModeBand（下划标、去图标、与音量同行）、CloseButton 描边透明化、TrackHeading 外距收紧、矮视口封面档复核

### Phase 2

- [x] task 3 — 验证 — `node --test packages/components/audio-player/*.test.mjs` 全绿；根 tsc + oxlint 干净；浏览器截图目检：wine × light/dark、plain × light 至少三组合 × 桌面 1280 + 矮视口 1366×768 + 移动 390，覆盖播放/暂停两态、进度/音量凹槽拖动态、模式三态；reduced-motion 下无动画；focus-visible 走查
- [x] task 4 — `shadow-docs/knowledge/music-player.md` — 面板段补「控制甲板」事实（gutter、凹槽滑杆、幽灵传输、下划线模式带、碟面环），标注 verified-depth: runtime
- [x] task 5 — `packages/components/audio-player/PlayerPanel.tsx` — 弹层滚动锁（用户验收反馈）：门禁断言先行，面板打开时按 Dialog `lockScroll` 配方锁 body 滚动、关闭还原滚动位置；浏览器实测开面板滚轮/滚动条不再带动背景页，关闭后背景回到原位

## 结果

- 实际耗时: propose→release 同日完成（2026-09-30）；apply 含浏览器目检与 task 5 增补约半个工作日
- 验证: `node --test packages/components/audio-player/*.test.mjs` 30/30（含 gutter/凹槽滑杆/幽灵钮/模式带/滚动锁 5 条新守卫）；根 `tsc --noEmit` exit 0；oxlint 0 警告 0 错误；浏览器真数据目检——素雅/酒红 × 明暗四主题桌面 1280、矮视口 1366×768（封面收缩档 220px 生效、无溢出）、移动 390（吸底 dock、模式带居中、音量隐藏）；播放态进度推进、模式带切换、focus-visible 走查通过；滚动锁实测开面板 body `fixed+top 补偿`、滚轮不动、Escape 关闭后 scrollY 精确还原
- 知识动作: music-player.md 播放面板段补「控制甲板 + 弹层滚动锁」结论，source 追加本 brief，verified 2026-09-30（runtime）
- 流程备注: task 5（弹层滚动锁）为用户验收反馈当日增补，走 TDD 全链路；reduced-motion 无新增动画（面板级 reducedMotion 块统一压制，代码层核验）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 控制甲板语言（gutter 栅格、凹槽滑杆、幽灵传输钮、下划线模式带、碟面环）是面板长期有效的视觉事实，归位 music-player.md 面板段；design-system/animation-system 结论全部沿用无需改卡
