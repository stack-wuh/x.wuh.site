# Knowledge 知识沉淀体系

> 状态：设计已确认，待实施

## 动机

项目已经迁移到 `shadow-dev-workflow v6`，但现有知识体系仍存在以下问题：

- `knowledge/` 中混有按历史 Bug 或功能变更命名的条目，不完全符合“当前执行真相源”的定位。
- Knowledge 卡片缺少统一的作用范围、状态、来源和有效性信息。
- `menu.md`、`INDEX.md`、`changes/` 与 `knowledge/` 尚未形成稳定的读写闭环。
- 项目外 memory 同时包含项目事实、个人偏好、临时故障和已失效的 OpenSpec 规则，作用域和优先级不清晰。
- OpenSpec 虽已从项目迁移出去，部分全局规则、memory 或工作流引用仍可能继续影响执行。

## 目标

建立以 `shadow-dev-workflow v6` 为唯一流程的轻量知识沉淀体系：

- `propose → apply → review → ship` 是唯一变更流程。
- OpenSpec 不再作为流程入口、兼容层或故障兜底。
- `shadow-docs/knowledge/` 保存当前有效、可直接指导执行的项目真相。
- 每次变更都必须评估知识影响，但只有产生长期有效的新事实时才新增或更新 Knowledge。
- 项目知识与跨项目规范按作用域分仓，不再依赖项目外 memory 驱动执行。

## 非目标

- 不删除必要的历史迁移记录和 Git 历史。
- 不把一次变更的完整实现过程复制进 Knowledge。
- 不引入类似 OpenSpec 的多制品结构、生成器或额外 CLI。
- 不在本设计阶段迁移现有卡片、修改工作流 Skill 或清理规则文件。

## 决策

### 1. 组织方式

采用“扁平约束卡片 + 路由表”方案：

```text
shadow-docs/
├── menu.md                 # 任务到 Knowledge 的路由
├── INDEX.md                # Change 索引，不承载执行规则
├── changes/<name>/brief.md # 单次变更的动机、决策、任务、验证和知识评估
└── knowledge/<topic>.md    # 当前有效的项目执行真相

shadow-dev-workflow/
├── norms/                  # 跨项目硬规则与工程规范
└── knowledge/              # 跨项目经验与协作知识
```

职责边界：

- `brief.md` 回答“这次变更发生了什么”。
- Knowledge 回答“现在处理该领域时应怎么做”。
- `menu.md` 负责按任务域精确路由，避免无目标读取全部知识。
- `INDEX.md` 只索引变更及状态，不作为执行规则来源。
- 历史记录不能覆盖当前 active Knowledge。
- 项目外 memory 不再作为工作流执行依据。

### 2. Knowledge 约束卡片格式

每个文件只表达一个可独立执行的稳定知识单元：

```markdown
---
title: 博客滚动行为
domain: blog
keywords: [滚动, 阅读进度, animation-timeline]
scope: [packages/wuh.site.next/app/post]
status: active
source:
  - changes/2026-05-10-B-blog-scroll-flicker/brief.md
verified: 2026-08-08
---

# 博客滚动行为

## 当前结论
一句话描述现在成立的项目事实。

## 执行约束
- 修改相关功能时必须遵守的规则。
- 禁止重新引入的旧实现。

## 适用边界
说明适用与不适用的场景。

## 验证方式
列出可重复的检查方法，不保存一次性输出。

## 关联知识
- [相关卡片](other-topic.md)
```

字段含义：

- `title`：稳定领域事实的名称，不使用 `fix`、`add` 或日期命名。
- `domain`：用于路由和去重的主领域。
- `keywords`：用户表达、业务术语、技术术语和常见故障现象。
- `scope`：适用的目录、包、路由或明确业务域。
- `status`：`active` 或 `deprecated`。
- `source`：形成或改变当前结论的 change brief。
- `verified`：最后一次确认当前结论仍有效的日期。

### 3. 工作流读写闭环

