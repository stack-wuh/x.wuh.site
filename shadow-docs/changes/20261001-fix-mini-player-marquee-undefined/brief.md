---
{
  "schema": "shadow-dev/v1",
  "name": "20261001-fix-mini-player-marquee-undefined",
  "type": "fix",
  "scope": "packages/components/audio-player",
  "status": "branched",
  "baseBranch": "main",
  "branch": "fix/20261001-fix-mini-player-marquee-undefined",
  "files": [
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/tsconfig.guard.json",
    "packages/components/audio-player/typecheck.test.mjs",
    "packages/components/audio-player/useMarquee.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 450,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/450",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:450",
    "planHash": "63f316fc8eeaf1bae79f01c30e774ecba3f316fe8063d6aaca923622ede2cc48",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix(player): MiniPlayer 漏引 MARQUEE_SPEED_PX_PER_S 致生产 ReferenceError + audio-player 域 tsc 守卫",
      "titleRaw": "fix(player): MiniPlayer 漏引 MARQUEE_SPEED_PX_PER_S 致生产 ReferenceError + audio-player 域 tsc 守卫",
      "supplement": "生产全站渲染迷你播放器即抛 Uncaught ReferenceError: MARQUEE_SPEED_PX_PER_S is not defined——#449 合入的 MiniPlayer.tsx:525 使用该常量但 import 漏引，四道门禁（根 tsc 不覆盖组件包/ignoreBuildErrors/oxlint 非类型感知/正则守卫只镜像用法）全部放行。本 change 补齐 import、放宽 useMarqueeOverflow ref 类型消除 PlayerPanel TS2769，并新增 audio-player 域 scoped tsc 语义守卫（域内类型错误清零断言）。详见 shadow-docs/changes/20261001-fix-mini-player-marquee-undefined/brief.md",
      "body": "## 动机\n#449 播放器「留白独奏」重铸合入 main 后，`MiniPlayer.tsx:525` 使用 `MARQUEE_SPEED_PX_PER_S` 但第 21 行 import 漏引，生产全站渲染迷你播放器即抛 `Uncaught ReferenceError: MARQUEE_SPEED_PX_PER_S is not defined`。四道门禁全部放行：根 `tsc` include 只有 `packages/*/src` 不覆盖 `packages/components`、Next 构建 `ignoreBuildErrors: true`、oxlint 非类型感知、`mini-player.test.mjs` 正则守卫只断言用法存在未断言 import。与 `build-config.md` 记载的 2026-09 `SharedLinkGroup is not defined` 事故同根因，属该类错误第二次直达生产；`tsc -p apps/site/tsconfig.json` 一条命令即可钉出 `MiniPlayer.tsx(525,64): TS2304`。同 PR 还埋有非致命类型错误 `PlayerPanel.tsx:1596` TS2769（span ref 挂 h3）。\n\n## 引用规范\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 根 tsc 不覆盖 site 与 components，站点/组件检查必须用 `tsc -p apps/site/tsconfig.json` 并配合 grep 目标文件；PR merged ≠ 已部署，交付须手动 Release 触发部署链并全绿\n  - 适用 scope: 验证命令与发布交付流程\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 跑马灯三处同源（useMarquee 唯一实现禁复制）；守卫要断言语义、不能只镜像实现（#435 教训）\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 方案 A——热修 + 组件域 tsc 语义守卫，一个 fix change 交付\n- **对比方案:** B 仅一行热修（最快但门禁洞仍在，#435→#449 两连同类事故证明会复发）；C 热修 + 全站门禁整修（扩根 tsconfig、摘 ignoreBuildErrors、清全站 ~43 存量错误——单 change 过重，另立 change）\n- **理由:** 恢复生产与堵住同类事故一次完成；守卫落在既有 node:test 守卫套件同构形态（`.test.mjs`），不引入新测试框架；CI quality-gate 挂接测试运行明确列为非目标（属 C 范围，本 change 只保证 shadow 流程 review 阶段可跑）。\n\n## 任务\n### Phase 1 修复（≤30min）\n- [ ] MiniPlayer.tsx import 补齐 `MARQUEE_SPEED_PX_PER_S` — `packages/components/audio-player/MiniPlayer.tsx` — 修改\n- [ ] `useMarqueeOverflow` 返回 ref 类型放宽为 `HTMLElement`（量尺只读 offsetWidth/clientWidth，与 span/h3 三类挂载点全兼容），连带消除 `PlayerPanel.tsx:1596` TS2769 — `packages/components/audio-player/useMarquee.ts` — 修改\n\n### Phase 2 守卫（≤30min）\n- [ ] 新增 `tsconfig.guard.json`：include 限定 audio-player，paths 映射 `@wuh.site/components/*` → `../*`，jsx react-jsx + skipLibCheck + 宽松严格度对齐根配置 — `packages/components/audio-player/tsconfig.guard.json` — 新建\n- [ ] 新增 `typecheck.test.mjs`：spawn `tsc -p tsconfig.guard.json`，过滤文件路径含 `audio-player/` 的错误行断言为空（域外存量错误不扩大打击面）；失败时原样输出错误列表便于定位——语义化守卫，TS2304 类漏引结构性绝杀 — `packages/components/audio-player/typecheck.test.mjs` — 新建\n- [ ] 全量守卫套件回归：`node --test packages/components/audio-player/*.test.mjs` 全绿 — `packages/components/audio-player` — 验证\n\n### Phase 3 验证与交付（≤30min）\n- [ ] 根 oxlint 0 errors；`tsc -p apps/site/tsconfig.json` 输出中 audio-player 路径错误清零；`build:next` 通过 — 仓库 — 验证\n- [ ] release 阶段：PR → merge → 手动 `gh release create`（patch 递增）→ 部署链全绿 → 生产目检迷你条/面板题名/词卷题头三处跑马灯滚动与暂停停走 — 仓库 — 交付\n\n## 补充\n生产全站渲染迷你播放器即抛 Uncaught ReferenceError: MARQUEE_SPEED_PX_PER_S is not defined——#449 合入的 MiniPlayer.tsx:525 使用该常量但 import 漏引，四道门禁（根 tsc 不覆盖组件包/ignoreBuildErrors/oxlint 非类型感知/正则守卫只镜像用法）全部放行。本 change 补齐 import、放宽 useMarqueeOverflow ref 类型消除 PlayerPanel TS2769，并新增 audio-player 域 scoped tsc 语义守卫（域内类型错误清零断言）。详见 shadow-docs/changes/20261001-fix-mini-player-marquee-undefined/brief.md\n\n完整 brief：shadow-docs/changes/20261001-fix-mini-player-marquee-undefined/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261001-fix-mini-player-marquee-undefined\",\"type\":\"fix\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261001-fix-mini-player-marquee-undefined/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/tsconfig.guard.json",
        "packages/components/audio-player/typecheck.test.mjs",
        "packages/components/audio-player/useMarquee.ts",
        "shadow-docs/changes/20261001-fix-mini-player-marquee-undefined/brief.md",
        "shadow-docs/knowledge/build-config.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(player): 补齐 MiniPlayer 漏引 MARQUEE_SPEED_PX_PER_S 与 audio-player 域 tsc 清零守卫 (#450)",
      "title": "fix(player): MiniPlayer 漏引 MARQUEE_SPEED_PX_PER_S 致生产 ReferenceError + audio-player 域 tsc 守卫",
      "body": "Closes #450\n\n完整 brief：shadow-docs/changes/20261001-fix-mini-player-marquee-undefined/brief.md"
    }
  }
}
---

