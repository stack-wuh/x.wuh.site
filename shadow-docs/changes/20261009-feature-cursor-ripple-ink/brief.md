---
{
  "schema": "shadow-dev/v1",
  "name": "20261009-feature-cursor-ripple-ink",
  "type": "feature",
  "scope": "packages/components/cursor",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261009-feature-cursor-ripple-ink",
  "files": [
    "packages/components/cursor/cursor.test.mjs",
    "packages/components/cursor/index.tsx",
    "packages/components/cursor/ink.ts",
    "packages/components/cursor/style.tsx",
    "shadow-docs/designs/20261009-cursor-ripple/DESIGN.md",
    "shadow-docs/designs/20261009-cursor-ripple/prototype.html",
    "shadow-docs/knowledge/cursor-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 524,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/524",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "039556c3a83cb7601015e29ef7dfe61134ff6eb1",
    "verifiedAt": "2026-10-09T09:54:58.494Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:524",
    "planHash": "60598033695c8df3433612d648098f1b98b7d6167e942af79a99292e2842e4e1",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 光标特效改版：水波 + 墨晕（S1 一滴水）",
      "titleRaw": "光标特效改版：水波 + 墨晕（S1 一滴水）",
      "supplement": "现状墨迹粒子是硬边小圆点密排 + 飘尘，且整层色走 --text-color，看着不像主题色。改为移动=柔边墨晕连续洇开、点击=落笔一晕加三圈同心水波，颜色整层只走 --primary-color。方案与任务见 shadow-docs/changes/20261009-feature-cursor-ripple-ink/brief.md",
      "body": "## 动机\n- 用户 2026-10-09 反馈：现状鼠标粒子特效「不太好」，要「水波 + 墨晕开」，且「颜色也不是主题色」。\n- 两条根因已在比稿台实测：\n  1. `style.tsx` 的 `.bk-ink{color:var(--text-color)}` → 六种粒子中五种吃正文字色（酒红明下 = 近黑 `#2A1E16`），只有 `speck` 与 1/6 热尘用 `--primary-color`，所以整层「不像主题色」；\n  2. 拖尾是硬边 3.2px 小圆点以 6px 密排 + 9px 墨丝 + 200ms 发射钟飘尘 → 视觉是「撒沙子」，没有「晕开」。\n- 设计轮（shadow-dev-design）已产出可交互比稿台，用户定稿 S1 一滴水。\n\n## 引用规范\n- `shadow-docs/knowledge/cursor-system.md`\n  - 当前结论: 墨层零新监听器（`.addEventListener` 恰 4）、round-robin 池复用运行期零 DOM 增删、几何全走 CSS 自定义属性、keyframes 只动 transform/opacity、`animation-delay` 禁入 shorthand、粒子色仅 token、全在 `pointer:fine ∧ no-reduced-motion` 门控内。\n  - 适用 scope: `packages/components/cursor`\n  - 本变更内的偏离: 「域内唯一发射钟」随尘层退役 → 守卫由 `setInterval`/`clearInterval` 各恰 1 改为各恰 0；几何属性集新增 `--sz`（逐粒尺寸）。\n- `shadow-docs/knowledge/design-system.md`\n  - 当前结论: 颜色必须经主题变量、表现层禁裸 hex；`--primary-color` 四主题 = `#C94A44`/`#E36A64`/`#A87348`/`#D4A478`。\n  - 适用 scope: `packages/components/themes`, `packages/components/cursor`\n- `shadow-docs/knowledge/animation-system.md`\n  - 当前结论: 时长/缓动走 `--motion-*` 令牌。\n  - 适用 scope: `packages/components/cursor`\n- `norms/code-style.md` + `norms/code-style-frontend.md`\n  - 当前结论: 不新增 `any`、不顺手重写无关代码、副作用必须建立并清理、样式走 CSS 变量/主题令牌、新增 UI 同时考虑亮暗与 reduced motion。\n  - 适用 scope: `packages/components`\n- `norms/ui-patterns.md`\n  - 当前结论: 设计规范先行（已产比稿台）；禁硬编码颜色；动效 150-300ms ease-out；必须响应 `prefers-reduced-motion`。\n  - 适用 scope: 全 UI\n  - 不适用条款: 「过渡动画 150-300ms」针对交互反馈；墨晕/水波属氛围层寿命，150-300ms 内渐变来不及展开（比稿台实测：无驻留段的 640ms 已被 ease-out 吃到几乎不可见）。氛围类沿用 `--motion-dur-reveal` 倍数（900/1080/1200ms），缓动仍 ease-out-soft。\n- `norms/interaction.md`\n  - 当前结论: 用户操作必须有即时反馈；颜色不是唯一信息载体。\n  - 适用 scope: 全站交互\n  - 说明: 光标特效是装饰性反馈，不承担信息语义（`aria-hidden` 保持），因此不引入新的可访问性面。\n- `norms/tdd-verification.md`\n  - 当前结论: M 级 = 绿灯测试（写测试，不强制先红）+ unit 与走查；开工先报数、逐完成一行、收口对账。\n  - 适用 scope: 全仓\n\n## 决策\n- **选型:** 方案 A「柔边渐变合成层」+ 定稿构型 S1 一滴水。设计决策清单 D1-D9 见 `shadow-docs/designs/20261009-cursor-ripple/DESIGN.md`，逐条映射实现文件与守卫断言。\n- **对比方案:**\n  - 方案 B SVG `feTurbulence` 湍流：墨边最真，但 filter 逐帧重算在粒子密集时掉帧、突破 transform/opacity 白名单、filter 进不了 data-URI 静帧链（降级链要另写一套）→ 代价与收益不匹配。\n  - 方案 C Canvas 水墨扩散场：效果上限最高，但要新增自持 rAF（与 framer 双帧调度打架）、resize 监听（明令禁止）、SSR/hydration 面扩大 → 评级升 L，为装饰重写引擎。\n  - 构型 S2 墨洇长痕 / S3 涟漪场 / S4 界格涟漪：同页可比，用户选 S1（最克制、快移不易糊成一片）。\n- **理由:** S1 把两个诉求（形态 = 水波+墨晕、颜色 = 纯主题色）收在同一次改动里，且完全落在 `cursor-system.md` 既有纪律内：不新增监听器、不新增定时器、不动跟随引擎与静帧链。\n- **关键取舍:** 放弃真实墨纤维的不规则轮廓，换零性能风险与零契约变更；`--text-color` 从墨层彻底退出（D2），纸面只剩主题色一个饱和源。\n\n## 任务\n### Phase 1 规格冻结\n\n- [ ] T1 视觉稿与决策清单入仓（prototype.html / DESIGN.md / 四主题定格帧 + 现状对照） — `shadow-docs/designs/20261009-cursor-ripple/`\n\n### Phase 2 守卫先行\n\n- [ ] T2 重写墨层与尘晕守卫：Kind 仅 `bleed|wave|splash`、`SPAWN_GAP=11`、takeover 内恰一次 bleed 出生、`setInterval`/`clearInterval` 各恰 0、`.bk-ink` 内 `--text-color` 计数 0、`--primary-color` 恰 1、bk-bleed 与 bk-wave 各 3 关键帧、duration 表达式含 `--motion-dur-`、旧六类类名零残留 — `packages/components/cursor/cursor.test.mjs`\n- [ ] T3 跑守卫确认失败项全部指向待改实现（非断言笔误） — `node --test packages/components/cursor/cursor.test.mjs`\n\n### Phase 3 引擎实现\n\n- [ ] T4 ink.ts：Kind 收敛为三类、`put()` 增写 `--sz`、`walk()` 间距 11px、速度→浓淡与尺寸映射（衰减系数 .14）、`tap()` 改为 splash 1 粒 + wave 3 圈错峰 0/140/280ms、删 `dot/floss/bead/speck/halo/dust/hot` 与 `sling()`/`tick()`/`start()`/`stop()` — `packages/components/cursor/ink.ts`\n- [ ] T5 index.tsx：takeover 落点补一记 bleed（起笔一晕）、删除 `field.start()/stop()` 接线与 leave/cleanup 停钟语义 — `packages/components/cursor/index.tsx`\n- [ ] T6 style.tsx：`.bk-ink` 色改 `var(--primary-color)`、三类元件柔边渐变、keyframes 加 0/32/100% 与 0/22/100% 驻留段、时长改 `--motion-dur-*` 倍数、删旧六类与旧 keyframes — `packages/components/cursor/style.tsx`\n\n### Phase 4 验证\n\n- [ ] T7 域守卫与类型清零：`node --test packages/components/cursor/cursor.test.mjs` + `node --test packages/components/cursor/typecheck.test.mjs`\n- [ ] T8 runtime 镜像页量测：四主题拖尾在位计数与 opacity 区间、点击 splash=1/wave=3、`?mode=coarse|reduce` 零粒子、控制台 0 错误、定格帧截图留档 — `shadow-docs/designs/20261009-cursor-ripple/shots/`\n\n### Phase 5 收口\n\n- [ ] T9 review 通过后更新 `shadow-docs/knowledge/cursor-system.md`（墨层段重写、发射钟条款退役、`--sz` 入几何集、`verified-depth: runtime`） — `shadow-docs/knowledge/cursor-system.md`\n\n## 补充\n现状墨迹粒子是硬边小圆点密排 + 飘尘，且整层色走 --text-color，看着不像主题色。改为移动=柔边墨晕连续洇开、点击=落笔一晕加三圈同心水波，颜色整层只走 --primary-color。方案与任务见 shadow-docs/changes/20261009-feature-cursor-ripple-ink/brief.md\n\n完整 brief：shadow-docs/changes/20261009-feature-cursor-ripple-ink/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261009-feature-cursor-ripple-ink\",\"type\":\"feature\",\"scope\":\"packages/components/cursor\",\"status\":\"branched\",\"branch\":\"feature/20261009-feature-cursor-ripple-ink\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261009-feature-cursor-ripple-ink/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
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
        "shadow-docs/changes/20261009-feature-cursor-ripple-ink/brief.md",
        "shadow-docs/designs/20261009-cursor-ripple/DESIGN.md",
        "shadow-docs/designs/20261009-cursor-ripple/prototype.html",
        "shadow-docs/designs/20261009-cursor-ripple/shots/S0-current-wl.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/S1-drop-pd.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/S1-drop-pl.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/S1-drop-wd.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/S1-drop-wl-trail.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/S1-drop-wl.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/mirror-v5-pd.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/mirror-v5-pl.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/mirror-v5-wd.png",
        "shadow-docs/designs/20261009-cursor-ripple/shots/mirror-v5-wl.png",
        "shadow-docs/knowledge/cursor-system.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(cursor): 光标特效改水波+墨晕（S1 一滴水），整层色走主题色",
      "title": "光标特效改版：水波 + 墨晕（S1 一滴水）",
      "body": "Closes #524\n\n完整 brief：shadow-docs/changes/20261009-feature-cursor-ripple-ink/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/cursor-system.md",
    "reason": "墨层形态、颜色口径与发射钟纪律三条既有结论已过期（粒子色仅两 token、域内唯一发射钟、setInterval 恰 1），必须原位更新否则下个变更会照旧实现；本次同时补齐 verified-depth runtime 观察点与 node 22 守卫开关事实"
  }
}
---

