---
{
  "schema": "shadow-dev/v1",
  "name": "20260903-style-icon-actions-redesign",
  "type": "style",
  "scope": "post",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20260903-style-icon-actions-redesign",
  "files": [
    "apps/site/app/post/components/FloatingActions/index.tsx",
    "apps/site/app/post/styles/post-floating.ts",
    "packages/components/icons/fallbacks/twitter.tsx",
    "packages/components/icons/icofont.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 360,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/360",
    "pullRequest": 361,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/361"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "3c487bfb853d5b5717ab82a127f9f89636b21e50",
    "verifiedAt": "2026-09-03T09:07:58.964Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:361",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 图标风格统一（品牌图标 outline 化）与三钮组响应式重设计

## 动机

**需求 1（图标风格不一致）**：文末分享行的品牌图标（微信/QQ/微博/Twitter）显示为实心黑块，而邮箱/分享/导图/全文是 lucide outline 描边——混搭。根因：`makeIcon` 优先渲染 iconfont 字体 glyph，品牌图标在字体中的 glyph 为 `-circle` 实心风格（如 `iconwechat-circle`），字体加载后覆盖了 outline fallback；邮箱等在字体中无 glyph，落到 lucide outline。混搭是运行时加载状态的概率结果。`icon-system.md` 卡片声称「品牌图标与 lucide outline 风格一致」，代码事实再次与卡片脱节。

**需求 2（三钮组布局）**：文末三钮组（返回首页/回到顶部/赞）为「散点圆钮」形态（两圆 + 胶囊，gap 12px），移动端 `flex-wrap: wrap` 会在窄屏把赞挤到第二行断组；而同组在侧栏中是「连体分段胶囊」（compact）。同一组件两种形态，且知识卡明确「保持连体分段组件语言不变」——散点式是异端形态。用户需要一套移动端/平板端/电脑端的响应式布局。

## 引用规范

- shadow-docs/knowledge/icon-system.md
  - 当前结论: 所有图标使用线框风格（`stroke='currentColor' fill='none'`、strokeWidth 2、圆角端点）；品牌图标可保留品牌形状但风格需与 outline 统一；业务代码从组件包图标子路径导入，不新增散落 SVG
  - 适用 scope: packages/components/icons
- shadow-docs/knowledge/blog-detail.md
  - 当前结论: FloatingActions 三钮组保持连体分段组件语言不变；业务样式不得直写 `prefers-color-scheme`；动画走 `--motion-*` tokens + reduced-motion 降级；窄屏单向触达高度不低于 44px
  - 适用 scope: apps/site/app/post

## 决策

- **选型:**
  - 需求 1 → **品牌 glyph 停用 iconfont 分支**：`icofont.tsx` 中品牌/装饰图标（wechat、qq、weibo、twitter、discord、netease、douban、github、email 等走 fallback 的品牌族）恒用 outline fallback 渲染，不再被 iconfont 实心 glyph 覆盖；重画 twitter fallback（现路径形准差）；颜色走 `currentColor` 由宿主控制（纸面 text-primary、hover 朱砂链路已有）。icofont 工具类图标（缩放/旋转/关闭等预览工具组）不受影响
  - 需求 2 → **连体分段语言下沉为全断点统一形态**：文末三钮组废弃散点式，改用连体分段胶囊——移动端（<640）全宽 max-width 320px 居中、三段等分、触达高度 ≥44px；平板（640–1023）内容宽居中、高度 36px；桌面（≥1024）文末不渲染（侧栏 TocTools 承载，现状不变）。实现上把 compact 样式泛化为响应式基础形态，`variant` 语义保留（侧栏 compact 增加点赞吧~ hint 行为不变）
- **对比方案:** 需求 1 重制 iconfont 字体为 outline（字体源工程不在仓库，成本高不可控）——放弃；全实心化（违背 lucide 语言）——放弃。需求 2 保持散点式仅调 gap（换行断组与双形态问题仍在）——放弃；三钮组移动端改 fixed 底部悬浮（遮挡正文、违背零投影纯纸面语言）——放弃
- **理由:** 需求 1 改动集中在 icons 包的渲染分支 + 一个重画；需求 2 复用既有 compact 样式语言做响应式泛化，删除散点式冗余分支。两者合计消除两处「代码与知识卡脱节」

## 任务

### Phase 1

- [x] 品牌图标 outline 化 — packages/components/icons/icofont.tsx — makeIcon 增加跳过 iconfont 的能力，品牌族图标恒用 fallback；校验 fallback 全部为 stroke 描边风格
- [x] twitter fallback 重画 — packages/components/icons/fallbacks/twitter.tsx — 重画 outline 路径（现路径形准差）
- [x] fallback 视觉走查 — packages/components/icons/fallbacks/ — wechat/qq/weibo/discord/netease-music/douban/github/email 逐个确认描边语言与形准

### Phase 2

- [x] 三钮组响应式统一 — apps/site/app/post/styles/post-floating.ts + apps/site/app/post/components/FloatingActions/index.tsx — 文末形态改连体分段胶囊：<640 全宽 max-width 320px 三等分（min-height 44px）；640–1023 内容宽居中高 36px；≥1024 文末不渲染（PostView ColophonTools 逻辑保持）；删除散点式冗余样式分支，动效走 `--motion-*` + reduced-motion 降级
- [x] 回归验证 — `tsc --noEmit`、oxlint 变更文件、移动/平板/桌面三断点 + 明暗主题目检分享行图标风格一致、三钮组不换行

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/icon-system.md, shadow-docs/knowledge/blog-detail.md
- **理由:** icon-system.md「品牌图标与 outline 一致」的声明本次才真正落地（品牌 glyph 不再走 iconfont），归档时补充该事实；blog-detail.md 三钮组段落更新为「连体分段为全断点统一形态、散点式已废弃」
