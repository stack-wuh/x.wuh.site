---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-fix-music-user-record-uid",
  "type": "fix",
  "scope": "server",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20260929-fix-music-user-record-uid",
  "files": [
    "apps/server/src/modules/music/music.service.spec.ts",
    "apps/server/src/modules/music/music.service.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 408,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/408",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "16c4a78c76cbee43848612006e6c4afea2f79d79",
    "verifiedAt": "2026-09-29T07:43:17.244Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:408",
    "planHash": "a5c3ac6ca0f2cd1cdb4217cced7a2edd3d4d35c284ffd03c65c126eac27c2b53",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 修复听歌排行联表参数名错误——线上播放次数与最爱标记缺失",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n用户反馈线上 `/music` 页播放次数列与【最爱】标记全部缺失。排查确认：\n\n- v1.4.31 部署链路正常（CI-CD run 36532732542 全绿）；\n- 线上 `GET /api/music/user-playlists` 已返回 `profile`（昵称+头像），说明 `NETEASE_MUSIC_U` 登录态有效；\n- 但线上 `GET /api/music/playlist?playlistId=17605630069` 所有曲目均无 `playCount` 字段。\n\n本地复现定位根因：`fetchPlayCountMap` 调用 `user_record` 时入参传了 `{ id: uid, type: 0 }`，而 NeteaseCloudMusicApi@4.32.0 的 `user_record` 模块读取的是 `query.uid`（`module/user_record.js`: `uid: query.uid`）→ 上游收到 `uid=undefined` 返回 400（库包装为 502）→ `assertUpstream` 抛错 → `getPlaylist` catch 降级空 Map → `playCount` 全缺省，前端随之隐藏播放次数与【最爱】。\n\n单测因 mock 客户端未校验参数名，35/35 通过但未拦截此缺陷。匿名实测传 `uid` 后返回 200 + `allData` 100 条，前几名正是 2025 年度歌单曲目（匿名视角 playCount 为 0 属隐私屏蔽，带登录态查自己为真实次数）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 接口契约声明「配置 MUSIC_U 时曲目联表听歌排行（`user_record` type=0 全期 top 1000）写入可选 `playCount`，联表失败缺省不报错」——契约正确，本次修复让实现与契约一致；卡片另载明年度歌单筛选/登录态语义只在服务端持有\n  - 适用 scope: server music 模块 / `/music` 页面\n\n## 决策\n- **选型:** 方案A——`fetchPlayCountMap` 参数名 `id` → `uid` 修正 + 单测断言改为断言 `uid`，锁定回归\n- **对比方案:**\n  - 方案B（A 之外再给 `allData` 空结果补 warn 日志）：可观测性增强，但 `assertUpstream` 已对非 2xx 记 warn，且本故障属一次性参数名笔误，收益边际，不采纳\n  - 方案C（绕开库直接 HTTP `/api/v1/play/record`）：破坏 `NeteaseLibraryClient` 统一走库模块的架构及超时/脱敏封装，否决\n- **理由:** 最小改动直击根因；单测断言参数名后，mock 层也能拦截同类笔误\n\n## 任务\n### Phase 1\n- [ ] 修正 `fetchPlayCountMap` 中 `user_record` 入参 `id` → `uid`，并更新单测对入参的断言 — `apps/server/src/modules/music/music.service.ts`, `apps/server/src/modules/music/music.service.spec.ts` — 修改 + 回归断言\n- [ ] jest 全量回归 + tsc 类型检查 — `apps/server` — 验证 35/35 与零类型错误\n\n完整 brief：shadow-docs/changes/20260929-fix-music-user-record-uid/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-fix-music-user-record-uid\",\"type\":\"fix\",\"scope\":\"server\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-fix-music-user-record-uid/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "commit": {
      "files": [
        "apps/server/src/modules/music/music.service.spec.ts",
        "apps/server/src/modules/music/music.service.ts",
        "shadow-docs/changes/20260929-fix-music-user-record-uid",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(music): 听歌排行联表入参 id→uid，修复线上播放次数与最爱标记缺失"
    }
  },
  "knowledge": null
}
---

# 修复听歌排行联表参数名错误——线上播放次数与最爱标记缺失

## 动机

用户反馈线上 `/music` 页播放次数列与【最爱】标记全部缺失。排查确认：

- v1.4.31 部署链路正常（CI-CD run 36532732542 全绿）；
- 线上 `GET /api/music/user-playlists` 已返回 `profile`（昵称+头像），说明 `NETEASE_MUSIC_U` 登录态有效；
- 但线上 `GET /api/music/playlist?playlistId=17605630069` 所有曲目均无 `playCount` 字段。

本地复现定位根因：`fetchPlayCountMap` 调用 `user_record` 时入参传了 `{ id: uid, type: 0 }`，而 NeteaseCloudMusicApi@4.32.0 的 `user_record` 模块读取的是 `query.uid`（`module/user_record.js`: `uid: query.uid`）→ 上游收到 `uid=undefined` 返回 400（库包装为 502）→ `assertUpstream` 抛错 → `getPlaylist` catch 降级空 Map → `playCount` 全缺省，前端随之隐藏播放次数与【最爱】。

单测因 mock 客户端未校验参数名，35/35 通过但未拦截此缺陷。匿名实测传 `uid` 后返回 200 + `allData` 100 条，前几名正是 2025 年度歌单曲目（匿名视角 playCount 为 0 属隐私屏蔽，带登录态查自己为真实次数）。

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 接口契约声明「配置 MUSIC_U 时曲目联表听歌排行（`user_record` type=0 全期 top 1000）写入可选 `playCount`，联表失败缺省不报错」——契约正确，本次修复让实现与契约一致；卡片另载明年度歌单筛选/登录态语义只在服务端持有
  - 适用 scope: server music 模块 / `/music` 页面

## 决策

- **选型:** 方案A——`fetchPlayCountMap` 参数名 `id` → `uid` 修正 + 单测断言改为断言 `uid`，锁定回归
- **对比方案:**
  - 方案B（A 之外再给 `allData` 空结果补 warn 日志）：可观测性增强，但 `assertUpstream` 已对非 2xx 记 warn，且本故障属一次性参数名笔误，收益边际，不采纳
  - 方案C（绕开库直接 HTTP `/api/v1/play/record`）：破坏 `NeteaseLibraryClient` 统一走库模块的架构及超时/脱敏封装，否决
- **理由:** 最小改动直击根因；单测断言参数名后，mock 层也能拦截同类笔误

## 任务

### Phase 1
- [x] 修正 `fetchPlayCountMap` 中 `user_record` 入参 `id` → `uid`，并更新单测对入参的断言 — `apps/server/src/modules/music/music.service.ts`, `apps/server/src/modules/music/music.service.spec.ts` — 修改 + 回归断言
- [x] jest 全量回归 + tsc 类型检查 — `apps/server` — 验证 35/35 与零类型错误

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 接口契约段补充「`user_record` 入参为 `uid`（非 `id`），参数名错误表现为上游 400/库 502 被降级吞掉」的上游细节，防止复发
