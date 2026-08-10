# 修复 About 统一热力图请求与展示

> 原始变更名：`2026-07-28-b-fix-about-heatmap-merge`

## 元数据
- 日期：2026-07-28
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
About 页面当前将站点活动与 GitHub 贡献拆成两张热力图，和“单一综合热力图”的实际需求不一致。两个请求也持续失败：Next rewrite 的目标地址已经包含 `/v2`，而前端请求 `/api/v2/...` 会被转发为 `/v2/v2/...`，无法命中 NestJS 路由。

## 引用规范
- `specs/about-activity/spec.md`

## 决策
统一接口在服务端完成日期窗口、站点活动和 GitHub 贡献的聚合，前端不再分别请求两套热力图数据。

```
AboutView
  -> GET /api/about/activity
  -> Next rewrite: http://nest:3200/v2/about/activity
  -> AboutActivityService
       -> 站点活动日计数
       -> GitHub contributions 日计数
       -> 按 YYYY-MM-DD 合并并计算总量/等级
  -> UnifiedActivityHeatmap
  -> Heatmap
```

关键路径规则：`nestApiUrl` 已包含 `/v2`，因此浏览器请求必须是 `/api/about/activity`，不能重复添加 `/v2`。

| 维度 | 选择 | 理由 |
|------|------|------|
| 数据聚合位置 | NestJS 服务端 | 集中处理日期补零、归一化和外部 GitHub 数据失败语义，避免前端双请求不一致。 |
| 活动强度 | 每日原始总量的统一分布等级 | 符合“综合总量”要求，颜色仅表达同一天所有活动的合计。 |
| 日期基准 | Asia/Shanghai 的最近 365 个自然日 | 与既有站点活动规范一致，避免时区错位。 |
| 前端请求 | `/api/about/activity` | 与现有 rewrite 规则匹配，最终目标不会产生 `/v2/v2`。 |

## 任务
### Phase 1: 复现与契约测试
- [x] **文件:** 现有 About 活动服务/控制器测试文件，必要时使用现有测试目录
- [x] 添加浏览器路径 `/api/about/activity` 经 rewrite 只生成一个 `/v2` 前缀的测试或可重复验证脚本。
- [x] 添加统一 365 天响应中包含 GitHub 贡献、站点分类、每日总量和等级的失败用例。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 修复前代理路径或统一响应断言失败，且失败原因符合预期。
### Phase 2: 后端统一聚合
- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/about-activity.service.ts`
- [x] 复用 GitHub contribution 数据源，按 Asia/Shanghai 日期键与站点活动合并。
- [x] 以所有原始分类计数之和计算每日 `total`，并基于统一总量分布计算 `level`。
- [x] 保持 365 天日期完整；必要数据源失败时返回明确错误。
- [ ] **预计:** 60 分钟
- [ ] **验证:** 服务测试覆盖同日合并、不同日补零、无活动日等级为 0 和 GitHub 数据源失败。
- [x] **文件:** `packages/shared-contracts/src/about-activity.dto.ts`、相关导出文件
- [x] 将 GitHub 贡献分项和统一总量/等级纳入共享 DTO。
- [ ] **预计:** 20 分钟
- [ ] **验证:** 前后端类型检查能消费统一响应。
### Phase 3: 前端单图渲染
- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`
- [ ] 将请求改为 `/api/about/activity`，避免 rewrite 产生 `/v2/v2`。
- [ ] 用一次 `useRequest` 和一次 `Heatmap` 渲染替换两套独立请求与热力图。
- [ ] 保留每日总量和站点/GitHub 分项的交互详情，失败时只显示一个错误状态。
- [ ] **预计:** 40 分钟
- [ ] **验证:** About 视图不再请求 `/api/v2/*` 或 `/v2/*` 热力图路径，且只渲染一个 `Heatmap`。
- [ ] **文件:** `packages/components/heatmap/index.tsx` 及其既有类型文件（如需要）
- [ ] 显示 GitHub 贡献和站点分类明细，避免固定“GitHub 贡献”或“站点活动”的单源文案。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 单元格 hover/click/focus 均显示日期、总量、GitHub 贡献与站点分类。
### Phase 4: 集成验证
- [ ] **文件:** 无生产文件修改
- [ ] 启动 NestJS 和 Next.js，验证 `GET /api/about/activity` 成功返回统一响应，且不存在 `/v2/v2` 请求。
- [ ] 在桌面和移动视图检查 About 页面仅有一个热力图，数据与 tooltip 正常展示。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 相关测试、lint 和类型检查全部通过；浏览器控制台无热力图请求错误。
- [ ] `GET /api/about/activity` 通过 Next rewrite 正确到达 `GET /v2/about/activity`，不出现双 `/v2` 前缀。
- [ ] About 页面只展示一个最近 365 天的综合热力图。
- [ ] 每日格子强度由站点活动与 GitHub 贡献的原始总量决定。
- [ ] Tooltip/移动端详情包含总活动量、GitHub 贡献和站点活动分类。
- [ ] 任一必要数据源失败时页面显示唯一明确错误状态，不能显示伪完整数据。
- [ ] 相关测试、lint、TypeScript 类型检查和真实页面链路验证通过。

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-28-B-fix-about-heatmap-merge
date: 2026-07-28
type: B
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/287
```

### `design.md`
# 设计文档

## 架构

统一接口在服务端完成日期窗口、站点活动和 GitHub 贡献的聚合，前端不再分别请求两套热力图数据。

```
AboutView
  -> GET /api/about/activity
  -> Next rewrite: http://nest:3200/v2/about/activity
  -> AboutActivityService
       -> 站点活动日计数
       -> GitHub contributions 日计数
       -> 按 YYYY-MM-DD 合并并计算总量/等级
  -> UnifiedActivityHeatmap
  -> Heatmap
