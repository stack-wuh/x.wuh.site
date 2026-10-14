---
{
  "schema": "shadow-dev/v1",
  "name": "20261014-chore-dead-components-retirement",
  "type": "chore",
  "scope": "packages/components",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "chore/20261014-chore-dead-components-retirement",
  "files": [
    "AGENTS.md",
    "packages/components/alert",
    "packages/components/card",
    "packages/components/result",
    "packages/components/shared-link-group",
    "packages/components/skeleton",
    "packages/components/test/breakpoint-raw-scan.test.mjs",
    "packages/components/test/structure.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 537,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/537",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "d6acc886a76f34c2e4e6df98369b0606fa3a98fb",
    "verifiedAt": "2026-10-14T06:38:00.822Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:537",
    "planHash": "1f736514fe71e432d8833b31b09092eb4a8ab7effe22e8c6c9ee45ee626b428c",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[chore] 废弃组件退役:零消费 UI 组件五连删(alert/card/result/skeleton/shared-link-group)",
      "titleRaw": "[chore] 废弃组件退役:零消费 UI 组件五连删(alert/card/result/skeleton/shared-link-group)",
      "supplement": "全仓三形态 grep 证死五组件零消费者(合计 1632 行);整删+守卫/AGENTS.md/baseline 联动同步;Row/Col/Stagger/占位目录经用户裁定保留。完整 brief:shadow-docs/changes/20261014-chore-dead-components-retirement/brief.md",
      "body": "## 动机\n用户原始优化诉求第三路(「删掉/合并/抽离废弃代码」)的挂起项——零消费组件精读判定。全仓复核(包路径/相对路径/JSX 三形态,grep 覆盖 apps/site、apps/console、apps/desktop、packages):\n\n- `alert`(562 行):全仓零消费者;其内部引用 shared-link-group 与 tag(它是消费方不是被消费方);站点错误页/留言提示均用本地实现。\n- `card`(328 行):博客列表卡实为站点本地 styled;包组件从未被消费。\n- `result`(260 行,含 404/500 预设):site ErrorPage 用自有实现,预设无消费者。\n- `skeleton`(115 行):WereadSection/image/heatmap 的 \"Skeleton\" 命中全部为本地 styled 或同名 prop,与本包无关(流式骨架已于 20261001-perf-remove-streaming-skeletons 移除)。\n- `shared-link-group`(367 行):唯一消费者是 alert(alert 退役后同步归零)。\n\n判定分组的保留项不在本 change:Row/Col/Stagger 布局族(架构意图保留,守卫 18 例维护)、6 个空占位目录(roadmap 槽)、styled facade(基建)——用户已确认「只删 A 组」。\n\n## 引用规范\n- shadow-docs/knowledge/component-standard.md\n  - 当前结论: 结构守卫棘轮(目录删除=动态扫描自然出账;baseline 登记项随文件删除须重采防「已修好未除名红」)。\n  - 适用 scope: packages/components/test/structure.test.mjs\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: breakpoint-raw-scan 守卫⑥保留项清单含 `alert/styles:81`($framed ⑩族)——alert 删除则该文件读取 ENOENT,须同批移除清单条目;pagination/cssVariableProvider/link-group 条目不受影响。\n  - 适用 scope: packages/components/test/breakpoint-raw-scan.test.mjs\n- shadow-docs/knowledge/components.md\n  - 当前结论: 卡内 \"Skeleton\" 均指 image 内部状态(非 skeleton 包),无需改写。\n  - 适用 scope: 无变更\n\n## 决策\n- **选型:** 方案 A——五目录整删 + 台账/守卫/文档三同步。git 历史即备份(无需另建 backup);`shared-link-group` 的 example.tsx 为演示文件随目录同删。\n- **对比方案:** 方案 B(移入 packages/components/_graveyard 保留一观察期)——制造新的零消费结构、违反结构守卫语义,否决;方案 C(连 Row/Col/Stagger 同删)——用户判定否决(布局程序地基保留)。\n- **理由:** 零消费已由三形态 grep 穷尽证死;删除是唯一正确处置(保留=持续误读「已实现组件」清单);联动面全部可被守卫/tsc 兜底,无静默风险。\n\n## 任务\n### Phase 1 — 删除与联动同步\n\n- [ ] 1.1 删除 `packages/components/alert/`、`packages/components/card/`、`packages/components/result/`、`packages/components/skeleton/`、`packages/components/shared-link-group/`(五目录整删)\n- [ ] 1.2 `packages/components/test/breakpoint-raw-scan.test.mjs` — 保留项清单移除 alert 条目(其余 7 项原样)\n- [ ] 1.3 `AGENTS.md` — 已实现组件清单去除 Alert/Card/Result/Skeleton/SharedLinkGroup;Hooks/占位段不动\n- [ ] 1.4 `packages/components/test/structure.test.mjs` — 运行确认动态扫描自然出账;若 baseline JSON 含被删目录登记项则 `--emit-baseline` 重采\n\n### Phase 2 — 回归(S 级:结构、引用、路由、残留扫描)\n\n- [ ] 2.1 残留引用扫描:全仓 grep `components/(alert|card|result|skeleton|shared-link-group)` 与相对 `'../(alert|...)'` 形态 = 0 命中\n- [ ] 2.2 根 `pnpm exec tsc --noEmit` RC=0(漏引用必红,最强兜底);`pnpm run lint:next` 0/0\n- [ ] 2.3 守卫网:structure 18 例、breakpoint-raw-scan 6 例(修后)、布局族 40 例、hooks 两波 20 例、site 名集法零新增红;`next build` RC=0(SGN-012 直调配方)\n\n## 补充\n全仓三形态 grep 证死五组件零消费者(合计 1632 行);整删+守卫/AGENTS.md/baseline 联动同步;Row/Col/Stagger/占位目录经用户裁定保留。完整 brief:shadow-docs/changes/20261014-chore-dead-components-retirement/brief.md\n\n完整 brief：shadow-docs/changes/20261014-chore-dead-components-retirement/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261014-chore-dead-components-retirement\",\"type\":\"chore\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261014-chore-dead-components-retirement/brief.md\",\"cliVersion\":\"1.6.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "chore"
      ]
    },
    "release": {
      "files": [
        "AGENTS.md",
        "apps/site/test/seo-p15-article-topic-links.test.mjs",
        "apps/site/test/soft-navigation.test.mjs",
        "packages/components/alert",
        "packages/components/card",
        "packages/components/result",
        "packages/components/shared-link-group",
        "packages/components/skeleton",
        "packages/components/test/breakpoint-raw-scan.test.mjs",
        "shadow-docs/changes/20261014-chore-dead-components-retirement/brief.md"
      ],
      "message": "chore(components): 零消费组件退役五连删与守卫台账清册",
      "title": "chore(components): 零消费组件退役五连删与守卫台账清册",
      "body": "## 变更\n- 零消费 UI 组件五连删(全仓三形态 grep 证死:包路径/相对路径/JSX):`alert`(562 行)、`card`(328)、`result`(260,含无人使用的 404/500 预设)、`skeleton`(115)、`shared-link-group`(367,唯一消费者是 alert)——合计 1632 行\n- 守卫台账同步:`breakpoint-raw-scan` ⑥保留清单与 ④收编台账移除 alert/result 条目;`soft-navigation` styled.a 白名单移除四条死登记(留注释出账)\n- `seo-p15` 死契约修复:原守卫整体读 alert/index.tsx 且断言 PostView 旧传参形态(main 上既红)——重写钉现实载体 PostHeader `href={buildTopicUrl(label.name)}`;「外链新窗」case 语义随 alert 消失,不再钉不存在的代码\n- AGENTS.md 已实现组件清单同步(退役名单留注释)\n- 保留项裁定(用户确认):Row/Col/Stagger(布局地基,零消费事实已入档)、6 个空占位目录(roadmap)、styled facade(结构守卫基建)\n\n## 影响\n- 行为/触发面变化:无(被删组件无任何页面/组件消费,删除面=类型系统兜底)\n- 明确不受影响的范围:全部保留组件与站点页面;布局族契约卡;structure baseline(无被删目录登记,免重采)\n\n## 验证\n- 命令与结果:删后全仓残留引用扫描 0 命中;根 `pnpm exec tsc --noEmit` RC=0(漏引用必红,删除类最强兜底);`pnpm run lint:next` 0/0;`next build` RC=0(14 路由,SGN-012 直调配方);守卫网 structure 18/18、breakpoint-raw-scan 6/6、seo-p15 修后 1/1(由 main 基线红转绿)、全名集基线 diff `comm -23` 空(零新增红,SGN-011 法,base 37→head 30 且修复 4 项)\n- 未覆盖项(明说,不留空白):S 级无 runtime 观察点(被删组件本无页面);判定分组的 Row/Col/Stagger 零消费事实留 brief 供后续消费决策,不在本 change 处置\n\n## 关联\n- Closes #537\n- brief: shadow-docs/changes/20261014-chore-dead-components-retirement/brief.md"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "五组件零消费三形态证死后整删;tsc RC=0 兜底漏引用;守卫名集基线 diff 零新增红且顺带修复 seo-p15 死契约(main 既有红);Knowledge 卡登记面复查 components.md/component-standard.md 对被删组件无断言(唯一 Skeleton 字样指 image 内部状态),仅 AGENTS.md 已同步——长期知识无变化"
  }
}
---

