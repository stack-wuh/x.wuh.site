---
{
  "schema": "shadow-dev/v1",
  "name": "20261007-refactor-responsive-layout-batch6",
  "type": "refactor",
  "scope": "apps/site/app/components/SiteHeader",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "refactor/20261007-refactor-responsive-layout-batch6",
  "files": [
    "apps/site/app/components/SiteHeader/styles/index.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 518,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/518",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "a81aa9f44be05d01c6d32eeaf587c12b825ae668",
    "verifiedAt": "2026-10-07T08:34:39.314Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:518",
    "planHash": "08b31d13f0bfbfdbf5529fe7557662e052afcbf41d7efdf572749560d6ccd9b2",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 响应式布局批次6：SiteHeader 净位——4 处尺寸媒体块收编断点阶梯（+MobilePanel ⑩族注记）",
      "titleRaw": "[refactor] 响应式布局批次6：SiteHeader 净位——4 处尺寸媒体块收编断点阶梯（+MobilePanel ⑩族注记）",
      "supplement": "apps/site/app/components/SiteHeader/styles/index.ts 显隐净位收尾批：Nav/MobileToggle/AppearanceRoot display md 槽 + HeaderRoot --header-fs lg 槽；MobilePanel（transient 驱动 display）保留注记。详见 brief",
      "body": "## 动机\n全站断点阶梯迁移程序（批次1-5 已清 blog/home/guestbook/post/music）收尾到站点头部。`apps/site/app/components/SiteHeader/styles/index.ts` 现存 11 处 `@media` = 5 处尺寸块（4×`min-width:641` 显隐 + 1×`min-width:1024` 字号变量）+ 6 处 `prefers-reduced-motion`（永久范围外）。显隐净位是全程序最低风险形态（批次5 PlayingSlot/Watermark 同款），做完头部尺寸媒体块仅剩 MobilePanel 一处条件媒体注记。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 编译口 `responsive(value, decl)` 四档槽；显隐迁移词汇 `display:none@≤X → [true,,false]`（本批载体非 Flex，走机制 B 串）；备忘⑪「整段/单声明打包为槽→CSS 串」；备忘⑩「transient 驱动声明不进两档槽」；备忘⑭「选择器级条件组保留注记」。\n  - 适用 scope: apps/site/app/components/SiteHeader/styles\n- shadow-docs/knowledge/site-navigation.md\n  - 当前结论: NavLink/MobileItem 已是 `styled(Link)` 软导航形态——本批只动 display 声明，不触碰锚点结构与 aria 语义（active 态样式不受影响）。\n  - 适用 scope: apps/site/app/components/SiteHeader\n- 文件头注释纪律: 「断点只用 BREAKPOINTS 语义常量」——迁移后仍由 `responsive`/`RESPONSIVE_LADDER` 持有，纪律不回退。\n\n## 决策\n- **选型:** 方案 A——纯机制 B：4 处尺寸块收编 `responsive` 两档/四档槽，MobilePanel 保留手写 + 注记\n  - HeaderRoot `--header-fs: 13px` + `@media(min-width:1024)` → `responsive(['13px', undefined, undefined, 'var(--font-size-base)'], v => \\`--header-fs: ${v};\\`)`（lg 档，稀疏槽补位；注释「分档变化由 --header-fs 单点承担」语义不损）\n  - Nav `display:none` + `@media(min-width:641){flex}` → `responsive(['none', undefined, 'flex'])`\n  - MobileToggle 静态 `display:inline-flex` + `@media(min-width:641){none}` → `responsive(['inline-flex', undefined, 'none'])`\n  - AppearanceRoot `display:none` + `@media(min-width:641){block}` → `responsive(['none', undefined, 'block'])`\n  - MobilePanel（`display` 由 transient `$open` 驱动 block/none + `@media(min-width:641){display:none}` 强制桌面隐）：**备忘⑩ 族**——base 槽吃不到实例 transient，保留手写并注记根因。\n- **对比方案:** 方案 B（把 Nav/AppearanceRoot 等 Flex-ify 用 `hidden` prop）：载体 nav/带 relative 定位的 div 与 styled.button，换基座或改渲染元素语义（软导航卡与可访问性依赖 nav 元素），且显隐互斥成对（Nav↔MobileToggle）用 hidden prop 反而拆散两处语义——机制 B 串就地改声明最小。否决。\n- **理由:** 批次5 已证同载体同声明形态走编译口零视差（PlayingSlot/RailCount 系列）；本批无嵌套组、无回退 tie（display 单声明桌面唯一值），落位设计全部落在既有备忘射程内。\n\n## 任务\n### Phase 1 — 4 块收编 — `apps/site/app/components/SiteHeader/styles/index.ts`\n\n- [ ] 1.1 HeaderRoot `--header-fs` lg 档槽（:37）+ import `responsive`（BREAKPOINTS 保留——MobilePanel 仍用）\n- [ ] 1.2 Nav（:75）/ MobileToggle（:171）/ AppearanceRoot（:189）三处 display md 档槽收编，原静态 display 声明并入槽\n- [ ] 1.3 MobilePanel（:460）保留手写 + ⑩ 族注记（transient 驱动 display、断点仅桌面强制隐）\n\n### Phase 2 — 验证收口（S 档）\n\n- [ ] 2.1 逐块「旧静态+媒体」vs「新槽」声明等价走查；`grep '@media' styles/index.ts` 尺寸块仅剩 MobilePanel 1 + reduced-motion 6；裸断点扫描\n- [ ] 2.2 oxlint 该文件 0/0；布局族守卫 40 例回归网跑绿（防编译口误用）；导出组件名/props 零变化走查（index.tsx 消费端不须动）\n\n## 补充\napps/site/app/components/SiteHeader/styles/index.ts 显隐净位收尾批：Nav/MobileToggle/AppearanceRoot display md 槽 + HeaderRoot --header-fs lg 槽；MobilePanel（transient 驱动 display）保留注记。详见 brief\n\n完整 brief：shadow-docs/changes/20261007-refactor-responsive-layout-batch6/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261007-refactor-responsive-layout-batch6\",\"type\":\"refactor\",\"scope\":\"apps/site/app/components/SiteHeader\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261007-refactor-responsive-layout-batch6/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/components/SiteHeader/styles/index.ts",
        "shadow-docs/changes/20261007-refactor-responsive-layout-batch6/",
        "shadow-docs/signals.md"
      ],
      "message": "refactor(SiteHeader): 静默条 4 处尺寸媒体块收编断点阶梯——--header-fs lg 槽 + 三处显隐 md 槽，MobilePanel ⑩族注记保留 (#518)",
      "title": "[refactor] 响应式布局批次6：SiteHeader 净位——4 处尺寸媒体块收编断点阶梯（+MobilePanel ⑩族注记）",
      "body": "Closes #518\n\n完整 brief：shadow-docs/changes/20261007-refactor-responsive-layout-batch6/brief.md"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "4 处收编全部落在既有备忘 ⑩⑪⑭ 射程：显隐 md 槽同批次5 PlayingSlot 形态；--header-fs 自定义属性进阶梯槽只是声明名不同（⑪ 已覆盖「槽值→CSS 串」），无新契约事实；MobilePanel 为备忘⑩ 直接命中案例；卡片 verified-scope 已累计五批，重复消费不再扩账"
  }
}
---

