---
title: 音乐播放器与网易云接入
domain: music
keywords: [音乐, 播放器, 歌单, 年度歌单, 网易云, netease, NeteaseCloudMusicApi, 歌词, 音频, 不可播跳过, MUSIC_U, music.126.net, 混合内容]
scope:
  - apps/server/src/modules/music
  - apps/site/app/music
  - apps/site/app/components/player
  - packages/components/audio-player
status: active
source:
  - changes/20260928-feature-music-player/brief.md
  - changes/20260928-feature-music-annual-playlists/brief.md
verified: 2026-09-28
verified-depth: runtime
verified-scope: 服务端 jest 30/30（登录态边界、creator+年度过滤、年份倒序、502/503 映射）；本地真实 HTTP 实测匿名态 /v2/music/user-playlists 返回 200 空列表且不发上游，Swagger 契约注册；同实例匿名取热歌榜验证上游连通。真实 MUSIC_U 正路径（返回年度歌单列表）未在本机验证，待部署环境 field 确认。
---

# 音乐播放器与网易云接入

## 当前结论

**数据源归属**：网易云能力由 `apps/server` 的 `music` 模块提供（`GET /v2/music/playlist|track|search`），实现方式是**库方式内嵌** `NeteaseCloudMusicApi@4.32.0`（精确锁定版本，只消费其模块函数；不启动该包自带的 express server），因此不新增容器与端口，`Dockerfile`/`docker-compose.yml`/`deploy-docker.sh` 均不参与。站点侧不再自持代理 route（旧的 `apps/site/app/api/music/**` 已删除），`/api/music/*` 经 Next 既有的 `/api/:path*` → Nest rewrite 落到 `/v2/music/*`。

**接口契约**（桌面端等其它消费者按此对接，不再复制站点实现）：
- `GET /v2/music/playlist?playlistId=`（缺省取 `NETEASE_DEFAULT_PLAYLIST_ID`，默认 `3778678` 热歌榜）→ `{ playlistId, name, description, coverUrl, tracks: [{ id, name, artist, album, coverUrl, duration }] }`
- `GET /v2/music/track?id=&level=`（`level` 默认 `exhigh`，可选 `standard|higher|exhigh|lossless|hires|jyeffect|sky|jymaster`）→ `{ streamUrl, duration, lyrics }`；**不可播曲目返回 `streamUrl: null`（HTTP 200），不抛错**
- `GET /v2/music/search?keywords=&limit=`（`limit` 1–50，默认 30）→ `{ keywords, tracks: [...] }`
- `GET /v2/music/user-playlists` → `{ playlists: [{ id, name, coverUrl, trackCount }] }`——「我的年度歌单」：**名字含「年度」的创建歌单**，年份倒序（歌单名 4 位年份正则，无年份排最后按名称）；单页 `limit: 100` 不翻页（`more: true` 记 warn 只处理首屏）。

**年度歌单选择语义**：筛选/排序/登录态语义只在服务端持有，消费方不得复制实现。`MUSIC_U` 未配置 → 不发上游直接空列表（200，正常业务态）；上游成功但解析不出 uid（登录失效）→ warn + 空列表；上游失败走既有 502/503。站点侧（`/music` 页与迷你播放器）对空列表与失败**一律隐藏年度入口并回落 `NEXT_PUBLIC_NETEASE_PLAYLIST_ID` 兜底歌单**，行为一致；`/music` 未指定 `?playlist=` 时缺省选中最新一年，迷你播放器默认队列同源（先取年度首项再拉歌单）。官方榜单预设（热歌/飙升/新歌 tab）已从音乐页移除，`/v2/music/playlist` 端点本身仍可取任意公开歌单。

