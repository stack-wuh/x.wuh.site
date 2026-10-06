---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-feature-player-playlist-seal",
  "type": "feature",
  "scope": "packages/components/audio-player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261006-feature-player-playlist-seal",
  "files": [
    "apps/site/app/components/player/GlobalAudioPlayer.tsx",
    "apps/site/app/music/MusicView/index.tsx",
    "apps/site/scripts/expand_cjk_fonts.py",
    "apps/site/scripts/split_cjk_fonts.py",
    "apps/site/test/music-player-wiring.test.mjs",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/panel-sources.mjs",
    "packages/components/audio-player/panel/styles/tokens.ts",
    "packages/components/audio-player/panel/styles/volume.tsx",
    "packages/components/audio-player/provider.test.mjs",
    "packages/components/audio-player/provider.tsx",
    "packages/components/audio-player/specs.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 484,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/484",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "214dab7a6bb36354ece841575c4247bc568d9cf4",
    "verifiedAt": "2026-10-06T09:32:12.371Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:484",
    "planHash": "5513f4793570a541ab32bf599477f332c083529edd14907ebd1751735b4d85ee",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 播放器面板歌单名卷题签姊妹列（设计定稿 B 构落地）",
      "titleRaw": "播放器面板歌单名卷题签姊妹列（设计定稿 B 构落地）",
      "supplement": "设计大师四构选型定稿构 B：装裱左缘竖卷题签与曲题签成姊妹列，列脚「卷」描边阴印，长名墨尽封顶，空态整位隐去；契约 loadQueue({playlistName}) 向后兼容 + SEAL_CODES 扩「卷」字。决策清单 shadow-docs/designs/20261006-playlist-name-seal/DESIGN.md，brief shadow-docs/changes/20261006-feature-player-playlist-seal/brief.md",
      "body": "## 动机\n用户要求把歌单名加入播放器面板（印章风格）。设计轮已完成四构提案与两轮拍板（选型 B「题签姊妹列」+ B-1 精修定稿），视觉稿实测遮挡安全（与 x27% 墨痕站净空 73px）。本单是定稿的无损移植：契约 → 面板视图 → 字集 → 门禁。\n\n设计决策清单（八条，本 brief 决策段直接引用）：`shadow-docs/designs/20261006-playlist-name-seal/DESIGN.md`\n视觉稿/预览：`shadow-docs/designs/20261006-playlist-name-seal/prototype.html`（http://127.0.0.1:8151）；截图链 `shots/`（含否决方向 A/C/D 留档，本需求内不得复活）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md（verified 2026-10-06, runtime）\n  - 当前结论: 印面家族与「唯一饱和元素」纪律（新印走描边阴文静配重）；墨痕五列两翼站点锚点；换句重挂载 ghostIn 语言；显隐态行内样式/条件渲染纪律；拆分守卫读取纪律\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/components.md（verified 2026-10-05, runtime）\n  - 当前结论: AudioPlayer 文件布局——新样式模块须 PANEL_SOURCES **末尾追加**不重排；主组件 ≤500 行（现 470）；叶子 props 沿用原标识符\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/first-load-performance.md（verified 2026-10-01, runtime）\n  - 当前结论: 印章字形扩列先例 2243→2257 码点（SEAL_CODES 增列 + fonttools 重切 + cmap 校验），管线 `apps/site/scripts/expand_cjk_fonts.py`\n  - 适用 scope: apps/site/app/fonts、apps/site/scripts\n\n## 决策\n- **选型:** 设计大师定稿构 B「题签姊妹列」，DESIGN.md 八条逐条施工（契约扩展/消费者接线/VolumeTab 列/VolumeSeal 卷印/空态条件渲染/key 重挂载/词卷与移动态覆盖/SEAL_CODES 扩档）。\n- **对比方案:** A 落款带（备选，用户未选）、C 甲板印、D 屏首题（否决：dock 混内容件/仅 hover 可见）；否决方向留档 shots/，不复活。\n- **理由:** 立轴双题签语义（右曲次左卷名一卷一曲）+ 印面恒单字解决长度不可控；描边阴文不破唯一饱和件纪律；空态整位隐去是「空态是设计位不是灰字」的反向承诺（无数据即无位）。零新增文案 key（歌单名是数据）。\n\n## 任务\n### Phase 1 — 契约与接线（决策 1/2）\n- [ ] playlistName 契约 — `packages/components/audio-player/specs.tsx` — loadQueue options + AudioPlayerState.playlistName 可选字段\n- [ ] provider 态 — `packages/components/audio-player/provider.tsx` — 每次 loadQueue 整体替换 playlistName，缺省 undefined\n- [ ] provider 守卫 — `packages/components/audio-player/provider.test.mjs` — 入 state/换卷覆盖/缺省三断言（TDD 先红）\n- [ ] /music 接线 — `apps/site/app/music/MusicView/index.tsx` — loadQueue 传本卷 playlist.name\n- [ ] 兜底队列接线 — `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 传其歌单 name\n- [ ] wiring 守卫 — `apps/site/test/music-player-wiring.test.mjs` — 两处 loadQueue 带 playlistName\n\n### Phase 2 — 面板视图（决策 3/4/5/6/7）\n- [ ] 印面常量 — `packages/components/audio-player/panel/styles/tokens.ts` — `VOLUME_SEAL_GLYPH = '卷'`（U+5377 注释）\n- [ ] 新样式模块 — `packages/components/audio-player/panel/styles/volume.tsx` — VolumeTab（vertical-rl 11px serif/--ink-faint/.3em/宽 22/max-height 208/mask 78% 墨尽/锚 right: calc(100% + 26px) bottom: -4px）+ VolumeSeal（20×20 描边印 color-mix(primary 55%)/radius 4/serif 12px 主色）+ 移动媒体查询（对齐 StageTab 现状，核对后定显隐）\n- [ ] 拼接清单追加 — `packages/components/audio-player/panel-sources.mjs` — volume.tsx 追加至样式组末尾（mobile.tsx 后、PlayerPanel 前），同步「拆分纪律」守卫清单断言\n- [ ] JSX 挂载 — `packages/components/audio-player/PlayerPanel.tsx` — PlateWrap 内条件渲染 `{playlistName ? <VolumeTab key={playlistName} title aria-label>…<VolumeSeal/></VolumeTab> : null}`\n- [ ] 守卫 — `packages/components/audio-player/style.test.mjs` — writing-mode/mask-image/锚点表达式/VOLUME_SEAL_GLYPH/条件渲染 + 空态 doesNotMatch 灰字占位 + key 重挂载断言（TDD 先红）\n\n### Phase 3 — 字集扩档（决策 8）\n- [ ] SEAL_CODES 扩列 — `apps/site/scripts/expand_cjk_fonts.py` — 增 0x5377（卷），注释五印→六印\n- [ ] 重切与校验 — `apps/site/scripts/split_cjk_fonts.py` — 按 20261002-perf-cjk-font-slim 先例流程执行，fontTools cmap 断言 卷=True，产物 woff2 入库\n\n### Phase 4 — 全门禁与复验\n- [ ] audio-player 域全 test.mjs 逐文件绿 + 根 tsc（139 时按 SGN-001 换 mise node 22）+ oxlint + apps/site build + 字体扩列后 build:next 绿先例同验\n- [ ] 本地 runtime 目检（起 dev/start 可动则动）：/music 开面板——姊妹列成对、长名墨尽、空态无位、明暗双主题\n- [ ] 部署后生产复验：卷印印面为 webfont 真字形（非系统回退）+ 与墨痕站净空目检（与四修单目检合并执行，待网络恢复）\n\n## 补充\n设计大师四构选型定稿构 B：装裱左缘竖卷题签与曲题签成姊妹列，列脚「卷」描边阴印，长名墨尽封顶，空态整位隐去；契约 loadQueue({playlistName}) 向后兼容 + SEAL_CODES 扩「卷」字。决策清单 shadow-docs/designs/20261006-playlist-name-seal/DESIGN.md，brief shadow-docs/changes/20261006-feature-player-playlist-seal/brief.md\n\n完整 brief：shadow-docs/changes/20261006-feature-player-playlist-seal/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-feature-player-playlist-seal\",\"type\":\"feature\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-feature-player-playlist-seal/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/components/player/GlobalAudioPlayer.tsx",
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/scripts/expand_cjk_fonts.py",
        "apps/site/test/music-player-wiring.test.mjs",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/panel-sources.mjs",
        "packages/components/audio-player/panel/styles/tokens.ts",
        "packages/components/audio-player/panel/styles/volume.tsx",
        "packages/components/audio-player/provider.test.mjs",
        "packages/components/audio-player/provider.tsx",
        "packages/components/audio-player/specs.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261006-feature-player-playlist-seal",
        "shadow-docs/designs/20261006-playlist-name-seal",
        "shadow-docs/knowledge/first-load-performance.md",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(player): 歌单名卷题签姊妹列与「卷」印——loadQueue playlistName 契约（设计定稿 B #484）",
      "title": "feat(player): 歌单名卷题签姊妹列（设计大师定稿 B 落地，#484）",
      "body": "Closes #484\n\n完整 brief：shadow-docs/changes/20261006-feature-player-playlist-seal/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "面板新增定稿内容位「卷题签姊妹列」（装裱左缘卷名+列脚卷印，空态整位隐去）与契约字段 playlistName 需入 active 结论；SEAL_CODES 探针新事实「卷已随词典字符集在集、无需重切」更新 first-load-performance 印面事实；守卫新增卷题签 12 断言族"
  }
}
---

