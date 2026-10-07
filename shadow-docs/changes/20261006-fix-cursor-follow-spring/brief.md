---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-fix-cursor-follow-spring",
  "type": "fix",
  "scope": "packages/components/cursor",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261006-fix-cursor-follow-spring",
  "files": [
    "packages/components/cursor/cursor.test.mjs",
    "packages/components/cursor/index.tsx",
    "packages/components/cursor/style.tsx",
    "shadow-docs/changes/20261006-fix-cursor-follow-spring/brief.md",
    "shadow-docs/knowledge/cursor-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 500,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/500",
    "pullRequest": 507,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/507"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "ef62462d270b95d38a5c407969c5982cbb7227df",
    "verifiedAt": "2026-10-06T16:06:59.617Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:507",
    "planHash": "f4ff2a01ec905a2044834c756b21f5c70bf35b0f59053d8349fec18c909e7da0",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 全站光标跟随层：刷新后左上角卡位 + 长移动 idle 抖动修复，改用 framer-motion 弹簧随动",
      "titleRaw": "全站光标跟随层：刷新后左上角卡位 + 长移动 idle 抖动修复，改用 framer-motion 弹簧随动",
      "supplement": "用户实走 v1.4.68 反馈两症状：①刷新后书形钉在左上角直到鼠标移动（初始 on 类写死 + 指针位置无 API 可读，需延迟接管）；②连续移动 ≥5s 后卡顿（armIdle 定时器未 clearTimeout，idle 动画逐帧闪现）。方案（propose 已定，用户选 B）：跟随层迁移到 framer-motion useMotionValue/useSpring（仓库既有依赖），同批修复接管时序与 idle 定时器。完整方案与验证计划见 shadow-docs/changes/20261006-fix-cursor-follow-spring/brief.md",
      "body": "## 动机\nv1.4.68「一页书」上线后用户实走发现两个问题：\n\n1. **刷新后书形钉在左上角**：`index.tsx` JSX 写死 `className='bk-cursor on'` 且 mount 即加 `bk-cursor-active`——系统光标立刻消失，而跟随层初始 transform 从未落笔（`place()` 只在 pointermove 里调），书就裸在 `left:0;top:0` 直到鼠标第一次移动才跳过去。浏览器无任何 API 能在指针未动时读取其位置，「预放」不可行，只能延迟接管。\n2. **连续移动「卡卡的」**：`armIdle()` 每次 pointermove 新建 5s 定时器但从不 `clearTimeout`——连续移动超过 5 秒后，积压定时器开始逐帧触发 `idle`（整页翻书动画闪现）又被下一帧移除，形成规律性抖动。这是卡顿的主根因，属计时 bug，换任何跟随引擎都不消失。\n\n用户点名探讨「引用其他库优化卡顿」。仓库 `packages/components` 已声明 framer-motion ^11 并在 image-preview 实际使用——选型收敛为方案 B：跟随层改用 framer-motion `useMotionValue`/`useSpring`，弹簧消解指针事件频率与帧率错位的高频抖，手感对标 CursorJS 系丝滑跟随。\n\n## 引用规范\n- `shadow-docs/knowledge/cursor-system.md`（active，verified 2026-10-06，scope 命中 packages/components/cursor）\n  - 当前结论: 跟随层 = 单一 rAF + translate3d 合成器层实时跟手；热点 HOT(4,4) + OFFSET(6,6)；六态 closest 状态机；idle ≥5s 整页翻；4 主题×6 态 data-URI 降级链。\n  - 适用 scope: packages/components/cursor, apps/site/app/layout.tsx\n  - **待确认点:** 「单一 rAF + translate3d」是实现机制级结论，本变更改为 framer-motion 引擎驱动后该句过期，Knowledge 影响=更新卡片对应结论（六态/idle 语义/降级链/热点纪律不变）。\n- `shadow-docs/knowledge/animation-system.md`（active）\n  - 当前结论: 禁 JS scroll/resize 监听器（本变更不涉及）；站点专属组件可自持关键帧（audio-player 先例，cursor 同例）。\n- `norms/code-style.md` / `norms/code-style-packages.md`：共享包变更须检查直接消费者（cursor 仅 apps/site layout 消费）。\n- `norms/tdd-verification.md`：M 级 = 绿灯测试 + 走查 + 与评级匹配的 runtime 深度。\n\n## 决策\n- **选型:** 方案 B——跟随层迁移到 framer-motion `useMotionValue` + `useSpring`，同批修复接管时序与 idle 定时器两个 bug。\n- **对比方案:**\n  - A（零依赖工程修复：延迟接管 + clearTimeout + 6 行手写 lerp）：同样修好两个 bug 且零 bundle 增量，被用户在 propose 中否决——选择官方弹簧手感与既有动效栈统一。\n  - C（外部光标库 CursorJS / cursed.js 等）：否决——只提供裸跟随层，无法接入六态 closest 状态机、idle 翻书、4 主题 data-URI 降级链与 HOT/OFFSET 热点纪律，且新增外部依赖违反组件自持现状。\n- **理由:** framer-motion ^11 已是 `packages/components` 声明依赖且 image-preview 在用，不算引入外来户；`useSpring` 在静止时自动停写、激活时由 framer 统一帧调度写 transform（自带 translate3d + GPU 提升），比手写 lerp 少一层自持 rAF。代价明示：CursorLayer 挂 layout 顶层 ⇒ framer-motion 进入全部页面的关键 bundle（~30KB gz 级），用户已知晓选型时接受。\n\n### 关键实现决策\n\n- **D1 延迟接管（修左上角）:** JSX 初始 className 不再含 `on`；`bk-cursor-active` 不在 effect mount 时加，改在**首个 pointermove** 内：先把源 motion value 与 spring `jump()` 到指针位（HOT 偏移照扣），再同帧加 `on` + active 类。系统箭头在用户第一次动鼠标前保持可见，动的第一帧书形直接落位，无扫移动画。`pointerleave` 后重置「已接管」标记，指针重入时同样 jump 落位而非从旧点弹过去。\n- **D2 idle 定时器修复（修抖动主因）:** `armIdle()` 内先 `clearTimeout(idleTimer)` 再设新定时器。\n- **D3 弹簧参数:** 高刚度低阻尼（起点 stiffness≈1000 / damping≈60 / mass≈0.5），目标延迟 ≤2 帧——保留跟手直觉，只抹平事件采样与帧率的错位；Phase 2 runtime 按实走微调并记录终值。reduced-motion 路径本就整层不挂载，弹簧无 a11y 增量风险。\n- **D4 位移模型:** `x/y` 两个 motion value 驱动 `<motion.div style>`，源值 = `clientX - HOT[0]` / `clientY - HOT[1]`；六态 `data-state`、`idle`、`popping` 仍走 classList/dataset 直写（非 React state，移动路径零 re-render 维持）。删除自持 rAF 与 `place()`。\n- **D5 守卫重排:** `cursor.test.mjs` 中「translate3d 字符串存在于源码」断言改为引擎断言——源码含 `useMotionValue`/`useSpring`/`motion.div`/`jump`，且不含 `requestAnimationFrame`（引擎已接管）；新增：JSX 初始不含 `on`、`bk-cursor-active` 在 onMove 内添加、`armIdle` 含 `clearTimeout`。d 值快照/结构计数/keyframes 白名单/双 @media 门控/data-URI 禁变量/HOT+OFFSET 等其余全数保留。\n- **D6 范围红线:** `style.tsx` 动画规则、`book.tsx` 几何、`tints.ts` 数据表不动（除非 runtime 暴露必要）；不动 layout；不新增依赖声明。\n\n## 任务\n### Phase 1 — 引擎迁移与 bug 修复（域内）\n\n- [ ] index.tsx 重写跟随层：D1 延迟接管 / D2 clearTimeout / D3-D4 motion values + spring，删除自持 rAF — `packages/components/cursor/index.tsx`\n- [ ] cursor.test.mjs 守卫重排（D5），node --test 全绿 — `packages/components/cursor/cursor.test.mjs`\n- [ ] 域类型清零：`node --test packages/components/cursor/typecheck.test.mjs`（framer 类型进域编译）\n- [ ] style.tsx 仅按需微调（如 `.on` 初始隐藏时序所需），默认不动 — `packages/components/cursor/style.tsx`\n\n### Phase 2 — runtime 验证（dev 站，浏览器自动化只读）\n\n- [ ] `pnpm dev:next` 起站：①刷新后系统箭头可见，首次移动书形瞬落指针位（无左上角停留、无扫移）②连续画圈移动 ≥8s，脚本采样 `classList.contains('idle')` 恒 false（5s 阈前不闪）③六态映射抽查（link/text/wait/grab）④弹簧手感记录与 D3 终值微调\n- [ ] 验证结论与弹簧终值写回本 brief 结果段\n\n## 补充\n用户实走 v1.4.68 反馈两症状：①刷新后书形钉在左上角直到鼠标移动（初始 on 类写死 + 指针位置无 API 可读，需延迟接管）；②连续移动 ≥5s 后卡顿（armIdle 定时器未 clearTimeout，idle 动画逐帧闪现）。方案（propose 已定，用户选 B）：跟随层迁移到 framer-motion useMotionValue/useSpring（仓库既有依赖），同批修复接管时序与 idle 定时器。完整方案与验证计划见 shadow-docs/changes/20261006-fix-cursor-follow-spring/brief.md\n\n完整 brief：shadow-docs/changes/20261006-fix-cursor-follow-spring/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-fix-cursor-follow-spring\",\"type\":\"fix\",\"scope\":\"packages/components/cursor\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-fix-cursor-follow-spring/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "packages/components/cursor/cursor.test.mjs",
        "packages/components/cursor/index.tsx",
        "shadow-docs/changes/20261006-fix-cursor-follow-spring/brief.md",
        "shadow-docs/changes/20261006-fix-cursor-follow-spring/design/runtime-mirror-pointer-state.png",
        "shadow-docs/knowledge/cursor-system.md",
        "shadow-docs/signals.md"
      ],
      "message": "fix(cursor): 跟随层延迟接管修钉角与 idle 抖动，迁移 framer-motion 弹簧随动 (#500)",
      "title": "[fix] 全站光标跟随层：刷新后左上角卡位 + 长移动 idle 抖动修复，改用 framer-motion 弹簧随动",
      "body": "Closes #500\n\n完整 brief：shadow-docs/changes/20261006-fix-cursor-follow-spring/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/cursor-system.md",
    "reason": "跟随机制结论（单一 rAF + translate3d）被 framer-motion 弹簧 + 延迟接管 + leave 重武装取代；idle 定时器须先 clear 的纪律入卡；六态/idle 语义/data-URI 降级链/HOT+OFFSET 热点不变；验证方式段同步守卫新断言"
  }
}
---

