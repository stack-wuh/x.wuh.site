---
{
  "schema": "shadow-dev/v1",
  "name": "20261007-feature-cursor-ink-dust",
  "type": "feature",
  "scope": "packages/components/cursor",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20261007-feature-cursor-ink-dust",
  "files": [
    "packages/components/cursor/cursor.test.mjs",
    "packages/components/cursor/index.tsx",
    "packages/components/cursor/ink.ts",
    "packages/components/cursor/style.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 513,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/513",
    "pullRequest": 514,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/514"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "a23425701a1e98e19a0bfefe7ab2985f08cc39c0",
    "verifiedAt": "2026-10-07T05:23:13.046Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:514",
    "planHash": "a0e73bdfb67150d1b27a267a139c04d76518d3751f9a252321d349bf23e4eb87",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 光标「一页书」环绕墨尘 + 点击溅墨强化（一晕墨圈）",
      "titleRaw": "光标「一页书」环绕墨尘 + 点击溅墨强化（一晕墨圈）",
      "supplement": "field 反馈两连：①拖尾已成立，粒子存在感不足→B 档环绕墨尘（常驻微尘、静止缓升移动拖曳、setInterval 发射钟、池 32→48）；②单击也要粒子→现有朱砂渣过于克制无感知，升级「溅墨+一晕」：speck 5–8 粒加密 + 每击一粒放大淡出的墨晕环。拖尾三类参数与降级链不动。评级 M，镜像 v4 runtime。详见 shadow-docs/changes/20261007-feature-cursor-ink-dust/brief.md",
      "body": "## 动机\nv1.4.73 墨迹拖尾上线后用户 field 反馈两轮：①「有轨迹了，还想把粒子特效加上去」→ 选定 **B 档环绕墨尘维**（常驻环境粒子：书形周围细墨尘飘浮，静止缓升、移动拖曳）；②「鼠标单击的时候也可以加上粒子特效」→ 现版点击已有 3–5 粒朱砂墨渣但过于克制、field 无感知，用户选 **B 档「溅墨 + 一晕墨圈」**（笔尖落纸一晕：墨渣加密 + 一圈放大淡出的墨环）。两诉求同域同池，并入本单省一次发布链。C 档六态全联动（hover/wait/idle 粒子叙事）仍为明确非目标。\n\n## 引用规范\n- `shadow-docs/knowledge/cursor-system.md`（active，verified 2026-10-07，runtime）\n  - 当前结论: 跟随层 framer 弹簧 + 延迟接管；墨迹粒子池 32 round-robin、6px 节流、dot/floss/bead/speck 四类、寄生既有 onMove/onDown/onLeave 零新监听器、几何走 `--px/--py/--ang/--dx/--dy/--dl`、只动 transform/opacity、fine∧noReduce 门控、粒子色仅 `--text-color`/`--primary-color`。\n  - 适用 scope: packages/components/cursor\n  - 本变更遵循: 尘 = 第五类 kind `dust`、晕 = 第六类 kind `halo`，进同池同引擎（同 spawn/重启/自定义属性纪律）；池扩容仍单常量；颜色零新 token；静态帧链不动。发射时钟 setInterval 需新入卡执行约束（域内首见，与「零新监听器」并列记为「零新监听器、单发射钟」）。\n- `shadow-docs/knowledge/animation-system.md`（active）——「微光呼吸 × 书写显现、不位移炫技」：缓升微尘是 ambient 呼吸维不是炫技；落笔一晕是点击反馈的纸墨转译属即时反馈原则；站点专属组件自持关键帧例外沿用。\n- `shadow-docs/knowledge/design-system.md`（active）——颜色仅主题 token；4 主题截图取证。\n- `norms/tdd-verification.md`: M = 绿灯测试 + 走查 + runtime。\n- `norms/interaction.md`: 装饰层 aria-hidden 已具，无新增交互面。\n\n## 决策\n- **选型:** 方案一——同池扩展：`InkField` 增加 `start()/stop()` 自持发射时钟（`setInterval` ~200ms，仅接管后运行；leave/unmount 即停即清），每拍按概率出 1 粒 `dust`（出生位 = 当前指针位随机角环带 10–24px；静止缓升 `--dy` −12~−30px、横摆微抖；移动中出生点向速度反方向偏最多半环带呈「拖曳」；寿命 1.6–2.4s、峰值 opacity 0.05–0.18 一档极低、1/6 概率朱砂 tint）；点击同帧升级为「溅墨 + 一晕」：speck 加密到 5–8 粒、粒径 2–3px、飞程 8–18px、寿命 600ms，并加出一粒 `halo` 墨晕（细圆环自点击位 scale 0.4→2.8 放大淡出，笔尖落纸一晕）；`INK_POOL` 32→48（尘在飞 ~12 粒 + 拖尾 + 点击爆发余量）。\n- **对比方案:** 二（独立 DustField + 第二全屏容器）：多一层合成面与 keyframes 组，改动面不划算，否。三（纯 CSS 伪元素环绕）：尘跟指针不「留纸上」，撞运笔系语义且无动静变化，否。\n- **理由:** 单引擎单池守卫最好钉；setInterval 有 idle timer 先例、cleanup 一条 clearTimeout 收口；「特效感」来源是常驻而非事件密度，与拖尾互补不打架。\n\n### 关键实现决策\n\n- **K1 发射钟生命周期:** 接管（首次 pointermove takeover）时 `field.start()`，`pointerleave`/effect cleanup `field.stop()`；未接管永不起钟；interval 回调内先查 `document.visibilityState` 不必要——leave 已覆盖主要停发路径，tab 隐藏时浏览器自动节流即可。\n- **K2 拖曳偏位:** 引擎记最近速度向量（既有 smooth speed + ang）；`speed ≥ 0.3px/ms` 时出生点 = 指针位 − dir × min(24, speed×12) 环带偏置 + 随机角抖动；静止时全角随机。\n- **K3 尘的形态:** 基础 1.6–2.4px 圆点，`--dl` 错峰复用现机制；keyframes `bk-ink-dust`：from opacity 峰值 scale .5 → to 上升 `translate(+dx 微摆, --dy)` scale 1.4 opacity 0（洇散感）；`dust.hot`（朱砂 1/6）同帧不同色。\n- **K4 池:** `INK_POOL = 48`；round-robin 覆盖最老池位（尘在飞最长 2.4s × 5 粒/s ≈ 12，拖尾快移在飞 ~8，点击爆发一次 ≤9（8 speck + 1 halo），余量充足）；若 runtime 观察到尘覆盖半死拖尾 → 调 interval 250ms（参数终值记结果段）。\n- **K5 门控:** 全部逻辑在既有 fine∧noReduce effect 内；静态帧/reduced-motion/touch 零变化（复用现有探针页 mode 参数验证）。\n- **K6 守卫:** 新增断言——INK_POOL = 48、`setInterval` 恰好 1 处 + `clearInterval` 恰 2 处（stop/cleanup）、start 在 takeover 内、`bk-ink-dust` 与 `bk-ink-halo` keyframes 在场、dust/halo 色仅两 token、tap 出 halo（`'halo'` 字面在 tap 路径）、零新监听器计数不变（4）；原 12 条保留。\n- **K7 红线:** dot/floss/bead 三类拖尾参数一字不动（speck 升级属本单点击诉求主体，不算破线）；book/tints/layout/弹簧不动、不新增依赖。\n- **K8 墨晕形态（点击一晕）:** `.bk-ink i.halo` = 直径 10px 透明圆 + 1px `currentColor` 描边（border 静态，动画只 scale/opacity——放大时描边随 transform 变细正合「晕开变淡」）；keyframes `bk-ink-halo`：scale .4 opacity .45 → scale 2.8 opacity 0，520ms；每次 tap 恰 1 粒、无飞行偏移（dx/dy=0）；晕色 = 墨色（--text-color 继承），与朱砂渣分层不抢色。\n\n## 任务\n### Phase 1 — 域内实现\n\n- [ ] ink.ts：dust 发射模式（start/stop setInterval、K2 拖曳偏位、K3 形态、池 48）+ tap 升级（speck 5–8 粒 2–3px 飞 8–18px 600ms + 1 粒 halo） — `packages/components/cursor/ink.ts`\n- [ ] index.tsx：takeover 起钟 / onLeave+cleanup 停钟（仍零新监听器） — `packages/components/cursor/index.tsx`\n- [ ] style.tsx：`bk-ink-dust`(+hot)/`bk-ink-halo` keyframes 与 dust/halo 基础型 + speck 尺寸档更新（只 transform/opacity、token 色、no-preference 门控内） — `packages/components/cursor/style.tsx`\n- [ ] 守卫重排（K6）全绿 — `packages/components/cursor/cursor.test.mjs`\n- [ ] 域类型清零 — `packages/components/cursor/typecheck.test.mjs`\n\n### Phase 2 — runtime 验证（镜像页 v4，模式同 v3）\n\n- [ ] `/tmp/build-mirror-v4`（自动泵链，勿静默暂停——SGN-003 坑）：①接管后尘按 ~5 粒/s 出生（数类名含 dust 的槽位随真实秒增长）②静止出生位近环带、移动出生点拖曳偏位（读 `--px/--py` 与指针位差）③leave 停发：撤类后尘数冻结 ④重入复发 ⑤pointerdown → 恰 1 粒 halo + 5–8 粒 speck ⑥12s 长跑池恒 ≤48、无 DOM 增删 ⑦coarse/reduce 双环境零尘零晕 ⑧四主题截图尘/晕浓淡取证（halo 以 seek 150ms 定格）\n- [ ] 验证结论（含发射间隔/寿命/透明度/speck·halo 终值）写回本 brief 结果段\n\n## 补充\nfield 反馈两连：①拖尾已成立，粒子存在感不足→B 档环绕墨尘（常驻微尘、静止缓升移动拖曳、setInterval 发射钟、池 32→48）；②单击也要粒子→现有朱砂渣过于克制无感知，升级「溅墨+一晕」：speck 5–8 粒加密 + 每击一粒放大淡出的墨晕环。拖尾三类参数与降级链不动。评级 M，镜像 v4 runtime。详见 shadow-docs/changes/20261007-feature-cursor-ink-dust/brief.md\n\n完整 brief：shadow-docs/changes/20261007-feature-cursor-ink-dust/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261007-feature-cursor-ink-dust\",\"type\":\"feature\",\"scope\":\"packages/components/cursor\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261007-feature-cursor-ink-dust/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "packages/components/cursor/cursor.test.mjs",
        "packages/components/cursor/index.tsx",
        "packages/components/cursor/ink.ts",
        "packages/components/cursor/style.tsx",
        "shadow-docs/changes/20261007-feature-cursor-ink-dust",
        "shadow-docs/knowledge/cursor-system.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(cursor): 环绕墨尘 + 点击溅墨强化（落笔一晕）（#513）",
      "title": "[feature] 光标「一页书」环绕墨尘 + 点击溅墨强化——落笔一晕 (#513)",
      "body": "Closes #513\n\n完整 brief：shadow-docs/changes/20261007-feature-cursor-ink-dust/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/cursor-system.md",
    "reason": "知识已随 PR #514 落地，仅刷 verifiedCommit 至当前 HEAD"
  }
}
---