```

关键路径规则：`nestApiUrl` 已包含 `/v2`，因此浏览器请求必须是 `/api/about/activity`，不能重复添加 `/v2`。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 数据聚合位置 | NestJS 服务端 | 集中处理日期补零、归一化和外部 GitHub 数据失败语义，避免前端双请求不一致。 |
| 活动强度 | 每日原始总量的统一分布等级 | 符合“综合总量”要求，颜色仅表达同一天所有活动的合计。 |
| 日期基准 | Asia/Shanghai 的最近 365 个自然日 | 与既有站点活动规范一致，避免时区错位。 |
| 前端请求 | `/api/about/activity` | 与现有 rewrite 规则匹配，最终目标不会产生 `/v2/v2`。 |

## 数据模型

统一每日数据在原有站点分类基础上新增 GitHub 贡献计数：

```ts
interface UnifiedActivityDay {
  date: string
  total: number
  level: 0 | 1 | 2 | 3 | 4
  counts: {
    visits: number
    published: number
    updated: number
    comments: number
    guestbook: number
    projectUpdates: number
    githubContributions: number
  }
}

interface UnifiedActivityHeatmap {
  startDate: string
  endDate: string
  total: number
  days: UnifiedActivityDay[]
}
```

`total` 是所有分类原始计数（含 `githubContributions`）之和。`level` 由 365 天内非零 `total` 的分布计算；无活动日恒为 0。Tooltip 显示日期、总活动量、GitHub 贡献以及各站点分类计数。

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/about/activity` | 返回站点活动和 GitHub 贡献合并后的最近 365 天数据。 |

浏览器端经 Next rewrite 调用：`GET /api/about/activity`。

**响应示例:**

```json
{
  "startDate": "2025-07-29",
  "endDate": "2026-07-28",
  "total": 42,
  "days": [
    {
      "date": "2026-07-28",
      "total": 5,
      "level": 3,
      "counts": {
        "visits": 2,
        "published": 0,
        "updated": 1,
        "comments": 0,
        "guestbook": 0,
        "projectUpdates": 0,
        "githubContributions": 2
      }
    }
  ]
}
```

接口必须在任一必要数据源失败时返回明确错误，不能把缺失的 GitHub 数据当作零值成功返回。

## 组件/模块设计

### AboutActivityService

在现有站点活动聚合结果基础上获取 GitHub contribution 日计数，使用相同日期键合并，并计算统一 `total` 与 `level`。GitHub 获取逻辑从现有贡献接口/服务复用，不复制网络请求实现。

### Heatmap

继续接收按周组织的数据；扩展单元格详情类型，以显示 `githubContributions` 和站点分类。没有新增图表组件。

