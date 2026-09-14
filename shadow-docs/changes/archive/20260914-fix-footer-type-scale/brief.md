---
{
  "schema": "shadow-dev/v1",
  "name": "20260914-fix-footer-type-scale",
  "type": "fix",
  "scope": "components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20260914-fix-footer-type-scale",
  "files": [
    "apps/site/test/footer-type-scale.test.mjs",
    "packages/components/layout/styles/index.tsx",
    "shadow-docs/knowledge/footer-design.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 379,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/379"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "aaa1c28cf081783188dd7bfae58a478e0c5a8a40",
    "verifiedAt": "2026-09-14T11:36:59.467Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:379",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# Footer 字号层级与行高规范化

## 动机

用户反馈：Footer 字号整体偏大、行高未按规范处理。实测（本地 dev，1280 宽，wine/light，`getComputedStyle`）证实两项偏差：

1. **字号越级**：Footer 是辅助信息层，却用了正文档——根层 `--font-size-base`（15px）、导航链接 15px、备案/注脚/站点数据 13px（`--font-size-sm`，素雅主题下该 token 为 15px，届时整页页脚均为 15px）。站内正文辅助层基准是 12px（`--font-size-xs`）：详情页 `.sec-eyebrow` / `.copy-btn` / `kbd` / `UpdateDivider` / `figcaption` 全部 12px。
2. **行高非规范值**：根层写死 `line-height: 1.6`，既非 `--line-height-body`（酒红 1.8 / 素雅 2.0，≤640 收紧为 1.7 / 1.8）也非 `--line-height-heading`（1.35 / 1.4），脱离设计系统行高令牌。
3. **附带发现（同批修复）**：Footer 挂在 `AppProviders` 层（页面容器之外），全站没有 `body { font-family }` 兜底，页面级 `font-family: var(--font-sans)` 覆盖不到它——实测页脚除 slogan 外所有文字落到浏览器默认族（`Microsoft YaHei`），而非站内 `Noto Sans SC`；同一缺陷也存在于 SiteHeader，但不在本变更范围。

## 引用规范

- shadow-docs/knowledge/footer-design.md
  - 当前结论: 中轴层级顺序、640px 护栏、垂直节奏、语义 token、触屏标签
  - 适用 scope: packages/components/layout
- shadow-docs/knowledge/design-system.md
  - 当前结论: 非颜色 token 经语义变量注入；行高令牌 `--line-height-body` / `--line-height-heading` 随主题与断点变化
  - 适用 scope: 全站样式
- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 辅助文字（时间/标签/计数/提示）统一 12px 无衬线，是站内辅助层基准
  - 适用 scope: apps/site/app/post

## 决策

- **选型:** 页脚整层降为辅助层并全面 token 化——根层 `font-size: var(--font-size-xs)`（12px，四主题同值，不受素雅 `sm` 覆盖影响）、`line-height: var(--line-height-body)`；slogan 由 `--font-size-md`（17px）降一档至 `--font-size-base`（15px）并改 `line-height: var(--line-height-heading)`；导航/备案/注脚/站点数据删去各自字号声明，统一继承根层；tooltip 行高 1.4 改 `var(--line-height-heading)`。
- **对比方案:** 仅缩字号不改行高——行高仍脱离令牌体系，未选；各行保留 13/15px 分级——素雅主题 `sm`=15px 与 `base` 同值，分级在四主题下不可控，未选。
- **理由:** 页脚是每页固定收尾的辅助信息，字号应落在站内辅助层同一档；全部走 token 后四主题一致，且字号下调后单行盒高由 24px 降到 21.6px（酒红），与「页脚不过高」的既有约束同向。
- **附带修复:** 根层补 `font-family: var(--font-sans)`——页脚在页面容器之外，必须自行声明字体族，否则落到浏览器默认族。
- **追加决策（用户复检反馈「边距还是很大」后）:** 横向留白跟着字号档走，不再沿用正文口径——导航行/备案行 `--space-lg`(36px) → `--space-sm`(16px)，≤520px 收 `--space-xs`；注脚段间去掉 `column-gap`（全角 `·` 自带字宽即留白，实测 28px → 12px）；站点数据行 `--space-md`(28px) → `--space-sm`(16px)。
- **追加决策（用户要求「去掉全部的 margin，全部使用行高控制」）:** 页脚纵向节奏全部交给行高——区块 `margin-top/bottom` 与 `row-gap` 一律归零（含 `Divider ornament` 默认的 `--space-lg` margin，须在页脚处覆盖掉），相邻行之间只剩行盒 leading；横向不归零（行高管不到横向），仍由 `column-gap` 承担；footer 自身 `padding: var(--space-md)` 作为外框保留。
- **追加决策（用户要求行高「全部改为 1.5 1.8 左右」）:** 行高不再引用全站令牌，改为页脚自有的两个变量——块级行 `--footer-lh: 1.8`、slogan 与 tooltip `--footer-lh-display: 1.5`。全站令牌落不进 1.5–1.8：`--line-height-body` 素雅 2.0（过松）、`--line-height-heading` 1.35（过紧）。代价是页脚不再跟随主题/断点的行高收紧（四主题与各断点一律 1.8/1.5），换来的是页脚自身可控的一套节奏。
- **回退决策（用户反馈「使用行高之后下划线的位置都不对劲了，还是得使用 margin 来控制边距」）:** 撤销「去掉全部 margin」这一步，区块间距恢复为 margin（ornament `--space-sm 0 --space-base`、slogan `0 0 --space-xs`、导航/备案/注脚行 `margin-bottom: var(--space-sm)`、`row-gap` 恢复），行高保留 1.8/1.5 不变。根因：链接下划线是 `linkUnderline` 里挂在行盒底部再往下 4px 的绝对定位伪元素（`bottom: -4px`），行间没有 margin 时这 4px 直接落进下一行的盒子——实测下划线与下一行墨迹的余量从 14px 掉到约 4px，看上去像"贴/错位"。结论：行高负责行距，margin 负责区块间距，两者都要。
- **追加决策（用户指出「不应该写死 px，应该使用变量，变量受响应式间距对象控制」）:** 页脚内所有间距/偏移改由间距与圆角令牌推导，去掉裸 px——下划线偏移 `-4px` → `calc(var(--space-xs) / -2)`、focus ring 偏移 `3px` → `calc(var(--space-xs) / 2)`、tooltip 弹出距离 `calc(100% + 9px)` → `calc(100% + var(--space-xs))`（对齐 LinkGroup tooltip 的 8px）、tooltip 内边距 `5px 10px` → `calc(var(--space-xs) / 2) var(--space-xs)`（4px 8px）、tooltip 圆角 `6px` → `var(--border-radius-base)`、数据项 `gap: 6px` → `var(--space-xs)`、数据项圆角 `4px` → `var(--border-radius-sm)`、注脚 `row-gap: 3px` → `calc(var(--space-xs) / 2)`、内层宽度 `640px` → `${BREAKPOINTS.mobile}px`。描边宽度（`1px` 发丝线、`outline: 1.5px`）沿用仓库既有字面值写法。
- **追加决策（用户反馈「移动端没有展示技术栈」）:** 撤销「技术栈段 <520px 整段隐藏」的旧规则——三段（© / 协议 / 技术栈）在任意宽度都完整展示，窄屏技术栈整段折到下一行；`≤520px` 时其段首分隔符 `::before` 一并隐藏（此时该段独占一行，行首的点多余）。521–639px 若发生折行仍会带行首分隔符——CSS 无法感知 flex 折行，只有 ≤520px 是确定折行区间；且分隔符不能与 `column-gap` 同时去掉，否则两段会粘在一起。
- **追加决策（用户要求「这三个元素之间可使用分割线或其他方式隔开」）:** 导航三项之间加**竖向发丝线**（1px × 1em，颜色 `--normal-400 55%` mix，与 Divider 发丝线同语言），由后一项的 `::before` 承载并绝对定位在两链接间隙中点（`right: calc(100% + var(--footer-nav-gap) / 2)`）——绝对定位是必须的：作为正常流内容会进入链接盒，hover 下划线会连分隔线一起划上。间距仍由 `column-gap`（`--space-sm`）给，分隔线不改变既有节奏。备选「与注脚同款 `·` 点分隔」已在页面上临时渲染对比（未写入代码）：点方案与下方注脚语言一致但会让导航与注脚同质，故选用发丝线。
- **追加决策（用户反馈「375 间隔太小了」）:** 导航间隙不再随窄屏收窄——原先 ≤520px 收 `--space-xs`（8px），夹一条 1px 发丝线后两侧只剩 3.5px，肉眼像黏连；现改为全宽度统一 `--space-sm`（16px，线两侧各 7.5px），并删掉 ≤520px 的 `--footer-nav-gap` 覆盖。备案行的窄屏收窄保留：实测 375 宽下两个备案号合计 292.9px、可用 301.3px，涨到 12px 就会折成两行，故仍用 8px。

## 任务

### Phase 1
- [x] styles/index.tsx 字号层级下移（根层 xs、slogan base）、行高改语义 token（body/heading）、根层补 `font-family: var(--font-sans)`、各行删除独立字号声明 — packages/components/layout/styles/index.tsx — 修改
- [x] 新增守卫测试：字号档位（禁 `sm`、`base` 仅 slogan）、行高必须走令牌、根层字体族自持 — apps/site/test/footer-type-scale.test.mjs — 新增

### Phase 2
- [x] 验证：tsc 通过；dev 实测四主题字号/行高/字体族计算值符合 token 且页脚高度下降；1280 与 375 无横向溢出、注脚仍在段边界折行 — — 验证
- [x] 去掉页脚全部区块 margin / row-gap，纵向节奏改由行高承担（含 ornament 默认 margin 归零）— packages/components/layout/styles/index.tsx — 修改
- [x] 守卫测试补「区块不得带上下 margin / margin 不得吃间距 token」断言 — apps/site/test/footer-type-scale.test.mjs — 修改
- [x] 行高改页脚自有变量（`--footer-lh` 1.8 / `--footer-lh-display` 1.5），停用 `--line-height-body/heading`；守卫测试改断言行高固定在该区间 — apps/site/test/footer-type-scale.test.mjs — 修改
- [x] 恢复区块 margin / row-gap（行高保留 1.8/1.5）；守卫测试改断言「区块间距由 margin 承担」 — apps/site/test/footer-type-scale.test.mjs — 修改
- [x] 间距/偏移去裸 px：下划线偏移、focus ring 偏移、tooltip 弹出距离与内边距、圆角、数据项 gap、注脚 row-gap、内层宽度全部改令牌推导；守卫测试加「间距类属性无裸 px」断言 — packages/components/layout/styles/index.tsx / apps/site/test/footer-type-scale.test.mjs — 修改
- [x] 移动端展示技术栈：撤销 ≤520px 隐藏规则，窄屏整段折行，并隐藏该段行首分隔符；守卫测试加「≤520px 不得隐藏技术栈段」断言 — packages/components/layout/styles/index.tsx / apps/site/test/footer-type-scale.test.mjs — 修改
- [x] 导航三项之间加竖向发丝线分隔（绝对定位在间隙中点，由后一项 `::before` 承载）；守卫测试加「导航分隔线」断言 — packages/components/layout/styles/index.tsx / apps/site/test/footer-type-scale.test.mjs — 修改
- [x] 导航间隙全宽度统一 `--space-sm`（撤销 ≤520px 收窄），同步守卫测试禁止窄屏再收窄导航 — packages/components/layout/styles/index.tsx / apps/site/test/footer-type-scale.test.mjs — 修改

## 结果

- 改动：`StyledFooter` 根层加 `font-family: var(--font-sans)`、`font-size` 由 `base`(15px) 降为 `xs`(12px)、`line-height` 由写死的 1.6 改 `var(--line-height-body)`；slogan 由 `md`(17px) 降为 `base`(15px) 并显式 `var(--line-height-heading)`；导航/备案/注脚/站点数据/技术栈五处独立字号声明删除，统一继承根层；tooltip 行高 1.4 改 `var(--line-height-heading)`。
- 实测（本地 dev + 真实浏览器 `getComputedStyle`）：四主题下根层与各行均为 `Noto Sans SC` 12px（改动前是浏览器默认族 `Microsoft YaHei`，酒红 15px / 素雅 15px），行高 21.6px（酒红·`body` 1.8）/ 24px（素雅·`body` 2.0）；slogan `Noto Serif SC` 15px/20.25px；tooltip 12px/16.2px 且仍向上弹出（悬停实测 `visibility: visible`）。
- 页脚高度 282px → 273px（酒红 @1280）、281px（素雅 @1280）；320 / 375 / 520 / 640 / 1280 宽均无横向溢出，注脚只在段边界折行、<520px 技术栈段 `display: none`。
- 复检追加（用户反馈「这些元素的边距还是很大」后按量测收紧横向留白）：导航行 / 备案行 `column-gap` 由 `--space-lg`（36px）收到 `--space-sm`（16px，≤520px 收 `--space-xs` 8px）；注脚段间去掉 flex 间距——CJK 全角 `·` 自带 1em 字宽（墨迹居中）即段间留白，实测段间由 28px 收到 12px；站点数据行由 `--space-md`（28px）收到 `--space-sm`（16px）。收紧后 320 / 375 / 520 / 640 / 1280 仍无溢出，注脚折行仍只在段边界，四主题下窄屏与桌面间距同向（不再出现窄屏比桌面更松）。
- 再追加（用户要求「去掉全部的 margin，全部使用行高控制」）：页脚内所有区块 `margin-top/bottom` 与 `row-gap` 归零（`.footer-ornament` 覆盖掉 Divider 默认的 `--space-lg` margin、`.footer-slogan` 的 `--space-xs` 下边距、导航/备案/注脚行的 `--space-sm` 下边距与 `row-gap`、数据行 `row-gap`），纵向间距只剩行盒 leading；横向 `column-gap` 保留。实测相邻区块盒间距 5 处全为 0px，页脚高度 273px → 189px（酒红 @1280）/ 197px（素雅 @1280）/ 169px（375 宽），行高 ≤640px 收到 20.4px；320–1280 无溢出、注脚仍只在段边界折行。
- 再追加（用户要求行高「全部改为 1.5 1.8 左右」）：行高改由页脚自有变量承担——根层 `--footer-lh: 1.8`（块级行）、`--footer-lh-display: 1.5`（slogan 与 tooltip），不再引用 `--line-height-body/heading`。实测四主题与 375/1280 下块级行一律 12px/21.6px、slogan 15px/22.5px、tooltip 12px/18px；页脚高度 192px（1280 宽）/ 176px（375 宽）。相对上一版：酒红桌面行盒不变（原本就是 1.8），变化在 slogan/tooltip（1.35 → 1.5）、素雅主题（2.0 → 1.8）与 ≤640 窄屏（1.7 → 1.8）。另在页面上临时改 `--footer-lh` 渲染了 2.0（行盒 24px）与 2.2（26.4px）两档供用户比较，未写入代码。
- 回退（用户反馈下划线位置异常后）：撤销「去掉全部 margin」，区块间距恢复 margin（相邻盒间距 12 / 8 / 16 / 16 / 16px），行高维持 1.8/1.5。实测链接下划线（行盒底 +4px）到下一行墨迹余量由约 4px 回到 14px；页脚高度 192px → 276px（1280 宽）、260px（375 宽）、289px（320 宽）；四主题与 375/1280 无横向溢出，注脚仍只在段边界折行。
- 去裸 px（用户指出间距应走响应式间距对象）：页脚内 9 处裸 px 间距改令牌推导，实测 `--space-xs` 8px / `--border-radius-sm` 4px / `--border-radius-base` 8px 解析正确，下划线偏移仍 4px（`calc(var(--space-xs) / -2)`）、下划线到下一行墨迹余量仍 14px、页脚高度仍 276px（1280 宽）；tooltip 内边距 4px 8px、圆角 8px、字体 12px/18px；数据项间距 6 → 8px。描边宽度（1px 发丝线、outline 1.5px）按仓库既有写法保留字面值。
- 移动端技术栈（用户反馈后）：撤销 ≤520px 隐藏规则。实测技术栈段在 1280 / 640 与前两段同行，560 / 520 / 414 / 375 / 320 整段折到第二行；`≤520px` 其段首分隔符 `display: none`（375 宽实测行首无点），521–639px 折行时仍带行首分隔符（已知边界）。页脚高度随之变化：375 宽 260 → 285px、320 宽 289 → 315px；320–1280 无横向溢出，注脚折行仍只在段边界。
- 导航分隔线（用户要求后）：三项之间加 1px × 1em 竖发丝线，实测计算样式 `position: absolute`、`right: 32px`（16px 间隙的中点）、背景 `--normal-400 55%` mix；间距仍是 `column-gap: var(--space-sm)`，页脚高度不变（276px @1280）；另在页面上临时渲染了「·」点分隔做对比，未写入代码。
- 导航间隔（用户反馈后）：撤销 ≤520px 的把导航间隙收到 `--space-xs` 的规则，全宽度统一 `--space-sm`。实测 1280 / 520 / 414 / 375 / 320 五档导航间隙恒为 16px、发丝线两侧各 7.5px、导航恒单行；备案行窄屏仍为 8px（375 宽单行，涨到 12px 会折两行）。页脚高度不变（375 宽 285px）。
- 测试：新增 `footer-type-scale.test.mjs` 9 项全绿，并做过多轮注入违规值的变异验证（① `--font-size-sm` + 写死 1.6 ② 给 `.footer-note` 加回 `margin-bottom` ③ `--footer-lh` 改成 1.3 越界 ④ 行 margin 改 `--space-base` ⑤ 下划线偏移与数据项 gap 改回裸 px ⑥ 让 ≤520px 重新隐藏技术栈段 ⑦ 改掉导航分隔线的定位 ⑧ 让 ≤520px 重新收窄导航间隙），确认断言非空跑；根 `tsc --noEmit` 通过。仓库既有 `apps/site/test` 里 11 项失败为 `ERR_UNKNOWN_FILE_EXTENSION`（这些用例 import `.ts`，需 TS loader），与本变更无关。

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/footer-design.md
- **理由:** 字号层级与行高令牌属于该卡「当前结论 + 执行约束」的修订（slogan 17px → 15px、辅助层字号与行高令牌、页脚自持字体族）
