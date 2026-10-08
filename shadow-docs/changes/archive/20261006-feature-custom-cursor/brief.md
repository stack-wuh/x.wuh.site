---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-feature-custom-cursor",
  "type": "feature",
  "scope": "cursor",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20261006-feature-custom-cursor",
  "files": [
    "apps/site/app/layout.tsx",
    "packages/components/cursor/book.tsx",
    "packages/components/cursor/cursor.test.mjs",
    "packages/components/cursor/index.tsx",
    "packages/components/cursor/style.tsx",
    "packages/components/cursor/tints.ts",
    "shadow-docs/knowledge/cursor-system.md",
    "shadow-docs/menu.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 497,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/497",
    "pullRequest": 498,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/498"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "83efea3967d2414c4e6a7ef4d54ca16f8c06c896",
    "verifiedAt": "2026-10-08T07:19:34.592Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:498",
    "planHash": "fb7c1c3f08675ae166ba0dc27e3543f9baa3798a6d1fe11e356fe28d7277a73f",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 全站特色光标「一页书」——活的、会翻的、主题色的鼠标 Icon",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\nx.wuh.site 的读者用鼠标读站。光标一直是 OS 默认箭头，与「纸墨·朱砂」的设计语言零呼应。\n人设 = 文艺青年 × 程序员；诉求经过多轮收敛：**要一个活的、会变化的 Icon**，不是静态贴纸。\n最终载体定为**一枚摊开的书**：博客即阅读，光标即随身的一页书——hover 掀页、输入压成一行、\n加载哗哗翻、静止 5s 后**书自己读**（idle 整页翻）。它同时是站名「x.wuh.site · 个人博客」最诚实的签名件。\n\n视觉稿（高保真、真 token、可交互）：`shadow-docs/changes/20261006-feature-custom-cursor/design/cursor-v4.html`\n（本地静态服务 `http://127.0.0.1:8912/cursor-v4.html?motif=bk` 已验证，定稿截图归档 `design/shots/`）。\n\n## 引用规范\n- `shadow-docs/knowledge/design-system.md`：纸墨·朱砂、4 主题路由（family × scheme）、唯一饱和元素\n- `shadow-docs/knowledge/animation-system.md`：动效令牌 `--motion-ease-in-out-soft/-ease-out-soft/-dur-quick`；「一个动作一个主角」；微光呼吸 × 书写显现\n- `shadow-docs/knowledge/components.md` + audio-player 先例：站独享组件自持 keyframes / `--motion-*`\n- `shadow-docs/knowledge/icon-system.md`：stroke 几何、currentColor 墨、朱砂点 = 激活语义\n- 全局规范 `ui-patterns`：禁裸 hex / 禁布局属性动画 / pointer:fine 门控 / reduced-motion 降级块在场（守卫测试断言集）\n- `cssVariableProvider.tsx` L225-267 先例：`@media (pointer:fine)` 全局样式门控（滚动条同构）\n- `packages/themes/generator-color.ts`：四调色板单一事实源（纸色预混从此取色）\n\n## 决策\n（brief 缺少该节）\n\n## 任务\n（brief 缺少该节）\n\n完整 brief：shadow-docs/changes/20261006-feature-custom-cursor/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-feature-custom-cursor\",\"type\":\"feature\",\"scope\":\"cursor\",\"status\":\"branched\",\"branch\":\"feature/20261006-feature-custom-cursor\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-feature-custom-cursor/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": []
    },
    "release": {
      "files": [
        "apps/site/app/layout.tsx",
        "packages/components/cursor/book.tsx",
        "packages/components/cursor/cursor.test.mjs",
        "packages/components/cursor/index.tsx",
        "packages/components/cursor/style.tsx",
        "packages/components/cursor/tints.ts",
        "packages/components/cursor/tsconfig.guard.json",
        "packages/components/cursor/typecheck.test.mjs",
        "shadow-docs/changes/20261006-feature-custom-cursor",
        "shadow-docs/knowledge/cursor-system.md",
        "shadow-docs/menu.md"
      ],
      "message": "feat(cursor): 全站「一页书」光标——rAF 跟随层六态+idle 自读书+四主题静帧降级链 (#497)",
      "title": "[feature] 全站特色光标「一页书」——活的、会翻的、主题色的鼠标 Icon (#497)",
      "body": "Closes #497\n\n完整 brief：shadow-docs/changes/20261006-feature-custom-cursor/brief.md"
    }
  },
  "knowledge": null
}
---

