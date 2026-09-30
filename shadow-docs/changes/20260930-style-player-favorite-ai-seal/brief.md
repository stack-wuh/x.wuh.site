---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-style-player-favorite-ai-seal",
  "type": "style",
  "scope": "player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260930-style-player-favorite-ai-seal",
  "files": [
    "apps/site/app/fonts/files/NotoSansSC-400.woff2",
    "apps/site/app/fonts/files/NotoSansSC-700.woff2",
    "apps/site/app/fonts/files/NotoSerifSC-400.woff2",
    "apps/site/app/fonts/files/NotoSerifSC-700.woff2",
    "apps/site/scripts/expand_cjk_fonts.py",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "packages/components/audio-player/specs.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 443,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/443",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b116e81827a0ecc5de3ca489f97c9749d7d8e4f6",
    "verifiedAt": "2026-09-30T17:07:19.475Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:443",
    "planHash": "57e972eff95e804fcdb1049485386fc9481f102dfc07d5e4f54ab447be91db05",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 最爱曲目播放时进度印展示「愛」——印章字形与字体子集补齐",
      "titleRaw": "最爱曲目播放时进度印展示「愛」——印章字形与字体子集补齐",
      "supplement": "播放「最爱」标记曲目（本卷播放次数最高）时，面板进度印应展示「愛」而非「樂」：Progress 已有 glyph prop，PlayerPanel 侧按 /music 同口径（maxPlays>0 && playCount===maxPlays，含并列）判定并传 glyph；Track 类型补 playCount 可选字段（服务端契约镜像）。顺带修：樂/墨 两枚印章字形不在自托管 CJK 子集（一直系统回退渲染），并集补齐并落档扩列脚本。详见 shadow-docs/changes/20260930-style-player-favorite-ai-seal/brief.md",
      "body": "## 动机\n用户验收反馈（问题 5）：播放「最爱」标记曲目（本卷播放次数最高、/music 页打最爱标的这首）时，面板进度印应展示「愛」而非「樂」。核实中发现两处相邻事实：① `Progress` 组件已有 `glyph` prop（默认 `'樂'`），面板进度未传——改动收敛在 PlayerPanel 侧算最爱口径即可；② 品牌印章字形集里 樂(U+6A02)、墨(U+58A8) 不在自托管 CJK 子集（愛/念/音 在）——当前面板「樂」印与页头「墨」印一直由系统回退字体渲染，与 念/愛/音 的 webfont 印不一致，一并补齐。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 进度=白文方印「樂」（印光标归共享 `Progress` 组件，progressPct 直传禁二次 ×100）；播放契约 tracks 含可选 `playCount`（MUSIC_U 登录态联表 user_record 写入）；/music 最爱标记口径 = 本卷 playCount 最高\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: CJK 子集 2243 字（含假名与日文汉字），并集扩列配方有档（Noto CJK SubsetOTF、hinting=False、desubroutinize）；对千字级子集做 unicode-range 切片是负优化\n  - 适用 scope: apps/site/app/fonts\n\n## 决策\n- **选型:** PlayerPanel 以队列算最爱（`maxPlays = max(playCount ?? 0)`，`isFav = maxPlays > 0 && currentTrack?.playCount === maxPlays`——与 /music 徽标同口径，含并列曲目同样标爱），进度 `Progress` 传 `glyph={isFav ? '愛' : '樂'}`；音量印维持默认「樂」不动。`Track` 类型补 `playCount?: number`（服务端契约镜像）。字体子集并集补 樂(U+6A02)、墨(U+58A8) 两枚印章字形（愛/念/音 已在），扩列脚本落档 `apps/site/scripts/expand_cjk_fonts.py` 后重跑生成 4 个 woff2\n- **对比方案:** 最爱判定下沉 AudioPlayerProvider（provider 是纯播放状态机，口径属呈现层，否）；只补 樂 不补 墨（同一次子集重跑，两枚 fallback 字形一起修，增量可忽略）；愛 用简体「爱」（印章集为传统字形系——樂/愛/念 同构，用户写「爱」指语义非字形，取传统「愛」）\n- **理由:** `glyph` prop 契约现成，面板侧一个 `useMemo` 判定 + 类型 1 字段即完成；印形统一到 webfont 消除回退字体不一致；并列/缺省/0 边界与 /music 完全同口径，不引入第二套最爱语义\n\n## 任务\n### Phase 1\n- [ ] `Track` 增 `playCount?: number`（注释标明镜像 /v2/music 联表契约） — `packages/components/audio-player/specs.tsx`\n- [ ] PlayerPanel 队列最爱判定（useMemo）+ 进度印 glyph 愛/樂 切换；音量印不动 — `packages/components/audio-player/PlayerPanel.tsx`\n- [ ] 守卫：最爱口径断言（最高/并列/缺省 playCount/全 0）；进度 glyph 传参断言；Track.playCount 字段存在 — `packages/components/audio-player/player-panel.test.mjs`\n- [ ] 子集并集补 樂/墨 两码位，脚本落档后重跑 4 个 woff2，cmap 校验 樂/墨/愛/念/音 全在、其余码位不变 — `apps/site/scripts/expand_cjk_fonts.py`, `apps/site/app/fonts/files/NotoSansSC-400.woff2`, `apps/site/app/fonts/files/NotoSansSC-700.woff2`, `apps/site/app/fonts/files/NotoSerifSC-400.woff2`, `apps/site/app/fonts/files/NotoSerifSC-700.woff2`\n\n### Phase 2\n- [ ] audio-player 守卫全绿 + 根 `pnpm exec tsc --noEmit` + oxlint（SGN-001：139 空日志先等 20–45s 重试）\n- [ ] runtime：播放最爱曲目面板进度印=愛、切非最爱回樂、音量印恒樂；明暗双主题截图目检；`pnpm build:next` 产物字体哈希更新确认\n\n## 补充\n播放「最爱」标记曲目（本卷播放次数最高）时，面板进度印应展示「愛」而非「樂」：Progress 已有 glyph prop，PlayerPanel 侧按 /music 同口径（maxPlays>0 && playCount===maxPlays，含并列）判定并传 glyph；Track 类型补 playCount 可选字段（服务端契约镜像）。顺带修：樂/墨 两枚印章字形不在自托管 CJK 子集（一直系统回退渲染），并集补齐并落档扩列脚本。详见 shadow-docs/changes/20260930-style-player-favorite-ai-seal/brief.md\n\n完整 brief：shadow-docs/changes/20260930-style-player-favorite-ai-seal/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-style-player-favorite-ai-seal\",\"type\":\"style\",\"scope\":\"player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-style-player-favorite-ai-seal/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/fonts/files/NotoSansSC-400.woff2",
        "apps/site/app/fonts/files/NotoSansSC-700.woff2",
        "apps/site/app/fonts/files/NotoSerifSC-400.woff2",
        "apps/site/app/fonts/files/NotoSerifSC-700.woff2",
        "apps/site/scripts/expand_cjk_fonts.py",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "packages/components/audio-player/specs.tsx",
        "shadow-docs/changes/20260930-style-player-favorite-ai-seal/brief.md",
        "shadow-docs/knowledge/first-load-performance.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(player): 最爱曲目进度印换「愛」——印章字形补齐字体子集并落档扩列脚本 (#443)",
      "title": "style(player): 最爱曲目播放时进度印展示「愛」——印章字形与字体子集补齐 (#443)",
      "body": "Closes #443\n\n完整 brief：shadow-docs/changes/20260930-style-player-favorite-ai-seal/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "「进度=白文方印樂」段补最爱换印语义：本卷 playCount 最高曲目（与 /music 最爱徽标同口径，含并列）播放时进度印传 glyph=愛、音量印维持默认樂，Track 契约补 playCount 可选字段；连带实证印章字形集入子集（樂/墨补齐，五印全 webfont）"
  }
}
---

