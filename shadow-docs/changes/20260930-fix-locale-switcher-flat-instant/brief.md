---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-fix-locale-switcher-flat-instant",
  "type": "fix",
  "scope": "i18n",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20260930-fix-locale-switcher-flat-instant",
  "files": [
    "apps/site/app/components/SiteHeader/AppearanceOptions.tsx",
    "apps/site/app/components/SiteHeader/styles/index.ts",
    "packages/components/locales/index.tsx",
    "packages/components/locales/locales.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 442,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/442",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b116e81827a0ecc5de3ca489f97c9749d7d8e4f6",
    "verifiedAt": "2026-09-30T16:50:48.605Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:442",
    "planHash": "d19cda8a40f49c1f444fe9af59aab31e11daa43a45721c6787e6acb9749bcebb",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 语言切换两连修：平铺三语行 + 切换即时生效（词典预取）",
      "titleRaw": "语言切换两连修：平铺三语行 + 切换即时生效（词典预取）",
      "supplement": "i18n 上线验收反馈：① 外观弹层语言组是单钮循环轮转，要求平铺 中｜英｜日 直选（复用「明暗」行分段样式语言）；② 首次切日语不立即生效——en/ja 词典 dynamic import 惰性加载，首切等网络 chunk 期间 t() 回落中文。已确认方案：语言组改三钮平铺行 + LocaleProvider 空闲预取（requestIdleCallback 回退 setTimeout）+ AppearanceOptions 挂载兜底触发，首屏仍零增量。详见 shadow-docs/changes/20260930-fix-locale-switcher-flat-instant/brief.md",
      "body": "## 动机\ni18n 上线（v1.4.44）验收反馈两条：① 外观弹层语言组是单钮循环（中→EN→日 点按轮转），用户要求平铺 中｜英｜日 直选——同弹层「明暗」行（跟随系统｜浅色｜深色）已是现成的分段平铺样式语言；② 首次切日语页面不立即变日语——en/ja 词典 `dynamic import` 惰性加载，首切要等网络 chunk，期间 `t()` 回落中文（同会话二次切换有槽位缓存所以瞬时）。用户已确认预取时机：空闲 + 弹层开双触发。\n\n## 引用规范\n- shadow-docs/knowledge/i18n-locale.md\n  - 当前结论: en/ja 词典 `dynamic import` 惰性加载（首次切到该语言才拉取，默认中文用户零增量）；切换入口是外观弹层循环钮；自称名常量不进词典\n  - 适用 scope: packages/components/locales, apps/site/app/components/SiteHeader\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 分段平铺行（发丝线分隔 + 选中主色下划线）是既有选中语言，「明暗」行在用\n  - 适用 scope: apps/site/app/components/SiteHeader/styles\n\n## 决策\n- **选型:** ① 语言组单钮循环改三钮平铺行：中｜英｜日，复用「明暗」行分段样式语言（发丝线分隔、选中主色 + 下划线、`aria-pressed` 语义），移除 `LOCALE_CYCLE` 轮转逻辑，可见自称名常量改 中/英/日（EN→英，用户拍板；仍不进词典）；② LocaleProvider 挂载后空闲预取 en+ja 词典 chunk（`requestIdleCallback`，回退 `setTimeout`；catch 吞错不抛，失败回落中文路径不变）并导出 `preloadDictionaries()`，AppearanceOptions 挂载（= 弹层打开）再触发兜底；chunk 模块缓存使切换时 `loadDict` 近乎同步\n- **对比方案:** 仅弹层开预取（刚开弹层立刻点选仍有短暂延迟）；不预取（问题 4 不解决）；en/ja 首屏直载（违背首屏零增量纪律，否）\n- **理由:** 双触发覆盖「不开弹层直接切」（无此入口，实为覆盖挂载后任意时刻切）与「开弹层立刻切」两类路径；空闲预取发生在首屏加载完成后，不碰首包/LCP，i18n 卡「首屏零增量」纪律字面仍守住（预取语义在 release 阶段补进卡）\n\n## 任务\n### Phase 1\n- [ ] 语言组单钮循环改三钮平铺行（中｜英｜日、`aria-pressed`、移除轮转），样式复用明暗行分段语言 — `apps/site/app/components/SiteHeader/AppearanceOptions.tsx`, `apps/site/app/components/SiteHeader/styles/index.ts`\n- [ ] LocaleProvider 增空闲预取（requestIdleCallback 回退 setTimeout、en+ja 双槽、catch 吞错）并导出 `preloadDictionaries()` — `packages/components/locales/index.tsx`\n- [ ] AppearanceOptions 挂载即调 `preloadDictionaries()` 兜底 — `apps/site/app/components/SiteHeader/AppearanceOptions.tsx`\n- [ ] 守卫更新：循环钮守卫改平铺三钮 + aria-pressed 断言；新增预取守卫（空闲触发两个 loader、失败不抛、preloadDictionaries 导出存在） — `packages/components/locales/locales.test.mjs`\n\n### Phase 2\n- [ ] locales + 站点守卫套件全绿 + 根 `pnpm exec tsc --noEmit` + oxlint（SGN-001：139 空日志先等 20–45s 重试，不当代码失败）\n- [ ] runtime：清缓存硬刷新后首切日语，文案立即翻转（预取完成后切换零感知）；平铺行明暗双主题截图目检；中/英/日三语回归走查\n\n## 补充\ni18n 上线验收反馈：① 外观弹层语言组是单钮循环轮转，要求平铺 中｜英｜日 直选（复用「明暗」行分段样式语言）；② 首次切日语不立即生效——en/ja 词典 dynamic import 惰性加载，首切等网络 chunk 期间 t() 回落中文。已确认方案：语言组改三钮平铺行 + LocaleProvider 空闲预取（requestIdleCallback 回退 setTimeout）+ AppearanceOptions 挂载兜底触发，首屏仍零增量。详见 shadow-docs/changes/20260930-fix-locale-switcher-flat-instant/brief.md\n\n完整 brief：shadow-docs/changes/20260930-fix-locale-switcher-flat-instant/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-fix-locale-switcher-flat-instant\",\"type\":\"fix\",\"scope\":\"i18n\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-fix-locale-switcher-flat-instant/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/components/SiteHeader/AppearanceOptions.tsx",
        "apps/site/app/components/SiteHeader/styles/index.ts",
        "packages/components/locales/index.tsx",
        "packages/components/locales/locales.test.mjs",
        "shadow-docs/changes/20260930-fix-locale-switcher-flat-instant/brief.md",
        "shadow-docs/knowledge/i18n-locale.md"
      ],
      "message": "fix(i18n): 语言三选平铺直选 + 词典空闲预取——切语言即时生效 (#442)",
      "title": "fix(i18n): 语言切换两连修——平铺三语行 + 切换即时生效 (#442)",
      "body": "Closes #442\n\n完整 brief：shadow-docs/changes/20260930-fix-locale-switcher-flat-instant/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/i18n-locale.md",
    "reason": "卡内「切换入口是循环钮」「首次切到该语言才拉取」两条结论更新为「三钮平铺行（中｜英｜日自称名常量）」与「挂载后空闲预取 + 弹层开兜底预取，首屏仍零增量、切换即时生效」；补 runtime 实证（预取 chunk 先于弹层交互在册、切换探针 132/167ms、三语 nav/lang 走查、平铺行 DOM 断言）"
  }
}
---