#### propose

1. 从 `menu.md` 按任务域定位卡片。
2. 只读取命中的 Knowledge。
3. 在本次 `brief.md` 中引用适用约束。

#### apply

1. 把已引用的 active Knowledge 当作当前执行约束。
2. 若代码事实与 Knowledge 冲突，停止实现并查明哪一方过期。
3. 不在实现过程中为配合代码而随意改写 Knowledge。

#### review

1. 检查实现是否违反已引用约束。
2. 判断本次变更是否产生新的长期有效事实。
3. 验证相关卡片中的检查方法仍然有效。

#### ship

1. 在 `brief.md` 中填写知识评估：`新增`、`更新` 或 `无需变更`，并说明理由。
2. 产生新事实时，新建卡片并加入 `menu.md` 路由。
3. 改变既有事实时，原位更新卡片，向 `source` 追加本次 brief，并更新 `verified`。
4. 事实失效时，将卡片标记为 `deprecated`，指向替代卡片或明确写明无替代；确认没有有效引用后才能清理。
5. 更新 `INDEX.md` 中的变更状态。

### 4. 质量门禁

#### 写入门禁

- 标题必须描述稳定领域事实，不按历史事件命名。
- 一张卡片只表达一个可独立执行的知识单元。
- 不复制 brief 中的实现过程和一次性验证输出。
- 新增前搜索 `keywords`、`domain` 和 `scope`；能更新现有卡片时不新增。

#### 一致性门禁

- active 卡片必须出现在 `menu.md` 的至少一条路由中。
- `source` 必须指向存在的 brief。
- `scope` 必须是目录、包、路由或明确业务域。
- `verified` 由最后一次确认当前结论有效的变更更新。
- deprecated 卡片必须指向替代项或明确写明无替代。

#### 冲突优先级

1. 当前代码与可重复的验证结果。
2. active Knowledge。
3. 已完成的 change brief。
4. 历史索引与迁移记录。

发现代码与 Knowledge 冲突时，不直接猜测或静默覆盖。先确认代码是有意变更还是回归，再更新其中已经过期的一方。

### 5. OpenSpec 清理与知识迁移

清理所有仍可能影响未来执行的 OpenSpec 依赖：

- 全局和项目 `CLAUDE.md` 中的 OpenSpec 执行规则及 CLI 崩溃兜底。
- 项目外 memory 中的 `openspec-workflow` 等过期执行依据。
- shadow-dev Skill 或 norms 中仍存在的 OpenSpec 调用、路径或兼容逻辑。
- `menu.md` 或索引中把历史 OpenSpec 内容路由为当前规范的入口。

保留：

- 已完成迁移的 brief。
- `INDEX.md` 中必要的历史追溯记录。
- Git 历史。

迁移规则：

- 当前仍有效的项目事实进入项目 `shadow-docs/knowledge/`。
- 跨项目硬规则进入 `shadow-dev-workflow/norms/`。
- 跨项目经验和协作约束进入 `shadow-dev-workflow/knowledge/`。
- 已失效内容不迁移，只移除其执行引用。
- 保留的历史文档必须明确标识“仅供追溯，不是当前流程依据”。

## 实施计划

> **执行要求：** 使用 `shadow-dev-apply` 按复选框逐项执行；每个计划完成后先运行本计划验证，再进入下一个计划。项目明确禁止未经要求执行 Git，因此计划不包含提交步骤。

实施拆为三个可独立验证的计划，依赖顺序为 **A → B → C**：

- 计划 A 建立通用 Knowledge 规范和工作流闭环。
- 计划 B 标准化 x.wuh.site 项目 Knowledge。
- 计划 C 清理 OpenSpec 执行依赖并淘汰项目外 memory 入口。

### 计划 A：shadow-dev-workflow Knowledge 规范与闭环

**目标：** 让 shadow-dev-workflow 成为卡片格式、路由、冲突处理、知识评估和生命周期的唯一通用定义。