# 全站特色光标「一页书」——活的、会翻的、主题色的鼠标 Icon

## 动机

x.wuh.site 的读者用鼠标读站。光标一直是 OS 默认箭头，与「纸墨·朱砂」的设计语言零呼应。
人设 = 文艺青年 × 程序员；诉求经过多轮收敛：**要一个活的、会变化的 Icon**，不是静态贴纸。
最终载体定为**一枚摊开的书**：博客即阅读，光标即随身的一页书——hover 掀页、输入压成一行、
加载哗哗翻、静止 5s 后**书自己读**（idle 整页翻）。它同时是站名「x.wuh.site · 个人博客」最诚实的签名件。

视觉稿（高保真、真 token、可交互）：`shadow-docs/changes/20261006-feature-custom-cursor/design/cursor-v4.html`
（本地静态服务 `http://127.0.0.1:8912/cursor-v4.html?motif=bk` 已验证，定稿截图归档 `design/shots/`）。

## 复杂度评级

评级: **M** · 理由: 三要素——①契约变更：无（纯新增 UI 层，不改任何数据/接口/权限契约）；②触及面：新增 `packages/components/cursor` 组件 + apps/site 全局挂载一处，不碰共享函数签名；③可发现性：坏在立刻可见（光标异常肉眼即见）。 · 期望验证深度: **runtime**（四主题 × 六态实机走查 + 门控环境走查），测试要求 = M 级绿灯 unit + 走查，不强制先红。

## 引用规范

- `shadow-docs/knowledge/design-system.md`：纸墨·朱砂、4 主题路由（family × scheme）、唯一饱和元素
- `shadow-docs/knowledge/animation-system.md`：动效令牌 `--motion-ease-in-out-soft/-ease-out-soft/-dur-quick`；「一个动作一个主角」；微光呼吸 × 书写显现
- `shadow-docs/knowledge/components.md` + audio-player 先例：站独享组件自持 keyframes / `--motion-*`
- `shadow-docs/knowledge/icon-system.md`：stroke 几何、currentColor 墨、朱砂点 = 激活语义
- 全局规范 `ui-patterns`：禁裸 hex / 禁布局属性动画 / pointer:fine 门控 / reduced-motion 降级块在场（守卫测试断言集）
- `cssVariableProvider.tsx` L225-267 先例：`@media (pointer:fine)` 全局样式门控（滚动条同构）
- `packages/themes/generator-color.ts`：四调色板单一事实源（纸色预混从此取色）

## 设计与决策清单（含否决留档）

**否决留档（本需求内不得复活）**：A 墨锋 / B 印心 / C 墨点 / D 只易互动 / F 竖钩 / G 刻刀
（否决维度：借 OS 箭头轮廓、特色不足）；工笔贴纸蝶 v2（元素多、贴纸感）；写意蝶 v3「两笔一点」
（**根因判死：用光标画具象生物，画得越少越像残稿**）。定稿立场：光标是「被使用的物件」，不是图案。