# 光标特效改版：水波 + 墨晕（S1 一滴水）

## 动机

- 用户 2026-10-09 反馈：现状鼠标粒子特效「不太好」，要「水波 + 墨晕开」，且「颜色也不是主题色」。
- 两条根因已在比稿台实测：
  1. `style.tsx` 的 `.bk-ink{color:var(--text-color)}` → 六种粒子中五种吃正文字色（酒红明下 = 近黑 `#2A1E16`），只有 `speck` 与 1/6 热尘用 `--primary-color`，所以整层「不像主题色」；
  2. 拖尾是硬边 3.2px 小圆点以 6px 密排 + 9px 墨丝 + 200ms 发射钟飘尘 → 视觉是「撒沙子」，没有「晕开」。
- 设计轮（shadow-dev-design）已产出可交互比稿台，用户定稿 S1 一滴水。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更=无（`CursorLayer` 对外契约、主题变量、数据流全不动）；触及面=局部（cursor 域内 3 个实现文件 + 1 个守卫，24 条静帧降级链与 framer 跟随引擎零改动）；可发现性=立刻可见（配色与形态错误首帧即见，不需特定运行时路径）。
- **期望验证深度:** runtime（动效形态 + 四主题配色必须镜像页量测，与 `cursor-system.md` 现有 `verified-depth: runtime` 同级；unit 只能钉纪律，钉不住「晕开得对不对」）

