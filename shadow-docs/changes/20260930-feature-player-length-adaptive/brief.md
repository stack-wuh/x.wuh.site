---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-feature-player-length-adaptive",
  "type": "feature",
  "scope": "packages/components/audio-player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260930-feature-player-length-adaptive",
  "files": [
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/style.test.mjs",
    "packages/components/audio-player/useMarquee.ts",
    "packages/components/locales/dictionaries/en/player.ts",
    "packages/components/locales/dictionaries/ja/player.ts",
    "packages/components/locales/dictionaries/zh/player.ts"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b116e81827a0ecc5de3ca489f97c9749d7d8e4f6",
    "verifiedAt": "2026-10-01T00:16:20.817Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "e579234e5bc78cbe5fafdd0c3a9850826a230dc134e27f22667ca064c41e42e4",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/mini-player.test.mjs",
        "packages/components/audio-player/player-panel.test.mjs",
        "packages/components/audio-player/style.test.mjs",
        "packages/components/audio-player/useMarquee.ts",
        "packages/components/locales/dictionaries/en/player.ts",
        "packages/components/locales/dictionaries/ja/player.ts",
        "packages/components/locales/dictionaries/zh/player.ts",
        "shadow-docs/changes/20260930-feature-player-length-adaptive",
        "shadow-docs/knowledge/components.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "feat(player): 播放器 i18n 长度自适应与面板「留白独奏」重铸",
      "title": "feat(player): 播放器 i18n 长度自适应与面板「留白独奏」重铸",
      "body": ""
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "M 级门槛达成：audio-player 守卫 46/46（含 6 条新守卫：跑马灯同源/模式 icon-only/popover aria/墨痕 aria-hidden/QueueArtist 限宽/lang 钩子）、locales 13/13、wiring 10/10、根 tsc 净、oxlint 0/0（125 文件）、生产构建通过；存量 mini-player/player-panel 测试已随形态重铸更新至新规格。走查确认：激活态全走行内自定义属性/受控 state（免疫机制）、移动 snap 页仍禁 scrollIntoView（手动 scrollTop）、progressPct 直传无二次换算、i18n 三语 key 同步、单行钮群/词卷/抽屉/墨痕与三轮认可原型一致。方案一致性：brief 决策 1-7 全落地。知识更新：music-player.md 面板形态改写（桌面三栏→居中单焦点舞台 + 词卷态/列表抽屉/音量 popover/墨痕歌词；模式带三钮→icon-only 循环钮；移动册页保留）+ components.md 第 43 行过期背景描述修正；verified-depth 于部署后生产复验时补 runtime。另记：main 既有 hydration mismatch（stash 二分证实非本 change 引入且不阻塞挂载），遗留独立排查。截图目检移至部署后生产复验（v1.4.43 先例）：apply 期并行会话共享端口 3000/3001/3200 反复起停 + dist 互踩 + IAB 崩溃 + SIGSEGV 频发，环境不可用已如实记录。"
  }
}
---

# 播放器 i18n 长度自适应 + 面板「留白独奏」重铸

## 动机

全站三语 i18n（#439）落地后，播放器用户可见文案长度不再固定：en「Repeat one」/ ja「単曲リピート」使甲板三钮文字模式带按栏宽推算**必溢出**（桌面左栏内容宽约 264–314px，en/ja 模式带 + 音量条约需 320–332px）；桌面面板题名与移动册页题名自由换行无上界（生产截图已现 3 行题名）；队列行歌手列 `flex-shrink: 0` 无限宽，长歌手名会把歌名列挤没。同时用户对桌面三栏面板做多轮视觉迭代后拍板**稿四「留白独奏」三稿**形态（视觉稿 `/tmp/player-mockup/layouts.html`，场景 a=常态 / b=词卷态 / c=音量 popover，截图 `layout-4a-v3.png` / `layout-4b-v3.png` / `layout-4c-volpop.png`）——长度自适应机制内嵌于新形态一并落地。

## 复杂度评级

