# About 综合活动热力图

> 原始变更名：`2026-07-26-P-about-site-activity-heatmap`

## 元数据
- 日期：2026-07-26
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
About 页当前已有 GitHub contribution 热力图，但它只展示 GitHub 数据。相邻的“最近日志”和时间范围选择器仍是静态占位内容，无法反映站点已经收集的访问、发布、评论、留言和项目更新活动。现有访问统计、内容和评论数据尚未提供统一的逐日聚合接口，前端也无法可靠地将不同量纲的数据直接合并。

## 引用规范
- `specs/about-activity/spec.md`
- `specs/visit-stats/spec.md`

## 决策
About 页面分别请求现有 GitHub contribution 接口和新增站点活动接口。站点活动接口由 NestJS 后端负责读取各数据源、按站点时区生成最近 365 个自然日、补齐缺失日期、计算分类等级和综合等级，并一次性返回前端。

```text
访问记录 ─┐
文章发布 ─┤
文章更新 ─┤→ AboutActivityService → 日期补齐 → 分类归一化 → 等权综合 → DTO
评论留言 ─┤                                                   ↓
项目内容更新┘                                      About / Heatmap 展示

GitHub contribution API ───────────────────────────────→ 独立 Heatmap
```

接口聚合失败时直接返回明确的 5xx 错误并记录失败来源；不允许仅返回部分数据并标记为成功。

| 维度 | 选择 | 理由 |
|------|------|------|
| 聚合位置 | NestJS 后端 | 统一处理日期边界、MongoDB 查询、缺失日期和失败语义，避免前端重复实现 |
| 时间窗口 | 当前站点日期往前 365 个自然日（含当前日） | 满足 About 页面固定范围，避免前端时钟和时区产生差异 |
| 日期时区 | 站点配置时区 | 保证访问、内容和评论在同一日期边界归桶 |
| 分类等级 | 每个分类独立按 365 天非零分布分为 1–4 级，零值为 0 | 防止访问量级远大于其他活动而淹没综合指数 |
| 综合等级 | 各分类等级等权平均后四舍五入到 0–4 | 不引入权重配置，结果可解释且满足统一热力图等级 |
| 前端展示 | 复用 Heatmap，新增活动文案和 breakdown | 保持现有视觉和布局，避免新建重复热力图组件 |

