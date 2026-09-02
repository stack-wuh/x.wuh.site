---
{
  "schema": "shadow-dev/v1",
  "name": "20260901-style-post-paper-redesign",
  "type": "style",
  "scope": "post",
  "status": "committed",
  "baseBranch": "main",
  "branch": "style/20260901-style-post-paper-redesign",
  "files": [
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/components/FloatingActions/index.tsx",
    "apps/site/app/post/components/PostComments/styles/index.tsx",
    "apps/site/app/post/components/PostToolbar/index.tsx",
    "apps/site/app/post/hooks/useToc.ts",
    "apps/site/app/post/lib/articleTypography.ts",
    "apps/site/app/post/styles/index.ts",
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/app/post/styles/post-floating.ts",
    "apps/site/app/post/styles/post-header.ts",
    "apps/site/app/post/styles/post-layout.ts",
    "apps/site/app/post/styles/post-markdown.ts",
    "apps/site/app/post/styles/post-toc.ts",
    "apps/site/app/post/styles/post-toolbar.ts",
    "shadow-docs/changes/20260901-style-post-paper-redesign/prototype-v2.html"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 347,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/347",
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
    "checkpoint": "9a8a617ca55e4920c2ca835ade17fc75ada62c46",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 博客详情页文气书卷纸面化

## 动机

详情页经封面杂志卡（#331）与书页式排版（20260829）两次改造后，正文与封面已确立「文气书卷」语言，但页面其余模块仍是历史叠加的 5 种容器语言（实底投影卡 / 半透明目录卡 / 渐变卡 ×2 / 裸排版评论区 / 阴影+上浮工具栏），模块标题 3 种人格、hover 动效 4 种；且 4 处暗色覆盖误用 `prefers-color-scheme` 而非手动 `data-color-scheme` 主题体系，手动切换主题时观感不一致（诊断报告 + 亮/暗截图见本次会话）。本次将全页收敛为一种设计语言。

## 引用规范

- knowledge/blog-detail.md
  - 当前结论: 书页式排版语言（正文 14px/1.55、标题衬线层级、引用块 2px 竖线、圆环分割线、更新于带字线）已定稿
  - 适用 scope: apps/site/app/post
  - 约束: 本次不改正文排版规范本身，只改容器与外围模块
- knowledge/post-cover.md
  - 当前结论: 封面杂志卡 1px 细边框 + 12px 圆角 + 底部轻渐变；有图/无图/失败三分支行为
  - 适用 scope: apps/site/app/post/components/PostCover
  - 约束: 封面三分支渲染逻辑不动，杂志卡为全页唯一保留卡片
- knowledge/design-system.md
  - 当前结论: 颜色必须经主题变量暴露；断点用 breakpoints.ts 语义常量；字体引用三个语义 token
  - 适用 scope: packages/components/themes, apps/site
  - 约束: 主题 family 与 scheme 独立，禁止业务样式直写 prefers-color-scheme 暗色覆盖；断点仅 small(520,max)/mobile(640,max)/tablet(1024,min) 三档，不新增中间值

## 决策

- **选型:** 文气书卷（纸面纯化）——页面即纸面，全页去卡，发丝线 + 居中圆环分隔，零投影，动效只允许颜色/透明度过渡
- **对比方案:** ①现代杂志（编辑网格：正文保留细边框弱卡 + 衬线眉题栏目化）——现代感强但文气弱，未选；②折中（弱卡 + 文气分隔）——改动最小但卡片与纸面边界模糊，未选
- **理由:** 与「拾遗」「落款」「线索小径」既有文气语汇一脉相承；封面杂志卡作为唯一卡片反而更突出；气质方向与三处关键模式均由用户逐轮选定（目录竖线式 / 页脚居中仪式式 / 前后篇对开式）
- **设计师定稿细则:** 点赞反馈改心脏图标单次跳动 800ms（废除循环脉冲光环与 scale 1.08）；表单与分享图标按钮保留极细边框控件形态（控件不是卡片）；评论标题衬线化与「拾遗」同人格；移动端目录为上下发丝线折叠条；「所有博客」入口与「第 N/M 篇」计数保留；滚动进度条保留
- **响应式细则（三档断点契约）:** 仅使用 BREAKPOINTS 三个语义常量——移动端 `mobile: 640`(max)、超窄屏细分 `small: 520`(max)、桌面 `tablet: 1024`(min)；平板端（641–1023）无专属媒体查询，继承基础样式（单栏 + 折叠目录 + 桌面式封面）；现有 `post-header.ts` 的裸断点 767 废除，归并到 mobile 640（641–767 区间的封面由移动端出血式改为桌面式，与平板段统一）；对开式前后篇在 ≤640 叠为上下单列；不新增任何中间断点值
- **分享样式细则（验收反馈）:** 分享按钮回归 SharedLinkGroup 原生按钮组样式，仅中和组件分区容器壳（上边距/内边距/上边框）。曾按验收要求实现「分享链接点击时动态构造、去 a 标签」的反爬处理，用户确认 wuh.site 为自有域名、无需规避爬虫抓取，该处理已回退：恢复渲染期预构链接，邮箱分享保留 `<a href="mailto:…">` 形态
- **明确不动:** 正文排版规范（post-markdown.ts 的字号/行高/标题层级/引用/列表/表格/分割线——唯二例外：`pre` 与正文 `img` 的 box-shadow 按零投影章程移除）、封面两分支渲染逻辑、Alert 元信息的内容与链接规则（页脚沿用其链接构造函数，站外链接保留 target=_blank + noopener）

## 第二轮：铅字工坊（正文排印升级 · 20260902 追加）

### 动机

第一轮纸面化验收后用户对样式仍不满意，四项痛点经确认全部命中：①平淡无记忆点（奶油底+衬线+细线是最"默认"的极简配方，◇落款几乎不可见）；②正文缺排印工艺（正文仅 14px/1.55、章节标题仅 18px，除字体外与普通网页文章无异）；③头部构图弱；④页脚主次不清。经四方向提案（铅字工坊/藏书票与朱印/书页框架/静水深流）用户选定「铅字工坊」，高保真原型 `prototype-v2.html`（真实 post/92 内容、明暗双主题、三断点）已由用户确认「非常好，有了一点特色了」。本轮把功夫下在阅读本身；头部与页脚的签名系统（藏书票/扉页）留待下一轮叠加。

### 引用规范（第二轮）

- knowledge/blog-detail.md
  - 当前结论: 正文 14px/1.55、h2 18px 左侧 3px 竖线、引用块 2px 左竖线、链接/列表序号/表头线用 accent 色、表格 13px——本轮将整体更新这些结论（预期影响：更新，ship 时改写该卡并顺带修正其 scope 路径 packages/wuh.site.next → apps/site）
  - 适用 scope: apps/site/app/post
  - 约束: 对比度红线遵守——正文主色与背景 ≥ 4.5:1；链接改为 primary 色后以虚线下划线作为第二重可供性
- knowledge/design-system.md
  - 当前结论: 字体只用三个语义 token；断点只用 BREAKPOINTS 三档语义常量；颜色必须走主题变量
  - 适用 scope: apps/site, packages/components/themes
  - 约束: 平板端（641–1023）无专属媒体查询、继承桌面值（三档契约），第一轮已确立；本轮全部选择器只用 token，不引入裸色值/裸断点

### 决策（第二轮）

- **选型:** 铅字工坊——字号/行距/栏宽重排 + 首字下沉 + 章节记号 + 引文式样 + 对比度修复
- **对比方案:** ①藏书票与朱印（头尾签名系统）——记忆点强但不解决阅读本身，留作下一轮叠加；②书页框架（扉页头部+滚动页眉）——动头部结构，本轮不做；③静水深流（只打磨）——不产生质变
- **排印细则:** 正文 16px/1.92（移动 640 max 收敛为 15px/1.85；平板继承桌面值）；正文栏宽 820→700px（每行约 43 字）；h2 章 23px / h3 节 20px 衬线 700；标题行高 1.3→1.4；pre 13.5px/1.7；表格 14px
- **章节记号细则:** h2/h3 注入「第N节 ──」朱砂眉线（自动编号 壹贰叁…拾贰，超出转阿拉伯数字）；显示层剥离作者手写的「一、」/「1.」编号前缀（仅正文标题与目录文本，heading id 与 DOM 锚点不变）；右侧目录条目同步渲染「壹 」朱砂序号
- **首字下沉细则:** 正文第一个"以文字开头"的段落首字包 `.dropcap`（朱砂 3.35em 下沉两行）；纯图片段落、以标签/HTML 实体/非文字字符开头的段落跳过——保证任意文章不破版
- **引文细则:** 去左竖线改上下双发丝线（accent 42%）+ 首尾「」朱砂引号，无底色
- **对比度修复（缺陷）:** 正文链接、ol 序号由 accent 金（纸面上约 1.9:1）改 primary 朱砂；表头金色粗线改发丝线；新增 `::selection` 朱砂底纸色字
- **实现形态:** 章节注入与首字下沉为纯字符串变换（`lib/articleTypography.ts`，正则、无 DOM 依赖），在 `useToc` 内 useMemo 同步执行——SSR 与客户端输出确定一致，无 hydration 风险
- **明确不动（本轮）:** 头部构图、页脚信息架构、印章/藏书票（下一轮）；pre/img/hr/kbd/details/task-list 结构样式（仅字号行距随体系微调）；标题 h1 唯一性逻辑

## 任务

### Phase 1 主题适配修复（A 组）

- [x] 删除 4 处 prefers-color-scheme 暗色覆盖并 token 化，手动切主题即刻生效 — apps/site/app/post/styles/post-article.ts, post-toc.ts, post-toolbar.ts, post-floating.ts — 改动

### Phase 2 纸面化（B/C/D 组）

- [x] 正文去卡：ArticleCard 删边框/底色/投影/hover，正文直接落纸面 — apps/site/app/post/styles/post-article.ts — 改动
- [x] 目录纸面化：侧栏去卡去投影、竖线式 active（3px 朱线 + 朱色文字）、移动端改上下发丝线折叠条 — apps/site/app/post/styles/post-toc.ts + PostView/index.tsx — 改动
- [x] 拾遗去渐变底与混色边框，保留线索小径竖线圆点，模块标题统一衬线字距 — apps/site/app/post/styles/post-article.ts — 改动

### Phase 3 结构合并（F 组）

- [x] 版权 + 分享 + 点赞三卡合并为居中仪式式文章页脚（圆环开场、双行居中：版权/原文/更新于 + 分享图标/点赞）— apps/site/app/post/PostView/index.tsx + styles/post-article.ts — 改动
- [x] 前后篇改对开式：两端对齐 + 中竖发丝线，删卡片/阴影/上浮/4px 竖线动画，保留所有博客入口与 N/M 计数 — apps/site/app/post/styles/post-toolbar.ts + components/PostToolbar/index.tsx — 改动
- [x] 评论区纸面化：标题衬线、条目发丝线分段、输入区去卡（控件细边框保留）— apps/site/app/post/components/PostComments/styles/index.tsx — 改动

### Phase 4 节奏收敛与回归（E 组 + 验证）

- [x] 模块间距统一 space-xl 档、断点全部收敛到三档语义常量（520/640/1024，废除 post-header.ts 的裸断点 767）、裸字号 token 化 — apps/site/app/post/styles/* — 改动
- [x] 四主题 × 有无封面 × 移动端回归：手动切主题即时生效、h1 唯一、reduced-motion、TOC 锚点 — 验证

### Phase 5 验收反馈修订

- [x] 分享按钮回归 SharedLinkGroup 原生按钮组样式（移除 ColophonShareRow 的按钮级覆盖，仅中和组件分区容器壳）— apps/site/app/post/styles/post-article.ts — 改动
- [x] 分享链接动态构造（反爬处理）实施后经用户确认回退：wuh.site 为自有域名，无需规避爬虫；恢复渲染期预构链接与邮箱 `<a href>` 形态 — apps/site/app/post/PostView/index.tsx — 回退

### Phase 6 铅字基座（第二轮）

- [x] 正文排印重排：MarkdownBody 基准 16px/1.92、标题层级 700/1.4、p 三档字号、链接与 ol 序号改 --primary-color、引用块双发丝线+「」、表头发丝线、pre 13.5px/1.7、::selection、旧 h2 竖线删除 — apps/site/app/post/styles/post-markdown.ts — 改动
- [x] 正文栏宽收敛 820→700px、栏距 24→36px — apps/site/app/post/styles/post-layout.ts — 改动
- [x] 章节眉线（.sec-eyebrow + .stub）与首字下沉（.dropcap）样式、标题锚点改右上角绝对定位 — apps/site/app/post/styles/post-markdown.ts — 改动

### Phase 7 章节系统（第二轮）

- [x] 新增纯字符串变换：h2/h3 章节记号注入（第N节自动编号）、显示层剥离「一、/1.」编号前缀、首段首字下沉注入（跳过图片段/标签开头/实体/非文字字符） — apps/site/app/post/lib/articleTypography.ts — 新增
- [x] useToc 接入变换（useMemo 同步、去 DOMParser effect）、TocItem 增加 num/shortNum、目录条目渲染朱砂序号 — apps/site/app/post/hooks/useToc.ts + apps/site/app/post/PostView/index.tsx + apps/site/app/post/styles/post-toc.ts + apps/site/app/post/styles/index.ts — 改动

### Phase 8 验证（第二轮）

- [x] tsc --noEmit 通过；node --experimental-strip-types 跑变换纯函数断言（编号剥离/锚点保留/图片段跳过/实体跳过/目录 sections） — 验证
- [x] 残留扫描：无裸色值/裸断点/prefers-color-scheme 新增；与 prototype-v2 明暗双主题比对排印参数一致 — 验证

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** knowledge/blog-detail.md（正文排印结论整体改写：16px/1.92 体系、章节记号、首字下沉、引文双发丝线、链接 primary 化；并修正卡片 scope 路径 packages/wuh.site.next → apps/site）
- **理由:** 第一轮替换该卡的容器语言结论，第二轮再替换其排印规范结论；design-system.md 不变（三档断点/字体 token/颜色变量均为其约束的执行）
