---
keywords: [微信读书, 书架, 阅读时间排序, readUpdateTime, 在读过滤, finishReading, 分页查询]
---

# 微信读书书架排序

首页微信读书模块展示最近阅读时间前 6 本在读书籍，`finishReading=1` 的已读完书籍不占用首页展示名额。

默认查询按 `readUpdateTime` 降序排列，`_id` 降序作为二级排序。不再依赖 `shelfIndex`（该字段仅记录同步 API 返回的数组下标，不代表用户实际阅读顺序）。

分页接口按最近阅读时间降序返回，`finishReading` 过滤参数需在计算分页总数前先应用。
