---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-build-music-token-watch",
  "type": "build",
  "scope": ".github",
  "status": "archived",
  "baseBranch": "main",
  "branch": "build/20260929-build-music-token-watch",
  "files": [
    ".github/workflows/music-token-watch.yml"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 398,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/398",
    "pullRequest": 400,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/400"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "71c00a4df84e712576a6ac3bc6a68f2b96e241c0",
    "verifiedAt": "2026-09-28T23:44:07.494Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:400",
    "planHash": "e1cc318143b77e3ca74b81f66e77810c42a3f46f7517cb1c2eba833ac9adaeba",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[build] MUSIC_U 失效探测：定时巡检 + 报警 issue 自动开关",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n`v1.4.27` 上线的年度歌单依赖部署主机 `.env` 里的 `NETEASE_MUSIC_U`。该凭证失效（退出登录/改密码/网易风控/到期）的症状是「年度歌单悄悄变空、`/music` 回落热歌榜」，属静默降级——不主动探测可能几个月无人发现。2026-09-29 用户已配置有效凭证并实测返回 8 张年度歌单（2018-2025），失效探测为此状态的看门人。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 空列表响应无法区分「未配置/已失效/真没有」；消费方对空列表优雅回落热歌榜——探测以「生产已配置且账号有年度歌单」为前提，空即异常\n  - 适用 scope: .github/workflows（探测判定依据）\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 部署链由 GitHub Release 触发，push main 只跑 quality-gate；weread-sync.yml 已有「Actions 定时 → SSH → curl localhost:3200」先例（secrets SERVER_HOST/USER/PASSWORD 已存在）\n  - 适用 scope: .github/workflows\n- norms/tdd-verification.md\n  - 当前结论: M 级绿灯测试即可（写测试不强制先红）\n  - 适用 scope: .github/workflows\n- norms/code-style.md\n  - 当前结论: 渐进式治理、不扩大范围\n  - 适用 scope: 全量\n\n## 决策\n- **选型:** 方案 A——新增 `.github/workflows/music-token-watch.yml`：每天北京时间 10:00（cron `0 2 * * *`，UTC）+ `workflow_dispatch`（含 `force_fail` 输入用于负路径演练），SSH 到主机 `curl -s http://localhost:3200/v2/music/user-playlists`，`.playlists` 数组为空判定失效；失效 → 自动开/保持带 `music-token` 标签的报警 issue（正文含修复指引），workflow 同时 exit 1（失败邮件双保险）；健康 → 自动关闭该 issue 并留恢复评论。\n- **对比方案:**\n  - 方案 B「Nest 内 `@nestjs/schedule` 自检」——否决：引入新定时基建；容器内自测本机端点独立性差；出站告警仍无渠道，改动面远大于收益。\n  - 方案 C「部署主机 crontab + 通知脚本」——否决：游离于仓库之外、无版本控制、主机迁移即丢失；用户明确要正式做。\n- **理由:** 复用 `weread-sync.yml` 的成熟模式与既有 secrets，仓库内版本化资产；issue 即状态机（无外部存储），恢复自动关闭，天然防抖且零维护。\n- **交付判定偏离说明:** workflow 文件 push main 即被 Actions 加载，不经 Docker 部署链——本次交付 = PR merged + `workflow_dispatch` 正负两路径实测绿，**不发 Release**（无运行时代码变更，避免无谓的 v1.4.28）。\n- **判定前提:** 生产已配置有效 `MUSIC_U` 且账号存在年度歌单（2026-09-29 已实测满足）；若用户将来主动清空年度歌单，报警 issue 会被开出——属可接受的误报面，正文已注明。\n\n## 任务\n### Phase 1 — workflow 编写\n\n- [ ] task 1 — `.github/workflows/music-token-watch.yml` — 每日探测 + 手动 dispatch（`force_fail` 输入）；SSH curl 判空、失败重试一次；失效开/保持报警 issue（`gh issue`，标签 `music-token`，不存在则幂等创建），健康自动关闭；job 失败邮件为兜底通道 — .github/workflows\n\n### Phase 2 — 验证与交付\n\n- [ ] task 2 — 验证：actionlint/语法走查；merge 后 `workflow_dispatch` 实测正路径（当前生产健康 → run 绿且无报警 issue）与 `force_fail` 负路径（→ 报警 issue 打开），再跑一次正路径确认 issue 自动关闭 — .github/workflows\n\n完整 brief：shadow-docs/changes/20260929-build-music-token-watch/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-build-music-token-watch\",\"type\":\"build\",\"scope\":\".github\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-build-music-token-watch/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "build"
      ]
    },
    "release": {
      "files": [
        ".github/workflows/music-token-watch.yml",
        "shadow-docs/changes/20260929-build-music-token-watch/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "[build] MUSIC_U 失效探测：定时巡检 + 报警 issue 自动开关 (#398)\n\n- 新增 music-token-watch workflow：每日北京时间 10:00 SSH 探测 /v2/music/user-playlists，空列表判定登录态失效\n- 双通道判定：200+空列表开/保持报警 issue（恢复自动关闭）；SSH/网络/5xx 只让 run 失败不动 issue，避免误报\n- workflow_dispatch 支持 force_fail 演练告警分支\n- 更新 knowledge/music-player.md 失效探测机制段",
      "title": "[build] MUSIC_U 失效探测：定时巡检 + 报警 issue 自动开关",
      "body": "Closes #398\n\n完整 brief：shadow-docs/changes/20260929-build-music-token-watch/brief.md"
    },
    "commit": {
      "files": [
        ".github/workflows/music-token-watch.yml"
      ],
      "message": "fix(build): music-token-watch 显式指定 GH_REPO，修复无 checkout 时 gh 无法推断仓库"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "main(71c00a4) 已含 #399+#400 全部内容与卡片失效探测机制段；交付三步 dispatch 实测已通过并记录于 brief 结果段。knowledge 结论由上一轮 review 定为更新并已在 ship 落实，本轮归档前复核无需再动卡片。"
  }
}
---

# MUSIC_U 失效探测：定时巡检 + 报警 issue 自动开关

## 动机

`v1.4.27` 上线的年度歌单依赖部署主机 `.env` 里的 `NETEASE_MUSIC_U`。该凭证失效（退出登录/改密码/网易风控/到期）的症状是「年度歌单悄悄变空、`/music` 回落热歌榜」，属静默降级——不主动探测可能几个月无人发现。2026-09-29 用户已配置有效凭证并实测返回 8 张年度歌单（2018-2025），失效探测为此状态的看门人。

## 复杂度评级

- **评级：** M
- **理由：** 新增 CI 资产（workflow）有真实运行时行为（SSH、curl 判空、issue 开关）但局部、不改任何对外契约；改坏的表现是探测不跑（静默），靠 dispatch 实测与失败邮件可发现。
- **期望验证深度：** unit + 走查；正负两条路径均以 `workflow_dispatch` 实测（runtime 级观察点，超出 M 要求）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 空列表响应无法区分「未配置/已失效/真没有」；消费方对空列表优雅回落热歌榜——探测以「生产已配置且账号有年度歌单」为前提，空即异常
  - 适用 scope: .github/workflows（探测判定依据）
- shadow-docs/knowledge/build-config.md
  - 当前结论: 部署链由 GitHub Release 触发，push main 只跑 quality-gate；weread-sync.yml 已有「Actions 定时 → SSH → curl localhost:3200」先例（secrets SERVER_HOST/USER/PASSWORD 已存在）
  - 适用 scope: .github/workflows
- norms/tdd-verification.md
  - 当前结论: M 级绿灯测试即可（写测试不强制先红）
  - 适用 scope: .github/workflows
- norms/code-style.md
  - 当前结论: 渐进式治理、不扩大范围
  - 适用 scope: 全量

## 决策

- **选型:** 方案 A——新增 `.github/workflows/music-token-watch.yml`：每天北京时间 10:00（cron `0 2 * * *`，UTC）+ `workflow_dispatch`（含 `force_fail` 输入用于负路径演练），SSH 到主机 `curl -s http://localhost:3200/v2/music/user-playlists`，`.playlists` 数组为空判定失效；失效 → 自动开/保持带 `music-token` 标签的报警 issue（正文含修复指引），workflow 同时 exit 1（失败邮件双保险）；健康 → 自动关闭该 issue 并留恢复评论。
- **对比方案:**
  - 方案 B「Nest 内 `@nestjs/schedule` 自检」——否决：引入新定时基建；容器内自测本机端点独立性差；出站告警仍无渠道，改动面远大于收益。
  - 方案 C「部署主机 crontab + 通知脚本」——否决：游离于仓库之外、无版本控制、主机迁移即丢失；用户明确要正式做。
- **理由:** 复用 `weread-sync.yml` 的成熟模式与既有 secrets，仓库内版本化资产；issue 即状态机（无外部存储），恢复自动关闭，天然防抖且零维护。
- **交付判定偏离说明:** workflow 文件 push main 即被 Actions 加载，不经 Docker 部署链——本次交付 = PR merged + `workflow_dispatch` 正负两路径实测绿，**不发 Release**（无运行时代码变更，避免无谓的 v1.4.28）。
- **判定前提:** 生产已配置有效 `MUSIC_U` 且账号存在年度歌单（2026-09-29 已实测满足）；若用户将来主动清空年度歌单，报警 issue 会被开出——属可接受的误报面，正文已注明。

## 任务

### Phase 1 — workflow 编写

- [x] task 1 — `.github/workflows/music-token-watch.yml` — 每日探测 + 手动 dispatch（`force_fail` 输入）；SSH curl 判空、失败重试一次；失效开/保持报警 issue（`gh issue`，标签 `music-token`，不存在则幂等创建），健康自动关闭；job 失败邮件为兜底通道 — .github/workflows

### Phase 2 — 验证与交付

- [x] task 2 — 验证：actionlint/语法走查；merge 后 `workflow_dispatch` 实测正路径（当前生产健康 → run 绿且无报警 issue）与 `force_fail` 负路径（→ 报警 issue 打开），再跑一次正路径确认 issue 自动关闭 — .github/workflows

## 结果

- 实际耗时: 2026-09-29 半个工作日内完成 propose→apply→review→release→交付验证
- 验证: YAML 结构解析、5 个 step 脚本 bash -n、判定逻辑对生产端点干跑（200+healthy 与空/非空边界）通过；merge 前在分支 ref 上完成 workflow_dispatch 三步实测——①正路径 run 绿且无报警 issue；②force_fail 负路径 run 按设计 failure、报警 issue #401 自动打开（music-token 标签）；③正路径收口 run 绿、#401 自动关闭并留恢复评论
- 交付: PR #399（初始实现）已 merged（squash cd32682）；交付验证发现 runner 无 checkout 时 gh 无法推断仓库，修复（显式 GH_REPO）经 PR #400 提交；不发 Release，workflow 于 merge 后即刻生效，每日北京时间 10:00 自动巡检
- 遗留: 无

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 「失效探测机制」是年度歌单登录态语义的守护配套，纳入该卡片一段（探测频率、issue 开关、判定前提）；ship 时补 `verified-depth` 与 `verified-scope`。
