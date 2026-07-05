# Spec: 微信读书书架顺序

## ADDED

### Requirement: 微信读书页面保持书架顺序
- **GIVEN** 后端已从 WeRead `/shelf/sync` 同步 `books[]` 书籍列表
- **WHEN** 用户访问 `/weread` 页面并请求任意分页
- **THEN** 页面应按 WeRead `books[]` 原始列表顺序展示书籍
- **AND** 分页切换不应按最近阅读时间重新排序

### Requirement: 首页展示在读前 6 本
- **GIVEN** WeRead 书架中存在至少 6 本 `finishReading=0` 的书籍
- **WHEN** 用户访问首页微信读书模块
- **THEN** 模块应展示 WeRead 书架顺序中前 6 本在读书籍
- **AND** `finishReading=1` 的已读完书籍不应占用首页 6 个展示名额

### Requirement: 同步持久化书架位置
- **GIVEN** WeRead `/shelf/sync` 返回 `books[]` 数组
- **WHEN** 后端执行微信读书同步
- **THEN** 每本书应保存其在 `books[]` 中的顺序位置
- **AND** 后续查询应使用该顺序位置作为默认排序依据

---

## MODIFIED

### Requirement: 微信读书分页查询
- **GIVEN** 客户端请求微信读书书籍分页接口
- **WHEN** 请求携带 `page` 和 `limit`
- **THEN** 接口应在书架顺序基础上分页返回结果
- **AND** 当请求携带 `finishReading=0` 或 `finishReading=1` 时，应先按阅读完成状态过滤再计算分页总数

---

## REMOVED

### Requirement: 按最近阅读时间作为默认书架排序
- 移除原因：最近阅读时间不等同于微信读书“我的书架”顺序，会导致首页和 `/weread` 页面展示与用户书架不一致。