- **评级:** M
- **理由:** 三要素对照——①契约变更：无（`AudioPlayerProvider` 公开 API、`Track`/`AudioPlayerState` 不动，词典仅新增 key 向后兼容）；②触及面：独立共享组件（audio-player + player 词典片段），不改共享函数签名，消费方零改动；③可发现性：改坏立即可见（面板/迷你条是常驻 UI），无延迟引爆路径。
- **期望验证深度:** unit + 走查（norms/tdd-verification.md M 级门槛：绿灯测试 + unit + 走查。实现期修订：原自加码的截图目检因并行会话共享端口/构建互踩 + 机器 SIGSEGV 频发致环境不可用，移至部署后生产复验，循 v1.4.43 双重百分比修复先例；M 级门槛已由守卫 46/46 + 13/13 + 10/10 + tsc/oxlint + 走查满足）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 面板为晕染纸底五层配方；甲板模式带激活态**必须行内自定义属性驱动**（选择器驱动两连败：动态类规则删除竞态 v1.4.36–38、属性选择器失灵 v1.4.41）——本 change 全部动态激活态（循环模式钮/词卷开关/抽屉/popover）沿用该机制；移动词窗禁 `scrollIntoView`；进度为共享 Progress 方印（progressPct 已是 0–100 禁二次 ×100、NaN 钳 0）；迷你条跑马灯 keyframes 插值进 props 三元串必须 `css` 包裹
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/i18n-locale.md
  - 当前结论: 三语词典 zh 为类型基准、en/ja `DeepPartial`，新增用户可见文案与 aria 必须三语同步；`documentElement.lang` 随 locale 同步（zh-CN/en/ja），可作 CSS 语言钩子（拉丁字距降档用 `html[lang='en']`）
  - 适用 scope: packages/components/locales、packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只走主题 token、断点只用 `BREAKPOINTS` 语义常量、字体只用三语义 token；运动令牌 `--motion-dur-quick`/`--motion-ease-out-soft`
  - 适用 scope: packages/components
- shadow-docs/knowledge/components.md
  - 当前结论: audio-player 纪律由同目录 `style.test.mjs` 门禁固化（禁裸十六进制/裸断点/`--text-secondary`，transition 禁布局属性，断言 aria-label/reduced-motion/status/Escape/safe-area 在场）——改播放器样式先保此测试绿
  - 适用 scope: packages/components/audio-player
  - 待确认点: 该卡第 43 行「面板背景是封面原图水印层」已被 music-player.md 晕染配方取代（代码 WashSrc blur 64 + PaperVeil 72% 证实），本 change 知识评估阶段一并修正

## 决策

- **选型:** 稿四「留白独奏」三稿（用户三轮视觉迭代定稿）+ 内嵌长度自适应机制
  1. **桌面布局重铸（居中单焦点舞台）**：晕染纸底五层配方保留，主舞台后加主题色暖晕（stageglow）；装裱封面**天薄地厚** + 竖排 mono 题签「曲 · N / 总数」；题名居中 serif 25px；**界格笺题跋**三行（上一句/下一句淡墨 + 当前句大字居格 + 朱砂句读环，发丝界线，上下渐隐 mask）；「樂」印进度 460px 居中；**单行钮群**居中「模式 | 上一曲/播放/下一曲 | 音量」（icon-only 模式钮与音量图标钮分列传输两侧，NetEase playbar 同构，用户定稿：两图标不再分居两角）
  2. **词卷展开态（融入稿三竖排词卷，用户点名）**：右上书形开关（aria-expanded）——封面缩为题头小装裱，全篇歌词以竖排（`writing-mode: vertical-rl`）成卷：句读自右向左成列，界格转为**朱丝栏**（列间发丝竖线），当前句大字 + 3px 朱砂侧标，随播逐列左移、两端渐隐；en 语境竖排可读性差，经 `html[lang='en']` 回退横排界格笺；底排控制与常态完全同位（控制永不挪位，只有舞台换景）
  3. **播放列表抽屉**：右上列表钮，自右滑入纸卡列表（QueueName/歌手列 ellipsis + `title` 全名），遮罩点击收回
  4. **音量 popover**（用户提案，竖向）：钮群右端一枚图标钮（hover 染朱砂），点开向上弹出小纸卡——「音量」眉标 + **竖向樂印滑杆**（112px，填充自底向上、印光标随值上浮）+ mono 数值 + 45° 纸角锚点；外点/Esc 收起；`aria-haspopup`/`aria-expanded` 同步
  5. **长度自适应**：`useMarquee.ts` 抽取共享（ghost 量尺 + 双拷贝轨道 + 0→-50% 无缝循环 + 暂停停走 + reduced-motion 回落省略号），迷你条改引、面板题名/词卷题头接同款（**溢出才徐展**，`title` 悬浮全名）；循环模式钮（用户定稿 **icon-only**：左下角一枚图标钮，图标随当前模式换装——`IconRepeat`/`IconRepeatOne`/`IconShuffle` 均为 icons 包既有导出，朱砂染色，点击 order→repeat-one→shuffle 循环，aria/title 用 `modeDialLabel` 组合当前模式与切换语义，激活即图标本身无独立激活态，长度变量归零）；队列歌手列限宽；`PlateNo`/题签/空词印字距对拉丁文降档（`html[lang='en']` 钩子）
  6. **墨痕歌词**（用户提案）：播放中且有词时，当前句以 74px 淡墨大字（8% 墨）浮上纸底作背景墨痕，上一句以 3% 墨渐褪；换句时约 1.6s 交叠渐变（旧句缓褪、新句缓洇）；词卷展开态、无词曲目、暂停态自动隐去；纯装饰层 `aria-hidden`，`prefers-reduced-motion` 下退化为瞬时切换不动画
  7. **移动端册页保留不动**（20260930 定稿形态），仅接长度防御（LeafTitle 单行、印面字距）
