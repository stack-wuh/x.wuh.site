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
