---
{
  "schema": "shadow-dev/v1",
  "name": "20261002-style-player-ghost-depth",
  "type": "style",
  "scope": "packages/components/audio-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20261002-style-player-ghost-depth",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 463,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/463",
    "pullRequest": 469,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/469"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "bea8af478725b1fa880095f6583055693e562261",
    "verifiedAt": "2026-10-05T13:10:03.577Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:469",
    "planHash": "515cff321855ba7b8bcc969532419f5d5d0cafc644c478a7c62d9232ce65a4dd",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 播放器墨痕歌词墨阶纵深：逐句沿 Z 轴沉入纸面",
      "titleRaw": "[style] 播放器墨痕歌词墨阶纵深：逐句沿 Z 轴沉入纸面",
      "supplement": "## 动机\n播放面板背景歌词（墨痕 GhostLayer）现为「前句 + 当前句」两层平面淡字，换句只做 opacity 交叠渐变——无纵深、无逐句推进感，与 Panel 已有的 3D 语言（perspective 1400px + 队列翻页屏 rotateY，PR #460）脱节。用户 2026-10-02 设计共创定稿：背景歌词「一句一句出现」，如墨滴入水层层晕退——升级为三阶墨阶滑动窗口，逐句沿 Z 轴沉入纸面。视觉稿见 brief 同目录 prototype.html。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 墨痕歌词纯装饰 aria-hidden、播放中且有词且词卷未开才呈现、reduced-motion 瞬切、移动端 display:none；3D 三铁律（静止姿态=动画起点 / preserve-3d 透传 / --motion-* 五令牌名单）；激活态行内自定义属性驱动，禁动态类插值与属性选择器；全文件禁 scrollIntoView\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 克制动效「被照亮/被写下」；audio-player 站点专属例外（关键帧与令牌引用自持）；禁 JS scroll/resize 监听；reduced-motion 必须降级\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量 + color-mix；字体只用三语义 token；断点只用 BREAKPOINTS；禁跨组件插值选择器\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 方案 B「三层墨阶」——墨痕歌词升级为当前句 + 前 2 句滑动窗口，三档 Z 深度（0/−110px/−240px，透视下自然缩至 ~93%/~85%），墨 8%/4.5%/2.5% 递淡、blur 0/1px/2px 递进，top 27%/19%/12% 错落成书法章法\n- **对比方案:** ① A 双层轻改（弃——两阶纵深弱，推进感出不来）；② C 3D 场景化 rotateX 仰角 + 墨点（弃——与队列翻页屏双 3D 源互相干扰、抢戏、偏离克制动效语言）\n- **理由:** 用户三方向共创选定墨阶纵深；三层是纵深可感知最小层数；复用 Panel 既有 perspective 与队列翻页屏成熟 3D 纪律；窗口由既有 lyricIdx useMemo 同式扩展，零新增监听。GhostLine key 改按句稳定标识——退阶句保留 DOM 走 transition、新当前句重挂载浮入（起点=旧档位深度，首帧零跳变）；深度/墨色/blur/top 经行内自定义属性 --ghost-z/--ghost-ink/--ghost-blur/--ghost-top 驱动静态规则\n\n## 任务\n### Phase 1\n- [ ] GhostLayer 挂 transform-style: preserve-3d 透传；GhostLine 深度档改行内自定义属性驱动 — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 三阶窗口派生 + key 按句稳定标识（退阶走 transition / 浮入起点=旧档位） — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 三档深度编排（Z/墨/blur/top）+ 换句节奏沿 ghostIn ~1.6s、令牌只引五令牌名单 — packages/components/audio-player/PlayerPanel.tsx\n- [ ] reduced-motion 双降级（animation+transition 均 none）；显隐条件/aria-hidden/移动端 display:none 不变 — packages/components/audio-player/PlayerPanel.tsx\n### Phase 2\n- [ ] 守卫：preserve-3d 透传在场、深度档常量钉死、motion 令牌断言覆盖墨痕层、reduced-motion 双降级在场 — packages/components/audio-player/style.test.mjs\n### Phase 3\n- [ ] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题目测 + reduced-motion — packages/components/audio-player\n\n## 复杂度评级\nM · 契约零变更（纯 aria-hidden 装饰层视觉）；触及面局部（单文件 + 守卫）；可发现性中（preserve-3d/令牌失效静默退化无报错，须守卫拦截）· 期望验证深度 unit\n\n## 补充\n完整 brief：shadow-docs/changes/20261002-style-player-ghost-depth/brief.md",
      "body": "## 动机\n播放面板背景歌词（墨痕 GhostLayer）现为「前句 + 当前句」两层平面淡字，换句只做 opacity 交叠渐变——无纵深、无逐句推进感，与 Panel 已有的 3D 语言（`perspective: 1400px` + 队列翻页屏 `rotateY(-40deg)`，PR #460）脱节。用户 2026-10-02 设计共创定稿：背景歌词应「一句一句出现」，如墨滴入水层层晕退——升级为三阶墨阶滑动窗口，逐句沿 Z 轴沉入纸面，退远档以递进 blur 作水墨语言。视觉稿见 brief 同目录 `prototype.html`。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 墨痕歌词纯装饰 `aria-hidden`、播放中且有词且词卷未开才呈现、reduced-motion 瞬切、移动端 `display:none`；3D 三铁律（① 静止姿态=动画起点，首帧零跳变；② perspective 只作用直接子级，隔层必须 `transform-style: preserve-3d` 透传；③ transition 简写引用的 `--motion-*` 必须在站点注入五令牌名单内）；激活态/显隐态一律行内样式或行内自定义属性驱动，禁 styled 动态类插值与属性选择器；全文件禁 `scrollIntoView`；队列翻页屏守卫与 motion 令牌名单断言落 `style.test.mjs`\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 全站动画只做「被照亮/被写下」的克制动效；audio-player 是站点专属组件例外（关键帧与 `--motion-*` 引用自持，`ghostIn`/`writeIn` 先例）；禁 JS scroll/resize 监听；reduced-motion 必须降级\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量 + `color-mix`；字体只用三语义 token（衬线 `--font-serif`）；断点只用 BREAKPOINTS 语义常量；禁跨组件插值选择器\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 方案 B「三层墨阶」——墨痕歌词升级为**当前句 + 前 2 句**滑动窗口，三档 Z 深度（0 / −110px / −240px，perspective 1400px 下自然缩至 ~93% / ~85%），墨色 8% / 4.5% / 2.5% 递淡、blur 0 / 1px / 2px 递进（墨入水晕散），top 27% / 19% / 12% 错落成书法章法\n- **对比方案:** ① A 双层轻改——只给现有两层加深度差（弃：两阶纵深弱，「一句一句沉入纸背」的推进感出不来）；② C 3D 场景化——GhostLayer 整体 rotateX 仰角 + 墨点粒子（弃：与队列翻页屏同框双 3D 源互相干扰，动频高抢戏，偏离「被照亮/被写下」克制动效语言）\n- **理由:** 用户在「墨阶纵深 / 书写墨晕 / 字牌翻卷」三个画面方向中选定墨阶纵深；三层是纵深可感知的最小层数；复用 Panel 既有 `perspective` 与队列翻页屏成熟 3D 纪律（preserve-3d 透传 / 五令牌名单 / 行内自定义属性驱动）；窗口由既有 `lyricIdx` useMemo 同式扩展（`lyrics[lyricIdx-2..lyricIdx]`，与 `epiPrev`/`epiAct` 派生同构），零新增 scroll/resize 监听。关键实现约束：GhostLine key 改按句稳定标识（`ghost-${句索引}`）——换句时已挂载句**保留 DOM 节点走 transition 退阶**，新当前句重挂载走浮入动画（起点深度=旧档位深度，遵守铁律①首帧零跳变）；深度/墨色/blur/top 全部经行内自定义属性（`--ghost-z/--ghost-ink/--ghost-blur/--ghost-top`）驱动静态规则，遵守激活态纪律；`transform` 组合保留 `translateX(-50%)` 居中。\n\n## 任务\n### Phase 1\n- [ ] GhostLayer 挂 `transform-style: preserve-3d` 透传 Panel `perspective: 1400px`；GhostLine 深度档改行内自定义属性驱动（静态规则消费 `var(--ghost-*)`）— `packages/components/audio-player/PlayerPanel.tsx` — 改写\n- [ ] 三阶窗口派生（`lyrics[lyricIdx-2..lyricIdx]`）+ key 改按句稳定标识：退阶句走 transition、新当前句重挂载浮入（起点=旧档位深度）、第 2 阶淡出卸载沿旧例 — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n- [ ] 三档深度编排：Z 0/−110/−240、墨 8%/4.5%/2.5%、blur 0/1px/2px、top 27%/19%/12%；换句节奏沿 ghostIn ~1.6s 语言，时长/缓动只引用站点注入五令牌名单 — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n- [ ] reduced-motion 瞬切降级扩展（animation + transition 均 none）；显隐条件、`aria-hidden`、移动端 `display:none` 保持不变 — `packages/components/audio-player/PlayerPanel.tsx` — 改写\n### Phase 2\n- [ ] 守卫：GhostLayer preserve-3d 透传在场；墨阶深度档常量钉死；motion 令牌引用完整性断言覆盖墨痕层；reduced-motion 双降级在场 — `packages/components/audio-player/style.test.mjs` — 新增\n### Phase 3\n- [ ] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题 × 明暗目测 + reduced-motion（本地 dev） — `packages/components/audio-player` — 验证\n\n## 补充\n## 动机\n播放面板背景歌词（墨痕 GhostLayer）现为「前句 + 当前句」两层平面淡字，换句只做 opacity 交叠渐变——无纵深、无逐句推进感，与 Panel 已有的 3D 语言（perspective 1400px + 队列翻页屏 rotateY，PR #460）脱节。用户 2026-10-02 设计共创定稿：背景歌词「一句一句出现」，如墨滴入水层层晕退——升级为三阶墨阶滑动窗口，逐句沿 Z 轴沉入纸面。视觉稿见 brief 同目录 prototype.html。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 墨痕歌词纯装饰 aria-hidden、播放中且有词且词卷未开才呈现、reduced-motion 瞬切、移动端 display:none；3D 三铁律（静止姿态=动画起点 / preserve-3d 透传 / --motion-* 五令牌名单）；激活态行内自定义属性驱动，禁动态类插值与属性选择器；全文件禁 scrollIntoView\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 克制动效「被照亮/被写下」；audio-player 站点专属例外（关键帧与令牌引用自持）；禁 JS scroll/resize 监听；reduced-motion 必须降级\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量 + color-mix；字体只用三语义 token；断点只用 BREAKPOINTS；禁跨组件插值选择器\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 方案 B「三层墨阶」——墨痕歌词升级为当前句 + 前 2 句滑动窗口，三档 Z 深度（0/−110px/−240px，透视下自然缩至 ~93%/~85%），墨 8%/4.5%/2.5% 递淡、blur 0/1px/2px 递进，top 27%/19%/12% 错落成书法章法\n- **对比方案:** ① A 双层轻改（弃——两阶纵深弱，推进感出不来）；② C 3D 场景化 rotateX 仰角 + 墨点（弃——与队列翻页屏双 3D 源互相干扰、抢戏、偏离克制动效语言）\n- **理由:** 用户三方向共创选定墨阶纵深；三层是纵深可感知最小层数；复用 Panel 既有 perspective 与队列翻页屏成熟 3D 纪律；窗口由既有 lyricIdx useMemo 同式扩展，零新增监听。GhostLine key 改按句稳定标识——退阶句保留 DOM 走 transition、新当前句重挂载浮入（起点=旧档位深度，首帧零跳变）；深度/墨色/blur/top 经行内自定义属性 --ghost-z/--ghost-ink/--ghost-blur/--ghost-top 驱动静态规则\n\n## 任务\n### Phase 1\n- [ ] GhostLayer 挂 transform-style: preserve-3d 透传；GhostLine 深度档改行内自定义属性驱动 — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 三阶窗口派生 + key 按句稳定标识（退阶走 transition / 浮入起点=旧档位） — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 三档深度编排（Z/墨/blur/top）+ 换句节奏沿 ghostIn ~1.6s、令牌只引五令牌名单 — packages/components/audio-player/PlayerPanel.tsx\n- [ ] reduced-motion 双降级（animation+transition 均 none）；显隐条件/aria-hidden/移动端 display:none 不变 — packages/components/audio-player/PlayerPanel.tsx\n### Phase 2\n- [ ] 守卫：preserve-3d 透传在场、深度档常量钉死、motion 令牌断言覆盖墨痕层、reduced-motion 双降级在场 — packages/components/audio-player/style.test.mjs\n### Phase 3\n- [ ] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题目测 + reduced-motion — packages/components/audio-player\n\n## 复杂度评级\nM · 契约零变更（纯 aria-hidden 装饰层视觉）；触及面局部（单文件 + 守卫）；可发现性中（preserve-3d/令牌失效静默退化无报错，须守卫拦截）· 期望验证深度 unit\n\n## 补充\n完整 brief：shadow-docs/changes/20261002-style-player-ghost-depth/brief.md\n\n完整 brief：shadow-docs/changes/20261002-style-player-ghost-depth/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261002-style-player-ghost-depth\",\"type\":\"style\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261002-style-player-ghost-depth/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261002-style-player-ghost-depth/brief.md",
        "shadow-docs/changes/20261002-style-player-ghost-depth/prototype.html"
      ],
      "message": "style(player): 墨痕歌词竖排五列两翼——左翼当前侧 3 列浓墨 + 右翼淡墨回声，深度五档行内 perspective 投影"
    }
  },
  "knowledge": null
}
---

