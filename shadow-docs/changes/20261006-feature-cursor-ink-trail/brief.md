---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-feature-cursor-ink-trail",
  "type": "feature",
  "scope": "packages/components/cursor",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261006-feature-cursor-ink-trail",
  "files": [
    "packages/components/cursor/cursor.test.mjs",
    "packages/components/cursor/index.tsx",
    "packages/components/cursor/ink.ts",
    "packages/components/cursor/style.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 509,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/509",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b4680864d747c062f52f90560045814aa23a1593",
    "verifiedAt": "2026-10-07T03:37:12.844Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:509",
    "planHash": "51a3b1ad8d9932fd18aa4cb198135889653d8d630296f6e104c8d048fa074118",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 全站光标「一页书」墨迹粒子层——移动运笔拖尾 + 点击溅墨",
      "titleRaw": "全站光标「一页书」墨迹粒子层——移动运笔拖尾 + 点击溅墨",
      "supplement": "propose 收敛：纸墨运笔系质感（指=笔尖，轨迹=纸上残墨渐隐）。方案 A：DOM 粒子池 32 粒 round-robin + 自持 CSS 关键帧，寄生现有 onMove/onDown/onLeave 零新监听器、移动路径零 React 渲染；覆盖面 B 档=移动墨点/墨丝+急停甩珠+点击朱砂溅墨；book/tints/静态帧降级链零触碰。评级 M，期望验证 runtime（镜像页量测）。详见 shadow-docs/changes/20261006-feature-cursor-ink-trail/brief.md",
      "body": "## 动机\nv1.4.69 弹簧随动上线后用户反馈「感官还是不太好」，希望给自定义光标加粒子特效与鼠标轨迹。propose 澄清定调：质感走**纸墨运笔系**（指 = 笔尖，轨迹 = 纸上留下的墨，出生在世界坐标停留淡出，而非悬在指针后的跟随链）——与一页书主题、导航下划线「运笔」语言同源。覆盖面取 **B 档：移动轨迹 + 急停甩珠 + 点击溅墨**（hover/wait/idle 粒子叙事不默认扩面，留作后续可选追加；此档为 AI 判断收敛，用户未明确否决即按此执行，review 可降档为仅移动）。\n\n## 引用规范\n- `shadow-docs/knowledge/cursor-system.md`（active，verified 2026-10-07，runtime）\n  - 当前结论: 跟随引擎 = framer-motion useMotionValue×2 + useSpring；延迟接管 D1；六态/idle/popping classList/dataset 直写、移动路径零 React state；热点 (4,4)+OFFSET(6,6)；表现层禁裸 hex；全部行为锁 `pointer:fine ∧ no-preference`；静态帧与动效层三处同步纪律。\n  - 适用 scope: packages/components/cursor\n  - 本变更遵循: 粒子层寄生现有 onMove/onDown/onLeave 时序（零新监听器）；池元素只做 transform/opacity；颜色全走 token 引用；`book.tsx`/`tints.ts`/静态帧降级链不动（几何三处同步纪律不触发）。\n- `shadow-docs/knowledge/animation-system.md`（active，verified 2026-09-29）\n  - 当前结论: 动画语言「微光呼吸 × 书写显现」，不做位移炫技；关键帧只在 MotionStyles 定义；**例外：站点专属组件（audio-player 先例）自持关键帧与 `--motion-*` 引用**；禁 JS scroll/resize 监听器。\n  - 适用 scope: packages/components 站点专属组件\n  - 理由: cursor 同属站点专属例外（bk-* 关键帧自持先例已入 cursor 卡）；墨迹拖尾是「书写显现」的残墨语义（笔走留痕、渐隐），非炫技位移；方案 C（canvas）的 resize 尺寸维护直接撞禁 scroll/resize 条，构成否决依据之一。\n- `shadow-docs/knowledge/design-system.md`（active，verified 2026-09-29，runtime）\n  - 执行约束: 颜色必须经主题变量暴露、4 主题自动适配；禁裸 hex、禁 `--text-secondary` 淡化。\n  - 适用: 墨点/墨丝 = `--text-color` 低透明度（墨）；点击墨渣 = `--primary-color`（朱砂落纸瞬间）；零新色值。\n- `shadow-docs/knowledge/components.md`（active，verified 2026-10-05，runtime）\n  - 执行约束: 主文件 ≤500 行可拆叶子（ImagePreview/AudioPlayer 先例）。\n  - 适用: 粒子池引擎拆独立文件 `ink.ts`，index.tsx 只做接线。\n- `norms/tdd-verification.md`: M 级 = 绿灯测试 + 走查 + runtime 深度。\n- `norms/code-style-packages.md`: 共享包变更检查直接消费者（cursor 仅 apps/site layout 消费，console 不消费）。\n\n## 决策\n- **选型:** 方案 A——**DOM 粒子池 + 自持 CSS 关键帧**。挂载时一次性建 `<div class=\"bk-ink\" aria-hidden>`（fixed 全屏、pointer-events:none、z 低于书形）内含池化 `<i>` 粒子 ×32；`onMove` 累计位移 ≥6px「钉」出一粒（round-robin 复用，重写 transform/--dx/--dy 自定义属性 + 重启动画，机制同 popping 的 remove→reflow→add）；粒子出生后不再动位置，只按 keyframes 洇开淡出（scale+opacity ~600ms），运行期零 DOM 增删、零 React 渲染。\n- **对比方案:**\n  - B（React/framer 组件化粒子）：否决——每粒出生/销毁走 reconciliation，违反移动路径零渲染纪律，120Hz 指针事件下必卡。\n  - C（全屏 canvas 粒子系统）：否决——resize 监听需求撞 animation-system 禁令；全屏透明大面常态占合成层；需求只是每秒几粒墨渣，性能模型过重。\n- **理由:** 池方案完全寄生现有事件时序与直写风格，守卫可静态钉「零新监听器/池上限/transform-opacity only」三条纪律；视觉语义（纸上残墨渐隐）与悬停跟随链的本质区别正是用户选的「运笔系」。\n\n### 关键实现决策\n\n- **T1 出生与节流:** `onMove` 与上一出生点距离 ≥6px 才 spawn；速度 `px/ms`（两事件间隔实测）分类：<1.2 → 圆墨点（r≈2px，洇开）；≥1.2 → 墨丝（横向拉长椭圆，`rotate(atan2)` 沿速度向 + 出生即 scaleX 收细——「笔快墨丝长」）。连续快速移动墨丝首尾相接即成笔触。\n- **T2 急停甩珠:** 速度自 ≥1.5px/ms 掉到 <0.2px/ms → 沿末速度方向甩 1–2 粒墨珠（`--dx/--dy` 写进 keyframes 的 translate，飞 6-14px 后缩小淡灭）。\n- **T3 点击溅墨:** `onDown`（与 popping 轻合同源）溅 3–5 粒朱砂墨渣（`--primary-color`），随机方向 ±10px、寿命 ~400ms、粒内随机延迟错峰。\n- **T4 池与复位:** N=32 round-robin 覆盖最老粒子；pointerleave 时容器随 `on` 撤类整体隐藏（在飞粒子停止显示，池位自然复用），重入不重置计数；idle 不撤轨迹（静止无出生，旧粒子已自然寿终）。\n- **T5 颜色与令牌:** 墨点/墨丝 `currentColor`（层上已 `color: var(--text-color)`）+ opacity 0.14–0.3 档；墨渣 `var(--primary-color)`；时长/缓动沿用 cursor 域现状风格（字面时长 + `--motion-ease-out-soft` fallback）。禁裸 hex（守卫扫描已钉，粒子内联只写自定义属性数值与 var 引用）。\n- **T6 门控与降级:** 粒子容器 JSX 恒渲染但 `.bk-ink { display:none }`，仅 `.bk-cursor.on` 同族激活路径下显示由 effect 挂 `bk-ink.on`（同一 fine∧noReduce 判定内）——触控/reduced-motion/未接管环境零新行为；静态帧降级链零触碰。`prefers-reduced-motion: reduce` 块中粒子 keyframes 静默（沿用域内双 @media 结构）。\n- **T7 守卫重排:** `cursor.test.mjs` 更新：keyframes 属性白名单/双 @media 计数/结构计数纳入新增 `bk-ink-*` 规则；新增断言——ink.ts 池上限常量存在、spawn 有位移阈值、`addEventListener` 计数不增（零新监听器）、粒子样式禁 hex 字面、index.tsx 接线在现有 onMove/onDown 内。原 11 条全保留。\n- **D 红线:** `book.tsx`/`tints.ts`/layout/style.tsx 既有规则一字不动（只追加 bk-ink 段）；不新增依赖；不动弹簧参数与接管时序。\n\n## 任务\n### Phase 1 — 域内实现\n\n- [ ] 新建 `ink.ts` 粒子池引擎（池 round-robin / 位移节流 / 速度分类墨点·墨丝 / 急停甩珠 / 点击溅墨 / 纯 DOM 直写零依赖） — `packages/components/cursor/ink.ts`\n- [ ] index.tsx 接线：bk-ink 容器 + BookCursor 并列；effect 内 onMove/onDown/onLeave 喂粒子引擎（零新监听器、零 React state） — `packages/components/cursor/index.tsx`\n- [ ] style.tsx 追加 bk-ink 段：容器/池元素/关键帧（仅 transform/opacity；双 @media 门控；token 色） — `packages/components/cursor/style.tsx`\n- [ ] 守卫重排（T7）并全绿 — `packages/components/cursor/cursor.test.mjs`\n- [ ] 域类型清零 — `packages/components/cursor/typecheck.test.mjs`\n\n### Phase 2 — runtime 验证（镜像页，模式同 v2）\n\n- [ ] `/tmp/build-mirror-v3` 重建镜像页量测：①注入低速/高速/急停/点击四类指针事件序列，断言出生数、墨点vs墨丝切换、甩珠出现、溅墨 3–5 粒 ②100 连发 move 后 `querySelectorAll('.bk-ink i').length === 32`（池不膨胀、零增删）③pointerleave 撤类 / 重入恢复 ④coarse/reduced-motion 环境零粒子 ⑤四主题截图浓淡取证\n- [ ] 验证结论（含浓淡参数终值）写回本 brief 结果段\n\n## 补充\npropose 收敛：纸墨运笔系质感（指=笔尖，轨迹=纸上残墨渐隐）。方案 A：DOM 粒子池 32 粒 round-robin + 自持 CSS 关键帧，寄生现有 onMove/onDown/onLeave 零新监听器、移动路径零 React 渲染；覆盖面 B 档=移动墨点/墨丝+急停甩珠+点击朱砂溅墨；book/tints/静态帧降级链零触碰。评级 M，期望验证 runtime（镜像页量测）。详见 shadow-docs/changes/20261006-feature-cursor-ink-trail/brief.md\n\n完整 brief：shadow-docs/changes/20261006-feature-cursor-ink-trail/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-feature-cursor-ink-trail\",\"type\":\"feature\",\"scope\":\"packages/components/cursor\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-feature-cursor-ink-trail/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
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
        "shadow-docs/changes/20261006-feature-cursor-ink-trail",
        "shadow-docs/knowledge/cursor-system.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(cursor): 墨迹粒子层——移动运笔拖尾 + 急停甩珠 + 点击溅墨（#509）",
      "title": "[feature] 全站光标「一页书」墨迹粒子层——移动运笔拖尾 + 点击溅墨 (#509)",
      "body": "Closes #509\n\n完整 brief：shadow-docs/changes/20261006-feature-cursor-ink-trail/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/cursor-system.md",
    "reason": "跟随层新增墨迹粒子池引擎（ink.ts，32 池位 round-robin/6px 位移节流/1.2px/ms 墨丝分档/急停甩珠/点击朱砂溅墨），零新监听器与池纪律由守卫第 12 条钉死；卡需追加结论与执行约束，verified 随 runtime 证据刷新"
  }
}
---

