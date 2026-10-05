---
{
  "schema": "shadow-dev/v1",
  "name": "20261001-style-player-queue-fold",
  "type": "style",
  "scope": "packages/components/audio-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20261001-style-player-queue-fold",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 461,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/461",
    "pullRequest": 460,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/460"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "5e1bbbf263bba65ac4fe646e5759c2d00dd7452d",
    "verifiedAt": "2026-10-05T10:22:18.558Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:460",
    "planHash": "e4b313c261a80e2e901f0e928cd05230758db834c4e3fcad57336db4667f0a3f",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 播放面板队列 3D 翻页：右缘斜倚常驻 + hover 转正可选曲",
      "titleRaw": "[style] 播放面板队列 3D 翻页：右缘斜倚常驻 + hover 转正可选曲",
      "supplement": "桌面/平板队列交互重设计：3D 翻页队列屏替换滑入抽屉。完整 brief 见 shadow-docs/changes/20261001-style-player-queue-fold/brief.md（视觉稿 prototype.html 同目录）。实现已随 PR #460 交付。",
      "body": "## 动机\n现桌面队列是按钮唤出的右侧滑入纸卡抽屉，交互平庸且与「留白独奏」舞台语言脱节。用户 2026-10-01 起多轮共创定稿：歌单以右边框为翻页轴、以 3D 斜面姿态常驻右缘（可见纵深、半透明可读不可点），鼠标移入右缘沿轴翻页转正（浮起、实墨、可选曲），移出原路翻回。视觉稿七轮迭代定稿（含关键工程教训：perspective 只作用于直接子级，隔层必须 transform-style: preserve-3d；transition 简写引用未定义变量会整条作废回退 all 0s——帧采样实证）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 显隐态组件一律行内样式驱动（动态类竞态/属性选择器失灵两连败）；PlayerPanel 全文件禁 scrollIntoView；面板壳 overflow: clip ≥2 处；激活动态类组件触碰时转行内自定义属性；舞台预算三档制与「留白独奏」桌面形态不回退；移动端册页定稿形态不动\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量；断点只用 BREAKPOINTS 语义常量；暗色淡化禁 --text-secondary（用 --text-color 72% mix）；font 简写禁排在 font-size 后\n  - 适用 scope: packages/components\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 动画走 --motion-* 令牌；audio-player 是站点专属组件、关键帧与令牌引用自持（既有例外）；reduced-motion 必须降级；禁 JS scroll/resize 监听\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 3D 翻页队列屏（右缘斜倚常驻 + hover 翻页转正），替换现 DrawerCard/DrawerScrim 滑入抽屉\n- **对比方案:** ① 保持按钮唤出滑入抽屉（现状，弃——交互平庸）；② v2 斜立大倾角独立热区方案（弃——热区宽度随倾角变化，违背宽度恒定）；③ rotateZ 平面摆入 / keyframes 大起势（弃——前者非 3D，后者起点≠静止姿态产生第一帧跳变）\n- **理由:** 定稿语义（用户逐轮确认）：两态只差 角度/透明度/可点击/投影，布局宽度 340px 恒定；静止姿态 = 动画起点（rotateY(-40°) 斜倚，第一帧零跳变）；hover 进出场同一条 transition 曲线（520ms cubic-bezier(0.45,0,0.25,1)，--motion-ease-in-out-soft 令牌）；透明度 .45↔1（200ms，离场 160ms 宽限延迟）；浮起投影随转正浮现；行 hover 左引 4px + 序号翻播放键（复用 /music 目次行既有语言）。纯 CSS :hover/:focus-within 驱动进出场（非 React 态，不触显隐纪律）；pinned（列表钮 aria-expanded）仍走行内样式驱动；hover 门控 @media (hover:hover) and (pointer:fine)，触屏/平板走 pinned 等价路径；dock/工具组/关闭钮 z 序升到热区之上（防 hover 劫持点击）；移动端册页不动\n\n## 任务\n### Phase 1\n- [x] Panel 加 perspective:1400px；QZone（340px 热区，preserve-3d 透传）+ QScreen 替换 DrawerCard——静止 rotateY(-40deg)/opacity .45/pointer-events none，hover/focus-within 转正 rotateY(0)/opacity 1/投影/pointer-events auto — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n- [x] pinned 路径：queueOpen 行内样式驱动 QScreen/QScrim（沿用 DrawerCard 显隐配方），aria-expanded/Esc 分层不变 — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n- [x] 行 hover 动效：translateX(-4px) + 序号翻播放键 + 5% 墨底（ QueueItem/QueueButton 改造，动态背景转行内自定义属性驱动）— `packages/components/audio-player/PlayerPanel.tsx` — 改写\n- [x] hover 门控 (hover:hover) and (pointer:fine)；dock/TopTools/CloseButton z 序升至热区之上 — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n### Phase 2\n- [x] 守卫：preserve-3d 存在、翻页宽度常量无 width 过渡、禁 scrollIntoView/overflow clip 既有断言不回退、变量引用完整（--motion-* 引用必有定义）— `packages/components/audio-player/style.test.mjs` — 新增\n- [x] 词典核查：无新增 key（queueDrawer 沿用）— `packages/components/locales/dictionaries/{zh,en,ja}/player.ts` — 核查\n### Phase 3\n- [x] audio-player 守卫测试 + 根 tsc + oxlint 全绿 — `packages/components/audio-player` — 验证\n- [x] 四主题 × zh/en 目测 + 平板宽 + reduced-motion（本地 dev）— 验证\n\n## 补充\n桌面/平板队列交互重设计：3D 翻页队列屏替换滑入抽屉。完整 brief 见 shadow-docs/changes/20261001-style-player-queue-fold/brief.md（视觉稿 prototype.html 同目录）。实现已随 PR #460 交付。\n\n完整 brief：shadow-docs/changes/20261001-style-player-queue-fold/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261001-style-player-queue-fold\",\"type\":\"style\",\"scope\":\"packages/components/audio-player\",\"status\":\"published\",\"branch\":\"style/20261001-style-player-queue-fold\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261001-style-player-queue-fold/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":\"https://github.com/stack-wuh/x.wuh.site/pull/460\",\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261001-style-player-queue-fold/brief.md",
        "shadow-docs/changes/20261001-style-player-queue-fold/prototype.html",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(player): 队列 3D 翻页屏——右缘 -40° 斜倚常驻，hover 沿右边框转正可选曲\n\n- DrawerCard 滑入抽屉退役，QZone 热区 + QScreen 翻页屏：静止斜倚 rotateY(-40°) 半透明可读不可点，hover/聚焦转正 0° 浮起可选曲，pinned 走列表钮行内样式驱动\n- 宽度 340px 恒定，两态只差角度/透明度/可点击/投影；离场 160ms 宽限；hover 门控 (hover:hover) and (pointer:fine)，触屏/平板走按钮等价路径\n- 行 hover 左引 4px + 序号翻朱砂播放键；当前项转 --q-active 行内自定义属性驱动\n- dock/TopTools/CloseButton 升 z9 防热区劫持；Panel perspective:1400px + 热区 preserve-3d 透传\n- 守卫新增：翻页常量/preserve-3d/宽限/门控/z9/motion 令牌引用完整性（引用未定义令牌 = transition 整条回退 0s，帧采样实证）；就地修复存量域内类型错 useMarqueeOverflow 泛型\n- knowledge: music-player.md 原位更新（翻页屏语言 + 两条静默失效铁律 + 守卫条目）\n- 视觉稿: shadow-docs/changes/20261001-style-player-queue-fold/prototype.html（九轮共创定稿）",
      "title": "style(player): 队列 3D 翻页屏——右缘斜倚常驻，hover 转正可选曲",
      "body": ""
    }
  },
  "knowledge": null
}
---

