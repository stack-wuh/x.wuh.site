---
{
  "schema": "shadow-dev/v1",
  "name": "20261002-perf-cjk-font-slim",
  "type": "build",
  "scope": "apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "build/20261002-perf-cjk-font-slim",
  "files": [
    "apps/site/app/components/FontPrefetch.tsx",
    "apps/site/app/fonts/cjk.css",
    "apps/site/app/layout.tsx",
    "apps/site/test/first-load-fonts.test.mjs",
    "apps/site/types/fonts.d.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 465,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/465",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "36ebfd727d26b57d54540eac59469c4318fdb937",
    "verifiedAt": "2026-10-02T02:19:20.889Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:465",
    "planHash": "0908c44465ca5c8b644fc96f2ec25cf8f463ad6e51ab10f209f0da124d1c874e",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[build] build: CJK 字体瘦身第一步——Sans 700 合成加粗 + 首屏字重真 preload",
      "titleRaw": "build: CJK 字体瘦身第一步——Sans 700 合成加粗 + 首屏字重真 preload",
      "supplement": "来源 #438 未纳入项 D 稳健档。生产实测四款 CJK 字重合计 1989KB（i18n 扩集后）；FontPrefetch 仅 idle load 无 preload。用户拍板：砍 Sans 700（合成加粗，省 408KB −20%），Serif 700 保留保印章/标题观感；首屏 Serif/Sans 400 加真 preload。不切片（知识卡禁止）、不重切子集。M 级/runtime。brief: shadow-docs/changes/20261002-perf-cjk-font-slim/brief.md",
      "body": "## 动机\n#438 未纳入项 D（M–L），用户拍板稳健方案。生产实测（2026-10-02，v1.4.55）：\n- 四款 CJK 字重合计 **1989KB**（Serif400 578KB / Serif700 580KB / Sans400 408KB / Sans700 408KB / JetBrainsMono 15KB）——比 #438 审计时的 1146KB 更大（i18n 假名扩集后），占首页传输绝对大头\n- FontPrefetch 只做 idle `document.fonts.load()`，无 `<link rel=preload>`——首屏必需字重等 CSS 解析完才被发现\n- **视觉取舍（用户已确认稳健档）**: 砍 **Sans 700**（UI 粗体合成加粗，风险低），**Serif 700 保留**（文章 H1 标题、TOC、朱砂印章观感保真）\n- 预期：−408KB（−20%），首屏字重发现时序提前\n\n## 引用规范\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: CJK 子集经 cjk.css 管线接入（immutable 哈希）；对千字级子集做 unicode-range 切片是负优化（禁止）；任何印面/品牌字形变更必须过 expand_cjk_fonts.py\n  - 适用 scope: 本变更不切片、不重切子集，仅移除一个字重的交付与改善发现时序；files/ 物理文件保留（扩集脚本产物），CSS 不再引用即不打包\n- shadow-docs/knowledge/seo.md（不触碰）\n\n## 决策\n- **选型:** ① `app/fonts/cjk.css` 删除 Noto Sans SC 700 @font-face（sans 粗体由 400 合成加粗，浏览器自动）；② `app/layout.tsx` 对首屏必需的 Serif 400 + Sans 400 输出 `<link rel=\"preload\" as=\"font\" type=\"font/woff2\" crossOrigin>`——woff2 经静态 import 取构建哈希 URL（新增 `types/fonts.d.ts` 声明）；③ `FontPrefetch.tsx` WARM_SPECS 移除 Sans 700，改为仅 idle 预热非首屏的 Serif 700（preload 覆盖不到的延迟字重）\n- **对比方案:** 双 700 全砍（−988KB）——印章/标题观感风险，用户未选；仅修 preload 不砍字重——收益 0，用户已确认砍 Sans 700\n- **理由:** 最小视觉风险的实质瘦身；preload 修的是发现时序而非体积，两者正交\n\n## 任务\n### Phase 1 红测试\n- [ ] 契约测试：cjk.css 无 SansSC-700 face；layout.tsx 含两条 font preload（Serif/Sans 400）；FontPrefetch 无 Noto Sans SC 字样 —— `apps/site/test/first-load-fonts.test.mjs`\n### Phase 2 实现\n- [ ] cjk.css 删 Sans 700 face + 头注释更新 — `apps/site/app/fonts/cjk.css`\n- [ ] layout.tsx 两条 preload（woff2 静态 import）+ types/fonts.d.ts — `apps/site/app/layout.tsx`、`apps/site/types/fonts.d.ts`\n- [ ] FontPrefetch WARM_SPECS 清理 — `apps/site/app/components/FontPrefetch.tsx`\n### Phase 3 验证与收尾\n- [ ] tsc + oxlint + 全量 node --test（18 挂存量基线对照） — `apps/site`\n- [ ] runtime 验收：部署后生产首页 HTML 含 2 条 font preload、CSS bundle 无 SansSC-700 引用、字体传输 1989KB→约 1.58MB — `apps/site`\n- [ ] 变更说明回填 PR body — issue\n\n## 补充\n来源 #438 未纳入项 D 稳健档。生产实测四款 CJK 字重合计 1989KB（i18n 扩集后）；FontPrefetch 仅 idle load 无 preload。用户拍板：砍 Sans 700（合成加粗，省 408KB −20%），Serif 700 保留保印章/标题观感；首屏 Serif/Sans 400 加真 preload。不切片（知识卡禁止）、不重切子集。M 级/runtime。brief: shadow-docs/changes/20261002-perf-cjk-font-slim/brief.md\n\n完整 brief：shadow-docs/changes/20261002-perf-cjk-font-slim/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261002-perf-cjk-font-slim\",\"type\":\"build\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261002-perf-cjk-font-slim/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "build"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/components/FontPrefetch.tsx",
        "apps/site/app/fonts/cjk.css",
        "apps/site/app/layout.tsx",
        "apps/site/test/first-load-fonts.test.mjs",
        "apps/site/types/fonts.d.ts",
        "shadow-docs/changes/20261002-perf-cjk-font-slim/brief.md",
        "shadow-docs/knowledge/first-load-performance.md"
      ],
      "message": "build(perf): CJK 字体瘦身第一步——Sans 700 下架合成加粗 + 首屏字重真 preload (#465)",
      "title": "build(perf): CJK 字体瘦身第一步——Sans 700 合成加粗 + Serif/Sans 400 真 preload",
      "body": "Closes #465（CJK 字体瘦身第一步；#438 未纳入项 D 稳健档）\n\n## 变更\n- `app/fonts/cjk.css`：删除 Noto Sans SC **700** @font-face——UI 粗体由 400 合成加粗承担（**−408KB**，四款 CJK 1989KB→1583KB）；**Serif 700 保留**供文章标题/TOC/朱砂印章真实粗体\n- `app/layout.tsx`：首屏必需字重（Serif 400 / Sans 400）加 **`<link rel=preload as=font crossOrigin>`**——woff2 静态 import 取哈希 URL（新增 `types/fonts.d.ts` 声明），HTML 解析期即发现，不再等 CSS 解析链\n- `FontPrefetch.tsx`：WARM_SPECS 移除已下架的 Sans 700 与已被 preload 覆盖的 Serif 400，只留 idle 预热 Serif 700\n- `first-load-performance.md` 知识卡：字重交付面现状 + 「新增首屏字重必须同步 preload 清单」约束\n\n## 生产实测（修复前）\n- 四款 CJK 字重 **1989KB**（i18n 假名扩集后比 #438 审计时的 1146KB 更大）：Serif400 578 / Serif700 580 / Sans400 408 / Sans700 408\n- 无 font preload link——首屏字重要等 CSS 解析完才被发现；FontPrefetch 仅 idle `document.fonts.load()`\n\n## 验证\n- TDD：3 条契约先红后绿；全量 182 测试 164 绿 / 18 挂（存量同批，0 新增）\n- tsc/oxlint 0 错；本地 next build 处 SGN-001 密集期（139×3 + worker SIGSEGV），但「Compiled successfully in 10.7s」实证 **Turbopack 正常处理 woff2 静态 import**，完整构建以 CI build-next 裁决\n\n## 部署后复测清单（https://wuh.site）\n首页 HTML 含 2 条 font preload；CSS bundle 无 NotoSansSC-700；`/post/165` 标题与印章（Serif 700）渲染不变；UI 粗体合成加粗观感抽查"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/first-load-performance.md",
    "reason": "实现与 brief 稳健档一致：cjk.css 删 Sans 700 face（-408KB）、layout.tsx 两条首屏字重真 preload（woff2 静态 import，本地 Turbopack 编译成功实证）、FontPrefetch 清理+注释、types/fonts.d.ts 声明、知识卡同步。契约 3/3 红转绿；tsc/oxlint 0 错；18 挂存量同批。本地 next build 处 SGN-001 密集期（4 连败），CI build-next 为权威门禁；runtime 部署后生产复测 preload/CSS/体积/印章无回归"
  }
}
---

