---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-feature-progress-component",
  "type": "feature",
  "scope": "components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20260930-feature-progress-component",
  "files": [
    "apps/site/app/design/system-color/page.tsx",
    "apps/site/app/design/system-color/styles/index.tsx",
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/mini-player.test.mjs",
    "packages/components/progress/index.test.mjs",
    "packages/components/progress/index.tsx",
    "packages/components/progress/readme.md",
    "packages/components/progress/specs.tsx",
    "packages/components/progress/styles/index.tsx",
    "shadow-docs/changes/20260930-feature-progress-component/brief.md",
    "shadow-docs/knowledge/components.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 423,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/423",
    "pullRequest": 426,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/426"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "f8fe7c557e24edc7d86b2d666829c303cbced338",
    "verifiedAt": "2026-09-30T06:36:48.841Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:426",
    "planHash": "e2fec62b13e1f794d69bc945c10ff455759b55507fbe4cc5bde62a02c3243bf0",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] Progress 组件——纸墨「运笔」双态进度条",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n组件包内没有独立的进度表达：站点现有两处进度都是站点专属实现（博客阅读进度条走 `animation-timeline: scroll(root)` 伪元素，播放器 GrooveSlider 是交互滑杆），共享包内「有百分比的确定进度」与「无百分比的进行中」双双缺位。补一个符合纸墨语言的双态 Progress 组件（`@wuh.site/components/progress`），供站点与控制台后续消费，并在 `/design/system-color` 挂试墨演示位。\n\n## 引用规范\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只经主题变量（`--primary-color`/`--normal-*`/`--background-*`），淡化用 `color-mix(in oklab, ...)` 禁 `--text-secondary`；间距/圆角经 `--space-*`/`--border-radius-*`；字体只引 `--font-sans`/`--font-serif`/`--font-mono`\n  - 适用 scope: packages/components/progress 全部样式\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: packages/components 共享组件不得引用 `--motion-*`（console 不注入主题变量）；本地 keyframes 需 `css` 帮助函数包裹 + `prefers-reduced-motion` 降级\n  - 适用 scope: 动画时长自持字面量（Skeleton 1.6s 先例）；不确定态行笔 keyframes 本地定义\n- shadow-docs/knowledge/components.md\n  - 当前结论: exports map `./*` 通配无需注册；组件结构 index.tsx(`'use client'`) + specs.tsx + styles/ + index.test.mjs + readme.md（Divider 先例）\n  - 适用 scope: packages/components/progress 目录结构与导出方式\n- shadow-docs/knowledge/blog-scroll-behavior.md\n  - 当前结论: 阅读进度保持纯 CSS `scroll(root)`，禁止 JS scroll/resize 监听\n  - 适用 scope: Progress 是 value 驱动的展示组件，不接管滚动进度，不引入任何滚动监听\n- shadow-docs/knowledge/music-player.md（GrooveSlider）\n  - 当前结论: 播放器滑杆是面板签名交互元素\n  - 适用 scope: Progress 只读展示、不可拖拽，不与 GrooveSlider 语义混淆\n\n## 决策\n- **选型:** 方案 A「运笔」——发丝线轨道（Divider 同款 `color-mix(var(--normal-400) 55%)`；md 3px / sm 2px 档，`--progress-height` 可覆写）+ 朱砂填充 `transform: scaleX(0→value)` 自左向右铺墨（与导航下划线同一支运笔笔顺，合成器动画不触布局属性）；不确定态为签名时刻：两端渐隐朱砂墨迹（ornament 的 `transparent→primary` 渐变语言）沿轨道往复行笔；可选 `showLabel` 挂 `--font-mono` 淡墨百分比\n- **对比方案:** B「墨尺」（刻度小尺寸糊成噪点需响应式藏，年谱刻度带语言形似神不似）；C「落印」（印章语义是动作入口非计量符号，完成动效多余）\n- **理由:** 三个既有语言各归其位——发丝线=结构、运笔=进度方向、渐隐=墨迹边缘；bold 集中在不确定态行笔一处，确定态保持安静。reduced-motion 下不确定态静止为半程静态墨迹（仍传达「进行中」）。无障碍：`role='progressbar'` + `aria-valuenow/min/max`，indeterminate 态不设 valuenow 并带 `aria-label`\n\n## 任务\n### Phase 1\n- [ ] task 1 — `packages/components/progress/specs.tsx` — ProgressProps 类型：`value?: number`（0–100，缺省进 indeterminate）、`showLabel?: boolean`、label 语义；导出类型\n- [ ] task 2 — `packages/components/progress/styles/index.tsx` — 发丝轨道 + scaleX 填充 + 行笔 keyframes（`css` 包裹条件动画）+ reduced-motion 静态墨迹降级 + showLabel mono 淡墨\n- [ ] task 3 — `packages/components/progress/index.tsx` — `'use client'`、role='progressbar'、aria 值链路、indeterminate 分支、showLabel 百分比\n- [ ] task 4 — `packages/components/progress/index.test.mjs` — 源码守卫：禁裸十六进制色、keyframes 必须 `css` 包裹、reduced-motion 块在场、aria 属性在场、禁 `--motion-*` 引用\n- [ ] task 5 — `packages/components/progress/readme.md` — 双态用法说明\n\n### Phase 2\n- [ ] task 6 — `apps/site/app/design/system-color/page.tsx` + `apps/site/app/design/system-color/styles/index.tsx` — 页尾挂「Progress 试墨」块：确定态（约 62%）+ 不确定态各一条，供四主题截图目检\n\n完整 brief：shadow-docs/changes/20260930-feature-progress-component/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-feature-progress-component\",\"type\":\"feature\",\"scope\":\"components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-feature-progress-component/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "apps/site/app/design/system-color/page.tsx",
        "apps/site/app/design/system-color/styles/index.tsx",
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/progress/index.test.mjs",
        "packages/components/progress/index.tsx",
        "packages/components/progress/readme.md",
        "packages/components/progress/specs.tsx",
        "packages/components/progress/styles/index.tsx",
        "shadow-docs/changes/20260930-feature-progress-component/brief.md",
        "shadow-docs/knowledge/components.md"
      ],
      "message": "feat(progress): 新增纸墨运笔双模态进度条——白文方印「樂」光标，MiniPlayer 细线接入共享组件"
    }
  },
  "knowledge": null
}
---

