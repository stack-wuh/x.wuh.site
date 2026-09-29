---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-feature-music-yearbook",
  "type": "feature",
  "scope": "apps/site/app/music",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260929-feature-music-yearbook",
  "files": [
    "apps/server/src/modules/music/dto/music.dto.ts",
    "apps/server/src/modules/music/music.controller.ts",
    "apps/server/src/modules/music/music.service.spec.ts",
    "apps/server/src/modules/music/music.service.ts",
    "apps/site/app/music/MusicView.tsx",
    "apps/site/app/music/page.tsx",
    "apps/site/app/music/specs.ts",
    "shadow-docs/changes/20260929-feature-music-yearbook/prototype.html"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 406,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/406",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "1cae3090d5bc6b77482d3157e2ac97779a5549dd",
    "verifiedAt": "2026-09-29T05:27:53.986Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:406",
    "planHash": "7aedb561a5de578171b95034a18f1347c9be2fb2e730a99968a8f4e44683e625",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] /music 页「音乐年鉴」重构：书架翻书 + 听歌数据",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n/music 页现状过于单薄：年度歌单是一排纯文字 tab（硬导航整页刷新），页面除曲目列表外没有作者的任何音乐人格信息。本次按已定稿原型（shadow-docs/changes/20260929-feature-music-yearbook/prototype.html，2026-09-29 经多轮对照迭代确认）重构为「音乐年鉴」：页头展示网易云真实头像/昵称/Lv；年度歌单改为书架交互——架上书脊朝外，点选抽出一本在原位让出的缺口里翻开（真实歌单封面转向读者、朱砂丝带、不遮挡任何邻居）；曲目列表带播放次数与「最爱」标记（该卷播放次数最高），悬停行翻出播放键、点击行即从该曲起播。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 网易云能力只在 server music 模块（库内嵌 NeteaseCloudMusicApi）；年度歌单筛选/排序语义只在服务端；空列表/登录失效一律隐藏入口并回落 NEXT_PUBLIC_NETEASE_PLAYLIST_ID 兜底；播放地址禁缓存、歌单元数据可缓存（revalidate 600）；不可播是正常业务态（streamUrl null 跳过）；netease 资源 http→https 改写必须在适配层\n  - 适用 scope: apps/server/src/modules/music, apps/site/app/music\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色/间距/圆角/断点只走语义 token；淡化色统一 color-mix(in oklab, var(--text-color) 72%, transparent)（禁 --text-secondary）；动态状态禁跨组件插值选择器；选中态用 aria-current 属性承载\n  - 适用 scope: apps/site/app/music, packages/components/themes\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 动效只引用 --motion-* tokens；关键帧只在 MotionStyles 定义；reduced-motion/print 必须降级；禁止为动画引入 JS scroll/resize 监听\n  - 适用 scope: apps/site/app/music\n\n## 决策\n- **选型:** 方案一「音乐年鉴」——四段结构（页头名片 / 年鉴书架 / 当前卷头部 / 曲目列表），交互细节以定稿原型为验收基准（酒红/素雅 × 明/暗四主题与移动端均已在原型验证）\n- **对比方案:** 渐进增强（保留旧骨架插入名片与封面 tab）——丰富感不足，否决；视觉先行分期（统计后置）——统计区最终砍掉，分期失去意义，否决\n- **理由:** /music 是展示型页面，表演性 > 效率性；数据全部来自既有上游（playlist / user_record / user_account），无新外部依赖；书架交互经五轮原型迭代解决遮挡（缺口翻开）、热区（26px 视觉 + 扩大命中区）、滚动条（padding 动画替代 transform）、书与列表割裂（封面小图呼应 + 间距收紧）\n- **明确不做:** 听歌统计区（用户迭代明确移除）；搜索框（随操作模块移除，如需回归以图标形式独立变更）；其他歌单入口\n\n## 任务\n### Phase 1 服务端（apps/server/src/modules/music）\n\n- [ ] UserPlaylistsResultDto 增加 profile {nickname, avatarUrl, level}——复用 getUserPlaylists 内既有的 user_account 调用；未配置 MUSIC_U 时 profile 缺省 — `apps/server/src/modules/music/dto/music.dto.ts` — 扩展\n- [ ] 曲目播放次数联表：getPlaylist 在配置 MUSIC_U 时调用 user_record（type=0 全期 top 1000）按曲目 id 映射 playCount 到 TrackResultDto（可选字段）；未配置/上游失败 → 字段缺省不报错；user_record 属元数据可随缓存层缓存 — `apps/server/src/modules/music/music.service.ts` — 扩展\n- [ ] http→https 改写同样作用于 avatarUrl；日志/响应不得泄露 MUSIC_U — `apps/server/src/modules/music/music.service.ts` — 遵循\n- [ ] jest 补：联表映射、未配置登录态降级、上游失败降级、既有 url=null/http→https/匿名语义不回归 — `apps/server/src/modules/music/music.service.spec.ts` — 新增\n\n### Phase 2 站点页面（apps/site/app/music）\n\n- [ ] specs.ts 类型对齐 profile / playCount — `apps/site/app/music/specs.ts` — 扩展\n- [ ] page.tsx 数据获取保持 SSR + revalidate 600，向下传递 profile — `apps/site/app/music/page.tsx` — 调整\n- [ ] MusicView 重构为四段结构：页头（PageHeader 语言 + 头像/昵称/Lv，缺省回落印章字 + 站点名）/ 年鉴书架（书脊 role=tab、缺口翻书 3D 动画、热区扩大、2 秒内连续切换快速档、方向键 roving focus、aria-controls）/ 当前卷头部（封面小图 + 真实卷名 + 计数）/ 曲目列表（悬停编号翻出播放键、playCount 列、最爱标 = 每卷 playCount 最高、行点击 loadQueue 从该曲起播）— `apps/site/app/music/MusicView.tsx` — 重写\n- [ ] 动效全走 --motion-* tokens + reduced-motion 降级；淡化色 72% mix；样式覆盖四主题与移动端 ≤640（页头堆叠、书架横滚） — `apps/site/app/music/MusicView.tsx` — 遵循\n- [ ] 移除旧「播放全部/搜索」UI 及前端 search 调用；/v2/music/search 服务端端点保留不动 — `apps/site/app/music/MusicView.tsx` — 移除\n\n### Phase 3 收尾\n\n- [ ] pnpm exec tsc --noEmit + apps/server jest src/modules/music + 站点 wiring 测试（music-player-wiring.test.mjs 受影响则更新） — 仓库根 — 验证\n- [ ] 四主题（wine/plain × 明/暗）+ 移动端目检，对照 prototype.html 验收\n\n完整 brief：shadow-docs/changes/20260929-feature-music-yearbook/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-feature-music-yearbook\",\"type\":\"feature\",\"scope\":\"apps/site/app/music\",\"status\":\"branched\",\"branch\":\"feature/20260929-feature-music-yearbook\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-feature-music-yearbook/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "apps/server/src/modules/music/dto/music.dto.ts",
        "apps/server/src/modules/music/music.controller.ts",
        "apps/server/src/modules/music/music.service.spec.ts",
        "apps/server/src/modules/music/music.service.ts",
        "apps/server/src/modules/music/netease-client.ts",
        "apps/site/app/music/MusicView.tsx",
        "apps/site/app/music/page.tsx",
        "apps/site/app/music/specs.ts",
        "shadow-docs/changes/20260929-feature-music-yearbook",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "feat(music): /music 页重构为音乐年鉴——书架翻书切换年度歌单，页头接入网易云真实身份，曲目列表带播放次数与最爱标记"
    }
  },
  "knowledge": null
}
---

