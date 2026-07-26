# 设计文档

## 架构

本变更仅调整 About 页面留言板入口相关 styled-components，不改变 `GuestbookBarrageDialog` 的组件结构、状态或数据流。入口容器负责纸张基底、暖色渐变和边框状态，标题、预览文字与 CTA 分别使用现有语义颜色令牌，并共享统一过渡时长。

```text
GuestbookBarrageDialog
└── GuestbookTrigger
    ├── GuestbookTriggerAvatars（保持不变）
    ├── GuestbookTriggerCopy
    │   ├── GuestbookTriggerLabel
    │   ├── GuestbookTriggerTitle
    │   └── GuestbookTriggerPreview
    └── GuestbookTriggerCta
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Hover 视觉 | 纸张轻染 | 保留 About 页层级，仅增强暖色渐变，不以深底抢占注意力 |
| 颜色来源 | 现有 CSS 语义令牌与 `color-mix()` | 自动适配主题，避免硬编码造成新的对比问题 |
| 动画节奏 | `220ms ease` | 足以感知渐进变化，又不会拖慢入口响应 |
| 动画范围 | 背景、边框、标题、预览文字、CTA | 所有视觉反馈同步，消除当前割裂感 |
| 键盘状态 | `:focus-visible` 提供等价状态 | 保证键盘用户获得与 Hover 一致的入口反馈 |
| 减少动态 | `prefers-reduced-motion: reduce` 下禁用过渡 | 保留最终视觉状态，不强制播放动画 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### GuestbookTrigger

默认状态继续使用浅色纸张基底和低浓度暖色渐变。Hover 或 `focus-visible` 时，仅适度提高暖色渐变浓度与覆盖范围，并轻微增强边框；不切换为深色实底，不使用位移、缩放或强阴影。

背景和边框使用 `220ms ease`。为避免复合 `background` 在不同浏览器中出现跳变，可优先通过伪元素承载 Hover 渐变并过渡其透明度；纸张底色保持稳定。

### GuestbookTriggerTitle / Preview / Cta

三个文本层级使用现有语义文字令牌，在 Hover / Focus 状态下切换到经过验证的高对比语义色。它们与容器共享 `220ms ease` 的颜色过渡，避免背景先变、文字后变或瞬间跳色。

`GuestbookTriggerLabel` 已使用强调色，可保持不变；头像、布局、文案和图标尺寸不调整。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| > 520px | 保持三列入口布局，Hover 与键盘 Focus 使用纸张轻染反馈 |
| <= 520px | 保持现有两列布局；支持悬停的设备使用同一反馈，触摸点击行为不变 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** DOM 结构、按钮语义、文案、点击行为及弹窗逻辑保持不变
- **性能影响:** 仅增加少量 CSS 状态与透明度/颜色过渡，影响可忽略
