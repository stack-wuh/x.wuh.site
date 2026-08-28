---
{
  "schema": "shadow-dev/v1",
  "name": "20260829-feature-custom-scrollbar",
  "type": "feature",
  "scope": "site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260829-feature-custom-scrollbar",
  "files": [
    "packages/components/themes/cssVariableProvider.tsx",
    "shadow-docs/knowledge/design-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 338,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/338",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "8b1dbfef65b19bc1866c2eb709e4053830c9ea35",
    "verifiedAt": "2026-08-28T16:27:50.535Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:338",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---
# 系统级自定义滚动条

## 动机

站点目前使用浏览器默认滚动条，在酒红/素雅主题下显得突兀，与站点文艺风格不协调。目标是定义一套系统级滚动条样式，统一各浏览器（Chrome/Edge/Safari/Firefox）的滚动条观感，随主题自适应。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色走语义化 token（--primary-color 等），4 主题组合由 data-theme-family × data-color-scheme 驱动
  - 适用 scope: 全局样式注入点 CssVariableStyles（packages/components/themes/cssVariableProvider.tsx）
- shadow-docs/knowledge/guestbook-virtual-scroll.md
  - 当前结论: 滚动条主题化先例——滑块主题色渐变、轨道低对比、hover 增强、触控设备恢复系统覆盖式
  - 适用 scope: 风格参考；不修改留言板虚拟滚动组件本身

## 决策

- **选型:** 主题色细条（8px 宽，轨道透明，滑块 primary-color 渐变圆角胶囊，hover 加深）
- **对比方案:**
  - 极简中性灰：纯功能向，不引入主题色，与站点「温柔色调」风格关联弱
  - 微光存在感（10px + 呼吸动画）：存在感过强，滚动条是辅助元素不应抢注意力，且动画增加渲染成本
- **理由:** 与留言板滚动条先例风格一致（全站统一视觉语言）；颜色全部走 CSS 变量，4 主题自动适配；触控设备恢复系统覆盖式（pointer: coarse），沿用先例约束

### 浏览器策略

| 浏览器 | 方案 |
|---|---|
| Chrome/Edge 121+ | 标准 `::scrollbar-*` + 旧 `::-webkit-scrollbar-*` 双写 |
| Safari | `::-webkit-scrollbar-*`（仅此途径） |
| Firefox | `scrollbar-width: thin` + `scrollbar-color: var(--primary-color) transparent`（形状不可控，颜色统一） |
| 触控设备 | `@media (pointer: coarse)` 恢复系统覆盖式滚动条 |

## 任务

### Phase 1: 全局样式
- [x] CssVariableStyles 增加全局滚动条样式（WebKit 伪元素 + Firefox 属性 + coarse pointer 豁免）— `packages/components/themes/cssVariableProvider.tsx` — 修改
- [x] 验证：页面主滚动条、容器滚动条（目录/弹窗/代码块）、4 主题切换、酒红/素雅适配 — dev server — 验证
- [x] 回归：留言板虚拟滚动样式不受影响 — `packages/components/virtual-scroll/styles.ts` — 只读检查

### Phase 2: 知识
- [x] design-system.md 补充滚动条规范（尺寸/配色/浏览器策略）— `shadow-docs/knowledge/design-system.md` — 更新

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/design-system.md
- **理由:** 系统级滚动条规范（尺寸/主题色/浏览器策略/触控豁免）是长期有效设计事实
