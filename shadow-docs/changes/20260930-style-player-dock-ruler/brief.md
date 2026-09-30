---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-style-player-dock-ruler",
  "type": "style",
  "scope": "packages/components/audio-player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260930-style-player-dock-ruler",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "shadow-docs/knowledge/music-player.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 420,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/420",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "5363be3e7aad8a241ae70cda8e128cee3fec3b83",
    "verifiedAt": "2026-09-30T02:54:30.832Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:420",
    "planHash": "93e45ae4ec87518a76ddec6732ccc4059a74e6631b5d5559912354db9bd0e471",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 播放面板「控制甲板」二轮——度曲尺进度与居中传输构图",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\nv1.4.36「控制甲板」补齐 gutter 与控件语言后，用户实测截图再次圈出整块甲板要求重设计（同区域第二轮）。现甲板是三条细弱横条——全宽细滑杆 + 两端微缩时间码、左聚的三枚传输钮、模式带 + 音量——构图松散：传输钮在约 370px 的左栏里左聚失衡、进度条存在感弱、三行各说各话，在晕染纸底上「漂」着。本变更不动既有语言（凹槽几何、下划线模式带、碟面环、幽灵传输），只换构图：进度做成带刻度的尺，时间码嵌尺两端，传输钮居中，让甲板读作一件仪表而非三条碎条。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 面板为晕染纸底五层配方 + 控制甲板（栅格 gutter、凹槽滑杆、幽灵传输、下划线模式带、碟面环）+ 弹层滚动锁\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只经语义 token；淡化色统一 `color-mix(in oklab, var(--text-color) 72%, transparent)`；断点只用 `BREAKPOINTS` 语义常量；动态状态挂 transient prop 不用跨组件插值选择器；`font` 简写不得排在 `font-size` 之后\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: audio-player 站点专属例外（本地 keyframes + `--motion-*` 引用自持）；reduced-motion 必须降级；transition 禁布局属性（指针/刻度动效只能 transform）\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/icon-system.md\n  - 当前结论: 图标恒为 outline 线框、strokeWidth 2，从 `@wuh.site/components/icons` 具名导出；本变更不新增图标\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/components.md\n  - 当前结论: 播放器纸墨语言纪律由 style 门禁固化：禁裸十六进制色、禁裸断点数值、禁 `--text-secondary`、transition 禁布局属性、aria-label / `prefers-reduced-motion` 在场\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 方案 B「度曲尺」——用户从三个高保真原型（A 盘芯纸牌 / B 度曲尺 / C 墨时刻，截图存 `.shots/panel-dock-explore/`，真实 2025 年度歌单数据 + 运行时 token）中选定。四件事：\n  1. **刻度尺进度（签名元素）**：进度滑杆重构为「尺」——刻度层两组 `repeating-linear-gradient`：细刻（约 2.5% 间距、1px、墨 26%）+ 主刻（30 秒一道、1.5px、墨 42%），已播段再叠两层朱砂刻度（宽度由既有 `$fill` transient prop 驱动，与凹槽滑杆同机制）；播放头为 2×22px 朱砂指针（`left: $fill%` + 主色 14% 软环）。**交互保持原生 `<input type=\"range\">`**：视觉透明化（appearance none、track/thumb 透明）叠在尺上，拖拽/键盘/读屏 slider 语义零降级；`$fill` 计算与 seek 逻辑照旧。\n  2. **时间码嵌尺两端**：移除 `TimeRow` 独立条；mono 时间码与尺同一 flex 行——已播 `INK_MUTED` 居左、总长 `INK_FAINT` 居右，`line-height: 1` 与尺中线对齐。\n  3. **传输钮居中**：`ControlRow` 桌面 `justify-content: center`（移动端已居中），修复左聚失衡；碟面 64px、碟面环 `::after` 与幽灵钮 hover 语言不变。\n  4. **模式带与音量行维持**：下划线选中语言 + 凹槽音量 120px 原样保留——凹槽几何自此与进度尺分工：尺=仪表，槽=调节。\n- **对比方案:**\n  - 方案 A「盘芯纸牌」——甲板收成半透纸卡、进给沟槽嵌卡缘：存在感最强，但给面板添第四层表面，与歌词/列表列罩叠加易闷，未选。\n  - 方案 C「墨时刻」——已播时刻 30px 等宽放大为展示元素：排版最静，但时间属装饰性信息、主题性弱于尺，未选。\n- **理由:** 刻度与 /music「年谱刻度带」同一血统（站点已验证的选中/刻度语言），时长由看得见的刻度承载而不只靠数字；时间码嵌尺两端省掉一条碎横条；传输居中让甲板对称成「仪表盘芯」。全部要素从既有语言生长，不引入新颜色、新字体、新断点；暗色经 token 自动跟随；移动端 dock 吸底下「尺 + 居中传输 + 模式带」自然成立（音量仍隐藏）。\n- **边界:** 只动 `PlayerPanel.tsx` 样式层与 `player-panel.test.mjs` 门禁；provider/specs/MiniPlayer/公开 API、弹层滚动锁、Escape/焦点管理不动；移动端布局骨架（header/tabs/body/dock）不动，仅继承新甲板构图。\n\n## 任务\n### Phase 1\n\n- [ ] task 1 — `packages/components/audio-player/player-panel.test.mjs` — source guard 先行：新增刻度尺断言（双层 `repeating-linear-gradient` 刻度、`$fill` 驱动已播层宽与指针位置、原生 range 透明覆盖在场、`TimeRow` 移除且时间码与尺同行、`ControlRow` 桌面 `justify-content: center`）；音量凹槽、幽灵传输、模式带、晕染纸底、滚动锁等既有断言保持全绿\n- [ ] task 2 — `packages/components/audio-player/PlayerPanel.tsx` — 按决策实施：RulerRow（刻度双层 + 指针 + `$fill`）、透明 range 覆盖保 seek、时间码嵌两端、ControlRow 居中；移动端吸底 dock 排版复核；focus-visible 走查\n\n### Phase 2\n\n- [ ] task 3 — 验证 — `node --test packages/components/audio-player/*.test.mjs` 全绿；根 `pnpm exec tsc --noEmit` + oxlint 干净；浏览器真数据目检（wine × light/dark + plain × light，桌面 1256×1080 + 移动 390），覆盖播放/暂停两态、进度拖动、模式三态、reduced-motion、focus-visible\n- [ ] task 4 — `shadow-docs/knowledge/music-player.md` — 控制甲板段更新：进度=度曲尺（刻度/指针/透明 range 覆盖）、时间码嵌两端、传输居中，音量维持凹槽的分工表述；标注 verified-depth: runtime\n\n完整 brief：shadow-docs/changes/20260930-style-player-dock-ruler/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-style-player-dock-ruler\",\"type\":\"style\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-style-player-dock-ruler/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/changes/20260930-style-player-dock-ruler",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(player): 播放面板「控制甲板」二轮——度曲尺进度、时间码嵌尺与传输居中"
    }
  },
  "knowledge": null
}
---