## 任务
### Phase 1: 后端数据与契约
- [x] **文件:** `packages/shared-contracts/src/about-activity.dto.ts`, `packages/shared-contracts/src/endpoints.ts`, `packages/shared-contracts/src/index.ts`
- [x] 定义 365 天响应、每日 breakdown、分类等级和日期范围字段。
- [x] 保持日期格式、等级范围和接口路径一致。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** `pnpm exec tsc --noEmit`
- [x] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.service.ts`, `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.controller.ts`
- [x] 增加供 About 聚合模块调用的日期范围聚合能力，不改变现有 total/today 响应。
- [x] 使用站点时区生成日期边界并按日返回计数。
- [ ] **预计耗时:** 75 分钟；**实际耗时:** 待实施
- [ ] **验证:** 相关服务测试及接口响应检查
- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/`
- [x] 汇总访问、文章发布、文章更新、评论/留言；项目更新暂不伪造，待稳定数据源后接入。
- [x] 补齐 365 天日期、独立归一化分类等级并计算等权综合等级。
- [x] 任一数据源失败时记录来源并返回明确错误，不返回部分成功结果。
- [ ] **预计耗时:** 2 小时；**实际耗时:** 待实施
- [ ] **验证:** 聚合服务测试覆盖空日期、跨时区、等级边界和单源失败
- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/about-activity.controller.ts`, `packages/wuh.site.nest/src/app.module.ts`
- [x] 实现 `GET /v2/about/activity`，返回共享 DTO。
- [x] 配置现有 API 前缀、异常处理和日志风格。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** Nest 构建和接口集成测试
### Phase 2: 前端热力图展示
- [x] **文件:** `packages/components/heatmap/types.ts`, `packages/components/heatmap/index.tsx`
- [x] 支持站点活动数据、活动文案、分类 breakdown 和移动端点击选中。
- [x] 保持 GitHub 热力图调用方和现有 tooltip 行为兼容。
- [ ] **预计耗时:** 2 小时；**实际耗时:** 待实施
- [ ] **验证:** 组件类型检查及已有 Heatmap 使用点检查
- [x] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`, `packages/wuh.site.next/app/about/data.ts`
- [x] 请求站点活动接口并渲染独立热力图。
- [x] 增加加载、失败和无数据状态；GitHub 热力图保持独立。
- [x] 不再把静态日志当作真实活动数据。
- [ ] **预计耗时:** 90 分钟；**实际耗时:** 待实施
- [ ] **验证:** `pnpm lint:next`、`pnpm exec tsc --noEmit`
### Phase 3: 规范与验收
- [ ] **文件:** `openspec/specs/about-activity/spec.md`, `openspec/specs/visit-stats/spec.md`, `openspec/INDEX.md`
- [ ] 记录新增接口、365 天日期窗口、来源失败、等级计算和交互要求。
- [ ] 明确 visit-stats 原有 total/today 接口不被破坏。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** OpenSpec 文档自检，所有 Requirement 使用 GIVEN/WHEN/THEN
- [ ] About 页面展示独立的站点活动热力图和 GitHub contribution 热力图。
- [ ] 接口始终返回 365 个日期，缺失日期补零，并包含分类明细。
- [ ] 任一数据源失败时前端显示失败状态，不能展示伪完整数据。
- [ ] 桌面端 hover、移动端 click 均能查看日期、等级和分类明细。
- [ ] `pnpm exec tsc --noEmit` 零错误。
- [ ] `pnpm lint:next` 通过。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-26-P-about-site-activity-heatmap
date: 2026-07-26
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/282
```

### `design.md`
# 设计文档

## 架构

About 页面分别请求现有 GitHub contribution 接口和新增站点活动接口。站点活动接口由 NestJS 后端负责读取各数据源、按站点时区生成最近 365 个自然日、补齐缺失日期、计算分类等级和综合等级，并一次性返回前端。

```text
访问记录 ─┐
文章发布 ─┤
文章更新 ─┤→ AboutActivityService → 日期补齐 → 分类归一化 → 等权综合 → DTO
评论留言 ─┤                                                   ↓
项目内容更新┘                                      About / Heatmap 展示

GitHub contribution API ───────────────────────────────→ 独立 Heatmap
```

接口聚合失败时直接返回明确的 5xx 错误并记录失败来源；不允许仅返回部分数据并标记为成功。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 聚合位置 | NestJS 后端 | 统一处理日期边界、MongoDB 查询、缺失日期和失败语义，避免前端重复实现 |
| 时间窗口 | 当前站点日期往前 365 个自然日（含当前日） | 满足 About 页面固定范围，避免前端时钟和时区产生差异 |
| 日期时区 | 站点配置时区 | 保证访问、内容和评论在同一日期边界归桶 |
| 分类等级 | 每个分类独立按 365 天非零分布分为 1–4 级，零值为 0 | 防止访问量级远大于其他活动而淹没综合指数 |
| 综合等级 | 各分类等级等权平均后四舍五入到 0–4 | 不引入权重配置，结果可解释且满足统一热力图等级 |
| 前端展示 | 复用 Heatmap，新增活动文案和 breakdown | 保持现有视觉和布局，避免新建重复热力图组件 |

## 数据模型

新增共享类型（字段名以最终实现为准）：

```ts
type SiteActivityBreakdown = {
  visits: number
  published: number
  updated: number
  comments: number
  guestbook: number
  projectUpdates: number
}

