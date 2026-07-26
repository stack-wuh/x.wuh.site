# 博客详情页排版规格

## ADDED

### Requirement: 正文字号与行高

GIVEN 用户在酒红主题下查看博客详情页
WHEN 页面渲染 Markdown 正文
THEN 正文字号应使用 `--font-size-base`（16px）
AND 行高应使用 `--line-height-body`（1.8）

GIVEN 用户在素雅主题下查看博客详情页
WHEN 页面渲染 Markdown 正文
THEN 正文字号应使用 `--font-size-base`（16px）
AND 行高应使用 `--line-height-body`（2.0）

GIVEN 用户查看包含封面图的博客详情页
WHEN 页面渲染 Markdown 正文
THEN 正文排版仍应遵守既有字号与行高要求
AND 封面图不应造成正文横向滚动

### Requirement: 标题层级字号

GIVEN 用户在酒红主题下查看博客详情页
WHEN 页面渲染 h1/h2 标题
THEN 字号应为 `--font-size-2xl`（30px）

GIVEN 用户在素雅主题下查看博客详情页
WHEN 页面渲染 h1/h2 标题
THEN 字号应为 `--font-size-2xl`（27px）

### Requirement: 文字色彩对比度

GIVEN 用户在任意主题（酒红/素雅 × light/dark）组合下查看博客详情页
WHEN 页面渲染正文文字
THEN `--text-primary` 与背景的对比度应 ≥ 4.5:1

GIVEN 用户在任意主题组合下查看博客详情页
WHEN 页面渲染辅助文字（元信息、引用、注释）
THEN `--text-secondary` 与背景的对比度应 ≥ 3:1

### Requirement: 代码块可读性

GIVEN 用户在任意主题组合下查看博客详情页
WHEN 页面渲染代码块
THEN 代码块背景与代码字色的对比度应 ≥ 4.5:1

### Requirement: 素雅 Dark 模式完整性

GIVEN 用户在素雅主题、dark 模式下查看博客详情页
WHEN 页面渲染
THEN 所有 `--normal-*` 和 `--background-*` 变量应有素雅 dark 的专属值
AND 不应继承酒红 dark 的颜色值

### Requirement: Detail page shows cover below header metadata

GIVEN 文章详情接口返回 `metadata.cover`
WHEN 用户打开博客详情页
THEN 页面应在标题/作者/摘要区域下方、正文内容上方展示封面图
AND 正文中的原图片内容应保持展示，不应因为作为封面而被移除

### Requirement: Detail page hides unavailable cover image

GIVEN 文章详情接口未返回 `metadata.cover`
WHEN 用户打开博客详情页
THEN 页面不应渲染封面图区域

### Requirement: Detail page hides failed cover image

GIVEN 文章详情接口返回了 `metadata.cover`
WHEN 封面图片加载失败
THEN 页面应隐藏封面图区域
AND 不应显示破图、错误提示或占位图

### Requirement: 相关文章以阅读余韵索引呈现
- **GIVEN** 博客详情页存在至少一篇相关文章
- **WHEN** 用户阅读完正文卡片
- **THEN** 页面应在正文之后、来源与版权信息之前展示“继续阅读”模块
- **AND** 模块应展示相关文章数量与低对比度装饰分隔线
- **AND** 模块不应使用外层卡片背景、阴影或圆角容器

### Requirement: 索引项提供阅读判断信息
- **GIVEN** 一篇相关文章包含标题、可选摘要和共享标签
- **WHEN** 相关文章索引项渲染
- **THEN** 应展示两位序号、标题、共享标签和非交互箭头
- **AND** 有摘要时摘要最多显示两行
- **AND** 无摘要时不得留下摘要空白区域
- **AND** 共享标签应以低强调文本呈现，不应使用彩色胶囊标签

### Requirement: 索引项可访问且具备克制反馈
- **GIVEN** 用户以鼠标、键盘或触屏访问相关文章索引
- **WHEN** 用户悬停、聚焦或激活某一索引项
- **THEN** 整项应作为单个可点击链接
- **AND** 键盘焦点应具有清晰的 focus-visible 状态
- **AND** hover 只改变标题与箭头的颜色，并使箭头轻微右移
- **AND** 不得使用卡片抬升、阴影或大面积背景变化

### Requirement: 索引在窄屏和减少动态偏好下保持可用
- **GIVEN** 视口宽度不大于 640px 或用户启用减少动态偏好
- **WHEN** 模块渲染或被交互
- **THEN** 文字不应造成横向滚动且单项触达高度不低于 44px
- **AND** 摘要最多显示两行，标签可自然换行
- **AND** 在 prefers-reduced-motion 下不得执行箭头位移动画

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
