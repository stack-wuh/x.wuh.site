# Message Theme

## MODIFIED

### Requirement: Toast 主题色跟随
- **GIVEN** 用户切换酒红/素雅主题 或 亮暗模式
- **WHEN** Toast 提示框弹出
- **THEN** 背景色使用 `var(--background-color)` 主题令牌
- **AND** 文字色使用 `var(--text-color)` 主题令牌
- **AND** 边框色使用 `color-mix(in srgb, var(--text-color) 12%, transparent)`
- **AND** 暗黑模式下阴影更深，对比度更高
