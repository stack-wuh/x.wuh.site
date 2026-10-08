# v1.4.78 博客详情页封面首屏去重 — 渲染层导语区收编

PR #521（change `20261008-fix-post-cover-lead-dedupe`）：

- 新文档结构正文自带大标题与内嵌封面图（与 `metadata.cover` 同 URL），与详情页 PostHeader/PostCover chrome 叠加后首屏图 ×2、标题 ×3（#172 显性化，存量 #165/#92/#65 同构命中）。
- 新增 `apps/site/app/lib/postLeadDedupe.ts`：SSR 纯字符串导语区去重——仅删与显式封面同 URL 的正文图（空壳段落同删、混排段仅删图）与导语区首个等强标题 heading，导语区之后内容不触碰；URL/标题归一化 helper 对齐 `articleTypography` 编号剥离规则。`page.tsx` 于 `ensureRenderedBody` 后接入，守卫调用形态保留。
- 数据层零改写（GitHub body / MongoDB / RSS / 导出源完整），导出全文与详情页共用去重后正文同免重复；后端 `withDerivedCover` 首图派生与前端去重射程不叠加、无二次删图风险。
- 验证：新单测 15 例全绿；站点全量 204 例 fail 数与 stash 基线逐例一致；site tsc 新改文件 0 错、oxlint 0/0；#172 真实数据全链路冒烟（removed 图1/标题1、目录 6 节从壹起排、h1 唯一、首字下沉落位）；6 篇存量管线审计证实修复对存量生效。

Knowledge：更新 `post-cover.md`——显式封面「数据层独立 + 渲染层导语区去重」双层条款、无显式封面派生位置（后端 `withDerivedCover`）与两不叠加边界、文档标准结构事实；声明语法修正为 `wuh-site-metadata` JSON 注释；顺带修复 4 条历史 source 失效路径。
