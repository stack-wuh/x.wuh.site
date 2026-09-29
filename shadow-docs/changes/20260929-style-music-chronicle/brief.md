---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-style-music-chronicle",
  "type": "style",
  "scope": "site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260929-style-music-chronicle",
  "files": [
    "apps/site/app/music/MusicView.tsx",
    "apps/site/app/music/specs.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 410,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/410",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "e0759f1ccafe19165f0d04e98e41f969662659cb",
    "verifiedAt": "2026-09-29T09:25:58.117Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:410",
    "planHash": "09d173d424684685511ee03679f6b5f9e7fbe961e94471cb5a0ee9a6f43828fb",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] /music 年度切换重设计——书架换年轮编年·碟心封面",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n书架书脊方案（20260929-feature-music-yearbook）上线后，用户发起四方案设计对比（唱片墙/卡带座/年轮编年/唱片机），\n经两轮收敛：三栏融合版因「深色唱台打断编辑排版节奏」被否；定稿 **方案C2 年轮编年·碟心封面**\n（原型 `.design/music-switch-explore/c2-year-rail-vinyl.html`，用户已认可）。\n\nC2 构图：左侧衬线年份纵轨（距当前越远越淡化，选中转主色、轨道节点点亮）+ 右侧内容区超大水印年份 +\n面板头小黑胶碟（歌单封面做碟心圆标，切年淡出→轻转 120°→换面淡入，播放时慢转）+\n按语（本卷播放次数最高曲目）+ 曲目行语言不变（悬停播放键/次数/最爱）。\n用户补充要求：**预留歌单描述 + 标签的展示位**（描述 `description` 服务端已返回；标签前端预留渲染，\n服务端后续补 `tags` 字段即可点亮）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 年度歌单筛选/登录态语义只在服务端持有；站点消费 `/api/music/*`；playCount 为可选联表字段（未上榜显示「—」）；profile 随 user-playlists 暴露\n  - 适用 scope: apps/site/app/music\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 淡化色用 `color-mix(in oklab, var(--text-color) 72%, transparent)`，禁止 `--text-secondary`；选择态用 `aria-current`；样式用瞬态 props（`$` 前缀）；BREAKPOINTS.mobile = 640；动画遵守 motion tokens + `prefers-reduced-motion` 守卫；无跨组件插值选择器\n  - 适用 scope: apps/site/app/music\n\n## 决策\n- **选型:** 方案A——MusicView 单文件重构：删除书架组件族（Shelf/Volume/Book/Spine/CoverFace/Ribbon），新写年轮纵轨 + 碟心封面 + 水印 + 按语 + 描述/标签预留位；specs.ts 增加 `tags?: string[]` 可选字段\n- **对比方案:**\n  - 方案B（保留书架、仅换皮肤）：书架隐喻已被用户否定，不成立\n  - 方案C（三栏融合：纵轨 + 唱台 + 曲目）：原型实测失败——深色唱台卡在两条文字栏之间，破坏 C 的编辑排版留白，用户已否\n- **理由:** C2 是「单一主角」构图——排版即结构，碟心封面只做封面语言的移植（64px 小黑胶），不引入舞台/唱臂等重元素；实现只在站点侧，服务端契约零改动\n\n## 任务\n### Phase 1\n- [ ] 年轮纵轨：Rail/RailItem/RailYear/RailCount 组件替换书架，选中态 aria-current + 轨道节点 + 距离淡化（--dist），键盘 ↑↓←→ 沿轨移动 — `apps/site/app/music/MusicView.tsx` — 重写\n- [ ] 碟心封面：CoverDisc 小黑胶（repeating-radial-gradient 螺纹 + 封面圆标 + 主轴孔），切年 opacity 交叉 + rotate 累计 120°（fastMode 收短），status==='playing' 且当前队列属于选中卷时慢转 — `apps/site/app/music/MusicView.tsx` — 重写\n- [ ] 水印年份 + 按语（本卷 playCount 最高曲目）+ 描述/标签预留位（description 渲染，specs 加 `tags?: string[]`，有值渲染 chips） — `apps/site/app/music/MusicView.tsx`, `apps/site/app/music/specs.ts` — 新增\n- [ ] 响应式（≤640 纵轨横排成 chip、水印隐藏、碟缩小）+ 全部动画 `prefers-reduced-motion` 守卫 + 淡化色/瞬态 props 规范 — `apps/site/app/music/MusicView.tsx` — 收尾\n### Phase 2\n- [ ] 验证：`tsc --noEmit` 零新增错误 + `pnpm build:next` 通过 + `node --test apps/site/test/music-player-wiring.test.mjs` 全绿 + 与原型截图比对 — `apps/site` — 验证\n\n完整 brief：shadow-docs/changes/20260929-style-music-chronicle/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-style-music-chronicle\",\"type\":\"style\",\"scope\":\"site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-style-music-chronicle/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "apps/site/app/music/MusicView.tsx",
        "apps/site/app/music/specs.ts",
        "shadow-docs/changes/20260929-style-music-chronicle",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(music): /music 年度切换重设计——书架换年轮编年·碟心封面"
    }
  },
  "knowledge": null
}
---