# 响应式布局批次6：SiteHeader 静默条净位——4 处尺寸媒体块收编断点阶梯（+1 处 ⑩ 族注记保留）

## 动机

全站断点阶梯迁移程序（批次1-5 已清 blog/home/guestbook/post/music）收尾到站点头部。`apps/site/app/components/SiteHeader/styles/index.ts` 现存 11 处 `@media` = 5 处尺寸块（4×`min-width:641` 显隐 + 1×`min-width:1024` 字号变量）+ 6 处 `prefers-reduced-motion`（永久范围外）。显隐净位是全程序最低风险形态（批次5 PlayingSlot/Watermark 同款），做完头部尺寸媒体块仅剩 MobilePanel 一处条件媒体注记。

## 复杂度评级

- **评级:** S
- **理由:** 契约变更=零（纯站点侧消费，props/类型面不动）；触及面=单文件 4 块收编 + 1 注记；可发现性=高——显隐切换语义单一（移动端汉堡/桌面导航互斥、外观入口仅桌面、字号 lg 档），声明等价走查即可证明零视差。
- **期望验证深度:** code-read + diff 逐块走查（S 档不跑全量 site tsc 位集——CSS 串改动不入类型面，加 oxlint + 布局族守卫 40 例回归网即可；S 过度测试同样要避免）

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 编译口 `responsive(value, decl)` 四档槽；显隐迁移词汇 `display:none@≤X → [true,,false]`（本批载体非 Flex，走机制 B 串）；备忘⑪「整段/单声明打包为槽→CSS 串」；备忘⑩「transient 驱动声明不进两档槽」；备忘⑭「选择器级条件组保留注记」。
  - 适用 scope: apps/site/app/components/SiteHeader/styles
