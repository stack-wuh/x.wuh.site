# Spec: 全站访问量统计

## ADDED

### Requirement: 前端自动上报访问
- **GIVEN** 访客打开 wuh.site 任意页面
- **WHEN** 页面加载或客户端路由切换完成
- **THEN** 前端自动向后端 POST /api/v2/visit-stats/stats 上报一次访问

### Requirement: 后端按 IP 去重计数
- **GIVEN** 后端收到上报请求
- **WHEN** 30 分钟内同一 IP 已存在访问记录
- **THEN** 跳过此次计数，不插入新记录
- **AND** 30 分钟后同一 IP 再次上报时，视为新访问

### Requirement: 查询访问量统计
- **GIVEN** 前端 GET /api/v2/visit-stats/stats
- **WHEN** 请求成功
- **THEN** 返回总访问量和今日访问量
- **AND** 总访问量 = 所有去重后的记录总数
- **AND** 今日访问量 = 当日 00:00:00 以来的去重记录数

### Requirement: 页面展示统计数据
- **GIVEN** 任意页面的 Footer 区域
- **WHEN** 页面渲染
- **THEN** 显示 "总访问量: {total} | 今日: {today}"
- **AND** 统计数据定期自动刷新
