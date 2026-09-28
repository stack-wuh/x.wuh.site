---
{
  "schema": "shadow-dev/v1",
  "name": "20260928-feature-music-annual-playlists",
  "type": "feature",
  "scope": "apps/server,apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260928-feature-music-annual-playlists",
  "files": [
    "apps/server/src/modules/music/dto/music.dto.ts",
    "apps/server/src/modules/music/music.controller.ts",
    "apps/server/src/modules/music/music.service.spec.ts",
    "apps/server/src/modules/music/music.service.ts",
    "apps/server/src/modules/music/netease-client.spec.ts",
    "apps/server/src/modules/music/netease-client.ts",
    "apps/site/app/components/player/GlobalAudioPlayer.tsx",
    "apps/site/app/music/MusicView.tsx",
    "apps/site/app/music/page.tsx",
    "apps/site/app/music/specs.ts",
    "apps/site/test/music-player-wiring.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 396,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/396",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "1e9bc1534223e7deb3515ca309f0500225aad60a",
    "verifiedAt": "2026-09-28T15:16:58.371Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:396",
    "planHash": "91148dba3b884ceedc25d4793eb0578fd85f48c39e24cc12d48735af6da4741d",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 音乐页年度歌单：账号动态拉取替换榜单入口",
      "titleRaw": "[feature] 音乐页年度歌单：账号动态拉取替换榜单入口",
      "supplement": "",
      "body": "## 动机\n`/music` 页当前的歌单入口是三个**官方榜单**预设（热歌榜/飙升榜/新歌榜，`specs.ts` 的 `MUSIC_PLAYLIST_PRESETS`），全局迷你播放器默认队列也固定加载热歌榜。站点所有者的年度歌单沉淀在自己的网易云账号里（名字含「年度」的创建歌单，如「2024年度歌单」），希望站点展示的正是这批自己的歌单：账号里新建年度歌单后站点自动出现，不需要改代码发版。\n\n服务端 `music` 模块（`20260928-feature-music-player` / #394）已具备 `playlist_detail`/`song_url_v1`/`lyric`/`cloudsearch` 四个上游能力与 `MUSIC_U` 登录态注入，库 `NeteaseCloudMusicApi@4.32.0` 内 `user_account`（取登录账号 uid）与 `user_playlist`（uid 拉用户歌单，创建歌单排在收藏之前）模块已确认存在（tarball 实证）。本变更补上「我的年度歌单」这条链路，并让 `/music` 页入口与迷你播放器默认队列都切到它。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 音乐能力一律进 `apps/server/src/modules/music`，不新增 Next route handler；凭证只经 `MusicConfig` 读取且日志/响应脱敏；适配层保留 8s 超时、上游非 2xx → 502、库失败 → 503 映射与 `http→https` 改写；播放地址不进缓存，歌单类元数据可缓存（站点 `revalidate: 600`）；不可播是正常业务态，消费方按空 `streamUrl` 跳过\n  - 适用 scope: apps/server/src/modules/music、apps/site/app/music、apps/site/app/components/player\n- norms/api-design.md\n  - 当前结论: `/v2` 全局前缀、资源名词复数、query camelCase、DTO class-validator、统一异常格式；列表接口默认分页\n  - 适用 scope: apps/server/src/modules/music（分页偏离见「决策」）\n- norms/code-style-backend.md\n  - 当前结论: Module → Controller → Service → DTO 分层；外部请求集中适配层，明确超时与失败映射；环境变量经配置边界读取\n  - 适用 scope: apps/server\n- norms/ui-patterns.md\n  - 当前结论: 组件复用优先、暗色全覆盖、禁硬编码色、动效 150–300ms ease-out、focus ring 与 aria-label 底线\n  - 适用 scope: apps/site/app/music\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走语义 token；断点只用 `BREAKPOINTS` 语义常量；淡化色用 `color-mix(var(--text-color) 72%, transparent)` 而非 `--text-secondary`\n  - 适用 scope: apps/site/app/music\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: 首屏只等主体数据；非首屏请求不阻塞 HTML\n  - 适用 scope: apps/site/app/music/page.tsx\n- norms/code-style.md\n  - 当前结论: 禁新增 `any`、类型进共享层、渐进式治理不扩大范围\n  - 适用 scope: 全量\n- norms/tdd-verification.md\n  - 当前结论: L 级完整 TDD——先写能复现失败的测试，确认失败后再最小实现\n  - 适用 scope: apps/server\n\n## 决策\n- **选型:** 方案 A——服务端新增 `GET /v2/music/user-playlists` 聚合端点（服务端过滤「年度」+ 年份倒序），站点 `/music` 页服务端并行取数渲染，迷你播放器默认队列同步切到最新年度歌单。\n- **对比方案:**\n  - 方案 B「服务端返回全部创建歌单、站点自行过滤」——否决。账号语义与过滤规则泄漏到每个消费方、DTO 大而全，违背接口单一职责。\n  - 方案 C「硬编码年度歌单 ID 预设」——不满足「动态拉取」的需求（用户已明确）；仅保留 env 默认歌单作拉取失败时的兜底形态。\n- **理由:** 过滤/排序/登录态语义集中在 server 一处持有，桌面端将来可直接复用同一契约；全部沿用 `music-player` 卡片的执行约束（超时、失败映射、scheme 改写、凭证脱敏、元数据缓存），风险面最小。\n- **分页偏离说明:** `user-playlists` 是账号维度窄列表——上游 `user_playlist` 单页 `limit: 100` 且创建歌单排在收藏之前，「年度」过滤后通常个位数，引入分页参数属过度设计；`more: true`（创建歌单超过 100 个）时记 warn 日志仅处理首屏，不做翻页。\n- **登录态语义:** `MUSIC_U` 未配置 → 不发上游请求直接返回 `{ playlists: [] }`（200，正常业务态）；上游成功但取不到 uid（登录态失效）→ warn 日志 + 空列表；超时/库失败 → 503、非 2xx → 502（既有映射）。站点侧对空列表与失败一律隐藏年度分组并回落 env 默认歌单，行为一致。\n- **联动语义:** 迷你播放器不新增切换 UI；与 `/music` 的联动靠既有 `loadQueue` 全局队列（音乐页点歌即入列，迷你播放器跟随）。空闲默认队列改为先取年度列表首项（最新一年）对应歌单，失败回落 `NEXT_PUBLIC_NETEASE_PLAYLIST_ID`。\n- **年份排序:** 用歌单名中 4 位数字正则提取年份倒序；无年份的排最后按名称排序。\n\n## 任务\n### Phase 1 — 服务端端点（完整 TDD：先写失败测试再实现）\n\n- [ ] task 1 — `apps/server/src/modules/music/netease-client.ts`、`netease-client.spec.ts` — `NeteaseClient` 接口与模块映射增加 `user_account`/`user_playlist`，补对应用例 — apps/server/src/modules/music\n- [ ] task 2 — `apps/server/src/modules/music/music.service.spec.ts` — 先写 `getUserPlaylists` 失败测试：未配置 cookie → 空列表不发请求；uid 提取；`creator.userId` 过滤只留创建歌单；名字含「年度」过滤；年份倒序；`more: true` 记 warn；上游失败映射（502/503）\n- [ ] task 3 — `apps/server/src/modules/music/dto/music.dto.ts`、`music.service.ts` — 实现 `getUserPlaylists()` 与 `UserPlaylistsResultDto`（`{ playlists: [{ id, name, coverUrl, trackCount }] }`），封面经 `withCoverSize` — apps/server/src/modules/music\n- [ ] task 4 — `apps/server/src/modules/music/music.controller.ts` — 暴露 `GET /v2/music/user-playlists`，Swagger 注解齐全 — apps/server/src/modules/music\n\n### Phase 2 — 站点音乐页\n\n- [ ] task 5 — `apps/site/app/music/specs.ts` — 移除 `MUSIC_PLAYLIST_PRESETS`，新增年度歌单列表类型（与服务端 DTO 对齐）— apps/site/app/music\n- [ ] task 6 — `apps/site/app/music/page.tsx` — 并行取「当前歌单 + 年度列表」（年度列表 `revalidate: 600`）；`?playlist=` 缺省时选中最新年度歌单，拉不到回落 env 默认 — apps/site/app/music\n- [ ] task 7 — `apps/site/app/music/MusicView.tsx` — tab 区渲染年度歌单列表（复用现有 PlaylistTab 样式语言与主题 token），空列表隐藏分组；移除榜单入口文案 — apps/site/app/music\n- [ ] task 8 — `apps/site/test/music-player-wiring.test.mjs` — wiring 测试同步：预设移除、年度列表接线、缺省选中最新一年 — apps/site/test\n\n### Phase 3 — 迷你播放器默认队列\n\n- [ ] task 9 — `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 空闲默认队列改为「最新年度歌单」：先取 `/api/music/user-playlists` 首项 id 再拉歌单；任一步失败回落现有 env 默认歌单 — apps/site/app/components/player\n\n### Phase 4 — 验收\n\n- [ ] task 10 — 验证：`npx jest src/modules/music`（apps/server）、`node --test apps/site/test/music-player-wiring.test.mjs`、双侧 tsc；本地 dev 起 server 后 `curl /v2/music/user-playlists`（配置 `MUSIC_U` 实测返回年度歌单，未配置返回空列表）— 全量\n\n完整 brief：shadow-docs/changes/20260928-feature-music-annual-playlists/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260928-feature-music-annual-playlists\",\"type\":\"feature\",\"scope\":\"apps/server,apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260928-feature-music-annual-playlists/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "apps/server/src/modules/music/dto/music.dto.ts",
        "apps/server/src/modules/music/music.controller.ts",
        "apps/server/src/modules/music/music.service.spec.ts",
        "apps/server/src/modules/music/music.service.ts",
        "apps/server/src/modules/music/netease-client.spec.ts",
        "apps/server/src/modules/music/netease-client.ts",
        "apps/site/app/components/player/GlobalAudioPlayer.tsx",
        "apps/site/app/music/MusicView.tsx",
        "apps/site/app/music/page.tsx",
        "apps/site/app/music/specs.ts",
        "apps/site/test/music-player-wiring.test.mjs",
        "shadow-docs/changes/20260928-feature-music-annual-playlists/brief.md",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/menu.md",
        "shadow-docs/signals.md"
      ],
      "message": "[feature] 音乐页年度歌单：账号动态拉取替换榜单入口 (#396)\n\n- 服务端新增 GET /v2/music/user-playlists：MUSIC_U 登录态拉取我创建的、名字含「年度」的歌单，年份倒序；未配置/失效返回 200 空列表\n- /music 页入口替换官方榜单预设为年度歌单，缺省选中最新一年，拉不到回落 env 默认歌单\n- 迷你播放器默认队列同步切到最新年度歌单，失败回落 env 兜底\n- 更新 knowledge/music-player.md 契约与年度歌单语义，新增 signals.md SGN-001",
      "title": "[feature] 音乐页年度歌单：账号动态拉取替换榜单入口",
      "body": "Closes #396\n\n完整 brief：shadow-docs/changes/20260928-feature-music-annual-playlists/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "新增 GET /v2/music/user-playlists 端点契约与「我的年度歌单」选择语义（MUSIC_U 登录态边界、creator+年度过滤、年份倒序、单页 100 不翻页）属 music-player 卡片「接口契约」与「匿名态能力边界」段的自然扩展；ship 时按 norms/knowledge-cards.md 补 verified-depth（unit + runtime 匿名态实测；真实 MUSIC_U 正路径待部署环境 field 验证）与 verified-scope。另提案创建 shadow-docs/signals.md SGN-001：宿主机内存压力下 jest/tsc 间歇性 SIGSEGV(139, 空日志)，与代码无关，等待 20-45s 重试即恢复，验证结论只取成功输出。"
  }
}
---