# 播放器墨痕歌词「墨阶纵深」——逐句沿 Z 轴沉入纸面

## 动机

播放面板背景歌词（墨痕 GhostLayer）现为「前句 + 当前句」两层平面淡字，换句只做 opacity 交叠渐变——无纵深、无逐句推进感，与 Panel 已有的 3D 语言（`perspective: 1400px` + 队列翻页屏 `rotateY(-40deg)`，PR #460）脱节。用户 2026-10-02 设计共创定稿：背景歌词应「一句一句出现」，如墨滴入水层层晕退——升级为三阶墨阶滑动窗口，逐句沿 Z 轴沉入纸面，退远档以递进 blur 作水墨语言。视觉稿见 brief 同目录 `prototype.html`。

**布局零变动承诺（用户 2026-10-02 二轮明确）**：本变更只改墨痕歌词层（GhostLayer/GhostLine）及其派生数据与守卫；面板舞台（NowStage/dock/词卷/队列翻页屏/移动端册页）一律不碰。2026-10-05 三轮竖排、四轮散布、五轮加密、六轮定稿：**五列两翼、激活居左**——左翼（当前侧）3 列浓墨 + 右翼 2 列淡墨回声（右缘已有队列翻页屏，激活态不得与之争位），歌词窗口 5 句，深度五档递进；换句为各站原地重挂载浮入，无跨站位移（跨站迁移会横穿封面区背后）。仍是 GhostLayer 内部定位，舞台布局零接触。