- shadow-docs/knowledge/site-navigation.md
  - 当前结论: NavLink/MobileItem 已是 `styled(Link)` 软导航形态——本批只动 display 声明，不触碰锚点结构与 aria 语义（active 态样式不受影响）。
  - 适用 scope: apps/site/app/components/SiteHeader
- 文件头注释纪律: 「断点只用 BREAKPOINTS 语义常量」——迁移后仍由 `responsive`/`RESPONSIVE_LADDER` 持有，纪律不回退。

## 决策

- **选型:** 方案 A——纯机制 B：4 处尺寸块收编 `responsive` 两档/四档槽，MobilePanel 保留手写 + 注记
  - HeaderRoot `--header-fs: 13px` + `@media(min-width:1024)` → `responsive(['13px', undefined, undefined, 'var(--font-size-base)'], v => \`--header-fs: ${v};\`)`（lg 档，稀疏槽补位；注释「分档变化由 --header-fs 单点承担」语义不损）
  - Nav `display:none` + `@media(min-width:641){flex}` → `responsive(['none', undefined, 'flex'])`
  - MobileToggle 静态 `display:inline-flex` + `@media(min-width:641){none}` → `responsive(['inline-flex', undefined, 'none'])`
  - AppearanceRoot `display:none` + `@media(min-width:641){block}` → `responsive(['none', undefined, 'block'])`
  - MobilePanel（`display` 由 transient `$open` 驱动 block/none + `@media(min-width:641){display:none}` 强制桌面隐）：**备忘⑩ 族**——base 槽吃不到实例 transient，保留手写并注记根因。
- **对比方案:** 方案 B（把 Nav/AppearanceRoot 等 Flex-ify 用 `hidden` prop）：载体 nav/带 relative 定位的 div 与 styled.button，换基座或改渲染元素语义（软导航卡与可访问性依赖 nav 元素），且显隐互斥成对（Nav↔MobileToggle）用 hidden prop 反而拆散两处语义——机制 B 串就地改声明最小。否决。
- **理由:** 批次5 已证同载体同声明形态走编译口零视差（PlayingSlot/RailCount 系列）；本批无嵌套组、无回退 tie（display 单声明桌面唯一值），落位设计全部落在既有备忘射程内。

## 任务

### Phase 1 — 4 块收编 — `apps/site/app/components/SiteHeader/styles/index.ts`

- [x] 1.1 HeaderRoot `--header-fs` lg 档槽（:37）+ import `responsive`（BREAKPOINTS 保留——MobilePanel 仍用）
- [x] 1.2 Nav（:75）/ MobileToggle（:171）/ AppearanceRoot（:189）三处 display md 档槽收编，原静态 display 声明并入槽
- [x] 1.3 MobilePanel（:460）保留手写 + ⑩ 族注记（transient 驱动 display、断点仅桌面强制隐）

### Phase 2 — 验证收口（S 档）

- [x] 2.1 逐块「旧静态+媒体」vs「新槽」声明等价走查；`grep '@media' styles/index.ts` 尺寸块仅剩 MobilePanel 1 + reduced-motion 6；裸断点扫描
- [x] 2.2 oxlint 该文件 0/0；布局族守卫 40 例回归网跑绿（防编译口误用）；导出组件名/props 零变化走查（index.tsx 消费端不须动）

## 结果
- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无（若 review 认为「CSS 自定义属性也可进阶梯槽」值得单独点名，可在 layout-components.md 备忘⑪ 追加半句——现⑪已覆盖「整段档位声明→CSS 串」）
- **理由:** 全部技法在 ⑩⑪⑭ 射程内；本批是既有契约的低风险重复消费。music-player.md/site-navigation.md 不受影响。

### 范围外（留注记）

- MobilePanel 条件媒体（⑩ 族，本批注记）
- 6 处 `prefers-reduced-motion`（永久保留）
- guestbook 几何 3 处、barrage 二维、post 保留块（重设计/⑭ 族题，另立专项）
