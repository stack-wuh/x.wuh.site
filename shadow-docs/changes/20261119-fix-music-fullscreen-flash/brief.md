---
{
  "schema": "shadow-dev/v1",
  "name": "20261119-fix-music-fullscreen-flash",
  "type": "fix",
  "scope": "apps/site",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261119-fix-music-fullscreen-flash",
  "files": [
    "apps/site/app/styles/motion.ts",
    "packages/hooks/useViewTransition/index.ts",
    "packages/hooks/test/view-transition-hooks.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 596,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/596",
    "pullRequest": 597,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/597"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "63f2da36a2a2748a3a84a2b02ce052a1e7c8377c",
    "verifiedAt": "2026-11-19T14:26:57.509Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:597",
    "planHash": "4332b36190d7b4926f9692422f16c2f4dbf9d1b2dab046c0d8519a296403f7a9",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 切年仍全屏闪动——手动换幕误触发 root 过渡",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\nv1.4.109 上线后用户实测 `/music` 切年仍有**全屏闪动**，此前「Loading 已收窄到列表区」的结论不足以解释它。\n\n根因与 Loading 范围无关：`startViewTransition` 每次都会对**整个页面 root** 做快照，而 `MotionStyles` 为硬导航定义了 `::view-transition-old(root)` / `new(root)` 的 **600ms 淡出 + 上浮 8px**。手动换幕（切年、footprint 选点）走同一个 `startViewTransition`，于是 header / 纵轨 / 页脚也被套上 600ms 整页过渡。`content-swap` 的 220ms 只作用于内容区，拦不住 root 那一份。\n\n## 引用规范\n（brief 缺少该节）\n\n## 决策\n- **选型:** 换幕期间给 `html` 挂 `data-vt-scoped`，CSS 用 `html[data-vt-scoped]::view-transition-old/new(root) { animation-duration: 0s }` 压掉 root 两端，`finished` 后移除。硬导航无该属性，不受影响。\n- **对比方案:**\n  - B「全局禁用非 content-swap 视图过渡」——影响面大，需逐个元素验证。\n  - C「移除 View Transition，只留骨架 + mount-rise」——会失去内容区交叉淡化。\n  - 用户选 A。\n- **理由:** 抑制精确落在 root 这一层，改动面最小；选择器有效性经实测确认。\n\n## 任务\n### Phase 1\n- [x] task 1 — packages/hooks/useViewTransition/index.ts — 换幕期挂/卸 `data-vt-scoped`（引用计数 + 同步抛错兜底）\n- [x] task 2 — apps/site/app/styles/motion.ts — `html[data-vt-scoped]` 下 root 过渡时长压 0\n- [x] task 3 — packages/hooks/test/view-transition-hooks.test.mjs — 新增「标记挂卸」与「CSS 规则在场」两条回归\n\n完整 brief：shadow-docs/changes/20261119-fix-music-fullscreen-flash/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261119-fix-music-fullscreen-flash\",\"type\":\"fix\",\"scope\":\"apps/site\",\"status\":\"reviewed\",\"branch\":\"fix/20261119-fix-music-fullscreen-flash\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261119-fix-music-fullscreen-flash/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": []
    },
    "release": {
      "files": [
        "apps/site/app/styles/motion.ts",
        "packages/hooks/test/view-transition-hooks.test.mjs",
        "packages/hooks/useViewTransition/index.ts",
        "shadow-docs/changes/20261119-fix-music-fullscreen-flash/brief.md",
        "shadow-docs/knowledge/animation-system.md"
      ],
      "message": "fix(next): 手动换幕抑制 root 过渡——修切年全屏闪动",
      "title": "fix(next): 手动换幕抑制 root 过渡——修切年全屏闪动",
      "body": "## 变更\n- **根因**：`startViewTransition` 每次快照整个页面，`MotionStyles` 为硬导航定义的 `::view-transition-old/new(root)`（600ms 淡出 + 上浮 8px）因此被手动换幕一并触发——header / 纵轨 / 页脚整页过渡，这就是全屏闪动\n- `useViewTransition` 换幕期间给 `html` 挂 `data-vt-scoped`（引用计数 + 同步抛错兜底），`finished` 后移除\n- `MotionStyles` 新增 `html[data-vt-scoped]::view-transition-old/new(root) { animation-duration: 0s }`\n- 新增两条回归测试：标记挂卸、CSS 规则在场\n\n## 影响\n- 行为/触发面变化：`/music` 切年与 `/footprint` 选点不再整页闪动；内容区 `content-swap` 220ms 交叉淡化保留\n- 明确不受影响的范围：硬导航整页过渡（无 `data-vt-scoped` 属性，规则不生效）、换幕回落三分支（SSR / 特性不支持 / reduced-motion）、`mount-rise` 错峰入场\n\n## 验证\n- 最小复现页实测（真实 `startViewTransition` + `getComputedStyle` 查伪元素）：不挂标记 `::view-transition-old(root)` = **0.6s**；挂标记 = **0s**；`content-swap` 恒 **0.22s**\n- 单测：`view-transition-hooks` **9/9**（原 7 + 新增 2 回归）、`music-player-wiring` **13/13**，合计 22/22\n- 未覆盖项（明说，不留空白）：本地 dev server 因 SWC 二进制签名问题起不来（x86_64 macOS 环境态），根 `tsc` 同因 SIGSEGV——均与本次改动无关，以逐文件 parse 检查 + CI 门禁兜底\n\n## 关联\n- Closes #596\n- brief: shadow-docs/changes/20261119-fix-music-fullscreen-flash/brief.md"
    }
  },
  "knowledge": null
}
---