## 复杂度评级

- **评级:** M
- **理由:** 契约零变更（纯 `aria-hidden` 装饰层的视觉呈现，无 API/schema/行为面变化）；触及面局部（PlayerPanel.tsx 单文件 + style.test.mjs 守卫）；可发现性中——preserve-3d 漏配与 motion 令牌 invalid 均**静默退化无报错**（music-player 卡各有一次帧采样实锤），必须靠守卫拦截，故不评 S。
- **期望验证深度:** unit（M 级绿灯守卫 + 走查；四主题帧效果目检随 apply 自检，生产 runtime 复验沿惯例部署后做）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 墨痕歌词纯装饰 `aria-hidden`、播放中且有词且词卷未开才呈现、reduced-motion 瞬切、移动端 `display:none`；3D 三铁律（① 静止姿态=动画起点，首帧零跳变；② perspective 只作用直接子级，隔层必须 `transform-style: preserve-3d` 透传；③ transition 简写引用的 `--motion-*` 必须在站点注入五令牌名单内）；激活态/显隐态一律行内样式或行内自定义属性驱动，禁 styled 动态类插值与属性选择器；全文件禁 `scrollIntoView`；队列翻页屏守卫与 motion 令牌名单断言落 `style.test.mjs`
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 全站动画只做「被照亮/被写下」的克制动效；audio-player 是站点专属组件例外（关键帧与 `--motion-*` 引用自持，`ghostIn`/`writeIn` 先例）；禁 JS scroll/resize 监听；reduced-motion 必须降级
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只走主题变量 + `color-mix`；字体只用三语义 token（衬线 `--font-serif`）；断点只用 BREAKPOINTS 语义常量；禁跨组件插值选择器
  - 适用 scope: packages/components

