---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-refactor-responsive-layout-batch2",
  "type": "refactor",
  "scope": "apps/site,packages/components/themes",
  "status": "archived",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/site/app/about/styles.ts",
    "apps/site/app/blog/styles/index.ts",
    "packages/components/themes/index.ts",
    "packages/components/themes/spacing.test.mjs",
    "packages/components/themes/spacing.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 504,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/504",
    "pullRequest": 506,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/506"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "6b79fa418abebd045832cfa194dc48b6ab97eabe",
    "verifiedAt": "2026-10-07T01:15:05.926Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:506",
    "planHash": "fc7c7587664249c0826f1ab8e6e47a0d4c20aa58b74d0c67ca8be7d413829b2f",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 站点响应式替换批·2：blog 标签/元信息换行占满 + about 时间轴显隐",
      "titleRaw": "站点响应式替换批·2：blog 标签/元信息换行占满 + about 时间轴显隐",
      "supplement": "消费 #503 的 Flex hidden/width 阶梯，迁移批次1 遗留的 #5 PostTags/#6 PostMeta（width:100%+非对称 margin 换行占满）与 #7 TimelineTrack（display:none@767 收编到 641）。附带把 getSpacingValue 抽为纯函数并落实 CSS 简写透传（兑现卡承诺、零现有回归）。站点 tsc 计数持平 31、布局域 tsc 0 错。详见 brief。",
      "body": "## 动机\n批次1 遗留 #5（PostTags `width:100%+margin-left` 换行占满）、#6（PostMeta margin-left 缩进）、#7（TimelineTrack `display:none@767` 响应式显隐）——前批因阶梯缺「显隐/换行占满/非对称 margin」原语暂缓。#503 已交付 Flex 的 `hidden` 与响应式 `width/height`；本批消费它们，并补一处兑现 layout-components 卡「非对称盒式简写走 CSS 字符串」承诺的 `getSpacingValue` 透传缺口（现实现会把 `0 0 0 calc(…)` 拼成 `…px`）。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: `width` 阶梯 + `hidden` 阶梯用法；「非对称盒式简写走 CSS 字符串值」——本批把该承诺在 getSpacingValue 落实\n  - 适用 scope: themes, apps/site/app/{blog,about}\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: `--space-*` token 引用；间距响应优先 clamp\n  - 适用 scope: blog/about styles\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 站点必须 `cd apps/site && tsc`、存量约数十错，改动前后计数持平以证零新增\n  - 适用 scope: 验证\n- norms/ui-patterns.md\n  - 当前结论: 只替换布局类；显隐/换行属布局类\n  - 适用 scope: 判定\n\n## 决策\n- **选型:**\n  1. **`getSpacingValue` 抽纯函数到 `themes/spacing.ts`**（`import type Tokens`，隔离 `@ant-design/colors` 依赖、可 node --test 单测），`themes/index.ts` 改为再导出（flex/row import 路径不变）。新增透传：字符串含空格或括号（多值简写 / calc/var/env）或尺寸关键字（auto/fit-content/…）→ 原样返回；未知裸标识符仍 px 兜底（保留原行为）。\n  2. **#5 PostTags** → `styled(Flex)`：`gap=4`、`width=['100%','auto']`、`margin=['0 0 0 calc(6px + var(--space-sm))','0']`（窄屏整行+缩进、sm+ 复位）；`flex-shrink:0` 留 css（它是 PostRow 子项自身属性，非子选择器）。\n  3. **#6 PostMeta** → 同上 margin 阶梯；font-size/color 非布局留 css。\n  4. **#7 TimelineTrack** → `styled(Flex).attrs({ hidden:[true,undefined,false] })`：基线+sm 隐藏、md(≥641) 复显——767 野断点按前批裁决收编到 641（641~767 带时间轴由隐藏转显示，属已授权收敛）。\n- **对比:** 直接用 `margin-left` 具名单边 → Flex 无该 prop 且顶层数组=槽位语义，改用四值简写 `0 0 0 calc(…)` 更契合契约「盒式简写走 CSS 字符串」；不选在组件加 `marginLeft` 单值 prop（扩大 API 面、YAGNI）。#7 不用容器查询/新原语，复用 #503 的 `hidden`。\n- **理由:** getSpacingValue 抽纯函数是它此前不可单测的根因修复（顺带满足卡承诺）；三处迁移均离散布局切换，正合阶梯槽；`flexShrink` 语义坑（编译进 `&> *`）已在实现注释标注规避。\n\n## 任务\n### Phase 1 — 间距纯函数与透传\n- [ ] 抽 getSpacingValue 纯函数 + 透传 — `packages/components/themes/spacing.ts` `packages/components/themes/index.ts`\n- [ ] 纯函数单测 — `packages/components/themes/spacing.test.mjs` — number/token/单位串既有语义 + 简写/calc/关键字透传 + 裸标识符 px 兜底\n### Phase 2 — 站点迁移\n- [ ] PostTags/PostMeta 迁 Flex — `apps/site/app/blog/styles/index.ts` — width/margin 阶梯，删两处 `@media(max-width:520)`\n- [ ] TimelineTrack 迁 Flex hidden — `apps/site/app/about/styles.ts` — `hidden=[true,,false]`，删 `@media(max-width:767)`\n### Phase 3 — 验证\n- [ ] 域 tsc + 站点 tsc 计数持平 + 域守卫 + oxlint；grep 确认 blog/about 仅剩 reduced-motion/非布局 @media\n\n## 补充\n消费 #503 的 Flex hidden/width 阶梯，迁移批次1 遗留的 #5 PostTags/#6 PostMeta（width:100%+非对称 margin 换行占满）与 #7 TimelineTrack（display:none@767 收编到 641）。附带把 getSpacingValue 抽为纯函数并落实 CSS 简写透传（兑现卡承诺、零现有回归）。站点 tsc 计数持平 31、布局域 tsc 0 错。详见 brief。\n\n完整 brief：shadow-docs/changes/20261006-refactor-responsive-layout-batch2/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-refactor-responsive-layout-batch2\",\"type\":\"refactor\",\"scope\":\"apps/site,packages/components/themes\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-refactor-responsive-layout-batch2/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/about/styles.ts",
        "apps/site/app/blog/styles/index.ts",
        "packages/components/themes/index.ts",
        "packages/components/themes/spacing.test.mjs",
        "packages/components/themes/spacing.ts",
        "shadow-docs/changes/20261006-refactor-responsive-layout-batch2/brief.md",
        "shadow-docs/knowledge/layout-components.md"
      ],
      "message": "refactor(site): 站点响应式替换批·2 blog换行占满+about时间轴显隐 (#504)",
      "title": "[refactor] 站点响应式替换批·2：blog 标签/元信息换行占满 + about 时间轴显隐",
      "body": "Closes #504\n\n完整 brief：shadow-docs/changes/20261006-refactor-responsive-layout-batch2/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "main 复核：#506（含 flexShrink 语义坑 + getSpacingValue 简写透传两条卡补充）已随 v1.4.71 部署 success。重钉过归档门禁；三断点目视因 x.wuh.site 公共 DNS 未解析待补，卡 verified-depth 维持 unit。"
  }
}
---

