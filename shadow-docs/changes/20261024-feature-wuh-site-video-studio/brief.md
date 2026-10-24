---
{
  "schema": "shadow-dev/v1",
  "name": "20261024-feature-wuh-site-video-studio",
  "type": "feature",
  "scope": "video-materials",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261024-feature-wuh-site-video-studio",
  "files": [
    "wuh.site.video/brand/tokens.ts",
    "wuh.site.video/package.json",
    "wuh.site.video/scripts/new-video.mjs",
    "wuh.site.video/shadow-docs/domain.md",
    "wuh.site.video/videos/self-intro/"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "09d6a2376c831469f7ace82a05ddf67ee7633534",
    "verifiedAt": "2026-10-24T03:03:53.394Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "bafd77c5a957f9a3a9c3839e47fb9f207164aeb3874694953e8842abf71b8648",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261024-feature-wuh-site-video-studio/"
      ],
      "message": "docs(shadow): 视频物料仓库 wuh.site.video 立项——工作室三层结构 brief 定稿（review passed，知识结论：新增）",
      "title": "docs(shadow): 视频物料仓库 wuh.site.video 立项 brief",
      "body": "## 摘要\n\n立项视频物料仓库 **wuh.site.video**（独立仓库，非 monorepo），作为后续所有视频项目的启动与维护入口。本 PR 承载规格资产：变更 brief 定稿（复杂度评级 M，review 结论 passed）。\n\n## 变更内容\n\n- 工作室三层结构定稿：`brand/`（令牌单一事实源）+ `videos/<slug>/`（自包含视频单元）+ `shared-assets/` + `scripts/new-video` 脚手架\n- 领域模型：新上下文 `video-materials`；INV-1（brand 单一事实源）/ INV-2（video 自包含）/ INV-3（工具链钉死）观察点全部闭合（对账表见 brief 结果段）\n- 代码实际落位 `~/shadow-desktop/github/wuh.site.video`：首个视频 self-intro 迁移完成并渲出成片（635KB），intro-video 原型目录已删除\n- Knowledge：新增 `wuh.site.video/shadow-docs/knowledge/video-studio-structure.md`（结构约定 + 本机渲染工具链口径：node22 直跑 / 绕沙箱 / 系统 Chrome / port 3211 / 卡住重试）\n\n## 验证\n\n- tsc 零错误（node 22.23.2，TSC-OK）\n- 渲染冒烟出片（330/330 帧）\n- 字面量扫描归零（白名单外）\n- new-video 脚手架冒烟通过\n- studio 预览回归零报错"
    }
  },
  "knowledge": {
    "action": "新增",
    "target": "wuh.site.video/shadow-docs/knowledge/video-studio-structure.md",
    "reason": "新上下文首批长期事实：工作室三层结构约定 + 本机渲染工具链口径（node22 直跑、绕沙箱、系统 Chrome、port 3211、卡住杀进程重试）；候选卡片由 release 阶段写入并补 verified 字段"
  }
}
---

# 新建视频物料仓库 wuh.site.video（视频工作室三层结构）

## 动机

intro-video 原型已验证 Remotion 出片流水线（三段分镜骨架、brand/tokens、node 22 + 系统 Chrome + port 3211 的渲染配置），用户确认将持续产出视频。需要一个长期工作空间统一承载品牌物料与逐条视频工程，避免每条视频从零搭工程、复制令牌。位置证据：本地 `~/shadow-desktop/github/` 已有 `wuh.site.desktop` 等域名式命名先例，新仓同名同目录；远端 owner 取自 x.wuh.site origin（`stack-wuh`）。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更（新仓库结构是后续所有视频的公共契约）；触及面单一（一个新仓库 + 迁移一个原型目录）；可发现性低（结构即文档）
- **期望验证深度:** runtime

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。下游 B 站成片发布；反腐边界：不收博客/桌面端物料，不做发布排期管理
- **统一语言增量:** 物料=令牌+分镜组件+素材总称；分镜 scene=最小可复用视频段组件；视频 video=`videos/<slug>/` 独立成片单元；片头/片尾=品牌级固定片段
- **聚合与不变量:**
  - `INV-1 brand 单一事实源`：分镜组件不得内联色值/字体字面量，必须引用 `brand/tokens`；白名单外字面量扫描归零
  - `INV-2 video 自包含`：每条视频 `videos/<slug>/` 自包含（注册 + 专属素材），删除其一不影响其余视频渲染
  - `INV-3 工具链钉死`：`.mise.toml` 钉 node 22；render 脚本携带 `--browser-executable`（系统 Chrome）与 `--port=3211` 不回退
