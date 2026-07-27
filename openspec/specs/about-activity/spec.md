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
