---
{
  "schema": "shadow-dev/v1",
  "name": "20261016-feature-image-progressive-reveal",
  "type": "feature",
  "scope": "components+site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261016-feature-image-progressive-reveal",
  "files": [
    "apps/site/app/lib/markdown.ts",
    "apps/site/app/post/components/PostCover/index.tsx",
    "apps/site/app/post/styles/post-markdown.ts",
    "apps/site/app/post/usePostImagePreview.ts",
    "packages/components/image/index.test.mjs",
    "packages/components/image/index.tsx",
    "packages/components/image/readme.md",
    "packages/components/image/styles/index.tsx",
    "packages/components/image/types.ts"
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
    "verifiedCommit": "85f5311db21b8ddaebfe4ede1b5cf4b5947c5f84",
    "verifiedAt": "2026-10-16T08:14:09.233Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "c6eb4aaefcc4e063cbc4fa721f823ada89234795fdc86b698a2527e007d604d5",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/site/app/lib/markdown.ts",
        "apps/site/app/post/components/PostCover/index.tsx",
        "apps/site/app/post/styles/post-markdown.ts",
        "apps/site/app/post/usePostImagePreview.ts",
        "packages/components/image/index.test.mjs",
        "packages/components/image/index.tsx",
        "packages/components/image/readme.md",
        "packages/components/image/styles/index.tsx",
        "packages/components/image/types.ts",
        "shadow-docs/changes/20261016-feature-image-progressive-reveal/brief.md",
        "shadow-docs/knowledge/post-cover.md"
      ],
      "message": "feat(components): 图片渐进式加载与失败态装裱题注",
      "title": "feat(components): 图片渐进式加载与失败态装裱题注",
      "body": "## 变更内容\n\n图片体验改造（brief 20261016-feature-image-progressive-reveal，M 级，review passed）：\n\n- **组件渐进式**（packages/components/image）：缓存命中（img.complete）layout effect 判定直达 loaded，回访/软导航返回零骨架闪现；新增 placeholder=blur + blurDataURL 透传（缺数据不生效，骨架让位模糊占底）；淡入收敛 300ms ease-out\n- **失败态装裱题注**（shadow-dev-design 三构提案选定构 A）：破图/灰图标 → 界格发丝线 + 衬线图题（取 alt）+ 朱砂「佚」印（aria-hidden，语义走屏读文本），词典零新增；errorFallback 逃生口保留\n- **封面失败不再塌陷**（PostCover D3 有意修订）：失败保留 16:9 杂志卡内装裱占位，PostHeader 照常、h1 唯一；post-cover 知识卡同步修订\n- **正文图收编**（apps/site）：渲染出口统一补 loading=lazy + decoding=async（幂等）；usePostImagePreview 容器级 capture error 监听 + 500ms 补扫，失败图转同源装裱占位并排除出画廊预览\n\n## 验证\n\n- 组件守卫 5/5、结构棘轮 18/18、tsc --noEmit exit 0、enhanceContentImages 幂等探针 true\n- 镜像页运行时（esbuild 实包真组件 + 帧无关 DOM 断言）：缓存零闪现 / blur 门控（含对照组）/ 装裱 DOM / 画廊排除 全 PASS\n- 证据缺口已登记：真页面四主题目检（后端未运行，部署后补）\n\n## 说明\n\n封面失败行为是 D3 有意修订（原「整块隐藏」会造成版面塌陷）；「佚」印为跨语言装饰字不入词典。LQIP 数据管线（服务端生成 blurDataURL）为后继独立变更，本变更先落组件能力。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/post-cover.md",
    "reason": "封面失败行为按 D3 有意修订：整块塌陷隐藏 → 组件内装裱题注占位（佚印+图题），16:9 版面节奏保留；卡片「加载失败隐藏」条款随 release 知识闭环原位更新并追加本 brief 为 source"
  }
}
---

# Image 图片体验改造：渐进式加载 + 失败态「装裱题注」+ 正文图收编