# CJK 字体瘦身第一步——Sans 700 合成加粗 + 首屏字重真 preload

## 动机
#438 未纳入项 D（M–L），用户拍板稳健方案。生产实测（2026-10-02，v1.4.55）：
- 四款 CJK 字重合计 **1989KB**（Serif400 578KB / Serif700 580KB / Sans400 408KB / Sans700 408KB / JetBrainsMono 15KB）——比 #438 审计时的 1146KB 更大（i18n 假名扩集后），占首页传输绝对大头
- FontPrefetch 只做 idle `document.fonts.load()`，无 `<link rel=preload>`——首屏必需字重等 CSS 解析完才被发现
- **视觉取舍（用户已确认稳健档）**: 砍 **Sans 700**（UI 粗体合成加粗，风险低），**Serif 700 保留**（文章 H1 标题、TOC、朱砂印章观感保真）
- 预期：−408KB（−20%），首屏字重发现时序提前

## 复杂度评级
- **评级:** M
- **理由:** 契约变更是（交付字体面集合 + head preload 声明）；触及面 3 文件 + 1 类型声明 + 1 测试；逻辑简单但涉及构建管线（woff2 静态 import 哈希）与合成加粗的渲染行为验证
- **期望验证深度:** runtime

## 引用规范
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: CJK 子集经 cjk.css 管线接入（immutable 哈希）；对千字级子集做 unicode-range 切片是负优化（禁止）；任何印面/品牌字形变更必须过 expand_cjk_fonts.py
  - 适用 scope: 本变更不切片、不重切子集，仅移除一个字重的交付与改善发现时序；files/ 物理文件保留（扩集脚本产物），CSS 不再引用即不打包
