---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-style-player-mobile-album-leaf",
  "type": "style",
  "scope": "player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260930-style-player-mobile-album-leaf",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "shadow-docs/knowledge/music-player.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 424,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/424",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "d9e1ff634760a2ab512c65f90ed64bef76a9428f",
    "verifiedAt": "2026-09-30T04:38:20.976Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:424",
    "planHash": "3151eee0e7f4a1543de9864406d9faf8da077dbd19f33d9f13af4d2f160f42ba",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 移动端播放面板重设计——册页",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n移动端面板是「全屏沉浸页」却最不沉浸（生产 v1.4.38 实测取证）：header/tabs/body/dock 四段横条堆叠形似设置页；封面仅 54px 横排小thumb、长歌名立即截断、歌手行被关闭钮挤压；歌词/列表仅点按切换、无任何手势；无词曲目（如《风月缠绵》）正文是整片死黑。桌面面板已经两轮定稿（#417/#418 控制甲板、#422 度曲尺），移动端补上自己的结构一轮。用户从三个原型（A 册页 / B 墨句帖 / C 经折册）中圈选 A。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 播放面板视觉语义——晕染纸底五层配方、歌词=签名元素（writeIn/墨随声走/朱砂侧标）、移动端网格 'header' 'tabs' 'body' 'dock'、度曲尺与甲板 2026-09-30 定稿、弹层滚动锁\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只经主题变量、断点只用 BREAKPOINTS、淡化色禁 --text-secondary（用 color-mix 72%）、font 简写顺序、aria-current 语义\n  - 适用 scope: 全站前端\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: packages/components/audio-player 是站点专属组件、关键帧与 --motion-* 引用自持（equalize 先例）；reduced-motion 必须降级\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/components.md\n  - 当前结论: 播放器纸墨语言纪律由同目录 style.test.mjs 门禁固化；图标用 icons 播放族具名导出\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 方案 A「册页」——移动端从四段横条改为对开册页：① 封面升装裱图版主角（纸质卡框：外发丝线框 + 纸边 inset + 图版内发丝线，衬线题名居中允许两行、去 ellipsis，歌手行居中淡化）；图版题签 mono 朱砂「曲 · 贰 / 一〇」（当前序号/队列总数）；② 歌词退为图版下方短词窗（约 150px，mask 上下渐隐，当前句加重、相邻淡化）；③ 播放列表为横翻对页（scroll-snap 容器，词页/目次页），页缘指示 ticks 即两个翻页按钮（可点、aria-label、aria-current），swipe 为增强、按钮保键盘与读屏可达；④ 顶部 grab 下滑关闭手柄 + CloseButton 保留；⑤ 甲板不动（度曲尺/传输钮/模式带 2026-09-30 两轮刚定稿，本次仅随布局挪 padding）。\n- **交互新增:** 下滑关闭手柄（touch 拖拽跟手 + 阈值回弹，reduced-motion 瞬移）；歌词点按跳播（LRC 行时间已存在，走既有 actions.seek，行加 button 语义或 role=button+tabIndex）；无词空态「词未录」印章式空态（朱砂印框 + 衬线字，替代死黑）。\n- **对比方案:** B 墨句帖（满屏词墙 + 目次底部抽屉）——满屏大歌词是主流音乐 App 通用形态、封面在移动端继续缺席；C 经折册（碟心 + 眉批/目次折页）——系统连贯但构图与现状最接近、改动感知最小。原型与截图存 .design/panel-mobile-explore/ 与 .shots/panel-mobile-explore/（燕无歇真 LRC + 2025 卷真数据）。\n- **理由:** 「馆藏册页」与 /music 编年碟心、桌面装裱封面同一书卷叙事，封面在移动端首次获得主角地位；词窗 + 目次对页同时消解「无词死黑」与「tab 仅点按」；题签编号让「第几首」成为版面信息而非装饰。\n- **遵循:** 颜色只走主题 token；断点只用 BREAKPOINTS；transition 禁布局属性；audio-player keyframes/--motion-* 自持例外继续；横翻页语义保按钮可达（不砍键盘路径）；style.test.mjs 门禁保持全绿并扩新守卫。\n\n## 任务\n### Phase 1\n- [ ] 移动端网格重构：'header' 'tabs' 'body' 'dock' → 册页结构（grab 手柄行 / pages 横翻容器 / dock），MobileTabs 退役改页缘翻页钮，CloseButton 保留 — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 装裱图版 + 题签：纸框卡（发丝线 + 纸边）、mono 朱砂题签「曲 · N / 总数」、衬线题名居中两行、歌手居中 — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 短词窗 + 无词空态：mask 渐隐词窗、当前句加重、点按跳播（seek）、「词未录」印章空态 — packages/components/audio-player/PlayerPanel.tsx\n- [ ] 目次对页 + 横翻：scroll-snap 容器、页缘 ticks 联动 aria-current、reduced-motion 降级 — packages/components/audio-player/PlayerPanel.tsx\n### Phase 2\n- [ ] TDD：player-panel.test.mjs 新增册页/词窗/题签/翻页守卫、调整旧移动端守卫；style.test.mjs 门禁全绿 — packages/components/audio-player/*.test.mjs\n- [ ] 运行时验证：dev 实测四主题 × 词页/目次页 移动 390 截图与原型比对、下滑关闭与歌词跳播交互走查、reduced-motion 走查 — 验证记录进 brief\n\n完整 brief：shadow-docs/changes/20260930-style-player-mobile-album-leaf/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-style-player-mobile-album-leaf\",\"type\":\"style\",\"scope\":\"player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-style-player-mobile-album-leaf/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/changes/20260930-style-player-mobile-album-leaf/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(player): 移动端播放面板重设计——册页：装裱图版、短词窗与目次横翻"
    }
  },
  "knowledge": null
}
---