## 动机
慢网下图片体验三处破损：① 组件图（封面/头像/书封/留言配图）慢网时长时间只剩 shimmer 骨架、下载完突然整图浮现；已缓存图回访/软导航返回时闪现一帧骨架再淡入（挂载即重置 status，onLoad 要等水合后触发）。② 图片加载失败时展示糟糕：组件图是灰图标+文案，封面整块塌陷留洞，正文裸 `<img>` 是浏览器破图+alt 文字（最差）。③ 正文 markdown 图量最大却最原始：不懒加载、无过渡、失败无兜底。用户要求渐进式加载过渡 + 失败态走 UI 设计流程（shadow-dev-design 已完成三构提案，用户选定构 A「装裱题注」）。

## 复杂度评级
- **评级:** M
- **理由:** 契约变更 = ImageProps 增量可选 props（向后兼容）+ Fallback 视觉重构 + PostCover 失败分支行为修订（有意变更，随卡修订）；触及面 = 组件目录五文件 + site 正文渲染出口与预览 hook + PostCover，无 server 上下文；可发现性 = 视觉行为，守卫测试 + 多场景目检兜底
- **期望验证深度:** unit（组件守卫探针 + structure 棘轮 + tsc 基线）+ runtime 多场景目检
- **取证策略:** observation（状态机为 DOM 行为，无纯函数观察点；grep 式守卫锁关键分支存在性，行为以 dev server 目检取证）

## 领域模型
- **限界上下文:** 组件库（packages/components）+ 站点正文管线（apps/site/app）— UI 原语与其最大消费域。下游 site 与 console 各页面；反腐边界：组件不做图片取数/处理，不引 next/image 之外的加载逻辑，不引用站点主题变量（`--motion-*` 禁用条款维持）；正文域失败兜底不反向进组件库逻辑。
- **统一语言增量:** `placeholder`/`blurDataURL`（沿用 next/image 词汇）；「装裱题注」（失败态形态：界格线 + 衬线图题 + 佚印）；「佚」（失败印面装饰字，跨语言不变，不入词典，语义由既有 loadFailed key 承担）。
- **聚合与不变量:**
  - `INV-1 Image 状态机`：缓存命中（`img.complete && naturalWidth > 0`）时挂载直达 loaded，不经历骨架闪现；error 时不渲染 img 且呈现装裱占位（失败是有意的设计位，不是破图/塌陷）；blur 模式下 img 自挂载起可见，加载完成后呈现清晰图。
  - `INV-2 消费方契约`：新增 props 全部可选；既有消费方零改动可用；PostCover 失败行为按设计决策 D3 有意修订（塌陷→装裱占位），PostHeader 照常渲染、h1 唯一性保持；reduced-motion 降级保持。
  - `INV-3 正文域`：渲染出口补齐的正文 img 统一携带 `loading="lazy" decoding="async"`（确定性字符串运算，幂等）；失败图从大图预览集合排除（画廊不收破图）；正文位装裱纯静态（阅读区不动画）。
- **领域事件:** idle→loaded 迁移触发揭示过渡（非 blur：骨架淡出与图片淡入交叉；blur：模糊打底被清晰图替换）；idle→error 迁移呈现装裱占位。

## 引用规范
- shadow-docs/knowledge/component-standard.md
  - 当前结论: 三件套 + 条件项结构契约；改完必跑 `test/structure.test.mjs` 棘轮全绿；触碰组件顺手收敛在册欠账
  - 适用 scope: packages/components
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 共享组件禁止引用 `--motion-*`（console 不注入）；正文阅读区不动画；reduced-motion 必须降级
  - 适用 scope: packages/components + apps/site 正文域（装裱占位纯静态即此条款的落地）
- norms/ui-patterns.md
  - 当前结论: 过渡动画 150–300ms ease-out；禁布局位移类动画；必须响应 prefers-reduced-motion
  - 适用 scope: cross-project
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: fill 模式必须显式 sizes；priority→fetchPriority 映射不回退；不得引入流式骨架/loading 边界
  - 适用 scope: apps/site
- shadow-docs/knowledge/post-cover.md
  - 当前结论: 封面加载失败隐藏区域——**本变更按设计决策 D3 有意修订为「装裱占位」**（约束本意是「不留破图」，装裱占位是有意设计位且保全 16:9 版面节奏；release 知识闭环同步更新卡片）
  - 适用 scope: apps/site/app/post/components/PostCover