# 修复生产 ReferenceError：MiniPlayer 漏引 MARQUEE_SPEED_PX_PER_S + audio-player 域 tsc 守卫

## 动机
#449 播放器「留白独奏」重铸合入 main 后，`MiniPlayer.tsx:525` 使用 `MARQUEE_SPEED_PX_PER_S` 但第 21 行 import 漏引，生产全站渲染迷你播放器即抛 `Uncaught ReferenceError: MARQUEE_SPEED_PX_PER_S is not defined`。四道门禁全部放行：根 `tsc` include 只有 `packages/*/src` 不覆盖 `packages/components`、Next 构建 `ignoreBuildErrors: true`、oxlint 非类型感知、`mini-player.test.mjs` 正则守卫只断言用法存在未断言 import。与 `build-config.md` 记载的 2026-09 `SharedLinkGroup is not defined` 事故同根因，属该类错误第二次直达生产；`tsc -p apps/site/tsconfig.json` 一条命令即可钉出 `MiniPlayer.tsx(525,64): TS2304`。同 PR 还埋有非致命类型错误 `PlayerPanel.tsx:1596` TS2769（span ref 挂 h3）。

## 复杂度评级
- **评级:** S
- **理由:** 契约无变更（bug fix + 新增守卫）；触及面单组件目录 5 个文件；可发现性高——生产 ReferenceError 已实锤，TS2304 一条命令复现，根因链完整。
- **期望验证深度:** unit + field（部署后生产目检三处跑马灯）