# Progress 组件——纸墨「运笔」双模态进度条（v2 光标客制化）

> v2 修订（UI 稿评审后）：组件升级双模态（显示 + 交互）并加光标客制化，目标承接播放器进度条替换；与并行 dock-ruler 在飞改动的协调裁决为「组件先行，替换分两步」。GitHub issue #423 正文为 v1 快照，以本 brief 为准。

## 动机

组件包内没有独立的进度表达：站点现有两处进度都是站点专属实现（博客阅读进度条走 `animation-timeline: scroll(root)` 伪元素，播放器 GrooveSlider 是交互滑杆），共享包内「有百分比的确定进度」「无百分比的进行中」与「可拖拽的进度滑杆」三类表达缺位。补一个符合纸墨语言的**双模态** Progress 组件（`@wuh.site/components/progress`）：只读展示（progressbar）+ 交互滑杆（原生 range 底座），光标可客制化——使播放器相关的全部进度条（MiniPlayer 细线、PlayerPanel 进度/音量）后续可统一替换为本组件，并在 `/design/system-color` 挂试墨演示位。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只经主题变量（`--primary-color`/`--normal-*`/`--background-*`），淡化用 `color-mix(in oklab, ...)` 禁 `--text-secondary`；间距/圆角经 `--space-*`/`--border-radius-*`；字体只引 `--font-sans`/`--font-serif`/`--font-mono`
  - 适用 scope: packages/components/progress 全部样式
