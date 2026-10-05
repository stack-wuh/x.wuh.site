---
{
  "schema": "shadow-dev/v1",
  "name": "20261002-style-player-cover-disc",
  "type": "style",
  "scope": "packages/components/audio-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20261002-style-player-cover-disc",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 468,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/468",
    "pullRequest": 470,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/470"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "3863473e2a54ffd420732561dbab4d024dbf0f44",
    "verifiedAt": "2026-10-05T13:15:28.149Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:470",
    "planHash": "bfd4f687db078b6ee131ff0f695e3f553936462a938f596fd6021b9dbf71ee52",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 播放面板封面碟化：黑胶大碟随播放旋转",
      "titleRaw": "[style] 播放面板封面碟化：黑胶大碟随播放旋转",
      "supplement": "## 动机\n用户 2026-10-05 定稿（原型七轮迭代确认）：舞台装裱封面由方形图版改为黑胶大碟——圆碟嵌方裱（月洞窗构图），碟心圆标即封面图；播放时随转（26s/圈慢转），暂停即冻结当前角度（不复位），续播原位继续。与 /music 页小黑胶碟同一语言在面板的体系化延伸。完整 brief 见 shadow-docs/changes/20261002-style-player-cover-disc/brief.md。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 舞台预算三档制（装裱封面是舞台预算唯一因变量）；/music 页小黑胶碟语言（碟心圆标、播放慢转、reduced-motion 静止）；激活态行内自定义属性驱动；面板播放态已有 playing class 先例\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 动画引用 --motion-* 令牌；audio-player 站点专属例外（关键帧自持）；禁 JS 监听；reduced-motion 必须降级\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量 + color-mix；字体只用三语义 token\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 圆碟嵌方裱（月洞窗）——方形纸裱保留，PlateArt 方图版替换为黑胶圆碟（CSS 渐变碟面纹刻 + 碟心 42% 封面圆标 + 纸色轴点）；旋转 = CSS keyframes 26s/圈，animation-play-state 由面板 playing class 驱动，暂停冻结当前角度不复位；reduced-motion 静止\n- **对比方案:** ① 保留方形图版（弃——用户定稿碟化）；② 团扇全圆装裱（弃——方裱改动更小且保留装裱语言）；③ 方图直接旋转（弃——旋转不可读）；④ JS rAF 驱动（弃——CSS 引擎即够）\n- **理由:** 与 /music 碟心语言同源；纯 CSS 零 JS；碟径沿用舞台预算档位\n\n## 任务\n### Phase 1\n- [ ] Plate/PlateArt 改碟结构（碟面纹刻 + 碟心封面圆标 + 轴点，纸裱均边 padding，碟径沿舞台预算分档） — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 旋转动效：disc-spin keyframes + play-state 由 playing class 驱动 + reduced-motion 静止 — packages/components/audio-player/PlayerPanel.tsx\n### Phase 2\n- [ ] 守卫：碟结构在场、disc-spin 与 play-state 接线断言、reduced-motion 降级在场 — packages/components/audio-player/style.test.mjs\n### Phase 3\n- [ ] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题目测 + 播放/暂停旋转目测 — packages/components/audio-player\n\n## 复杂度评级\nM · 契约零变更（纯装饰形态与动效）；触及面局部；可发现性中（旋转接线错误属静默失效）· 期望验证深度 unit\n\n## 补充\n完整 brief：shadow-docs/changes/20261002-style-player-cover-disc/brief.md",
      "body": "## 动机\n用户 2026-10-05 定稿（原型七轮迭代确认）：舞台装裱封面由方形图版改为**黑胶大碟**——圆碟嵌方裱（月洞窗构图），碟心圆标即封面图；播放时随转（26s/圈慢转），暂停即冻结当前角度（不复位），续播原位继续。与 /music 页小黑胶碟（歌单封面做碟心圆标、播放慢转）同一语言在面板的体系化延伸。修订 knowledge 卡两条既有结论：「装裱封面天薄地厚」的图版形态、面板内「不旋转」的适用范围（封面碟可转，播放钮环仍静态）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 舞台预算三档制（装裱封面是舞台预算唯一因变量，帽与面板高度同源按视口高度分档）；/music 页小黑胶碟语言（封面做碟心圆标、播放慢转、reduced-motion 静止）；激活态/显隐态行内样式或行内自定义属性驱动；面板播放态已有 `playing` class 先例（Progress breathing 即由其驱动）\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 动画引用 --motion-* 令牌；audio-player 站点专属例外（关键帧自持）；禁 JS scroll/resize 监听；reduced-motion 必须降级\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量 + color-mix；字体只用三语义 token；断点只用 BREAKPOINTS\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 圆碟嵌方裱（月洞窗）——Plate 方形纸裱保留（发丝线装裱语言、月洞窗构图），PlateArt 方图版替换为黑胶圆碟：碟面 = 深色底 + 同心纹刻 + 斜向高光（CSS 渐变，无图片资源），碟心 42% 封面图圆形圆标（换曲随 `currentTrack.coverUrl` 换图）+ 纸色轴点；旋转 = CSS `@keyframes` 26s/圈 linear infinite，`animation-play-state` 由面板既有 `playing` class 驱动（running/paused），暂停冻结当前角度、续播原位继续；reduced-motion 下 `animation: none` 静止\n- **对比方案:** ① 保留方形图版（弃——用户定稿碟化）；② 团扇全圆装裱（弃——方裱改动更小且保留既有装裱语言）；③ 方形封面图直接旋转（弃——无方向线索，旋转不可读）；④ JS requestAnimationFrame 驱动旋转（弃——CSS animation 引擎驱动即够，禁新增 JS 监听）\n- **理由:** 与 /music 页碟心语言同源成体系；纯 CSS 动画零 JS；碟径沿用舞台预算档位（224px 档，唯一因变量关系不破坏）\n\n## 任务\n### Phase 1\n- [ ] Plate/PlateArt 改碟结构：碟面（同心纹刻 + 高光渐变，纯 CSS）、碟心封面圆标（42%、换曲换图）、纸色轴点；纸裱 padding 改均匀（14px），碟径沿用舞台预算分档 — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n- [ ] 旋转动效：disc-spin keyframes（26s linear infinite）+ `animation-play-state` 由 `playing` class 驱动 + reduced-motion `animation: none` 静止 — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n### Phase 2\n- [ ] 守卫：碟结构（border-radius 50% 碟面 + 碟心圆标）在场；disc-spin keyframes 与 play-state 接线（playing → running）断言；reduced-motion 降级在场 — `packages/components/audio-player/style.test.mjs` — 新增\n### Phase 3\n- [ ] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题 × 明暗目测 + 播放/暂停旋转目测（本地 dev） — `packages/components/audio-player` — 验证\n\n## 补充\n## 动机\n用户 2026-10-05 定稿（原型七轮迭代确认）：舞台装裱封面由方形图版改为黑胶大碟——圆碟嵌方裱（月洞窗构图），碟心圆标即封面图；播放时随转（26s/圈慢转），暂停即冻结当前角度（不复位），续播原位继续。与 /music 页小黑胶碟同一语言在面板的体系化延伸。完整 brief 见 shadow-docs/changes/20261002-style-player-cover-disc/brief.md。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 舞台预算三档制（装裱封面是舞台预算唯一因变量）；/music 页小黑胶碟语言（碟心圆标、播放慢转、reduced-motion 静止）；激活态行内自定义属性驱动；面板播放态已有 playing class 先例\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 动画引用 --motion-* 令牌；audio-player 站点专属例外（关键帧自持）；禁 JS 监听；reduced-motion 必须降级\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量 + color-mix；字体只用三语义 token\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 圆碟嵌方裱（月洞窗）——方形纸裱保留，PlateArt 方图版替换为黑胶圆碟（CSS 渐变碟面纹刻 + 碟心 42% 封面圆标 + 纸色轴点）；旋转 = CSS keyframes 26s/圈，animation-play-state 由面板 playing class 驱动，暂停冻结当前角度不复位；reduced-motion 静止\n- **对比方案:** ① 保留方形图版（弃——用户定稿碟化）；② 团扇全圆装裱（弃——方裱改动更小且保留装裱语言）；③ 方图直接旋转（弃——旋转不可读）；④ JS rAF 驱动（弃——CSS 引擎即够）\n- **理由:** 与 /music 碟心语言同源；纯 CSS 零 JS；碟径沿用舞台预算档位\n\n## 任务\n### Phase 1\n- [ ] Plate/PlateArt 改碟结构（碟面纹刻 + 碟心封面圆标 + 轴点，纸裱均边 padding，碟径沿舞台预算分档） — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 旋转动效：disc-spin keyframes + play-state 由 playing class 驱动 + reduced-motion 静止 — packages/components/audio-player/PlayerPanel.tsx\n### Phase 2\n- [ ] 守卫：碟结构在场、disc-spin 与 play-state 接线断言、reduced-motion 降级在场 — packages/components/audio-player/style.test.mjs\n### Phase 3\n- [ ] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题目测 + 播放/暂停旋转目测 — packages/components/audio-player\n\n## 复杂度评级\nM · 契约零变更（纯装饰形态与动效）；触及面局部；可发现性中（旋转接线错误属静默失效）· 期望验证深度 unit\n\n## 补充\n完整 brief：shadow-docs/changes/20261002-style-player-cover-disc/brief.md\n\n完整 brief：shadow-docs/changes/20261002-style-player-cover-disc/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261002-style-player-cover-disc\",\"type\":\"style\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261002-style-player-cover-disc/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "shadow-docs/changes/20261002-style-player-cover-disc/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "docs(shadow): music-player 卡记录墨痕五列两翼与封面碟化结论；碟化 brief 对账"
    }
  },
  "knowledge": null
}
---

