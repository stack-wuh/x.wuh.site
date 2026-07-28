# Spec: About 统一综合热力图

## Purpose

定义 About 页面最近 365 天站点活动与 GitHub 贡献的统一聚合、展示及错误处理规范。

## Requirements

### Requirement: 提供最近 365 天统一综合活动聚合
后端 MUST 将站点活动与 GitHub contribution 聚合为单一的 365 天数据集。

#### Scenario: 统一接口返回完整的每日活动数据
- **WHEN** 访客请求 `GET /v2/about/activity` 且所有必要数据源均查询成功
- **THEN** 后端返回当前站点日期起往前 365 个自然日的统一活动数据
- **AND** 每日数据按 `YYYY-MM-DD` 升序排列并包含站点活动分类与 `githubContributions`
- **AND** 浏览器经 Next rewrite 请求 `/api/about/activity`，代理目标只包含一个 `/v2` 前缀

### Requirement: 汇总站点活动分类
后端 MUST 返回每日站点活动分类的原始计数。

#### Scenario: 返回每日活动分类明细
- **WHEN** 后端构建每日统一活动数据
- **THEN** 每日结果包含访问、文章发布、文章更新、评论、留言和项目内容更新的原始计数
- **AND** 当前无法从现有模型可靠识别项目 changelog，`projectUpdates` 明确为 0
- **AND** 无法识别活动的日期分类计数为 0

### Requirement: 计算统一每日总量与等级
后端 MUST 以所有活动来源的合计值计算热力图每日强度。

#### Scenario: 合并所有活动来源计算每日强度
- **WHEN** 后端构建最近 365 天的站点活动和 GitHub contribution 日计数
- **THEN** 每日 `total` 等于所有站点活动分类计数与 GitHub contribution 计数之和
- **AND** 每日 `level` 基于统一 `total` 分布计算 0–4 等级
- **AND** 无活动日的 `total` 与 `level` 均为 0

### Requirement: 补齐无活动日期
后端 MUST 保留活动窗口内没有记录的自然日。

#### Scenario: 无活动日期补零
- **WHEN** 某个自然日没有任何来源记录
- **THEN** 该日期仍出现在 365 天响应中
- **AND** 该日期的所有原始计数、`total` 和 `level` 均为 0

### Requirement: 展示单一综合热力图
About 页面 MUST 在可用宽度内完整展示单一综合热力图，且布局标题与数据轨道准确对齐。

#### Scenario: 页面展示统一热力图及分项明细
- **WHEN** About 页面加载到统一活动数据并渲染热力图区域
- **THEN** 页面只渲染一个热力图
- **AND** 格子颜色表达每日统一 `total` 强度
- **AND** 桌面 hover、移动端点击或键盘聚焦时显示日期、总量、GitHub 贡献及站点活动分类明细

#### Scenario: 不同视口展示完整热力图
- **GIVEN** About 页面加载到最近 365 天统一活动数据
- **WHEN** 页面在桌面、平板或移动视口渲染综合热力图
- **THEN** 热力图完整展示 53 个周列且不产生组件内部横向滚动条
- **AND** 热力图不得导致页面横向溢出
- **AND** 月份标题与对应周列使用同一坐标轨道
- **AND** 星期标题与对应日期行准确对齐

### Requirement: 统一接口错误处理
统一接口 MUST 在必要数据源失败时不得伪造完整成功数据。

#### Scenario: 必要数据源失败时显示统一错误状态
- **WHEN** 任一必要活动数据源不可用且访客请求统一活动接口
- **THEN** 接口返回明确错误并记录失败数据源
- **AND** About 页面显示唯一的综合热力图错误状态
- **AND** 不返回缺少某个数据源的伪完整成功数据

### Requirement: Heatmap 组件支持多种数据语义
Heatmap 组件 MUST 保持现有调用兼容，并支持不会被边界裁切的综合活动详情。

#### Scenario: 兼容既有调用并支持综合活动
- **WHEN** 组件接收仅包含基础贡献数据的既有输入
- **THEN** 旧调用方继续显示原有热力图
- **AND** 综合活动调用方可传入活动文案、分类明细和移动端点击状态

#### Scenario: 查看边缘单元格详情
- **GIVEN** Heatmap 渲染包含综合活动明细的日期单元格
- **WHEN** 用户 hover、点击或键盘聚焦首行、末行或左右边缘单元格
- **THEN** Tooltip 根据单元格位置向组件内部展开
- **AND** Tooltip 使用受限宽度和多行文本完整显示日期、总量及分类明细
- **AND** Tooltip 不被热力图容器裁切
- **AND** 单元格继续提供可访问名称和键盘焦点

### Requirement: Heatmap 加载态保持稳定布局
Heatmap 加载态 MUST 与真实数据态使用相同的响应式轨道。

#### Scenario: 数据从加载态切换到成功态
- **GIVEN** About 页面正在加载综合活动数据
- **WHEN** Heatmap 从 Skeleton 切换到 365 天真实数据
- **THEN** 星期轨道、周列宽度和整体占用宽度保持一致
- **AND** 页面不会因状态切换出现横向滚动或可见布局跳变
