---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-fix-panel-lyric-scroll-bleed",
  "type": "fix",
  "scope": "player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20260930-fix-panel-lyric-scroll-bleed",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 441,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/441",
    "pullRequest": 445,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/445"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "8a926761801ab41612545a21392814858b5b1b6e",
    "verifiedAt": "2026-10-05T11:03:49.533Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:445",
    "planHash": "a4d17299777693e360f16a0f8d62e6184752d303f679c6ba441a3cc6169789d1",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 播放面板弹层被 scrollIntoView 连带滚动——顶部眉标裁切、底边露出晕染色带",
      "titleRaw": "播放面板弹层被 scrollIntoView 连带滚动——顶部眉标裁切、底边露出晕染色带",
      "supplement": "面板壳 overflow:hidden 仍是程序化可滚容器（WashSrc inset:-12% 撑出 118px 纵向 + 139px 横向隐藏可滚溢出），桌面歌词居中 scrollIntoView({block:'center'}) 沿祖先链把面板壳一并滚走：内容整体上移、眉标被裁、底边露出未罩纸底的晕染色带。中文环境复现，与 i18n 无关。修复方案 B：桌面歌词/队列定位改手动只滚目标容器 + Panel 壳 overflow 改 clip 绝根。详见 shadow-docs/changes/20260930-fix-panel-lyric-scroll-bleed/brief.md",
      "body": "## 动机\n用户报告：播放面板打开后「弹窗下方出现了一个滚动条，上面的字也看不到了」（附双截图）。生产取证实证：歌词居中用 `scrollIntoView({ block: 'center' })`（PlayerPanel.tsx），该 API 沿祖先链滚动**每一个**可滚容器——`overflow: hidden` 的 Panel 壳仍是程序化可滚容器，封面晕染层 `WashSrc` 的 `inset: -12%` 给它撑出 118px 纵向 + 139px 横向隐藏可滚溢出（实测 `scrollHeight 1100 vs clientHeight 982`、`scrollWidth 1297 vs clientWidth 1158`，面板壳实测 `scrollTop 19.5`）。后果：三栏内容整体上移 20–30px+，顶部「歌词 / 播放列表」眉标被面板上缘裁切；底边露出未罩纸底的晕染色带，视觉上像一条粗滚动条。中文环境同样复现，与 i18n/日语界面无关。这是 `knowledge/music-player.md` 已记录的移动端「外层 snap 页内禁 scrollIntoView」同一陷阱类，桌面路径一直未换。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 移动端册页陷阱「外层 snap 页内的移动容器定位禁用 scrollIntoView——它会连横向一起滚、把面板带去另一页」，已改手动垂直 scrollTop；弹层滚动锁按 Dialog lockScroll 配方；控制甲板桌面 grid `minmax(0, …)` 三列不自行溢出\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/i18n-locale.md\n  - 当前结论: 面板文案走 `t()` 词典\n  - 适用 scope: 诊断排除项——本 bug 与语言切换无关（中文环境复现），修复不触碰词典\n\n## 决策\n- **选型:** 方案 B——桌面歌词/队列定位去掉 `scrollIntoView`，改手动只滚目标容器（歌词 `LyricsScroll.scrollTo({ top: line.offsetTop - clientHeight/2 + line.offsetHeight/2, behavior })` 居中，镜像移动端既有公式；队列 `QueueList` 手动 nearest 语义：高亮项可见不动、越界才滚）+ Panel 壳 `overflow: hidden → clip`（桌面与移动媒体查询两处），`clip` 使面板壳彻底不是滚动容器，`scrollIntoView`/锚点再也无法滚动它\n- **对比方案:** A 仅手动定位（面板壳仍程序化可滚，未来复发面保留）；C 仅 `overflow: clip`（症状消失但定位语义仍错、body 锁定层仍可能被连带滚动，违背卡内「定位只滚目标容器」纪律）\n- **理由:** B 是移动端已验证纪律在桌面的补齐 + 结构性绝根（含移动端横翻陷阱免疫）；`offsetParent` 链已满足（LyricsScroll/QueueList 均 `position: relative`），墨晕 `translateY` 读 `offsetTop` 不受影响；`overflow: clip` 视觉裁切与 `hidden` 等价（含圆角），Chrome 90+/FF 81+/Safari 16+ 覆盖站点现状\n\n## 任务\n### Phase 1\n- [ ] 桌面歌词定位去掉 `scrollIntoView`，改 LyricsScroll 手动 `scrollTo` 居中（behavior 沿用 reduced-motion 判定），墨晕 translateY 维持 offsetTop 读取 — `packages/components/audio-player/PlayerPanel.tsx`\n- [ ] 队列定位去掉 `scrollIntoView`，改 QueueList 手动 nearest 语义（高亮项在视口内不动，越界才对齐） — `packages/components/audio-player/PlayerPanel.tsx`\n- [ ] Panel 壳 `overflow: hidden → clip`（基础规则与移动端媒体查询两处） — `packages/components/audio-player/PlayerPanel.tsx`\n- [ ] 守卫：PlayerPanel 源内禁出现 `scrollIntoView`；Panel overflow 必须为 `clip`；桌面歌词定位必须写 scrollRef 目标容器 — `packages/components/audio-player/player-panel.test.mjs`\n\n### Phase 2\n- [ ] audio-player 守卫套件全绿 + 根 `pnpm exec tsc --noEmit` + oxlint（SGN-001：139 空日志先等 20–45s 重试，不当代码失败）\n- [ ] runtime 复现场景回归：播放带词曲目→开面板→seek 50%→歌词推进，Panel `scrollTop/scrollLeft` 恒 0、两枚眉标完整可见、底边无色带；明暗双主题截图目检\n\n## 补充\n面板壳 overflow:hidden 仍是程序化可滚容器（WashSrc inset:-12% 撑出 118px 纵向 + 139px 横向隐藏可滚溢出），桌面歌词居中 scrollIntoView({block:'center'}) 沿祖先链把面板壳一并滚走：内容整体上移、眉标被裁、底边露出未罩纸底的晕染色带。中文环境复现，与 i18n 无关。修复方案 B：桌面歌词/队列定位改手动只滚目标容器 + Panel 壳 overflow 改 clip 绝根。详见 shadow-docs/changes/20260930-fix-panel-lyric-scroll-bleed/brief.md\n\n完整 brief：shadow-docs/changes/20260930-fix-panel-lyric-scroll-bleed/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-fix-panel-lyric-scroll-bleed\",\"type\":\"fix\",\"scope\":\"player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-fix-panel-lyric-scroll-bleed/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/changes/20260930-fix-panel-lyric-scroll-bleed/brief.md",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/signals.md"
      ],
      "message": "fix(player): 播放面板定位只滚目标容器、壳 overflow clip——scrollIntoView 祖先链连带滚动绝根 (#441)",
      "title": "fix(player): 播放面板弹层滚动连带修复——眉标裁切与底边色带绝根 (#441)",
      "body": "Closes #441\n\n完整 brief：shadow-docs/changes/20260930-fix-panel-lyric-scroll-bleed/brief.md"
    },
    "commit": {
      "files": [
        "shadow-docs/changes/20260930-fix-panel-lyric-scroll-bleed/brief.md"
      ],
      "message": "docs(shadow): #441 brief 回写 PR #445 链接"
    }
  },
  "knowledge": null
}
---

