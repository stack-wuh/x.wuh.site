---
{
  "schema": "shadow-dev/v1",
  "name": "20260928-feature-music-player",
  "type": "feature",
  "scope": "apps/server,apps/site,packages/components",
  "status": "committed",
  "baseBranch": "main",
  "branch": "feature/20260928-feature-music-player",
  "files": [
    ".env.example",
    "apps/server/package.json",
    "apps/server/src/app.module.ts",
    "apps/server/src/modules/music",
    "apps/site/app/api/music",
    "apps/site/app/components/AppProviders.tsx",
    "apps/site/app/components/SiteHeader/index.tsx",
    "apps/site/app/components/player/GlobalAudioPlayer.tsx",
    "apps/site/app/lib/sitemap-utils.ts",
    "apps/site/app/music",
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/provider.tsx",
    "packages/components/layout/specs.tsx",
    "pnpm-lock.yaml"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 393,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/393",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "411914c894a6126ba1a3999737a66b54753d1183",
    "planHash": "6e6dc9ee65b4a332a34f37518032514317c0544100a2a53b125b9121a20d2b09",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 音乐播放器可用化：自建 NeteaseCloudMusicApi 接入、不可播降级与音乐页",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n站点上的播放器**已经存在且完整**（`20260322-P-audio-player` / #48 的产物）：组件包 6 文件 1133 行（Provider 单 `Audio` 元素状态机、MiniPlayer、PlayerPanel 含封面/进度/音量/模式/LRC 歌词/队列），站点侧 `GlobalAudioPlayer` 经 `requestIdleCallback` 惰性挂载，服务端有两个 Next route handler 做代理。它今天不出声，原因不在实现缺失，而在**唯一实际使用的上游实例不可达**：`apps/site/app/api/music/client.ts:3` 硬编码兜底 `https://neteasecloudmusicapi-main-api.vercel.app`，本机实测该域名 DNS 被污染（解析到 `174.37.243.85` 与 IPv6 `2a03:2880:f111:83:face:b00c:0:25de`），HTTP 000、20s 超时（对照组 `music.163.com` 200）。链路后果是歌单拉取失败 → `GlobalAudioPlayer` 的 `onError` 静默吞掉 → 队列为空 → 迷你播放器停在「等待播放 / 加载默认歌单...」。\n\n本机已把 `NeteaseCloudMusicApi@4.32.0`（npm 2026-05-18 仍在发版，MIT，node>=12，13 个依赖；GitHub 原仓 2024-02 收到网易云音乐法务通知后清空，npm 侧继续维护）跑通并量化了能力边界：\n\n- **服务模式与库模式都可用**。库模式 `require('NeteaseCloudMusicApi')` 暴露 377 个模块函数，**冷启动（无 token 文件）直接拿到 320k 播放地址**，匿名 token 自动落 `os.tmpdir()/anonymous_token` —— 无需任何登录管道即可服务匿名流量。\n- **匿名可播率满意**：默认歌单热歌榜 `3778678` 的 200 首，`exhigh`/`standard`/`lossless` 三档全部 200/200 返回地址（320k 70 首、128k 130 首，属匿名降级而非失败）。\n- **版权曲仍不可播**：周杰伦《晴天》`id=186016` 返回 `url: null`、`code: 404`、`cannotListenReason: 1`，需 VIP 登录 cookie 才能解锁。\n- **播放地址是 http**：`http://m701.music.126.net/...`；同一 URL 换 `https://` 实测 206 可用 —— 站点是 `https://wuh.site`，必须做 scheme 改写，否则浏览器按混合内容拦截。\n- **地址有效期 20 分钟**（`expi: 1200`），只能按需获取、不能长缓存。\n\n本变更把上述能力自建接入站点，并修掉现网真实缺陷（不可播曲目会让播放停在 error 态而不是跳过），同时新增 `/music` 页承载歌单浏览、切换与搜索。桌面端（`apps/desktop`，独立子仓库）在第一期只交付 API 契约与设计结论，实现另开变更。\n\n## 引用规范\n- norms/code-style.md\n  - 当前结论: 命名、类型、import、包边界的共同底线\n  - 适用 scope: 全量\n- norms/api-design.md\n  - 当前结论: 全局 `/v2` 前缀；异常统一由 `HttpExceptionFilter` 转 `{statusCode,message,error,timestamp}`；DTO 用 class-validator；query 参数 camelCase；Swagger 仅非生产挂载\n  - 适用 scope: apps/server/src/modules/music\n- norms/code-style-backend.md\n  - 当前结论: Module → Controller → Service → DTO 分层；Controller 不编排外部 API；外部请求集中适配层且明确超时、有限重试、鉴权与失败映射；日志不记完整 Cookie；环境变量经配置边界读取\n  - 适用 scope: apps/server（注：文档内路径 `packages/wuh.site.nest` 为旧路径，实际为 `apps/server`）\n- norms/code-style-frontend.md\n  - 当前结论: Server Component 优先，`'use client'` 只放真实需要客户端能力的边界；数据请求按页面职责用既有 fetch/ISR 约定；组件必须处理 loading/disabled/empty/error；颜色间距用 CSS 变量与主题令牌\n  - 适用 scope: apps/site/app/music、apps/site/app/components/player\n- norms/code-style-packages.md\n  - 当前结论: `components` 只提供通用 UI 能力，不依赖业务页面/API 模块/具体路由；消费者走公开入口；改共享包须检查所有 workspace 消费者的类型检查与构建\n  - 适用 scope: packages/components/audio-player\n- norms/ui-patterns.md\n  - 当前结论: 先查组件库确认可复用才能设计；暗色全覆盖、禁硬编码色值；动效 150–300ms ease-out 且响应 `prefers-reduced-motion`；可交互元素必须有 focus ring 与 aria-label\n  - 适用 scope: apps/site/app/music（新页面）\n- shadow-docs/knowledge/components.md\n  - 当前结论: 组件经 `exports` map 子路径导出（`@wuh.site/components/<name>`），无桶文件；组件按职责拆分、主组件 ≤500 行；Image 外轮廓由 Wrapper 单点负责\n  - 适用 scope: packages/components\n- shadow-docs/knowledge/api-standardization.md\n  - 当前结论: 新增 Controller/DTO 必须 `/v2` 前缀 + 统一异常响应 + 完整 OpenAPI 类型；生产不暴露内部路径与堆栈\n  - 适用 scope: apps/server/src、`/v2/docs`\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: 首屏只等主体数据，非首屏请求不阻塞 HTML；延迟区块保留稳定占位且失败不阻断主体；动态路由页不得加 `loading.tsx` 骨架（会使缓存命中改走流式、FCP 变骨架）\n  - 适用 scope: apps/site/app/components/AppProviders.tsx、apps/site/app/music\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只经语义 token（`--primary-color`/`--text-primary`/`--background-*`）；断点只用 `BREAKPOINTS` 语义常量（mobile 640 / small 520 / tablet 1024），不新引入裸数值；淡化色用 `color-mix(in oklab, var(--text-color) 72%, transparent)` 而非 `--text-secondary`（暗色反向）；动态状态禁跨组件插值选择器，改 transient prop\n  - 适用 scope: packages/components/themes、apps/site 页面\n- shadow-docs/knowledge/icon-system.md\n  - 当前结论: 图标恒为 outline 线框（currentColor/fill none，strokeWidth 2），通用图标在 `icons/index.tsx` 从 lucide-react 具名导出，不在业务目录散落 SVG\n  - 适用 scope: packages/components/icons、apps/site/app/music\n- shadow-docs/knowledge/seo.md\n  - 当前结论: canonical/OG/Twitter/JSON-LD 与 sitemap 必须使用同一公开 URL；调试页不进 sitemap 且 `index:false`\n  - 适用 scope: apps/site/app/lib/sitemap-utils.ts、apps/site/app/music\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 发布由 GitHub Release 触发部署链（`PR merged ≠ 已部署`）；根 `pnpm exec tsc --noEmit` 不覆盖 `apps/site`，site 必须 `cd apps/site && pnpm exec tsc --noEmit`，且 site 存在存量类型错误——tsc 通过只说明\"未引入新错误\"，需配合 grep 目标文件\n  - 适用 scope: .github/workflows、验收口径\n- shadow-docs/knowledge/desktop-app-architecture.md\n  - 当前结论: `apps/desktop` 是独立子仓库、独立 lockfile；桌面 UI 只经主题变量暴露颜色；DOM 渲染类缺陷必须以 happy-dom 用例验收\n  - 适用 scope: apps/desktop（本变更仅引用其边界结论，不落实现）\n\n## 决策\n- **选型:** 服务端接入走**方案 A：`apps/server`（NestJS）以库方式内嵌 `NeteaseCloudMusicApi`**，只消费其模块函数（不启动它自带的 express server）；登录态用**单份 `MUSIC_U` env**（服务端只读）；桌面端第一期只交付契约与设计结论，实现由 `apps/desktop` 仓库内的独立变更承接。\n- **对比方案:**\n  - 方案 B「独立容器跑 NeteaseCloudMusicApi 服务，Next route 只改 base」——否决。需要同时改 `Dockerfile`（新 stage）、`docker-compose.yml`（第三服务）、`scripts/deploy-docker.sh`（健康检查、staging 端口、启停），并承担一个常驻进程的内存与运维成本；收益仅是进程隔离，而音乐播放是站点功能的一部分，与 Nest 同生共死可接受。\n  - 方案 C「继续用公共实例/再找一个公共代理」——否决。现网故障就是该方案的必然结果（不可控、随时失效）。\n  - 桌面端插件形态——否决。插件必须走 `CAPABILITY_METHODS` 白名单、沙箱帧与单向上报，而播放是宿主级会话态、当前无第三方接入需求；等真有第三方插件要放音乐时再抽象，符合「新增贡献点须以真实参考插件需要为准」。\n  - 二维码扫码登录——推迟到后续变更。本期 `MUSIC_U` 由人工写入 env，无新表、无新后台 UI。\n- **理由:** 方案 A 让接口天然满足 `api-standardization` 的 `/v2` + 统一异常约束，客户端零改动（`/api/:path*` → Nest 的 rewrite 已存在），且不触碰部署链三件套，风险面最小；匿名态实测已能让榜单类歌单 100% 可播，登录态只用于解锁版权曲，用 env 承载足以覆盖个人博客的维护频率。\n- **遗留缺陷一并修:** 不可播曲目当前会让播放停在 error（`provider.tsx` 无 `streamUrl` 时抛错、`status: 'error'`，不推进队列）——本变更定义\"按队列推进且不超过一轮 + 一次性可见提示\"的降级语义。\n- **待确认点:** 工作区已有未提交的 `package.json` / `pnpm-workspace.yaml` / `pnpm-lock.yaml` 改动（desktop 并入 workspace），与本变更新增依赖会在 `pnpm-lock.yaml` 上重叠；apply 之前需先落定该改动，或在同一分支内明确 lock 的处理方式。\n- **边界:** 本变更不改 `packages/components/audio-player` 的公开 API（`TrackSource`/`TrackResolver`/`AudioPlayerActions` 保持兼容），只修内部行为与类型；`/music` 页数据来自 Nest，不新增 Next route handler。\n\n## 任务\n### Phase 1 — 服务端接入（apps/server）\n\n- [ ] task 1 — `apps/server/package.json` — 安装 `NeteaseCloudMusicApi@4.32.0`（锁精确版本），确认 lock 变更范围；只消费模块函数，不引入其 express server\n- [ ] task 2 — `apps/server/src/modules/music/music.module.ts`、`apps/server/src/app.module.ts` — 新建 music 模块并注册（Module 只做依赖注册）\n- [ ] task 3 — `apps/server/src/modules/music/music.service.ts` — 适配层：封装 `playlist_detail` / `song_url_v1` / `lyric` / `cloudsearch`，统一超时与嵌套错误→Nest 标准异常映射、`http→https` scheme 改写、响应归一化（字段与现有 site route 返回结构对齐）\n- [ ] task 4 — `apps/server/src/modules/music/music.config.ts` — 配置边界读取 `NETEASE_MUSIC_U` / `NETEASE_DEFAULT_PLAYLIST_ID`（不散落 `process.env`），cookie 值不进日志\n- [ ] task 5 — `apps/server/src/modules/music/dto/*.ts` — DTO + class-validator（`id` 必填、`level` 枚举、`playlistId`/`keywords` 可选）+ Swagger 响应类型\n- [ ] task 6 — `apps/server/src/modules/music/music.controller.ts` — `GET /v2/music/playlist`、`GET /v2/music/track`、`GET /v2/music/search`\n- [ ] task 7 — `apps/server/src/modules/music/*.spec.ts` — 单测（假适配器）：归一化、`url=null`、`http→https`、库抛错映射、匿名与带 cookie 两条路径\n- [ ] task 8 — `.env.example` — 登记 `NETEASE_MUSIC_U`、`NETEASE_DEFAULT_PLAYLIST_ID`、`NEXT_PUBLIC_NETEASE_PLAYLIST_ID` 及注释\n\n### Phase 2 — 站点切换与可用性修复\n\n- [ ] task 9 — `apps/site/app/api/music/**` — 删除两个 route handler 与 `client.ts`，改由既有 `/api/*` → Nest rewrite 承接（dev 需 Nest 在跑，需在验收中确认）\n- [ ] task 10 — `packages/components/audio-player/provider.tsx` — 修 reducer 状态类型（`SET_STATUS` payload 与 `status` 比较无交集的 8 处 TS 报错），让 status/error 通路可用\n- [ ] task 11 — `packages/components/audio-player/provider.tsx` — 不可播自动跳过：resolver 未返回 `streamUrl` 或触发 `error` 时按队列推进（最多一轮），全轮失败回落 idle 并置可见错误\n- [ ] task 12 — `packages/components/audio-player/MiniPlayer.tsx` — 跳过/失败的一次性可见提示（复用现有文案位与令牌，不新造组件）\n- [ ] task 13 — `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 修 `rIC/cIC` 返回类型报错（`number | Timeout`）；失败不再静默吞，向 MiniPlayer 暴露失败态\n- [ ] task 14 — 验收：`apps/server` 单测 + `apps/server`/`apps/site` 双侧 tsc（site 需与改动前基线对比）+ dev 实播（匿名态出声、版权曲自动跳过续播）\n\n### Phase 3 — /music 音乐页\n\n- [ ] task 15 — `apps/site/app/music/page.tsx` — 服务端拉取歌单（歌单信息 + 曲目列表），首屏主体优先，不 await 非主体数据\n- [ ] task 16 — `apps/site/app/music/**` — 歌单切换（URL 查询参数驱动，服务端重新取数）与搜索入口（消费 `/v2/music/search`）\n- [ ] task 17 — `apps/site/app/music/**` — 曲目行播放接入：`useAudioPlayer().actions.loadQueue` + `playAt`，不新建播放状态\n- [ ] task 18 — `apps/site/app/components/SiteHeader/index.tsx`、`packages/components/layout/specs.tsx`、`apps/site/app/lib/sitemap-utils.ts` — 导航三处入口与 sitemap 注册\n- [ ] task 19 — 页面状态与无障碍：空态/加载/失败态用既有组件（Empty/Skeleton/Result），焦点环、aria-label、暗色与 `prefers-reduced-motion` 全覆盖\n\n### Phase 4 — 桌面端（跨仓，另开变更）\n\n- [ ] task 20 — 在 `apps/desktop` 仓库内以独立变更落地内置播放器面板（scope `apps/desktop`）；本变更只交付 `/v2/music/*` 契约与设计结论，不在父仓库改 desktop 代码\n\n完整 brief：shadow-docs/changes/20260928-feature-music-player/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260928-feature-music-player\",\"type\":\"feature\",\"scope\":\"apps/server,apps/site,packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260928-feature-music-player/brief.md\",\"cliVersion\":\"1.3.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    }
  }
}
---