# 光标跟随层：接管时序修复 + framer-motion 弹簧随动

## 动机

v1.4.68「一页书」上线后用户实走发现两个问题：

1. **刷新后书形钉在左上角**：`index.tsx` JSX 写死 `className='bk-cursor on'` 且 mount 即加 `bk-cursor-active`——系统光标立刻消失，而跟随层初始 transform 从未落笔（`place()` 只在 pointermove 里调），书就裸在 `left:0;top:0` 直到鼠标第一次移动才跳过去。浏览器无任何 API 能在指针未动时读取其位置，「预放」不可行，只能延迟接管。
2. **连续移动「卡卡的」**：`armIdle()` 每次 pointermove 新建 5s 定时器但从不 `clearTimeout`——连续移动超过 5 秒后，积压定时器开始逐帧触发 `idle`（整页翻书动画闪现）又被下一帧移除，形成规律性抖动。这是卡顿的主根因，属计时 bug，换任何跟随引擎都不消失。

用户点名探讨「引用其他库优化卡顿」。仓库 `packages/components` 已声明 framer-motion ^11 并在 image-preview 实际使用——选型收敛为方案 B：跟随层改用 framer-motion `useMotionValue`/`useSpring`，弹簧消解指针事件频率与帧率错位的高频抖，手感对标 CursorJS 系丝滑跟随。