# 播放面板「控制甲板」二轮——度曲尺进度与居中传输构图

## 动机

v1.4.36「控制甲板」补齐 gutter 与控件语言后，用户实测截图再次圈出整块甲板要求重设计（同区域第二轮）。现甲板是三条细弱横条——全宽细滑杆 + 两端微缩时间码、左聚的三枚传输钮、模式带 + 音量——构图松散：传输钮在约 370px 的左栏里左聚失衡、进度条存在感弱、三行各说各话，在晕染纸底上「漂」着。本变更不动既有语言（凹槽几何、下划线模式带、碟面环、幽灵传输），只换构图：进度做成带刻度的尺，时间码嵌尺两端，传输钮居中，让甲板读作一件仪表而非三条碎条。

## 复杂度评级

- **评级:** S
- **理由:** 单文件样式层（`PlayerPanel.tsx`）+ 门禁测试；无契约变更（provider/specs/公开 API、播放与降级语义、滚动锁、焦点管理全不动）；进度交互仍是原生 `<input type="range">`，可访问性零降级。
- **期望验证深度:** runtime（node --test 全绿 + 根 tsc/oxlint 干净 + 真数据四主题截图目检）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 面板为晕染纸底五层配方 + 控制甲板（栅格 gutter、凹槽滑杆、幽灵传输、下划线模式带、碟面环）+ 弹层滚动锁
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只经语义 token；淡化色统一 `color-mix(in oklab, var(--text-color) 72%, transparent)`；断点只用 `BREAKPOINTS` 语义常量；动态状态挂 transient prop 不用跨组件插值选择器；`font` 简写不得排在 `font-size` 之后
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/animation-system.md
  - 当前结论: audio-player 站点专属例外（本地 keyframes + `--motion-*` 引用自持）；reduced-motion 必须降级；transition 禁布局属性（指针/刻度动效只能 transform）
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/icon-system.md
  - 当前结论: 图标恒为 outline 线框、strokeWidth 2，从 `@wuh.site/components/icons` 具名导出；本变更不新增图标
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/components.md
  - 当前结论: 播放器纸墨语言纪律由 style 门禁固化：禁裸十六进制色、禁裸断点数值、禁 `--text-secondary`、transition 禁布局属性、aria-label / `prefers-reduced-motion` 在场
  - 适用 scope: packages/components/audio-player