## 引用规范

- `shadow-docs/knowledge/cursor-system.md`
  - 当前结论: 墨层零新监听器（`.addEventListener` 恰 4）、round-robin 池复用运行期零 DOM 增删、几何全走 CSS 自定义属性、keyframes 只动 transform/opacity、`animation-delay` 禁入 shorthand、粒子色仅 token、全在 `pointer:fine ∧ no-reduced-motion` 门控内。
  - 适用 scope: `packages/components/cursor`
  - 本变更内的偏离: 「域内唯一发射钟」随尘层退役 → 守卫由 `setInterval`/`clearInterval` 各恰 1 改为各恰 0；几何属性集新增 `--sz`（逐粒尺寸）。
- `shadow-docs/knowledge/design-system.md`
  - 当前结论: 颜色必须经主题变量、表现层禁裸 hex；`--primary-color` 四主题 = `#C94A44`/`#E36A64`/`#A87348`/`#D4A478`。
  - 适用 scope: `packages/components/themes`, `packages/components/cursor`
- `shadow-docs/knowledge/animation-system.md`
  - 当前结论: 时长/缓动走 `--motion-*` 令牌。
  - 适用 scope: `packages/components/cursor`
- `norms/code-style.md` + `norms/code-style-frontend.md`
  - 当前结论: 不新增 `any`、不顺手重写无关代码、副作用必须建立并清理、样式走 CSS 变量/主题令牌、新增 UI 同时考虑亮暗与 reduced motion。
  - 适用 scope: `packages/components`
