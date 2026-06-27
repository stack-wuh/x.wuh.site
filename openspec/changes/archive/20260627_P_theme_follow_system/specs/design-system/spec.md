# Design System

## MODIFIED: 主题系统 v2.1

### Requirement: 双维度主题模型
- **GIVEN** 主题系统支持 ThemeFamily 和 ColorScheme 两个正交维度
- **WHEN** 用户切换主题
- **THEN** data-theme-family 取值为 wine (酒红) 或 plain (素雅)
- **AND** data-color-scheme 自动跟随系统 prefers-color-scheme，取值为 light (明亮) 或 dark (暗黑)
- **AND** Theme = 'wine' | 'plain'，存储于 localStorage key wuh.site.theme
- **AND** 页面加载时通过 matchMedia('(prefers-color-scheme: dark)') 初始化并监听变化