# 光标「一页书」墨迹粒子层——移动运笔拖尾 + 点击溅墨

## 动机

v1.4.69 弹簧随动上线后用户反馈「感官还是不太好」，希望给自定义光标加粒子特效与鼠标轨迹。propose 澄清定调：质感走**纸墨运笔系**（指 = 笔尖，轨迹 = 纸上留下的墨，出生在世界坐标停留淡出，而非悬在指针后的跟随链）——与一页书主题、导航下划线「运笔」语言同源。覆盖面取 **B 档：移动轨迹 + 急停甩珠 + 点击溅墨**（hover/wait/idle 粒子叙事不默认扩面，留作后续可选追加；此档为 AI 判断收敛，用户未明确否决即按此执行，review 可降档为仅移动）。

## 复杂度评级

- **评级:** M
- **理由:** 无契约变更（CursorLayer 对外零 API 变化、layout 挂载点不动）；行为新增限于 `packages/components/cursor` 域内装饰层，不碰六态状态机、热点纪律、降级链的既有语义；但装饰层挂全站运行路径、每帧可见，做过了头或漏了门控立刻可见（可发现性高）。不升 L：不动主题/构建/跨包数据流，静态帧资产（tints/book）零触碰。
- **期望验证深度:** runtime（守卫为静态源检 + 镜像页量测出生节流/池复用/溅墨/降级零渲染；主观「墨味浓淡」按 SGN-004 归 field 手感验证）

