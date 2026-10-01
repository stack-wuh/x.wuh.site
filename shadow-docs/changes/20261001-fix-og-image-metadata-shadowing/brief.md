---
{
  "schema": "shadow-dev/v1",
  "name": "20261001-fix-og-image-metadata-shadowing",
  "type": "fix",
  "scope": "apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261001-fix-og-image-metadata-shadowing",
  "files": [
    "apps/site/app/about/layout.tsx",
    "apps/site/app/about/page.tsx",
    "apps/site/app/blog/page.tsx",
    "apps/site/app/footprint/layout.tsx",
    "apps/site/app/lib/seo.ts",
    "apps/site/app/music/page.tsx",
    "apps/site/app/page.tsx",
    "apps/site/app/topics/[label]/page.tsx",
    "apps/site/app/weread/page.tsx",
    "apps/site/test/seo-og-image.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 444,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/444",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b116e81827a0ecc5de3ca489f97c9749d7d8e4f6",
    "verifiedAt": "2026-09-30T23:27:19.068Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:444",
    "planHash": "964da4f14d343e7864a75dfe75379cfac1cfd83a14123047f6b69b033ee714b0",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix: og:image 全线缺失——7 个区块页 metadata 遮蔽父级 layout，社交分享无缩略图",
      "titleRaw": "fix: og:image 全线缺失——7 个区块页 metadata 遮蔽父级 layout，社交分享无缩略图",
      "supplement": "来源 #438 未纳入项 A、#233 P1。Next Metadata API 的 openGraph/twitter 按段整体遮蔽：7 个区块页声明 openGraph 不带 images，layout 的 og-default.png(1200×630)+summary_large_image 全部失效，生产实测 7 页无 og:image、5 页 card 降级 summary。方案：seo.ts 加共享 builder（同 buildArticleMetadata 先例），7 页接入。评级 M/runtime。brief: shadow-docs/changes/20261001-fix-og-image-metadata-shadowing/brief.md",
      "body": "## 动机\nlayout.tsx 已正确定义 `/og-default.png`(1200×630) + `summary_large_image`，但 Next Metadata API 的 openGraph/twitter 是**按段整体遮蔽**（子页声明 openGraph 即整体替换父级，不做字段级合并）。7 个区块页各自声明 `openGraph`（部分还声明 `twitter: {card: 'summary'}`）且不带 `images`，导致：\n- 生产实测（2026-10-01，v1.4.45）：`/`、`/blog`、`/about`、`/music`、`/footprint`、`/weread`、`/topics/[label]` **全部无 og:image**；其中 `/`、`/blog`、`/about`、`/footprint`、`/topics/[label]` 的 twitter:card 还被降级为 `summary`\n- 分享到微信/Twitter/Slack/Facebook 无缩略图，`/about`、`/music`、`/footprint`、`/weread`、`/topics` 无 large card\n- 文章页不受影响（`buildArticleMetadata` 带 cover 图，实测健康）——证明 builder 模式在本仓已验证有效\n- seo.md「全站页面包含 og:image」结论实际已过期（#438 已标注）\n来源：#438 未纳入项 A（按「持续损失 × 改动量」排序第一）；#233 P1「默认生成 1200×630 的文章 OG 图片；没有封面时也保证可分享图片存在」\n\n## 引用规范\n- shadow-docs/knowledge/seo.md\n  - 当前结论: 「全站页面包含 og:title/og:description/og:image…默认 OG 图 1200×630」——对区块页已过期，本变更修复后恢复为真；「canonical、OG、Twitter、JSON-LD 和 sitemap 必须使用同一公开 URL」执行约束\n  - 适用 scope: apps/site/app（命中全部改动文件）\n- shadow-docs/knowledge/homepage-data.md\n  - 当前结论: 首页必须 force-dynamic 运行时取数\n  - 适用 scope: 本变更只动 metadata 声明，不触碰首页取数路径\n\n## 决策\n- **选型:** 方案 A——`app/lib/seo.ts` 新增共享 builder（暂名 `buildSectionMetadata`），输出完整 openGraph（含 `DEFAULT_OG_IMAGE_PATH` 1200×630 + alt）与 twitter（`summary_large_image` + 同图），7 页传入各自 title/description/url 接入；`about` 的 layout/page 双层声明收敛为 page 单层（layout 层删除 openGraph/twitter 遮蔽源）\n- **对比方案:** B（7 页内联补 images）——同样的 15 行配置复制 7 份，而本次 bug 本质就是「复制模板时丢 images」，留坑再犯；C（只修三个高价值页）——不彻底，#233 P1 验收不达成\n- **理由:** 与文章页 `buildArticleMetadata` 同构（已验证的仓内先例）；一次根治 + 未来新页面用 builder 天然带图；正是 seo.md「OG/Twitter/URL 同源」约束的代码化\n\n## 任务\n### Phase 1 红测试与 builder\n- [ ] 契约测试先红：seo.ts 含 buildSectionMetadata 且输出含 images/summary_large_image；7 页均不含「无 images 的 openGraph 字面量」—— `apps/site/test/seo-og-image.test.mjs`\n- [ ] seo.ts 实现 builder：openGraph（images: DEFAULT_OG_IMAGE_PATH 1200×630）+ twitter（summary_large_image） —— `apps/site/app/lib/seo.ts`\n### Phase 2 七页接入\n- [ ] `/`（app/page.tsx）：openGraph/twitter 换 builder（首页其余字段保留） — `apps/site/app/page.tsx`\n- [ ] `/blog`（generateMetadata 两分支均接入） — `apps/site/app/blog/page.tsx`\n- [ ] `/about`：page 层接入 builder，layout 层删除 openGraph/twitter 遮蔽源 — `apps/site/app/about/page.tsx`、`apps/site/app/about/layout.tsx`\n- [ ] `/music` — `apps/site/app/music/page.tsx`\n- [ ] `/footprint` — `apps/site/app/footprint/layout.tsx`\n- [ ] `/weread` — `apps/site/app/weread/page.tsx`\n- [ ] `/topics/[label]`（generateMetadata） — `apps/site/app/topics/[label]/page.tsx`\n### Phase 3 验证与收尾\n- [ ] tsc + oxlint + 全量 node --test（对照存量失败清单） — `apps/site`\n- [ ] runtime 验收（生产模式 next start）：7 页 og:image + og:image:width/height + twitter:card=summary_large_image + twitter:image；文章页 /post/165 og 信号无回归 — `apps/site`\n- [ ] 回填变更说明至 PR body（CLI 无 issue 评论能力）#233 低价值页面三项实测已实现（system-color 已 noindex,nofollow 且不在 sitemap；labels 页已 noindex,follow）的事实一并附上，供勾选参考 — issue #233\n\n## 补充\n来源 #438 未纳入项 A、#233 P1。Next Metadata API 的 openGraph/twitter 按段整体遮蔽：7 个区块页声明 openGraph 不带 images，layout 的 og-default.png(1200×630)+summary_large_image 全部失效，生产实测 7 页无 og:image、5 页 card 降级 summary。方案：seo.ts 加共享 builder（同 buildArticleMetadata 先例），7 页接入。评级 M/runtime。brief: shadow-docs/changes/20261001-fix-og-image-metadata-shadowing/brief.md\n\n完整 brief：shadow-docs/changes/20261001-fix-og-image-metadata-shadowing/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261001-fix-og-image-metadata-shadowing\",\"type\":\"fix\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261001-fix-og-image-metadata-shadowing/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/about/layout.tsx",
        "apps/site/app/about/page.tsx",
        "apps/site/app/blog/page.tsx",
        "apps/site/app/footprint/layout.tsx",
        "apps/site/app/lib/seo.ts",
        "apps/site/app/music/page.tsx",
        "apps/site/app/page.tsx",
        "apps/site/app/topics/[label]/page.tsx",
        "apps/site/app/weread/page.tsx",
        "apps/site/test/seo-og-image.test.mjs",
        "shadow-docs/changes/20261001-fix-og-image-metadata-shadowing/brief.md",
        "shadow-docs/knowledge/seo.md",
        "shadow-docs/signals.md"
      ],
      "message": "fix(seo): og:image 全线缺失——区块页 metadata 遮蔽父级 layout，统一 builder 组装 (#444)",
      "title": "fix(seo): og:image 全线缺失——7 个区块页 metadata 遮蔽父级，统一 buildSectionMetadata 组装",
      "body": "Closes #444（og:image 全线缺失；#438 未纳入项 A 处方落地）\n关联 #233（P1「默认生成 1200×630 的文章 OG 图片；没有封面时也保证可分享图片存在」线）\n\n## 变更\n- `app/lib/seo.ts`：新增共享 builder `buildSectionMetadata({ title, description, url })`——openGraph 自带 og-default.png（1200×630 + alt）与 twitter `summary_large_image` + 同图\n- 7 个区块页全部接入：`/`、`/blog`（labels 筛选两分支）、`/about`、`/music`、`/footprint`、`/weread`、`/topics/[label]`\n- `app/about/layout.tsx`：删除 openGraph/twitter 双层遮蔽源（page 层统一生效）\n- 新契约测试 `test/seo-og-image.test.mjs` ×5（builder 输出、7 页接入、禁 `card: summary` 字面量、遮蔽源移除、root layout 安全网保留）\n\n## 根因\nNext Metadata API 的 `openGraph`/`twitter` 按路由段**整体遮蔽**父级，不做字段级合并。root layout 已正确定义 og-default + large card，但 7 个区块页各自手写 `openGraph`（5 个还手写 `twitter: {card:'summary'}`）且不带 `images` → 生产实测 7 页全无 og:image、5 页 card 降级 summary，社交分享（微信/Twitter/Slack/Facebook）全部无缩略图。文章页因走 `buildArticleMetadata` builder 自带 cover 图而幸免——这也是本修复选 builder 方案的仓内先例依据。\n\n## 验证\n- TDD：5 条契约测试先红后绿\n- 全量 171 测试 153 绿 / 18 挂——stash 对比干净 main 同为 18 挂（i18n/music 合入后的存量失败，quality-gate 不跑 node --test 故未拦），**本变更 0 新增失败**\n- `tsc --noEmit` 0 错；oxlint 0 错\n- runtime（dev 模式 curl 实测 8 页）：7 区块页 og:image + og:image:width/height=1200/630 + twitter:card=summary_large_image 全部到位；og:url 逐字节不变；robots 语义零回归（labels 页 noindex,follow / footprint noindex,nofollow / weread noindex,follow 保持）\n- 本地 next build 被 SGN-001（node 24 间歇 SIGSEGV）连杀 5 次，生产构建以 CI Docker 为准\n\n## 附：#233「P0 低价值页面」三项实测（2026-10-01 生产站，供勾选参考）\n1. `/design/system-color`：sitemap 中 0 次出现 ✅ + `<meta name=\"robots\" content=\"noindex, nofollow\">` ✅ ——已完成\n2. `/blog?labels=...` 筛选组合：`noindex, follow` ✅（主题页 `/topics/[label]` 开放索引）——已完成\n3. `/weread`（`noindex, follow`）、`/footprint`（`noindex, nofollow`）：robots 现状如此，是否保留独立搜索价值属内容判断——建议按现状勾选\n\n## 部署后复测清单（https://wuh.site）\n`/`、`/blog`、`/about`、`/music`、`/footprint`、`/weread`、`/topics/Next.js` 七页 og:image=https://wuh.site/og-default.png 且 twitter:card=summary_large_image；`/post/165` og:image 仍为 cover 图无回归"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/seo.md",
    "reason": "实现与 brief 方案 A 一致：buildSectionMetadata builder 落地（openGraph 带 og-default 1200×630 + twitter summary_large_image），7 个区块页全部接入，about 双层遮蔽源删除。TDD 5/5 红→绿；全量 171 测试 0 新增失败（18 挂经 stash 对比实证为 main 存量：i18n/music 合入后累积，quality-gate 不跑 node --test）；tsc/oxlint 0 错。runtime 验收 dev 模式 8 页全绿：7 区块页 og:image+large card 到位、og:image:width/height=1200/630、og:url 逐字节不变，robots 语义零回归（labels noindex,follow / footprint noindex,nofollow / weread noindex,follow / design noindex,nofollow 保持）。seo.md『全站页面包含 og:image』过期结论修复后恢复为真，且新增长期事实：Next Metadata API openGraph/twitter 按段整体遮蔽须自带 images，统一走 builder（verified-depth: runtime，scope apps/site/app/lib/seo.ts + 7 区块页）。偏差：本地 next build 被 SGN-001 连杀 5 次（139），生产构建以 CI Docker 为准、部署后生产复测"
  }
}
---