# 光标「一页书」环绕墨尘 + 点击溅墨强化——常驻微尘维与落笔一晕

## 动机

v1.4.73 墨迹拖尾上线后用户 field 反馈两轮：①「有轨迹了，还想把粒子特效加上去」→ 选定 **B 档环绕墨尘维**（常驻环境粒子：书形周围细墨尘飘浮，静止缓升、移动拖曳）；②「鼠标单击的时候也可以加上粒子特效」→ 现版点击已有 3–5 粒朱砂墨渣但过于克制、field 无感知，用户选 **B 档「溅墨 + 一晕墨圈」**（笔尖落纸一晕：墨渣加密 + 一圈放大淡出的墨环）。两诉求同域同池，并入本单省一次发布链。C 档六态全联动（hover/wait/idle 粒子叙事）仍为明确非目标。

## 复杂度评级

- **评级:** M
- **理由:** 无契约变更（对外 API/挂载点/静态帧链不动）；改动限 cursor 域：ink.ts 扩展发射模式 + style.tsx 追加 keyframes + 池扩容；常驻可见装饰，做过了立刻可见（可发现性高）。不升 L：不碰主题/构建/弹簧引擎；发射时钟是 cursor 域新机制但单一（一个 setInterval，有 idle timer 先例）。
- **期望验证深度:** runtime（守卫 + 镜像 v4 量测发射节拍/拖曳偏位/leave 停发/池不越界/降级零尘；浓淡手感归 field，注意 SGN-004）

