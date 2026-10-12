---
{
  "schema": "shadow-dev/v1",
  "name": "20261012-docs-pr-and-commit-templates",
  "type": "docs",
  "scope": null,
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "docs/20261012-docs-pr-and-commit-templates",
  "files": [
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".gitmessage/commit.template",
    "shadow-docs/changes/20261012-docs-pr-and-commit-templates/brief.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 529,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/529",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "cc4948f98429a80ae3f157ebc7ca2ac2f56beedb",
    "verifiedAt": "2026-10-12T11:24:29.041Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:529",
    "planHash": "fb3e8e1d002d9b3cb4a7d311fb3c7a6f6068b9c29f963856e69541e0d2cdb120",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[docs] 定稿 PR 正文模板与 git commit 模板 —— 对齐 conventional 与四段结构",
      "titleRaw": "[docs] 定稿 PR 正文模板与 git commit 模板 —— 对齐 conventional 与四段结构",
      "supplement": "",
      "body": "## 动机\n本仓历史 PR 文本长期漂移：三种标题格式并存（`[feature] …`、`chore(ci): …`、裸分支名）、正文要么空要么只有 `Closes #N` 一行、并自发追加仓库里根本不存在的 `Co-authored-by` 署名。用户 2026-10-12 定稿结构规范，宿主侧需要落两份文本：GitHub 新建 PR 时自动带出的正文模板，以及 git commit 模板。\n\n## 引用规范\n- `shadow-dev-workflow: norms/pr-message.md`\n  - 当前结论: conventional 标题 + 8 项 scope 定表；正文四段（变更/影响/验证/关联）任何 type 都不得裁剪；必须可追溯 issue；禁止署名尾注；禁止换行切断 token\n  - 适用 scope: `.github/`、`.gitmessage/`、提交与 PR 文本\n\n## 决策\n- 生成而非手写：模板正文由真源产出，本仓不持有结构定义，避免两处漂移。\n- `.gitmessage` 只改内容，不接 `commit.template` 配置、也不接回 `.husky/commit-msg`（用户 2026-10-12 明确「不要」）。该文件当前未被 git 配置引用，属备好待用状态，已在文案里不谎称生效。\n- PR 标题不带 scope：改动落点是 `.github/` 与 `.gitmessage/`，不在 scope 定表内；按定表「表外一律不写」处理，`type=docs` 表意图。\n\n## 任务\n- [ ] task-1 — `.github/PULL_REQUEST_TEMPLATE.md` — 由真源生成并核对与 `norms/templates/pr-body.md` 一致\n- [ ] task-2 — `.gitmessage/commit.template` — type/scope 对齐 commitlint 枚举，删除硬折行指令与表外类型\n- [ ] task-3 — 观察点 — 生成链一致、无署名尾注、无硬折 token 残留、`commitlint.config.js` 取值逐条对照\n\n完整 brief：shadow-docs/changes/20261012-docs-pr-and-commit-templates/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261012-docs-pr-and-commit-templates\",\"type\":\"docs\",\"scope\":null,\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261012-docs-pr-and-commit-templates/brief.md\",\"cliVersion\":\"1.6.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "docs"
      ]
    },
    "release": {
      "files": [
        ".github/PULL_REQUEST_TEMPLATE.md",
        ".gitmessage/commit.template",
        "shadow-docs/changes/20261012-docs-pr-and-commit-templates/brief.md"
      ],
      "message": "docs: 定稿 PR 正文模板与 git commit 模板，类型枚举对齐 commitlint",
      "title": "docs: 定稿 PR 正文模板与 git commit 模板，类型枚举对齐 commitlint",
      "body": "## 变更\n- `.github/PULL_REQUEST_TEMPLATE.md`（新增）：由 shadow-dev-workflow 真源 `norms/templates/pr-body.md` 经 `gen-pr-template.mjs` 逐字生成；标题走 conventional-commits，正文固定四段且任何 type 都不得裁剪，含必须可追溯 issue、禁止署名尾注、禁止切断 token 的说明块。\n- `.gitmessage/commit.template`（改写）：type 清单对齐 `commitlint.config.js` 的 `type-enum`（删表外 `revert`，补 `ui`/`chore`）；scope 采用同一张定表；删除「72-character wrapped」硬折行指令；补单行 ≤100 与禁止署名尾注、必须 `Closes #<issue>`。\n\n## 影响\n- 行为/触发面变化：GitHub 新建 PR 时自动带出统一正文结构；`git commit` 若显式引用该模板即得到对齐后的头部注释。\n- 明确不受影响的范围：零代码与零依赖改动；不改 `.husky/commit-msg`（仍为 `exit 0`，commitlint 不拦截，按你的裁定保持不接回）；不设置 `git config commit.template`，因此不改变任何人的默认提交体验；`shadow-docs/` 既有 change 与知识卡不动。\n- 本 PR 只统一文本、不构成强制：硬约束目前只在 CLI 侧 `release/publish plan` 的 `PR_PARAMS_REQUIRED` 门上。\n- 回滚方式：revert 本 PR 即删除模板与还原 `.gitmessage`，无跨仓副作用（真源在插件仓，宿主模板可随时重新生成）。\n\n## 验证\n- 生成链：`--check` → `ok: 与 norms/templates/pr-body.md 一致`（exit 0），证明宿主模板非手写。\n- 枚举差集：`commitlint` 10 项与 `.gitmessage` 10 项**差集为空**；`revert` 已删、`ui`/`chore` 已补；「72-character」硬折行指令已消失。\n- 残留扫描：无实际 `Co-authored-by` 行；行首出现 `brief：`/路径/`#<数字>` 的断词残留 0 处；四段齐全。\n- 按区分算的单行长判定：模板正文块超限 0 行；`.gitmessage` 超限 2 行；模板 HTML 注释块超限 2 行——注释块属规范说明文字，不属第 6 条约束的正文载荷，显式留痕不报成全绿。\n- 未覆盖项：`.gitmessage/commit.template` 未被 `git config commit.template` 引用（备好待用）；commitlint 不拦截，故格式约束仍依赖生成链与 CLI 门。\n\n## 关联\n- Closes #529\n- brief: shadow-docs/changes/20261012-docs-pr-and-commit-templates/brief.md"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": "shadow-docs/knowledge",
    "reason": "规范真源在插件仓 norms/pr-message.md，本仓只承载生成物；未产生需要独立卡片承载的长期事实"
  }
}
---

