---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-feature-music-skeleton",
  "type": "feature",
  "scope": "apps/site/app/music",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260929-feature-music-skeleton",
  "files": [
    "apps/site/app/music/loading.tsx"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "8fd57f428dc3be4f65a06a15640145b8dfcc32d1",
    "verifiedAt": "2026-09-29T15:21:25.088Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "967d69105b0dec331f096aa0208005e9e9277026a3e902885ba01690f451fb3b",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] feat(music): /music 路由骨架页——镜像年轮编年布局的 loading 骨架",
      "titleRaw": "feat(music): /music 路由骨架页——镜像年轮编年布局的 loading 骨架",
      "supplement": "给 /music 路由补 loading.tsx 骨架页，镜像「年轮编年·碟心封面」布局，复用组件库 Skeleton 与现有 styles 布局容器；细节见 shadow-docs/changes/20260929-feature-music-skeleton/brief.md",
      "body": "## 动机\n`/music/page.tsx` 是 RSC 服务端 await 取数（歌单与年度歌单并行，元数据带 600s 缓存；冷缓存要等 Next→Nest→网易云上游双重跳转，秒级），路由没有 `loading.tsx`，首次访问/缓存过期时用户面对白屏等待。`/blog/loading.tsx` 已有同构先例（复用组件库 `Skeleton`），本变更给 /music 补一个镜像「年轮编年·碟心封面」布局的骨架页。\n\n另发现 MusicView 切年时已有 `loading` 状态但无任何视觉反馈（仅碟面淡出动画间接提示）——本变更不覆盖该场景，留作后续独立小 change。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: /music 呈现为「年轮编年·碟心封面」——桌面左侧衬线年份纵轨 + 超大水印年份 + 面板头碟心（桌面 64px/移动 72px）+ 曲目行；移动端（≤ BREAKPOINTS.mobile）收成「年谱刻度带」+ 两行曲目行；歌单元数据可缓存（`revalidate: 600`）\n  - 适用 scope: apps/site/app/music\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走主题变量；断点只用 `BREAKPOINTS` 语义常量（mobile 640）；字体只引三个语义 token；动效不用布局属性\n  - 适用 scope: apps/site/app/music\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: `/post/[number]` 不得加 loading.tsx——loading 边界使路由进入流式形态，缓存命中也先 flush 灰骨架再交换真容，HTML 涨至 181KB 且骨架成为 FCP 元素\n  - 适用 scope: apps/site/app/post（本变更 scope 之外，教训迁移见「决策」）\n- norms/ui-patterns.md\n  - 当前结论: 组件复用优先；暗色全覆盖；动效 150–300ms ease-out；必须响应 `prefers-reduced-motion`\n  - 适用 scope: 全量\n- norms/code-style.md\n  - 当前结论: 渐进式治理，只做与当前改动直接相关的事，不顺手扩大范围\n  - 适用 scope: 全量\n\n## 决策\n- **选型:** 方案 A——仅新增路由级 `apps/site/app/music/loading.tsx`。结构镜像 MusicView 布局：复用 `./styles` 既有布局容器（`Section`/`PageHeader`/`TitleGroup`/`Chronicle`/`Rail`/`Content`/`ContentInner`/`PanelHead`/`TrackList` 等，骨架与真容同源实现布局，切换时结构稳定、CLS 最小）+ 组件库 `Skeleton` 原语填充（纵轨年份条 ×6、页头标题/副题条、头像圆 + 身份栏、碟心圆 64px、面板标题/副题条、简介两行、曲目行 ×8：序号/名称 + 右列次数/时长）。`'use client'` 与 `/blog/loading.tsx` 同构；不引入可聚焦元素；骨架块保持 `Skeleton` 默认 `aria-hidden`。\n- **对比方案:**\n  - 方案 C「骨架页 + 切年局部骨架（MusicView `loading` 态渲染面板骨架）」——暂缓：用户诉求是「生成一个骨架页」，A 直接命中且最小；切年骨架涉及 MusicView 状态渲染改动，留作后续独立小 change（monorepo 小步快跑约定）。\n  - 方案 B「只做切年局部骨架」——否决：完全不解决首屏白屏，不命中原始诉求。\n- **理由:** /music 与 /post 的关键差异：/post 缓存命中秒开，骨架是纯负收益（first-load-performance 卡片撤销它）；/music 冷缓存要双重上游跳转（秒级白屏），骨架有真实反馈价值。first-load-performance 结论 scope 是 `/post`，本变更不在其约束范围内，但机制教训照单接受：骨架节点数保持轻量（纵轨 6 + 曲目 8，约 50 个 Skeleton 块）以约束 HTML 增量，并在验证阶段实测体积差记录到本 brief。缓存命中时骨架可能短闪是该方案的已知代价，可接受。\n- **边界:** 纯新增路由级文件；不改 page.tsx、MusicView、styles.ts、specs、播放器与任何 `/v2/music/*` 契约；不在本 change 内给组件库加能力。\n\n## 任务\n### Phase 1\n\n- [ ] task 1 — `apps/site/app/music/loading.tsx` — 新增骨架页：复用 `./styles` 布局容器 + `@wuh.site/components/skeleton` 原语拼出年轮编年结构（纵轨年份条、页头、碟心圆、面板文案条、曲目行），镜像桌面纵轨与移动刻度带两档（断点只引 `BREAKPOINTS`，无硬编码色值与裸断点）；不引入 button 等可聚焦元素，`aria-hidden` 全覆盖\n- [ ] task 2 — `apps/site/app/music/loading.tsx` — 验证：`pnpm build:next` 通过；dev 启动后 `curl` 对比有无 loading.tsx 的 `/music` HTML 体积增量并记录到本 brief「结果」；wine/plain × light/dark 四主题 × 桌面/移动目检骨架形态与真容切换无跳变；`prefers-reduced-motion` 下 shimmer 静止（组件库已内建，目检确认即可）\n\n## 补充\n给 /music 路由补 loading.tsx 骨架页，镜像「年轮编年·碟心封面」布局，复用组件库 Skeleton 与现有 styles 布局容器；细节见 shadow-docs/changes/20260929-feature-music-skeleton/brief.md\n\n完整 brief：shadow-docs/changes/20260929-feature-music-skeleton/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-feature-music-skeleton\",\"type\":\"feature\",\"scope\":\"apps/site/app/music\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-feature-music-skeleton/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/music/loading.tsx",
        "shadow-docs/changes/20260929-feature-music-skeleton",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(music): /music 路由骨架页——镜像年轮编年布局的 loading 骨架",
      "title": "feat(music): /music 路由骨架页——镜像年轮编年布局的 loading 骨架",
      "body": ""
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "music-player.md「/music 页呈现」段补路由骨架边界事实：路由带 loading.tsx 年轮编年同构骨架（页头静态真容 + 数据区 54 个 Skeleton 块），并记录与 first-load-performance /post 结论的反向取舍（冷缓存秒级白屏骨架有真实反馈价值，实测骨架壳增量 +29.5KB 远低于 /post 181KB 事故量级）+ verified-depth: runtime（生产构建、体积对比、四主题×双端截图、换容目检）。另 SGN-001 命中 +1（2→3）：本次 3 次 139 含 next build worker 新场景，且单靠重试未恢复需清 .next，ship 时一并更新 signals.md 证据与陈述"
  }
}
---