# 语言切换两连修：平铺三语行 + 切换即时生效（词典预取）

## 动机

i18n 上线（v1.4.44）验收反馈两条：① 外观弹层语言组是单钮循环（中→EN→日 点按轮转），用户要求平铺 中｜英｜日 直选——同弹层「明暗」行（跟随系统｜浅色｜深色）已是现成的分段平铺样式语言；② 首次切日语页面不立即变日语——en/ja 词典 `dynamic import` 惰性加载，首切要等网络 chunk，期间 `t()` 回落中文（同会话二次切换有槽位缓存所以瞬时）。用户已确认预取时机：空闲 + 弹层开双触发。

## 复杂度评级

- **评级:** S
- **理由:** 契约变更——仅新增 `preloadDictionaries` 导出（加法，不破坏既有 API）；触及面——2 个包/组件各 1–2 个文件；可发现性——根因是既知设计代价（惰性加载），复现路径清晰（清缓存首切）。
- **期望验证深度:** runtime

## 引用规范

- shadow-docs/knowledge/i18n-locale.md
  - 当前结论: en/ja 词典 `dynamic import` 惰性加载（首次切到该语言才拉取，默认中文用户零增量）；切换入口是外观弹层循环钮；自称名常量不进词典
  - 适用 scope: packages/components/locales, apps/site/app/components/SiteHeader
