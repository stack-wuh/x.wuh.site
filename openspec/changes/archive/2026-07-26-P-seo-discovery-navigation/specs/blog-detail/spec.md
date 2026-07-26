---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
---

# Spec: 博客详情页

## ADDED

### Requirement: 相关文章基于标签与时间排序、去重且最多三篇
- **GIVEN** 当前文章最多三个非空标签
- **WHEN** 获取相关文章候选
- **THEN** 每个标签并发请求最多 10 篇候选文章
- **AND** `selectRelatedPosts` 排除当前文章编号并按共享标签数降序、更新时间降序、编号升序排序
- **AND** 同一编号仅保留第一条，总数不超过 3 篇
- **AND** 无标签或全部请求失败时返回空数组

### Requirement: 文章标签链接指向站内主题页
- **GIVEN** 文章详情页渲染标签
- **WHEN** 生成标签链接
- **THEN** 使用 `buildTopicUrl(label.name)` 生成 `/topics/<encoded>` 站内链接
- **AND** 不再构造 GitHub Issue label query URL

### Requirement: Alert 区分站内外链接的打开行为
- **GIVEN** Alert 组件渲染带链接的内容
- **WHEN** 链接 href 是外部域名
- **THEN** 设置 `target="_blank"` 与 `rel="noopener noreferrer"`
- **WHEN** 链接 href 是站内路径
- **THEN** 不设置 `target="_blank"`，保持同窗口导航