## 复杂度评级

- **评级:** M
- **理由:** 无契约变更（组件对外零 API 变化，layout 挂载点不动）；行为变化限于 `packages/components/cursor` 域内跟随引擎与时序；但 CursorLayer 挂在 layout 顶层属全站运行路径，改坏了桌面端立刻可见（可发现性高）。不升 L：不碰主题/构建/跨包数据流。
- **期望验证深度:** runtime（dev 站 + 浏览器自动化实测接管时序与长移动无抖动；守卫为静态源检，不足以证明「不卡」）

## 引用规范

- `shadow-docs/knowledge/cursor-system.md`（active，verified 2026-10-06，scope 命中 packages/components/cursor）
  - 当前结论: 跟随层 = 单一 rAF + translate3d 合成器层实时跟手；热点 HOT(4,4) + OFFSET(6,6)；六态 closest 状态机；idle ≥5s 整页翻；4 主题×6 态 data-URI 降级链。
  - 适用 scope: packages/components/cursor, apps/site/app/layout.tsx
  - **待确认点:** 「单一 rAF + translate3d」是实现机制级结论，本变更改为 framer-motion 引擎驱动后该句过期，Knowledge 影响=更新卡片对应结论（六态/idle 语义/降级链/热点纪律不变）。
- `shadow-docs/knowledge/animation-system.md`（active）
  - 当前结论: 禁 JS scroll/resize 监听器（本变更不涉及）；站点专属组件可自持关键帧（audio-player 先例，cursor 同例）。