# 音乐页年度歌单：账号动态拉取替换榜单入口

## 动机

`/music` 页当前的歌单入口是三个**官方榜单**预设（热歌榜/飙升榜/新歌榜，`specs.ts` 的 `MUSIC_PLAYLIST_PRESETS`），全局迷你播放器默认队列也固定加载热歌榜。站点所有者的年度歌单沉淀在自己的网易云账号里（名字含「年度」的创建歌单，如「2024年度歌单」），希望站点展示的正是这批自己的歌单：账号里新建年度歌单后站点自动出现，不需要改代码发版。

服务端 `music` 模块（`20260928-feature-music-player` / #394）已具备 `playlist_detail`/`song_url_v1`/`lyric`/`cloudsearch` 四个上游能力与 `MUSIC_U` 登录态注入，库 `NeteaseCloudMusicApi@4.32.0` 内 `user_account`（取登录账号 uid）与 `user_playlist`（uid 拉用户歌单，创建歌单排在收藏之前）模块已确认存在（tarball 实证）。本变更补上「我的年度歌单」这条链路，并让 `/music` 页入口与迷你播放器默认队列都切到它。

## 复杂度评级

- **评级：** L
- **理由：** 新增对外 API 契约（`GET /v2/music/user-playlists`，桌面端等消费者可对接）+ 全站迷你播放器默认队列来源变化，跨 server/site 数据流；改坏直接影响 `/music` 页与全站播放器首屏听感。
- **期望验证深度：** unit + runtime（服务层分支全覆盖 + 站点 wiring 测试；交付前本地 dev 起 server 实测接口，需 `MUSIC_U`）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 音乐能力一律进 `apps/server/src/modules/music`，不新增 Next route handler；凭证只经 `MusicConfig` 读取且日志/响应脱敏；适配层保留 8s 超时、上游非 2xx → 502、库失败 → 503 映射与 `http→https` 改写；播放地址不进缓存，歌单类元数据可缓存（站点 `revalidate: 600`）；不可播是正常业务态，消费方按空 `streamUrl` 跳过
  - 适用 scope: apps/server/src/modules/music、apps/site/app/music、apps/site/app/components/player