## 引用规范

- `shadow-docs/knowledge/cursor-system.md`（active，verified 2026-10-07，runtime）
  - 当前结论: 跟随层 framer 弹簧 + 延迟接管；墨迹粒子池 32 round-robin、6px 节流、dot/floss/bead/speck 四类、寄生既有 onMove/onDown/onLeave 零新监听器、几何走 `--px/--py/--ang/--dx/--dy/--dl`、只动 transform/opacity、fine∧noReduce 门控、粒子色仅 `--text-color`/`--primary-color`。
  - 适用 scope: packages/components/cursor
  - 本变更遵循: 尘 = 第五类 kind `dust`、晕 = 第六类 kind `halo`，进同池同引擎（同 spawn/重启/自定义属性纪律）；池扩容仍单常量；颜色零新 token；静态帧链不动。发射时钟 setInterval 需新入卡执行约束（域内首见，与「零新监听器」并列记为「零新监听器、单发射钟」）。
- `shadow-docs/knowledge/animation-system.md`（active）——「微光呼吸 × 书写显现、不位移炫技」：缓升微尘是 ambient 呼吸维不是炫技；落笔一晕是点击反馈的纸墨转译属即时反馈原则；站点专属组件自持关键帧例外沿用。
- `shadow-docs/knowledge/design-system.md`（active）——颜色仅主题 token；4 主题截图取证。
- `norms/tdd-verification.md`: M = 绿灯测试 + 走查 + runtime。
- `norms/interaction.md`: 装饰层 aria-hidden 已具，无新增交互面。