# og:image 全线缺失修复——子页 metadata 遮蔽父级 layout

## 动机
layout.tsx 已正确定义 `/og-default.png`(1200×630) + `summary_large_image`，但 Next Metadata API 的 openGraph/twitter 是**按段整体遮蔽**（子页声明 openGraph 即整体替换父级，不做字段级合并）。7 个区块页各自声明 `openGraph`（部分还声明 `twitter: {card: 'summary'}`）且不带 `images`，导致：
- 生产实测（2026-10-01，v1.4.45）：`/`、`/blog`、`/about`、`/music`、`/footprint`、`/weread`、`/topics/[label]` **全部无 og:image**；其中 `/`、`/blog`、`/about`、`/footprint`、`/topics/[label]` 的 twitter:card 还被降级为 `summary`
- 分享到微信/Twitter/Slack/Facebook 无缩略图，`/about`、`/music`、`/footprint`、`/weread`、`/topics` 无 large card
- 文章页不受影响（`buildArticleMetadata` 带 cover 图，实测健康）——证明 builder 模式在本仓已验证有效
- seo.md「全站页面包含 og:image」结论实际已过期（#438 已标注）
来源：#438 未纳入项 A（按「持续损失 × 改动量」排序第一）；#233 P1「默认生成 1200×630 的文章 OG 图片；没有封面时也保证可分享图片存在」