- shadow-docs/knowledge/animation-system.md
  - 当前结论: packages/components 共享组件不得引用 `--motion-*`（console 不注入主题变量）；本地 keyframes 需 `css` 帮助函数包裹 + `prefers-reduced-motion` 降级
  - 适用 scope: 动画时长自持字面量（Skeleton 1.6s 先例）；不确定态行笔 keyframes 本地定义
- shadow-docs/knowledge/components.md
  - 当前结论: exports map `./*` 通配无需注册；组件结构 index.tsx(`'use client'`) + specs.tsx + styles/ + index.test.mjs + readme.md（Divider 先例）
  - 适用 scope: packages/components/progress 目录结构与导出方式
- shadow-docs/knowledge/blog-scroll-behavior.md
  - 当前结论: 阅读进度保持纯 CSS `scroll(root)`，禁止 JS scroll/resize 监听
  - 适用 scope: Progress 是 value 驱动的展示组件，不接管滚动进度，不引入任何滚动监听
- shadow-docs/knowledge/music-player.md（GrooveSlider / 播放器进度条）
  - 当前结论: GrooveSlider（4px 发丝轨道 + 主色已播段 + 12px 纸色圆点滑块，hover scale 1.18 + 主色 28% 软环）为面板签名交互元素，技术底座是原生 `input[type=range]`（WebKit transient `$fill` 驱动 background-size / Firefox `::-moz-range-progress`）；并行 dock-ruler change 正在把 PlayerPanel 进度改为「度曲尺」（在飞未提交）
  - 适用 scope: 交互态沿用 GrooveSlider 已验证的 range 技术与光标语言；本次只替换 MiniPlayer 细线（读态），PlayerPanel 进度/音量替换等 dock-ruler 落地后另起 change

## 决策

- **选型:** 方案 A「运笔」——发丝线轨道（Divider 同款 `color-mix(var(--normal-400) 55%)`）+ 朱砂填充 `transform: scaleX(0→value)` 自左向右铺墨（与导航下划线同一支运笔笔顺，合成器动画不触布局属性）；不确定态为签名时刻：两端渐隐朱砂墨迹（ornament 的 `transparent→primary` 渐变语言）沿轨道往复行笔（1.9s，行笔 72% + 空轨半拍）；可选 `showLabel` 挂 `--font-mono` 淡墨百分比
- **对比方案:** B「墨尺」（刻度小尺寸糊成噪点需响应式藏，年谱刻度带语言形似神不似）；C「落印」（印章语义是动作入口非计量符号，完成动效多余）
- **理由:** 三个既有语言各归其位——发丝线=结构、运笔=进度方向、渐隐=墨迹边缘；bold 集中在不确定态行笔一处，确定态保持安静
- **v2 双模态:** 传 `onChange` 即交互态——原生 `input[type=range]` 底座（GrooveSlider 已验证的 WebKit `$fill` background-size / Firefox `::-moz-range-progress`），拖拽/键盘/读屏语义零降级；不传则只读 `role='progressbar'` + `aria-valuenow/min/max`，indeterminate 不设 valuenow
- **v2 光标（白文方印「樂」·定稿）:** 内置光标为白文方印——15×15 实心主色印面（radius 3px，无边框；空框方印 v2 已废：读作复选框）+ 纸色阴文「樂」（衬线 600，字面比 10/15 与 Header「墨」印 12/18 同比例）+ 微影落纸。悬停 `scale(1.12)` + 主色 24% 软晕；拖拽（range 原生 `:active`）`brightness(0.92)` + 晕收紧（按印入泥）。语义：印章立于墨迹尽头 = 笔势落款；实印 = 真章，不读作表单控件。**态语义（形动正交）**：`breathing` = **播放态**呼吸晕——曲在放印即活、暂停止息（消费方传 `breathing={playing}`）；`glyph="愛"` = 最爱（形上的区分）。播放中 + 最爱 = 「愛」印呼吸。呼吸晕走站点「微光呼吸」语言（自持 2.4s ease-in-out-soft keyframes，reduced-motion 静态晕）。Progress 不含「最爱/播放」领域知识，两信号皆由消费方组合
- **v2 光标客制化:** 字形经 `--progress-thumb-glyph` 换字/置空（置空即无字阴线框回退，防个别环境 10px 字形发糊）；尺寸/色经 `--progress-thumb-size` / `--progress-thumb-color` / `--progress-height` 改形，不动组件内部——与站点 CSS 变量主题机制同构。备选光标（圆纸点/笔锋/墨珠三案稿）留作变量可切
- **v2 替换协调:** 与并行 dock-ruler（度曲尺）裁决「组件先行，替换分两步」——本次落组件 + 试墨位 + MiniPlayer 细线替换（读态，不碰其在飞的 PlayerPanel 改动），PlayerPanel 进度/音量替换作为紧随的独立 change
- **无障碍:** 交互态走原生 range 的 slider 语义 + aria-label；显示态 `role='progressbar'`；reduced-motion 下不确定态静止为半程静态墨迹、光标 hover 缩放关闭