### AboutView

删除两个独立的 `useRequest`、两段热力图标题和两次 `Heatmap` 渲染，改为一次统一请求和一次渲染。请求失败时显示唯一、明确的统一热力图错误状态。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | Hover 显示当天总量和分项明细。 |
| < 768px | 点击单元格显示同样的当天总量和分项明细。 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** `GET /v2/about/activity` 的响应增加 GitHub 贡献并改为统一强度语义；它目前仅由 About 页面使用。
- **向后兼容:** 删除 About 页面上两个独立热力图的展示，不影响其他 API 路由。
- **性能影响:** 单次页面请求替换两次请求；服务端需在统一聚合中调用 GitHub 贡献数据源，沿用其缓存策略。

### `proposal.md`
# 修复 About 统一热力图请求与展示

## 背景

About 页面当前将站点活动与 GitHub 贡献拆成两张热力图，和“单一综合热力图”的实际需求不一致。两个请求也持续失败：Next rewrite 的目标地址已经包含 `/v2`，而前端请求 `/api/v2/...` 会被转发为 `/v2/v2/...`，无法命中 NestJS 路由。

## 目标

- 修正前端到 NestJS 的代理路径，使统一热力图接口可正常访问。
- 将站点活动与 GitHub 贡献按自然日合并为一个 365 天热力图数据集。
- About 页面只渲染一个热力图；每日总活动量决定格子强度，交互明细展示站点分类和 GitHub 贡献数。

## 非目标（明确不做）

- 不更改访问、内容、评论、留言等原始数据的采集逻辑。
- 不改变 GitHub OAuth、仓库信息或其他 About 页面区域。
- 不引入新的第三方图表依赖。

## 影响范围

- `packages/wuh.site.next/app/about/AboutView.tsx` — 改为请求并渲染单一热力图。
- `packages/wuh.site.nest/src/modules/about-activity/` — 聚合 GitHub 贡献和站点活动，并提供统一接口。
- `packages/shared-contracts/` — 定义统一日活动响应类型。
- `packages/components/heatmap/` — 支持统一活动的分项详情展示。
- `openspec/specs/about-activity/spec.md` — 用单一综合热力图需求替代“两张独立热力图”要求。

### `specs/about-activity/spec.md`
# Spec: About 统一综合热力图

## MODIFIED Requirements

### Requirement: 提供最近 365 天统一综合活动聚合
后端 MUST 将站点活动与 GitHub contribution 聚合为单一的 365 天数据集。

#### Scenario: 统一接口返回完整的每日活动数据
- **WHEN** 访客请求 `GET /v2/about/activity` 且所有必要数据源均查询成功
- **THEN** 后端返回当前站点日期起往前 365 个自然日的统一活动数据
- **AND** 每日数据按 `YYYY-MM-DD` 升序排列并包含站点活动分类与 `githubContributions`
- **AND** 浏览器经 Next rewrite 请求 `/api/about/activity`，代理目标只包含一个 `/v2` 前缀

### Requirement: 计算统一每日总量与等级
后端 MUST 以所有活动来源的合计值计算热力图每日强度。

#### Scenario: 合并所有活动来源计算每日强度
- **WHEN** 后端构建最近 365 天的站点活动和 GitHub contribution 日计数
- **THEN** 每日 `total` 等于所有站点活动分类计数与 GitHub contribution 计数之和
- **AND** 每日 `level` 基于统一 `total` 分布计算 0–4 等级
- **AND** 无活动日的 `total` 与 `level` 均为 0

### Requirement: 展示单一综合热力图
About 页面 MUST 将所有活动来源展示为一张热力图。

#### Scenario: 页面展示统一热力图及分项明细
- **WHEN** About 页面加载到统一活动数据并渲染热力图区域
- **THEN** 页面只渲染一个热力图
- **AND** 格子颜色表达每日统一 `total` 强度
- **AND** 桌面 hover、移动端点击或键盘聚焦时显示日期、总量、GitHub 贡献及站点活动分类明细

### Requirement: 统一接口错误处理
统一接口 MUST 在必要数据源失败时不得伪造完整成功数据。