# 移动端播放面板重设计——册页

## 动机

移动端面板是「全屏沉浸页」却最不沉浸（生产 v1.4.38 实测取证）：header/tabs/body/dock 四段横条堆叠形似设置页；封面仅 54px 横排小thumb、长歌名立即截断、歌手行被关闭钮挤压；歌词/列表仅点按切换、无任何手势；无词曲目（如《风月缠绵》）正文是整片死黑。桌面面板已经两轮定稿（#417/#418 控制甲板、#422 度曲尺），移动端补上自己的结构一轮。用户从三个原型（A 册页 / B 墨句帖 / C 经折册）中圈选 A。

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 播放面板视觉语义——晕染纸底五层配方、歌词=签名元素（writeIn/墨随声走/朱砂侧标）、移动端网格 'header' 'tabs' 'body' 'dock'、度曲尺与甲板 2026-09-30 定稿、弹层滚动锁
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只经主题变量、断点只用 BREAKPOINTS、淡化色禁 --text-secondary（用 color-mix 72%）、font 简写顺序、aria-current 语义
  - 适用 scope: 全站前端
- shadow-docs/knowledge/animation-system.md
  - 当前结论: packages/components/audio-player 是站点专属组件、关键帧与 --motion-* 引用自持（equalize 先例）；reduced-motion 必须降级
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/components.md
  - 当前结论: 播放器纸墨语言纪律由同目录 style.test.mjs 门禁固化；图标用 icons 播放族具名导出
  - 适用 scope: packages/components

## 决策

- **选型:** 方案 A「册页」——移动端从四段横条改为对开册页：① 封面升装裱图版主角（纸质卡框：外发丝线框 + 纸边 inset + 图版内发丝线，衬线题名居中允许两行、去 ellipsis，歌手行居中淡化）；图版题签 mono 朱砂「曲 · 贰 / 一〇」（当前序号/队列总数）；② 歌词退为图版下方短词窗（约 150px，mask 上下渐隐，当前句加重、相邻淡化）；③ 播放列表为横翻对页（scroll-snap 容器，词页/目次页），页缘指示 ticks 即两个翻页按钮（可点、aria-label、aria-current），swipe 为增强、按钮保键盘与读屏可达；④ 顶部 grab 下滑关闭手柄 + CloseButton 保留；⑤ 甲板不动（度曲尺/传输钮/模式带 2026-09-30 两轮刚定稿，本次仅随布局挪 padding）。
- **交互新增:** 下滑关闭手柄（touch 拖拽跟手 + 阈值回弹，reduced-motion 瞬移）；歌词点按跳播（LRC 行时间已存在，走既有 actions.seek，行加 button 语义或 role=button+tabIndex）；无词空态「词未录」印章式空态（朱砂印框 + 衬线字，替代死黑）。
- **对比方案:** B 墨句帖（满屏词墙 + 目次底部抽屉）——满屏大歌词是主流音乐 App 通用形态、封面在移动端继续缺席；C 经折册（碟心 + 眉批/目次折页）——系统连贯但构图与现状最接近、改动感知最小。原型与截图存 .design/panel-mobile-explore/ 与 .shots/panel-mobile-explore/（燕无歇真 LRC + 2025 卷真数据）。
- **理由:** 「馆藏册页」与 /music 编年碟心、桌面装裱封面同一书卷叙事，封面在移动端首次获得主角地位；词窗 + 目次对页同时消解「无词死黑」与「tab 仅点按」；题签编号让「第几首」成为版面信息而非装饰。
- **遵循:** 颜色只走主题 token；断点只用 BREAKPOINTS；transition 禁布局属性；audio-player keyframes/--motion-* 自持例外继续；横翻页语义保按钮可达（不砍键盘路径）；style.test.mjs 门禁保持全绿并扩新守卫。

