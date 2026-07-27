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
