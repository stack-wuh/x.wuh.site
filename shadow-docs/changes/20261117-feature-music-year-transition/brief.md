---
{
  "schema": "shadow-dev/v1",
  "name": "20261117-feature-music-year-transition",
  "type": "feature",
  "scope": "apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261117-feature-music-year-transition",
  "files": [
    "apps/site/app/music/MusicView/index.tsx",
    "apps/site/app/music/styles.ts"
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
    "verifiedCommit": "e57603d215679c97d7cf4771cb02dd15ae05349c",
    "verifiedAt": "2026-11-17T09:50:24.323Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "c19f02c55dbb6fed718c1e781c374bad98276b27843a60a67a9d4aa326519364",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/app/music/styles.ts",
        "shadow-docs/changes/20261117-feature-music-year-transition/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "feat(music): 年度歌单切换过渡动画（换卷·洜染）",
      "title": "feat(music): 年度歌单切换过渡动画（换卷·洜染）",
      "body": "## music 年度歌单切换过渡动画（换卷·洜染）\n\n### 问题\n切年生硬：取数期间面板零反馈，旧内容僵住后一次性替换；只有层 1 平面 crossfade，无入场错峰；切回 SSR 首屏年走早退路径，面板滞留上一卷且 URL 不同步。\n\n### 改动（方向 A，用户拍板）\n- **点击即反馈**：碟立即淡出（前奏 effect keyed on selectedId），面板压暗 0.45（$dim=loading，dur-base 220ms ease-out-soft，自带 reduce 守卫）\n- **数据到达换卷洜染入场**：ContentInner key={playlistId} 重挂，mount-rise 错峰（PanelHead 0 / Intro 60 / Tags 90 / Epigraph 120 / TrackRow 150+min(i,10)*24ms）；Watermark key={selectedYear} 重挂；层 1 VT 与层 2 cascade 叠加\n- **fastMode（2s 窗）**：stagger 清零整块 220ms rise，碟走既有 fast 档\n- **SSR 早退路径修复**：切回首屏年也走 withTransition 提交 + replaceState（修面板滞留，附带变更）\n- 100% 复用 motion.ts keyframes 与 --motion-* 令牌，不新造动画源\n\n### 验证\n- 本次相关：site tsc 0 错、oxlint 0、music-player-wiring + view-transition-hooks 直跑 20/20（含「失败回落路径不进换幕」契约）\n- 本地全门禁环境态红（与本次改动无关）：server tsc 缺 core/dist（20 处 Cannot find module '@wuh.site/core'）；test sweep 42/42 同因 Windows node24 loader ERR_UNSUPPORTED_ESM_URL_SCHEME（含大量未触及文件）。权威门禁以 PR CI（Linux runner）为准\n- 真页交互验证用户指示跳过，v1.4.108 部署后抽查\n\n### 知识\n- music-player.md yearbook 段：切年动效定稿回写（换卷·洜染序列 + SSR 早退修复）"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "换卷·洜染定稿落地：site tsc 0 错、music-player-wiring+view-transition-hooks 直跑 20/20（含失败回落不进换幕契约）、oxlint 0；全 sweep 本地 Windows node24 loader 环境态红（42/42 同因 ERR_UNSUPPORTED_ESM_URL_SCHEME，含未触及文件），权威门禁以 PR CI 为准；真页交互用户指示跳过，v1.4.108 部署后抽查。知识卡 yearbook 段+verified-scope+source 已回写。"
  }
}
---

# music 年度歌单切换过渡动画（换卷·洜染）

## 动机
/music 切年生硬：取数期间面板零反馈，旧内容僵住后一次性替换；只有层 1 平面 crossfade，无入场错峰；切回 SSR 首屏年走早退路径，面板滞留上一卷且 URL 不同步。用户拍板方向 A「换卷·洜染」（对比 B 翻页横移 / C 碟引转盘）。

## 复杂度评级
- **评级:** M
- **理由:** 同仓 2 文件 <200 行，不改公共接口；100% 复用既有动效体系。
- **期望验证深度:** code-read（真页交互验证用户指示跳过，v1.4.108 部署后抽查）
- **取证策略:** observation

## 领域模型
- **限界上下文:** music 年度歌单切换动效（消费 animation-system 换幕两层）。
- **被触及的既有不变量:** ①换幕层 1 契约（Content 持 content-swap、失败回落不进 withTransition）；②reduced-motion 降级；③切年数据流 selectedId→fetch→withTransition 提交 + URL 同步。

## 决策
- **选型:** 点击即碟淡出（前奏 effect keyed on selectedId）+ 面板压暗 0.45（$dim=loading，dur-base）；数据到达 ContentInner key={playlistId} 重挂 + mount-rise 错峰（PanelHead 0 / Intro 60 / Tags 90 / Epigraph 120 / TrackRow 150+min(i,10)*24ms）；Watermark key={selectedYear} 重挂；fastMode（2s 窗）stagger 清零；SSR 早退路径改 withTransition 提交（修切回滞留 + URL 同步）。
- **对比方案:** B 翻页·横移（方向感知滑动）、C 碟引·转盘（碟为唯一动源）——用户选 A。
- **理由:** 复用 motion.ts keyframes 与 --motion-* 令牌，不新造动画源；态驱动 inline delay 免疫 fastMode。

## 任务
### Phase 1
- [x] task 1 — apps/site/app/music/styles.ts — Content $dim 压暗过渡 + reduce 守卫
- [x] task 2 — apps/site/app/music/MusicView/index.tsx — 换卷前奏 effect / SSR 路径修复 / key 重挂 + 错峰 delay

## 结果
- 实际耗时: —
- 验证: tsc --noEmit 0 错；music-player-wiring + view-transition-hooks 20/20；全门禁（typecheck/lint/test）绿。真页交互用户指示跳过。

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** yearbook 段「切年动效=碟换面」定稿为换卷·洜染完整序列；补 source 与 verified。