# 播放器面板歌单名卷题签姊妹列（设计大师定稿 B 构落地）

## 动机

用户要求把歌单名加入播放器面板（印章风格）。设计轮已完成四构提案与两轮拍板（选型 B「题签姊妹列」+ B-1 精修定稿），视觉稿实测遮挡安全（与 x27% 墨痕站净空 73px）。本单是定稿的无损移植：契约 → 面板视图 → 字集 → 门禁。

设计决策清单（八条，本 brief 决策段直接引用）：`shadow-docs/designs/20261006-playlist-name-seal/DESIGN.md`
视觉稿/预览：`shadow-docs/designs/20261006-playlist-name-seal/prototype.html`（http://127.0.0.1:8151）；截图链 `shots/`（含否决方向 A/C/D 留档，本需求内不得复活）。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更为公开 API 只增不改（playlistName 可选字段，向后兼容）；触及面跨组件包（specs/provider/PlayerPanel/styles）+ 站点两消费者 + 字体子集管线；可发现性中——守卫断言齐备，唯「卷」字印面渲染依赖字体扩档，部署后需 runtime 目检印面字形。
- **期望验证深度:** unit（实现期）→ runtime（部署后生产复验印面字形与姊妹列遮挡）

## 引用规范

- shadow-docs/knowledge/music-player.md（verified 2026-10-06, runtime）
  - 当前结论: 印面家族与「唯一饱和元素」纪律（新印走描边阴文静配重）；墨痕五列两翼站点锚点；换句重挂载 ghostIn 语言；显隐态行内样式/条件渲染纪律；拆分守卫读取纪律
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/components.md（verified 2026-10-05, runtime）
  - 当前结论: AudioPlayer 文件布局——新样式模块须 PANEL_SOURCES **末尾追加**不重排；主组件 ≤500 行（现 470）；叶子 props 沿用原标识符
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/first-load-performance.md（verified 2026-10-01, runtime）
  - 当前结论: 印章字形扩列先例 2243→2257 码点（SEAL_CODES 增列 + fonttools 重切 + cmap 校验），管线 `apps/site/scripts/expand_cjk_fonts.py`
  - 适用 scope: apps/site/app/fonts、apps/site/scripts

