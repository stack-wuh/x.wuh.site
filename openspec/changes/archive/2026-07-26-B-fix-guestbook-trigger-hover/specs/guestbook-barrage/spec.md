# Spec: 留言板入口交互

## ADDED Requirements

### Requirement: 留言板入口 Hover 保持文字可读

留言板入口的交互状态必须保持纸张风格与文字可读性。

#### Scenario: 用户悬停或聚焦留言板入口
- **GIVEN** 用户在 About 页面看到留言板入口
- **WHEN** 指针悬停在入口上，或入口获得 `focus-visible`
- **THEN** 入口保持浅色纸张基底，并以低强度暖色渐变增强背景层次
- **AND** 标题、预览文案和 CTA 在亮色与暗色主题下保持清晰可读
- **AND** 入口不切换为深色实底，不使用位移、缩放或强阴影反馈

### Requirement: 留言板入口状态同步渐进

留言板入口的背景、边框与文字反馈必须使用一致的过渡节奏。

#### Scenario: 入口状态发生变化
- **GIVEN** 留言板入口正在进入或离开 Hover / `focus-visible` 状态
- **WHEN** 背景、边框和文字状态发生变化
- **THEN** 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡
- **AND** 各视觉元素不会出现不同步跳变
- **AND** 入口的布局和点击区域不会因状态变化发生偏移

### Requirement: 留言板入口尊重减少动态偏好

留言板入口必须在减少动态模式下提供无动画但完整的状态反馈。

#### Scenario: 用户启用减少动态偏好
- **GIVEN** 用户启用了 `prefers-reduced-motion: reduce`
- **WHEN** 留言板入口进入或离开 Hover / `focus-visible` 状态
- **THEN** 入口取消渐进动画并直接呈现目标状态
- **AND** 文字可读性、背景反馈和焦点轮廓仍然保留

## MODIFIED Requirements

### Requirement: About 页面留言板入口

About 页面必须提供视觉一致、可读且可自然进入留言弹窗的入口。

#### Scenario: 用户从 About 页面进入留言板
- **GIVEN** 用户正在浏览 About 页面
- **WHEN** 用户看到或操作“留言板”区块
- **THEN** 系统应展示一个与 About 页面视觉一致且文字清晰可读的留言入口
- **AND** 入口应使用聊天语义的头像、标题、预览文案和进入提示
- **AND** 指针悬停和键盘聚焦状态应使用自然、同步的渐进反馈
- **AND** 用户点击入口后应打开居中的留言弹窗