## 决策
- **选型:** 渐进式（缓存零闪现 + blur-up 能力 + 300ms 揭示带）+ 失败态构 A「装裱题注」（shadow-dev-design 三构提案定稿，视觉稿 `image-error-state-proposals.html` 即规格）+ 正文图机制方案一（属性增强 + capture 捕获兜底）。
- **设计决策清单:**
  - `D1` 失败态「装裱题注」：纸底 + 内界格发丝线（inset 9px）+ 中央衬线图题（alt 首句，CJK 疏排 .14em，限宽省略）+ 右下朱砂「佚」印（16px、primary 55% 描边、radius-xs）。Chanel 修订：mono「FIG.佚」题注删除（与印面重复，更静）。文件 `packages/components/image/styles/index.tsx` + `index.tsx`；词典零新增（图题=alt，无 alt 回落 `components.image.loadFailed`）；守卫 index.test.mjs 断言界格/图题/印结构与 reduced-motion 静态。
  - `D2` compact 位（avatar/thumbnail/book-cover/qr/logo）：界格内独印居中，无题注（空间预算不允许文本）。守卫断言 compact 分支无文本节点。
  - `D3` 封面失败修订：PostCover 移除 `return null` 塌陷，保留 CoverFrame + 装裱占位；PostHeader 照常渲染，h1 唯一性不变；post-cover.md 卡随 release 闭环修订。
  - `D4` 正文机制方案一：渲染出口（`lib/markdown.ts`）补 `loading="lazy" decoding="async"`；`usePostImagePreview` 容器级 `useEventListener('error', handler, containerRef, { capture: true })`（error 不冒泡但 capture 相位可达，容器持久）；失败 img 隐藏 + 插入同语言装裱占位（正文域样式 token 与组件 Fallback 同源、注释互指）；失败图标记 `data-lost` 并从预览集合排除。
  - `D5` 签名纪律：朱砂印为唯一签名元素（大位实印落款 / compact 独印两种形态）；印面「佚」为装饰字不入词典，三语 aria 复用 loadFailed。
- **对比方案:** 渐进式——B 全链路 LQIP 数据管线（跨 server 上下文，拆后继变更）、C 仅修缓存（不满足渐进诉求）；失败态——构 B 留白退场（最空灵，封面位降级生成式封面，用户未选）、构 C 俟印可挽（重试交互最重，用户未选，方向留痕不复活）；正文机制——方案二客户端收编进 Image 组件（DOM 手术重、URL 进优化器有外链风险，否决）、方案三纯 CSS 破图样式（Safari/Firefox 不一致，否决）。
- **理由:** 构 A 与全站文人纸墨语言同源（著录「佚」的书画语言），alt 从破图占位文字升格为图题——用户抱怨的「空白+alt文字」中被保留的不是破图而是语义；机制方案一不动 hydration 架构、有 useEventListener capture 先例；词典零新增使变更面收敛。