# 切年仍全屏闪动——手动换幕误触发 root 过渡

## 动机

v1.4.109 上线后用户实测 `/music` 切年仍有**全屏闪动**，此前「Loading 已收窄到列表区」的结论不足以解释它。

根因与 Loading 范围无关：`startViewTransition` 每次都会对**整个页面 root** 做快照，而 `MotionStyles` 为硬导航定义了 `::view-transition-old(root)` / `new(root)` 的 **600ms 淡出 + 上浮 8px**。手动换幕（切年、footprint 选点）走同一个 `startViewTransition`，于是 header / 纵轨 / 页脚也被套上 600ms 整页过渡。`content-swap` 的 220ms 只作用于内容区，拦不住 root 那一份。

## 复杂度评级
- **评级:** S
- **理由:** 3 文件（hook 抑制开关 + 一处 CSS 规则 + 测试），不改换幕语义与任何调用方签名。
- **期望验证深度:** runtime（最小复现页实测伪元素计算样式）

## 领域模型
- **限界上下文:** animation-system 换幕两层（层 1 `content-swap` 交叉淡化 / 层 2 `mount-rise` 重挂入场）+ 硬导航整页过渡（`@view-transition`）。
- **被触及的既有不变量:** 硬导航 root 过渡必须保留；`content-swap` 过渡必须保留；`useViewTransition` 回落三分支（SSR / 不支持 / reduced-motion）行为不变。

## 决策
- **选型:** 换幕期间给 `html` 挂 `data-vt-scoped`，CSS 用 `html[data-vt-scoped]::view-transition-old/new(root) { animation-duration: 0s }` 压掉 root 两端，`finished` 后移除。硬导航无该属性，不受影响。
- **对比方案:**
  - B「全局禁用非 content-swap 视图过渡」——影响面大，需逐个元素验证。
  - C「移除 View Transition，只留骨架 + mount-rise」——会失去内容区交叉淡化。
  - 用户选 A。
- **理由:** 抑制精确落在 root 这一层，改动面最小；选择器有效性经实测确认。

## 任务
### Phase 1
- [x] task 1 — packages/hooks/useViewTransition/index.ts — 换幕期挂/卸 `data-vt-scoped`（引用计数 + 同步抛错兜底）
- [x] task 2 — apps/site/app/styles/motion.ts — `html[data-vt-scoped]` 下 root 过渡时长压 0
- [x] task 3 — packages/hooks/test/view-transition-hooks.test.mjs — 新增「标记挂卸」与「CSS 规则在场」两条回归

## 结果

- **实测（最小复现页，真实 `startViewTransition`）:**

  | 场景 | `::view-transition-old(root)` | `content-swap` |
  |---|---|---|
  | 不挂标记 | **0.6s**（全屏闪） | 0.22s |
  | 挂 `data-vt-scoped` | **0s**（不闪） | 0.22s |

  选择器 `html[data-vt-scoped]::view-transition-old(root)` 确认命中生效。

- **单测:** `view-transition-hooks` **9/9**（原 7 + 新增 2 回归）；`music-player-wiring` **13/13**。合计 22/22 全绿。
- **未覆盖项:** 本地 dev server 因 SWC 二进制签名问题起不来（x86_64 macOS 环境态，与本次改动无关），未在真实浏览器跑完整页面；依据为最小复现页计算样式实证 + 单测。根 `tsc` 同因 SIGSEGV，改以逐文件 parse 检查（两文件均 OK）与 CI 门禁兜底。

## 影响面

`useViewTransition` 另一消费者 `apps/site/app/footprint/page.tsx`（选点换幕）同样受益——它此前每点一次也整页闪。该页未挂 `content-swap`，修复后其换幕为瞬时提交（无 root 过渡、无内容区过渡），行为更干净。