## 决策

- **选型:** 方案一——同池扩展：`InkField` 增加 `start()/stop()` 自持发射时钟（`setInterval` ~200ms，仅接管后运行；leave/unmount 即停即清），每拍按概率出 1 粒 `dust`（出生位 = 当前指针位随机角环带 10–24px；静止缓升 `--dy` −12~−30px、横摆微抖；移动中出生点向速度反方向偏最多半环带呈「拖曳」；寿命 1.6–2.4s、峰值 opacity 0.05–0.18 一档极低、1/6 概率朱砂 tint）；点击同帧升级为「溅墨 + 一晕」：speck 加密到 5–8 粒、粒径 2–3px、飞程 8–18px、寿命 600ms，并加出一粒 `halo` 墨晕（细圆环自点击位 scale 0.4→2.8 放大淡出，笔尖落纸一晕）；`INK_POOL` 32→48（尘在飞 ~12 粒 + 拖尾 + 点击爆发余量）。
- **对比方案:** 二（独立 DustField + 第二全屏容器）：多一层合成面与 keyframes 组，改动面不划算，否。三（纯 CSS 伪元素环绕）：尘跟指针不「留纸上」，撞运笔系语义且无动静变化，否。
- **理由:** 单引擎单池守卫最好钉；setInterval 有 idle timer 先例、cleanup 一条 clearTimeout 收口；「特效感」来源是常驻而非事件密度，与拖尾互补不打架。

### 关键实现决策