# 20261012-docs-pr-and-commit-templates

## 复杂度评级
- **评级:** S
- **理由:** 只新增/改写两份仓库治理文本（PR 正文模板、git commit 模板），零代码、零依赖、不影响运行时行为；验证只需执行结构与引用一致性扫描。
- **期望验证深度:** code-read

## 领域模型
- **限界上下文:** `workflow-governance` — 变更与发布的文本规范。真源在 shadow-dev-workflow 的 `norms/pr-message.md`，本仓只承载生成物与本地模板。
- **被触及既有不变量:** 宿主 PR 模板必须与插件真源逐字一致（由生成链保证，手改即判红）。

## 引用规范
- `shadow-dev-workflow: norms/pr-message.md`
  - 当前结论: conventional 标题 + 8 项 scope 定表；正文四段（变更/影响/验证/关联）任何 type 都不得裁剪；必须可追溯 issue；禁止署名尾注；禁止换行切断 token
  - 适用 scope: `.github/`、`.gitmessage/`、提交与 PR 文本

## 动机

本仓历史 PR 文本长期漂移：三种标题格式并存（`[feature] …`、`chore(ci): …`、裸分支名）、正文要么空要么只有 `Closes #N` 一行、并自发追加仓库里根本不存在的 `Co-authored-by` 署名。用户 2026-10-12 定稿结构规范，宿主侧需要落两份文本：GitHub 新建 PR 时自动带出的正文模板，以及 git commit 模板。

## 覆盖范围

- `.github/PULL_REQUEST_TEMPLATE.md`（新增）：**由插件真源生成**（`norms/templates/pr-body.md` 经 `gen-pr-template.mjs` 逐字落盘），含标题规范、四段必需集与生成来源声明。
- `.gitmessage/commit.template`（改写）：type 清单对齐 `commitlint.config.js` 的 `type-enum`（删表外 `revert`，补 `ui`/`chore`），scope 用同一张定表；补单行 ≤100 与禁止切断 token、禁止署名尾注、必须 `Closes #<issue>`；删掉原先的「72-character wrapped」硬折行指令（正是 `完整\nbrief：…` 这类断词的来源）。

## 决策

- 生成而非手写：模板正文由真源产出，本仓不持有结构定义，避免两处漂移。
- `.gitmessage` 只改内容，不接 `commit.template` 配置、也不接回 `.husky/commit-msg`（用户 2026-10-12 明确「不要」）。该文件当前未被 git 配置引用，属备好待用状态，已在文案里不谎称生效。
- PR 标题不带 scope：改动落点是 `.github/` 与 `.gitmessage/`，不在 scope 定表内；按定表「表外一律不写」处理，`type=docs` 表意图。

## 任务

- [x] task-1 — `.github/PULL_REQUEST_TEMPLATE.md` — 由真源生成并核对与 `norms/templates/pr-body.md` 一致
- [x] task-2 — `.gitmessage/commit.template` — type/scope 对齐 commitlint 枚举，删除硬折行指令与表外类型
- [x] task-3 — 观察点 — 生成链一致、无署名尾注、无硬折 token 残留、`commitlint.config.js` 取值逐条对照

## 结果

评级 S：执行结构、引用一致性与残留扫描，全部为真实命令/实测计数。

- 生成链：`gen-pr-template.mjs --template norms/templates/pr-body.md --check --out .github/PULL_REQUEST_TEMPLATE.md` → `ok: … 与 norms/templates/pr-body.md 一致`（exit 0）。宿主模板非手写，逐字来自插件真源。
- 类型枚举对照：`commitlint.config.js` 的 `type-enum` 10 项与 `.gitmessage` 列出的 10 项**差集为空**（build feat chore style docs ui fix refactor ci test）；表外的 `revert` 已删，`ui`/`chore` 已补。
- 断词根源清除：原「72-character wrapped」硬折行指令已从 `.gitmessage` 删除——`完整\nbrief：…` 这类把 token 切断的正文正是它教出来的。
- 署名尾注：两文件都不存在实际的 `Co-authored-by`/`Signed-off-by` 行；该词只以「禁止」文字出现，属规则文本。
- 折断扫描：行首出现 `brief：`、`shadow-docs/`、`#<数字>` 的残留 **0 处**。
- 段落结构：宿主模板四段齐全 —— `## 变更` / `## 影响` / `## 验证` / `## 关联`。
- §6 单行 ≤100 判定（按区分别算，不混为一句「合规」）：模板**正文块超限 0 行**；`.gitmessage` 超限 2 行；模板 HTML 注释块超限 2 行——注释块是规范说明文字，不属 §6 约束的正文载荷，此处显式留痕而非报成全绿。
- 未覆盖项（明说）：本 PR 只统一文本，**不构成强制**——`git config commit.template` 未设置（`.gitmessage/commit.template` 仍是备好待用状态）、`.husky/commit-msg` 仍是 `exit 0`（用户明确不要接回 commitlint）。标题与正文的硬约束目前只在 CLI 侧的 `PR_PARAMS_REQUIRED` 门上。
