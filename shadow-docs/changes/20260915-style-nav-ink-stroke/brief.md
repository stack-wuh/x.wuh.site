---
{
  "schema": "shadow-dev/v1",
  "name": "20260915-style-nav-ink-stroke",
  "type": "style",
  "scope": "apps/site",
  "status": "applying",
  "baseBranch": "main",
  "branch": "style/20260915-nav-ink-stroke",
  "files": [
    "apps/site/app/components/SiteHeader/index.tsx",
    "apps/site/app/components/SiteHeader/styles/index.ts",
    "apps/site/test/header-quiet-bar.test.mjs",
    "shadow-docs/knowledge/design-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 387,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/387"
  },
  "review": {
    "conclusion": null,
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

# Header 导航运笔：下划线行笔动画、当前页常驻笔画与外链 ↗

## 动机

用户反馈：博客/关于/知识库的 hover 动效太单调，是不是可以考虑加上 Icon。诊断（`apps/site/app/components/SiteHeader/`）：静默条的 hover 只有两个透明度切换（文字 78%→实色、下划线 opacity 0→1 且无过渡声明——实际是瞬间闪现），没有任何"动作"；同时整条导航没有当前页标识（在博客列表还是在文章详情，Header 上看不出来），知识库是跳往外站的外链也没有任何去向暗示。"单调"的病根在动笔与层级，不在缺图形。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 桌面 Header 是「静默条」，朱砂印「墨」是全站唯一入口图形；下划线语言 1px/两端透明/中段 primary；淡化一律 `--text-color` mix。
  - 适用 scope: apps/site SiteHeader

## 决策

- **选型: 不加装饰性 Icon，把既有墨语言用足。** 三件事：① hover 下划线从"淡入"改"行笔"——`::after` `transform: scaleX(0→1)`，origin `left center`（一横的笔顺从左到右），`--transition-fast` 180ms ease-out；② 当前页常驻同一支笔，样式挂在 `&[aria-current='page']` 上——可访问语义即状态源，SSR 直出，不造私有视觉状态 prop；tsx 侧 `usePathname` 归段（`/post/*` 与 `/blog` 同属博客段）；移动端抽屉行盒是卡片不是文字流，当前页改主色墨字 + 主色 8% 淡底（与外观动作行同一语言）；③ 知识库加 `ExternalMark`「↗」（仅 `--text-color` 72% 淡化，无独立 hover）——外链标记传达的是信息（点它会离开本站），不是装饰；无障碍名改「知识库（在新窗口打开）」。
- **对比方案:**
  - 三个导航项各配 Icon（用户提议的原始方向）：朱砂印「墨」作为全 Header 唯一图形入口的等级被稀释；icon+文字是管理后台模板的标准长相，与纸墨语言相悖；真要加需自绘篆刻风图形，成本不对称——否决。与用户同意的评估结论一致。
  - 当前页用 `$active` transient prop：样式块要嵌 `css` 反引号（破坏守卫测试的 block() 提取），且状态与无障碍语义两处声明——改用 aria-current 属性选择器，样式与语义同体——否决。
- **理由:** 静默条原则下"更丰富"的正确解法不是加元素，而是让既有笔画动起来、并让它说出"你在哪"（结构即信息）与"点了会去哪"（外链提示）。运笔与钤印同源于笔墨世界；reduced-motion 下运笔与色彩过渡一并停用。

## 任务

- [x] `styles/index.ts`：NavLink `::after` 改 scaleX 运笔（origin left、`--transition-fast` ease-out、弃 opacity 显隐）+ `&[aria-current='page']` 常驻笔画；`prefers-reduced-motion` 停用主体与 `::after` 过渡；MobileItem 当前页墨字+主色淡底；新增 `ExternalMark`（72% 淡化、em 相对字号、无 hover）
- [x] `index.tsx`：`usePathname` 归段（isBlog 含 `/post/*`、isAbout、isHome）；桌面/移动链接挂 `aria-current`；知识库两处加 ↗ 与无障碍名
- [x] `test/header-quiet-bar.test.mjs`：+3 条守卫（运笔动画与 opacity 回潮禁令、aria-current 常驻与归段、↗ 双处与语义），共 18 条；变异验证 3 轮全部"改坏必红"（opacity 回潮→红、aria-current 删除→红、↗ 删除→红，/tmp 备份恢复）；`tsc --noEmit` 干净
- [x] 浏览器实测（127.0.0.1:3120，桌面 1280 / 移动 375）：`/blog` 博客笔画 matrix(1)（常驻态）其余 matrix(0)、色 78%→实色、`::after` transition-property transform/0.18s；`/` 全收笔；`/post/374` 博客段常驻；移动抽屉真实点击开合后首页主色墨字+淡底、其余透明；hover/active 规则在 CSSOM 在位；截图目验朱色笔画/淡化/↗/钤印位置正确

## 结果

- 实际耗时: 2026-09-15（讨论→实施→验证同日完成）
- 验证: 守卫 18/18 全绿 + 3 轮变异必红 + tsc 干净；上述浏览器探测数据全部命中预期。已知测量限制：未聚焦 webview 冻结 hover/过渡重算，运笔的"过程帧"由规则在位 + 隔离推断证明，非动画过程截图。
- 附注: 验证期间 `/blog` 主体报"页面出现异常"——dev 日志证实为 NestJS 3200 未启动（ECONNREFUSED），与本次改动无关，Header 在错误页内照常正确渲染（恰好证明笔画状态不依赖数据层）。
