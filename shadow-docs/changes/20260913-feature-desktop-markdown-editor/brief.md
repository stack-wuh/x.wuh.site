---
{
  "schema": "shadow-dev/v1",
  "name": "20260913-feature-desktop-markdown-editor",
  "type": "feature",
  "scope": "apps/desktop",
  "status": "branched",
  "baseBranch": "main",
  "branch": "feature/20260913-feature-desktop-markdown-editor",
  "files": [
    "apps/desktop"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
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
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# Electron 通用 Markdown 编辑器（apps/desktop）第一期

## 动机

现有写作链路分散在多个工具中：blog 子模块用 VitePress + 手动 `pnpm post` CLI 发布 Issue，图片粘贴、版本回退、Issue 发布、标签与评论管理缺乏统一的桌面端入口。需要一个**通用** Markdown 桌面编辑器：不与 blog 强制绑定，但深度整合 GitHub 能力（历史回退、同步、Issues 发布、标签、评论），并将 blog 的文件结构化约定作为内置预设。多平台分发（微信公众号/Notion/知乎）通过适配器接口预留，后期实现。

## 引用规范

- shadow-docs/knowledge/content-api.md
  - 当前结论: labels 兼容字符串/数组且多标签 AND 语义；封面推导链 `metadata.cover` → bodyHtml 首图 → Markdown 首图
  - 适用 scope: packages 模块 content API。桌面端 Issues 发布的 frontmatter labels/cover 字段语义与其对齐，保证 issue 进入既有同步链路后行为一致
- shadow-docs/knowledge/admin-console.md
  - 当前结论: 评论有审核/GitHub 同步状态，权限模型为 GitHub OAuth + root（stack-wuh），服务端强制鉴权
  - 适用 scope: console/auth/admin。桌面端评论功能仅覆盖 GitHub 侧（issue comments 列表+回复），不触碰 server 审核语义（审核/隐藏仍在 console，第一期非目标）

## 决策

- **选型:**
  1. **仓库归属**: monorepo 新增 `apps/desktop`（electron-vite + React 19 + TypeScript），不建独立仓库、不进 blog 子模块仓库
  2. **工作区模型**: 任意本地文件夹可打开编辑（纯本地模式）；检测到 git 仓库 + GitHub remote 时解锁历史/同步/Issues 能力；第一期单工作区单窗口
  3. **编辑器形态**: CodeMirror 6 源码模式 + 侧边实时预览（markdown-it/unified 渲染），frontmatter 走结构化表单面板
  4. **图片策略（两阶段）**: 粘贴/拖拽图片先落本地同名 `.assets` 文件夹并插入相对路径链接；提供「上传并替换链接」按钮，走**自定义上传命令适配器**（用户配置一条 shell 命令，stdout 输出 URL）
  5. **历史与回退**: simple-git 调系统 git；commit 手动触发 + 可选防抖自动；回退语义——未 push 的改动用 checkout/reset 单文件恢复，已 push 的提交用 revert 新提交抵消，禁止改写远端历史
  6. **GitHub 能力**: 直连 GitHub REST API（Octokit），作用域 = 当前工作区仓库：Issues 发布（frontmatter title/labels 驱动）、repo labels 管理、issue 评论浏览/回复
  7. **鉴权**: fine-grained PAT + Electron safeStorage 存系统钥匙串；git push 凭证注入；预留 OAuth Device Flow 升级位
  8. **结构化识别**: 通用规则引擎（frontmatter schema + 目录约定均可配置），blog 内置预设：`{YYYY}/{YYYY-MM}/标题.md` 年月目录、`$专题` 目录、同名 `.assets`、发布时注入 `<!-- wuh-site-metadata: {...} -->` 尾注模板
- **对比方案:**
  - 独立新仓库/blog 子模块仓库 → 放弃：跨仓库共享成本高 / 内容仓库被构建产物污染
  - WYSIWYG（TipTap/Milkdown）→ 放弃：frontmatter、HTML 注释尾注、VitePress 容器语法的序列化失真风险，工程量 2-3 倍
  - 纯本地 `.assets` 不做上传 / 粘贴即上传 CDN → 折中：两阶段兼顾离线体验与仓库体积，上传通道用通用适配器而非私有 cdn.wuh.site
  - isomorphic-git / 纯 GitHub API 做历史 → 放弃：大仓库（含大量图片二进制）性能弱 / 离线不可用、速率受限
  - 评论管理走私有 NestJS server admin API → 放弃：HttpOnly Cookie 对桌面客户端不友好，且破坏通用产品定位；server 链路是 blog 项目自有 webhook，issue 发对即可
- **理由:** 所有选型以「通用编辑器 + GitHub 深度集成」为第一原则，blog 降级为内置预设；本地文件为事实源，git 为版本事实源，GitHub 为协作面。Knowledge 约束遵循情况：content-api 的 labels/cover 语义在 Issues 发布中保持一致；admin-console 的评论审核语义不适用桌面端（已列为非目标，不产生冲突）。
- **决策补充（2026-09-13, apply 执行中）:** 仓库归属变更——`apps/desktop` 改为独立仓库 `stack-wuh/wuh.site.desktop`（public），以 git 子模块嵌入父仓库，与 `apps/blog` 同模式：pnpm workspace 排除（`!apps/desktop`）、子仓库独立 lockfile、父仓库仅维护子模块指针。本 brief 中 `apps/desktop/...` 路径语义不变；代码提交发生在子仓库，父仓库侧变更仅 `.gitmodules`、`pnpm-workspace.yaml` 与指针。

## 任务

### Phase 1 — 脚手架与主进程基座
- [x] 初始化 apps/desktop：electron-vite + React 19 + TS，接入 pnpm workspace（name `@wuh.site/desktop`）— `apps/desktop/package.json`
- [ ] main/preload/renderer 三层骨架 + contextBridge 类型安全 IPC 通道定义 — `apps/desktop/src/preload/index.ts`
- [ ] 基础 UI 布局：侧栏文件树 + 编辑区 + 预览区分栏骨架 — `apps/desktop/src/renderer/App.tsx`
- [ ] electron-builder 本地打包配置，mac dir 产物端到端跑通 — `apps/desktop/electron-builder.yml`

### Phase 2 — 工作区与编辑器核心
- [ ] 打开文件夹（dialog）+ 工作区状态 + 文件树组件（过滤 `.assets`、`.git` 等规则）— `apps/desktop/src/main/workspace.ts`
- [ ] CodeMirror 6 集成：markdown 高亮、YAML frontmatter 高亮、打开/保存（主进程 fs IPC）— `apps/desktop/src/renderer/editor/CodeMirrorEditor.tsx`
- [ ] 预览渲染：markdown 渲染 + 本地图片相对路径解析显示 — `apps/desktop/src/renderer/preview/Preview.tsx`
- [ ] 脏状态管理与切换/关闭防丢失确认 — `apps/desktop/src/renderer/editor/useDirtyState.ts`

### Phase 3 — 图片与结构化识别
- [ ] 粘贴/拖拽图片：写入当前文档同名 `.assets` 目录、插入相对路径链接 — `apps/desktop/src/main/images.ts`
- [ ] frontmatter 结构化面板：gray-matter 解析、title/labels/summary/cover/keywords 表单化、写回保持原文格式 — `apps/desktop/src/renderer/frontmatter/FrontmatterPanel.tsx`
- [ ] 目录约定规则引擎 + blog 内置预设（年月目录/$专题/同名 .assets）→ 结构化树视图 — `apps/desktop/src/main/structure.ts`

### Phase 4 — git 历史与回退
- [ ] git 服务层：status/stage/commit（手动 + 可选防抖自动开关）— `apps/desktop/src/main/git.ts`
- [ ] push/pull + 远端/分支状态展示 — `apps/desktop/src/main/git.ts`
- [ ] 历史面板：单文件/全仓 log + diff 查看 — `apps/desktop/src/renderer/history/HistoryPanel.tsx`
- [ ] 回退动作：未 push 单文件 checkout 恢复；已 push 提交 revert（安全确认 UI）— `apps/desktop/src/main/gitRevert.ts`

### Phase 5 — GitHub 集成
- [ ] PAT 凭证管理：safeStorage + 钥匙串存取、git push 凭证注入 — `apps/desktop/src/main/credentials.ts`
- [ ] Issues 发布：frontmatter title/labels 驱动创建/更新当前仓库 Issue（含 blog 预设 metadata 尾注模板）— `apps/desktop/src/main/github/issues.ts`
- [ ] 标签管理：当前仓库 labels 列表/创建/编辑 — `apps/desktop/src/renderer/labels/LabelsPanel.tsx`
- [ ] 评论面板：issue 评论列表 + 发表回复 — `apps/desktop/src/renderer/comments/CommentsPanel.tsx`

### Phase 6 — 适配器预留与收尾
- [ ] 图床上传适配器：自定义上传命令（shell → stdout URL → 替换正文链接）— `apps/desktop/src/main/uploader.ts`
- [ ] publisher 适配器接口预留（GitHub Issues 为首个实现，多平台后置）— `apps/desktop/src/main/publishers/types.ts`
- [ ] 设置页：PAT、git 身份、上传命令、目录约定规则、自动 commit 开关 — `apps/desktop/src/renderer/settings/SettingsPage.tsx`
- [ ] 端到端验收：打开 blog 仓库副本 → 编辑/粘贴图 → commit/push → 发布 Issue → 历史回退全链路走通 — `apps/desktop`

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 新增
- **候选卡片:** shadow-docs/knowledge/desktop-app-architecture.md（候选，review 阶段定）
- **理由:** Electron 桌面端为全新技术域，现有 knowledge 无覆盖；IPC 边界（fs/git/网络仅主进程）、safeStorage 凭证管理、revert-only 回退语义值得在实现验证后沉淀

## 决策补充（2026-09-13, apply 执行中 2）

**组件与主题策略（用户拍板）：保留 desktop 独立仓库拆分；组件与主题在 desktop 内部独立实现，不消费站点组件库。**

依据：`@wuh.site/components` 为源码直出形态（无构建产物，跨仓库 npm 消费需先做发布化改造），且组件库与 web 站点场景耦合较深（@next/third-parties、maplibre-gl 等）；desktop 为 IDE 式深色密集界面，真实可复用组件仅约 5 个原语。执行：`renderer/src/components/ui/` 自持原语 + `renderer/src/theme/` token 化双主题；「组件库发布化」挂起为条件触发项（触发条件：出现真实的跨应用大面积共享诉求）。