# 播放面板队列 3D 翻页（右缘斜倚 → hover 转正）

## 动机
现桌面队列是按钮唤出的右侧滑入纸卡抽屉，交互平庸且与「留白独奏」舞台语言脱节。用户 2026-10-01 起多轮共创定稿：歌单以右边框为翻页轴、以 3D 斜面姿态常驻右缘（可见纵深、半透明可读不可点），鼠标移入右缘沿轴翻页转正（浮起、实墨、可选曲），移出原路翻回。视觉稿七轮迭代定稿（含关键工程教训：perspective 只作用于直接子级，隔层必须 transform-style: preserve-3d；transition 简写引用未定义变量会整条作废回退 all 0s——帧采样实证）。

## 复杂度评级
- **评级:** M
- **理由:** 三要素对照——契约变更：无 API/数据契约变化，仅组件内部交互与样式；触及面：PlayerPanel.tsx 单文件为主 + style.test.mjs 守卫，移动端册页与 dock 语义不动；可发现性：生产可见的签名级交互，四主题 × 三语 × 桌面/平板双形态需目检。
- **期望验证深度:** unit（守卫 + 既有测试全绿）+ runtime（部署后生产目检四主题/三语/平板宽/reduced-motion）

## 引用规范
- shadow-docs/knowledge/music-player.md
  - 当前结论: 显隐态组件一律行内样式驱动（动态类竞态/属性选择器失灵两连败）；PlayerPanel 全文件禁 scrollIntoView；面板壳 overflow: clip ≥2 处；激活动态类组件触碰时转行内自定义属性；舞台预算三档制与「留白独奏」桌面形态不回退；移动端册页定稿形态不动
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只走主题变量；断点只用 BREAKPOINTS 语义常量；暗色淡化禁 --text-secondary（用 --text-color 72% mix）；font 简写禁排在 font-size 后
  - 适用 scope: packages/components
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 动画走 --motion-* 令牌；audio-player 是站点专属组件、关键帧与令牌引用自持（既有例外）；reduced-motion 必须降级；禁 JS scroll/resize 监听
  - 适用 scope: packages/components/audio-player