type SiteActivityDay = {
  date: string // YYYY-MM-DD，站点时区
  count: number // 综合原始计数，用于总量展示
  level: 0 | 1 | 2 | 3 | 4
  breakdown: SiteActivityBreakdown
  levels: SiteActivityBreakdown
}

type SiteActivityHeatmap = {
  startDate: string
  endDate: string
  timezone: string
  total: number
  days: SiteActivityDay[]
}
```

其中 `levels` 的字段与 `breakdown` 一一对应，分类等级只由同分类的 365 天计数分布计算。当前 Content 模型没有可可靠区分项目 changelog 历史事件的独立字段，因此 `projectUpdates` 暂不从未证实的标签或内容更新中推导，统一返回 0；待数据模型提供稳定来源后再单独接入。


## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/about/activity` | 返回最近 365 天站点活动热力图及分类明细 |

不接受客户端日期范围、时区或权重参数，避免不同客户端获得不一致的指标。

**响应示例:**

```json
{
  "startDate": "2025-07-27",
  "endDate": "2026-07-26",
  "timezone": "Asia/Shanghai",
  "total": 47,
  "days": [
    {
      "date": "2026-07-26",
      "count": 6,
      "level": 3,
      "breakdown": {
        "visits": 120,
        "published": 1,
        "updated": 0,
        "comments": 2,
        "projectUpdates": 1
      },
      "levels": {
        "visits": 2,
        "published": 4,
        "updated": 0,
        "comments": 3,
        "projectUpdates": 4
      }
    }
  ]
}
```

实际实现应保证 `days` 恰好包含 365 个按日期升序排列的元素；无活动日期的 breakdown 和 levels 全部为 0。`count` 为当天各分类原始计数之和，`total` 为所有日期综合原始计数之和。

## 组件/模块设计

### AboutActivityModule

新增 NestJS 模块、Controller 和 Service。Service 并行查询访问记录、内容日期和评论/留言日期，按统一日期键合并后计算等级；任一查询失败则抛出异常并保留来源日志。

### Heatmap

扩展现有 Heatmap Props，允许传入活动数据类型、单元格文案和 breakdown。GitHub 数据继续使用现有“贡献”语义；站点活动使用“活动”语义，并在 tooltip 中显示日期、综合等级和各分类原始计数。tooltip 的交互保持桌面 hover；移动端增加点击选中状态，点击其他单元格或组件外部可关闭。

### AboutView

新增站点活动请求和加载/失败/空状态；GitHub 热力图保持独立渲染。移除或不再依赖静态日志作为站点活动数据源，避免静态内容与真实聚合结果混淆。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | 单元格 hover 显示 tooltip，键盘聚焦也可查看详情 |
| < 768px | 点击单元格显示详情，避免依赖 hover；详情不超出视口 |

## 影响分析

- **新增依赖:** 无，复用 NestJS、Mongoose、现有 Heatmap 和请求工具。
- **破坏性变更:** 无；新增接口，现有 GitHub contributions 和 visit-stats 总量接口保持兼容。
- **向后兼容:** Heatmap 默认 Props 保持 GitHub 现有行为；旧调用方不传 breakdown 时继续显示原有 tooltip。
- **性能影响:** 聚合接口一次读取 365 天窗口，使用 MongoDB 日期范围查询和按日聚合；必要时复用已有短时缓存，避免每个热力图单元格单独请求。

### `proposal.md`
# About 综合活动热力图

## 背景

About 页当前已有 GitHub contribution 热力图，但它只展示 GitHub 数据。相邻的“最近日志”和时间范围选择器仍是静态占位内容，无法反映站点已经收集的访问、发布、评论、留言和项目更新活动。现有访问统计、内容和评论数据尚未提供统一的逐日聚合接口，前端也无法可靠地将不同量纲的数据直接合并。

## 目标