| # | 决策 | 实现落点 / 守卫断言 |
|---|------|---------------------|
| D1 | 载体 =「一页书」（用户点名；两页即被否蝴蝶的同一轮廓，差别在书是物件不是画） | `cursor/book.tsx` SVG 常量；守卫：path=4（pl/pr/pt.face/rules 组按结构计）+ line×2 + circle×1 |
| D2 | 动画光标 ⇏ CSS cursor → **单一 rAF 全局跟随层**：`cursor:none` + `translate3d` 合成器位移；降级链 `@media (pointer:fine)` ∧ `prefers-reduced-motion: no-preference`，否则交还 CSS cursor 静帧（Safari 亦在跟随层覆盖内） | `cursor/index.tsx`；守卫：两 @media 门控在场、禁 scroll/resize listener |
| D3 | 热点 = 书脊顶端**朱砂脊头钉** (12, 3.6)；钉即靶心，开热点十字自检通过（偏移 0px） | data-URI hot `12 4`（整数化）；跟随层 translate `(tx-12, ty-3.6)` |
| D4 | 几何 15.4×11.6（面积经 R1 收形 −38% 去遮挡）；页面上缘向书口扬起、书口外凸 0.3px，全贝塞尔零直边；描边 1.2px 圆头 + `vector-effect:non-scaling-stroke`（翻页缩放线宽不炸） | `book.tsx` d 值逐字照稿；守卫：d 字符串快照 |
| D5 | **纸色主题化**：正/背/翻页三面 = `color-mix(in oklab, --primary-color {30,18,38}%, --background-100)`——亮题酒晕纸、暗题暗红纸；动效层直接用 CSS 变量，**data-URI 禁变量/color-mix**，12 个预混 hex 常量落 `tints.ts`（oklab 离线算，附推导注释） | 守卫：`tints.ts` 值 == oklabMix(调色板常量) 断言（调色板漂移即红）；styled CSS 禁裸 hex |
| D6 | 六态 + click 全部不换形状只换物件状态：default breeze 5.4s 风掀两记 / pointer lift 1.05s 掀页欲读（底页显形 + 三行弧字浮出）/ text scaleY.36 压成一行 + 朱基线 scaleX 0→1 / **wait turn .52s alternate 哗哗翻书** / grab 合卷 .5/.4 / grabbing 压紧 / popping 260ms 轻合。只动 transform/opacity，时长落 150ms–300ms 交互区间、氛围 5.4s | `cursor/style.tsx`；守卫：keyframes 属性白名单、wait 态无行林（R1 除饰品留档） |
| D7 | **idle 自读书**：静止 ≥5s → idleTurn 3.4s 整页翻循环（右页掀起→越脊→落左页→化去）；任何 pointermove 立即收回 breeze；规则序排在交互态之前（hover/text/wait 可覆盖）。成本 = 单 setTimeout 挂 pointermove，静止时 rAF 本已停止，纯 CSS 动画零额外 JS | `index.tsx` wake() 计时器；守卫：idle 类名单测 |
| D8 | 无开关（用户明确否决设置项）；触控/粗指针零影响；`data-cursor="wait|grab"` 属性约定留给业务元素声明特例态，默认规则 `a[href]/button/[role=button]`→pointer、`input/textarea/[contenteditable]`→text | 全局挂载 apps/site layout 一处；不新增 provider |

## 实施方案（Phase 任务，M 级：绿灯测试随码交付）

- **Phase 1 · 资产层**：`packages/components/cursor/book.tsx`（六态 SVG 结构 + d 常量）+ `tints.ts`（12 预混 hex + oklab 推导注释）；`cursor.test.mjs` 守卫套件（结构计数 / keyframes 白名单 / 两门控在场 / 禁裸 hex / tints==oklabMix）
- **Phase 2 · 组件层**：`cursor/index.tsx` `'use client'` CursorLayer（rAF 跟随 + 状态机 closest 委托 + popping + idle wake）+ `cursor/style.tsx`（createGlobalStyle：cursor:none 门控块、.bk 全部关键帧、data-URI 静帧 6×4 规则、reduce 降级静帧）
- **Phase 3 · 挂载与实机**：apps/site 根 layout 挂 `<CursorLayer/>`；四主题 × 六态 + idle + 热点走查（browser-use 只读实测，截图归档 `design/shots/`）；触控模拟与 reduce 模拟走查
- **Phase 4 · 知识与收尾**：`shadow-docs/knowledge/cursor-system.md`（组件契约：热点/状态映射/门控/降级/守卫断言/否决留档）+ `menu.md` 路由；`pnpm exec tsc --noEmit` + `node cursor.test.mjs` + 站点 build 走查

## 知识评估

- 新增 active 卡：`knowledge/cursor-system.md`（全站光标接管层的契约、门控与降级规范——本 change 后任何动光标的 change 必须引用）
- 更新候选：`knowledge/design-system.md` 签名元素清单若存在，加「一页书光标」
- 单次调查（比稿过程、甲乙丙骨架否决）只留本 brief，不沉淀

## 验收标准

1. 四主题明暗下：跟随层书形清晰、纸色各归其主、朱件唯一饱和；pointer/text/wait/grab 四触发区行为正确
2. 静止 5s 自动翻书、一动即收；reduced-motion 下无任何动画且光标交还静帧；触控设备光标零变化
3. `tsc --noEmit` 绿、`cursor.test.mjs` 绿、守卫断言全过；跟随层仅 transform/opacity、无布局抖动（Performance 面板走查）
4. 视觉稿无损移植：d 值 / 时长 / 配比与 `cursor-v4.html` 逐字一致（实现期发现稿错先修稿）
