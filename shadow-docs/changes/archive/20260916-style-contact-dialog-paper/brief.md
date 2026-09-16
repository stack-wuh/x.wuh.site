---
{
  "schema": "shadow-dev/v1",
  "name": "20260916-style-contact-dialog-paper",
  "type": "style",
  "scope": "apps/site,packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20260916-style-contact-dialog-paper",
  "files": [
    "apps/site/app/HomeView/ContactArea.tsx",
    "apps/site/app/components/ContactCard.tsx",
    "apps/site/test/contact-dialog-paper.test.mjs",
    "packages/components/dialog/index.test.mjs",
    "packages/components/dialog/index.tsx",
    "packages/components/dialog/specs.tsx",
    "packages/components/dialog/styles/index.tsx",
    "shadow-docs/changes/20260916-style-contact-dialog-paper/design-preview.html"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 388,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/388",
    "pullRequest": 389,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/389"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "6f0a09cdee003e9d6bd67dc7b4bbc4ec1af878e4",
    "verifiedAt": "2026-09-16T12:19:19.956Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:389",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 首页联系弹窗纸张风精修：Dialog paper 变体 + ContactCard 布局/动效/响应式

## 动机

首页 Hero 下方社交按钮组（8 项，7 项点击打开联系弹窗）打开的弹窗整体观感与站点已成熟的水墨运笔语言脱节：共享 Dialog 是通用样式（硬编码 16px 圆角、rgba 阴影、Header 通用发丝线），ContactCard 两栏比例与信息层级未经打磨（`apps/site/app/components/ContactCard.tsx` 内 560px 裸断点、`rgba(0,0,0,0.06)` 硬编码边框、tagline/ hints 层级扁平），动效仅有大按钮 hover 上浮。站点同期已落地「导航运笔下划线、朱砂印墨签、试笔墨签」语言（PR #387），弹窗作为高频触点应同源深化。用户诉求覆盖五维：视觉质感、动效微交互、布局结构、信息标题、响应式。设计稿（`design-preview.html`）经用户确认后追加诉求：二维码区域要有 3D 手势动画——纸张要「随指尖轻抚而倾」，与「裱在纸上的码」的纸面隐喻同体。

## 引用规范

- shadow-docs/knowledge/contact-dialog.md
  - 当前结论: 联系弹窗必须复用 Dialog 行为——遮罩点击关闭、44×44 关闭触达区、移动端 ≤640 底部滑入 + 拖拽指示条 + scroll lock；ContactCard paper-style（background-100 + elevation + inset）
  - 适用 scope: packages/components/dialog、apps/site/app/components/ContactCard.tsx
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色/间距/圆角只走语义 token；断点只用 BREAKPOINTS 语义常量（存量 560 等随触碰收敛）；淡化色禁 `--text-secondary`（暗色反向），用 `color-mix(var(--text-color) 72%)`；动态状态禁跨组件插值选择器，用 transient prop 挂子组件自身；下划线语言 1px/两端透明/中段 primary；钤印参照外观入口「墨」印（印框 color-mix(primary 45%, transparent)、衬线印面、--border-radius-xs）
  - 适用 scope: packages/components/themes、apps/site
- norms/ui-patterns.md
  - 当前结论: 暗黑全覆盖禁硬编码色值；动效 150-300ms ease-out、禁布局位移类动画、必须响应 prefers-reduced-motion；可交互元素 visible focus ring；图标按钮 aria-label
  - 适用 scope: 全部 UI 变更
- norms/interaction.md
  - 当前结论: Escape 关闭、弹窗焦点管理（打开移入/关闭移回）、触摸目标 ≥44px——Dialog 现有实现已覆盖，变体不得破坏
  - 适用 scope: packages/components/dialog
- norms/code-style.md
  - 当前结论: 渐进式治理——只改与当前改动直接相关的问题，不顺手扩大范围
  - 适用 scope: monorepo 全部

## 决策

- **选型: 方案 B——共享 Dialog 增加 `variant?: 'default' | 'paper'` 变体（默认 default 零破坏），联系弹窗启用，站点装饰语言留在消费侧。** 分层：组件包只拥有「纸的语言」（surface 发丝线边框 + `--elevation-soft`、圆角走 `--border-radius-base`、Header 分割线改渐隐墨线——两端透明中段 `color-mix(primary 45%)`，与导航下划线同源）；钤印 badge、两栏错峰入场留在 apps/site（title 本就是 ReactNode，ContactArea 组合「印章 + 渠道名 联系」，印章实现挂 ContactCard.tsx 导出）——组件包不拥有站点装饰语言。ContactCard 层：两栏比例与层级精修（name/handle/tagline 字号留白、Info 顶部对齐）、560 裸断点收敛至 `BREAKPOINTS.mobile`(640) 与弹窗底部滑入同轴、`rgba` 硬编码边框改 `color-mix` token、打开后两栏 `write-fade` 错峰入场（QR 区 0ms / 信息区 +80ms）、ActionArea hover 过渡收敛到 motion token；弹窗宽度 760→`min(640px, calc(100vw - 32px))` 降低空旷感。**设计稿确认后追加：ActionArea 3D 指针手势**（纸张随指尖轻抚而倾）——`perspective(700px) rotateX/rotateY` 倾角 ±12° 由 pointermove 跟踪指针、140ms ease-out 过渡惯性跟手；`transform-style: preserve-3d` 下二维码白边裱框 `translateZ(28px)` 浮于纸面形成层深；`.action::after` 径向高光跟随指针位置（`--gx/--gy`），色取 `--accent-color` 暖金（wine #E3B567 / plain #C89060；纯白高光在 wine light 奶白纸面上零对比不可见——预览评审已证伪并修正），且光层 `translateZ(裱框+6px)` 越过裱框罩全纸面；CSS 变量由 `ref.current.style.setProperty` 直写 DOM 不经 React state（动效不触发重渲）；启用条件 `(hover: hover) and (pointer: fine)`，触屏设备不绑定监听、`prefers-reduced-motion` 停用（pointermove 与 transition 同停，hover 上浮保留为纯静态）；点击语义不变（二维码进 ImagePreview、链接照常跳转）。**`design-preview.html` 为本次变更的视觉验收基准**：四主题渲染效果与 3D 三参数为实施与验收的对齐目标，参数定稿值（用户在预览滑杆确认）：**倾角 ±12° / 浮起 translateZ 28px / 透视 700px**。
- **对比方案:**
  - 方案 A 消费侧精修（不动共享 Dialog）：影响面最小，但纸张风语言沉淀在单一消费方内无法复用，且用户明确选择组件化方向——否决。
  - 方案 C 仅修复断点与层级不深化：不回应视觉深化诉求——否决。
  - 3D 手势用 framer-motion `useMotionValue`/`useTransform`：仓库虽已有 motion 依赖，但单个倾斜效果引运行时进首屏 chunk 不成比例（联系弹窗本身是 dynamic 加载的叶子组件），且 ref 直写 CSS 变量零重渲更简单——否决。
  - 3D 手势倾角与跟随范围：初版 ±5° 在预览中不可感知（用户反馈），提至 ±12° 后「纸在动」成立且 640px 弹窗内无晕动；作用域限 ActionArea——信息区跟随会与文字阅读争焦点，动效语言「结构即信息」下只让被交互物件（码/入口）动；定稿权交给设计稿滑杆（0–20°），实施值以用户滑杆定稿为准。
- **理由:** variant 默认值保证其余 4 个消费方（AboutView、GuestbookBarrageDialog、ArticleExporter、ShareCard）零回归；行为约束（遮罩关闭/44px/底部滑入/scroll lock/Escape/焦点管理）全部不动，只动视觉层，符合 contact-dialog.md「不得复制独立弹窗」红线；所有新样式走 token + transient prop + BREAKPOINTS 常量，暗色经 `data-color-scheme` 自动生效；reduced-motion 下错峰动画停用。已知代价：需同步更新 contact-dialog.md（变体接口 + 联系弹窗新尺寸）。

## 任务

### Phase 1 — Dialog paper 变体（packages/components）

- [x] `specs.tsx` + `index.tsx` + `styles/index.tsx`：`variant?: 'default' | 'paper'` 透传 transient `$variant` 至 DialogSurface/DialogHeader/DialogBody/DialogFooter；paper 分支——surface 边框改 `color-mix(in oklab, var(--normal-300) ~45%, transparent)` 发丝线、阴影 `--elevation-soft`、圆角 `--border-radius-base`；Header 分割线改渐隐墨线（两端 transparent、中段 `color-mix(in oklab, var(--primary-color) 45%, var(--normal-300))`）；bottom placement 几何（顶部圆角底部直角、拖拽条、max-height 80vh）与 44px 关闭触达区保持不变；default 分支样式零改动
- [x] `index.test.mjs`：新增守卫——variant prop 存在于 DialogProps、$variant 透传、paper 分支样式在位、default 分支不受 paper 规则污染；既有 4 条断言不回归

### Phase 2 — 联系弹窗消费侧（apps/site）

- [x] `ContactArea.tsx`：Dialog 挂 `variant='paper'`、宽度改 `min(640px, calc(100vw - 32px))`；title 组合印章——渠道名首字钤印（参照「墨」印：印框 `color-mix(primary 45%, transparent)`、衬线印面、`--border-radius-xs`、装饰非交互无 aria），印章组件由 `ContactCard.tsx` 导出
- [x] `ContactCard.tsx`：信息层级精修（Name/Handle/Role/Tagline 字号留白与顶部对齐）；ActionArea `rgba(0,0,0,0.06)` 硬编码边框改 `color-mix` token、hover 过渡走 motion token（150-300ms ease-out）；hints 发丝线与 paper 变体对齐；两栏 `write-fade` 错峰入场（QR/入口区 0ms、信息区 80ms），`prefers-reduced-motion` 停用
- [x] `ContactCard.tsx` 3D 手势：ActionArea 挂 `perspective(700px) rotateX/rotateY(±12°)` 指针跟踪（定稿值经用户滑杆确认：倾角 ±12° / 浮起 28px / 透视 700px；pointermove `ref.current.style.setProperty` 直写 `--rx/--ry/--gx/--gy`，不经 React state）、140ms ease-out 惯性、`transform-style: preserve-3d` + 裱框 `translateZ(28px)` 层深、`::after` 径向高光跟随（`--accent-color` 暖金、光层 `translateZ(裱框+6px)` 越过裱框罩全纸面）；启用条件 `(hover: hover) and (pointer: fine)`，触屏不绑监听；`prefers-reduced-motion` 停用倾斜与高光位移（保留静态上浮与光泽淡入）；点击语义不变（QR 进 ImagePreview / 链接跳转）
- [x] `ContactCard.tsx` 响应式：560px 裸断点收敛至 `BREAKPOINTS.mobile`(640) 与弹窗底部滑入同轴；移动端堆叠居中、二维码尺寸与触达不变；移动端不启用 3D（hover:none）
- [x] `apps/site/test/contact-dialog-paper.test.mjs`：新守卫——variant 传递、宽度 640、印章无障碍语义（装饰性 aria-hidden）、560 断点清除与 640 同轴、错峰 animation-delay、硬编码 rgba 禁令、3D 守卫（perspective/倾角常量与滑杆定稿值一致/setProperty 直写/启用条件 matchMedia 在位、reduced-motion 停用分支在位）；变异验证至少 2 轮

### Phase 3 — 回归与验证

- [x] 其余 4 个 Dialog 消费方（AboutView/GuestbookBarrageDialog/ArticleExporter/ShareCard）default 路径抽查 + `pnpm exec tsc --noEmit` 干净
- [x] 浏览器实测：桌面（1280）+ 移动（375）、亮/暗 × wine/plain 四主题、7 渠道弹窗逐一开合、Escape/遮罩/关闭钮三路关闭、reduced-motion 模拟；3D 手势——与设计稿 `design-preview.html` 并排比对（本稿即验收基准），指针扫过四角时 `--rx/--ry` 极值 ≈ 定稿倾角 ±12° 且方向正确、移出归零、裱框 `translateZ(28px)` 层深与暖金光环（含 wine light 纸面可见性）可见（截图对比）、`(hover:none)` 模拟触屏无监听绑定、reduced-motion 下倾斜停用、点击照常进 ImagePreview/新窗口

## 结果

- 交付发布: PR #389 merged（`6f0a09c`）后发布 GitHub Release [v1.4.25](https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.25) @ `3f9653e`（手动 `gh release create --title "v1.4.25 联系弹窗纸张风精修 + 二维码 3D 指针手势" --notes-file <结构化 changelog> --target <sha>`），CI-CD release run `35095829593` 全 7 jobs success（quality-gate → prepare → prepare-deps → build-next/build-nest → staging-test ✓48s → switch-traffic ✓1m3s）。**该步骤初版 shadow-dev 工作流未覆盖、由用户指出后补执行**；工作流已在源仓库为 release 技能补「交付发布（项目条件性）」步骤，本记录同时作为 build-config.md 发布段更新的 source 锚点
- 实际耗时: 2026-09-16（propose→设计稿对齐→实施→验证同日完成）
- 验证:
  - 守卫测试：`packages/components/dialog/index.test.mjs` 8/8 绿（variant 契约 4 + 既有结构/行为约束 4）；`apps/site/test/contact-dialog-paper.test.mjs` 12/12 绿（paper 挂载/钤印/断点/rgba 禁令/错峰/3D 契约/降级/渠道切换重挂/handle 等宽/hints 墨点）；`pnpm exec tsc --noEmit` 干净
  - 变异验证 3 轮全部「改坏必红」：TILT_DEG 12→6 →倾角守卫红；删 hover matchMedia 行 →降级守卫红；抽 Body `$variant` 透传 →index 透传守卫红；均恢复后全绿
  - 浏览器实测（IAB，dev server + Node v22，桌面 1280 / 移动 375）：paper 表面 computed 命中（宽 640、发丝线 `color-mix(normal-300 45%)`、`--elevation-soft`、圆角 8px）；header `::after` 渐隐墨线 1px linear-gradient 在位；钤印「微」22×22、印框 primary 45%、衬线、`aria-hidden`；七渠道钤印 微/Q/T/G/豆/云/D 与 title/aria/元素类型（BUTTON/A）逐一命中；错峰 animation-delay 80/160ms computed 确认；3D 手势真实鼠标轨迹探测——左上 rx +10.86°/ry −10.85°、右下反号、中心归零（±12° 上限）、裱框 translateZ 28px 与光层 34px matrix3d 在位、`--gx` 跟随；plain-dark 主题（localStorage 双键契约 `wuh.site.theme` + `wuh.site.color-scheme-mode`）表面/阴影/高光/钤印全部随 token 反转；移动 375 底部抽屉：拖拽条、radius 16/0、maxH 80vh、单列居中、hints 纵排；截图三张目验（wine-light 桌面、wine-light 移动、plain-dark 链接模式）与设计稿一致
  - 已知环境限制：IAB 后台标签页动画时钟冻结（enter/exit 动画 currentTime=0 不前进），animationend 永不触发导致卸载链在测量环境不可达；但 fiber 探测证实 closing state 提交正常、CSSOM 证实 enter(`jmMSuD`)→exit(`hNyUhb`) 动画名切换正确——关闭链路（Escape/遮罩/× 三路）状态机与样式完整，卸载依赖的 animationend 为 Dialog 既有行为、非本次改动面。触屏 `hover:none` 不绑监听分支与 reduced-motion 停用分支无法在 IAB 硬件态模拟（matchMedia 恒 fine），以源码守卫 + 站点 motion.ts 全局降级规则背书。二维码图在测量环境因 CDN 外链不可达显示 Skeleton，不影响布局验证
- 实施偏差记录:
  - **审查轮修复（第 1 轮发现的正确性缺陷）**：3D 监听 `useEffect` deps 原为 `[]`，渠道切换二维码↔链接会重建 ActionArea 的 DOM 节点（`<button>`↔`<a>`），监听器留在旧节点 → 切渠道后倾斜失效（apply 轮 7 渠道横扫只验 title/aria 漏检）。修复：deps → `[hasLink]`、`hasQR/hasLink` 前移；新增守卫「渠道切换后监听器重挂」（变异 `[]` 必红）；浏览器回归实证：微信开→切 GitHub→真实鼠标 rx +9.53°/ry −10.04°、gx 8.2%
  - 钤印 `Seal` 定义在 `ContactArea.tsx`（task-3 原文「由 ContactCard.tsx 导出」）：ContactCard 是 `dynamic(loading:null)`，印章进 Dialog title 槽、需在弹窗壳层立即可见，从动态 chunk 导出会随加载闪失；组件边界因此更合理（title 属弹窗壳=ContactArea 持有）
  - `$variant` 未透传 `DialogFooter`（task-1 原文含 Footer）：paper 语言无 footer 规则、联系弹窗无 footer 场景，按 code-style「不为未来场景提前加抽象」省略；守卫按「≥3 处透传」锚定
  - 传播事实（不扩面处理）：`AboutView/index.tsx` 复用同一 `ContactCard`（其 Dialog 壳保持 default 760px 无印）——卡片侧精修/3D/断点自然传导至 About 联系弹窗，壳层维持原样属渐进式治理边界；后续如统一 About 弹窗，单开变更复用 `variant='paper'` 即可（正是方案 B 选型的回报）
  - Knowledge 候选更新留待 ship 阶段：`contact-dialog.md` 需补 paper 变体接口、联系弹窗 640 同轴断点、3D 手势规格（±12°/28px/700px/accent 暖金高光）与钤印标题结构

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/contact-dialog.md
- **理由:** Dialog 新增 paper 变体接口、联系弹窗宽度/断点/入场动效变更，卡片「当前结论」需同步（含移动端断点从卡片描述的既有布局到 640 同轴的更新、ActionArea 3D 指针手势规格）；design-system.md 无需变更——本次只复用既有语言（渐隐墨线、钤印、write-fade），3D 手势为联系弹窗单点交互不升为全站规则（animation-system.md 若已覆盖「指针跟手动效」类模式则届时核对，apply 阶段确认）。