# 废弃组件退役:零消费 UI 组件五连删(alert/card/result/skeleton/shared-link-group)

## 动机

用户原始优化诉求第三路(「删掉/合并/抽离废弃代码」)的挂起项——零消费组件精读判定。全仓复核(包路径/相对路径/JSX 三形态,grep 覆盖 apps/site、apps/console、apps/desktop、packages):

- `alert`(562 行):全仓零消费者;其内部引用 shared-link-group 与 tag(它是消费方不是被消费方);站点错误页/留言提示均用本地实现。
- `card`(328 行):博客列表卡实为站点本地 styled;包组件从未被消费。
- `result`(260 行,含 404/500 预设):site ErrorPage 用自有实现,预设无消费者。
- `skeleton`(115 行):WereadSection/image/heatmap 的 "Skeleton" 命中全部为本地 styled 或同名 prop,与本包无关(流式骨架已于 20261001-perf-remove-streaming-skeletons 移除)。
- `shared-link-group`(367 行):唯一消费者是 alert(alert 退役后同步归零)。

判定分组的保留项不在本 change:Row/Col/Stagger 布局族(架构意图保留,守卫 18 例维护)、6 个空占位目录(roadmap 槽)、styled facade(基建)——用户已确认「只删 A 组」。

## 复杂度评级