- 在 About 页增加最近 365 天的站点综合活动热力图。
- 通过后端统一聚合访问记录、文章发布/更新、评论/留言和项目内容更新，并返回每日分类明细。
- 将不同量纲的指标分别归一化后等权合成为每日 0–4 活跃等级，避免浏览量淹没低频内容活动。
- 桌面端悬浮、移动端点击时展示日期、综合等级及各项活动明细。
- 保留现有 GitHub contribution 热力图，并使热力图组件不再固定使用“贡献”文案。

## 非目标（明确不做）

- 不接入 Yuque、公众号等外部平台抓取。
- 不新增点赞历史、逐日文章浏览量或无法由现有记录还原的历史指标。
- 不建立新的项目 changelog/release 数据模型。
- 不引入可配置权重、通用分析平台或详情弹窗。
- 不把 GitHub contribution 与站点综合活动混合为同一指数。

## 影响范围

- `packages/wuh.site.nest/src/modules/visit-stats/` — 提供最近 365 天访问记录的逐日聚合能力。
- `packages/wuh.site.nest/src/modules/content/` — 提供文章、项目内容的日期聚合。
- `packages/wuh.site.nest/src/modules/comment/` — 提供评论/留言的日期聚合与状态规则。
- `packages/wuh.site.nest/src/modules/about-activity/` — 新增 About 综合活动聚合模块及接口。
- `packages/shared-contracts/` — 新增活动 DTO、接口路径和响应类型。
- `packages/components/heatmap/` — 支持通用活动计数、文案和明细 tooltip。
- `packages/wuh.site.next/app/about/` — 加载并展示站点活动热力图，替换静态日志占位。
- `openspec/specs/about-activity/`、`openspec/specs/visit-stats/` — 补充活动聚合规范。

### `specs/about-activity/spec.md`
# Spec: About 站点综合活动

## ADDED Requirements

### Requirement: 提供最近 365 天站点活动聚合
The system SHALL provide a fixed activity window covering the most recent 365 calendar days.

#### Scenario: 返回完整的自然日窗口
- **GIVEN** 访客请求 `GET /v2/about/activity`
- **WHEN** 所有站点活动数据源查询成功
- **THEN** 后端返回当前站点日期起往前 365 个自然日的活动数据
- **AND** 日期使用站点配置时区计算并按 `YYYY-MM-DD` 返回
- **AND** 返回日期按升序排列且恰好包含 365 个元素

### Requirement: 汇总站点活动分类
The system SHALL return daily raw counts for each site activity category.

#### Scenario: 返回每日活动分类明细
- **GIVEN** 活动聚合接口查询成功
- **WHEN** 后端构建每日数据
- **THEN** 每日结果包含访问、文章发布、文章更新、评论/留言和项目内容更新的原始计数
- **AND** 当前无法从现有模型可靠识别项目 changelog，`projectUpdates` 必须明确为 0，不得使用未经确认的标签或普通内容更新时间伪造项目更新
- **AND** 无法识别活动的日期分类计数为 0
- **AND** 每日结果包含综合原始计数和分类明细

### Requirement: 计算独立分类等级与综合等级
The system SHALL calculate explainable heatmap levels for category activity and daily total activity.

#### Scenario: 独立归一化并计算综合等级
- **GIVEN** 最近 365 天的每日分类计数已生成
- **WHEN** 后端计算热力图等级
- **THEN** 每个分类独立将零值设为 0，并依据该分类自身分布计算 1–4 等级
- **AND** 每日综合等级为各分类等级的等权平均值四舍五入到 0–4
- **AND** GitHub contribution 数量不参与站点综合等级计算

### Requirement: 补齐无活动日期
The system SHALL preserve calendar days with no activity records in the window.

#### Scenario: 无活动日期补零
- **GIVEN** 某个自然日没有任何来源记录
- **WHEN** 后端生成 365 天序列
- **THEN** 该日期仍出现在响应中
- **AND** 该日期的原始计数、分类等级和综合等级均为 0

### Requirement: 聚合失败明确返回错误
The system SHALL NOT return partial results as a complete success when a data source is unavailable.