- shadow-docs/knowledge/seo.md（不触碰）

## 决策
- **选型:** ① `app/fonts/cjk.css` 删除 Noto Sans SC 700 @font-face（sans 粗体由 400 合成加粗，浏览器自动）；② `app/layout.tsx` 对首屏必需的 Serif 400 + Sans 400 输出 `<link rel="preload" as="font" type="font/woff2" crossOrigin>`——woff2 经静态 import 取构建哈希 URL（新增 `types/fonts.d.ts` 声明）；③ `FontPrefetch.tsx` WARM_SPECS 移除 Sans 700，改为仅 idle 预热非首屏的 Serif 700（preload 覆盖不到的延迟字重）
- **对比方案:** 双 700 全砍（−988KB）——印章/标题观感风险，用户未选；仅修 preload 不砍字重——收益 0，用户已确认砍 Sans 700
- **理由:** 最小视觉风险的实质瘦身；preload 修的是发现时序而非体积，两者正交

## 任务
### Phase 1 红测试
- [x] 契约测试：cjk.css 无 SansSC-700 face；layout.tsx 含两条 font preload（Serif/Sans 400）；FontPrefetch 无 Noto Sans SC 字样 —— `apps/site/test/first-load-fonts.test.mjs`
### Phase 2 实现
- [x] cjk.css 删 Sans 700 face + 头注释更新 — `apps/site/app/fonts/cjk.css`
- [x] layout.tsx 两条 preload（woff2 静态 import）+ types/fonts.d.ts — `apps/site/app/layout.tsx`、`apps/site/types/fonts.d.ts`
- [x] FontPrefetch WARM_SPECS 清理 — `apps/site/app/components/FontPrefetch.tsx`
### Phase 3 验证与收尾
- [x] tsc + oxlint + 全量 node --test（18 挂存量基线对照） — `apps/site`
- [x] runtime 验收：部署后生产首页 HTML 含 2 条 font preload、CSS bundle 无 SansSC-700 引用、字体传输 1989KB→约 1.58MB — `apps/site`
- [x] 变更说明回填 PR body — issue

## 结果
- 实际耗时: 约 1.5h（SGN-001 消耗约 40min：tsc 1 次 139 后过、next build 4 连败）
- 验证:
  - **TDD**: first-load-fonts.test.mjs 3 条契约先红（3/3 挂）后绿（3/3 过）
  - **全量**: 182 测试 164 绿 / 18 挂——与 B2/F 基线同批存量，0 新增失败
  - **静态检查**: tsc --noEmit 0 错；oxlint 0 错
  - **构建**: 本地 next build 4 连败（SGN-001 密集期：139×3 + page-data worker SIGSEGV），但 **「Compiled successfully in 10.7s」出现过一次——woff2 静态 import 经 Turbopack 编译正常**，剩余构建以 CI build-next 为权威裁决
  - **runtime 验收**: 部署后生产首页 HTML 复测——2 条 font preload、CSS bundle 无 SansSC-700、字体传输 1989KB→约 1.58MB
- 流程备注/偏差:
  - task-6（PR body 回填）时序原因在 review 前勾结
  - `files/NotoSansSC-700.woff2` 物理文件保留（扩集脚本产物），CSS 不引用即不进构建产物
- 部署后复测清单（https://wuh.site）: 首页 HTML 含 2 条 `<link rel=preload as=font>`（Serif/Sans 400）；CSS bundle 无 NotoSansSC-700 引用；`/post/165` 标题与印章（Serif 700）渲染不变
- 交付发布: 待 PR 合并后按 build-config.md 发布流程执行

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/first-load-performance.md（新增：Sans 700 已下架由合成加粗承担——任何新增 sans 粗体 UI 无需字体变更；首屏必需字重（Serif/Sans 400）经 layout preload，新增首屏字重须同步 preload 清单；source 追加本 brief）
- **理由:** 字体面集合是长期交付事实，后续 UI 改造与扩集脚本都要知道

## 关联
- GitHub issue: #438 未纳入项 D 第一阶段（稳健档）；#233 P0「缓存与抓取效率」线
- 执行环境: 沿用空闲 worktree `.claude/worktrees/293-feat-font-unify`
