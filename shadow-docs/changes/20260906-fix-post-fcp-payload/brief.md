---
{
  "schema": "shadow-dev/v1",
  "name": "20260906-fix-post-fcp-payload",
  "type": "fix",
  "scope": "apps/site/app/post",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20260906-fix-post-fcp-payload",
  "files": [
    "apps/site/app/components/FontPrefetch.tsx",
    "apps/site/app/layout.tsx",
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/[number]/loading.tsx",
    "apps/site/app/post/[number]/page.tsx",
    "apps/site/public/fonts",
    "apps/site/test/post-skeleton-layout-sync.test.mjs",
    "shadow-docs/knowledge/blog-detail.md",
    "shadow-docs/knowledge/first-load-performance.md"
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
    "verifiedCommit": "f4b514d1d9628099498ef2a32e6033318c37bb57",
    "verifiedAt": "2026-09-06T15:04:26.743Z"
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

# 详情页首屏载荷治理：字体切片 + 骨架回退 + JS 瘦身

## 动机
用户实测反馈博客详情页（/post/[number]）FCP 问题严重、加载 JS 文件过多。客观取证（2026-09-06，wuh.site/post/135）：
- JS 1.13MB / 20 个 async chunk（最大 200/157/131/110KB）
- HTML 181KB，其中内联 <style> 98.5KB（styled-components SSR 全量 dump，含骨架样式）
- v1.4.17 引入的整页镜像骨架 loading.tsx 使路由进入流式形态：78 个骨架 DOM 先于正文渲染，FCP 元素为灰骨架，真实内容藏 hidden 区由脚本交换
- 首屏必需 CJK 衬线字体未切片：NotoSerifSC-400/700 共 634KB 整包下载；全站字体 ~1.15MB
- cache-control: no-store，浏览器零缓存
首屏总下载 ~2.4MB，慢速网络下数据、字体、JS 三者互相抢带宽。

## 引用规范
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 服务端只等首屏主体数据；非首屏不阻塞初始 HTML；首页 hydration 瘦身先例（TBT 减半）
  - 适用 scope: apps/site/app/post（本变更将详情页纳入同一原则的适用面）
- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 记载了 v1.4.17 整页镜像骨架（loading.tsx）与防漂移测试——本变更将撤销该骨架，卡片需同步更新
  - 适用 scope: apps/site/app/post
- shadow-docs/knowledge/build-config.md
  - 当前结论: styled-components 需 SWC 转换（原包导入 + compiler.styledComponents）；Turbopack 构建颗粒化 chunk
  - 适用 scope: 字体接入与 chunk 调整不得破坏上述约束

## 决策
- **选型:** 方案 A 三阶段组合——Phase 1 字体治理（**执行期修正**：fonttools 切片实验证实对 1795 字子集字体为负优化——woff2 跨字形压缩优势丢失、总量 2.2 倍——改为 app/fonts/cjk.css 构建管线接入，解决 max-age=0 回访重复下载的真痛点；切片脚本留档 scripts/split_cjk_fonts.py 供未来全量字体使用，保持 --font-sans/--font-serif 变量契约）；Phase 2 撤销详情页整页骨架（回退 ISR 命中页的流式形态，HTML 181KB→约110KB）；Phase 3 bundle 分析 + 低频重组件 next/dynamic 延迟化（分享弹窗/导出全文/评论/音频播放器等）
- **对比方案:** B（只合并 JS chunk，不减总量，治标）；C（只做字体切片，JS 抢带宽依旧）；用户确认为 A
- **理由:** 三个问题均为实测硬数据；分 Phase 独立发版可回退；字体切片是用户主诉的直接解且收益最大（634KB→50-150KB 级），骨架回退消除灰骨架 FCP 元素，JS 瘦身解决带宽争抢与 TBT

## 任务
### Phase 1 字体切片
- [x] 调研并引入 cn-font-split（devDependency），对 NotoSansSC-400/700、NotoSerifSC-400/700 四个字重执行切片 — `apps/site/public/fonts/` — 产物为切片 woff2 目录 + unicode-range @font-face CSS
- [x] 替换 next/font/local 为切片 @font-face 接入，保持 --font-sans/--font-serif CSS 变量契约与 fallback 字栈 — `apps/site/app/layout.tsx` — 移除 CJK localFont 实例（JetBrainsMono 保留 next/font）
- [x] 核对 FontPrefetch 的 fonts.load 预热与新字体族名兼容 — `apps/site/app/components/FontPrefetch.tsx` — 适配或移除
- [x] 验证字体管线：构建产物产出 static/media 哈希字体且 CSS 正确引用（Turbopack url() 资源） — 验证（部署后另行抽查 Lighthouse）

### Phase 2 骨架回退
- [x] 删除整页镜像骨架 — `apps/site/app/post/[number]/loading.tsx` — 移除文件
- [x] 处理防漂移测试（断言骨架壳复用，骨架删除后测试需删除/改写） — `apps/site/test/post-skeleton-layout-sync.test.mjs` — 删除
- [x] 确认 page.tsx 无 loading 边界残留依赖，ISR 命中页回到单帧完整 HTML — `apps/site/app/post/[number]/page.tsx` — 验证

### Phase 3 JS 瘦身
- [x] source-map-explorer / 构建产物分析 200/157/131/110KB 四大 chunk 构成，输出清单 — 构建
- [x] 按清单将低频重组件改为 next/dynamic 延迟加载（候选：分享弹窗、ShareCard/ArticleExporter、PostComments、AudioPlayer、代码高亮） — `apps/site/app/post/` — 逐个改造
- [x] 验证 JS 拆分：本地生产构建冒烟，首包 chunk 零包含 toBlob/qrcode，HTML 70KB/内联 CSS 39KB/骨架 0 — 验证（Lighthouse 前后对比于 v1.4.19 部署后执行）

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/blog-detail.md（移除整页镜像骨架结论）、shadow-docs/knowledge/first-load-performance.md（新增详情页字体切片与载荷边界结论）
- **理由:** 骨架屏是 v1.4.17 刚写入 blog-detail.md 的结论，撤销必须同步卡片避免规范漂移；字体切片与详情页载荷边界是长期有效的新事实，归入 first-load-performance.md