#### Scenario: 任一数据源查询失败
- **GIVEN** 任一活动数据源查询失败
- **WHEN** 请求 About 活动聚合接口
- **THEN** 接口返回明确的服务端错误
- **AND** 记录失败数据源
- **AND** 不返回缺少该数据源的伪完整成功响应

### Requirement: 展示站点活动详情
The About page SHALL allow users to inspect daily activity category details.

#### Scenario: 查看站点活动单元格详情
- **GIVEN** About 页面加载到站点活动数据
- **WHEN** 用户在桌面端悬浮或移动端点击某个日期单元格
- **THEN** 展示日期、综合等级和各分类原始计数
- **AND** 站点活动使用“活动”语义，不显示固定的 GitHub“贡献”文案

### Requirement: 保持 GitHub 热力图独立
The About page SHALL display site activity and GitHub contributions as separate data sets.

#### Scenario: 分别展示两类热力图
- **GIVEN** About 页面同时加载站点活动和 GitHub contribution 数据
- **WHEN** 页面渲染热力图区域
- **THEN** 两类数据分别展示
- **AND** 任一热力图数据失败时不将另一类数据伪装为失败数据

## MODIFIED Requirements

### Requirement: Heatmap 组件支持多种数据语义
The Heatmap component SHALL remain compatible with existing GitHub contribution callers and support site activity details.

#### Scenario: 兼容 GitHub 并支持站点活动
- **GIVEN** 现有 Heatmap 调用方只传入 GitHub contribution 数据
- **WHEN** 组件升级以支持站点活动
- **THEN** 旧调用方继续显示原有 GitHub 热力图
- **AND** 新调用方可传入活动文案、分类明细和移动端点击状态

### `specs/visit-stats/spec.md`
# Spec: 全站访问量统计

## ADDED Requirements

### Requirement: 前端自动上报访问
The frontend SHALL automatically record site page visits.

#### Scenario: 页面加载或路由切换上报访问
- **GIVEN** 访客打开 wuh.site 任意页面
- **WHEN** 页面加载或客户端路由切换完成
- **THEN** 前端自动向后端 POST /api/v2/visit-stats/stats 上报一次访问

### Requirement: 后端按 IP 去重计数
The backend SHALL avoid counting repeated visits from the same visitor within a short time window.

#### Scenario: 30 分钟内重复访问不计数
- **GIVEN** 后端收到上报请求
- **WHEN** 30 分钟内同一 IP 已存在访问记录
- **THEN** 跳过此次计数，不插入新记录
- **AND** 30 分钟后同一 IP 再次上报时，视为新访问

### Requirement: 查询访问量统计
The backend SHALL provide total and daily visit statistics.

#### Scenario: 查询总访问量和今日访问量
- **GIVEN** 前端 GET /api/v2/visit-stats/stats
- **WHEN** 请求成功
- **THEN** 返回总访问量和今日访问量
- **AND** 总访问量 = 所有去重后的记录总数
- **AND** 今日访问量 = 当日 00:00:00 以来的去重记录数

### Requirement: 页面展示统计数据
The Footer SHALL display visit statistics.

#### Scenario: Footer 展示访问量
- **GIVEN** 任意页面的 Footer 区域
- **WHEN** 页面渲染
- **THEN** 显示 "总访问量: {total} | 今日: {today}"
- **AND** 统计数据定期自动刷新

## MODIFIED Requirements

### Requirement: 为站点活动提供逐日访问聚合
The visit-stats module SHALL additionally provide date-based visit aggregation without changing existing statistics interfaces.

#### Scenario: 按站点时区聚合每日访问
- **GIVEN** About 综合活动接口需要访问分类数据
- **WHEN** 后端查询指定的最近 365 天站点日期窗口
- **THEN** visit-stats 模块提供按站点时区归桶的每日去重访问计数
- **AND** 该能力不改变现有 total/today 统计接口的响应格式
- **AND** 查询失败时向调用方传播明确错误，不静默返回空序列