- shadow-docs/knowledge/design-system.md
  - 当前结论: 分段平铺行（发丝线分隔 + 选中主色下划线）是既有选中语言，「明暗」行在用
  - 适用 scope: apps/site/app/components/SiteHeader/styles

## 决策

- **选型:** ① 语言组单钮循环改三钮平铺行：中｜英｜日，复用「明暗」行分段样式语言（发丝线分隔、选中主色 + 下划线、`aria-pressed` 语义），移除 `LOCALE_CYCLE` 轮转逻辑，可见自称名常量改 中/英/日（EN→英，用户拍板；仍不进词典）；② LocaleProvider 挂载后空闲预取 en+ja 词典 chunk（`requestIdleCallback`，回退 `setTimeout`；catch 吞错不抛，失败回落中文路径不变）并导出 `preloadDictionaries()`，AppearanceOptions 挂载（= 弹层打开）再触发兜底；chunk 模块缓存使切换时 `loadDict` 近乎同步
- **对比方案:** 仅弹层开预取（刚开弹层立刻点选仍有短暂延迟）；不预取（问题 4 不解决）；en/ja 首屏直载（违背首屏零增量纪律，否）
- **理由:** 双触发覆盖「不开弹层直接切」（无此入口，实为覆盖挂载后任意时刻切）与「开弹层立刻切」两类路径；空闲预取发生在首屏加载完成后，不碰首包/LCP，i18n 卡「首屏零增量」纪律字面仍守住（预取语义在 release 阶段补进卡）

## 任务

### Phase 1
- [x] 语言组单钮循环改三钮平铺行（中｜英｜日、`aria-pressed`、移除轮转），样式复用明暗行分段语言 — `apps/site/app/components/SiteHeader/AppearanceOptions.tsx`, `apps/site/app/components/SiteHeader/styles/index.ts`
- [x] LocaleProvider 增空闲预取（requestIdleCallback 回退 setTimeout、en+ja 双槽、catch 吞错）并导出 `preloadDictionaries()` — `packages/components/locales/index.tsx`
- [x] AppearanceOptions 挂载即调 `preloadDictionaries()` 兜底 — `apps/site/app/components/SiteHeader/AppearanceOptions.tsx`
- [x] 守卫更新：循环钮守卫改平铺三钮 + aria-pressed 断言；新增预取守卫（空闲触发两个 loader、失败不抛、preloadDictionaries 导出存在） — `packages/components/locales/locales.test.mjs`

### Phase 2
- [x] locales + 站点守卫套件全绿 + 根 `pnpm exec tsc --noEmit` + oxlint（SGN-001：139 空日志先等 20–45s 重试，不当代码失败）
- [x] runtime：清缓存硬刷新后首切日语，文案立即翻转（预取完成后切换零感知）；平铺行明暗双主题截图目检；中/英/日三语回归走查

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/i18n-locale.md
- **理由:** 卡内「切换入口是循环钮」「惰性加载首次切换才拉取」两处结论需更新为「平铺三语行」「空闲 + 弹层开预取，首屏仍零增量」，自称名常量改 中/英/日；verified 落本次日期 + verified-depth: runtime