# /music 页「音乐年鉴」重构：书架翻书 + 听歌数据

## 动机

/music 页现状过于单薄：年度歌单是一排纯文字 tab（硬导航整页刷新），页面除曲目列表外没有作者的任何音乐人格信息。本次按已定稿原型（shadow-docs/changes/20260929-feature-music-yearbook/prototype.html，2026-09-29 经多轮对照迭代确认）重构为「音乐年鉴」：页头展示网易云真实头像/昵称/Lv；年度歌单改为书架交互——架上书脊朝外，点选抽出一本在原位让出的缺口里翻开（真实歌单封面转向读者、朱砂丝带、不遮挡任何邻居）；曲目列表带播放次数与「最爱」标记（该卷播放次数最高），悬停行翻出播放键、点击行即从该曲起播。

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 网易云能力只在 server music 模块（库内嵌 NeteaseCloudMusicApi）；年度歌单筛选/排序语义只在服务端；空列表/登录失效一律隐藏入口并回落 NEXT_PUBLIC_NETEASE_PLAYLIST_ID 兜底；播放地址禁缓存、歌单元数据可缓存（revalidate 600）；不可播是正常业务态（streamUrl null 跳过）；netease 资源 http→https 改写必须在适配层
  - 适用 scope: apps/server/src/modules/music, apps/site/app/music
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色/间距/圆角/断点只走语义 token；淡化色统一 color-mix(in oklab, var(--text-color) 72%, transparent)（禁 --text-secondary）；动态状态禁跨组件插值选择器；选中态用 aria-current 属性承载
  - 适用 scope: apps/site/app/music, packages/components/themes
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 动效只引用 --motion-* tokens；关键帧只在 MotionStyles 定义；reduced-motion/print 必须降级；禁止为动画引入 JS scroll/resize 监听
  - 适用 scope: apps/site/app/music