### `tasks.md`
# 任务清单

## Phase 1: 后端数据与契约

### Task 1: 定义站点活动共享 DTO

- [x] **文件:** `packages/shared-contracts/src/about-activity.dto.ts`, `packages/shared-contracts/src/endpoints.ts`, `packages/shared-contracts/src/index.ts`
- [x] 定义 365 天响应、每日 breakdown、分类等级和日期范围字段。
- [x] 保持日期格式、等级范围和接口路径一致。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** `pnpm exec tsc --noEmit`

### Task 2: 实现访问记录逐日聚合

- [x] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.service.ts`, `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.controller.ts`
- [x] 增加供 About 聚合模块调用的日期范围聚合能力，不改变现有 total/today 响应。
- [x] 使用站点时区生成日期边界并按日返回计数。
- [ ] **预计耗时:** 75 分钟；**实际耗时:** 待实施
- [ ] **验证:** 相关服务测试及接口响应检查

### Task 3: 实现 About 综合活动聚合模块

- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/`
- [x] 汇总访问、文章发布、文章更新、评论/留言；项目更新暂不伪造，待稳定数据源后接入。
- [x] 补齐 365 天日期、独立归一化分类等级并计算等权综合等级。
- [x] 任一数据源失败时记录来源并返回明确错误，不返回部分成功结果。
- [ ] **预计耗时:** 2 小时；**实际耗时:** 待实施
- [ ] **验证:** 聚合服务测试覆盖空日期、跨时区、等级边界和单源失败

### Task 4: 注册接口并接入模块

- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/about-activity.controller.ts`, `packages/wuh.site.nest/src/app.module.ts`
- [x] 实现 `GET /v2/about/activity`，返回共享 DTO。
- [x] 配置现有 API 前缀、异常处理和日志风格。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** Nest 构建和接口集成测试

## Phase 2: 前端热力图展示

### Task 5: 扩展 Heatmap 通用展示能力

- [x] **文件:** `packages/components/heatmap/types.ts`, `packages/components/heatmap/index.tsx`
- [x] 支持站点活动数据、活动文案、分类 breakdown 和移动端点击选中。
- [x] 保持 GitHub 热力图调用方和现有 tooltip 行为兼容。
- [ ] **预计耗时:** 2 小时；**实际耗时:** 待实施
- [ ] **验证:** 组件类型检查及已有 Heatmap 使用点检查

### Task 6: 接入 About 站点活动接口

- [x] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`, `packages/wuh.site.next/app/about/data.ts`
- [x] 请求站点活动接口并渲染独立热力图。
- [x] 增加加载、失败和无数据状态；GitHub 热力图保持独立。
- [x] 不再把静态日志当作真实活动数据。
- [ ] **预计耗时:** 90 分钟；**实际耗时:** 待实施
- [ ] **验证:** `pnpm lint:next`、`pnpm exec tsc --noEmit`

## Phase 3: 规范与验收

### Task 7: 补充访问统计和 About 活动规范

- [ ] **文件:** `openspec/specs/about-activity/spec.md`, `openspec/specs/visit-stats/spec.md`, `openspec/INDEX.md`
- [ ] 记录新增接口、365 天日期窗口、来源失败、等级计算和交互要求。
- [ ] 明确 visit-stats 原有 total/today 接口不被破坏。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** OpenSpec 文档自检，所有 Requirement 使用 GIVEN/WHEN/THEN

## 验收

- [ ] About 页面展示独立的站点活动热力图和 GitHub contribution 热力图。
- [ ] 接口始终返回 365 个日期，缺失日期补零，并包含分类明细。
- [ ] 任一数据源失败时前端显示失败状态，不能展示伪完整数据。
- [ ] 桌面端 hover、移动端 click 均能查看日期、等级和分类明细。
- [ ] `pnpm exec tsc --noEmit` 零错误。
- [ ] `pnpm lint:next` 通过。