- norms/api-design.md
  - 当前结论: `/v2` 全局前缀、资源名词复数、query camelCase、DTO class-validator、统一异常格式；列表接口默认分页
  - 适用 scope: apps/server/src/modules/music（分页偏离见「决策」）
- norms/code-style-backend.md
  - 当前结论: Module → Controller → Service → DTO 分层；外部请求集中适配层，明确超时与失败映射；环境变量经配置边界读取
  - 适用 scope: apps/server
- norms/ui-patterns.md
  - 当前结论: 组件复用优先、暗色全覆盖、禁硬编码色、动效 150–300ms ease-out、focus ring 与 aria-label 底线
  - 适用 scope: apps/site/app/music
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只走语义 token；断点只用 `BREAKPOINTS` 语义常量；淡化色用 `color-mix(var(--text-color) 72%, transparent)` 而非 `--text-secondary`
  - 适用 scope: apps/site/app/music
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 首屏只等主体数据；非首屏请求不阻塞 HTML
  - 适用 scope: apps/site/app/music/page.tsx
- norms/code-style.md
  - 当前结论: 禁新增 `any`、类型进共享层、渐进式治理不扩大范围
  - 适用 scope: 全量
- norms/tdd-verification.md
  - 当前结论: L 级完整 TDD——先写能复现失败的测试，确认失败后再最小实现
  - 适用 scope: apps/server