## 任务

### Phase 1
- [x] 移动端网格重构：'header' 'tabs' 'body' 'dock' → 册页结构（grab 手柄行 / pages 横翻容器 / dock），MobileTabs 退役改页缘翻页钮，CloseButton 保留 — packages/components/audio-player/PlayerPanel.tsx
- [x] 装裱图版 + 题签：纸框卡（发丝线 + 纸边）、mono 朱砂题签「曲 · N / 总数」、衬线题名居中两行、歌手居中 — packages/components/audio-player/PlayerPanel.tsx
- [x] 短词窗 + 无词空态：mask 渐隐词窗、当前句加重、点按跳播（seek）、「词未录」印章空态 — packages/components/audio-player/PlayerPanel.tsx
- [x] 目次对页 + 横翻：scroll-snap 容器、页缘 ticks 联动 aria-current、reduced-motion 降级 — packages/components/audio-player/PlayerPanel.tsx
### Phase 2
- [x] TDD：player-panel.test.mjs 新增册页/词窗/题签/翻页守卫、调整旧移动端守卫；style.test.mjs 门禁全绿 — packages/components/audio-player/*.test.mjs
- [x] 运行时验证：dev 实测四主题 × 词页/目次页 移动 390 截图与原型比对、下滑关闭与歌词跳播交互走查、reduced-motion 走查 — 验证记录进 brief

## 结果
- 实际耗时: 约 3 小时（含原型三方案制作与截图比对）
- 验证:
  - `node --test packages/components/audio-player/*.test.mjs` **40/40**（新增 5 条册页守卫：横翻容器/装裱图版/短词窗/下滑手柄/网格结构，墨随声走守卫随实现更新为 dEl/mEl 双容器断言；旧 40 项全保持）
  - 根 `pnpm exec tsc --noEmit` 干净；oxlint 0 warnings / 0 errors
  - dev 实测移动 390：**九张截图**存 `.shots/panel-mobile-explore/`（impl-words-{wine,plain}-{light,dark} + impl-queue-{wine,plain}-{light,dark} + impl-empty-light 词未录空态 + impl-desktop-regression 桌面回归）与原型 A 构图比对一致
  - 交互实测：歌词点按跳播（进度 10.6s→62.6s 精确跳到行时间）、页缘钮翻页双向 + aria-current 联动、手柄/图版下拉关闭（合成 Touch 事件 160px > 96px 阈值 → togglePanel 生效）
  - **发现并修复一个实现缺陷**：面板打开时对队列高亮项的 `scrollIntoView({block:'nearest'})` 会把外层横翻容器一并横向滚走（实测面板被带去目次页、页缘钮失同步）——移动列表与词窗改手动垂直 `scrollTop`（只动纵向），桌面容器无包裹保持 scrollIntoView；QueueList 补 `position: relative` 供 offsetTop 定位
  - 已知测试环境限制：IAB 对程序化滚动抑制 scroll 事件（对照实验：临时 div 同样 0 事件），onScroll→页缘钮同步链路为标准 API 用法、由源码守卫固化，真机滑动路径留待生产回归复核
  - reduced-motion：面板级降级块覆盖新增过渡；翻页 scrollTo 与关闭阈值逻辑均走 prefersReducedMotion() 分支

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md（「播放面板视觉语义」段移动端结论改写为册页结构）
- **理由:** 移动端面板结构定稿属长期事实；甲板与桌面结论不变。