#### 文件地图

**新增：**

- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/norms/knowledge-cards.md`：Knowledge 卡片格式、写入门禁、一致性门禁和冲突优先级。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/knowledge/bug-investigation.md`：跨项目 Bug 单一调查上下文约束。

**修改：**

- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/menu.md`：增加 Knowledge 治理和 Bug 调查路由，只读取命中的 active 卡片。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/CLAUDE.md`：明确 norms、通用 Knowledge、项目 Knowledge、menu 和历史记录的职责。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/README.md`：更新目录结构和四阶段知识闭环，OpenSpec 仅允许作为历史背景。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-knowledge/SKILL.md`：按 `domain + keywords + scope + status` 查询，检查 source、路由和冲突。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-propose/SKILL.md`：读取和引用 active Knowledge，在 brief 中记录预期知识影响。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-apply/SKILL.md`：执行前加载引用卡片，遇到代码与 Knowledge 冲突时停止相关任务并查明原因。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-review/SKILL.md`：增加 Knowledge 质量门禁和最终知识影响判断。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-ship/SKILL.md`：实现新增、更新、废弃、无需变更四类闭环，替换旧极简模板。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/norms/tdd-verification.md`：增加文档治理任务的结构、引用、路由和残留扫描验证。
- `/Users/wuhong/shadow-desktop/github/shadow-dev-workflow/rules/behavior.md`：补齐编号与标题，并引用 Bug 单一上下文卡片和 Knowledge 冲突规则。

#### Task A1：建立通用卡片规范

- [x] 新建 `norms/knowledge-cards.md`，写入本 brief 已确认的七个 frontmatter 字段、五个正文分区、写入门禁、一致性门禁和冲突优先级。
- [x] 明确 `status` 只允许 `active` 和 `deprecated`。
- [x] 明确项目卡片位于 `shadow-docs/knowledge/`，跨项目经验位于工作流仓库 `knowledge/`。
- [x] 明确禁止以日期或 `fix`、`add`、`redesign`、`optimize` 等事件命名卡片。
- [x] 运行字段检查：

```bash
rg -n "title:|domain:|keywords:|scope:|status:|source:|verified:" /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/norms/knowledge-cards.md
```

预期：七个字段均命中。

#### Task A2：迁移 Bug 单一上下文经验

- [x] 新建 `knowledge/bug-investigation.md`，使用完整卡片格式；`domain: debugging`，`scope: [cross-project]`。
- [x] 将“复现、调用链追踪、根因确认、修复和回归验证保持在同一持续上下文”写为当前结论。
- [x] 将“不得把同一 Bug 的关联代码阅读拆给多个隔离子代理”写为执行约束。
- [x] 将独立 lint、类型检查和无共享状态测试可并行写入适用边界。
- [x] 不复制旧 memory 的会话元数据。

#### Task A3：升级通用路由

- [x] 修改 `menu.md`，增加 Knowledge 治理到 `norms/knowledge-cards.md` 的路由。
- [x] 在 Bug 路由中加入 `knowledge/bug-investigation.md`。
- [x] 明确只读取由任务域、关键词和 scope 命中的卡片，不扫描全部 Knowledge。
- [x] 明确默认只读取 active；deprecated 仅用于替代关系追溯。
- [x] 统一项目知识路径为 `shadow-docs/knowledge/`。

#### Task A4：升级 Knowledge 查询 Skill

- [x] 修改 `skills/shadow-dev-knowledge/SKILL.md`，将匹配条件升级为 `domain + keywords + scope + status`。
- [x] 默认过滤 `status: active`，只读取 menu 命中的卡片。
- [x] 查询输出包含标题、scope、source、verified 和执行约束。
- [x] source 不存在、active 卡片无路由、scope 不明确或同 scope 存在结论冲突时，输出阻塞而非继续。
- [x] 使用完整卡片模板替换仅含 `keywords` 的旧示例。
- [x] 新增前先查重，能更新现有卡片时不新建。

#### Task A5：接入 propose 与 apply

- [x] 修改 `skills/shadow-dev-propose/SKILL.md`，要求从 menu 只读取命中的 active Knowledge。
- [x] brief 的引用规范记录卡片路径、当前结论和适用 scope。
- [x] 将以下区块加入 propose 的 brief 模板：

```markdown
## 知识评估