## 任务
### Phase 1 组件渐进式
- [x] styles 渐进式视觉分支 — `packages/components/image/styles/index.tsx` — ImgWrapper 增 `$blur` 门控（blur 模式 img 自挂载可见）；非 blur 淡入 0.35s→300ms ease-out；skeleton 与 reduced-motion 降级保持；不引 `--motion-*`、不新增全局关键帧
- [x] props 契约收口 — `packages/components/image/types.ts` — 显式收口 `placeholder`/`blurDataURL` 并加 JSDoc（blur 需自备 LQIP；不传即现状行为）
- [x] 状态机与门控 — `packages/components/image/index.tsx` — 合并 internal/forwarded ref；inView 后 `complete && naturalWidth > 0` 直达 loaded；`hasBlur` 门控抑制骨架并跳过 opacity 门；src 变更重置语义保持
- [x] 守卫扩展（渐进式） — `packages/components/image/index.test.mjs` — 断言 complete 检查、blur 门控、骨架抑制分支存在
### Phase 2 失败态装裱（构 A）
- [x] Fallback 装裱重设计 — `packages/components/image/styles/index.tsx` — D1 界格线/衬线图题/佚印 + D2 compact 独印分支；四主题 token；纯静态无动画
- [x] 图题数据通路 — `packages/components/image/index.tsx` — Fallback 接收 alt 作图题，无 alt 回落 loadFailed；`role='alert'` + aria-live 保持
- [x] PostCover 失败分支 — `apps/site/app/post/components/PostCover/index.tsx` — D3 移除塌陷，失败保留 CoverFrame + 装裱占位
- [x] 守卫扩展（失败态） — `packages/components/image/index.test.mjs` — D1/D2 结构断言
- [x] 文档同步 — `packages/components/image/readme.md` — 渐进式用法 + 失败态形态 + 行为矩阵（blur/无 blur/缓存/失败/compact）
### Phase 3 正文图收编
- [x] 渲染出口属性增强 — `apps/site/app/lib/markdown.ts` — 正文 img 统一补 `loading="lazy" decoding="async"`（确定性字符串运算，幂等）
- [x] 失败捕获与占位 — `apps/site/app/post/usePostImagePreview.ts` — capture error 监听；失败图隐藏 + 插入装裱占位；`data-lost` 标记 + 预览集合排除
- [x] 正文域装裱样式 — `apps/site/app/post/styles/post-markdown.ts` — 与组件 Fallback 同源 token（注释互指）；阅读区纯静态
### Phase 4 验证
- [x] 机器探针 — `node packages/components/image/index.test.mjs` + `node packages/components/test/structure.test.mjs` 全绿 + `pnpm exec tsc --noEmit`（触及文件零新增）
- [x] 运行时目检 — dev server：缓存回访零闪现；blurDataURL 模糊→清晰（Network 节流）；封面有图/无图/失败（装裱占位）三分支 + h1 唯一；正文失败图装裱落位 + 画廊排除失败图 + lazy attrs 生效；四主题 × 明暗；reduced-motion

## 结果
- 实际耗时: —
- 验证:
  - | INV-1 | 观察点：`node --experimental-strip-types --test packages/components/image/index.test.mjs` → 5/5 pass（complete 直达 loaded、blur 门控、骨架抑制、装裱结构、compact 断言）|
  - | INV-1 | 观察点：`node packages/components/test/structure.test.mjs` → 18/18 pass；`node ./node_modules/typescript/bin/tsc --noEmit` → exit 0 |
  - | INV-1 | 观察点：镜像页运行时（esbuild 实包真组件 + IAB，帧无关 DOM 断言）——缓存重挂载零骨架且 opacity=1；失败态装裱 DOM（破图移除+图题+佚印+界格+alert）；compact 独印无图题；blur 模式骨架退场+自挂载可见，对照组（无 blur）骨架在+opacity 门。8 断言 7 PASS 且另有一轮全 PASS（单轮单条 FAIL 为后台窗格 mock 404 请求挂起的环境伪影，同代码他轮 PASS）|
  - | INV-2 | 观察点：tsc exit 0（ImageProps 增量可选零破坏）+ 守卫断言 `errorFallback ??` 逃生口在位；git status 仅触及 brief 声明的 9 文件，其余消费方零改动 |
  - | INV-3 | 观察点：镜像页失败图 `dataset.lost` + `.md-img-mount` 占位 DOM（图题=alt）+ 画廊排除（items=ok图）PASS；`enhanceContentImages` 探针 → 缺失属性补齐、已有属性保留、`IDEMPOTENT=true` |
  - | 全部 | 证据缺口：真页面四主题 × 明暗视觉目检、blur 慢网手感、reduced-motion 视觉（本机 NestJS/Mongo 未运行，真页面不可渲染）；补充观察点：后端可用后 dev server 目检，或部署后线上抽查 |

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/post-cover.md（失败分支结论「隐藏」→「装裱占位」，D3 修订随 release 知识闭环执行，source 追加本 brief）
- **理由:** 封面失败行为是有意的设计变更，卡片条款需原位更新防止复辟；渐进式与装裱细节属组件/正文域内部实现，component-standard 与 animation 卡既有条款已覆盖，无新增稳定结论
