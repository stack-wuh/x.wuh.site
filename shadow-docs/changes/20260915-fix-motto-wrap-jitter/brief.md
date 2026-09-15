---
{
  "schema": "shadow-dev/v1",
  "name": "20260915-fix-motto-wrap-jitter",
  "type": "fix",
  "scope": "apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20260915-fix-motto-wrap-jitter",
  "files": [
    "apps/site/app/components/TypewriterMotto/index.tsx",
    "apps/site/app/components/TypewriterMotto/styles.ts",
    "apps/site/test/typewriter-motto-stability.test.mjs",
    "shadow-docs/knowledge/design-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 385,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/385",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "c3f4913a4a5783a164ab3d2bfe61e0a642f47f26",
    "verifiedAt": "2026-09-15T10:30:48.432Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "c3f4913a4a5783a164ab3d2bfe61e0a642f47f26",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 首页标语打字机：移动端换行时容器高度跳动

## 动机

用户反馈：Typing 区域在移动端文字换行时高度跳动。诊断（`apps/site/app/components/TypewriterMotto/`）：容器 `min-height` 只保底**一行**（`font-size-lg × 1.8 + space-md × 2`），而实际高度由"当前已打出的文字"实时决定——≤520px 下容器 `max-width: 320`，22px 衬线每行约 14 字，第一句 24 字要占 2 行：打字越过折行点的那一刻，容器从 102px 跳到 ≈142px（+39.6px 一行，102px 与用户选中元素实测吻合），下方内容整体下移；删除/换第二句（18 字）再跳回，每轮循环震荡。次生：底部 `::after` 朱砂短线与粒子 `y = cr.height/2` 都跟着漂移。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 首页标语使用 TypewriterMotto 打字机效果逐字显示，两句循环；响应式间距 token（space-md clamp 窄屏收缩）。
  - 适用 scope: apps/site 首页

## 决策

- **选型: 隐藏占位字（Sizer）定高度 + 内容覆盖层。** 容器内放一个 `visibility: hidden; display: block` 的「最长句」占位元素（in-flow），容器高度 = 最长句在当前宽度下的行数——与打字进度无关、随断点/主题字号自适应（每主题每宽度自动重排，无魔法数字）；真实文字与光标移入 `position: absolute; inset: <容器纵向padding> 0` 的居中覆盖层；Glow/Particle 本就以容器为参照测量（`textRef.right - container.left`、`cr.height/2`），覆盖层化后坐标语义不变、y 天然恒定。纯 CSS+JSX，零 JS 测量。
- **对比方案:**
  - 固定 `min-height` 按 2/3 行写死：wine 主题 lg=22 与 plain lg=19 折行数不同、断点多档，写死必然在某档仍跳——否决。
  - JS ResizeObserver 测最长句再撑高：为一个纯布局问题引入测量循环与首帧跳动——否决。
- **理由:** 布局稳定性必须与内容同源（同一字体、同一宽度、同一文本），ghost-sizing 是唯一满足"零漂移 + 零维护 + 零 JS"的机制。确定性强：Sizer 文本 = 两句中最长者（24 字句），任意时刻真实文字行数 ≤ Sizer 行数，容器恒为最高态；文字垂直居中于覆盖层，长句收拢/展开无跳变。

## 任务

### Phase 1 · 实现

- [x] `styles.ts`: 新增 `Sizer`（visibility: hidden、display: block、user-select: none）与 `Content`（absolute 覆盖层：inset 纵向取容器 padding 令牌 `var(--space-md) 0`，flex 居中，text-align: center）——`apps/site/app/components/TypewriterMotto/styles.ts`
- [x] `index.tsx`: 模块级 `SIZER_TEXT = PHRASES.reduce(取最长)`；渲染 `<Sizer aria-hidden>{SIZER_TEXT}</Sizer>` 于容器首位，`TextWrap + Cursor` 包进 `<Content>`，Glow/Particle 留容器层；光标语义（`aria-label` 挂容器）不变——`apps/site/app/components/TypewriterMotto/index.tsx`
- [x] 新增守卫测试 `apps/site/test/typewriter-motto-stability.test.mjs`：①Sizer 存在且 `visibility: hidden` 且 in-flow（display: block）；②Content 为 absolute 覆盖层、inset 用容器 padding 同令牌；③tsx：Sizer 渲染在 Content 之前、TextWrap/Cursor 在 Content 内、容器 aria-label 保留；④SIZER_TEXT 由 PHRASES 推导（不复制文案字面量）——`apps/site/test/typewriter-motto-stability.test.mjs`

### Phase 2 · 验证

- [x] 浏览器实测 375/520/640/1280：打字全程（≥一个完整循环）容器 `getBoundingClientRect().height` 方差为 0；下方按钮 y 恒定；光晕 x/粒子 y 正常；无横向溢出；对照修复前基线（375 下 102→≈142 跳）——本地 dev
- [x] `tsc --noEmit` + 新测试全绿

## 结果

- 实际耗时: 2026-09-15（与 quiet-header 同日，独立 change）
- 验证: 修复前基线（确定性探针，375px wine light）：0–13 字 102px / 14–24 字 141px，折行点第 14 字，跳幅 +39.6px。修复后同探针六档文本长度（0/8/13/14/20/24）在 375-wine `{141}`、375-plain `{130}`（主题字号差自动重排）、520 `{144}`、640 `{118}`、1280 `{126}` 全部单值集、方差 0，无横向溢出。守卫 4/4 绿 + 4 变异验证（去 visibility / inset 归零 / 光标出覆盖层 / 占位写死文案均变红）；`tsc --noEmit` 干净。注：与 #384（quiet-header）在 design-system.md frontmatter source 列表有相邻插入，后合并者两行并存即可；正文改动不同段，无冲突。探针方法学：IAB 后台标签 setInterval 被节流、rAF 暂停，打字动画的时序采样不可靠——用"同步注入文本长度"的确定性探针替代，秒级出全部证据。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/design-system.md
- **理由:** 打字动画结论补一条通用机制：打字机容器高度由隐藏占位字（最长句）锁定、内容绝对覆盖，布局稳定与内容同源。若后续推广到其它打字位再考虑独立卡片。