## 决策
- **选型:** 3D 翻页队列屏（右缘斜倚常驻 + hover 翻页转正），替换现 DrawerCard/DrawerScrim 滑入抽屉
- **对比方案:** ① 保持按钮唤出滑入抽屉（现状，弃——交互平庸）；② v2 斜立大倾角独立热区方案（弃——热区宽度随倾角变化，违背宽度恒定）；③ rotateZ 平面摆入 / keyframes 大起势（弃——前者非 3D，后者起点≠静止姿态产生第一帧跳变）
- **理由:** 定稿语义（用户逐轮确认）：两态只差 角度/透明度/可点击/投影，布局宽度 340px 恒定；静止姿态 = 动画起点（rotateY(-40°) 斜倚，第一帧零跳变）；hover 进出场同一条 transition 曲线（520ms cubic-bezier(0.45,0,0.25,1)，--motion-ease-in-out-soft 令牌）；透明度 .45↔1（200ms，离场 160ms 宽限延迟）；浮起投影随转正浮现；行 hover 左引 4px + 序号翻播放键（复用 /music 目次行既有语言）。纯 CSS :hover/:focus-within 驱动进出场（非 React 态，不触显隐纪律）；pinned（列表钮 aria-expanded）仍走行内样式驱动；hover 门控 @media (hover:hover) and (pointer:fine)，触屏/平板走 pinned 等价路径；dock/工具组/关闭钮 z 序升到热区之上（防 hover 劫持点击）；移动端册页不动

## 任务
### Phase 1
- [x] Panel 加 perspective:1400px；QZone（340px 热区，preserve-3d 透传）+ QScreen 替换 DrawerCard——静止 rotateY(-40deg)/opacity .45/pointer-events none，hover/focus-within 转正 rotateY(0)/opacity 1/投影/pointer-events auto — `packages/components/audio-player/PlayerPanel.tsx` — 改写
- [x] pinned 路径：queueOpen 行内样式驱动 QScreen/QScrim（沿用 DrawerCard 显隐配方），aria-expanded/Esc 分层不变 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
- [x] 行 hover 动效：translateX(-4px) + 序号翻播放键 + 5% 墨底（ QueueItem/QueueButton 改造，动态背景转行内自定义属性驱动）— `packages/components/audio-player/PlayerPanel.tsx` — 改写
- [x] hover 门控 (hover:hover) and (pointer:fine)；dock/TopTools/CloseButton z 序升至热区之上 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
### Phase 2
- [x] 守卫：preserve-3d 存在、翻页宽度常量无 width 过渡、禁 scrollIntoView/overflow clip 既有断言不回退、变量引用完整（--motion-* 引用必有定义）— `packages/components/audio-player/style.test.mjs` — 新增
- [x] 词典核查：无新增 key（queueDrawer 沿用）— `packages/components/locales/dictionaries/{zh,en,ja}/player.ts` — 核查
### Phase 3
- [x] audio-player 守卫测试 + 根 tsc + oxlint 全绿 — `packages/components/audio-player` — 验证
- [x] 四主题 × zh/en 目测 + 平板宽 + reduced-motion（本地 dev）— 验证

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 播放面板桌面形态段需补队列 3D 翻页语言（斜倚常驻/翻页轴/宽限/行 hover/preserve-3d 与变量完整性两条工程教训），部署并 runtime 目检后回填 verified-depth
