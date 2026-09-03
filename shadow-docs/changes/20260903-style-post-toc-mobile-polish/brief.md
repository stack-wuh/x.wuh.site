---
{
  "schema": "shadow-dev/v1",
  "name": "20260903-style-post-toc-mobile-polish",
  "type": "style",
  "scope": "post",
  "status": "committed",
  "baseBranch": "main",
  "branch": "style/20260903-style-post-toc-mobile-polish",
  "files": [
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/styles/post-toc.ts",
    "apps/site/app/post/styles/post-header.ts",
    "apps/site/app/post/components/PostHeader/index.tsx",
    "packages/components/divider/styles/index.tsx",
    "packages/components/divider/readme.md",
    "packages/components/icons/index.tsx",
    "apps/site/app/components/BackHomeLink/index.tsx",
    "apps/site/app/components/BackHomeLink/specs.tsx",
    "apps/site/app/topics/[label]/page.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 356,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/356",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "171b1c81eb27dc286591cd6f6252bcf485598526",
    "verifiedAt": "2026-09-03T04:05:41.987Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "c45809a11412386f545c105908f9387d5a23b1ac",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 详情页样式修缮与 topics 返回首页修复（问题 1–4）

## 动机

昨天详情页优化（#352 / e3f24e1）落地后，移动端目录折叠条观感不佳：折叠态仅有「目 录」加一个细小的 `⌄` 文本字符，上下双发丝线夹在页头朱砂短规与「第壹节」章节记号之间，视觉空、散、弱，且折叠态不透露任何目录内容信息，与书页式设计语言不匹配。需重新设计移动端目录折叠条。

**问题 2**（用户补充）：#355 把牌记（colophon）装饰换用 `Divider variant='ornament'` 后，该模块存在两个问题：① 用色不协调——两侧线为灰发丝线（`normal-400` 55%）、◇ 为 accent 金，而组件 readme 自述意图是「中置朱砂 ◇ 点缀线」，实现与文档意图脱节，模块整体读作灰色、无主题色；② 结构线冗余——colophon 区域一个视口内叠了 4 条横线：上缘 plain Divider（PostView:304）、ornament 线（:306）、底部 plain Divider（:342）、评论区自带标题线（PostComments:137），底部与评论区标题线直接相邻重复，线条过多。

**问题 3**（用户补充）：页头文章标签的「燕尾书签」样式（纸面底 + 顶部朱砂色带 + `clip-path` 燕尾缺口，`post-header.ts:85` TagGroup）观感不佳，用户明确不喜欢当前形态，希望改为「回形针式书签」——金属回形针别在纸片上的隐喻。

**问题 4**（用户补充，功能修复）：`/topics/[label]` 页面（如 wuh.site/topics/Vue）点击「返回首页」按钮无任何反应。根因：`topics/[label]/page.tsx:102` 以裸 `<BackHomeLink />` 使用组件，未传 `href`；Button 组件仅在 `href !== undefined` 时渲染为链接，否则渲染无 onClick 的死 `<button>`。该错误本应被类型检查拦截（specs 声明 `href: string` 必填），但 `next.config` 开启 `ignoreBuildErrors: true`，TS 错误被静默放行，bug 上线。

## 引用规范

- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 侧栏目录为纸面竖线式（active 3px 朱线 + 朱色文字 + 朱砂序号）；业务样式不得直写 `prefers-color-scheme`，明暗适配走手动主题体系变量；动画引用 `--motion-*` tokens 并带 reduced-motion 降级
  - 适用 scope: apps/site/app/post

## 决策

- **选型:** 方案 A —— 保留 `<details>` 原位折叠，精修折叠条视觉并补充当前章节小注；`⌄` 文本字符替换为 Icon 组件图标
- **对比方案:** 方案 B（中置「◇ 目录 ◇」点缀行 + 底部抽屉）仪式感强且不推正文，但需新建抽屉组件（遮罩、滚动锁定、关闭交互），约 1–2 小时超出单任务 30 分钟约束；方案 C（悬浮胶囊）阅读中随时可触达，但遮挡正文、与顶部阅读进度条抢注意力，偏离页面「零投影纯纸面」语言
- **理由:** 方案 A 改动最小、无新依赖；完全复用既有纸面语言（cbtn 圆钮、朱砂序号、发丝线）；`activeHeading` 已在 PostView 中存在，可直接派生「读至第N节」小注；无浮层与滚动锁定风险。箭头图标对齐 SiteHeader 既有惯例（`IconChevronDown`，lucide 线性风格，与页面衬线+发丝线语言协调）
- **问题 2 选型:** ① ornament 变体全面朱砂化——两侧线改为 `--primary-color` 渐隐线（`linear-gradient` 从 transparent 渐入 `color-mix(in oklab, var(--primary-color) 45%, transparent)`，右线镜像），◇ 从 accent 金改为 `--primary-color`，对齐 readme「中置朱砂 ◇」的自述意图，与目录 active 竖线、返回箭头的朱砂语言同源；plain hairline 变体保持灰发丝线不动（结构性发丝线是页面既定语言，仅 ornament 作为点缀线需要主题色）；② 结构线收敛——删除 colophon 上缘 plain Divider（ornament 接任开线）与底部 plain Divider（评论区自带标题线，重复），colophon 区域横线 4 → 2
- **问题 2 对比方案:** 线与 ◇ 用 accent 金以呼应相邻 ColophonMeta 链接的金色——放弃：金在纸面对比度弱（知识卡已记录 accent 金仅约 1.9:1 的教训），且与 readme 意图、站点主题色不符；仅删 ornament 保双 plain 线——放弃：ornament 的仪式感是牌记设计语言的核心，plain 线无信息量；ColorNote: ColophonMeta 链接当前用 accent 金与知识卡「链接用朱砂」结论存在历史不一致，本次不扩scope，归档时在知识卡记录待确认
- **问题 3 选型:** 回形针书签 = 纸片 + 回形针两层结构——`<a>` 内拆为别在左上角的回形针层（`IconPaperclip`，lucide 线性回形针，size 15，朱砂色，绝对定位骑在纸片边线上）+ 纸片层（`background-100` 纸面底 + 发丝线描边 + 圆角 2px，标签文字）；hover 只让纸片下移 2px、回形针纹丝不动（纸片从别着的回形针下被抽动的微暗示，延续原「抽书签」交互意图但换新隐喻）；移除 clip-path 燕尾缺口与顶部色带；icon 从 `packages/components/icons` 统一导出（`Paperclip as IconPaperclip`），颜色走语义 token。回形针加手工别上去的微动态：每个回形针按标签名哈希取 ±3° 内离散档位微旋（如 -3/-1.5/0/1.5/3°），纸片保持横平——角度必须由标签名确定性推导（禁用 `Math.random()`，SSR 与客户端输出一致避免 hydration mismatch）
- **问题 3 对比方案:** 纯 CSS 手绘回形针（双层圆角边框模拟金属丝）——放弃：形准难调、代码量大、收益低于 lucide 现成线性字形；保留丝带式仅微调——放弃：用户已明确否定当前形态；回形针用金属灰——放弃：站点语言中点缀统一走主题色，灰易复现问题 2 的「灰色不协调」观感
- **问题 4 选型:** 双层修复——① `BackHomeLink` 组件级兜底：`href` 参数默认 `'/'`，specs 类型同步改 `href?: string`，从单一职责点上消灭「漏传 prop 出死按钮」这类缺陷；② topics 页显式传 `<BackHomeLink href='/' />`，调用点自文档化
- **问题 4 对比方案:** 仅改 topics 页传参——放弃：组件仍留死按钮陷阱，下一个调用方可能再踩；仅改组件默认值不动调用点——放弃：显式传参可读性更好。附带待确认点（不扩 scope）：`ignoreBuildErrors: true` 掩盖类型错误是本次 bug 静默上线的土壤，建议后续单独评估关闭该开关的可行性（涉及存量类型债）
- **类型说明:** 本变更为 style 主体附带一个功能修复任务（Phase 4），issue label 按 change type 取 `style`；Phase 4 提交时 commit 单独使用 `fix(topics):` 前缀，不与 style 提交混类型

## 任务

### Phase 1

- [x] 折叠条视觉精修 — apps/site/app/post/styles/post-toc.ts — 重做 TocMobile 折叠态：右侧圆形箭头钮（40px 内、cbtn 圆钮语言、background-200 底 + normal-300 描边、focus ring）；标题行右侧「共 N 节」计数小注；新增「读至 · 第N节」当前章节小注样式（朱砂、xs、衬线序号）；收敛上下双发丝线节奏（保留上缘线，下缘由展开态边界承载或调间距）；图标旋转与展开过渡走 `--motion-*` tokens 并带 reduced-motion 降级
- [x] 折叠条结构增强 — apps/site/app/post/PostView/index.tsx — summary 结构改为标题 + 计数 + 圆形箭头钮；用 `activeHeading` 匹配 toc 条目渲染「读至 · 第N节 xxx」小注（无激活章节时不渲染）；`⌄` 文本字符移除，改用 `@wuh.site/components/icons` 的 `IconChevronDown`（对齐 SiteHeader 用法：size 14、strokeWidth 2，aria-hidden），置于圆形钮内，`[open]` 时旋转 180°

### Phase 2

- [x] ornament 变体主题化 — packages/components/divider/styles/index.tsx — SOrnament `::before/::after` 由灰发丝线改为朱砂渐隐线（`linear-gradient(to right, transparent, color-mix(in oklab, var(--primary-color) 45%, transparent))`，`::after` 镜像方向），SOrnamentGlyph 由 `var(--accent-color)` 改为 `var(--primary-color)`；仅语义 token（通过现有 node:test 无硬编码色断言）；SDivider hairline 变体不动
- [x] colophon 结构线收敛 — apps/site/app/post/PostView/index.tsx — 删除上缘 plain Divider（304 处，ornament 接任 colophon 开线，注意核对 RelatedPosts 与 ornament 间距节奏）与底部 plain Divider（342 处，评论区 PostComments:137 自带标题线）
- [x] readme 约束同步 — packages/components/divider/readme.md — 约束节补充 ornament 变体朱砂渐隐线的用色公式与「plain hairline 保持灰发丝线」的分工说明

### Phase 3

- [x] 回形针图标导出 — packages/components/icons/index.tsx — lucide-react 分组新增 `Paperclip as IconPaperclip` 导出
- [x] 回形针书签结构 — apps/site/app/post/components/PostHeader/index.tsx — 标签 `<a>` 内拆为回形针层 + 纸片层两个 span（aria-hidden 回形针，文字层可读），保持 `buildTopicUrl` 站内链接不变；回形针微旋角度由标签名哈希确定性推导（离散档位 ±3° 内），经内联 CSS 变量（如 `--tilt`）传给样式层，禁用 `Math.random()`
- [x] 回形针书签样式 — apps/site/app/post/styles/post-header.ts — 重写 TagGroup：纸片层（background-100 + 发丝线描边 + 2px 圆角，padding 6px 12px）、回形针层（IconPaperclip 15px 朱砂、绝对定位左上骑线、rotate(var(--tilt, 0deg)) 微旋）、容器水平排 flex-wrap（column-gap 10px / row-gap 14px 给回形针出头让位 / 顶部 6px headroom 防 meta 行粘连）、hover 仅纸片层 translateY(2px) + 文字变朱砂、过渡走 `--motion-*` tokens + reduced-motion 降级；移除 clip-path 与顶部色带

### Phase 4

- [x] 组件兜底 — apps/site/app/components/BackHomeLink/index.tsx — `href` 参数默认 `'/'`（与 label 默认值模式一致）
- [x] 类型同步 — apps/site/app/components/BackHomeLink/specs.tsx — `BackHomeLinkProps.href` 改为可选 `href?: string`
- [x] 调用点修复 — apps/site/app/topics/[label]/page.tsx — `<BackHomeLink />` 改为 `<BackHomeLink href='/' />`
- [x] 回归验证 — 验证 /topics/[label] 点击返回首页可跳转、/blog 返回首页不受影响、`pnpm exec tsc --noEmit` 无新增错误

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/blog-detail.md, shadow-docs/knowledge/components.md, shadow-docs/knowledge/icon-system.md
- **理由:** 移动端目录形态从「极简 details 折叠条」升级为「带当前章节小注与圆形箭头钮的纸面折叠条」；牌记开线由 plain hairline 改为 ornament 朱砂渐隐线、底线移除（评论区标题线承接）；页头标签由燕尾书签改为回形针书签（纸片 + 朱砂回形针 + 抽纸微交互 + 确定性微旋）；Divider ornament 变体用色由灰+金改为朱砂；icons 库新增 IconPaperclip 导出；BackHomeLink 组件 href 兜底修复 topics 返回首页失效。归档时更新 blog-detail.md 页头标签与页面容器段落、components.md 的 Divider 描述、icon-system.md 的导出清单；ColophonMeta 链接用色与「链接用朱砂」结论的历史不一致、`ignoreBuildErrors: true` 的类型安全风险，均作为待确认点记录
