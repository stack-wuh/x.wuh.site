# Blog Display

## MODIFIED

### Requirement: 首页/列表页时间格式
- **GIVEN** 首页或博客列表页展示文章列表
- **WHEN** 页面渲染
- **THEN** 日期格式为 MM-dd
- **AND** 展示浏览量代替评论数

### Requirement: 详情页时间格式
- **GIVEN** 博客详情页
- **WHEN** 页面渲染
- **THEN** 发布时间在 1 天内显示 "X小时前发布"
- **AND** 1 周内显示 "X天前发布"
- **AND** 1 月内显示 "MM月dd日"
- **AND** 超过 1 月显示 "YYYY年MM月dd日"
- **AND** 展示浏览量代替评论数