- `norms/code-style.md` / `norms/code-style-packages.md`：共享包变更须检查直接消费者（cursor 仅 apps/site layout 消费）。
- `norms/tdd-verification.md`：M 级 = 绿灯测试 + 走查 + 与评级匹配的 runtime 深度。

## 决策

- **选型:** 方案 B——跟随层迁移到 framer-motion `useMotionValue` + `useSpring`，同批修复接管时序与 idle 定时器两个 bug。
- **对比方案:**
  - A（零依赖工程修复：延迟接管 + clearTimeout + 6 行手写 lerp）：同样修好两个 bug 且零 bundle 增量，被用户在 propose 中否决——选择官方弹簧手感与既有动效栈统一。
  - C（外部光标库 CursorJS / cursed.js 等）：否决——只提供裸跟随层，无法接入六态 closest 状态机、idle 翻书、4 主题 data-URI 降级链与 HOT/OFFSET 热点纪律，且新增外部依赖违反组件自持现状。
- **理由:** framer-motion ^11 已是 `packages/components` 声明依赖且 image-preview 在用，不算引入外来户；`useSpring` 在静止时自动停写、激活时由 framer 统一帧调度写 transform（自带 translate3d + GPU 提升），比手写 lerp 少一层自持 rAF。代价明示：CursorLayer 挂 layout 顶层 ⇒ framer-motion 进入全部页面的关键 bundle（~30KB gz 级），用户已知晓选型时接受。

### 关键实现决策