## 复杂度评级
- **评级:** M
- **理由:** 三要素——契约变更是（7 页 head 输出增强，不改路由与状态码）；触及面 9 文件但全为声明式 metadata 对象替换 + 1 个新 builder + 1 个新测试文件，无逻辑分支；可发现性高（生产模式 next start + curl 即可断言，无需数据栈）
- **期望验证深度:** runtime

## 引用规范
- shadow-docs/knowledge/seo.md
  - 当前结论: 「全站页面包含 og:title/og:description/og:image…默认 OG 图 1200×630」——对区块页已过期，本变更修复后恢复为真；「canonical、OG、Twitter、JSON-LD 和 sitemap 必须使用同一公开 URL」执行约束
  - 适用 scope: apps/site/app（命中全部改动文件）
- shadow-docs/knowledge/homepage-data.md
  - 当前结论: 首页必须 force-dynamic 运行时取数
  - 适用 scope: 本变更只动 metadata 声明，不触碰首页取数路径

## 决策
- **选型:** 方案 A——`app/lib/seo.ts` 新增共享 builder（暂名 `buildSectionMetadata`），输出完整 openGraph（含 `DEFAULT_OG_IMAGE_PATH` 1200×630 + alt）与 twitter（`summary_large_image` + 同图），7 页传入各自 title/description/url 接入；`about` 的 layout/page 双层声明收敛为 page 单层（layout 层删除 openGraph/twitter 遮蔽源）
- **对比方案:** B（7 页内联补 images）——同样的 15 行配置复制 7 份，而本次 bug 本质就是「复制模板时丢 images」，留坑再犯；C（只修三个高价值页）——不彻底，#233 P1 验收不达成
- **理由:** 与文章页 `buildArticleMetadata` 同构（已验证的仓内先例）；一次根治 + 未来新页面用 builder 天然带图；正是 seo.md「OG/Twitter/URL 同源」约束的代码化

