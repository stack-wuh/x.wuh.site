# 微信读书书架顺序

## ADDED

### Requirement: 首页展示在读前 6 本
- **GIVEN** WeRead 书架中存在至少 6 本 `finishReading=0` 的书籍
- **WHEN** 用户访问首页微信读书模块
- **THEN** 模块应展示最近阅读时间前 6 本在读书籍
- **AND** `finishReading=1` 的已读完书籍不应占用首页 6 个展示名额

### Requirement: 微信读书分页查询
- **GIVEN** 客户端请求微信读书书籍分页接口
- **WHEN** 请求携带 `page` 和 `limit`
- **THEN** 接口应按最近阅读时间降序分页返回结果
- **AND** 当请求携带 `finishReading=0` 或 `finishReading=1` 时，应先按阅读完成状态过滤再计算分页总数

## MODIFIED

### Requirement: 默认排序改为最近阅读时间
- **GIVEN** 后端查询 WeRead 书籍
- **WHEN** 未指定排序参数
- **THEN** 默认按 `readUpdateTime` 降序排列
- **AND** 以 `_id` 降序作为二级排序
- **AND** 移除 `shelfIndex` 排序依赖
  - 移除原因: `shelfIndex` 仅记录同步 API 返回的数组下标，不代表用户实际阅读顺序