- `norms/ui-patterns.md`
  - 当前结论: 设计规范先行（已产比稿台）；禁硬编码颜色；动效 150-300ms ease-out；必须响应 `prefers-reduced-motion`。
  - 适用 scope: 全 UI
  - 不适用条款: 「过渡动画 150-300ms」针对交互反馈；墨晕/水波属氛围层寿命，150-300ms 内渐变来不及展开（比稿台实测：无驻留段的 640ms 已被 ease-out 吃到几乎不可见）。氛围类沿用 `--motion-dur-reveal` 倍数（900/1080/1200ms），缓动仍 ease-out-soft。
- `norms/interaction.md`
  - 当前结论: 用户操作必须有即时反馈；颜色不是唯一信息载体。
  - 适用 scope: 全站交互
  - 说明: 光标特效是装饰性反馈，不承担信息语义（`aria-hidden` 保持），因此不引入新的可访问性面。
- `norms/tdd-verification.md`
  - 当前结论: M 级 = 绿灯测试（写测试，不强制先红）+ unit 与走查；开工先报数、逐完成一行、收口对账。
  - 适用 scope: 全仓

## 决策

- **选型:** 方案 A「柔边渐变合成层」+ 定稿构型 S1 一滴水。设计决策清单 D1-D9 见 `shadow-docs/designs/20261009-cursor-ripple/DESIGN.md`，逐条映射实现文件与守卫断言。
- **对比方案:**
  - 方案 B SVG `feTurbulence` 湍流：墨边最真，但 filter 逐帧重算在粒子密集时掉帧、突破 transform/opacity 白名单、filter 进不了 data-URI 静帧链（降级链要另写一套）→ 代价与收益不匹配。
  - 方案 C Canvas 水墨扩散场：效果上限最高，但要新增自持 rAF（与 framer 双帧调度打架）、resize 监听（明令禁止）、SSR/hydration 面扩大 → 评级升 L，为装饰重写引擎。
  - 构型 S2 墨洇长痕 / S3 涟漪场 / S4 界格涟漪：同页可比，用户选 S1（最克制、快移不易糊成一片）。
- **理由:** S1 把两个诉求（形态 = 水波+墨晕、颜色 = 纯主题色）收在同一次改动里，且完全落在 `cursor-system.md` 既有纪律内：不新增监听器、不新增定时器、不动跟随引擎与静帧链。
- **关键取舍:** 放弃真实墨纤维的不规则轮廓，换零性能风险与零契约变更；`--text-color` 从墨层彻底退出（D2），纸面只剩主题色一个饱和源。

## 任务

### Phase 1 规格冻结

- [x] T1 视觉稿与决策清单入仓（prototype.html / DESIGN.md / 四主题定格帧 + 现状对照） — `shadow-docs/designs/20261009-cursor-ripple/`

### Phase 2 守卫先行

- [x] T2 重写墨层与尘晕守卫：Kind 仅 `bleed|wave|splash`、`SPAWN_GAP=11`、takeover 内恰一次 bleed 出生、`setInterval`/`clearInterval` 各恰 0、`.bk-ink` 内 `--text-color` 计数 0、`--primary-color` 恰 1、bk-bleed 与 bk-wave 各 3 关键帧、duration 表达式含 `--motion-dur-`、旧六类类名零残留 — `packages/components/cursor/cursor.test.mjs`
- [x] T3 跑守卫确认失败项全部指向待改实现（非断言笔误） — `node --test packages/components/cursor/cursor.test.mjs`