## 任务
### Phase 1 红测试与 builder
- [x] 契约测试先红：seo.ts 含 buildSectionMetadata 且输出含 images/summary_large_image；7 页均不含「无 images 的 openGraph 字面量」—— `apps/site/test/seo-og-image.test.mjs`
- [x] seo.ts 实现 builder：openGraph（images: DEFAULT_OG_IMAGE_PATH 1200×630）+ twitter（summary_large_image） —— `apps/site/app/lib/seo.ts`
### Phase 2 七页接入
- [x] `/`（app/page.tsx）：openGraph/twitter 换 builder（首页其余字段保留） — `apps/site/app/page.tsx`
- [x] `/blog`（generateMetadata 两分支均接入） — `apps/site/app/blog/page.tsx`
- [x] `/about`：page 层接入 builder，layout 层删除 openGraph/twitter 遮蔽源 — `apps/site/app/about/page.tsx`、`apps/site/app/about/layout.tsx`
- [x] `/music` — `apps/site/app/music/page.tsx`
- [x] `/footprint` — `apps/site/app/footprint/layout.tsx`
- [x] `/weread` — `apps/site/app/weread/page.tsx`
- [x] `/topics/[label]`（generateMetadata） — `apps/site/app/topics/[label]/page.tsx`
### Phase 3 验证与收尾
- [x] tsc + oxlint + 全量 node --test（对照存量失败清单） — `apps/site`
- [x] runtime 验收（生产模式 next start）：7 页 og:image + og:image:width/height + twitter:card=summary_large_image + twitter:image；文章页 /post/165 og 信号无回归 — `apps/site`
- [x] 回填变更说明至 PR body（CLI 无 issue 评论能力）#233 低价值页面三项实测已实现（system-color 已 noindex,nofollow 且不在 sitemap；labels 页已 noindex,follow）的事实一并附上，供勾选参考 — issue #233