# 播放面板弹层被 scrollIntoView 连带滚动——顶部眉标裁切、底边露出晕染色带

## 动机

用户报告：播放面板打开后「弹窗下方出现了一个滚动条，上面的字也看不到了」（附双截图）。生产取证实证：歌词居中用 `scrollIntoView({ block: 'center' })`（PlayerPanel.tsx），该 API 沿祖先链滚动**每一个**可滚容器——`overflow: hidden` 的 Panel 壳仍是程序化可滚容器，封面晕染层 `WashSrc` 的 `inset: -12%` 给它撑出 118px 纵向 + 139px 横向隐藏可滚溢出（实测 `scrollHeight 1100 vs clientHeight 982`、`scrollWidth 1297 vs clientWidth 1158`，面板壳实测 `scrollTop 19.5`）。后果：三栏内容整体上移 20–30px+，顶部「歌词 / 播放列表」眉标被面板上缘裁切；底边露出未罩纸底的晕染色带，视觉上像一条粗滚动条。中文环境同样复现，与 i18n/日语界面无关。这是 `knowledge/music-player.md` 已记录的移动端「外层 snap 页内禁 scrollIntoView」同一陷阱类，桌面路径一直未换。

## 复杂度评级

- **评级:** S
- **理由:** 契约变更——无（组件内部定位实现，公开 API 不变）；触及面——单组件 1 实现文件 + 1 守卫文件；可发现性——根因已生产实证、同陷阱类先例在卡，复现路径明确（播放带词曲目→开面板→seek）。
- **期望验证深度:** runtime

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 移动端册页陷阱「外层 snap 页内的移动容器定位禁用 scrollIntoView——它会连横向一起滚、把面板带去另一页」，已改手动垂直 scrollTop；弹层滚动锁按 Dialog lockScroll 配方；控制甲板桌面 grid `minmax(0, …)` 三列不自行溢出
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/i18n-locale.md
  - 当前结论: 面板文案走 `t()` 词典
  - 适用 scope: 诊断排除项——本 bug 与语言切换无关（中文环境复现），修复不触碰词典