# /music 路由骨架页

## 动机

`/music/page.tsx` 是 RSC 服务端 await 取数（歌单与年度歌单并行，元数据带 600s 缓存；冷缓存要等 Next→Nest→网易云上游双重跳转，秒级），路由没有 `loading.tsx`，首次访问/缓存过期时用户面对白屏等待。`/blog/loading.tsx` 已有同构先例（复用组件库 `Skeleton`），本变更给 /music 补一个镜像「年轮编年·碟心封面」布局的骨架页。

另发现 MusicView 切年时已有 `loading` 状态但无任何视觉反馈（仅碟面淡出动画间接提示）——本变更不覆盖该场景，留作后续独立小 change。

## 复杂度评级

- **评级：** S
- **理由：** 无契约变更（page.tsx/MusicView/styles.ts/specs 与 `/v2/music/*` 契约全部不动，仅新增路由级 loading 边界文件）；触及面单文件（新增 `apps/site/app/music/loading.tsx`）；可发现性高——`/blog/loading.tsx` 同构先例 + 组件库 `Skeleton`（`variant: text/rect/circle`、`shimmer`、默认 `aria-hidden`）现成可复用，且该组件已内建 `prefers-reduced-motion` 关闭 shimmer、颜色走 `--primary-100/300` 主题 token。
- **期望验证深度：** runtime（build 通过 + 有无 loading.tsx 的 HTML 体积对比 + 四主题桌面/移动目检）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: /music 呈现为「年轮编年·碟心封面」——桌面左侧衬线年份纵轨 + 超大水印年份 + 面板头碟心（桌面 64px/移动 72px）+ 曲目行；移动端（≤ BREAKPOINTS.mobile）收成「年谱刻度带」+ 两行曲目行；歌单元数据可缓存（`revalidate: 600`）
  - 适用 scope: apps/site/app/music
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只走主题变量；断点只用 `BREAKPOINTS` 语义常量（mobile 640）；字体只引三个语义 token；动效不用布局属性
  - 适用 scope: apps/site/app/music
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: `/post/[number]` 不得加 loading.tsx——loading 边界使路由进入流式形态，缓存命中也先 flush 灰骨架再交换真容，HTML 涨至 181KB 且骨架成为 FCP 元素
  - 适用 scope: apps/site/app/post（本变更 scope 之外，教训迁移见「决策」）