## 结果
- 实际耗时: 约 1.5h（其中 SGN-001 构建重试消耗约 25min）
- 验证:
  - **TDD**: seo-og-image.test.mjs 5 条契约先红（builder 缺失、7 页未接 builder、card: summary 存在、about layout 遮蔽源存在）→ 实现后 5/5 绿
  - **全量**: 171 测试 153 绿 / 18 挂——**stash 对比干净 main 同为 18 挂**，全部为存量（i18n/music 合入后累积，quality-gate 只跑 tsc+lint 不跑 node --test 故未拦）；本变更 0 新增失败
  - **静态检查**: 根 `pnpm exec tsc --noEmit` 0 错；oxlint 0 错 2 warning（存量失败测试文件内，非本次文件）
  - **runtime 验收（dev 模式，含 nest 缺席路径）**: 8 页 curl 实测——7 区块页 `/`、`/blog`、`/about`、`/music`、`/footprint`、`/weread`、`/topics/Next.js` 全部 og:image=https://wuh.site/og-default.png + og:image:width/height=1200/630 + twitter:card=summary_large_image + twitter:image；og:title/og:url 逐字节不变；robots 语义零回归（labels 页 noindex,follow、footprint noindex,nofollow、weread noindex,follow、design noindex,nofollow）
  - **文章页回归**: /post 路由与 buildArticleMetadata 零改动，seo-* 存量契约测试全绿；部署后对生产 /post/165 复测 og:image（cover 图路径不受影响）
- 流程备注/偏差:
  - **SGN-001 密集命中**: next build 连续 5 次失败（2 次空日志 139、2 次 page-data worker SIGSEGV、1 次挂死超时），清 .next + 63% 内存空闲仍复现；按信号新增处置「生产构建交 CI Docker 裁决，metadata 类验收退 dev 模式 curl」执行，已写回 signals.md（命中 12→18）
  - task-12（PR body 回填）为时序原因在 review 前勾结：其交付物（#233 低价值页面三项实测事实）随本 PR body 落实
  - task list 的 `grep -c '"done":false'` 单行 JSON 陷阱：数出现次数须 `grep -o | wc -l`，grep -c 数的是行
- 交付发布: 待 PR 合并后按 build-config.md 发布流程执行

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/seo.md（「全站页面包含 og:image」过期结论恢复为真；新增执行约束：Next Metadata API openGraph/twitter 为按段整体遮蔽，子页声明必须自带 images，统一走 buildSectionMetadata/buildArticleMetadata builder，verified-depth: runtime）
- **理由:** 本次修复把 seo.md 的核心声明重新变真，且遮蔽语义是后续所有页面 metadata 改动都会踩的坑，必须沉淀

## 关联
- GitHub issue: #438 未纳入项 A（处方来源，含变更名/根因/评级）；#233 总任务 P1「默认 OG 图片」线
- 执行环境: 沿用空闲 worktree `.claude/worktrees/293-feat-font-unify`