- **D1 延迟接管（修左上角）:** JSX 初始 className 不再含 `on`；`bk-cursor-active` 不在 effect mount 时加，改在**首个 pointermove** 内：先把源 motion value 与 spring `jump()` 到指针位（HOT 偏移照扣），再同帧加 `on` + active 类。系统箭头在用户第一次动鼠标前保持可见，动的第一帧书形直接落位，无扫移动画。`pointerleave` 后重置「已接管」标记，指针重入时同样 jump 落位而非从旧点弹过去。
- **D2 idle 定时器修复（修抖动主因）:** `armIdle()` 内先 `clearTimeout(idleTimer)` 再设新定时器。
- **D3 弹簧参数:** 高刚度低阻尼（起点 stiffness≈1000 / damping≈60 / mass≈0.5），目标延迟 ≤2 帧——保留跟手直觉，只抹平事件采样与帧率的错位；Phase 2 runtime 按实走微调并记录终值。reduced-motion 路径本就整层不挂载，弹簧无 a11y 增量风险。
- **D4 位移模型:** `x/y` 两个 motion value 驱动 `<motion.div style>`，源值 = `clientX - HOT[0]` / `clientY - HOT[1]`；六态 `data-state`、`idle`、`popping` 仍走 classList/dataset 直写（非 React state，移动路径零 re-render 维持）。删除自持 rAF 与 `place()`。
- **D5 守卫重排:** `cursor.test.mjs` 中「translate3d 字符串存在于源码」断言改为引擎断言——源码含 `useMotionValue`/`useSpring`/`motion.div`/`jump`，且不含 `requestAnimationFrame`（引擎已接管）；新增：JSX 初始不含 `on`、`bk-cursor-active` 在 onMove 内添加、`armIdle` 含 `clearTimeout`。d 值快照/结构计数/keyframes 白名单/双 @media 门控/data-URI 禁变量/HOT+OFFSET 等其余全数保留。
- **D6 范围红线:** `style.tsx` 动画规则、`book.tsx` 几何、`tints.ts` 数据表不动（除非 runtime 暴露必要）；不动 layout；不新增依赖声明。

## 任务

### Phase 1 — 引擎迁移与 bug 修复（域内）

- [x] index.tsx 重写跟随层：D1 延迟接管 / D2 clearTimeout / D3-D4 motion values + spring，删除自持 rAF — `packages/components/cursor/index.tsx`
- [x] cursor.test.mjs 守卫重排（D5），node --test 全绿 — `packages/components/cursor/cursor.test.mjs`
- [x] 域类型清零：`node --test packages/components/cursor/typecheck.test.mjs`（framer 类型进域编译）
- [x] style.tsx 仅按需微调（如 `.on` 初始隐藏时序所需），默认不动 — `packages/components/cursor/style.tsx`

### Phase 2 — runtime 验证（dev 站，浏览器自动化只读）

- [x] `pnpm dev:next` 起站：①刷新后系统箭头可见，首次移动书形瞬落指针位（无左上角停留、无扫移）②连续画圈移动 ≥8s，脚本采样 `classList.contains('idle')` 恒 false（5s 阈前不闪）③六态映射抽查（link/text/wait/grab）④弹簧手感记录与 D3 终值微调
- [x] 验证结论与弹簧终值写回本 brief 结果段

## 结果