## 引用规范
- shadow-docs/knowledge/build-config.md
  - 当前结论: 根 tsc 不覆盖 site 与 components，站点/组件检查必须用 `tsc -p apps/site/tsconfig.json` 并配合 grep 目标文件；PR merged ≠ 已部署，交付须手动 Release 触发部署链并全绿
  - 适用 scope: 验证命令与发布交付流程
- shadow-docs/knowledge/music-player.md
  - 当前结论: 跑马灯三处同源（useMarquee 唯一实现禁复制）；守卫要断言语义、不能只镜像实现（#435 教训）
  - 适用 scope: packages/components/audio-player

## 决策
- **选型:** 方案 A——热修 + 组件域 tsc 语义守卫，一个 fix change 交付
- **对比方案:** B 仅一行热修（最快但门禁洞仍在，#435→#449 两连同类事故证明会复发）；C 热修 + 全站门禁整修（扩根 tsconfig、摘 ignoreBuildErrors、清全站 ~43 存量错误——单 change 过重，另立 change）
- **理由:** 恢复生产与堵住同类事故一次完成；守卫落在既有 node:test 守卫套件同构形态（`.test.mjs`），不引入新测试框架；CI quality-gate 挂接测试运行明确列为非目标（属 C 范围，本 change 只保证 shadow 流程 review 阶段可跑）。

## 任务
### Phase 1 修复（≤30min）
- [x] MiniPlayer.tsx import 补齐 `MARQUEE_SPEED_PX_PER_S` — `packages/components/audio-player/MiniPlayer.tsx` — 修改
- [x] `useMarqueeOverflow` 返回 ref 类型放宽为 `HTMLElement`（量尺只读 offsetWidth/clientWidth，与 span/h3 三类挂载点全兼容），连带消除 `PlayerPanel.tsx:1596` TS2769 — `packages/components/audio-player/useMarquee.ts` — 修改

### Phase 2 守卫（≤30min）
- [x] 新增 `tsconfig.guard.json`：include 限定 audio-player，paths 映射 `@wuh.site/components/*` → `../*`，jsx react-jsx + skipLibCheck + 宽松严格度对齐根配置 — `packages/components/audio-player/tsconfig.guard.json` — 新建
- [x] 新增 `typecheck.test.mjs`：spawn `tsc -p tsconfig.guard.json`，过滤文件路径含 `audio-player/` 的错误行断言为空（域外存量错误不扩大打击面）；失败时原样输出错误列表便于定位——语义化守卫，TS2304 类漏引结构性绝杀 — `packages/components/audio-player/typecheck.test.mjs` — 新建
- [x] 全量守卫套件回归：`node --test packages/components/audio-player/*.test.mjs` 全绿 — `packages/components/audio-player` — 验证

### Phase 3 验证与交付（≤30min）
- [x] 根 oxlint 0 errors；`tsc -p apps/site/tsconfig.json` 输出中 audio-player 路径错误清零；`build:next` 通过 — 仓库 — 验证
- [ ] release 阶段：PR → merge → 手动 `gh release create`（patch 递增）→ 部署链全绿 → 生产目检迷你条/面板题名/词卷题头三处跑马灯滚动与暂停停走 — 仓库 — 交付

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md（verified-scope 增补 audio-player 域 tsc 清零守卫；#449 引用存在性漏检教训并入守卫语义化条目，verified-depth: unit + field）；shadow-docs/knowledge/build-config.md（补 #449 实锤与组件域 scoped tsc 守卫配方，verified-depth: unit）
- **理由:** 同类事故两连（#435 换算口径、#449 引用存在性），守卫语义化纪律需以新证据加固；build-config 验证段自然延伸出组件域守卫配方。

## 待确认点
- 无（实测全站 ~43 存量类型错误与 build-config 记载一致且全在 audio-player 域外，本次只断言域内清零，与 Knowledge 无冲突）