# /music 年度切换重设计——书架换年轮编年·碟心封面

## 动机

书架书脊方案（20260929-feature-music-yearbook）上线后，用户发起四方案设计对比（唱片墙/卡带座/年轮编年/唱片机），
经两轮收敛：三栏融合版因「深色唱台打断编辑排版节奏」被否；定稿 **方案C2 年轮编年·碟心封面**
（原型 `.design/music-switch-explore/c2-year-rail-vinyl.html`，用户已认可）。

C2 构图：左侧衬线年份纵轨（距当前越远越淡化，选中转主色、轨道节点点亮）+ 右侧内容区超大水印年份 +
面板头小黑胶碟（歌单封面做碟心圆标，切年淡出→轻转 120°→换面淡入，播放时慢转）+
按语（本卷播放次数最高曲目）+ 曲目行语言不变（悬停播放键/次数/最爱）。
用户补充要求：**预留歌单描述 + 标签的展示位**（描述 `description` 服务端已返回；标签前端预留渲染，
服务端后续补 `tags` 字段即可点亮）。

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 年度歌单筛选/登录态语义只在服务端持有；站点消费 `/api/music/*`；playCount 为可选联表字段（未上榜显示「—」）；profile 随 user-playlists 暴露
  - 适用 scope: apps/site/app/music
- shadow-docs/knowledge/design-system.md
  - 当前结论: 淡化色用 `color-mix(in oklab, var(--text-color) 72%, transparent)`，禁止 `--text-secondary`；选择态用 `aria-current`；样式用瞬态 props（`$` 前缀）；BREAKPOINTS.mobile = 640；动画遵守 motion tokens + `prefers-reduced-motion` 守卫；无跨组件插值选择器
  - 适用 scope: apps/site/app/music

## 决策

- **选型:** 方案A——MusicView 单文件重构：删除书架组件族（Shelf/Volume/Book/Spine/CoverFace/Ribbon），新写年轮纵轨 + 碟心封面 + 水印 + 按语 + 描述/标签预留位；specs.ts 增加 `tags?: string[]` 可选字段
- **对比方案:**
  - 方案B（保留书架、仅换皮肤）：书架隐喻已被用户否定，不成立
  - 方案C（三栏融合：纵轨 + 唱台 + 曲目）：原型实测失败——深色唱台卡在两条文字栏之间，破坏 C 的编辑排版留白，用户已否
- **理由:** C2 是「单一主角」构图——排版即结构，碟心封面只做封面语言的移植（64px 小黑胶），不引入舞台/唱臂等重元素；实现只在站点侧，服务端契约零改动

## 任务

### Phase 1
- [x] 年轮纵轨：Rail/RailItem/RailYear/RailCount 组件替换书架，选中态 aria-current + 轨道节点 + 距离淡化（--dist），键盘 ↑↓←→ 沿轨移动 — `apps/site/app/music/MusicView.tsx` — 重写
- [x] 碟心封面：CoverDisc 小黑胶（repeating-radial-gradient 螺纹 + 封面圆标 + 主轴孔），切年 opacity 交叉 + rotate 累计 120°（fastMode 收短），status==='playing' 且当前队列属于选中卷时慢转 — `apps/site/app/music/MusicView.tsx` — 重写
- [x] 水印年份 + 按语（本卷 playCount 最高曲目）+ 描述/标签预留位（description 渲染，specs 加 `tags?: string[]`，有值渲染 chips） — `apps/site/app/music/MusicView.tsx`, `apps/site/app/music/specs.ts` — 新增
- [x] 响应式（≤640 纵轨横排成 chip、水印隐藏、碟缩小）+ 全部动画 `prefers-reduced-motion` 守卫 + 淡化色/瞬态 props 规范 — `apps/site/app/music/MusicView.tsx` — 收尾
### Phase 2
- [x] 验证：`tsc --noEmit` 零新增错误 + `pnpm build:next` 通过 + `node --test apps/site/test/music-player-wiring.test.mjs` 全绿 + 与原型截图比对 — `apps/site` — 验证

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** /music 页签名交互由书架改为年轮编年，卡片中页面结构描述需要随之更新（接口契约不变）