## 任务

### Phase 1
- [x] task 1 — `packages/components/progress/specs.tsx` — ProgressProps 类型：`value?: number`（0–100，缺省进 indeterminate）、`onChange?: (value: number) => void`（交互态开关）、`thumb?: boolean`（默认交互态 true / 显示态 false）、`glyph?: string`（印面字，默认「樂」）、`breathing?: boolean`（播放态呼吸晕）、`showLabel?: boolean`、`size?: 'sm' | 'md'`、aria label 语义；导出类型
- [x] task 2 — `packages/components/progress/styles/index.tsx` — 双模态样式：显示态发丝轨道 + scaleX 填充；交互态原生 range（WebKit `$fill` background-size / Firefox `::-moz-range-progress`）；白文方印「樂」光标（15×15 实心印面 + 阴文字 + 微影，hover 软晕，拖拽按印入泥，`breathing` 呼吸晕 keyframes 自持 2.4s，`--progress-thumb-*` 变量化）；行笔 keyframes（`css` 包裹条件动画）+ reduced-motion 静态墨迹降级；showLabel mono 淡墨
- [x] task 3 — `packages/components/progress/index.tsx` — `'use client'`、双模态渲染分支（div progressbar / input range）、aria 值链路、indeterminate 分支、showLabel 百分比
- [x] task 4 — `packages/components/progress/index.test.mjs` — 源码守卫：禁裸十六进制色、keyframes 必须 `css` 包裹、reduced-motion 块在场、aria 属性在场、禁 `--motion-*` 引用、双模态结构断言
- [x] task 5 — `packages/components/progress/readme.md` — 双模态用法 + 光标客制化变量说明

### Phase 2
- [x] task 6 — `apps/site/app/design/system-color/page.tsx` + `apps/site/app/design/system-color/styles/index.tsx` — 页尾挂「Progress 试墨」块：sm 细线 / 显示态+印光标 / 交互态 / 音量窄条 / 印光标播放呼吸态（`breathing` 活体演示，樂/愛双字）/ 不确定态，供四主题截图目检
- [x] task 7 — `packages/components/audio-player/MiniPlayer.tsx` — ProgressRow 的 ProgressTrack/ProgressValue 替换为 `Progress size="sm"`（读态，props 直读现有 progressPercent）；`packages/components/audio-player/mini-player.test.mjs` 如守卫需更新同步保绿（既有测试无 Progress 引用，预期零改动）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/components.md
- **理由:** 组件包新增成员，Progress 双模态语义、运笔视觉结论、光标 `--progress-*` 客制化约定与守卫测试纪律应入 components.md；PlayerPanel 全量替换落地后由后续 change 更新 music-player.md（本 change 不动播放器知识卡的结论段）
