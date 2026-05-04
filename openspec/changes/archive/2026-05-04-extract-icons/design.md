# 技术方案: 图标组件库

## 文件结构

```
packages/components/icons/
├── index.tsx        # barrel 统一导出
├── brand.tsx        # 品牌/社交图标 (fill 风格, 9个)
├── ui.tsx           # 通用 UI 交互图标 (17个, 混合 fill/stroke)
├── status.tsx       # 状态/语义图标 (11个, 全 fill)
└── ornament.tsx     # 装饰 SVG 元素 (1个)
```

## 分类原则

| 文件 | 用途 | 风格 |
|------|------|------|
| brand.tsx | 微信/QQ/Twitter/GitHub 等品牌图标 | fill |
| ui.tsx | 工具栏/导航/操作按钮图标 | fill + stroke 共存 |
| status.tsx | 信息/成功/警告/错误/空等状态反馈 | fill (stroke 属性在 SVG 元素上) |
| ornament.tsx | 纯装饰元素 | fill |

## 关键决策

1. **stroke vs fill 共存**: image-preview 的图标用 stroke (线框风格)，其余用 fill。各保持原样。
2. **IconClose 统一**: message 和 image-preview 各有一个 Close，统一为 fill 版本（message 的版本）
3. **IconWarning 统一**: message 的 WarningIcon 和 result 的 AlertTriangleIcon 路径一致，统一为 IconWarning
4. **ToolbarIcon 拆分**: `direction` prop 拆为 IconChevronLeft / IconChevronRight
5. **renderLinkIcon 删除**: ContactCard 中 switch-case 改为 badge→icon 映射对象
6. **DiamondDivider 只抽 polygon**: 外层 styled-component 留在原文件

## 导入约定

```tsx
import { IconWechat, IconGithub, DiamondDivider } from '@wuh.site/components/icons'
```

所有图标从 barrel `index.tsx` 统一导出。
