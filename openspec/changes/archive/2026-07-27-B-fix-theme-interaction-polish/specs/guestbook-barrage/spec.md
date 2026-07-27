# Spec: 留言板入口主题渐变

## MODIFIED Requirements

### Requirement: 留言板入口 Hover 保持文字可读

留言板入口的交互状态必须使用当前站点主题色，并保持纸张风格与文字可读性。

#### Scenario: 用户悬停或聚焦留言板入口
- **GIVEN** 用户在 About 页面看到留言板入口
- **WHEN** 指针悬停在入口上，或入口获得 `focus-visible`
- **THEN** 入口以 `--background-100` 为纸张基底，并以 `--primary-color` 从左向右自然衰减形成单向主题雾化渐变
- **AND** 默认状态与交互状态均直接跟随当前 `data-theme-family` 和 `data-color-scheme`
- **AND** 背景渐变不使用固定 `--accent-color` 作为主色
- **AND** 标题、预览文案和 CTA 在亮色与暗色主题下保持清晰可读
- **AND** 入口不使用位移、缩放或强阴影反馈

### Requirement: 留言板入口状态同步渐进

留言板入口的主题渐变、边框与文字反馈必须使用一致且自然的过渡节奏。

#### Scenario: 入口状态发生变化
- **GIVEN** 留言板入口正在进入或离开 Hover / `focus-visible` 状态
- **WHEN** 主题渐变、边框和文字状态发生变化
- **THEN** 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡
- **AND** Hover / Focus 仅适度增强主题色浓度与衰减范围，不改变渐变方向
- **AND** 左侧强调线、交互边框和 CTA 使用当前 `--primary-color`
- **AND** 各视觉元素不会出现不同步跳变或布局偏移

### Requirement: 留言板入口尊重减少动态偏好

留言板入口必须在主题渐变修复后继续支持减少动态偏好。

#### Scenario: 用户启用减少动态偏好
- **GIVEN** 用户启用了 `prefers-reduced-motion: reduce`
- **WHEN** 留言板入口进入或离开 Hover / `focus-visible` 状态
- **THEN** 入口取消渐进动画并直接呈现目标主题色状态
- **AND** 文字可读性、主题渐变、边框反馈和焦点轮廓仍然保留