## 引用规范

- `shadow-docs/knowledge/cursor-system.md`（active，verified 2026-10-07，runtime）
  - 当前结论: 跟随引擎 = framer-motion useMotionValue×2 + useSpring；延迟接管 D1；六态/idle/popping classList/dataset 直写、移动路径零 React state；热点 (4,4)+OFFSET(6,6)；表现层禁裸 hex；全部行为锁 `pointer:fine ∧ no-preference`；静态帧与动效层三处同步纪律。
  - 适用 scope: packages/components/cursor
  - 本变更遵循: 粒子层寄生现有 onMove/onDown/onLeave 时序（零新监听器）；池元素只做 transform/opacity；颜色全走 token 引用；`book.tsx`/`tints.ts`/静态帧降级链不动（几何三处同步纪律不触发）。
- `shadow-docs/knowledge/animation-system.md`（active，verified 2026-09-29）
  - 当前结论: 动画语言「微光呼吸 × 书写显现」，不做位移炫技；关键帧只在 MotionStyles 定义；**例外：站点专属组件（audio-player 先例）自持关键帧与 `--motion-*` 引用**；禁 JS scroll/resize 监听器。
  - 适用 scope: packages/components 站点专属组件
  - 理由: cursor 同属站点专属例外（bk-* 关键帧自持先例已入 cursor 卡）；墨迹拖尾是「书写显现」的残墨语义（笔走留痕、渐隐），非炫技位移；方案 C（canvas）的 resize 尺寸维护直接撞禁 scroll/resize 条，构成否决依据之一。