### Phase 3 引擎实现

- [x] T4 ink.ts：Kind 收敛为三类、`put()` 增写 `--sz`、`walk()` 间距 11px、速度→浓淡与尺寸映射（衰减系数 .14）、`tap()` 改为 splash 1 粒 + wave 3 圈错峰 0/140/280ms、删 `dot/floss/bead/speck/halo/dust/hot` 与 `sling()`/`tick()`/`start()`/`stop()` — `packages/components/cursor/ink.ts`
- [x] T5 index.tsx：takeover 落点补一记 bleed（起笔一晕）、删除 `field.start()/stop()` 接线与 leave/cleanup 停钟语义 — `packages/components/cursor/index.tsx`
- [x] T6 style.tsx：`.bk-ink` 色改 `var(--primary-color)`、三类元件柔边渐变、keyframes 加 0/32/100% 与 0/22/100% 驻留段、时长改 `--motion-dur-*` 倍数、删旧六类与旧 keyframes — `packages/components/cursor/style.tsx`

### Phase 4 验证

- [x] T7 域守卫与类型清零：`node --test packages/components/cursor/cursor.test.mjs` + `node --test packages/components/cursor/typecheck.test.mjs`
- [x] T8 runtime 镜像页量测：四主题拖尾在位计数与 opacity 区间、点击 splash=1/wave=3、`?mode=coarse|reduce` 零粒子、控制台 0 错误、定格帧截图留档 — `shadow-docs/designs/20261009-cursor-ripple/shots/`

### Phase 5 收口

- [x] T9 review 通过后更新 `shadow-docs/knowledge/cursor-system.md`（墨层段重写、发射钟条款退役、`--sz` 入几何集、`verified-depth: runtime`） — `shadow-docs/knowledge/cursor-system.md`

## 结果

- 实际耗时: 约 1.5 小时（含设计轮比稿台与一次根因返工）
- 验证（M 级 = 绿灯测试 + unit + 走查，实际做到 runtime）:
  - 域守卫：`node --experimental-strip-types --test packages/components/cursor/cursor.test.mjs` → `# pass 13 / # fail 0`
  - 域类型：`node --test packages/components/cursor/typecheck.test.mjs` → `# pass 1 / # fail 0`（tsc 0 错误）
  - runtime 镜像页（esbuild 实包真组件 `cursor/index.tsx`，非比稿台）：
    - 拖尾：26 步笔迹 → `kinds {bleed:38}`、`visible 38`、opacity 区间 `.157–.337`（旧版同路径为 0 出生）
    - 点击：`splash:1 + wave:3`、`--dl` 恰 `0/140/280ms`，同时 `bk-cursor on popping` 未受影响
    - 四主题 `--primary-color` 逐一对表：wl `rgb(201,74,68)` / wd `rgb(227,106,100)` / pl `rgb(168,115,72)` / pd `rgb(212,164,120)`，与 `generator-color.ts` 完全一致
    - 降级：`mode=coarse` → `live 0`、跟随层不接管；`mode=reduce` → `pool 0`（CursorLayer 整层不挂载）
    - 控制台 0 错误；定格帧留档 `shadow-docs/designs/20261009-cursor-ripple/shots/mirror-v5-{wl,wd,pl,pd}.png`
- 环境事实（须回写卡片）：域守卫在 Node 22.14 直跑会因 `ERR_UNKNOWN_FILE_EXTENSION ".ts"` 假失败 4 条（tints/oklab/data URI/d 值/热点锚），必须加 `--experimental-strip-types`；卡片「验证方式」原命令缺该开关。
- 偏差留痕：brief T2 文案写「重写墨层与尘晕守卫」，尘晕守卫实为整条退役（改判为「零定时器」断言），非遗漏。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/cursor-system.md`
- **理由:** 墨层形态、颜色口径与发射钟纪律全部改写，卡片现有结论会误导后续变更（尤其「粒子色仅两 token」「域内唯一发射钟」「`setInterval` 恰 1」三条已过期）；不新增卡片，按 domain+keywords+scope 查重后在原地更新，`verified-depth` 随 T8 结果定为 runtime。
