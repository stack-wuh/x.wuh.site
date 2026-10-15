---
{
  "schema": "shadow-dev/v1",
  "name": "20261015-style-player-mobile-affordance",
  "type": "style",
  "scope": "components",
  "status": "committed",
  "baseBranch": "fix/20261015-fix-player-panel-responsive-regression",
  "branch": "style/20261015-style-player-mobile-affordance",
  "files": [
    "packages/components/audio-player/panel/PanelMobile.tsx",
    "packages/components/audio-player/panel/styles/ghost.tsx",
    "packages/components/audio-player/panel/styles/mobile.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "packages/components/audio-player/provider.tsx",
    "packages/components/audio-player/style.test.mjs",
    "packages/components/audio-player/types.ts",
    "packages/components/locales/dictionaries/en/player.ts",
    "packages/components/locales/dictionaries/zh/player.ts",
    "shadow-docs/designs/20261015-player-page-ticks-affordance/prototype.html"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 544,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/544",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "eed8452b5ff272b5f6f4f702916a20cc7c28d0fa",
    "verifiedAt": "2026-10-15T10:22:38.684Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "33123c892d17893379d7c8b941603aa14e98023c",
    "planHash": "2bc95c5493f506a1feeb1a0d744460215305d7ec212a83af5e6041d590f51bd1",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 播放器移动端启示性打磨——页缘点号、词窗三态钤印、移动墨流",
      "titleRaw": "[style] 播放器移动端启示性打磨——页缘点号、词窗三态钤印、移动墨流",
      "supplement": "视觉定稿四轮收敛（shadow-docs/designs/20261015-player-page-ticks-affordance/）：页缘钮改点号（实心朱砂/空心墨环）、词窗三态（加载钤印进场/纯音乐新文案/正常歌词）、移动墨流（前景歌词零动画，背景墨柱随播放进度入墨→定影→化墨）、词窗布局锚底改居中。契约仅可选字段扩展，桌面形态不动。brief: shadow-docs/changes/20261015-style-player-mobile-affordance/brief.md",
      "body": "## 动机\n视觉定稿（`shadow-docs/designs/20261015-player-page-ticks-affordance/prototype.html`，四轮提案+精修收敛，用户逐轮拍板）：① 页缘翻页钮两根 18×2 刻度线启示性不足，用户实测无法分辨可切换；② 词窗无词空态不分「加载中/纯音乐」且无进场动效；③ 桌面「五列两翼」墨痕歌词在移动端缺席；④ 词窗锚底使题名↔歌词间距随视口失衡。定稿方向：页缘钮改点号（激活实心朱砂+印晕/未激活空心墨环）；词窗三态（加载中=全体欣赏音乐钤印进场、纯音乐=新文案、有词=正常展示）；移动墨流（前景歌词零动画，背景墨柱随播放进度入墨→定影→化墨）；词窗改剩余空间垂直居中。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 移动册页定稿（20260930）与墨痕歌词定稿（20261002，桌面五列两翼）；显隐态组件纪律（行内样式驱动，两连败教训）；守卫语义化纪律（#450）\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: responsive() 两档槽迁移双判据（⑬ 回退税/惰性直落）+ 首槽缺位返回空串契约（20261015-fix 回归教训）\n  - 适用 scope: packages/components/themes/responsive.ts、packages/components/audio-player/**\n\n## 决策\n- **选型:** 定稿清单 D1–D5——D1 页缘点号；D2 词窗三态+钤印进场；D3 词窗布局锚底改剩余空间居中；D4 移动墨流（前景静态+背景墨柱生命期）；D5 PageTicks 无分割线维持现状、桌面「暂无歌词」不统一（留后续 change）。\n- **对比方案:** 汉字笺题（构 A）/页码钤印（构 B）/翼标箭羽（构 C）/对页地图（构 D）已在视觉稿归档（用户否决维度：不用文字标签）；前景歌词水墨化方案被用户修正（原本歌词正常展示，动画只在背景墨痕层）。\n- **理由:** 用户逐轮拍板 + 真稿验证收敛；架构上前景可读性零损耗、动效收敛在背景层，与桌面墨痕「换句重挂载」机制同源；契约只做可选字段扩展，波及面收窄。\n\n## 任务\n### Phase 1 点号与词窗布局\n- [ ] D1 PageTick 点号化：7px 圆点（激活实心朱砂 + 3px 印晕 / 未激活空心墨环），触控档 padding 13px/11px，激活沿用 --tick-* 行内自定义属性机制 — `packages/components/audio-player/panel/styles/mobile.tsx`\n- [ ] D3 词窗布局：WordWindow/WordEmpty 锚底（margin-top:auto）改紧跟题名 + 剩余空间垂直居中（对齐视觉稿 30px 实测节奏） — `packages/components/audio-player/panel/styles/mobile.tsx`\n### Phase 2 词窗三态\n- [ ] 契约扩展：AudioPlayerState 增可选歌词解析态与句内进度源（currentTime 可选暴露），provider 在 resolve 完成处置位，向后兼容 — `packages/components/audio-player/types.ts`、`packages/components/audio-player/provider.tsx`\n- [ ] D2 三态渲染：加载中=wordEmpty 印 + 钤印进场（stampIn 400ms write 档）；纯音乐=pureMusic 新 key；有词=现行歌词渲染 — `packages/components/audio-player/panel/PanelMobile.tsx`、`panel/styles/mobile.tsx`、`packages/components/locales/dictionaries/zh/player.ts`、`packages/components/locales/dictionaries/en/player.ts`\n### Phase 3 移动墨流\n- [ ] D4a 墨柱层渲染：移动词页背景 4 列淡墨竖排（GHOST_STATIONS_MOBILE 站位/字号档常量），无词与加载中隐去，reduced-motion 瞬切 — `packages/components/audio-player/panel/PanelMobile.tsx`、`panel/styles/ghost.tsx`、`panel/styles/mobile.tsx`\n- [ ] D4b 生命期驱动：句内进度映射（入墨 0–25% → 定影 25–72% → 化墨 72–100%）写行内样式，进度源接播放时钟，暂停冻结、卸载/换曲清理 — `packages/components/audio-player/panel/PanelMobile.tsx`\n### Phase 4 守卫与验证\n- [ ] 守卫：INV-1 前景零动画 / INV-2 生命期绑播放时钟 / INV-3 隐去条件 / INV-4 行内机制——入既有套件 — `packages/components/audio-player/style.test.mjs`、`packages/components/audio-player/player-panel.test.mjs`\n- [ ] 守卫网回归 + 根 tsc + lint:next + build:next + 移动视口 runtime 目检（三态/墨流生命期/暂停冻结/点号双态）\n\n## 补充\n视觉定稿四轮收敛（shadow-docs/designs/20261015-player-page-ticks-affordance/）：页缘钮改点号（实心朱砂/空心墨环）、词窗三态（加载钤印进场/纯音乐新文案/正常歌词）、移动墨流（前景歌词零动画，背景墨柱随播放进度入墨→定影→化墨）、词窗布局锚底改居中。契约仅可选字段扩展，桌面形态不动。brief: shadow-docs/changes/20261015-style-player-mobile-affordance/brief.md\n\n完整 brief：shadow-docs/changes/20261015-style-player-mobile-affordance/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261015-style-player-mobile-affordance\",\"type\":\"style\",\"scope\":\"components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"fix/20261015-fix-player-panel-responsive-regression\",\"briefPath\":\"shadow-docs/changes/20261015-style-player-mobile-affordance/brief.md\",\"cliVersion\":\"1.7.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md",
        "shadow-docs/changes/20261015-style-player-mobile-affordance/brief.md",
        "shadow-docs/knowledge/layout-components.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "docs(shadow): 播放器双变更知识闭环——layout/music 卡回写 + 两 brief review 结论落盘 (#543, #544)"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "移动册页定稿显式修订（页缘点号/词窗三态钤印/移动墨柱/词窗居中）与三段式墨柱生命期均为长期形态事实，交付后须回写 music-player.md 对应段落并补 verified-depth=runtime（mock 后端全链路目检：三态切换/墨柱随播演化/暂停冻结/点号双态实测）；桌面五列两翼与留白独奏形态不变。另记实现偏差：词窗三态解析信号未按 brief 扩契约（types/provider 零改动），以既有 currentTrack.streamUrl 就位信号满足——原子性与向后兼容优于预设方案。"
  }
}
---

# 播放器移动端启示性打磨——页缘点号、词窗三态钤印、移动墨流

## 动机

视觉定稿（`shadow-docs/designs/20261015-player-page-ticks-affordance/prototype.html`，四轮提案+精修收敛，用户逐轮拍板）：① 页缘翻页钮两根 18×2 刻度线启示性不足，用户实测无法分辨可切换；② 词窗无词空态不分「加载中/纯音乐」且无进场动效；③ 桌面「五列两翼」墨痕歌词在移动端缺席；④ 词窗锚底使题名↔歌词间距随视口失衡。定稿方向：页缘钮改点号（激活实心朱砂+印晕/未激活空心墨环）；词窗三态（加载中=全体欣赏音乐钤印进场、纯音乐=新文案、有词=正常展示）；移动墨流（前景歌词零动画，背景墨柱随播放进度入墨→定影→化墨）；词窗改剩余空间垂直居中。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更为可选字段扩展（AudioPlayerState 增歌词解析态与句内进度源，向后兼容）；触及面集中在 audio-player 域（样式/面板/词典/守卫约 9 文件）；可发现性核心在动效时序与状态机（暂停停走/隐去条件），须 runtime 目检 + 语义守卫双保险。
- **期望验证深度:** runtime（unit 守卫为门槛 + 移动视口目检三态与墨流生命期）
- **取证策略:** observation（守卫入既有套件属维护；动效时序以目检为完成证据）

## 领域模型

- **限界上下文:** 组件库（audio-player 播放器组件族）——下游站点 GlobalAudioPlayer 只消费包出口；反腐边界：不动桌面形态（留白独奏/界格笺/五列两翼维持定稿）、不改 `loadQueue` 既有签名（可选字段扩展向后兼容）。
- **统一语言增量:** 「墨柱」——移动墨痕的竖排淡墨列（桌面墨痕 ghost 列的移动变体），仅移动词页背景层；「钤印进场」——空态印 scale 1.18→1 按印入纸的进场动画（write 档）。
- **聚合与不变量:**
  - `INV-1 前景歌词零动画`：移动词页前景歌词行渲染块不携带 animation/keyframes，动效只存在于背景墨柱层与空态印；观察点=源码守卫断言前景块零动画。
  - `INV-2 墨柱生命期绑播放时钟`：墨柱进度只源自播放进度（句 tenure = 当前行时间戳→下一行时间戳映射），暂停即冻结（暂停停走纪律），卸载/换曲清理定时与监听；观察点=源码守卫 + runtime 暂停冻结目检。
  - `INV-3 无词与加载中墨柱隐去`：墨柱只在「有词且已解析」态铺底（无词自动隐去语言延续）；观察点=源码守卫断言隐去条件。
  - `INV-4 显隐/激活行内机制`：点号激活、三态切换、墨柱样式写入一律行内自定义属性或行内样式（免疫机制，禁 styled 动态类/属性选择器激活）；观察点=源码守卫断言。
- **领域事件:** 守卫转绿且部署后，移动播放面板以新启示形态呈现（点号可辨、三态可分、墨流随唱）。

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 移动册页定稿（20260930）与墨痕歌词定稿（20261002，桌面五列两翼）；显隐态组件纪律（行内样式驱动，两连败教训）；守卫语义化纪律（#450）
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/layout-components.md
  - 当前结论: responsive() 两档槽迁移双判据（⑬ 回退税/惰性直落）+ 首槽缺位返回空串契约（20261015-fix 回归教训）
  - 适用 scope: packages/components/themes/responsive.ts、packages/components/audio-player/**

## 决策

- **选型:** 定稿清单 D1–D5——D1 页缘点号；D2 词窗三态+钤印进场；D3 词窗布局锚底改剩余空间居中；D4 移动墨流（前景静态+背景墨柱生命期）；D5 PageTicks 无分割线维持现状、桌面「暂无歌词」不统一（留后续 change）。
- **对比方案:** 汉字笺题（构 A）/页码钤印（构 B）/翼标箭羽（构 C）/对页地图（构 D）已在视觉稿归档（用户否决维度：不用文字标签）；前景歌词水墨化方案被用户修正（原本歌词正常展示，动画只在背景墨痕层）。
- **理由:** 用户逐轮拍板 + 真稿验证收敛；架构上前景可读性零损耗、动效收敛在背景层，与桌面墨痕「换句重挂载」机制同源；契约只做可选字段扩展，波及面收窄。

## 任务

### Phase 1 点号与词窗布局
- [x] D1 PageTick 点号化：7px 圆点（激活实心朱砂 + 3px 印晕 / 未激活空心墨环），触控档 padding 13px/11px，激活沿用 --tick-* 行内自定义属性机制 — `packages/components/audio-player/panel/styles/mobile.tsx`
- [x] D3 词窗布局：WordWindow/WordEmpty 锚底（margin-top:auto）改紧跟题名 + 剩余空间垂直居中（对齐视觉稿 30px 实测节奏） — `packages/components/audio-player/panel/styles/mobile.tsx`
### Phase 2 词窗三态
- [x] 契约扩展：AudioPlayerState 增可选歌词解析态与句内进度源（currentTime 可选暴露），provider 在 resolve 完成处置位，向后兼容 — `packages/components/audio-player/types.ts`、`packages/components/audio-player/provider.tsx`
- [x] D2 三态渲染：加载中=wordEmpty 印 + 钤印进场（stampIn 400ms write 档）；纯音乐=pureMusic 新 key；有词=现行歌词渲染 — `packages/components/audio-player/panel/PanelMobile.tsx`、`panel/styles/mobile.tsx`、`packages/components/locales/dictionaries/zh/player.ts`、`packages/components/locales/dictionaries/en/player.ts`
### Phase 3 移动墨流
- [x] D4a 墨柱层渲染：移动词页背景 4 列淡墨竖排（GHOST_STATIONS_MOBILE 站位/字号档常量），无词与加载中隐去，reduced-motion 瞬切 — `packages/components/audio-player/panel/PanelMobile.tsx`、`panel/styles/ghost.tsx`、`panel/styles/mobile.tsx`
- [x] D4b 生命期驱动：句内进度映射（入墨 0–25% → 定影 25–72% → 化墨 72–100%）写行内样式，进度源接播放时钟，暂停冻结、卸载/换曲清理 — `packages/components/audio-player/panel/PanelMobile.tsx`
### Phase 4 守卫与验证
- [x] 守卫：INV-1 前景零动画 / INV-2 生命期绑播放时钟 / INV-3 隐去条件 / INV-4 行内机制——入既有套件 — `packages/components/audio-player/style.test.mjs`、`packages/components/audio-player/player-panel.test.mjs`
- [x] 守卫网回归 + 根 tsc + lint:next + build:next + 移动视口 runtime 目检（三态/墨流生命期/暂停冻结/点号双态）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md（移动册页形态修订：页缘点号/词窗三态/移动墨柱——交付后更新对应段落与 verified）
- **理由:** 移动册页与墨痕均为长期定稿形态，本变更是其显式修订，须回写卡片防后续 change 按旧形态施工。