# 音乐播放器可用化：自建 NeteaseCloudMusicApi 接入、不可播降级与音乐页

## 动机

站点上的播放器**已经存在且完整**（`20260322-P-audio-player` / #48 的产物）：组件包 6 文件 1133 行（Provider 单 `Audio` 元素状态机、MiniPlayer、PlayerPanel 含封面/进度/音量/模式/LRC 歌词/队列），站点侧 `GlobalAudioPlayer` 经 `requestIdleCallback` 惰性挂载，服务端有两个 Next route handler 做代理。它今天不出声，原因不在实现缺失，而在**唯一实际使用的上游实例不可达**：`apps/site/app/api/music/client.ts:3` 硬编码兜底 `https://neteasecloudmusicapi-main-api.vercel.app`，本机实测该域名 DNS 被污染（解析到 `174.37.243.85` 与 IPv6 `2a03:2880:f111:83:face:b00c:0:25de`），HTTP 000、20s 超时（对照组 `music.163.com` 200）。链路后果是歌单拉取失败 → `GlobalAudioPlayer` 的 `onError` 静默吞掉 → 队列为空 → 迷你播放器停在「等待播放 / 加载默认歌单...」。

本机已把 `NeteaseCloudMusicApi@4.32.0`（npm 2026-05-18 仍在发版，MIT，node>=12，13 个依赖；GitHub 原仓 2024-02 收到网易云音乐法务通知后清空，npm 侧继续维护）跑通并量化了能力边界：