- `shadow-docs/knowledge/design-system.md`（active，verified 2026-09-29，runtime）
  - 执行约束: 颜色必须经主题变量暴露、4 主题自动适配；禁裸 hex、禁 `--text-secondary` 淡化。
  - 适用: 墨点/墨丝 = `--text-color` 低透明度（墨）；点击墨渣 = `--primary-color`（朱砂落纸瞬间）；零新色值。
- `shadow-docs/knowledge/components.md`（active，verified 2026-10-05，runtime）
  - 执行约束: 主文件 ≤500 行可拆叶子（ImagePreview/AudioPlayer 先例）。
  - 适用: 粒子池引擎拆独立文件 `ink.ts`，index.tsx 只做接线。
- `norms/tdd-verification.md`: M 级 = 绿灯测试 + 走查 + runtime 深度。
- `norms/code-style-packages.md`: 共享包变更检查直接消费者（cursor 仅 apps/site layout 消费，console 不消费）。

## 决策

- **选型:** 方案 A——**DOM 粒子池 + 自持 CSS 关键帧**。挂载时一次性建 `<div class="bk-ink" aria-hidden>`（fixed 全屏、pointer-events:none、z 低于书形）内含池化 `<i>` 粒子 ×32；`onMove` 累计位移 ≥6px「钉」出一粒（round-robin 复用，重写 transform/--dx/--dy 自定义属性 + 重启动画，机制同 popping 的 remove→reflow→add）；粒子出生后不再动位置，只按 keyframes 洇开淡出（scale+opacity ~600ms），运行期零 DOM 增删、零 React 渲染。
- **对比方案:**
  - B（React/framer 组件化粒子）：否决——每粒出生/销毁走 reconciliation，违反移动路径零渲染纪律，120Hz 指针事件下必卡。
  - C（全屏 canvas 粒子系统）：否决——resize 监听需求撞 animation-system 禁令；全屏透明大面常态占合成层；需求只是每秒几粒墨渣，性能模型过重。
- **理由:** 池方案完全寄生现有事件时序与直写风格，守卫可静态钉「零新监听器/池上限/transform-opacity only」三条纪律；视觉语义（纸上残墨渐隐）与悬停跟随链的本质区别正是用户选的「运笔系」。

### 关键实现决策