## 决策

- **选型:** 方案 B「三层墨阶 · 竖排五列两翼 · 激活居左」——墨痕歌词**立轴化 + 两翼散布**（2026-10-05 三轮竖排、四轮散布、五轮加密、六轮换位定稿：横排被封面遮挡、三站稀疏单薄、右缘已有队列翻页屏故激活态移左）：歌词窗口 **5 句** = 五处独立竖排「站点」——**左翼 3 列（当前侧，浓墨）**：当前句 27%/6%（Z 0 · 墨 15%）、前一句 16%/14%（Z −130 · 墨 5.5%）、前二句 6%/30%（Z −260 · 墨 4.2%），对角线 ↘ 递远；**右翼 2 列（淡墨回声）**：前三句 64.5%/6%（Z −340 · 墨 3.4%）、前四句 73%/13%（Z −400 · 墨 2.6%），行内 `perspective(1000px)` 缩至 ~88% / ~79% / ~75% / ~71%，blur 0 / 1 / 1.5 / 2 / 2.4px 递进；字号 clamp(26px, 2.9vw, 40px) 保行气，长句尾部列内 mask 渐隐（墨尽）收尾；换句 = 各站文字**原地重挂载 ghostIn 浮入**（起点 = 站深 −150px + 墨透明 + blur 加深，铁律①），沿生产既有重挂载机制，无跨站位移（迁移会横穿封面区背后）
- **对比方案:** ① A 双层轻改——只给现有两层加深度差（弃：两阶纵深弱，「一句一句沉入纸背」的推进感出不来）；② C 3D 场景化——GhostLayer 整体 rotateX 仰角 + 墨点粒子（弃：与队列翻页屏同框双 3D 源互相干扰，动频高抢戏，偏离「被照亮/被写下」克制动效语言）
- **理由:** 用户在「墨阶纵深 / 书写墨晕 / 字牌翻卷」三个画面方向中选定墨阶纵深；三层是纵深可感知的最小层数。**3D 投影由每句 GhostLine transform 自带 `perspective(1000px)` 函数承担**——GhostLayer 的 `overflow: hidden` 属 grouping 属性，会使 `transform-style: preserve-3d` 静默失效（视觉稿原型实测踩中，铁律②变体），故不依赖祖先透传、对 Panel 与队列翻页屏零接触；深度/墨色/blur/top 全走行内自定义属性（激活态纪律）。窗口由既有 `lyricIdx` useMemo 同式扩展（`lyrics[lyricIdx-2..lyricIdx]`，与 `epiPrev`/`epiAct` 派生同构），零新增 scroll/resize 监听。关键实现约束：GhostLine key 改按句稳定标识（`ghost-${句索引}`）——换句时已挂载句**保留 DOM 节点走 transition 退阶**，新当前句重挂载走浮入动画（起点深度=旧档位深度，遵守铁律①首帧零跳变）；`transform` 组合 `perspective(1000px) translateX(var(--ghost-tx)) translateZ(var(--ghost-z))`，站点锚点/字号/字距/限高经行内自定义属性挂载时落位——站点静态、无运行时位移、无布局位移类动画。