- **服务模式与库模式都可用**。库模式 `require('NeteaseCloudMusicApi')` 暴露 377 个模块函数，**冷启动（无 token 文件）直接拿到 320k 播放地址**，匿名 token 自动落 `os.tmpdir()/anonymous_token` —— 无需任何登录管道即可服务匿名流量。
- **匿名可播率满意**：默认歌单热歌榜 `3778678` 的 200 首，`exhigh`/`standard`/`lossless` 三档全部 200/200 返回地址（320k 70 首、128k 130 首，属匿名降级而非失败）。
- **版权曲仍不可播**：周杰伦《晴天》`id=186016` 返回 `url: null`、`code: 404`、`cannotListenReason: 1`，需 VIP 登录 cookie 才能解锁。
- **播放地址是 http**：`http://m701.music.126.net/...`；同一 URL 换 `https://` 实测 206 可用 —— 站点是 `https://wuh.site`，必须做 scheme 改写，否则浏览器按混合内容拦截。
- **地址有效期 20 分钟**（`expi: 1200`），只能按需获取、不能长缓存。

本变更把上述能力自建接入站点，并修掉现网真实缺陷（不可播曲目会让播放停在 error 态而不是跳过），同时新增 `/music` 页承载歌单浏览、切换与搜索。桌面端（`apps/desktop`，独立子仓库）在第一期只交付 API 契约与设计结论，实现另开变更。