- **K1 发射钟生命周期:** 接管（首次 pointermove takeover）时 `field.start()`，`pointerleave`/effect cleanup `field.stop()`；未接管永不起钟；interval 回调内先查 `document.visibilityState` 不必要——leave 已覆盖主要停发路径，tab 隐藏时浏览器自动节流即可。
- **K2 拖曳偏位:** 引擎记最近速度向量（既有 smooth speed + ang）；`speed ≥ 0.3px/ms` 时出生点 = 指针位 − dir × min(24, speed×12) 环带偏置 + 随机角抖动；静止时全角随机。
- **K3 尘的形态:** 基础 1.6–2.4px 圆点，`--dl` 错峰复用现机制；keyframes `bk-ink-dust`：from opacity 峰值 scale .5 → to 上升 `translate(+dx 微摆, --dy)` scale 1.4 opacity 0（洇散感）；`dust.hot`（朱砂 1/6）同帧不同色。
- **K4 池:** `INK_POOL = 48`；round-robin 覆盖最老池位（尘在飞最长 2.4s × 5 粒/s ≈ 12，拖尾快移在飞 ~8，点击爆发一次 ≤9（8 speck + 1 halo），余量充足）；若 runtime 观察到尘覆盖半死拖尾 → 调 interval 250ms（参数终值记结果段）。
- **K5 门控:** 全部逻辑在既有 fine∧noReduce effect 内；静态帧/reduced-motion/touch 零变化（复用现有探针页 mode 参数验证）。
- **K6 守卫:** 新增断言——INK_POOL = 48、`setInterval` 恰好 1 处 + `clearInterval` 恰 2 处（stop/cleanup）、start 在 takeover 内、`bk-ink-dust` 与 `bk-ink-halo` keyframes 在场、dust/halo 色仅两 token、tap 出 halo（`'halo'` 字面在 tap 路径）、零新监听器计数不变（4）；原 12 条保留。
- **K7 红线:** dot/floss/bead 三类拖尾参数一字不动（speck 升级属本单点击诉求主体，不算破线）；book/tints/layout/弹簧不动、不新增依赖。
- **K8 墨晕形态（点击一晕）:** `.bk-ink i.halo` = 直径 10px 透明圆 + 1px `currentColor` 描边（border 静态，动画只 scale/opacity——放大时描边随 transform 变细正合「晕开变淡」）；keyframes `bk-ink-halo`：scale .4 opacity .45 → scale 2.8 opacity 0，520ms；每次 tap 恰 1 粒、无飞行偏移（dx/dy=0）；晕色 = 墨色（--text-color 继承），与朱砂渣分层不抢色。

## 任务

### Phase 1 — 域内实现

- [x] ink.ts：dust 发射模式（start/stop setInterval、K2 拖曳偏位、K3 形态、池 48）+ tap 升级（speck 5–8 粒 2–3px 飞 8–18px 600ms + 1 粒 halo） — `packages/components/cursor/ink.ts`
- [x] index.tsx：takeover 起钟 / onLeave+cleanup 停钟（仍零新监听器） — `packages/components/cursor/index.tsx`
- [x] style.tsx：`bk-ink-dust`(+hot)/`bk-ink-halo` keyframes 与 dust/halo 基础型 + speck 尺寸档更新（只 transform/opacity、token 色、no-preference 门控内） — `packages/components/cursor/style.tsx`
- [x] 守卫重排（K6）全绿 — `packages/components/cursor/cursor.test.mjs`
- [x] 域类型清零 — `packages/components/cursor/typecheck.test.mjs`

### Phase 2 — runtime 验证（镜像页 v4，模式同 v3）

- [x] `/tmp/build-mirror-v4`（自动泵链，勿静默暂停——SGN-003 坑）：①接管后尘按 ~5 粒/s 出生（数类名含 dust 的槽位随真实秒增长）②静止出生位近环带、移动出生点拖曳偏位（读 `--px/--py` 与指针位差）③leave 停发：撤类后尘数冻结 ④重入复发 ⑤pointerdown → 恰 1 粒 halo + 5–8 粒 speck ⑥12s 长跑池恒 ≤48、无 DOM 增删 ⑦coarse/reduce 双环境零尘零晕 ⑧四主题截图尘/晕浓淡取证（halo 以 seek 150ms 定格）
- [x] 验证结论（含发射间隔/寿命/透明度/speck·halo 终值）写回本 brief 结果段

## 结果

