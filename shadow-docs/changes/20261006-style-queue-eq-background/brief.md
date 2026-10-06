---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-style-queue-eq-background",
  "type": "style",
  "scope": "packages/components/audio-player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20261006-style-queue-eq-background",
  "files": [
    "packages/components/audio-player/panel/PanelQueue.tsx",
    "packages/components/audio-player/panel/styles/queue.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 490,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/490",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "04c927cda2a34526437b9122de2585a7ea0d7fc5",
    "verifiedAt": "2026-10-06T11:08:17.033Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:490",
    "planHash": "008be654fc2033101c0799e76443e6be5ad992b2888a38784639d4f90c618bc3",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 面板队列屏等化器移行背景水印层，序号位复位",
      "titleRaw": "[style] 面板队列屏等化器移行背景水印层，序号位复位",
      "supplement": "正在播放等化器从序号位（22×16px 三面切换，三柱同相位糊成一坨且被 3D 屏亚像素裁切）移到队列行背景水印层：放大柱体 16% 朱砂浓度垫在序号之下，序号位恢复显示编号，行内容经 button z-index 抬升恒压水印之上；补 mini 同源相位延迟。详见 shadow-docs/changes/20261006-style-queue-eq-background/brief.md",
      "body": "## 动机\n20261006 等化器单（#489）把面板队列屏的当前行等化器塞在序号位（QueueNo，22×16px）：三根 2.5px 细柱紧挨朱砂左标，且面板版漏了 mini 等化器的 nth-child 相位延迟（0.18s/0.36s），三柱同相位跳动糊成一坨——3D 转正屏上小尺寸细柱再叠亚像素裁切，播放状态实际不可读（用户反馈\"被挡住了\"）。用户拍板方向：等化器转移到行背景侧，以水印形态实现，序号位恢复显示编号。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 激活态走行内自定义属性/行内样式，禁 styled 动态类与属性选择器；暂停停走（冻结不重置）语言；equalize 单源 import '../../mini/styles'；hover 操作提示优先于状态提示；守卫正则措辞勿含 banned 标识符与 hex 形 token（守卫措辞陷阱）。\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 方案 A——背景水印式（用户已确认）：\n  - **序号位复位**：QueueNo 回到两面（q-no-face 序号 / q-no-play 播放键），当前行序号\"05\"朱砂显示（--q-active 染色链路不变）；`.q-no-eq` 从 QueueNo 内删除。\n  - **水印入行层**：`<span className='q-no-eq'>` 升为 QueueItem（li）直接子元素（QueueButton 之前），absolute 锚左缘序号列之上（padding-left ≈ 按钮左内边距）、垂直居中、pointer-events:none；柱体放大（约 3px 宽 × 14px 高、gap 3px，apply 时按行高微调），朱砂、`opacity: calc(var(--q-eq,0) * 0.16)` 水印浓度；跳动/冻结仍由 `--q-eq-state` 驱动（animation-play-state），语义不变。\n  - **层叠复位**：QueueButton 加 `position: relative; z-index: 1`，保证行内容（序号/歌名）恒压水印之上——水印真在\"背景侧\"，而不是叠在文字上；li 不设堆叠上下文（无 transform 常态），但 QScreen 有 opacity 上下文，负 z 不可取，故用 button 抬升方案。\n  - **相位补齐**：`.q-no-eq span:nth-child(2/3)` 补 0.18s/0.36s 延迟，注释注明与 mini Equalizer 同相位值（keyframes 单源已锁，相位值是镜像常量需注释锚定）。\n  - **hover 让位照旧**：`&:hover .q-no-eq { opacity: 0 }`（操作提示优先于状态提示）；reduced-motion 静止保留。\n  - 移动目次页共用 QueueRows，零差异继承同一形态；/music 页 PlayingSlot 不在本单范围（已是共享 Equalizer 件，无遮挡问题）。\n- **对比方案:** B 左缘竖标升级为一组跳动柱（序号复位但状态仍在前景轨道，非用户所指\"背景侧\"）；C 整栏背景大等化器（状态与行的对应关系丢失，队列多行时无从判断哪行在播）。均否决。\n- **理由:** 水印 16% 浓度 + 放大柱体在 3D 屏上抗亚像素裁切；信息各归其位——序号管编号、背景管状态；层叠靠 button 抬升一层实现，不引入堆叠上下文，翻页屏/移动目次两宿主均安全。\n\n## 任务\n### Phase 1 — 面板样式与结构\n\n- [ ] 水印样式重锚 — `packages/components/audio-player/panel/styles/queue.tsx` — `.q-no-eq` 从\"QueueNo 第三面 absolute inset\"改为行层水印（li 直接子级几何：锚左缘、垂直居中、pointer-events:none、放大柱体、opacity calc 水印浓度）；补 nth-child 相位延迟；QueueButton 加 position:relative + z-index:1；hover 让位、reduced-motion、animation-play-state 三条断言随几何更新\n- [ ] 结构移位 — `packages/components/audio-player/panel/PanelQueue.tsx` — `<span className='q-no-eq'>` 移入 QueueItem 直下（QueueButton 之前）；行内 --q-eq/--q-eq-state 挂载点不变\n### Phase 2 — 守卫与目检\n\n- [ ] 守卫更新 — `packages/components/audio-player/style.test.mjs` — 「正在播放等化器三面切换」测试改写为背景水印守卫（序号位两面复位断言、水印 li 层锚点、相位延迟、层叠 button z1、hover 让位、reduced-motion、equalize 单源 import、包出口导出保留）\n- [ ] 静态复现页目检 — `/tmp` 复现页镜像 li/button/水印几何，截图确认序号压水印、水印浓度与相位错开；三守卫文件 node --test 全绿\n\n## 补充\n正在播放等化器从序号位（22×16px 三面切换，三柱同相位糊成一坨且被 3D 屏亚像素裁切）移到队列行背景水印层：放大柱体 16% 朱砂浓度垫在序号之下，序号位恢复显示编号，行内容经 button z-index 抬升恒压水印之上；补 mini 同源相位延迟。详见 shadow-docs/changes/20261006-style-queue-eq-background/brief.md\n\n完整 brief：shadow-docs/changes/20261006-style-queue-eq-background/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-style-queue-eq-background\",\"type\":\"style\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-style-queue-eq-background/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/panel/PanelQueue.tsx",
        "packages/components/audio-player/panel/styles/queue.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261006-style-queue-eq-background/brief.md",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/signals.md"
      ],
      "message": "style(player): 面板队列等化器沉入行背景水印层，序号位复位两面 (#490)",
      "title": "[style] 面板队列屏等化器沉入行背景水印层，序号位复位两面 (#490)",
      "body": "Closes #490\n\n完整 brief：shadow-docs/changes/20261006-style-queue-eq-background/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "队列行正在播放特效定稿事实由「序号位三面切换」改为「行背景水印+序号复位两面」；新增两条长期事实：带 delay 动画靠 play-state 冻结必须配 animation-fill-mode: backwards（首挂载暂停帧形陷阱，复现页量测实锤）、小尺寸前景指示器在 3D 翻面屏上会被亚像素裁切（状态件宜走背景水印层）"
  }
}
---