## 引用规范

- norms/code-style.md
  - 当前结论: 命名、类型、import、包边界的共同底线
  - 适用 scope: 全量
- norms/api-design.md
  - 当前结论: 全局 `/v2` 前缀；异常统一由 `HttpExceptionFilter` 转 `{statusCode,message,error,timestamp}`；DTO 用 class-validator；query 参数 camelCase；Swagger 仅非生产挂载
  - 适用 scope: apps/server/src/modules/music
- norms/code-style-backend.md
  - 当前结论: Module → Controller → Service → DTO 分层；Controller 不编排外部 API；外部请求集中适配层且明确超时、有限重试、鉴权与失败映射；日志不记完整 Cookie；环境变量经配置边界读取
  - 适用 scope: apps/server（注：文档内路径 `packages/wuh.site.nest` 为旧路径，实际为 `apps/server`）
- norms/code-style-frontend.md
  - 当前结论: Server Component 优先，`'use client'` 只放真实需要客户端能力的边界；数据请求按页面职责用既有 fetch/ISR 约定；组件必须处理 loading/disabled/empty/error；颜色间距用 CSS 变量与主题令牌
  - 适用 scope: apps/site/app/music、apps/site/app/components/player
- norms/code-style-packages.md
  - 当前结论: `components` 只提供通用 UI 能力，不依赖业务页面/API 模块/具体路由；消费者走公开入口；改共享包须检查所有 workspace 消费者的类型检查与构建
  - 适用 scope: packages/components/audio-player