- 实际耗时: 约 35 分钟（propose 收敛 + 点击一晕并入 → 引擎/接线/样式/守卫 → 镜像 v4 全序列 + 四主题取证）
- 验证:
  - **守卫** `node --test packages/components/cursor/cursor.test.mjs` **13/13 绿**（原 12 条：池上限断言 32→48、`length: INK_POOL` 注释同步；新增第 13 条「环绕墨尘与点击墨晕」钉 `window.setInterval` 恰 1 / `window.clearInterval` 恰 1 / start 幂等 / DUST_INTERVAL=200 / 拖曳反向偏置 / `'dust hot'` 1/6 / `--o` 逐粒 / halo 恰 1 粒 / takeover 起钟 / leave+cleanup 双停钟 / dust·halo keyframes / halo 静态 border / hot 朱砂 / dust 延迟长写 / ink.ts 零色值）；`typecheck.test.mjs` **域内 0 错误**。合计 14/14。
  - **runtime（镜像 v4 = esbuild 实包 worktree 真组件，`/tmp/cursor-mirror-v4`，:8916；自动泵链保持存活——SGN-003 教训沿用）**，注入 PointerEvent + `timeStamp` 合成速度钟：
    - ① **尘节拍**：接管后静止 2s 窗口 → 7 粒 dust 出生（IAB 计时器 ~3/s 节流下仍见拍出）✓
    - ② **拖曳偏位**：快移至 540 后静止 1.4s → 新尘 6 采样 mean x = 518.8 < 指针位（后偏 21.2px ≈ DRAG_MAX 24）✓
    - ③ **点击**：pointerdown → `halo=1`、`speck=6`（5–8 档）✓
    - ④ **leave 停钟**：撤类后 1.5s 全 48 槽位 sig 恒定（冻结）✓；⑤ **重入复发**：再静止 1.2s dust 计数 +2 ✓；池 `children.length` 全程 48 恒定、零 DOM 增删 ✓
    - ⑥ **降级零粒**：`?mode=coarse` / `?mode=reduce` 各 move+down 连发 + 2.5s 静止窗 → `inkOn=false`、`display:none`、活跃槽 0 ✓
    - ⑦ **四主题定格**：halo 以 `pause()+currentTime=180ms` 定格（其余 dot160/dust900ms 相位）——`design/mirror-v4-{wl,wd,pl,pd}.png`：落笔一晕圆环 + 朱砂渣环散 + 运笔虚线轨迹 + 书形右下错开，色随主题 ✓
  - **参数终值**：DUST_INTERVAL 200ms × P 0.8、尘出生环带 10–24px、升程 12–30px、摆 ±3px、`--o` 0.05–0.18、寿命 2200ms；halo scale .4→2.8 / opacity .5→0 / 520ms、初始径 10px border 1px；speck 5–8 粒 / 2.6px / 飞 8–18px / 600ms / 错峰 ≤140ms。淡档备选（field 若嫌尘抢戏）：`--o` 上限降 0.12 或 DUST_PROB 0.5。
  - **偏差记录**：尘寿命用单值 2200ms（brief K3 的 1.6–2.4s 随机简化——scale/摆幅随机已提供形态差，时长随机需 per-particle duration 会破长写守卫简洁性，取中值）。SGN-004 同源限制不变：CSS 动画视觉推进在此环境靠 seek 定格取证，真实流畅度归 field。
  - 走查：`--files` 外零改动（book/tints/layout/引擎弹簧/拖尾 dot·floss·bead 参数未碰）；监听器仍 4；发射钟生命周期双保险（leave + cleanup）；样式追加区未触既有规则（speck 尺寸/时长属本单点击升级范围，brief 已注明）。
- 交付发布记录（2026-10-07）：
  - PR #514 squash 合入 main = `64993e5`（用户合并）；经用户「我执行（同上次）」授权代跑 `gh release create v1.4.74`（target 64993e5，notes=/tmp/v1.4.74-notes.md，https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.74）。
  - 部署链 run 37575147863（event=release）**7/7 全绿**：quality-gate/prepare/prepare-deps/build-nest/build-next/staging-test/switch-traffic；switch-traffic 日志证实 `xwuhsite-nest-1 Started → Healthy`、`xwuhsite-next-1 Started`（容器换件即部署完成判据，同 v1.4.73 口径）。本轮零 255、零重跑。
  - 公网指纹仍不可达（`curl https://x.wuh.site/` DNS 解析失败，前单遗留域名问题，与本变更无关）；服务器侧健康链为当前唯一可用验证面。
  - 用户 field 验证点（开放）：真浏览器刷新看环绕墨尘浓度与点击一晕观感；如嫌尘抢戏单一改点 = ink.ts `DUST_PROB`/`--o` 上限或 style.tsx dust 时长。


## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/cursor-system.md`
- **理由:** 卡「墨迹粒子层」段追加 dust/halo 两维与发射钟纪律（单 setInterval、生命周期绑接管/leave、池 48、点击一晕）；执行约束「零新监听器」扩为「零新监听器、单发射钟」；点击语义由「溅 3–5 渣」更新为「溅 5–8 渣 + 一晕墨圈」；verified 随本变更 runtime 刷新。