# 最爱曲目进度印「愛」——面板印章字形与字体子集补齐

## 动机

用户验收反馈（问题 5）：播放「最爱」标记曲目（本卷播放次数最高、/music 页打最爱标的这首）时，面板进度印应展示「愛」而非「樂」。核实中发现两处相邻事实：① `Progress` 组件已有 `glyph` prop（默认 `'樂'`），面板进度未传——改动收敛在 PlayerPanel 侧算最爱口径即可；② 品牌印章字形集里 樂(U+6A02)、墨(U+58A8) 不在自托管 CJK 子集（愛/念/音 在）——当前面板「樂」印与页头「墨」印一直由系统回退字体渲染，与 念/愛/音 的 webfont 印不一致，一并补齐。

## 复杂度评级

- **评级:** S
- **理由:** 契约变更——`Track` 增可选 `playCount?: number`（镜像服务端既有契约，加法）；触及面——audio-player 3 文件 + 字体子集产物 4 文件 + 脚本落档；可发现性——最爱口径 /music 页有现成实现（`maxPlays > 0 && playCount === maxPlays`），照搬即可。
- **期望验证深度:** runtime

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 进度=白文方印「樂」（印光标归共享 `Progress` 组件，progressPct 直传禁二次 ×100）；播放契约 tracks 含可选 `playCount`（MUSIC_U 登录态联表 user_record 写入）；/music 最爱标记口径 = 本卷 playCount 最高
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: CJK 子集 2243 字（含假名与日文汉字），并集扩列配方有档（Noto CJK SubsetOTF、hinting=False、desubroutinize）；对千字级子集做 unicode-range 切片是负优化
  - 适用 scope: apps/site/app/fonts