# 播放面板封面碟化——黑胶大碟随播放旋转

## 动机

用户 2026-10-05 定稿（原型七轮迭代确认）：舞台装裱封面由方形图版改为**黑胶大碟**——圆碟嵌方裱（月洞窗构图），碟心圆标即封面图；播放时随转（26s/圈慢转），暂停即冻结当前角度（不复位），续播原位继续。与 /music 页小黑胶碟（歌单封面做碟心圆标、播放慢转）同一语言在面板的体系化延伸。修订 knowledge 卡两条既有结论：「装裱封面天薄地厚」的图版形态、面板内「不旋转」的适用范围（封面碟可转，播放钮环仍静态）。

## 复杂度评级

- **评级:** M
- **理由:** 契约零变更（纯装饰元素形态与动效，无 API/schema/行为面变化）；触及面局部（PlayerPanel.tsx 单文件 + style.test.mjs 守卫）；可发现性中——旋转接线错（play-state 未随播放态切换、reduced-motion 未降级）属静默失效，需守卫拦截。
- **期望验证深度:** unit（M 级绿灯守卫 + 走查；四主题目测随 apply 自检）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 舞台预算三档制（装裱封面是舞台预算唯一因变量，帽与面板高度同源按视口高度分档）；/music 页小黑胶碟语言（封面做碟心圆标、播放慢转、reduced-motion 静止）；激活态/显隐态行内样式或行内自定义属性驱动；面板播放态已有 `playing` class 先例（Progress breathing 即由其驱动）
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 动画引用 --motion-* 令牌；audio-player 站点专属例外（关键帧自持）；禁 JS scroll/resize 监听；reduced-motion 必须降级
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只走主题变量 + color-mix；字体只用三语义 token；断点只用 BREAKPOINTS
  - 适用 scope: packages/components

