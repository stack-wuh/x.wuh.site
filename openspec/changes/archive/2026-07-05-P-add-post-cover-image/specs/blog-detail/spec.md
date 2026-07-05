# Spec: 博客详情页封面展示

## ADDED

### Requirement: Detail page shows cover below header metadata
- **GIVEN** 文章详情接口返回 `metadata.cover`
- **WHEN** 用户打开博客详情页
- **THEN** 页面应在标题/作者/摘要区域下方、正文内容上方展示封面图
- **AND** 正文中的原图片内容应保持展示，不应因为作为封面而被移除

### Requirement: Detail page hides unavailable cover image
- **GIVEN** 文章详情接口未返回 `metadata.cover`
- **WHEN** 用户打开博客详情页
- **THEN** 页面不应渲染封面图区域

### Requirement: Detail page hides failed cover image
- **GIVEN** 文章详情接口返回了 `metadata.cover`
- **WHEN** 封面图片加载失败
- **THEN** 页面应隐藏封面图区域
- **AND** 不应显示破图、错误提示或占位图

---

## MODIFIED

### Requirement: 正文字号与行高
- **GIVEN** 用户查看包含封面图的博客详情页
- **WHEN** 页面渲染 Markdown 正文
- **THEN** 正文排版仍应遵守既有字号与行高要求
- **AND** 封面图不应造成正文横向滚动

---

## REMOVED

### Requirement: None
- 本次不移除既有博客详情页排版需求。