- **评级:** S
- **理由:** 契约变更——无(纯删除,不动任何保留组件对外接口);触及面——删除面独立成 5 目录,联动仅 AGENTS.md 清单与两个守卫文件(无跨模块传导);可发现性——删除类变更由全量 tsc 兜底(漏删引用必红),守卫与文档同步是机械跟随。三要素全低,评 S。
- **期望验证深度:** unit(守卫网 + tsc/lint/build 回归;无 runtime 观察点——被删组件本就无页面,零行为面)

## 引用规范

- shadow-docs/knowledge/component-standard.md
  - 当前结论: 结构守卫棘轮(目录删除=动态扫描自然出账;baseline 登记项随文件删除须重采防「已修好未除名红」)。
  - 适用 scope: packages/components/test/structure.test.mjs
- shadow-docs/knowledge/layout-components.md
  - 当前结论: breakpoint-raw-scan 守卫⑥保留项清单含 `alert/styles:81`($framed ⑩族)——alert 删除则该文件读取 ENOENT,须同批移除清单条目;pagination/cssVariableProvider/link-group 条目不受影响。
  - 适用 scope: packages/components/test/breakpoint-raw-scan.test.mjs
- shadow-docs/knowledge/components.md
  - 当前结论: 卡内 "Skeleton" 均指 image 内部状态(非 skeleton 包),无需改写。
  - 适用 scope: 无变更

## 决策

- **选型:** 方案 A——五目录整删 + 台账/守卫/文档三同步。git 历史即备份(无需另建 backup);`shared-link-group` 的 example.tsx 为演示文件随目录同删。
- **对比方案:** 方案 B(移入 packages/components/_graveyard 保留一观察期)——制造新的零消费结构、违反结构守卫语义,否决;方案 C(连 Row/Col/Stagger 同删)——用户判定否决(布局程序地基保留)。
- **理由:** 零消费已由三形态 grep 穷尽证死;删除是唯一正确处置(保留=持续误读「已实现组件」清单);联动面全部可被守卫/tsc 兜底,无静默风险。

## 任务

### Phase 1 — 删除与联动同步

