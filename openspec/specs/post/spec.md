# Post — 博客详情

## MODIFIED

### Requirement: PostToolbar 流动阅读线样式
- **GIVEN** 用户成功加载博客详情页
- **WHEN** 页面滚动到底部
- **THEN** 显示不对称布局导航（prev 全宽，next 右对齐）
- **AND** 显示文章位置「第 X / Y 篇」
- **AND** 显示「所有博客」返回入口
- **AND** 移动端隐藏「所有博客」按钮

## ADDED

### Requirement: 发布后博客详情页正常展示
- **GIVEN** 文章存在且详情 API 返回成功
- **WHEN** 用户访问数字或带标题 slug 的文章详情 URL
- **THEN** 页面展示文章标题、作者信息和正文内容
- **AND** 不进入详情 500 错误边界

### Requirement: 详情页回归必须捕获真实异常
- **GIVEN** 博客详情页在发布后进入 500 错误边界
- **WHEN** 开发者修复该回归
- **THEN** 必须先通过自动化测试或可重复 smoke test 捕获相同异常
- **AND** 修复范围由错误堆栈确定

### Requirement: Markdown 正文具有可靠 fallback
- **GIVEN** 详情 API 返回非空 `body` 且 `bodyHtml` 为空
- **WHEN** Next 详情页面准备 PostView 数据
- **THEN** 使用统一服务端 Markdown renderer 生成非空 HTML
- **AND** PostView 不静默渲染空正文

### Requirement: 详情路由兼容标题 slug
- **GIVEN** 详情 URL 包含文章编号和编码后的中文标题
- **WHEN** Next 路由解析参数
- **THEN** 使用首段数字查询文章
- **AND** 编码字符不导致 500

### Requirement: 发布流程验证真实文章详情
- **GIVEN** 博客详情修复已部署
- **WHEN** 发布后 smoke test 请求真实文章 URL
- **THEN** 页面不包含详情 500 文案
- **AND** 正文容器包含文章内容
