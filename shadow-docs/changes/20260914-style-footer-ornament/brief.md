---
{
  "schema": "shadow-dev/v1",
  "name": "20260914-style-footer-ornament",
  "type": "style",
  "scope": "components",
  "status": "published",
  "baseBranch": "main",
  "branch": "style/20260914-style-footer-ornament",
  "files": [
    "apps/server/src/modules/visit-stats/visit-stats.controller.ts",
    "apps/server/src/modules/visit-stats/visit-stats.service.ts",
    "packages/components/layout/footer.tsx",
    "packages/components/layout/site-stats.tsx",
    "packages/components/layout/specs.tsx",
    "packages/components/layout/styles/index.tsx",
    "packages/components/icons/index.tsx",
    "packages/core/src/visit-stats.dto.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 377,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/377"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "118ebb4fe7faf5be65511601c0382d4394cb1970",
    "verifiedAt": "2026-09-14T07:27:27.869Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:377",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# Footer 中轴 ornament 式改版——融入站点雅致风格

## 动机

当前 Footer（`packages/components/layout`）是工具站式两栏信息平铺，与站点整体"文人雅致"气质断裂：slogan「驿寄梅花，鱼传尺素」以小号正文混在版权信息中，未使用 serif token；链接为裸 `<a>` 无 hover/focus 态；备案号不可点击；断点硬编码 `768px`，违反 design-system 卡片的语义断点约束。Footer 作为每页收尾是气质断裂最明显的位置，需要一次到位地融入站点设计语言，并把内容信息补齐到写作站应有的完整度。

## 引用规范

- `norms/ui-patterns.md`（通用）
  - 当前结论: 设计规范先行、组件复用优先、暗黑模式全覆盖、可交互元素必须有 visible focus ring、动效 150-300ms ease-out
  - 适用 scope: 所有 UI 变更
- `shadow-docs/knowledge/design-system.md`
  - 当前结论: 双维度主题模型 + 语义化颜色 token；三个字体 token（--font-sans/--font-serif/--font-mono），组件声明 font-family 只能引用这三个 token；语义断点常量 mobile 640 / small 520 / tablet 1024，不新引入裸断点数值
  - 适用 scope: packages/components/themes、全站样式
- `shadow-docs/knowledge/components.md`
  - 当前结论: Divider 组件 variant `ornament`（中置朱砂点缀线）与 `hairline`（结构性分段）；消费者使用 `@wuh.site/components/<name>` 子路径
  - 适用 scope: packages/components
- `shadow-docs/knowledge/visit-stats.md`（scope 命中 `packages/components/layout`，实现改动前必读）
  - 当前结论: 前端上报 `POST` + `GET` 查询，后端 30 分钟同 IP 去重；Footer 只读统计接口展示「总访问量 | 今日」；执行约束为后端保持**单一 `/v2` 全局前缀**（浏览器侧路径为 `/api/visit-stats/stats`，经 Next rewrite 落到后端 `/v2/visit-stats/stats`）
  - 适用 scope: 后端 visit-stats 模块 + Footer（本次改动沿用同一 GET 端点扩展字段，不新增路由，符合单前缀约束）
  - 卡片陈旧点: scope 路径仍是重构前形态（`packages/wuh.site.nest/*`、`packages/wuh.site.next/*`），实际对应 `apps/server/src/modules/visit-stats` 与 `apps/site`

## 决策

- **选型:** 方案一「中轴 ornament 式」——顶部 `Divider variant="ornament"` 分割线（IconLogo 作为 children 居中锚点，替代默认字符 ◇），居中纵向分层：serif slogan（17px / 字距 0.25em）→ 导航行（博客 / 关于 / RSS 订阅）→ 备案链接行 → 版权注脚（两行：版权 + CC BY-NC-SA 4.0 / 技术栈驱动说明，技术栈行更小更淡）→ 站点数据行（三项图标：日历 = 运行天数、羽毛笔 = 全站字数、眼睛 = 访问量（总访问量与今日合并）；桌面 hover/focus 弹 tooltip，触屏常显短文字，最弱层级）；footer 内层 max-width 640px 封顶，超宽屏下 ornament 线与链接行不随视口拉伸，与站点 720-1200px 居中内容列同轴
- **对比方案:** 方案二「对仗重排版」保留双栏骨架、改动最小，但雅致提升有限、仍是功能性 Footer，未选
- **理由:** 站点 Header/motto 层的氛围投入已确立"中轴仪式感"语言，Footer 复用 Divider ornament 与 Header 渐隐下划线即可零新增组件达成同源气质；符合 ui-patterns「禁止自由创造与项目风格不匹配的 UI」与 components「复用优先」约束

### 末行图标化（响应式标签）

- **选型:** 图标化呈现**三项**站点数据（访问量的「总/今日」两个数值合并于一枚图标），按输入设备分派标签——桌面（`hover: hover` 且 `pointer: fine`）图标 + hover/focus tooltip；触屏（`hover: none` 或 `pointer: coarse`）图标 + 常显短文字
- **对比方案:** ① 全平台纯图标 + 点击展开——移动端多一层交互且需处理点击外部关闭，未选；② 全平台图标 + 常显短文字——零交互成本但桌面不够简洁，未选
- **理由:** 触屏没有 hover，纯 hover tooltip 会让移动端永久读不到数据；响应式标签使桌面雅致与移动端可读性同时成立，代价仅一个 media query
- **图标选型:** lucide `calendar-days`（运行天数）/ `feather`（全站字数）/ `eye`（访问量）；需在 `packages/components/icons/index.tsx` 追加 **3** 个导出（现有导出无 calendar-days / feather / eye）
- **访问量合并:** 「总访问量」与「今日访问量」合并为一枚 `eye` 图标，两个数值在 tooltip / 触屏标签内并列展示（`总访问量 123,456 · 今日 789`）。理由：二者同属流量度量，合并后既减少一枚图标、也让末行更收敛；同时消除「眼睛 vs 折线」两枚相近图标难以区分的歧义（原设计中眼睛代表累计、折线代表今日，不悬停无从分辨）
- **实现约束:** tooltip 必须**向上**弹出（Footer 位于页面底部，向下会被视口裁切）；图标配 `sr-only` 文案供屏幕阅读器，数据项可 `tabindex` 聚焦使键盘可达，`focus-visible` 有 primary 描边；tooltip 容器为 footer 内实现的 styled 组件
- **tooltip 复用判断:** 组件库无共享 Tooltip；`apps/site/app/blog/components/TitleWithTooltip` 为博客页内专用（绑定标题溢出检测，非通用），不复用。本次不新建公共组件（避免过早抽象），若出现第二个消费方再提升到 `packages/components`

### 内容清单（本次补充）

1. 备案号链接化：ICP 备案链至工信部备案系统（beian.miit.gov.cn），公安备案链至公安备案平台，`target="_blank"` 配 `rel="noopener noreferrer"`
2. 站内导航行：博客 / 关于 / RSS 订阅；留言板是 `/about` 页内区块（`AboutView/index.tsx` 的「留言板」Section），不单列，并入「关于」
3. 内容协议：CC BY-NC-SA 4.0 文本注脚，与 Copyright 同行
4. 站龄：「驿站已运行 N 天」，前端按 `footerConf.siteBorn` = **2021-03-08**（备案审核日）计算，与 slogan 的「驿」意象呼应
5. 全站字数：「已写下 N 万字」，扩展 `GET /api/visit-stats/stats` 返回 `totalWords`；访问量沿用既有 `total` / `today` 字段

站龄与全站字数均置于**最末「站点数据行」**，与访问统计合并为三项站点数据（站龄 / 字数 / 访问量）。理由：三者同为站点运营与积累的度量，聚在末行最弱层级；中轴上部只留 slogan 一行，链条更紧凑。呈现方式见下节「末行图标化」

### 版权注脚拆行（宽度治理）

- **问题:** 原一行承载三件事（版权 + 协议 + 技术栈），约 50 字符；在 640px 内容宽下折行，末行只剩「强力驱动」等孤字，视觉失衡
- **选型:** 拆为两行——第 1 行 `Copyright©2024 Shadow. · CC BY-NC-SA 4.0`，第 2 行 `由 Next.js · NestJS · MongoDB 强力驱动`（12px、opacity .8、行距 3px 的紧凑栈）
- **品牌名规范化:** 原文案 `next.js、mongodb 和 nest.js` 大小写与项目规范不一致（AGENTS.md 与全站统一为 Next.js / NestJS / MongoDB），一并修正；顿号改中圆点分隔
- **移动端:** 省略技术栈行（该信息价值最低，移动端纵向空间紧张，属有意的渐进披露）
- **版权年份生成（已定案）:** 渲染时从 `siteBorn` 推导——起始年 = `siteBorn.getFullYear()`（2021），结束年 = `new Date().getFullYear()`，两值相同只显示单年，展示 `© 2021–2026 Shadow.`。理由：版权区间语义上就是「建站年 → 当前年」，从既有常量推导零维护、无第二日期源；对比方案「写死区间」跨年必忘、「构建时注入」受部署惰性影响（半年不部署显示旧年），均未选。跨年瞬间服务端与访客时区可能有一小时年份差，对版权行无感，不做处理

### 全站字数实现取舍

- **口径复用:** 沿用站点既有 `getArticleWordCount`（`apps/site/app/lib/seo.ts:92`）——中文字符数 `[一-鿿]` + 英文单词数 `[a-zA-Z]+`。全站总量必须与单篇 SEO 数据口径一致，不自造第二套规则
- **聚合方式:** 在 `visit-stats.service` 用 `$regexFindAll` + `$size` 按同口径聚合 `content.body`，结果做内存 TTL 缓存（1 小时级）。SiteStats 前端每 60s 轮询，无缓存会对全量正文反复扫描
- **对比方案:** ① 同步时预计算 wordCount 存字段——需 schema 变更 + 存量回填迁移，改动大，未选；② 前端新增独立接口——多一次请求，未选
- **展示:** 前端格式化（如 `21.6 万字`），原始数值由接口返回

### 站点常量落点（包边界约束）

- `packages/components` **不依赖** `@wuh.site/core`（组件库刻意保持零业务依赖），因此 `siteBorn` 不能从 core 引入
- 落点取 `footerConf`（`packages/components/layout/specs.tsx`）——该文件已承载 slogan、备案号、copyright 等站点文案，就近一致；本次仅 Footer 一个消费方
- 若日后其他位置需要站点生日起点，再提升到 `packages/core/src/site.ts` 并由 app 层以 props 注入 Footer

### 待确认点

- ~~站龄起点待确认~~ **已定案**：起点取 `2021-03-08`（用户提供的备案审核日）
- **备案号不编码日期（重要）**：此前按号码 `20001814` 推读为「2020 年 + 序号 001814」已被证伪——实际审核日为 2021-03-08。该序列号不含日期信息，后续不得再由号码反推日期，站龄起点以常量 `footerConf.siteBorn` 为唯一事实源
- `visit-stats.md` 卡片 scope 路径陈旧（重构前路径），本次改动会触碰该 scope，建议 archive 阶段一并把卡片 scope 更新为 `apps/server/src/modules/visit-stats` + `packages/components/layout`；卡片端点写法 `/api/v2/...` 与代码中浏览器侧 `/api/visit-stats/stats` 的差异属表述层面，不改结论

## 任务

### Phase 1 — 组件与样式
- [x] icons/index.tsx 追加导出：IconCalendarDays / IconFeather / IconEye（lucide，共 3 个） — `packages/components/icons/index.tsx` — 修改
- [x] 末行站点数据图标化：桌面 tooltip（向上弹出、hover/focus 触发）、触屏常显文字标签、sr-only 文案与 tabindex 键盘可达 — `packages/components/layout/styles/index.tsx`（tooltip 样式） — 修改
- [x] footer.tsx 重写为中轴 ornament 结构：ornament Divider 内嵌 IconLogo 居中锚点、serif slogan、导航行、备案链接行（链接化 + 外链安全属性）、版权注脚（两行：版权 + 协议 / 技术栈）、末行站点数据（三图标响应式标签） — `packages/components/layout/footer.tsx` — 重写
- [x] styles/index.tsx 重写：slogan 引用 `--font-serif`、链接 hover/focus 态（渐隐下划线 + visible focus ring）、断点替换为语义常量（mobile 640 / small 520）、内层 max-width 640px 护栏、四主题经 token 生效 — `packages/components/layout/styles/index.tsx` — 重写
- [x] specs.tsx：`footerConf` 增 siteBorn（`2021-03-08` 备案审核日）、内容协议、导航项数组、备案链接地址；拆出 `MainProps` 至 main 组件文件（注意：components 不可 import `@wuh.site/core`）
- [x] 版权年份动态推导：起始年取 siteBorn 年份、结束年取当前年（同值显示单年），footer 渲染时计算 — `packages/components/layout/footer.tsx` — 实现 — `packages/components/layout/specs.tsx` — 修改

### Phase 2 — 统计数据
- [x] `VisitStatsResponse` 增 `totalWords` 字段 — `packages/core/src/visit-stats.dto.ts` — 修改
- [x] visit-stats.service 增 totalWords 聚合（复用中文 + 英文单词口径）与内存 TTL 缓存 — `apps/server/src/modules/visit-stats/visit-stats.service.ts` — 修改
- [x] controller 响应类型随 DTO 更新，Swagger 描述同步 — `apps/server/src/modules/visit-stats/visit-stats.controller.ts` — 修改
- [x] site-stats.tsx：末行统一渲染三项站点数据（站龄 siteBorn 起算 + 格式化字数 + 访问量[总/今日]）的图标与 tooltip/标签，轮询逻辑保持既有 60s 不变 — `packages/components/layout/site-stats.tsx` — 修改

### Phase 3 — 验证
- [x] 验证：wine/plain × light/dark 四主题目测、移动端 640/520 断点无横向滚动、超宽屏（2560px）护栏生效、链接 focus ring 可见、外链可跳转、`prefers-reduced-motion` 下无动效；另验证 tooltip 在移动端不出现（走文字标签）、键盘 Tab 可聚焦图标并弹出 tooltip、屏幕阅读器能读出三项语义 — `packages/components/layout` — 验证

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 新增
- **候选卡片:** shadow-docs/knowledge/footer-design.md
- **理由:** Footer 设计规范（中轴 ornament 结构、serif slogan、链接交互语言、内容清单与字数口径复用规则）为长期有效的项目事实，当前 Knowledge 无 Footer 专属卡片，验收后沉淀首张；`visit-stats.md` 待验收后补 totalWords 扩展（不新增卡片，更新现有）