## 决策

- **选型:** 方案 B「度曲尺」——用户从三个高保真原型（A 盘芯纸牌 / B 度曲尺 / C 墨时刻，截图存 `.shots/panel-dock-explore/`，真实 2025 年度歌单数据 + 运行时 token）中选定。四件事：
  1. **刻度尺进度（签名元素）**：进度滑杆重构为「尺」——刻度层两组 `repeating-linear-gradient`：细刻（约 2.5% 间距、1px、墨 26%）+ 主刻（30 秒一道、1.5px、墨 42%），已播段再叠两层朱砂刻度（宽度由既有 `$fill` transient prop 驱动，与凹槽滑杆同机制）；播放头为 2×22px 朱砂指针（`left: $fill%` + 主色 14% 软环）。**交互保持原生 `<input type="range">`**：视觉透明化（appearance none、track/thumb 透明）叠在尺上，拖拽/键盘/读屏 slider 语义零降级；`$fill` 计算与 seek 逻辑照旧。
  2. **时间码嵌尺两端**：移除 `TimeRow` 独立条；mono 时间码与尺同一 flex 行——已播 `INK_MUTED` 居左、总长 `INK_FAINT` 居右，`line-height: 1` 与尺中线对齐。
  3. **传输钮居中**：`ControlRow` 桌面 `justify-content: center`（移动端已居中），修复左聚失衡；碟面 64px、碟面环 `::after` 与幽灵钮 hover 语言不变。
  4. **模式带与音量行维持**：下划线选中语言 + 凹槽音量 120px 原样保留——凹槽几何自此与进度尺分工：尺=仪表，槽=调节。
- **对比方案:**
  - 方案 A「盘芯纸牌」——甲板收成半透纸卡、进给沟槽嵌卡缘：存在感最强，但给面板添第四层表面，与歌词/列表列罩叠加易闷，未选。
  - 方案 C「墨时刻」——已播时刻 30px 等宽放大为展示元素：排版最静，但时间属装饰性信息、主题性弱于尺，未选。
- **理由:** 刻度与 /music「年谱刻度带」同一血统（站点已验证的选中/刻度语言），时长由看得见的刻度承载而不只靠数字；时间码嵌尺两端省掉一条碎横条；传输居中让甲板对称成「仪表盘芯」。全部要素从既有语言生长，不引入新颜色、新字体、新断点；暗色经 token 自动跟随；移动端 dock 吸底下「尺 + 居中传输 + 模式带」自然成立（音量仍隐藏）。
- **边界:** 只动 `PlayerPanel.tsx` 样式层与 `player-panel.test.mjs` 门禁；provider/specs/MiniPlayer/公开 API、弹层滚动锁、Escape/焦点管理不动；移动端布局骨架（header/tabs/body/dock）不动，仅继承新甲板构图。

## 任务

### Phase 1

- [x] task 1 — `packages/components/audio-player/player-panel.test.mjs` — source guard 先行：新增刻度尺断言（双层 `repeating-linear-gradient` 刻度、`$fill` 驱动已播层宽与指针位置、原生 range 透明覆盖在场、`TimeRow` 移除且时间码与尺同行、`ControlRow` 桌面 `justify-content: center`）；音量凹槽、幽灵传输、模式带、晕染纸底、滚动锁等既有断言保持全绿
- [x] task 2 — `packages/components/audio-player/PlayerPanel.tsx` — 按决策实施：RulerRow（刻度双层 + 指针 + `$fill`）、透明 range 覆盖保 seek、时间码嵌两端、ControlRow 居中；移动端吸底 dock 排版复核；focus-visible 走查

### Phase 2

- [x] task 3 — 验证 — `node --test packages/components/audio-player/*.test.mjs` 全绿；根 `pnpm exec tsc --noEmit` + oxlint 干净；浏览器真数据目检（wine × light/dark + plain × light，桌面 1256×1080 + 移动 390），覆盖播放/暂停两态、进度拖动、模式三态、reduced-motion、focus-visible
- [x] task 4 — `shadow-docs/knowledge/music-player.md` — 控制甲板段更新：进度=度曲尺（刻度/指针/透明 range 覆盖）、时间码嵌两端、传输居中，音量维持凹槽的分工表述；标注 verified-depth: runtime

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 控制甲板段「进度与音量共用凹槽滑杆」的事实被「进度尺（仪表）/ 音量槽（调节）」的分工取代，需改写；度曲尺与年谱刻度带的血统关系值得沉淀为长期组件事实。