- [x] 1.1 删除 `packages/components/alert/`、`packages/components/card/`、`packages/components/result/`、`packages/components/skeleton/`、`packages/components/shared-link-group/`(五目录整删)
- [x] 1.2 `packages/components/test/breakpoint-raw-scan.test.mjs` — 保留项清单移除 alert 条目(其余 7 项原样)
- [x] 1.3 `AGENTS.md` — 已实现组件清单去除 Alert/Card/Result/Skeleton/SharedLinkGroup;Hooks/占位段不动
- [x] 1.4 `packages/components/test/structure.test.mjs` — 运行确认动态扫描自然出账;若 baseline JSON 含被删目录登记项则 `--emit-baseline` 重采

### Phase 2 — 回归(S 级:结构、引用、路由、残留扫描)

- [x] 2.1 残留引用扫描:全仓 grep `components/(alert|card|result|skeleton|shared-link-group)` 与相对 `'../(alert|...)'` 形态 = 0 命中
- [x] 2.2 根 `pnpm exec tsc --noEmit` RC=0(漏引用必红,最强兜底);`pnpm run lint:next` 0/0
- [x] 2.3 守卫网:structure 18 例、breakpoint-raw-scan 6 例(修后)、布局族 40 例、hooks 两波 20 例、site 名集法零新增红;`next build` RC=0(SGN-012 直调配方)

## 执行偏差

- **守卫联动比 brief 预估多两处:** `soft-navigation.test.mjs` styled.a 白名单含 result#LinkItem / alert×2 / shared-link-group#SLink 四条(单向豁免不判红,但整删后为死条目,同步出账留注释);`breakpoint-raw-scan` ④收编台账也引用 result/styles(Change B 收编项)——⑥保留清单之外第二处,同批移除。
- **seo-p15 死契约裁决(brief 预判外的联动):** 该守卫整体 `readFile(alert/index.tsx)` 且断言已随载体迁移失效(main 上本就红:case1 PostView 传参形态已迁 PostHeader、case2 isExternalHref 全仓零命中)。裁决=重写钉现实载体(PostHeader `href={buildTopicUrl(label.name)}` + import 形态),case2「外链新窗」语义随 alert 消失不再钉不存在的代码(外链纪律由 soft-navigation 覆盖)。修后该守卫由红转绿。

## 结果

- 实际耗时: 约 50min(判定精读 ~25min + 删除联动 ~10min + 回归 ~15min)
- 验证:
  - 删除面: 五目录整删 1632 行(alert 562 / card 328 / result 260 / skeleton 115 / shared-link-group 367);删后全仓三形态残留引用 = 0。
  - **根 `pnpm exec tsc --noEmit` RC=0**(删除类变更最强兜底:漏引用必红)、`pnpm run lint:next` 0/0、`next build`(SGN-012 直调配方)RC=0 14 路由全出。
  - 守卫网: structure 18/18(动态扫描自然出账,baseline 无被删目录登记免重采)、breakpoint-raw-scan 6/6(⑥/④两处清单同步后)、seo-p15 修后 1/1 绿(原 main 基线红修复)。
  - **名集基线 diff(SGN-011 法):** 当前 main 解树基线 37 红 vs head 30 红,`comm -23` head 独有 = **空(零新增红)**;差 7 项中 3 项为基线解包缺 shadow-docs 的文件级伪影,4 项为真实修复(seo-p15 两 case + 其文件级折叠行、skeleton/无关联计数漂移)。
  - 判定分组保留项复核: Row/Col/Stagger/占位×6/styled facade 原样在位(stagger/col 零消费事实已在 brief 动机段留档,供后续消费决策参考)。

## 知识评估

- **预期影响:** 更新 `shadow-docs/knowledge/components.md`(若卡内含组件清单需同步——预判无需;判定执行后以实际为准);`AGENTS.md` 为仓库文档非 Knowledge。row/col/stagger 零消费但保留的裁定**不入卡**(一次性决策,留 brief);若 layout-components 卡「站点消费累计」表述需加脚注澄清 PostRow 为本地命名——review 时定。
- **候选卡片:** shadow-docs/knowledge/components.md(预判:无需变更或微修表述)
- **理由:** 删除动作本身无长期知识;唯「组件清单以消费面为准、AGENTS.md 须随退役同步」是流程事实，已由 component-standard 覆盖。

## 非目标

- Row/Col/Stagger 删除或补消费者(用户裁定保留地基)
- 6 个空占位目录与 styled facade(保留)
- apps/desktop 本地组件清理(不在 scope)
- layout-components.md 卡「消费累计」措辞修订——若 review 认定误导则随本 change 知识动作微修,不主动扩面