# 站点响应式替换批·2 — blog 标签/元信息换行占满 + about 时间轴显隐

## 动机

批次1 遗留 #5（PostTags `width:100%+margin-left` 换行占满）、#6（PostMeta margin-left 缩进）、#7（TimelineTrack `display:none@767` 响应式显隐）——前批因阶梯缺「显隐/换行占满/非对称 margin」原语暂缓。#503 已交付 Flex 的 `hidden` 与响应式 `width/height`；本批消费它们，并补一处兑现 layout-components 卡「非对称盒式简写走 CSS 字符串」承诺的 `getSpacingValue` 透传缺口（现实现会把 `0 0 0 calc(…)` 拼成 `…px`）。

## 复杂度评级

- **评级:** M
- **理由:** 契约——`getSpacingValue` 只**新增**透传分支（含空格/括号/关键字），number 与 token/单位串既有语义不变、零现有回归（flex/row 仅经 lengthValue 调用，现有入参无空格/括号）；触及面——themes/index（抽纯函数 + 再导出）+ 2 站点文件；可发现性——纯函数单测 + 站点 tsc 计数持平 + 视觉可验。M。
- **期望验证深度:** unit

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: `width` 阶梯 + `hidden` 阶梯用法；「非对称盒式简写走 CSS 字符串值」——本批把该承诺在 getSpacingValue 落实
  - 适用 scope: themes, apps/site/app/{blog,about}