## 任务

### Phase 1
- [x] GhostLine 竖排五列两翼·激活居左（`writing-mode: vertical-rl`；站点锚点/字号/字距/限高经行内自定义属性——左翼当前句 27%/6%、前一句 16%/14%、前二句 6%/30%，右翼前三句 64.5%/6%、前四句 73%/13%，均验证与封面/题名带/题跋/队列屏净空）+ transform 自带 `perspective(1000px)` 投影函数 + 深度档静态规则消费 `var(--ghost-tx/--ghost-z/--ghost-ink/--ghost-blur)`；GhostLayer 保持既有裁切与显隐不动，禁走 preserve-3d 透传路径（overflow: hidden 使其静默失效） — `packages/components/audio-player/PlayerPanel.tsx` — 改写
- [x] 五站派生（act / act−1 … act−4，由既有 `lyricIdx` useMemo 同式扩展）+ key 按站+句索引：换句各站重挂载触发 ghostIn 浮入（起点 = 站深 −150px + 墨透明 + blur 加深），沿生产既有重挂载机制 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
- [x] 深度编排常量：站点锚点（27%/6%、16%/14%、6%/30%、64.5%/6%、73%/13%）、Z 0/−130/−260/−340/−400（行内 perspective(1000px)）、墨 15%/5.5%/4.2%/3.4%/2.6%、blur 0/1/1.5/2/2.4px、浮入升幅 150px；换句节奏沿 ghostIn ~1.6s 语言，时长/缓动只引用站点注入五令牌名单；站点锚点为静态百分比——无运行时位移换算、无布局位移类动画、零 scroll/resize 监听 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
- [x] reduced-motion 瞬切降级扩展（animation + transition 均 none）；显隐条件、`aria-hidden`、移动端 `display:none` 保持不变 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
### Phase 2
- [x] 守卫：GhostLine transform 内 `perspective(` 投影函数在场；墨阶深度档与站点锚点常量钉死；motion 令牌引用完整性断言覆盖墨痕层；reduced-motion 双降级在场 — `packages/components/audio-player/style.test.mjs` — 新增
### Phase 3
- [x] audio-player 守卫测试 + 根 tsc + oxlint 全绿；四主题 × 明暗目测 + reduced-motion（本地 dev） — `packages/components/audio-player` — 验证