## 决策

- **选型:** PlayerPanel 以队列算最爱（`maxPlays = max(playCount ?? 0)`，`isFav = maxPlays > 0 && currentTrack?.playCount === maxPlays`——与 /music 徽标同口径，含并列曲目同样标爱），进度 `Progress` 传 `glyph={isFav ? '愛' : '樂'}`；音量印维持默认「樂」不动。`Track` 类型补 `playCount?: number`（服务端契约镜像）。字体子集并集补 樂(U+6A02)、墨(U+58A8) 两枚印章字形（愛/念/音 已在），扩列脚本落档 `apps/site/scripts/expand_cjk_fonts.py` 后重跑生成 4 个 woff2
- **对比方案:** 最爱判定下沉 AudioPlayerProvider（provider 是纯播放状态机，口径属呈现层，否）；只补 樂 不补 墨（同一次子集重跑，两枚 fallback 字形一起修，增量可忽略）；愛 用简体「爱」（印章集为传统字形系——樂/愛/念 同构，用户写「爱」指语义非字形，取传统「愛」）
- **理由:** `glyph` prop 契约现成，面板侧一个 `useMemo` 判定 + 类型 1 字段即完成；印形统一到 webfont 消除回退字体不一致；并列/缺省/0 边界与 /music 完全同口径，不引入第二套最爱语义

## 任务

### Phase 1
- [x] `Track` 增 `playCount?: number`（注释标明镜像 /v2/music 联表契约） — `packages/components/audio-player/specs.tsx`
- [x] PlayerPanel 队列最爱判定（useMemo）+ 进度印 glyph 愛/樂 切换；音量印不动 — `packages/components/audio-player/PlayerPanel.tsx`
- [x] 守卫：最爱口径断言（最高/并列/缺省 playCount/全 0）；进度 glyph 传参断言；Track.playCount 字段存在 — `packages/components/audio-player/player-panel.test.mjs`
- [x] 子集并集补 樂/墨 两码位，脚本落档后重跑 4 个 woff2，cmap 校验 樂/墨/愛/念/音 全在、其余码位不变 — `apps/site/scripts/expand_cjk_fonts.py`, `apps/site/app/fonts/files/NotoSansSC-400.woff2`, `apps/site/app/fonts/files/NotoSansSC-700.woff2`, `apps/site/app/fonts/files/NotoSerifSC-400.woff2`, `apps/site/app/fonts/files/NotoSerifSC-700.woff2`

### Phase 2
- [x] audio-player 守卫全绿 + 根 `pnpm exec tsc --noEmit` + oxlint（SGN-001：139 空日志先等 20–45s 重试）
- [x] runtime：播放最爱曲目面板进度印=愛、切非最爱回樂、音量印恒樂；明暗双主题截图目检；`pnpm build:next` 产物字体哈希更新确认

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md, shadow-docs/knowledge/first-load-performance.md
- **理由:** music-player 卡「进度=白文方印樂」段补最爱换印语义与同口径规则；first-load-performance 卡子集段补印章字形集（樂/墨 补齐、五印全 webfont）与扩列脚本落档位置
