# Spec: 博客详情页可用性

## ADDED Requirements

### Requirement: 发布后博客详情页正常展示

系统 SHALL 在详情 API 成功时渲染可阅读的文章详情，而不是进入错误边界。

#### Scenario: 访问存在的文章详情
- **GIVEN** 文章编号 165 存在且详情 API 返回成功
- **WHEN** 用户访问 `/post/165-再读《坐忘歌》`
- **THEN** 页面展示文章标题、作者信息和正文内容
- **AND** 不展示 `500`、`文章加载失败` 或详情错误边界
- **AND** 浏览器水合后无未捕获运行时异常

### Requirement: 详情页回归必须捕获真实异常

系统 SHALL 通过可重复证据定位详情页发布回归，修复范围必须由实际异常决定。

#### Scenario: 修复发布后的 500 回归
- **GIVEN** 博客详情页在某次发布后进入 500 错误边界
- **WHEN** 开发者修复该回归
- **THEN** 必须先通过自动化测试或可重复 smoke test 捕获相同异常
- **AND** 修复范围由错误堆栈确定
- **AND** 不因时间相关性直接回滚无关模块

### Requirement: Markdown 正文具有可靠 fallback

系统 SHALL 在持久化 HTML 缺失时从非空 Markdown 正文生成可渲染 HTML。

#### Scenario: API 未持久化正文 HTML
- **GIVEN** 详情 API 返回非空 `body` 且 `bodyHtml` 为 `null` 或空字符串
- **WHEN** Next 详情页面准备 PostView 数据
- **THEN** 使用统一服务端 Markdown renderer 生成非空 HTML
- **AND** PostView 不静默渲染空文章正文
- **AND** 已有非空 `body_html` 时优先复用，不重复转换

### Requirement: 详情路由兼容标题 slug

系统 SHALL 从带标题 slug 的详情路径中可靠提取文章编号。

#### Scenario: 访问编码后的中文标题 URL
- **GIVEN** 详情 URL 同时包含文章编号和编码后的中文标题 slug
- **WHEN** Next 路由解析参数
- **THEN** 使用首段数字查询文章 165
- **AND** URL 编码字符不导致 500 或错误查询

### Requirement: 发布流程验证真实文章详情

系统 SHALL 在修复部署后使用真实文章 URL 验证详情页内容可用性。

#### Scenario: 部署后执行线上 smoke test
- **GIVEN** 博客详情修复已部署到生产环境
- **WHEN** 发布后 smoke test 请求文章 165 的带 slug URL
- **THEN** 最终页面不包含详情 500 文案
- **AND** `.markdown-body` 包含该文章正文文本
- **AND** 详情接口和页面网络请求均无失败响应

## MODIFIED Requirements

### Requirement: PostToolbar 流动阅读线样式

系统 SHALL 仅在文章详情成功加载后展示与当前位置一致的底部阅读导航。

#### Scenario: 成功阅读文章并滚动到底部
- **GIVEN** 用户成功加载博客详情页
- **WHEN** 页面滚动到底部
- **THEN** 显示不对称布局导航（prev 全宽，next 右对齐）
- **AND** 显示文章位置「第 X / Y 篇」
- **AND** 显示「所有博客」返回入口
- **AND** 移动端隐藏「所有博客」按钮