## 结果

- 实际耗时: 约 2.5h（含原型七轮迭代）
- 验证: audio-player 守卫 55/55（含五列站点常量/行内投影/重挂载 key/reduced-motion 断言）+ 域内 tsc 清零 + 根 tsc 净 + oxlint 0 错；PR #469 squash 合入 main（1d733e7），随 v1.4.58 部署全绿（https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.58，CI-CD run 37312669442 三跑后 success——前两次为主机 OOM/SSH 255 偶发）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 「墨痕歌词」结论段需从「两层交叠渐变」更新为「竖排五列两翼·激活居左三阶墨阶」（站点锚点/深度编排/遮挡净空一并沉淀），执行约束补 GhostLine 行内 `perspective()` 投影与深度档/站点常量守卫条目；另把两条新实锤陷阱补进 3D 铁律——① **grouping 属性（overflow: hidden / filter / opacity<1）使 `preserve-3d` 静默失效，被裁切层的子级 3D 应用行内 `perspective()` 函数**（原型实测 translateZ 全程压扁，铁律②变体）；② **隐藏/冻结态 `clientHeight` 可读 0**——任何按层高换算位移的实现须做非零兜底（原型实测，站点模型已无此依赖，教训留档）；更新时写明 verified-depth（unit 守卫 + 实现走查）