- norms/ui-patterns.md
  - 当前结论: 先查组件库确认可复用才能设计；暗色全覆盖、禁硬编码色值；动效 150–300ms ease-out 且响应 `prefers-reduced-motion`；可交互元素必须有 focus ring 与 aria-label
  - 适用 scope: apps/site/app/music（新页面）
- shadow-docs/knowledge/components.md
  - 当前结论: 组件经 `exports` map 子路径导出（`@wuh.site/components/<name>`），无桶文件；组件按职责拆分、主组件 ≤500 行；Image 外轮廓由 Wrapper 单点负责
  - 适用 scope: packages/components
- shadow-docs/knowledge/api-standardization.md
  - 当前结论: 新增 Controller/DTO 必须 `/v2` 前缀 + 统一异常响应 + 完整 OpenAPI 类型；生产不暴露内部路径与堆栈
  - 适用 scope: apps/server/src、`/v2/docs`
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 首屏只等主体数据，非首屏请求不阻塞 HTML；延迟区块保留稳定占位且失败不阻断主体；动态路由页不得加 `loading.tsx` 骨架（会使缓存命中改走流式、FCP 变骨架）
  - 适用 scope: apps/site/app/components/AppProviders.tsx、apps/site/app/music
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只经语义 token（`--primary-color`/`--text-primary`/`--background-*`）；断点只用 `BREAKPOINTS` 语义常量（mobile 640 / small 520 / tablet 1024），不新引入裸数值；淡化色用 `color-mix(in oklab, var(--text-color) 72%, transparent)` 而非 `--text-secondary`（暗色反向）；动态状态禁跨组件插值选择器，改 transient prop
  - 适用 scope: packages/components/themes、apps/site 页面