**匿名态能力边界**（未配置 `MUSIC_U`）：榜单/新歌类歌单可完整播放（实测热歌榜 200 首在 exhigh/standard/lossless 三档均 200/200 返回地址，320k 70 首、128k 130 首属匿名降级而非失败）；**VIP 与版权受限曲目返回 `url: null` + `code 404` + `cannotListenReason`**（如周杰伦《晴天》id `186016`），匿名搜不到原版（只出翻唱/纯音乐）；部分曲目匿名态只给 30 秒试听片（播放地址的 `time` 字段即真实流时长，与歌单元数据 `dt` 不一致属上游行为）。

**登录态**：单份 `MUSIC_U` 经 env 注入（`NETEASE_MUSIC_U`，可填裸 token 或整串 cookie），服务端只读、只用于上游请求，**不得出现在日志、报错或客户端响应中**（适配层做 `MUSIC_U=***` 脱敏）。库的匿名 device cookie 会自动落在 `os.tmpdir()/anonymous_token`，无需人工维护。

**播放地址处理（必须遵守）**：网易云返回的播放地址与封面都是 `http://...music.126.net/...`，站点是 https，**必须在适配层改写成 https**，否则浏览器按混合内容拦截（实测同 URL 换 https 音频 206、封面 200 均可用）；播放地址有效期约 20 分钟（`expi: 1200`），只能按需获取、**禁止长缓存**；歌单元数据可缓存（站点页 `revalidate: 600`）。

**播放器降级语义**（`packages/components/audio-player`）：曲目拿不到播放地址或音频元素报错时，**按队列顺序自动跳过，整轮尝试不超过队列长度**，提示 `已跳过 N 首不可播放的曲目` 占用迷你播放器的歌手行（卡片高度不变，`role='status'`）；该提示**只在用户操作播放器时清空**（自动起播不擦除，否则用户看不到）；整轮都不可播则回落 `idle` 并置 `这个歌单暂时没有可播放的曲目`。组件公开 API（`TrackSource`/`TrackResolver`/`AudioPlayerActions`/`AudioPlayerState`）保持不变。

## 执行约束

- 新增音乐能力一律进 `apps/server/src/modules/music`，不在 Next 侧新建 route handler；站点与页面消费 `/api/music/*` 或 `API_BASE + /music/*`。
- 凭证只经 `MusicConfig` 读取并只发往上游；日志/异常/响应中不得出现 cookie 原文。
- 适配层必须保留超时（8s）、上游非 2xx → 502、库不可用/超时 → 503 的失败映射，以及 `http → https` 改写。
- 播放地址不得进入缓存层；只有歌单/搜索这类元数据可以缓存。
- 不可播是**正常业务态**（不是错误）：消费方必须按空 `streamUrl` 跳过，禁止把播放停在错误态。
- 年度歌单的筛选与排序语义只在服务端 `getUserPlaylists` 持有；消费方对空列表与失败一律隐藏入口并回落 env 兜底歌单，禁止把「拉不到年度歌单」渲染成错误页。

## 适用边界

适用于站点 web 播放器与 `/music` 页。`apps/desktop` 是独立子仓库，可复用 `/v2/music/*` 契约，但不消费站点组件库（桌面 UI 自持、颜色只走主题变量）——桌面端实现属其仓库内的独立变更。上游库因版权法务通知已下架 GitHub 仓库（npm 侧仍在发版），自建只解决服务可用性，不改变曲目版权属性；对外公开分发场景不在本卡片覆盖范围内。

## 验证方式

`apps/server`：`npx jest src/modules/music`（归一化、`url=null`、`http→https`、超时与库失败映射、凭证脱敏、匿名/带 cookie 两条路径）。站点：`node --test apps/site/test/music-player-wiring.test.mjs` 与 `node --test packages/components/audio-player/provider.test.mjs`。接口实测：`curl localhost:3200/v2/music/playlist` 返回 tracks，`curl "localhost:3200/v2/music/track?id=186016"` 返回 `streamUrl: null`（匿名态），任一返回的播放地址 `https` 可直接 206。

## 关联知识

- [components](./components.md)
- [design system](./design-system.md)
- [build config](./build-config.md)
