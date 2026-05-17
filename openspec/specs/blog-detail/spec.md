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
