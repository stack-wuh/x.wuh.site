---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
  - '^- \*\*WHEN\*\* .+'
  - '^- \*\*THEN\*\* .+'
---

# Spec: 博客详情页封面图

## ADDED

### Requirement: Issue 隐藏封面元数据
- **GIVEN** 博客内容来自 GitHub Issue，作者在正文中放入包含 `cover` 的 HTML 注释元数据
- **WHEN** 后端同步该 Issue
- **THEN** 系统将 URL 保存为 `metadata.cover`
- **AND** 该注释不作为 GitHub Issue 或博客正文中的可见文章内容展示
- **AND** 作者可选提供 `coverAlt` 作为封面图片的替代文本

### Requirement: 显式封面与正文图片独立
- **GIVEN** 一篇文章已通过隐藏元数据声明 `metadata.cover`
- **WHEN** 客户端获取文章详情
- **THEN** 详情响应和 SEO 元数据使用显式封面
- **AND** 正文中的第一张图片保持为文章内容，不因封面展示而被移除

### Requirement: 移动端封面开场
- **GIVEN** 文章具有可用封面且视口宽度小于 768px
- **WHEN** 用户打开文章详情页
- **THEN** 封面位于文章标题、作者和正文之前，并铺满页面内容区的横向宽度
- **AND** 封面高度受最小值、响应式值与最大值共同限制，不因原图比例挤占过多首屏空间

### Requirement: 封面动效可访问性
- **GIVEN** 文章封面首次呈现
- **WHEN** 用户未启用减少动态效果偏好
- **THEN** 封面以短暂的淡入和极轻微缩放稳定动效出现
- **AND** 动效不自动循环，不改变内容位置
- **AND** 当用户启用 `prefers-reduced-motion: reduce` 时不播放该动效

---

## MODIFIED

### Requirement: 文章详情封面回退与去重
- **GIVEN** 一篇历史文章未声明 `metadata.cover`，但正文存在可提取的第一张图片
- **WHEN** 客户端获取文章详情
- **THEN** 系统将第一张图片作为回退封面返回
- **AND** 仅在该回退场景从博客详情正文中移除这张图片，避免与封面重复展示
- **AND** 当正文没有图片时，文章仍可正常渲染且不保留空封面区域

### Requirement: 桌面端阅读栏封面
- **GIVEN** 文章具有可用封面且视口宽度不小于 768px
- **WHEN** 用户打开文章详情页
- **THEN** 封面保持在主阅读栏内，不跨越目录栏
- **AND** 封面使用固定横向展示区域与高度上限，避免图片原始比例扩大页面开场

---

## REMOVED

### Requirement: <需求名称>
- <移除原因>