## 决策

- **选型:** 方案 A——服务端新增 `GET /v2/music/user-playlists` 聚合端点（服务端过滤「年度」+ 年份倒序），站点 `/music` 页服务端并行取数渲染，迷你播放器默认队列同步切到最新年度歌单。
- **对比方案:**
  - 方案 B「服务端返回全部创建歌单、站点自行过滤」——否决。账号语义与过滤规则泄漏到每个消费方、DTO 大而全，违背接口单一职责。
  - 方案 C「硬编码年度歌单 ID 预设」——不满足「动态拉取」的需求（用户已明确）；仅保留 env 默认歌单作拉取失败时的兜底形态。
- **理由:** 过滤/排序/登录态语义集中在 server 一处持有，桌面端将来可直接复用同一契约；全部沿用 `music-player` 卡片的执行约束（超时、失败映射、scheme 改写、凭证脱敏、元数据缓存），风险面最小。
- **分页偏离说明:** `user-playlists` 是账号维度窄列表——上游 `user_playlist` 单页 `limit: 100` 且创建歌单排在收藏之前，「年度」过滤后通常个位数，引入分页参数属过度设计；`more: true`（创建歌单超过 100 个）时记 warn 日志仅处理首屏，不做翻页。
- **登录态语义:** `MUSIC_U` 未配置 → 不发上游请求直接返回 `{ playlists: [] }`（200，正常业务态）；上游成功但取不到 uid（登录态失效）→ warn 日志 + 空列表；超时/库失败 → 503、非 2xx → 502（既有映射）。站点侧对空列表与失败一律隐藏年度分组并回落 env 默认歌单，行为一致。
- **联动语义:** 迷你播放器不新增切换 UI；与 `/music` 的联动靠既有 `loadQueue` 全局队列（音乐页点歌即入列，迷你播放器跟随）。空闲默认队列改为先取年度列表首项（最新一年）对应歌单，失败回落 `NEXT_PUBLIC_NETEASE_PLAYLIST_ID`。
- **年份排序:** 用歌单名中 4 位数字正则提取年份倒序；无年份的排最后按名称排序。

