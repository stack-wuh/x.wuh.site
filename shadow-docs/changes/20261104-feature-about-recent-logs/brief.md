---
{
  "schema": "shadow-dev/v1",
  "name": "20261104-feature-about-recent-logs",
  "type": "feature",
  "scope": "about",
  "status": "published",
  "baseBranch": "main",
  "branch": "feature/20261104-feature-about-recent-logs",
  "files": [
    "apps/server/src/app.module.ts",
    "apps/server/src/modules/about-timeline",
    "apps/server/src/modules/api-v2/api-v2.service.ts",
    "apps/site/app/about",
    "packages/components/locales/dictionaries",
    "packages/core/src/about-timeline.dto.ts",
    "packages/core/src/endpoints.ts"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 569,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/569"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "0cbe78b47d3b7c326743effff382ae8760677562",
    "verifiedAt": "2026-11-03T23:52:14.228Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:569",
    "planHash": "fdf6bd5c12272410edda3b4423ea272d87ba4210df432667aae7dbbf4a914eb5",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/server/package.json",
        "apps/server/src/app.module.ts",
        "apps/server/src/modules/about-timeline",
        "apps/server/src/modules/api-v2/api-v2.service.ts",
        "apps/site/app/about/AboutView/index.tsx",
        "apps/site/app/about/data.ts",
        "apps/site/app/about/styles.ts",
        "packages/components/locales/dictionaries/en/about.ts",
        "packages/components/locales/dictionaries/ja/about.ts",
        "packages/components/locales/dictionaries/zh/about.ts",
        "packages/core/src/about-timeline.dto.ts",
        "packages/core/src/endpoints.ts",
        "packages/core/src/index.ts",
        "pnpm-lock.yaml",
        "shadow-docs/changes/20261104-feature-about-recent-logs",
        "shadow-docs/knowledge/about-timeline.md",
        "shadow-docs/menu.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(about): 最近日志接入跨平台真实数据聚合",
      "title": "feat(about): 最近日志接入跨平台真实数据聚合（GitHub/豆瓣/微信读书/站内）",
      "body": "## 动机\nAbout 页 Timeline 区块原为纯静态 mock（link 全 # 占位、筛选器未接逻辑、platform 为拿不到数据的语雀/公众号）。接入真实数据源形成跨平台「最近日志」。\n\n## 实现\n- 新增 `GET /v2/about/timeline`（about-timeline 模块）：四 provider 插拔聚合（site=content/comment 读库、github=ReleaseEvent/CreateEvent、douban=interests+notes 双 RSS、weread=books 读库），TTL 内存缓存，**部分降级**（单源失败 sources 标记、其余照常，与热力图统计契约有意区分）\n- core 新增 about-timeline.dto（TIMELINE_PLATFORMS/CATEGORIES 枚举 + TimelineEntry/TimelineResponse）+ aboutTimelineService 端点\n- 前端 Timeline 区块接 useRequest 真实数据、筛选器（90d/180d/今年）接逻辑、Empty 空态；删 mock；zh/en/ja 词典补 category/empty/error\n- Twitter 不接（免费层读不到），provider 插拔留口\n\n## 验证\n- 结构断言 12/12（降序/字段完整/无 # 占位/枚举合法）+ 豆瓣双挂降级断言 4/4（本地实跑，四源 29 条真实数据）\n- 回归探针 locales/useRequest/empty 24/24 绿；tsc 全仓绿（SGN-001 配方 mise node22）\n- 证据缺口：豆瓣单 feed 降级分支 runtime 复验转 CI（本机 node 静默死，记录于 signals SGN-001）\n\nCloses shadow-docs/changes/20261104-feature-about-recent-logs/brief.md"
    }
  },
  "knowledge": {
    "action": "新增",
    "target": "shadow-docs/knowledge/about-timeline.md",
    "reason": "全新跨源聚合契约（/v2/about/timeline 部分降级语义、TIMELINE_PLATFORMS/CATEGORIES 枚举、provider 插拔约束、link 禁 # 占位、双 feed 单挂保另一 feed），超出 about-activity 卡片边界需独立卡片；卡片落地时须同步 shadow-docs/menu.md 路由（About 数据行）并带 source/scope/verified"
  }
}
---

# About 页「最近日志」跨平台动态时间线

## 动机
About 页 Timeline 区块当前是纯静态 mock（`apps/site/app/about/data.ts` 的 `timelineLogs`，link 全是 `#` 占位，`timelineFilters` 三档筛选器未接逻辑，platform 还是拿不到数据的语雀/公众号）。需要接入真实数据源形成跨平台「最近日志」：GitHub 活动、豆瓣 RSS、微信读书、站内内容。数据源实测：GitHub Events API 可用（`GET /users/stack-wuh/events/public`）、豆瓣两个 RSS feed 可访问（账号 2022-12 后无动态，接受近期空窗）、微信读书库有 `reading_update_time`/`finished` 字段、站内文章留言已在 MongoDB。Twitter 免费读不到、付费路径不为个人模块付费，第一版不接，聚合层留 provider 插拔口。

## 复杂度评级
- **评级:** M
- **理由:** 契约变更=新增 `GET /v2/about/timeline` 接口与 core DTO（新增不破坏存量）；触及面=core DTO + 新 Nest 模块 + About 前端区块 + i18n 三语词典约 4 层；可发现性=中（新接口注册 api-v2 清单）
- **期望验证深度:** unit
- **取证策略:** assert-first（不变量可构造输入机检：mock 外部源响应断言映射结果、构造单 provider 失败断言部分降级、断言降序与字段完整性）

## 领域模型