- norms/ui-patterns.md
  - 当前结论: 组件复用优先；暗色全覆盖；动效 150–300ms ease-out；必须响应 `prefers-reduced-motion`
  - 适用 scope: 全量
- norms/code-style.md
  - 当前结论: 渐进式治理，只做与当前改动直接相关的事，不顺手扩大范围
  - 适用 scope: 全量

## 决策

- **选型:** 方案 A——仅新增路由级 `apps/site/app/music/loading.tsx`。结构镜像 MusicView 布局：复用 `./styles` 既有布局容器（`Section`/`PageHeader`/`TitleGroup`/`Chronicle`/`Rail`/`Content`/`ContentInner`/`PanelHead`/`TrackList` 等，骨架与真容同源实现布局，切换时结构稳定、CLS 最小）+ 组件库 `Skeleton` 原语填充（纵轨年份条 ×6、页头标题/副题条、头像圆 + 身份栏、碟心圆 64px、面板标题/副题条、简介两行、曲目行 ×8：序号/名称 + 右列次数/时长）。`'use client'` 与 `/blog/loading.tsx` 同构；不引入可聚焦元素；骨架块保持 `Skeleton` 默认 `aria-hidden`。
- **对比方案:**
  - 方案 C「骨架页 + 切年局部骨架（MusicView `loading` 态渲染面板骨架）」——暂缓：用户诉求是「生成一个骨架页」，A 直接命中且最小；切年骨架涉及 MusicView 状态渲染改动，留作后续独立小 change（monorepo 小步快跑约定）。
  - 方案 B「只做切年局部骨架」——否决：完全不解决首屏白屏，不命中原始诉求。
- **理由:** /music 与 /post 的关键差异：/post 缓存命中秒开，骨架是纯负收益（first-load-performance 卡片撤销它）；/music 冷缓存要双重上游跳转（秒级白屏），骨架有真实反馈价值。first-load-performance 结论 scope 是 `/post`，本变更不在其约束范围内，但机制教训照单接受：骨架节点数保持轻量（纵轨 6 + 曲目 8，约 50 个 Skeleton 块）以约束 HTML 增量，并在验证阶段实测体积差记录到本 brief。缓存命中时骨架可能短闪是该方案的已知代价，可接受。
- **边界:** 纯新增路由级文件；不改 page.tsx、MusicView、styles.ts、specs、播放器与任何 `/v2/music/*` 契约；不在本 change 内给组件库加能力。

