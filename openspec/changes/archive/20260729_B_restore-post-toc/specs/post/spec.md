# Spec: 博客详情页目录

## ADDED Requirements

### Requirement: Markdown 标题生成目录锚点

服务端 MUST 优先使用统一 Markdown renderer 处理非空 `body`，并为 `h1`、`h2`、`h3` 标题生成稳定的 `id` 与可用于目录跳转的锚点。

#### Scenario: Markdown 标题生成可跳转锚点
- **GIVEN** 文章 `body` 包含 `h2` 标题且 `body_html` 缺少该标题的 `id`
- **WHEN** 服务端准备详情页正文 HTML
- **THEN** 使用 Markdown renderer 生成包含标题 `id` 的 HTML
- **AND** 目录链接可以定位到对应标题

### Requirement: 详情页展示文章目录

博客详情页 MUST 在正文包含带文本和 `id` 的 `h1`、`h2` 或 `h3` 时展示文章目录，且桌面端与移动端目录 MUST 使用正文中的对应标题锚点。

#### Scenario: 桌面端展示文章目录
- **GIVEN** 正文包含至少一个带文本和 `id` 的支持层级标题
- **WHEN** 用户在桌面端访问博客详情页
- **THEN** 页面展示桌面文章目录
- **AND** 目录项链接指向正文中的对应标题

#### Scenario: 移动端展示文章目录
- **GIVEN** 正文包含至少一个带文本和 `id` 的支持层级标题
- **WHEN** 用户在移动端访问博客详情页
- **THEN** 页面展示移动端文章目录入口
- **AND** 目录项链接指向正文中的对应标题

### Requirement: 正文 HTML 兼容回退

服务端 MUST 在 Markdown `body` 为空且 `body_html` 非空时使用有效的 `body_html` 作为回退，且 MUST NOT 因目录修复导致正文无法展示。

#### Scenario: body 缺失时回退到 body_html
- **GIVEN** 文章 `body` 为空且 `body_html` 包含正文
- **WHEN** 服务端准备详情页正文 HTML
- **THEN** 使用 `body_html` 作为详情页正文
- **AND** 详情页仍可展示已有正文

## MODIFIED Requirements

### Requirement: Markdown 正文具有可靠 fallback

详情页准备 `PostView` 数据时 MUST 在 `body` 非空且 `bodyHtml` 为空或缺少标题锚点时使用统一服务端 Markdown renderer 生成非空 HTML；标题 `h1`、`h2`、`h3` MUST 生成可用于目录跳转的 `id`，且 PostView MUST NOT 静默渲染空正文。

#### Scenario: body 优先于缺少锚点的 bodyHtml
- **GIVEN** 详情 API 同时返回非空 `body` 和缺少标题锚点的 `bodyHtml`
- **WHEN** Next 详情页面准备 `PostView` 数据
- **THEN** 优先根据 `body` 生成正文 HTML
- **AND** 生成的标题包含可用于目录跳转的 `id`

#### Scenario: 无可渲染正文时报告错误
- **GIVEN** 详情 API 的 `body` 和 `body_html` 均为空
- **WHEN** Next 详情页面准备 `PostView` 数据
- **THEN** 以明确错误终止正文准备
- **AND** 不静默将正文归一化为空字符串