- 实际耗时: 约 50 分钟（propose 收敛后 apply：分支准备 + 引擎重写 + 守卫 2 处重排 + 镜像 runtime 量测）
- 验证:
  - **守卫** `node --test packages/components/cursor/cursor.test.mjs` **11/11 绿**（原 10 条，「跟随层引擎」测试按 D5 重排为 framer 引擎断言 + D1 时序断言；idle 测试新增 D2 clearTimeout 顺序断言）；`node --test packages/components/cursor/typecheck.test.mjs` **域内 0 错误**（framer 类型进域编译）。
  - **runtime（镜像页 = esbuild 实包真 `index.tsx` + 真 framer-motion 11.18.2 + 真 styled-components，`/tmp/cursor-mirror-v2`，:8914）**，浏览器自动化注入 PointerEvent 实测：
    - ① **D1 延迟接管**：挂载后 `bk-cursor` 无 `on`、html 无 `bk-cursor-active`、静帧保持；首个 pointermove(300,200) 同步 `on`+active、`cursor:none` 生效，一帧后 transform 精确 `matrix(1,0,0,1,296,196)`＝指针位−HOT(4,4)，**零扫移落位** ✓
    - ② **D2 idle 泄漏回归**：30 连发 move（跨 ~8s，>5s 阈值）观察器逐 150ms 采样——`idleSeen=[]`，移动全程 0 次 idle 闪现 ✓（旧实现同窗必然逐帧闪现）；静止后 idle 于 **5.214s** 出现（阈值 5s + 采样粒度 ✓）；一动立即收回 ✓
    - ③ **六态映射**：link→`pointer`、input→`text`、`[data-cursor=wait]`→`wait`、`[data-cursor=grab]`→`grab`、grab+pointerdown→`grabbing`、up→`grab`、空白→`default` 全对 ✓；pointerleave→`on` 撤、重入(50,400) 一帧 `jump` 落位无扫移 ✓
    - ④ **弹簧收敛**：700px 远跳终值精确命中目标位（截图取证 54,69＝链接位−HOT，见 `design/runtime-mirror-pointer-state.png`：书形右下错开、pointer 态掀页、主题纸色渲染正确）。
  - **偏差记录（环境限制）**：ZCode 内置浏览器 WKWebView 后台渲染帧饥饿实锤——rAF 完全不回调、页面计时器限 3 次/秒预算；弹簧**毫秒级收敛时长曲线**在该环境无法可信量测（fake 帧时钟可证明「动画在推进且终值精确」，不能证明时长）。D3 参数维持起点值 stiffness=1000 / damping=60 / mass=0.5 不动；收敛时长与主观跟手感由用户 field 验证（dev 站 :3000 已在本分支工作树，浏览器打开刷新即可）。
  - 走查：移动路径零 React state（classList/dataset 直写维持）；cleanup 完备（listener/timer/active 类全撤）；`--files` 之外零改动（book.tsx/tints.ts/layout 未碰）。
- 交付发布记录（2026-10-07）:
  - PR #502 merged（2cb8cc8），push quality-gate 绿；Release [v1.4.69](https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.69)（用户授权代跑创建）。
  - 部署链 run 37493964499：首试 `build-next`/`build-nest` 于 16:16:14 **同一秒** SSH exit 255（远端构建输出此前正常）＝主机层面事件（当日旁证：凌晨 disk-clean docker prune 10 分钟超时红、15:29 起 runner 视角 x.wuh.site DNS 解析失败）；`gh run rerun --failed` 后 **7/7 全绿**，switch-traffic 日志实锤旧容器销毁→新容器（release SHA 构建）起服、nest Healthy。
  - 产物指纹抽查受阻于公网：本机外联半瘫（ssh/443 超时、直连 curl/DoH 全灭，仅 gh HTTPS 存活）+ runner DNS 解析失败同源——**x.wuh.site 域名解析故障为基建问题与本 change 无关**（v1.4.68 同样不可达）；上线内容以 CI 链 + 容器更换日志为证。域名 DNS 恢复后建议浏览器目检一次光标（钉角消失、长移动不抖）。
  - 归档修复注记：#502 squash 合并后 CLI 断点重建分支产生 #507；因合并后其他会话继续修改 `signals.md` 造成假冲突面，经授权以 `merge -X theirs`（内容一律以 main 为准）收敛为仅 brief 状态文件差异的干净 PR。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/cursor-system.md`
- **理由:** 卡片核心结论「单一 rAF + translate3d 实时跟手」被 framer-motion 弹簧引擎 + 延迟接管时序取代；须同步「热点/六态/idle 语义/data-URI 降级链」不变部分保留，verified-depth 重新升 runtime。