## 决策

- **选型:** 圆碟嵌方裱（月洞窗）——Plate 方形纸裱保留（发丝线装裱语言、月洞窗构图），PlateArt 方图版替换为黑胶圆碟：碟面 = 深色底 + 同心纹刻 + 斜向高光（CSS 渐变，无图片资源），碟心 42% 封面图圆形圆标（换曲随 `currentTrack.coverUrl` 换图）+ 纸色轴点；旋转 = CSS `@keyframes` 26s/圈 linear infinite，`animation-play-state` 由面板既有 `playing` class 驱动（running/paused），暂停冻结当前角度、续播原位继续；reduced-motion 下 `animation: none` 静止
- **对比方案:** ① 保留方形图版（弃——用户定稿碟化）；② 团扇全圆装裱（弃——方裱改动更小且保留既有装裱语言）；③ 方形封面图直接旋转（弃——无方向线索，旋转不可读）；④ JS requestAnimationFrame 驱动旋转（弃——CSS animation 引擎驱动即够，禁新增 JS 监听）
- **理由:** 与 /music 页碟心语言同源成体系；纯 CSS 动画零 JS；碟径沿用舞台预算档位（224px 档，唯一因变量关系不破坏）

## 任务

### Phase 1
- [x] Plate/PlateArt 改碟结构：碟面（同心纹刻 + 高光渐变，纯 CSS）、碟心封面圆标（42%、换曲换图）、纸色轴点；纸裱 padding 改均匀（14px），碟径沿用舞台预算分档 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
- [x] 旋转动效：disc-spin keyframes（26s linear infinite）+ `animation-play-state` 由 `playing` class 驱动 + reduced-motion `animation: none` 静止 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
### Phase 2
- [x] 守卫：碟结构（border-radius 50% 碟面 + 碟心圆标）在场；disc-spin keyframes 与 play-state 接线（playing → running）断言；reduced-motion 降级在场 — `packages/components/audio-player/style.test.mjs` — 新增
### Phase 3
- [x] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题 × 明暗目测 + 播放/暂停旋转目测（本地 dev） — `packages/components/audio-player` — 验证

## 结果

- 实际耗时: 约 2.5h（含原型七轮迭代）
- 验证: audio-player 守卫 55/55（含碟结构/discSpin 接线/reduced-motion 断言；顺修 player-panel 被掩盖的 StageGlow 潜伏正则）+ 域内 tsc 清零 + 根 tsc 净 + oxlint 0 错；PR #470 squash 合入 main（bea8af4），随 v1.4.58 部署全绿（同 run 37312669442）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 「留白独奏」结论段装裱封面描述需从方形图版（天薄地厚）更新为黑胶大碟（月洞窗）；「面板内不旋转」理由修订为——封面碟可转（/music 语言延伸），播放钮碟面环仍静态；更新时写明 verified-depth（unit 守卫 + 实现走查）