## 任务

### Phase 1 — 服务端端点（完整 TDD：先写失败测试再实现）

- [x] task 1 — `apps/server/src/modules/music/netease-client.ts`、`netease-client.spec.ts` — `NeteaseClient` 接口与模块映射增加 `user_account`/`user_playlist`，补对应用例 — apps/server/src/modules/music
- [x] task 2 — `apps/server/src/modules/music/music.service.spec.ts` — 先写 `getUserPlaylists` 失败测试：未配置 cookie → 空列表不发请求；uid 提取；`creator.userId` 过滤只留创建歌单；名字含「年度」过滤；年份倒序；`more: true` 记 warn；上游失败映射（502/503）
- [x] task 3 — `apps/server/src/modules/music/dto/music.dto.ts`、`music.service.ts` — 实现 `getUserPlaylists()` 与 `UserPlaylistsResultDto`（`{ playlists: [{ id, name, coverUrl, trackCount }] }`），封面经 `withCoverSize` — apps/server/src/modules/music
- [x] task 4 — `apps/server/src/modules/music/music.controller.ts` — 暴露 `GET /v2/music/user-playlists`，Swagger 注解齐全 — apps/server/src/modules/music

### Phase 2 — 站点音乐页

- [x] task 5 — `apps/site/app/music/specs.ts` — 移除 `MUSIC_PLAYLIST_PRESETS`，新增年度歌单列表类型（与服务端 DTO 对齐）— apps/site/app/music
- [x] task 6 — `apps/site/app/music/page.tsx` — 并行取「当前歌单 + 年度列表」（年度列表 `revalidate: 600`）；`?playlist=` 缺省时选中最新年度歌单，拉不到回落 env 默认 — apps/site/app/music
- [x] task 7 — `apps/site/app/music/MusicView.tsx` — tab 区渲染年度歌单列表（复用现有 PlaylistTab 样式语言与主题 token），空列表隐藏分组；移除榜单入口文案 — apps/site/app/music
- [x] task 8 — `apps/site/test/music-player-wiring.test.mjs` — wiring 测试同步：预设移除、年度列表接线、缺省选中最新一年 — apps/site/test

### Phase 3 — 迷你播放器默认队列

- [x] task 9 — `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 空闲默认队列改为「最新年度歌单」：先取 `/api/music/user-playlists` 首项 id 再拉歌单；任一步失败回落现有 env 默认歌单 — apps/site/app/components/player

### Phase 4 — 验收

- [x] task 10 — 验证：`npx jest src/modules/music`（apps/server）、`node --test apps/site/test/music-player-wiring.test.mjs`、双侧 tsc；本地 dev 起 server 后 `curl /v2/music/user-playlists`（配置 `MUSIC_U` 实测返回年度歌单，未配置返回空列表）— 全量

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 新增 `/v2/music/user-playlists` 端点契约与「我的年度歌单」选择语义（过滤规则、登录态边界、排序），属该卡片「接口契约」与「匿名态能力边界」段的自然扩展；apply/review 阶段写明 `verified-depth` 后由对应流程更新卡片，propose 不改卡片。