- **限界上下文:** About 展示域 — 站点对外聚合展示的只读视图（与 about-activity 热力图、footprint 同域）。上游 GitHub REST API、豆瓣 RSS、站内 content/comment/weread 读模型；下游 About 前端。反腐边界：provider 将外部源数据映射为统一 TimelineEntry，聚合层不透出外部原始结构；本变更不修改 content/comment/weread 既有模块，只读复用。
- **统一语言增量:** 「最近日志」= About 页跨平台动态时间线（页面展示名）；`TimelineEntry` = 统一动态条目（platform/category/title/link/timestamp）；`provider` = 单一外部源的适配器（site/github/douban/weread，可插拔，新增源=新增 provider 类+注册）。
- **聚合与不变量:**
  - `INV-1 TimelineResponse`：每条条目 title/link/timestamp 必有；link 禁止 `#` 占位（mock 反例），无真实链接时用平台主页兜底
  - `INV-2 TimelineResponse`：条目按 timestamp 降序，无 null/undefined 条目混入
  - `INV-3 聚合 service`：单 provider 失败时其余源照常返回（部分降级），不整体 5xx；该语义与热力图「任一必要源失败返回明确错误」有意区分——热力图是统计契约，timeline 是日志流
  - `INV-4 聚合 service`：返回体零 mock/占位数据
- **领域事件:** 无写库事件（实时聚合，方案 A）；provider 内存缓存刷新为内部状态变化，无流程后果。

## 引用规范
- shadow-docs/knowledge/about-code-structure.md
  - 当前结论: About 入口只负责组合，数据获取/展示区块/样式按职责拆分，page.tsx 80 行内
  - 适用 scope: apps/site/app/about —— Timeline 区块的数据获取与展示遵循拆分约束
- shadow-docs/knowledge/about-activity.md
  - 当前结论: 热力图契约=任一必要数据源失败返回明确错误、聚合规则与 level 为前后端契约
  - 适用 scope: server about-activity + site about —— 本变更不修改热力图接口；timeline 的部分降级语义与其有意区分，两条契约并存不混淆
- shadow-docs/knowledge/api-standardization.md
  - 当前结论: DTO 验证/Swagger/异常格式规范
  - 适用 scope: 新接口与 DTO 遵循既有规范

## 决策
- **选型:** 方案 A —— 服务端实时聚合 + TTL 内存缓存 + stale 兜底，provider 插拔
- **对比方案:** 方案 B（GitHub Actions 定时同步入库，weread 范式）——对快变只读数据流偏重，多养一条工作流+schema，新鲜度受 cron 限制，未选；方案 C（前端直接聚合）——豆瓣 RSS 有 CORS/风控、GitHub events 语义映射无法在前端做，不可行
- **理由:** 热力图已验证「实时聚合+内存缓存」范式；weread 的 Actions 同步适合慢变列表（书架）不适合时间流；provider 插拔满足 Twitter 留口诉求；事件映射：GitHub=blog repo IssuesEvent(open)→发布博客（link 站内 /post/N）+ReleaseEvent→发布版本+CreateEvent(repository)→开源仓库，PushEvent/WatchEvent 排除（噪音）；豆瓣=interests feed（看过/读过/在看）+notes feed（日记）；微信读书=reading_update_time 最新的在读/读完→「在读《书名》」；站内=文章发布+新留言

## 任务
### Phase 1 后端
- [x] core 新增 about-timeline.dto.ts（platform/category 枚举 + TimelineEntry/TimelineResponse）并注册 timelineService 端点 — `packages/core/src/about-timeline.dto.ts`, `packages/core/src/endpoints.ts`
- [x] server 新建 about-timeline 模块骨架（module/controller/service + 内存缓存 + 部分降级聚合骨架）并注册 app.module — `apps/server/src/modules/about-timeline/`, `apps/server/src/app.module.ts`
- [x] site provider：content 文章 + comment 留言读库映射（只读复用既有 collection）— `apps/server/src/modules/about-timeline/providers/`
- [x] weread provider：books 读库按 reading_update_time 映射「在读/读完《书名》」— `apps/server/src/modules/about-timeline/providers/`
- [x] github provider：events/public 拉取 + 过滤映射（排除 PushEvent/WatchEvent）— `apps/server/src/modules/about-timeline/providers/`
- [x] douban provider：interests + notes 两 feed 拉取解析映射（rss-parser）— `apps/server/src/modules/about-timeline/providers/`
- [x] 聚合收口：降序/截断/缓存 + GET /v2/about/timeline + api-v2 清单注册 — `apps/server/src/modules/about-timeline/about-timeline.service.ts`, `apps/server/src/modules/api-v2/api-v2.service.ts`

### Phase 2 前端
- [x] Timeline 区块接 useFetch 真实数据、筛选器（90d/180d/今年）接逻辑、Empty 空态 — `apps/site/app/about/AboutView/`
- [x] 删 data.ts 的 timelineLogs mock 与语雀/公众号 platform 残留、i18n zh/en/ja 词典新增 timeline 文案 — `apps/site/app/about/data.ts`, `packages/components/locales/dictionaries/{zh,en,ja}/about.ts`
- [x] 验证：tsc --noEmit + 本地探针断言接口结构（降序/字段完整/单源降级）— 全仓

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 新增
- **候选卡片:** shadow-docs/knowledge/about-timeline.md（新建：timeline 契约——部分降级与热力图语义区分、platform 枚举、provider 插拔约束、link 禁 `#` 占位）
- **理由:** 全新跨源聚合契约，超出 about-activity 卡片边界，需独立卡片承载