# 面板队列屏正在播放等化器移入行背景水印层（序号位复位）

## 动机

20261006 等化器单（#489）把面板队列屏的当前行等化器塞在序号位（QueueNo，22×16px）：三根 2.5px 细柱紧挨朱砂左标，且面板版漏了 mini 等化器的 nth-child 相位延迟（0.18s/0.36s），三柱同相位跳动糊成一坨——3D 转正屏上小尺寸细柱再叠亚像素裁切，播放状态实际不可读（用户反馈"被挡住了"）。用户拍板方向：等化器转移到行背景侧，以水印形态实现，序号位恢复显示编号。

## 复杂度评级

- **评级:** S
- **理由:** 无公共契约变更（`--q-eq`/`--q-eq-state` 行内属性本就挂在 QueueItem 上，位置不动）；触及面为面板队列两文件 + 守卫测试；等化器单源（equalize 关键帧 import）不变，仅重锚几何与补相位。
- **期望验证深度:** unit（守卫测试）+ 静态复现页目检（层叠/水印透明度肉眼确认，避开整机 dev 服务器内存压力，SGN-001）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 激活态走行内自定义属性/行内样式，禁 styled 动态类与属性选择器；暂停停走（冻结不重置）语言；equalize 单源 import '../../mini/styles'；hover 操作提示优先于状态提示；守卫正则措辞勿含 banned 标识符与 hex 形 token（守卫措辞陷阱）。
  - 适用 scope: packages/components/audio-player

## 决策

- **选型:** 方案 A——背景水印式（用户已确认）：
  - **序号位复位**：QueueNo 回到两面（q-no-face 序号 / q-no-play 播放键），当前行序号"05"朱砂显示（--q-active 染色链路不变）；`.q-no-eq` 从 QueueNo 内删除。
  - **水印入行层**：`<span className='q-no-eq'>` 升为 QueueItem（li）直接子元素（QueueButton 之前），absolute 锚左缘序号列之上（padding-left ≈ 按钮左内边距）、垂直居中、pointer-events:none；柱体放大（约 3px 宽 × 14px 高、gap 3px，apply 时按行高微调），朱砂、`opacity: calc(var(--q-eq,0) * 0.16)` 水印浓度；跳动/冻结仍由 `--q-eq-state` 驱动（animation-play-state），语义不变。
  - **层叠复位**：QueueButton 加 `position: relative; z-index: 1`，保证行内容（序号/歌名）恒压水印之上——水印真在"背景侧"，而不是叠在文字上；li 不设堆叠上下文（无 transform 常态），但 QScreen 有 opacity 上下文，负 z 不可取，故用 button 抬升方案。
  - **相位补齐**：`.q-no-eq span:nth-child(2/3)` 补 0.18s/0.36s 延迟，注释注明与 mini Equalizer 同相位值（keyframes 单源已锁，相位值是镜像常量需注释锚定）。
  - **hover 让位照旧**：`&:hover .q-no-eq { opacity: 0 }`（操作提示优先于状态提示）；reduced-motion 静止保留。
  - 移动目次页共用 QueueRows，零差异继承同一形态；/music 页 PlayingSlot 不在本单范围（已是共享 Equalizer 件，无遮挡问题）。