- **对比方案:** ①三栏改良（原方案 A：clamp 封顶 + 三钮文字带缩短标签）——用户四轮否决，三栏密度不被接受；②立轴变体（画左题右 + 竖书题跋 + 落款印 + 轴杆）——整体布局被否（「不喜欢这种布局」），但其竖排词卷语言经用户点名「稿三的布局也不错」在词卷展开态被采纳；③音量常驻水平滑杆——用户点名改竖向 popover 图标。
- **理由:** 稿四是用户在四稿布局提案中点名认可并两轮迭代定稿的方向；长度问题在稿四里被形态性消解（题名手卷、模式单钮、歌词单句/界格笺、列表抽屉限宽），i18n 三语宽度均有界。音量 popover、词卷开关、列表抽屉的动态显隐一律走行内自定义属性/受控 state，不碰选择器驱动激活态的已知生产雷区。

## 任务

### Phase 1 — 面板「留白独奏」重铸
- [x] 抽取 `useMarquee.ts`（hook + MARQUEE 常量 + marquee keyframes），MiniPlayer 改引、行为零变化 — `packages/components/audio-player/useMarquee.ts` — 新建
- [x] 桌面布局重铸：居中单焦点舞台（stageglow + 装裱天薄地厚 + 竖排题签 + 界格笺题跋 + 460px 樂印进度 + 单行钮群「模式/传输/音量」居中） — `packages/components/audio-player/PlayerPanel.tsx` — 改造
- [x] 词卷展开态（右上开关 + 题头小装裱 + 竖排词卷朱丝栏，en 回退横排界格笺） — `packages/components/audio-player/PlayerPanel.tsx` — 新增
- [x] 播放列表抽屉（右滑入纸卡 + 遮罩收回 + 歌手列限宽 ellipsis + title 全名） — `packages/components/audio-player/PlayerPanel.tsx` — 新增
- [x] 音量 popover（图标钮 + 上弹纸卡 + 竖向樂印滑杆 + 纸角锚 + 外点/Esc 收 + aria 同步） — `packages/components/audio-player/PlayerPanel.tsx` — 新增
- [x] 墨痕歌词（当前句淡墨大字背景层 + 换句 ~1.6s 交叠渐变 + 词卷/无词/暂停态隐去 + aria-hidden + reduced-motion 瞬切降级） — `packages/components/audio-player/PlayerPanel.tsx` — 新增
- [x] 循环模式钮（icon-only 三态换装 IconRepeat/IconRepeatOne/IconShuffle + 点击循环 + modeDialLabel aria/title） — `packages/components/audio-player/PlayerPanel.tsx` — 改造
- [x] 题名手卷：面板题名/词卷题头接 useMarquee（溢出徐展 + title 全名 + reduced-motion 回落）；MiniPlayer 补 title — `packages/components/audio-player/PlayerPanel.tsx` — 改造
- [x] 移动端册页长度防御（LeafTitle 单行 + 印面字距 `html[lang='en']` 降档） — `packages/components/audio-player/PlayerPanel.tsx` — 改造

### Phase 2 — 词典三语
- [x] 新增 key 三语同步：`panel.modeDialLabel`、`panel.wordsToggle`、`panel.queueDrawer`、`panel.volumePopover` — `packages/components/locales/dictionaries/{zh,en,ja}/player.ts` — 新增

### Phase 3 — 守卫与验证
- [x] `style.test.mjs` 守卫扩展：useMarquee 三处消费同源（禁复制实现）、`title` 全名在场、模式单钮循环、抽屉/popover/词卷开关的 aria（expanded/haspopup/Escape）在场、墨痕歌词层 `aria-hidden` 与 reduced-motion 降级在场、QueueArtist 限宽、reduced-motion 降级 — `packages/components/audio-player/style.test.mjs` — 扩展
- [x] 全门禁：`node --test packages/components/audio-player/*.test.mjs` + `node --test packages/components/locales/locales.test.mjs` + 根 `tsc --noEmit` + `oxlint app`；截图目检移至**部署后生产复验**（四主题 × 三语 × 关键态，循 v1.4.43 先例——apply 期并行会话共享端口/构建互踩致环境不可用）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md（面板形态结论改写：桌面三栏→居中单焦点舞台 + 词卷态 + 抽屉 + popover；模式带三钮→循环单钮；移动册页保留）；shadow-docs/knowledge/components.md（第 43 行面板背景过期描述修正 + audio-player 段落补长度自适应与显隐组件纪律）
- **理由:** 面板布局与模式带形态均为卡片明文结论，被本 change 显式推翻必须回写，否则下个 change 按旧结论复辟；components.md 过期背景描述已证伪顺手修正。更新时 verified-depth: runtime（守卫 + 四主题三语多态截图可追溯）。