- **T1 出生与节流:** `onMove` 与上一出生点距离 ≥6px 才 spawn；速度 `px/ms`（两事件间隔实测）分类：<1.2 → 圆墨点（r≈2px，洇开）；≥1.2 → 墨丝（横向拉长椭圆，`rotate(atan2)` 沿速度向 + 出生即 scaleX 收细——「笔快墨丝长」）。连续快速移动墨丝首尾相接即成笔触。
- **T2 急停甩珠:** 速度自 ≥1.5px/ms 掉到 <0.2px/ms → 沿末速度方向甩 1–2 粒墨珠（`--dx/--dy` 写进 keyframes 的 translate，飞 6-14px 后缩小淡灭）。
- **T3 点击溅墨:** `onDown`（与 popping 轻合同源）溅 3–5 粒朱砂墨渣（`--primary-color`），随机方向 ±10px、寿命 ~400ms、粒内随机延迟错峰。
- **T4 池与复位:** N=32 round-robin 覆盖最老粒子；pointerleave 时容器随 `on` 撤类整体隐藏（在飞粒子停止显示，池位自然复用），重入不重置计数；idle 不撤轨迹（静止无出生，旧粒子已自然寿终）。
- **T5 颜色与令牌:** 墨点/墨丝 `currentColor`（层上已 `color: var(--text-color)`）+ opacity 0.14–0.3 档；墨渣 `var(--primary-color)`；时长/缓动沿用 cursor 域现状风格（字面时长 + `--motion-ease-out-soft` fallback）。禁裸 hex（守卫扫描已钉，粒子内联只写自定义属性数值与 var 引用）。
- **T6 门控与降级:** 粒子容器 JSX 恒渲染但 `.bk-ink { display:none }`，仅 `.bk-cursor.on` 同族激活路径下显示由 effect 挂 `bk-ink.on`（同一 fine∧noReduce 判定内）——触控/reduced-motion/未接管环境零新行为；静态帧降级链零触碰。`prefers-reduced-motion: reduce` 块中粒子 keyframes 静默（沿用域内双 @media 结构）。
- **T7 守卫重排:** `cursor.test.mjs` 更新：keyframes 属性白名单/双 @media 计数/结构计数纳入新增 `bk-ink-*` 规则；新增断言——ink.ts 池上限常量存在、spawn 有位移阈值、`addEventListener` 计数不增（零新监听器）、粒子样式禁 hex 字面、index.tsx 接线在现有 onMove/onDown 内。原 11 条全保留。
- **D 红线:** `book.tsx`/`tints.ts`/layout/style.tsx 既有规则一字不动（只追加 bk-ink 段）；不新增依赖；不动弹簧参数与接管时序。

## 任务

### Phase 1 — 域内实现

- [x] 新建 `ink.ts` 粒子池引擎（池 round-robin / 位移节流 / 速度分类墨点·墨丝 / 急停甩珠 / 点击溅墨 / 纯 DOM 直写零依赖） — `packages/components/cursor/ink.ts`
- [x] index.tsx 接线：bk-ink 容器 + BookCursor 并列；effect 内 onMove/onDown/onLeave 喂粒子引擎（零新监听器、零 React state） — `packages/components/cursor/index.tsx`
- [x] style.tsx 追加 bk-ink 段：容器/池元素/关键帧（仅 transform/opacity；双 @media 门控；token 色） — `packages/components/cursor/style.tsx`
- [x] 守卫重排（T7）并全绿 — `packages/components/cursor/cursor.test.mjs`
- [x] 域类型清零 — `packages/components/cursor/typecheck.test.mjs`

### Phase 2 — runtime 验证（镜像页，模式同 v2）

- [x] `/tmp/build-mirror-v3` 重建镜像页量测：①注入低速/高速/急停/点击四类指针事件序列，断言出生数、墨点vs墨丝切换、甩珠出现、溅墨 3–5 粒 ②100 连发 move 后 `querySelectorAll('.bk-ink i').length === 32`（池不膨胀、零增删）③pointerleave 撤类 / 重入恢复 ④coarse/reduced-motion 环境零粒子 ⑤四主题截图浓淡取证
- [x] 验证结论（含浓淡参数终值）写回本 brief 结果段

## 结果