- shadow-docs/knowledge/icon-system.md
  - 当前结论: 图标恒为 outline 线框（currentColor/fill none，strokeWidth 2），通用图标在 `icons/index.tsx` 从 lucide-react 具名导出，不在业务目录散落 SVG
  - 适用 scope: packages/components/icons、apps/site/app/music
- shadow-docs/knowledge/seo.md
  - 当前结论: canonical/OG/Twitter/JSON-LD 与 sitemap 必须使用同一公开 URL；调试页不进 sitemap 且 `index:false`
  - 适用 scope: apps/site/app/lib/sitemap-utils.ts、apps/site/app/music
- shadow-docs/knowledge/build-config.md
  - 当前结论: 发布由 GitHub Release 触发部署链（`PR merged ≠ 已部署`）；根 `pnpm exec tsc --noEmit` 不覆盖 `apps/site`，site 必须 `cd apps/site && pnpm exec tsc --noEmit`，且 site 存在存量类型错误——tsc 通过只说明"未引入新错误"，需配合 grep 目标文件
  - 适用 scope: .github/workflows、验收口径
- shadow-docs/knowledge/desktop-app-architecture.md
  - 当前结论: `apps/desktop` 是独立子仓库、独立 lockfile；桌面 UI 只经主题变量暴露颜色；DOM 渲染类缺陷必须以 happy-dom 用例验收
  - 适用 scope: apps/desktop（本变更仅引用其边界结论，不落实现）