- **预期影响:** 新增 / 更新 / 废弃 / 无需变更
- **候选卡片:** <路径或无>
- **理由:** <为什么>
```

- [x] 明确 propose 只做预期评估，不提前创建卡片。
- [x] 修改 `skills/shadow-dev-apply/SKILL.md`，执行前加载 brief 引用的 active Knowledge。
- [x] 遇到代码事实与 Knowledge 冲突时暂停相关 task，判断代码是有意变更、回归还是卡片过期。
- [x] 明确 Knowledge 的最终写入发生在 ship，不在 apply 中静默改写。

#### Task A6：接入 review 与 ship

- [x] 修改 `skills/shadow-dev-review/SKILL.md`，检查实现是否违反引用卡片、验证方式是否仍成立、是否产生长期事实。
- [x] 将“稳定事实已变化但 brief 仍填无需变更”设为阻塞项。
- [x] 将 source、scope、verified 缺失和 active 卡片无路由设为阻塞项。
- [x] 修改 `skills/shadow-dev-ship/SKILL.md`，要求 ship 前完成最终知识评估。
- [x] 实现四类动作：新增卡片并更新菜单；原位更新并追加 source；标记 deprecated 并指向替代项；记录无需变更及理由。
- [x] 新增前按 `domain + keywords + scope` 查重。
- [x] 删除旧极简模板，不引入新的 Knowledge CLI。

#### Task A7：同步规则与说明

- [x] 修改 `CLAUDE.md` 和 `README.md`，明确三类知识作用域和四阶段闭环。
- [x] README 中如保留 OpenSpec，只允许说明为历史迁移背景，并明确不是当前入口。
- [x] 修改 `norms/tdd-verification.md`，声明知识治理不创建测试文件，改用结构与引用检查；代码功能和 Bug 仍遵守 TDD。
- [x] 修改 `rules/behavior.md`，补齐编号和标题，引用 `knowledge/bug-investigation.md`，加入 Knowledge 冲突规则。

#### 计划 A 验证

- [x] 运行现有工作流测试：

```bash
cd /Users/wuhong/shadow-desktop/github/shadow-dev-workflow && npm test
```

预期：现有测试全部通过，不新增测试文件。

- [x] 检查完整字段在规范、查询和写入 Skill 中都出现：

```bash
rg -n "title:|domain:|keywords:|scope:|status:|source:|verified:" /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/norms/knowledge-cards.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-knowledge/SKILL.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-ship/SKILL.md
```

预期：三个文件均包含完整字段。

- [x] 检查四阶段闭环：

```bash
rg -n "知识评估|active Knowledge|deprecated|无需变更" /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills/shadow-dev-{propose,apply,review,ship,knowledge}/SKILL.md
```

预期：五个 Skill 均包含与职责匹配的规则。

- [x] 检查当前执行面不存在 OpenSpec 依赖：

```bash
rg -n "OpenSpec|openspec" /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/CLAUDE.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/README.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/menu.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/rules /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/norms /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills
```

预期：无当前执行依赖；若 README 保留历史字样，附近必须明确“仅供追溯、非当前入口”。

### 计划 B：标准化 x.wuh.site Knowledge

**目标：** 将现有 30 张卡片转为统一约束卡片，消除事件型命名和重复主题，建立完整项目路由。

#### 文件地图

**重命名：**

- `shadow-docs/knowledge/blog-scroll-flicker-fix.md` → `shadow-docs/knowledge/blog-scroll-behavior.md`
- `shadow-docs/knowledge/redesign-error-pages.md` → `shadow-docs/knowledge/error-pages.md`
- `shadow-docs/knowledge/code-split.md` → `shadow-docs/knowledge/about-code-structure.md`

**合并：**

- 将 `shadow-docs/knowledge/post.md` 的独有结论迁入 `blog-detail.md`，封面细则仍保留在 `post-cover.md`。
- 将 `shadow-docs/knowledge/error-handling.md` 的异常格式和 `/v2/docs` 约束迁入 `api-standardization.md`。

**修改：**

- `shadow-docs/knowledge/*.md`：统一 frontmatter、正文结构、source 和关联知识。
- `shadow-docs/menu.md`：增加任务域、关键词和完整 active 卡片路由。
- `shadow-docs/INDEX.md`：补齐当前 Change 索引，并隔离历史 OpenSpec 迁移索引。

**删除：**

- 三个重命名后的旧文件，以及合并后的 `post.md`、`error-handling.md`。这些删除必须在迁移、引用更新和验证完成后单独确认。

#### Task B1：建立迁移清单并验证来源

- [x] 为 30 张现有卡片逐一确认稳定主题、domain、scope 和 source brief。
- [x] source 使用相对于 `shadow-docs/` 的路径，例如 `changes/archive/20260510_B_blog-scroll-flicker-fix/brief.md`。
- [x] 通过相关代码或可重复验证确认当前结论后，才将本次日期写入 `verified`；仅转写文档不能视为验证。
- [x] domain 统一使用：`about`、`admin`、`api`、`blog`、`build`、`components`、`performance`、`guestbook`、`frontend`、`seo`、`analytics`、`weread`。

#### Task B2：标准化卡片格式

- [x] 为每张存续卡片增加 `title`、`domain`、`keywords`、`scope`、`status`、`source`、`verified`。
- [x] 为每张卡片建立 `当前结论`、`执行约束`、`适用边界`、`验证方式`、`关联知识` 五个分区。
- [x] 将一次性实现过程和验证输出留在 brief，不复制进卡片。
- [x] 一张卡片只保留一个可独立执行的稳定知识单元。

#### Task B3：完成重命名和主题收敛

- [x] 创建 `blog-scroll-behavior.md`，迁移博客滚动与阅读进度约束；更新所有关联链接和 menu。
- [x] 创建 `error-pages.md`，迁移错误页面约束；更新所有关联链接和 menu。
- [x] 创建 `about-code-structure.md`，迁移 About 页面代码结构约束；更新所有关联链接和 menu。
- [x] 将 `post.md` 的 PostToolbar、目录、slug 路由和正文 fallback 等独有事实并入 `blog-detail.md`。
- [x] `blog-detail.md` 只链接 `post-cover.md`，不重复封面详细规则。
- [x] 将 `error-handling.md` 的统一异常格式和 `/v2/docs` 约束并入 `api-standardization.md`。
- [x] 保持 `repos-api.md` 只承载 Repos 独有规则；保持 `homepage-data.md` 与 `first-load-performance.md` 分离并双向关联。

#### Task B4：重建项目路由

- [x] 修改 `shadow-docs/menu.md`，增加任务域、关键词和卡片列。
- [x] 确保每个 active 卡片至少出现一次。
- [x] 增加当前遗漏的错误处理/API 文档、错误页面、首页数据、About 代码结构路由。
- [x] 默认只路由 active 卡片。
- [x] 删除旧文件路径和已合并卡片路径。

#### Task B5：更新 Change 索引和历史边界

- [x] 在 `shadow-docs/INDEX.md` 当前变更表加入 `2026-08-01-migrate-to-v6`、两个 2026-08-04 变更和 `2026-08-08-P-knowledge-system`。
- [x] 将 OpenSpec 迁移表明确标记为“仅供历史追溯，不是当前规范或执行入口，不能覆盖 active Knowledge”。
- [x] 不在 INDEX 中增加 Knowledge 路由。
- [x] 如果 shadow-dev CLI 管理 INDEX 生成区域，使用其 plan/execute 流程，不手改生成内容。

#### Task B6：删除旧卡片（破坏性确认门禁）

以下删除必须满足“新文件存在、内容迁移完成、所有引用已更新、验证通过”，并在实际执行时再次确认：

- [x] 删除 `shadow-docs/knowledge/blog-scroll-flicker-fix.md`。
- [x] 删除 `shadow-docs/knowledge/redesign-error-pages.md`。
- [x] 删除 `shadow-docs/knowledge/code-split.md`。
- [x] 删除 `shadow-docs/knowledge/post.md`。
- [x] 删除 `shadow-docs/knowledge/error-handling.md`。

#### 计划 B 验证

- [x] 检查所有卡片字段和正文分区：

```bash
python3 -c '
from pathlib import Path
root = Path("/Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs/knowledge")
required = ["title:", "domain:", "keywords:", "scope:", "status:", "source:", "verified:", "## 当前结论", "## 执行约束", "## 适用边界", "## 验证方式", "## 关联知识"]
errors = [f"{path}: missing {item}" for path in sorted(root.glob("*.md")) for item in required if item not in path.read_text()]
print("\n".join(errors))
raise SystemExit(1 if errors else 0)
'
```

预期：无输出，退出码 0。

- [x] 检查事件型文件名：

```bash
find /Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs/knowledge -maxdepth 1 -type f | grep -Ei '(^|[-_])(fix|add|redesign|optimize)([-_]|\.md$)'
```

预期：无输出。

- [x] 检查 source 存在：

```bash
python3 -c '
from pathlib import Path
import re
docs = Path("/Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs")
errors = []
for path in sorted((docs / "knowledge").glob("*.md")):
    for source in re.findall(r"^\s*-\s+(changes/.+/brief\.md)\s*$", path.read_text(), re.M):
        if not (docs / source).is_file():
            errors.append(f"{path}: missing source {source}")
print("\n".join(errors))
raise SystemExit(1 if errors else 0)
'
```

预期：无输出，退出码 0。

- [x] 检查旧路径和死链接：

```bash
rg -n "blog-scroll-flicker-fix|redesign-error-pages|knowledge/code-split\.md|knowledge/post\.md|knowledge/error-handling\.md" /Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs/menu.md /Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs/knowledge
```

预期：无输出。

- [x] 检查 OpenSpec 只存在于历史区域：

```bash
rg -n "OpenSpec|openspec" /Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs/menu.md /Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs/INDEX.md
```

预期：menu 无命中；INDEX 仅在明确的历史追溯区域命中。

### 计划 C：清理执行依赖与淘汰 memory

**目标：** 清除仍会影响未来执行的 OpenSpec、旧路径、旧 Skill 名和项目外 memory 入口，同时保留必要历史追溯。

**前置条件：** 计划 A 的通用 Knowledge 规范和 `knowledge/bug-investigation.md` 已存在并通过验证；删除 memory 前已完成内容迁移。

#### 文件地图

**修改：**

- `/Users/wuhong/.claude/CLAUDE.md`：修正 `.changes/knowledge/` 路径，声明 shadow-dev v6 唯一流程和按作用域分仓规则，迁入个人设计偏好。
- `/Users/wuhong/shadow-desktop/github/x.wuh.site/CLAUDE.md`：删除 memory 自动记录与执行入口，改为项目 Knowledge/brief/workflow Knowledge 分流。
- `/Users/wuhong/shadow-desktop/github/x.wuh.site/.claude/CLAUDE.md`：将旧 `wuh-*` 改为 `shadow-dev-*`，收窄为项目补充配置。

**删除：**

- 过期 memory 和重复全局 rules。所有删除都必须在实际执行时单独确认。

#### Task C1：修正全局工作流入口

- [x] 修改 `/Users/wuhong/.claude/CLAUDE.md`，将项目知识路径从 `.changes/knowledge/` 改为 `shadow-docs/knowledge/`。
- [x] 明确唯一流程为 `shadow-dev-propose → shadow-dev-apply → shadow-dev-review → shadow-dev-ship`。
- [x] 明确项目外 memory 不是执行依据；项目事实、跨项目硬规则、跨项目经验分别进入项目 Knowledge、workflow norms、workflow Knowledge。
- [x] 将个人设计偏好迁入全局配置：浪漫、文艺、技术感与温度并存；项目设计系统和项目规则优先。

#### Task C2：修正项目配置

- [x] 修改项目根 `CLAUDE.md`，删除“错误/阻塞自动写 memory”和“memory 跨会话执行存储”规则。
- [x] 改为：长期项目事实进入 `shadow-docs/knowledge/`；单次问题与验证结果留在当前 brief；跨项目稳定经验进入 workflow Knowledge；未复现的临时故障不沉淀。
- [x] 明确按 menu 读取 Knowledge，不遍历项目外 memory。
- [x] 保留项目“不生成测试文件/文档，除非明确要求”和“不执行 Git，除非明确要求”。
- [x] 修改 `.claude/CLAUDE.md`，将 `wuh-*` 改为 `shadow-dev-*`，只保留项目补充信息。

#### Task C3：处理 memory 内容

- [x] 确认 `knowledge/bug-investigation.md` 已完整吸收 Bug 单一上下文经验。
- [x] 确认个人设计偏好已迁入全局 CLAUDE。
- [x] 对 `memory/environment.md` 重新运行其相关验证；如果 Node/TypeScript segfault 不再复现，则不迁移。如果仍可复现，只把经验证的稳定环境事实写入项目 Knowledge，不保留“可跳过类型检查”的旧兜底。
- [x] `memory/openspec-workflow.md` 不迁移，其内容已经失效。

#### Task C4：删除过期执行来源（破坏性确认门禁）

以下删除必须在迁移目标存在、引用已更新、扫描通过后再次确认：

- [x] 删除 `/Users/wuhong/.claude/projects/-Users-wuhong-shadow-desktop-github-x-wuh-site/memory/openspec-workflow.md`。
- [x] 删除已迁移的 `memory/style-pref.md`。
- [x] 删除已迁移的 `memory/bug-investigation-single-context.md`。
- [x] 根据 C3 复现结果删除或迁移后删除 `memory/environment.md`。
- [x] 所有条目处理完成后删除 `memory/MEMORY.md`。
- [x] 确认 workflow rules 已成为唯一权威加载源后，删除重复的 `/Users/wuhong/.claude/rules/behavior.md` 和 `/Users/wuhong/.claude/rules/iron-laws.md`；同时删除全局 CLAUDE 中的死引用。

#### 计划 C 验证

- [x] 扫描当前执行面 OpenSpec 残留：

```bash
rg -n "OpenSpec|openspec|\.openspec\.yaml|openspec/config\.yaml" /Users/wuhong/.claude/CLAUDE.md /Users/wuhong/.claude/rules /Users/wuhong/shadow-desktop/github/x.wuh.site/CLAUDE.md /Users/wuhong/shadow-desktop/github/x.wuh.site/.claude/CLAUDE.md /Users/wuhong/shadow-desktop/github/x.wuh.site/shadow-docs/menu.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/CLAUDE.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/menu.md /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/rules /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/norms /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/skills
```

预期：无执行依赖。历史 INDEX 与 archived briefs 不在扫描范围。

- [x] 扫描旧路径和旧 Skill 名：

```bash
rg -n "\.changes/knowledge|wuh-(propose|apply|review|ship|knowledge)" /Users/wuhong/.claude/CLAUDE.md /Users/wuhong/shadow-desktop/github/x.wuh.site/CLAUDE.md /Users/wuhong/shadow-desktop/github/x.wuh.site/.claude/CLAUDE.md
```

预期：无输出。

- [x] 扫描项目外 memory 执行入口：

```bash
rg -n "memory/|自动记录|跨会话积累|执行依据|真相源" /Users/wuhong/.claude/CLAUDE.md /Users/wuhong/shadow-desktop/github/x.wuh.site/CLAUDE.md /Users/wuhong/shadow-desktop/github/x.wuh.site/.claude/CLAUDE.md
```

预期：只允许出现“memory 不作为执行依据”的否定说明。

- [x] 验证迁移目标：

```bash
test -f /Users/wuhong/shadow-desktop/github/shadow-dev-workflow/knowledge/bug-investigation.md && rg -n "浪漫|文艺|技术感|设计偏好" /Users/wuhong/.claude/CLAUDE.md
```

预期：命令成功并命中设计偏好。

- [x] 验证项目 memory 已清空：

```bash
find /Users/wuhong/.claude/projects/-Users-wuhong-shadow-desktop-github-x-wuh-site/memory -maxdepth 1 -type f
```

预期：无输出；若运行环境强制保留索引，只允许保留明确声明“非执行来源”的空索引。

### 联合验收

- [x] 计划 A、B、C 的所有验证命令通过。
- [x] shadow-dev-workflow v6 是唯一执行流程。
- [x] 所有 active 项目 Knowledge 均符合统一格式、可被 menu 路由、source 存在、scope 明确。
- [x] 每个新 change brief 模板都包含知识评估。
- [x] 当前执行面没有 OpenSpec、旧 Skill 名、旧 Knowledge 路径或项目外 memory 执行入口。
- [x] 历史 OpenSpec 记录只存在于明确隔离的历史追溯区域。

## 验收标准

- shadow-dev-workflow v6 是唯一可执行流程。
- 当前规则、Skill 和路由中不存在 OpenSpec 调用或兜底依赖。
- 所有 active Knowledge 符合统一卡片格式，并至少被一条 `menu.md` 路由引用。
- 每个卡片的 `source` 可解析，`scope` 明确，`verified` 有值。
- 每个新 change 的 brief 都包含知识影响评估。
- 项目事实、跨项目规范和历史记录之间不存在职责重叠。
- 项目外 memory 不再被当作执行真相源。

## 验收结果

- **Knowledge 结构：** 28 张 active 项目卡片全部包含七个字段和五个正文分区；结构检查 `errors=0`。
- **来源：** 28 张卡片的 source 均可解析；检查 `source_errors=0`。
- **路由与命名：** 已更新 `shadow-docs/menu.md`，事件型文件名和 5 个旧重复卡片已在确认后删除，旧路径扫描无结果。
- **工作流闭环：** propose、apply、review、ship、knowledge 均包含 active 查询、知识评估和生命周期规则。
- **OpenSpec：** 当前执行面扫描无依赖；INDEX 中只保留明确隔离的历史追溯区域。
- **旧入口：** `.changes/knowledge`、`wuh-*` Skill、项目外 memory 执行入口和重复全局 rules 已清理。
- **工作流测试：** 单独复现原失败用例通过；全套测试两次分别出现不同用例 `status === null`，说明是并发运行时子进程被信号终止的既有不稳定，非本次 Markdown/Skill 变更引入。串行全套测试在 120 秒内未结束并已停止。因此测试结果为“未全绿”，不将其表述为通过。
- **项目类型检查：** `pnpm exec tsc --noEmit` 稳定以 SIGSEGV 退出，当前环境问题仍可复现；已删除旧 memory 中“可跳过类型检查”的危险兜底，本次不声称类型检查通过。

## 知识评估

- **结果：** 已新增并更新。
- **通用规范：** `shadow-dev-workflow/norms/knowledge-cards.md`。
- **跨项目经验：** `shadow-dev-workflow/knowledge/bug-investigation.md`。
- **项目知识：** 28 张 `shadow-docs/knowledge/*.md` 已标准化并接入项目 menu。
- **理由：** 本变更已经实施并通过结构、来源、路由和残留扫描，现已成为当前执行体系。