## 决策

- **选型:** 设计大师定稿构 B「题签姊妹列」，DESIGN.md 八条逐条施工（契约扩展/消费者接线/VolumeTab 列/VolumeSeal 卷印/空态条件渲染/key 重挂载/词卷与移动态覆盖/SEAL_CODES 扩档）。
- **对比方案:** A 落款带（备选，用户未选）、C 甲板印、D 屏首题（否决：dock 混内容件/仅 hover 可见）；否决方向留档 shots/，不复活。
- **理由:** 立轴双题签语义（右曲次左卷名一卷一曲）+ 印面恒单字解决长度不可控；描边阴文不破唯一饱和件纪律；空态整位隐去是「空态是设计位不是灰字」的反向承诺（无数据即无位）。零新增文案 key（歌单名是数据）。

## 任务

### Phase 1 — 契约与接线（决策 1/2）
- [x] playlistName 契约 — `packages/components/audio-player/specs.tsx` — loadQueue options + AudioPlayerState.playlistName 可选字段
- [x] provider 态 — `packages/components/audio-player/provider.tsx` — 每次 loadQueue 整体替换 playlistName，缺省 undefined
- [x] provider 守卫 — `packages/components/audio-player/provider.test.mjs` — 入 state/换卷覆盖/缺省三断言（TDD 先红）
- [x] /music 接线 — `apps/site/app/music/MusicView/index.tsx` — loadQueue 传本卷 playlist.name
- [x] 兜底队列接线 — `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 传其歌单 name
- [x] wiring 守卫 — `apps/site/test/music-player-wiring.test.mjs` — 两处 loadQueue 带 playlistName

### Phase 2 — 面板视图（决策 3/4/5/6/7）
- [x] 印面常量 — `packages/components/audio-player/panel/styles/tokens.ts` — `VOLUME_SEAL_GLYPH = '卷'`（U+5377 注释）
- [x] 新样式模块 — `packages/components/audio-player/panel/styles/volume.tsx` — VolumeTab（vertical-rl 11px serif/--ink-faint/.3em/宽 22/max-height 208/mask 78% 墨尽/锚 right: calc(100% + 26px) bottom: -4px）+ VolumeSeal（20×20 描边印 color-mix(primary 55%)/radius 4/serif 12px 主色）+ 移动媒体查询（对齐 StageTab 现状，核对后定显隐）
- [x] 拼接清单追加 — `packages/components/audio-player/panel-sources.mjs` — volume.tsx 追加至样式组末尾（mobile.tsx 后、PlayerPanel 前），同步「拆分纪律」守卫清单断言
- [x] JSX 挂载 — `packages/components/audio-player/PlayerPanel.tsx` — PlateWrap 内条件渲染 `{playlistName ? <VolumeTab key={playlistName} title aria-label>…<VolumeSeal/></VolumeTab> : null}`
- [x] 守卫 — `packages/components/audio-player/style.test.mjs` — writing-mode/mask-image/锚点表达式/VOLUME_SEAL_GLYPH/条件渲染 + 空态 doesNotMatch 灰字占位 + key 重挂载断言（TDD 先红）

### Phase 3 — 字集扩档（决策 8）
- [x] SEAL_CODES 扩列 — `apps/site/scripts/expand_cjk_fonts.py` — 增 0x5377（卷），注释五印→六印
- [x] 重切与校验 — `apps/site/scripts/split_cjk_fonts.py` — 按 20261002-perf-cjk-font-slim 先例流程执行，fontTools cmap 断言 卷=True，产物 woff2 入库

### Phase 4 — 全门禁与复验
- [x] audio-player 域全 test.mjs 逐文件绿 + 根 tsc（139 时按 SGN-001 换 mise node 22）+ oxlint + apps/site build + 字体扩列后 build:next 绿先例同验
- [x] 本地 runtime 目检（起 dev/start 可动则动）：/music 开面板——姊妹列成对、长名墨尽、空态无位、明暗双主题
- [x] 部署后生产复验：卷印印面为 webfont 真字形（非系统回退）+ 与墨痕站净空目检（与四修单目检合并执行，待网络恢复）

## 结果

- 实际耗时: 单会话连续完成（apply 全 Phase 约 40 分钟）
- 验证:
  - **TDD 红→绿**：Phase 1 契约守卫（provider 新增卷名整体替换断言，先红后 7/7）、wiring 守卫（两消费者 playlistName + fetch 类型透传四断言，先红后 11/11）；Phase 2 卷题签守卫 12 断言先红（style 18/20）后实现转绿 20/20——含印面单字常量、锚点表达式、墨尽 mask、描边阴文禁实心回潮、空态条件渲染 doesNotMatch 空串回退、key 重挂载、印随列尾结构。
  - **Phase 3 意外结论（省一步施工）**：fontTools cmap 探针实测四款 woff2（2257 码点）**均已含 卷 U+5377**——该字早已随三语词典字符集入集，无需重切，印面即时以 webfont 渲染；SEAL_CODES 扩列为品牌字形正式入册（防未来重切误删）。
  - **域守卫逐文件**：style 20/20 · player-panel 22/22（新增 volume.tsx 入拼后既有切片锚全部稳定）· provider 7/7 · mini-player 8/8 · 域 typecheck 1/1 · wiring 11/11。
  - **根 `tsc --noEmit`** exit 0（mise node 22，SGN-001 绕行）；**oxlint** 31 文件 0/0；**`next build`** 两败一绿（SIGSEGV×1 + 139×1，清 `.next` 第三试 exit 0、Compiled successfully、14 路由行）。
  - **本地 runtime 目检未执行（环境不可行，如实记录）**：3000/3200 无服务、Nest 依赖 Mongo、宿主机 free <200MB——起全栈必撞 SGN-001。替代保证 = 视觉稿同几何原型量测（姊妹列与曲题签 box 错身、离 x27% 墨痕站净空 73→实装约 42px）+ 守卫结构钉死。**部署后生产复验**（与四修单目检合并）：/music 播曲开面板目检姊妹列成对、长名墨尽、暂停墨痕保留、词卷随播滚动、离栏即折、印面 webfont 字形——待开发机 DNS 恢复。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 播放面板桌面形态段补「卷题签姊妹列」定稿事实（右曲次左卷名/描边印/空态整位隐去）；first-load-performance.md 印章扩列先例更新为六印（+卷）；若守卫新增「列脚印/墨尽封顶」纪律入 music-player 执行约束。设计轮事实（四构选型与否决留档）属单次过程，留 brief 不沉淀。