## 决策

- **选型:** 服务端接入走**方案 A：`apps/server`（NestJS）以库方式内嵌 `NeteaseCloudMusicApi`**，只消费其模块函数（不启动它自带的 express server）；登录态用**单份 `MUSIC_U` env**（服务端只读）；桌面端第一期只交付契约与设计结论，实现由 `apps/desktop` 仓库内的独立变更承接。
- **对比方案:**
  - 方案 B「独立容器跑 NeteaseCloudMusicApi 服务，Next route 只改 base」——否决。需要同时改 `Dockerfile`（新 stage）、`docker-compose.yml`（第三服务）、`scripts/deploy-docker.sh`（健康检查、staging 端口、启停），并承担一个常驻进程的内存与运维成本；收益仅是进程隔离，而音乐播放是站点功能的一部分，与 Nest 同生共死可接受。
  - 方案 C「继续用公共实例/再找一个公共代理」——否决。现网故障就是该方案的必然结果（不可控、随时失效）。
  - 桌面端插件形态——否决。插件必须走 `CAPABILITY_METHODS` 白名单、沙箱帧与单向上报，而播放是宿主级会话态、当前无第三方接入需求；等真有第三方插件要放音乐时再抽象，符合「新增贡献点须以真实参考插件需要为准」。
  - 二维码扫码登录——推迟到后续变更。本期 `MUSIC_U` 由人工写入 env，无新表、无新后台 UI。
- **理由:** 方案 A 让接口天然满足 `api-standardization` 的 `/v2` + 统一异常约束，客户端零改动（`/api/:path*` → Nest 的 rewrite 已存在），且不触碰部署链三件套，风险面最小；匿名态实测已能让榜单类歌单 100% 可播，登录态只用于解锁版权曲，用 env 承载足以覆盖个人博客的维护频率。
- **遗留缺陷一并修:** 不可播曲目当前会让播放停在 error（`provider.tsx` 无 `streamUrl` 时抛错、`status: 'error'`，不推进队列）——本变更定义"按队列推进且不超过一轮 + 一次性可见提示"的降级语义。
- **待确认点:** 工作区已有未提交的 `package.json` / `pnpm-workspace.yaml` / `pnpm-lock.yaml` 改动（desktop 并入 workspace），与本变更新增依赖会在 `pnpm-lock.yaml` 上重叠；apply 之前需先落定该改动，或在同一分支内明确 lock 的处理方式。
- **边界:** 本变更不改 `packages/components/audio-player` 的公开 API（`TrackSource`/`TrackResolver`/`AudioPlayerActions` 保持兼容），只修内部行为与类型；`/music` 页数据来自 Nest，不新增 Next route handler。

## 任务

### Phase 1 — 服务端接入（apps/server）

- [x] task 1 — `apps/server/package.json` — 安装 `NeteaseCloudMusicApi@4.32.0`（锁精确版本），确认 lock 变更范围；只消费模块函数，不引入其 express server
- [x] task 2 — `apps/server/src/modules/music/music.module.ts`、`apps/server/src/app.module.ts` — 新建 music 模块并注册（Module 只做依赖注册）
- [x] task 3 — `apps/server/src/modules/music/music.service.ts` — 适配层：封装 `playlist_detail` / `song_url_v1` / `lyric` / `cloudsearch`，统一超时与嵌套错误→Nest 标准异常映射、`http→https` scheme 改写、响应归一化（字段与现有 site route 返回结构对齐）
- [x] task 4 — `apps/server/src/modules/music/music.config.ts` — 配置边界读取 `NETEASE_MUSIC_U` / `NETEASE_DEFAULT_PLAYLIST_ID`（不散落 `process.env`），cookie 值不进日志
- [x] task 5 — `apps/server/src/modules/music/dto/*.ts` — DTO + class-validator（`id` 必填、`level` 枚举、`playlistId`/`keywords` 可选）+ Swagger 响应类型
- [x] task 6 — `apps/server/src/modules/music/music.controller.ts` — `GET /v2/music/playlist`、`GET /v2/music/track`、`GET /v2/music/search`
- [x] task 7 — `apps/server/src/modules/music/*.spec.ts` — 单测（假适配器）：归一化、`url=null`、`http→https`、库抛错映射、匿名与带 cookie 两条路径
- [x] task 8 — `.env.example` — 登记 `NETEASE_MUSIC_U`、`NETEASE_DEFAULT_PLAYLIST_ID`、`NEXT_PUBLIC_NETEASE_PLAYLIST_ID` 及注释