- **对比方案:** B 左缘竖标升级为一组跳动柱（序号复位但状态仍在前景轨道，非用户所指"背景侧"）；C 整栏背景大等化器（状态与行的对应关系丢失，队列多行时无从判断哪行在播）。均否决。
- **理由:** 水印 16% 浓度 + 放大柱体在 3D 屏上抗亚像素裁切；信息各归其位——序号管编号、背景管状态；层叠靠 button 抬升一层实现，不引入堆叠上下文，翻页屏/移动目次两宿主均安全。

## 任务

### Phase 1 — 面板样式与结构

- [x] 水印样式重锚 — `packages/components/audio-player/panel/styles/queue.tsx` — `.q-no-eq` 从"QueueNo 第三面 absolute inset"改为行层水印（li 直接子级几何：锚左缘、垂直居中、pointer-events:none、放大柱体、opacity calc 水印浓度）；补 nth-child 相位延迟；QueueButton 加 position:relative + z-index:1；hover 让位、reduced-motion、animation-play-state 三条断言随几何更新
- [x] 结构移位 — `packages/components/audio-player/panel/PanelQueue.tsx` — `<span className='q-no-eq'>` 移入 QueueItem 直下（QueueButton 之前）；行内 --q-eq/--q-eq-state 挂载点不变
### Phase 2 — 守卫与目检

- [x] 守卫更新 — `packages/components/audio-player/style.test.mjs` — 「正在播放等化器三面切换」测试改写为背景水印守卫（序号位两面复位断言、水印 li 层锚点、相位延迟、层叠 button z1、hover 让位、reduced-motion、equalize 单源 import、包出口导出保留）
- [x] 静态复现页目检 — `/tmp` 复现页镜像 li/button/水印几何，截图确认序号压水印、水印浓度与相位错开；三守卫文件 node --test 全绿

## 结果

- 实际耗时: 约 50 分钟（propose→apply→review→release 连贯短跑）
- 验证:
  - **TDD 红→绿:** 水印守卫测试先行重写为失败（20 绿 1 红，红得其所）→ queue.tsx/PanelQueue.tsx 实现后 style.test.mjs 21/21 绿；复现页量测暴露缺陷后补 fill-mode 断言再修实现，仍 21/21
  - **全守卫面:** mini-player 8/8、player-panel 22/22、provider 7/7、typecheck（域 tsc）1/1、apps/site wiring 12/12 全绿
  - **复现页 DOMMatrix 双帧量测（/tmp/repro-490，静态服务 + IAB）:** 跳动相位错开 `play [0.93,0.96,0.6] → +300ms [0.48,0.36,0.67]`（同帧内柱高互异=错相，帧间全体位移=在跑）；旧形态对照面板三柱恒 `[0.93,0.93,0.93]` 同相（病灶镜像）；**冻结缺陷发现与修复:** 首挂载即暂停量得 `[0.35,1,1]`（delay 段柱无 fill 回落基准 scaleY(1)，两高一矮）→ 补 `animation-fill-mode: backwards` 后 `[0.35,0.35,0.35]` 均匀矮柱；静态截图确认序号"03/04"朱砂恒压 16% 水印之上、行底色与左标不冲突
  - **环境:** 本轮 shadow-dev CLI 与 node --test 零 SIGSEGV（SGN-001 未命中）；复现页方法学固化为 SGN-003（第二证）
- 事故与例外: `issue execute` 首次 GITHUB_TOKEN_REQUIRED（环境未带 token），以 `GITHUB_TOKEN=$(gh auth token)` 注入重试即成——写操作仍全走 CLI，属凭证装配非旁路
- 部署后生产目检：面板队列屏当前行水印等化器（播=三柱错相跳动、停=均匀矮柱冻结、hover 淡出且序号翻 ▶）；与四修/卷题签/等化器积压目检合并执行

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 队列行"正在播放特效"定稿事实由"序号位三面切换"改为"行背景水印 + 序号复位两面"；等化器单源纪律补一条镜像常量注意点（相位延迟值随 keyframes 单源之外另行注释锚定）；执行约束补"小尺寸前景指示器在 3D 翻面屏上会被亚像素裁切，状态类元素宜走背景水印层"。
