---
{
  "schema": "shadow-dev/v1",
  "name": "20260901-style-post-paper-redesign",
  "type": "style",
  "scope": "post",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260901-style-post-paper-redesign",
  "files": [
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/components/FloatingActions/index.tsx",
    "apps/site/app/post/components/PostComments/styles/index.tsx",
    "apps/site/app/post/components/PostToolbar/index.tsx",
    "apps/site/app/post/styles/index.ts",
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/app/post/styles/post-floating.ts",
    "apps/site/app/post/styles/post-header.ts",
    "apps/site/app/post/styles/post-layout.ts",
    "apps/site/app/post/styles/post-markdown.ts",
    "apps/site/app/post/styles/post-toc.ts",
    "apps/site/app/post/styles/post-toolbar.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 347,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/347",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "f33a51886558215dda989d9284e67cb54a771675",
    "verifiedAt": "2026-09-01T12:29:28.486Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "f33a51886558215dda989d9284e67cb54a771675",
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

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** knowledge/blog-detail.md（容器语言章节重写为纸面化结论）
- **理由:** 该卡当前结论描述的旧容器处理（卡片边界、目录 uppercase 标题、工具栏阴影）将被本次整体替换；design-system.md 不变（本次是其约束的执行而非修订）