### Phase 2 — 站点切换与可用性修复

- [x] task 9 — `apps/site/app/api/music/**` — 删除两个 route handler 与 `client.ts`，改由既有 `/api/*` → Nest rewrite 承接（dev 需 Nest 在跑，需在验收中确认）
- [x] task 10 — `packages/components/audio-player/provider.tsx` — 修 reducer 状态类型（`SET_STATUS` payload 与 `status` 比较无交集的 8 处 TS 报错），让 status/error 通路可用
- [x] task 11 — `packages/components/audio-player/provider.tsx` — 不可播自动跳过：resolver 未返回 `streamUrl` 或触发 `error` 时按队列推进（最多一轮），全轮失败回落 idle 并置可见错误
- [x] task 12 — `packages/components/audio-player/MiniPlayer.tsx` — 跳过/失败的一次性可见提示（复用现有文案位与令牌，不新造组件）
- [x] task 13 — `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 修 `rIC/cIC` 返回类型报错（`number | Timeout`）；失败不再静默吞，向 MiniPlayer 暴露失败态
- [x] task 14 — 验收：`apps/server` 单测 + `apps/server`/`apps/site` 双侧 tsc（site 需与改动前基线对比）+ dev 实播（匿名态出声、版权曲自动跳过续播）

### Phase 3 — /music 音乐页

- [x] task 15 — `apps/site/app/music/page.tsx` — 服务端拉取歌单（歌单信息 + 曲目列表），首屏主体优先，不 await 非主体数据
- [x] task 16 — `apps/site/app/music/**` — 歌单切换（URL 查询参数驱动，服务端重新取数）与搜索入口（消费 `/v2/music/search`）
- [x] task 17 — `apps/site/app/music/**` — 曲目行播放接入：`useAudioPlayer().actions.loadQueue` + `playAt`，不新建播放状态
- [x] task 18 — `apps/site/app/components/SiteHeader/index.tsx`、`packages/components/layout/specs.tsx`、`apps/site/app/lib/sitemap-utils.ts` — 导航三处入口与 sitemap 注册
- [x] task 19 — 页面状态与无障碍：空态/加载/失败态用既有组件（Empty/Skeleton/Result），焦点环、aria-label、暗色与 `prefers-reduced-motion` 全覆盖

### Phase 4 — 桌面端（跨仓，另开变更）

- [x] task 20 — 在 `apps/desktop` 仓库内以独立变更落地内置播放器面板（scope `apps/desktop`）；本变更只交付 `/v2/music/*` 契约与设计结论，不在父仓库改 desktop 代码

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 新增
- **候选卡片:** `shadow-docs/knowledge/music-player.md`（另需更新 `knowledge/components.md` 的播放器行为段）
- **理由:** 外部依赖的能力边界（匿名可播率、VIP 曲 `url=null` 与 `cannotListenReason`）、播放地址 `http→https` 改写与 20 分钟有效期、`MUSIC_U` 的存放与降级语义、以及 API 归属（Nest `/v2/music/*`，站点不再自持 route）都是长期有效且非显而易见的事实，构成独立卡片；`components.md` 需补记不可播跳过语义，避免后续变更按旧的"抛错即停"理解。