- shadow-docs/knowledge/design-system.md
  - 当前结论: `--space-*` token 引用；间距响应优先 clamp
  - 适用 scope: blog/about styles
- shadow-docs/knowledge/build-config.md
  - 当前结论: 站点必须 `cd apps/site && tsc`、存量约数十错，改动前后计数持平以证零新增
  - 适用 scope: 验证
- norms/ui-patterns.md
  - 当前结论: 只替换布局类；显隐/换行属布局类
  - 适用 scope: 判定

## 决策

- **选型:**
  1. **`getSpacingValue` 抽纯函数到 `themes/spacing.ts`**（`import type Tokens`，隔离 `@ant-design/colors` 依赖、可 node --test 单测），`themes/index.ts` 改为再导出（flex/row import 路径不变）。新增透传：字符串含空格或括号（多值简写 / calc/var/env）或尺寸关键字（auto/fit-content/…）→ 原样返回；未知裸标识符仍 px 兜底（保留原行为）。
  2. **#5 PostTags** → `styled(Flex)`：`gap=4`、`width=['100%','auto']`、`margin=['0 0 0 calc(6px + var(--space-sm))','0']`（窄屏整行+缩进、sm+ 复位）；`flex-shrink:0` 留 css（它是 PostRow 子项自身属性，非子选择器）。
  3. **#6 PostMeta** → 同上 margin 阶梯；font-size/color 非布局留 css。
  4. **#7 TimelineTrack** → `styled(Flex).attrs({ hidden:[true,undefined,false] })`：基线+sm 隐藏、md(≥641) 复显——767 野断点按前批裁决收编到 641（641~767 带时间轴由隐藏转显示，属已授权收敛）。
- **对比:** 直接用 `margin-left` 具名单边 → Flex 无该 prop 且顶层数组=槽位语义，改用四值简写 `0 0 0 calc(…)` 更契合契约「盒式简写走 CSS 字符串」；不选在组件加 `marginLeft` 单值 prop（扩大 API 面、YAGNI）。#7 不用容器查询/新原语，复用 #503 的 `hidden`。
- **理由:** getSpacingValue 抽纯函数是它此前不可单测的根因修复（顺带满足卡承诺）；三处迁移均离散布局切换，正合阶梯槽；`flexShrink` 语义坑（编译进 `&> *`）已在实现注释标注规避。

## 任务

### Phase 1 — 间距纯函数与透传
- [x] 抽 getSpacingValue 纯函数 + 透传 — `packages/components/themes/spacing.ts` `packages/components/themes/index.ts`
- [x] 纯函数单测 — `packages/components/themes/spacing.test.mjs` — number/token/单位串既有语义 + 简写/calc/关键字透传 + 裸标识符 px 兜底
### Phase 2 — 站点迁移
- [x] PostTags/PostMeta 迁 Flex — `apps/site/app/blog/styles/index.ts` — width/margin 阶梯，删两处 `@media(max-width:520)`
- [x] TimelineTrack 迁 Flex hidden — `apps/site/app/about/styles.ts` — `hidden=[true,,false]`，删 `@media(max-width:767)`
### Phase 3 — 验证
- [x] 域 tsc + 站点 tsc 计数持平 + 域守卫 + oxlint；grep 确认 blog/about 仅剩 reduced-motion/非布局 @media

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/layout-components.md`
- **理由:** 落实「CSS 简写透传」承诺（getSpacingValue 行为）+ 站点迁移备忘补一条「flexShrink prop 编译进 `& > *`，作子项的 flex-shrink 必须写进 css 块不能走 prop」——跨批次会复用的坑，值得入执行约束。verified-depth 维持 unit（真机目视待 DNS 恢复）。