## 决策

- **选型:** 方案 B——桌面歌词/队列定位去掉 `scrollIntoView`，改手动只滚目标容器（歌词 `LyricsScroll.scrollTo({ top: line.offsetTop - clientHeight/2 + line.offsetHeight/2, behavior })` 居中，镜像移动端既有公式；队列 `QueueList` 手动 nearest 语义：高亮项可见不动、越界才滚）+ Panel 壳 `overflow: hidden → clip`（桌面与移动媒体查询两处），`clip` 使面板壳彻底不是滚动容器，`scrollIntoView`/锚点再也无法滚动它
- **对比方案:** A 仅手动定位（面板壳仍程序化可滚，未来复发面保留）；C 仅 `overflow: clip`（症状消失但定位语义仍错、body 锁定层仍可能被连带滚动，违背卡内「定位只滚目标容器」纪律）
- **理由:** B 是移动端已验证纪律在桌面的补齐 + 结构性绝根（含移动端横翻陷阱免疫）；`offsetParent` 链已满足（LyricsScroll/QueueList 均 `position: relative`），墨晕 `translateY` 读 `offsetTop` 不受影响；`overflow: clip` 视觉裁切与 `hidden` 等价（含圆角），Chrome 90+/FF 81+/Safari 16+ 覆盖站点现状

## 任务

### Phase 1
- [x] 桌面歌词定位去掉 `scrollIntoView`，改 LyricsScroll 手动 `scrollTo` 居中（behavior 沿用 reduced-motion 判定），墨晕 translateY 维持 offsetTop 读取 — `packages/components/audio-player/PlayerPanel.tsx`
- [x] 队列定位去掉 `scrollIntoView`，改 QueueList 手动 nearest 语义（高亮项在视口内不动，越界才对齐） — `packages/components/audio-player/PlayerPanel.tsx`
- [x] Panel 壳 `overflow: hidden → clip`（基础规则与移动端媒体查询两处） — `packages/components/audio-player/PlayerPanel.tsx`
- [x] 守卫：PlayerPanel 源内禁出现 `scrollIntoView`；Panel overflow 必须为 `clip`；桌面歌词定位必须写 scrollRef 目标容器 — `packages/components/audio-player/player-panel.test.mjs`

### Phase 2
- [x] audio-player 守卫套件全绿 + 根 `pnpm exec tsc --noEmit` + oxlint（SGN-001：139 空日志先等 20–45s 重试，不当代码失败）
- [x] runtime 复现场景回归：播放带词曲目→开面板→seek 50%→歌词推进，Panel `scrollTop/scrollLeft` 恒 0、两枚眉标完整可见、底边无色带；明暗双主题截图目检

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 把卡内移动端「外层 snap 页禁 scrollIntoView」陷阱条目扩写为面板级通用纪律——「面板内一切程序化定位只滚目标容器（手动 scrollTop/scrollTo），Panel 壳 overflow 用 clip 防程序化滚动」，补 118px/139px 隐藏可滚溢出数据与本次生产取证、修复实证（verified 落本次日期，verified-depth: runtime）