## 任务

### Phase 1

- [x] task 1 — `apps/site/app/music/loading.tsx` — 新增骨架页：复用 `./styles` 布局容器 + `@wuh.site/components/skeleton` 原语拼出年轮编年结构（纵轨年份条、页头、碟心圆、面板文案条、曲目行），镜像桌面纵轨与移动刻度带两档（断点只引 `BREAKPOINTS`，无硬编码色值与裸断点）；不引入 button 等可聚焦元素，`aria-hidden` 全覆盖
- [x] task 2 — `apps/site/app/music/loading.tsx` — 验证：`pnpm build:next` 通过；dev 启动后 `curl` 对比有无 loading.tsx 的 `/music` HTML 体积增量并记录到本 brief「结果」；wine/plain × light/dark 四主题 × 桌面/移动目检骨架形态与真容切换无跳变；`prefers-reduced-motion` 下 shimmer 静止（组件库已内建，目检确认即可）

## 结果

- 实际耗时: propose→apply 同日完成（2026-09-29）
- 验证:
  - `pnpm exec tsc --noEmit` exit 0（0 error）
  - `pnpm build` exit 0（`/music` 保持 ƒ Dynamic；期间两次 SIGSEGV/139 为 SGN-001 环境抖动——首次成功构建即含本 loading.tsx，文件构建有效性不受影响，清 .next 后复现成功）
  - HTML 体积对比（生产构建、同为无后端失败态内容）：无 loading.tsx 基线 71,063 字节，含骨架 100,619 字节，**骨架壳增量 +29.5KB（+42%）**，远低于 /post 当年 181KB 事故量级，与「约 50 个骨架块」的轻量预期同量级
  - 骨架驻留目检：生产服务器 `NEST_API_URL` 指向本机黑洞端口使服务端 fetch 挂起、流保持打开，截得 wine/plain × light/dark × 桌面(1280)/移动(390) 共 8 张截图（/tmp/music-skeleton/），骨架形态镜像真容布局、四主题色调随 token 适配、移动端刻度带横排 + 两行曲目行正确、无横向滚动
  - 换容目检：关闭黑洞后流完成，骨架干净切换为失败态 Empty，无布局爆炸（本地无上游真实数据；真实数据换容与缓存命中短闪为决策中已知代价）
  - `prefers-reduced-motion`：组件库 `SkeletonRoot` 内建 `@media (prefers-reduced-motion: reduce) { animation: none }`（源码与 readme 双确认），未逐项目检
- 实现备注（与「决策」的偏差）：页头「音乐」标题与副题为静态常量（不依赖数据），按 first-load-performance「骨架不应成为 FCP 元素」的教训直接渲染真容文本而非骨架条，换容时页头零跳变；数据未知区域（纵轨/身份栏/碟心/面板文案/简介/曲目行 ×8，共 54 个 Skeleton 块）照常使用骨架。`RailItem`/`TrackButton` 为 button（不可聚焦元素约束）不可复用，以局部非交互容器 `RailSlot`/`NameSlot`/`SkeletonRow`（`styled(TrackRow)` 去 pointer/hover）替代，间距/网格位镜像真容
- 已知残留：MusicView 切年 `loading` 态无视觉反馈，留作后续独立 change（见「动机」）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 「/music 页呈现」段需补一句：路由带 loading 骨架边界（年轮编年同构骨架，`/blog/loading.tsx` 同构先例），并记录与 first-load-performance `/post` 结论的差异取舍（冷缓存秒级白屏 vs 缓存命中骨架短闪）与 verified-depth。