## 决策

- **选型:** 方案一「音乐年鉴」——四段结构（页头名片 / 年鉴书架 / 当前卷头部 / 曲目列表），交互细节以定稿原型为验收基准（酒红/素雅 × 明/暗四主题与移动端均已在原型验证）
- **对比方案:** 渐进增强（保留旧骨架插入名片与封面 tab）——丰富感不足，否决；视觉先行分期（统计后置）——统计区最终砍掉，分期失去意义，否决
- **理由:** /music 是展示型页面，表演性 > 效率性；数据全部来自既有上游（playlist / user_record / user_account），无新外部依赖；书架交互经五轮原型迭代解决遮挡（缺口翻开）、热区（26px 视觉 + 扩大命中区）、滚动条（padding 动画替代 transform）、书与列表割裂（封面小图呼应 + 间距收紧）
- **明确不做:** 听歌统计区（用户迭代明确移除）；搜索框（随操作模块移除，如需回归以图标形式独立变更）；其他歌单入口

## 任务

### Phase 1 服务端（apps/server/src/modules/music）

- [x] UserPlaylistsResultDto 增加 profile {nickname, avatarUrl, level}——复用 getUserPlaylists 内既有的 user_account 调用；未配置 MUSIC_U 时 profile 缺省 — `apps/server/src/modules/music/dto/music.dto.ts` — 扩展
- [x] 曲目播放次数联表：getPlaylist 在配置 MUSIC_U 时调用 user_record（type=0 全期 top 1000）按曲目 id 映射 playCount 到 TrackResultDto（可选字段）；未配置/上游失败 → 字段缺省不报错；user_record 属元数据可随缓存层缓存 — `apps/server/src/modules/music/music.service.ts` — 扩展
- [x] http→https 改写同样作用于 avatarUrl；日志/响应不得泄露 MUSIC_U — `apps/server/src/modules/music/music.service.ts` — 遵循
- [x] jest 补：联表映射、未配置登录态降级、上游失败降级、既有 url=null/http→https/匿名语义不回归 — `apps/server/src/modules/music/music.service.spec.ts` — 新增

### Phase 2 站点页面（apps/site/app/music）

- [x] specs.ts 类型对齐 profile / playCount — `apps/site/app/music/specs.ts` — 扩展
- [x] page.tsx 数据获取保持 SSR + revalidate 600，向下传递 profile — `apps/site/app/music/page.tsx` — 调整
- [x] MusicView 重构为四段结构：页头（PageHeader 语言 + 头像/昵称/Lv，缺省回落印章字 + 站点名）/ 年鉴书架（书脊 role=tab、缺口翻书 3D 动画、热区扩大、2 秒内连续切换快速档、方向键 roving focus、aria-controls）/ 当前卷头部（封面小图 + 真实卷名 + 计数）/ 曲目列表（悬停编号翻出播放键、playCount 列、最爱标 = 每卷 playCount 最高、行点击 loadQueue 从该曲起播）— `apps/site/app/music/MusicView.tsx` — 重写
- [x] 动效全走 --motion-* tokens + reduced-motion 降级；淡化色 72% mix；样式覆盖四主题与移动端 ≤640（页头堆叠、书架横滚） — `apps/site/app/music/MusicView.tsx` — 遵循
- [x] 移除旧「播放全部/搜索」UI 及前端 search 调用；/v2/music/search 服务端端点保留不动 — `apps/site/app/music/MusicView.tsx` — 移除

### Phase 3 收尾

- [x] pnpm exec tsc --noEmit + apps/server jest src/modules/music + 站点 wiring 测试（music-player-wiring.test.mjs 受影响则更新） — 仓库根 — 验证
- [x] 四主题（wine/plain × 明/暗）+ 移动端目检，对照 prototype.html 验收

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 新增听歌排行联表（user_record）与 profile 暴露的服务端语义、播放次数的缓存边界需沉淀进音乐域知识；书架翻书属页面级实现细节，不单独入知识
