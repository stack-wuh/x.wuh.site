---
{
  "schema": "shadow-dev/v1",
  "name": "20260829-feature-guestbook-letter-style",
  "type": "feature",
  "scope": "site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20260829-feature-guestbook-letter-style",
  "files": [
    "apps/site/app/about/components/GuestbookBarrageDialog.tsx",
    "apps/site/app/about/components/guestbook-barrage.styles.ts",
    "apps/site/app/guestbook/GuestbookPageView/index.tsx",
    "apps/site/app/guestbook/GuestbookPageView/styles/index.tsx",
    "package.json",
    "packages/components/message-card",
    "packages/components/package.json",
    "packages/components/scroll-area",
    "packages/components/virtual-scroll",
    "pnpm-lock.yaml",
    "shadow-docs/knowledge/components.md",
    "shadow-docs/knowledge/guestbook-barrage.md",
    "shadow-docs/knowledge/guestbook-virtual-scroll.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 344,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/344",
    "pullRequest": 345,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/345"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "14789276d4f138a12ab050eb2808c2f402095a25",
    "verifiedAt": "2026-08-29T08:28:04.667Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:345",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 留言板信笺风改造（About 弹窗 + 独立页）

## 动机

About 页留言板弹窗的「滚动 + 消息条」设计不好看：7px 酒红渐变滚动条常驻可见、气泡带边框阴影、信息行拥挤、状态文字噪点、输入条悬浮重叠、舞台重阴影。浏览器点选确认痛点（滚动条/气泡/信息行/状态文字/输入条/舞台背景/整体观感）后，从三个方向 mockup 中选定「信笺文艺风」（C）。用户补充：现有虚拟滚动有问题，直接引入 shadcn 的 ScrollArea 替换。

## 引用规范

- `shadow-docs/knowledge/guestbook-barrage.md`
  - 当前结论: 留言板为群聊式消息流（左侧气泡/右侧新留言、头像昵称首字符、状态文字），虚拟滚动 + 主题化滚动条
  - 适用 scope: apps/site/app/about（弹窗）、apps/site/app/guestbook（独立页）、packages/components
  - 本次变更: 视觉结论更新为信笺风，滚动容器换 ScrollArea
- `shadow-docs/knowledge/guestbook-virtual-scroll.md`
  - 当前结论: VirtualScroll 动态行高虚拟化（500 条 DOM ≤ 30）、followOutput、「有新留言 ↓」按钮、7px 主题滚动条
  - 本次变更: 虚拟化约束失效（唯一消费方替换为 ScrollArea 全量渲染），卡片改写为 scroll-area 方案
- `shadow-docs/knowledge/design-system.md`
  - 组件级滚动条样式更 specific 不被全局覆盖；系统级 8px 滚动条为全局结论，本次不动
- shadcn ScrollArea（registry default/ui/scroll-area.tsx，唯一依赖 @radix-ui/react-scroll-area）；shadcn-chat Message 结构参考（avatar + meta 行 + content）

## 决策

- **选型:** 信笺文艺风（奶油信纸底、便笺斜切圆角卡片、纸感阴影、衬线斜体昵称、琥珀时间戳、细淡滚动条 hover 浮现）+ 技术方案 A（沉淀 scroll-area / message 两个通用组件，弹窗与独立页两个消费方接入）+ shadcn ScrollArea 移植替换 VirtualScroll
  - `packages/components/scroll-area`：忠实移植 shadcn ScrollArea，引入其唯一依赖 `@radix-ui/react-scroll-area`；结构照搬 Root→Viewport→ScrollBar(10px 可点区/透明 border/1px padding)→Thumb(圆角胶囊)；信笺风主题化（thumb 中性暖棕 40%，hover 加深带酒红调）；Radix 独立 DOM 渲染滚动条，Firefox/WebKit 行为一致，自带 hover 浮现、键盘访问、触控适配
  - `packages/components/message-card`：MessageCard（纸底、斜切圆角 3px 12px 3px 12px / mine 镜像、轻纸感阴影、mine 酒红浅染变体）、MessageAvatar（圆形纸底 + 酒红 hairline）、MessageMeta（衬线斜体昵称 + 琥珀时间 + 状态位）、MessageContent、MessageStatus；全走主题 token，四主题适配
  - 弹窗: VirtualScroll → ScrollArea 全量渲染；followOutput（距底 50px 阈值）、「有新留言 ↓」按钮逻辑保留在弹窗层；reduced-motion 时 instant；舞台奶油信纸渐变底 + 酒红 hairline 边框去重阴影；输入条去负 margin 悬浮、虚线分隔接在舞台下方；Dialog Header、底部「查看全部」链接、About 入口 trigger 不动
  - 独立页: CommentItem 换 MessageCard 便笺形态，不加头像（列表视图无 mine 区分）；分页/空态/返回链接保留；页面级系统滚动条不动
- **对比方案:**
  - 视觉方向 A 温度版 shadcn / B shadcn 极简: 均被否，用户选定 C 信笺文艺风
  - 技术方案 B 两处私有样式重写: 便笺视觉语言重复维护易漂移，未选
  - 技术方案 C 只沉淀 scroll-area: 消息卡片两处各写各的，视觉语言两份，未选
  - CSS-only 滚动条（无 Radix）: Firefox 无法 hover 浮现，跨浏览器不一致，未选
  - scroll-area 内置 virtual 开关: 当前留言 4 条、API 上限 500，全量渲染无压力；「滚到底跳回顶部」bug 就在 react-virtuoso 封装层（initialTopMostItemIndex 每次渲染重算 + data 引用变化无 computeItemKey），做开关等于把 bug 搬进新组件；增长路径为分页（独立页已有 20 条/页先例），未选
- **理由:** 两个消费方（弹窗聊天流 + 独立页列表）已成立，组件抽象不属过早；shadcn ScrollArea 的实现即 Radix 封装，移植是最忠实路径且解决虚拟滚动问题；数据量当前 4 条，全量渲染 500 条纯 DOM 无压力，数据量大时兜底方案是对话分页（YAGNI 不做）

## 任务

### Phase 1: scroll-area 组件

- [x] workspace 根安装 `@radix-ui/react-scroll-area` — `package.json` — pnpm add
- [x] 新建 `packages/components/scroll-area`（index.tsx + styles + README）— 移植 shadcn 结构并信笺风主题化
- [x] 验证: tsc 通过、组件渲染正常

### Phase 2: message 组件

- [x] 新建 `packages/components/message-card`（MessageCard / MessageAvatar / MessageMeta / MessageContent / MessageStatus + README）
- [x] 四主题（wine/plain × light/dark）样式适配

### Phase 3: 弹窗改造

- [x] `GuestbookBarrageDialog.tsx` — VirtualScroll → ScrollArea；viewport ref 自管滚动、距底 50px 阈值 followOutput、reduced-motion instant
- [x] `guestbook-barrage.styles.ts` — 舞台信纸底、输入条虚线分隔去悬浮、NewMessageBanner 信笺风
- [x] 消息行换用 message 组件（头像/卡片/meta/状态）

### Phase 4: 独立页改造

- [x] `GuestbookPageView` — CommentItem → MessageCard 便笺形态（无头像）

### Phase 5: 清理与知识

- [x] 删除 `packages/components/virtual-scroll`（含测试与 README，执行前弹确认）
- [x] 更新 `guestbook-virtual-scroll.md`（虚拟化失效 → scroll-area 方案）、`guestbook-barrage.md`（信笺风视觉结论）、`components.md`（两新组件）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `guestbook-barrage.md`（视觉结论）、`guestbook-virtual-scroll.md`（约束失效改写）、`components.md`（新增组件）
- **理由:** 留言板呈现方式与滚动方案是长期事实，卡片需同步；待 review 确认