#### Scenario: 必要数据源失败时显示统一错误状态
- **WHEN** 任一必要活动数据源不可用且访客请求统一活动接口
- **THEN** 接口返回明确错误
- **AND** About 页面显示唯一的综合热力图错误状态
- **AND** 不返回缺少某个数据源的伪完整成功数据

## REMOVED Requirements

### Requirement: 保持 GitHub 热力图独立
GitHub 贡献不再与站点活动分别渲染两张热力图。

#### Scenario: 以统一热力图替代独立 GitHub 热力图
- **WHEN** About 页面展示活动数据
- **THEN** GitHub 贡献作为统一综合热力图的一个明细来源展示

### `tasks.md`
# 任务清单

## Phase 1: 复现与契约测试

### Task 1: 固化代理路径与统一响应的失败用例

- [x] **文件:** 现有 About 活动服务/控制器测试文件，必要时使用现有测试目录
- [x] 添加浏览器路径 `/api/about/activity` 经 rewrite 只生成一个 `/v2` 前缀的测试或可重复验证脚本。
- [x] 添加统一 365 天响应中包含 GitHub 贡献、站点分类、每日总量和等级的失败用例。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 修复前代理路径或统一响应断言失败，且失败原因符合预期。

## Phase 2: 后端统一聚合

### Task 2: 合并 GitHub 与站点日活动

- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/about-activity.service.ts`
- [x] 复用 GitHub contribution 数据源，按 Asia/Shanghai 日期键与站点活动合并。
- [x] 以所有原始分类计数之和计算每日 `total`，并基于统一总量分布计算 `level`。
- [x] 保持 365 天日期完整；必要数据源失败时返回明确错误。
- [ ] **预计:** 60 分钟
- [ ] **验证:** 服务测试覆盖同日合并、不同日补零、无活动日等级为 0 和 GitHub 数据源失败。

### Task 3: 更新共享响应契约

- [x] **文件:** `packages/shared-contracts/src/about-activity.dto.ts`、相关导出文件
- [x] 将 GitHub 贡献分项和统一总量/等级纳入共享 DTO。
- [ ] **预计:** 20 分钟
- [ ] **验证:** 前后端类型检查能消费统一响应。

## Phase 3: 前端单图渲染

### Task 4: 修复请求路径并移除双热力图

- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`
- [ ] 将请求改为 `/api/about/activity`，避免 rewrite 产生 `/v2/v2`。
- [ ] 用一次 `useRequest` 和一次 `Heatmap` 渲染替换两套独立请求与热力图。
- [ ] 保留每日总量和站点/GitHub 分项的交互详情，失败时只显示一个错误状态。
- [ ] **预计:** 40 分钟
- [ ] **验证:** About 视图不再请求 `/api/v2/*` 或 `/v2/*` 热力图路径，且只渲染一个 `Heatmap`。

### Task 5: 适配统一热力图详情

- [ ] **文件:** `packages/components/heatmap/index.tsx` 及其既有类型文件（如需要）
- [ ] 显示 GitHub 贡献和站点分类明细，避免固定“GitHub 贡献”或“站点活动”的单源文案。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 单元格 hover/click/focus 均显示日期、总量、GitHub 贡献与站点分类。

## Phase 4: 集成验证

### Task 6: 验证真实代理链路与页面

- [ ] **文件:** 无生产文件修改
- [ ] 启动 NestJS 和 Next.js，验证 `GET /api/about/activity` 成功返回统一响应，且不存在 `/v2/v2` 请求。
- [ ] 在桌面和移动视图检查 About 页面仅有一个热力图，数据与 tooltip 正常展示。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 相关测试、lint 和类型检查全部通过；浏览器控制台无热力图请求错误。

## 验收

- [ ] `GET /api/about/activity` 通过 Next rewrite 正确到达 `GET /v2/about/activity`，不出现双 `/v2` 前缀。
- [ ] About 页面只展示一个最近 365 天的综合热力图。
- [ ] 每日格子强度由站点活动与 GitHub 贡献的原始总量决定。
- [ ] Tooltip/移动端详情包含总活动量、GitHub 贡献和站点活动分类。
- [ ] 任一必要数据源失败时页面显示唯一明确错误状态，不能显示伪完整数据。
- [ ] 相关测试、lint、TypeScript 类型检查和真实页面链路验证通过。