- 实际耗时: 约 40 分钟（propose 收敛后：分支/worktree + ink.ts 引擎 + 接线/样式追加 + 守卫重排 + 镜像 v3 全序列量测与四主题取证）
- 验证:
  - **守卫** `node --test packages/components/cursor/cursor.test.mjs` **12/12 绿**（原 11 条全保留：keyframes 白名单 [transform,opacity] 不动、粒子几何全部入 transform 函数；裸 hex 扫描域扩至 ink.ts；新增第 12 条「墨迹粒子层」钉 INK_POOL=32 / SPAWN_GAP=6 / `cur % INK_POOL` round-robin / `void el.offsetWidth` 重启 / TELEPORT+MAX_PER_MOVE / `.addEventListener` 计数恰为 4（零新监听器）/ `field.move|tap|reset` 在 onMove/onDown/onLeave 内 / `length: INK_POOL` 一次渲染 / `useState` 零 / 四类 `@keyframes bk-ink-*` / speck=`--primary-color`、墨=`--text-color` / `animation-delay: var(--dl)` 长写在场）；`typecheck.test.mjs` **域内 0 错误**（ink.ts 进域编译）。
  - **runtime（镜像页 v3 = esbuild 实包 worktree 真组件 + 真 framer-motion/styled-components，`/tmp/cursor-mirror-v3`，:8915）**，注入 PointerEvent + `Object.defineProperty(ev,'timeStamp')` 可控速度时钟（渲染钟与事件钟解耦，全程帧无关）：
    - ① **接管**：首帧零出生（重锚语义）、`bk-ink.on` 与 `on`/`bk-cursor-active` 同步、泵帧后 `matrix(296,296)`＝指针位−HOT(4,4) ✓
    - ② **速度分类**：6px×3 慢爬（0.06px/ms）→ 恰 3 粒 `go dot`；跳 300px（>TELEPORT）→ 0 出生不连线；40px/16ms×6 快移 → 27 粒 `go floss`（平滑速度越过 1.2px/ms 后全出墨丝）✓
    - ③ **急停**：2.5px/ms 断崖跌至 0.02 → 甩珠 `go bead` 1 粒（1–2 档）✓；**点击**：pointerdown → `go speck` 4 粒（3–5 档）✓
    - ④ **池上限**：100 连发（远超 32 出生数）后 `.bk-ink i` 恒 32、全位非空（round-robin 环绕、运行期零 DOM 增删）✓
    - ⑤ **leave/重入**：pointerleave → ink/book `on` 全撤、0 出生；重入 takeover 泵帧后 `matrix(56,76)`＝(60,80)−HOT 一帧 jump 落位 ✓
    - ⑥ **降级零粒子**：`?mode=coarse` 与 `?mode=reduce` 两环境各 30 连发 move+down → `inkOn=false`、`display:none`、spawned=0（fine∧noReduce 门控外零新行为）✓
    - ⑦ **四主题截图**：wl/wd/pl/pd 各 32 粒、dot/floss/bead/speck 四类齐、Web Animations API `pause()+currentTime=170ms` 定格取证——`design/mirror-v3-{wl,wd,pl,pd}.png`：墨丝沿速度向拖出、急停甩珠弧线、慢爬墨点列、朱砂溅渣可读，色随主题（酒红/亮灰/茶棕/米白）
  - **参数终值（浓淡调节单一改点 = style.tsx 四类规则字面时长 + keyframes opacity）**：SPAWN_GAP 6px、dot→floss 1.2px/ms、甩珠 1.5→0.2px/ms、寿命 dot 640 / floss 560 / bead 680 / speck 420ms、峰值透明 dot 0.34 / floss 0.30 / bead 0.50 / speck 0.80、飞程 bead 6–14px / speck 4–11px、错峰 speck ≤110ms。
  - **偏差记录（SGN-004 同源）**：弹簧**跟位收敛时长**仍不可量测——镜像初版把伪帧钟静默暂停（`__shimPaused=true`）致 framer 帧循环休眠（泵帧队列恒空、transform 钉死），恢复 v2 自动泵链后 takeover/重入 jump 落位复验通过，但 x.set 跟位在真实钟节流下仅爬行推进；引擎正确性由 v2 同栈 runtime 既有证据覆盖，本变更未触碰弹簧参数。浓淡主观手感归真浏览器 field。
  - **探针教训**：`getComputedStyle` 读 transform 依赖 framer 帧循环存活；合成时间戳不可与真实时间戳混泵（污染帧钟 dt）；粒子层可测性在 DOM 类/自定义属性/池计数——全部帧无关。
  - 走查：`--files` 之外零改动（book.tsx/tints.ts/layout 未碰）；style.tsx 既有规则一字未动（只追加 keyframes 段与 no-preference 块内四条长写）；监听器仍 4 个；移动路径零 React state；粒子色值仅 currentColor/两 token，零裸 hex。


## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/cursor-system.md`
- **理由:** 卡片需追加「墨迹粒子层」结论段（池引擎 + 三类事件语义 + 出生世界坐标淡出的运笔模型）与新执行约束（零新监听器、池上限、transform/opacity only）；六态/热点/降级链等既有结论不动。verified 随本变更 runtime 复验刷新。