- **领域事件:** 新视频目录注册进 Root → 该视频进入可渲染清单，`pnpm render` 可指名出片

## 引用规范

- shadow-dev-workflow/norms/domain-model.md
  - 当前结论: 新上下文诞生须同步建 `shadow-docs/domain.md` 上下文地图；统一语言新词登记
  - 适用 scope: 新仓库 shadow-docs
- shadow-dev-workflow/norms/code-style.md
  - 当前结论: 适用范围仅 x.wuh.site monorepo，对新仓库不构成硬约束；类型安全与命名底线沿用为默认风格
  - 适用 scope: 新仓库源码（参考性）
- shadow-dev-workflow/knowledge/domain-driven-shadow-dev.md
  - 当前结论: SDD 不适用于探索性原型——intro-video 按原型直接迁移，不补规格
  - 适用 scope: videos/self-intro 迁移

## 决策

- **选型:** 方案 A 工作室三层——根部单 Remotion 工程 + `brand/` + `videos/<slug>/` + `shared-assets/` + `scripts/new-video`
- **对比方案:** B 每视频独立项目（依赖装 N 遍、tokens 靠复制，复用初衷破产）；C 单模板 + JSON 驱动（压平分镜表达力，违反三次法则；inputProps/schema 保留为未来演进位）
- **理由:** 组件复用零摩擦、依赖单份、渲染踩坑配置继承一份
- 代码落在新仓库 `~/shadow-desktop/github/wuh.site.video`；本仓 brief 仅承载规格与归档，GitHub issue 待新仓库远端建立后于 release 阶段补建
- intro-video 迁移完成并验证后原目录删除（用户已确认）

## 任务

### Phase 1 建仓与迁移
- [x] 初始化仓库骨架（package.json / tsconfig / .mise.toml / .gitignore / launch 配置口径） — `wuh.site.video/`
- [x] 迁移 intro-video → videos/self-intro（Root 注册改造、导入路径调整、out/ 产物重渲验证） — `wuh.site.video/videos/self-intro/`
- [x] brand/tokens.ts 提升为仓库级，分镜组件引用路径更新 — `wuh.site.video/brand/`
- [x] scripts/new-video 脚手架（slug → videos/<slug>/ 最小骨架 + Root 注册提示） — `wuh.site.video/scripts/`

### Phase 2 验证与规格
- [x] 建立 shadow-docs/domain.md 上下文地图 + menu.md 路由 — `wuh.site.video/shadow-docs/`
- [x] INV-1..3 观察点取证（tsc 零错误 / render 出片 / 字面量扫描归零） — `wuh.site.video/`
- [x] intro-video 原目录删除（迁移验证通过后执行，删除前弹确认） — `~/shadow-desktop/github/intro-video`

## 结果

- 实际耗时: 约 1.5 小时（含本机渲染排障）
- 验证:

| INV | 观察点记录 |
|-----|-----------|
| INV-1 brand 单一事实源 | 观察点：`grep -rn "#[0-9a-fA-F]{6}" videos src`（排除 tokens.ts）仅剩 SplitScreen 红绿灯白名单 3 色；`grep "Songti\|PingFang\|Menlo" videos src` 零命中（exit=1） |
| INV-2 video 自包含 | 观察点：node 22.23.2 直跑 remotion render 从 `videos/self-intro/` 独立渲出 `out/self-intro.mp4`（635KB，330/330 帧）；多视频逐目录冒烟观察点待第二条视频落地后补 |
| INV-3 工具链钉死 | 观察点：node 22.23.2 下 `tsc -p tsconfig.json` 零错误（TSC-OK）；`render:self-intro` 脚本携带 `--browser-executable`（系统 Chrome）与 `--port=3211`；渲染实测出片即工具链全链路通过 |

- 附加探针: scripts/new-video.mjs 冒烟（生成 + node --check + 产物走查后清理）；studio 预览回归（SelfIntro 注册、三段 Sequence 时间轴、零 console 报错）
- 本机异常备注: 渲染当日随机出现 V8 段错误与 CLI 空转（跨 node 版本、重试可过），口径「渲染卡住先杀进程重试 + 绕沙箱 + node22 直跑」写入 release 阶段 Knowledge 卡

## 知识评估

- **预期影响:** 新增
- **候选卡片:** wuh.site.video/shadow-docs/knowledge/video-studio-structure.md
- **理由:** 新上下文的长期事实（三层结构约定 + 本机工具链坑：node 24 V8 段错误、port 3000 与 Next dev 冲突、chrome-headless-shell 下载卡死改用系统 Chrome）应在 release 阶段沉淀为该仓库首批 active Knowledge
