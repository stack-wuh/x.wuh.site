---
title: 博客详情页排版
domain: blog
keywords: [博客详情, 排版, 字号, 行高, 对比度, 封面, 相关文章, 标签链接, 阅读余韵, 书页式设计语言, 章节记号, 首字下沉, 注记式页头, 回形针书签, 分享行, 结构线, Divider]
scope:
  - apps/site/app/post
  - apps/site/app/post/[number]
status: active
source:
  - changes/archive/博客详情页排版优化_2026_05_17/brief.md
  - changes/archive/20260524_P_post_toolbar_redesign/brief.md
  - changes/archive/20260729_B_restore-post-toc/brief.md
  - changes/20260823-feature-post-cover-redesign/brief.md
  - changes/20260829-P-post-typography-design-language/brief.md
  - changes/20260901-style-post-paper-redesign/brief.md
  - changes/20260902-style-post-detail-polish/brief.md
  - changes/20260903-style-post-toc-mobile-polish/brief.md
  - changes/20260903-style-post-hr-blockquote/brief.md
verified: 2026-09-03
---

# 博客详情页排版

## 当前结论

正文排版采用书页式设计语言（「铅字工坊」体系）：正文与标题衬线（`--font-serif` = Noto Serif SC）、辅助文字无衬线、代码等宽。正文 15.5px、行高 1.85（移动端 max-width 640 收敛为 15px/1.85，平板继承桌面值），正文栏宽 680px（约每行 43 字）。标题衬线 700、行高 1.4：h2 23px / h3 20px。h2/h3 由 `lib/articleTypography.ts` 注入「第N节 ──」朱砂眉线记号：自动编号（壹贰叁…拾贰，超出转阿拉伯数字），显示层剥离作者手写的「一、/1.」编号前缀（仅正文标题与目录文本，heading id 与 DOM 锚点不变），右侧目录条目同步渲染朱砂序号。正文首个"以文字开头"的段落首字下沉（`.dropcap` 朱砂 3.35em 下沉两行；纯图片段、以标签/HTML 实体/非文字字符开头的段落跳过）。引用块为左侧 2px 朱砂竖线 + 16px 缩进 + 首尾「」朱砂引号，无底色（横线语言归 hr、竖线语言归引用块，二者不混同）。正文链接与 ol 序号用 `--primary-color` 朱砂并配虚线下划线双重可供性（对比度修复：accent 金在纸面仅约 1.9:1）；`::selection` 朱砂底纸色字。pre 13.5px/1.7；表格仅横向发丝线、表头无彩色粗线。排印变换为纯字符串正则（无 DOM 依赖），在 `useToc` 内 useMemo 同步执行，SSR 与客户端输出确定一致。正文 hr 为两侧渐隐朱砂细线（`border:none; height:1px; linear-gradient 两侧 transparent → 朱砂 45%`，与 Divider ornament 同语言；原生 hr 可见线由 border 绘制、background 不生效，必须去边框自绘）。文章末尾仅在文章真正编辑过（`updated_at` 存在且不等于 `created_at`）时显示「更新于 X」带字线。对比度约束保持：`--text-primary` 与背景 >= 4.5:1，`--text-secondary` >= 3:1，代码块 >= 4.5:1。素雅 dark 模式所有 `--normal-*` 和 `--background-*` 变量有专属值，不继承酒红 dark。

页头为注记式构图：辅助信息双列单行两端对齐——meta 行（作者 500 字重 · 日期 · 阅读数，间隔点分层）靠左、回形针书签标签靠右；衬线大标题 clamp(28px, 5.4vw, 40px) 做主角；头部以朱砂短规（44×2px）+ 发丝线延伸收尾，与正文章节 stub 同语言。520 以下 toprow 折为上下两行。标签为回形针书签样式：纸片（background-100 + 发丝线描边 + 2px 圆角）左上角别朱砂回形针（IconPaperclip 15px，骑线探出纸外，角度由标签名哈希在 ±3° 五个离散档位确定性推导、禁用 Math.random 防 hydration mismatch），容器 column-gap 10 / row-gap 14 / 顶部 6px headroom；hover 只让纸片下移 2px、回形针纹丝不动（抽纸片暗示），文字变朱砂，过渡走 motion tokens 并有 reduced-motion 降级；不使用 clip-path 燕尾缺口与顶部色带。有封面图时标题区在上（order 控制）、封面杂志卡在下；无封面时生成式封面承载 header 信息（PostHeader 不渲染），无封面文章不显示回形针书签标签。页头不渲染作者头像行。封面细节见 `post-cover.md`。

相关文章基于标签与时间排序、去重且最多 3 篇：每个标签并发请求最多 10 篇候选，按共享标签数降序、更新时间降序、编号升序排序。「继续阅读」模块以线索小径 + 轻卡片结构呈现：模块有与详情页一致的卡片边界，内部用左侧竖向线索线 + 圆点节点串起推荐项；计数「拾遗 N 则」，引导语取传统文气；hover 仅改变标题与箭头颜色并使箭头轻微右移。窄屏下单向触达高度不低于 44px。

文章标签链接使用 `buildTopicUrl` 生成 `/topics/<encoded>` 站内链接，不构造 GitHub Issue label query URL。Alert 组件区分站内外链接：外部域名设 `target="_blank"` + `rel="noopener noreferrer"`，站内路径同窗口导航。

页面容器为纯纸面语言：零投影、发丝线分段、模块间距统一 space-xl 档；侧栏目录为纸面竖线式（active 3px 朱线 + 朱色文字 + 朱砂序号），移动端目录为纸面折叠条（summary = serif「目录」+「共 N 节」计数 +「读至 · 第N节」朱砂小注（衬线序号、ellipsis）+ 28px 圆形箭头钮 IconChevronDown（cbtn 圆钮语言，[open] 旋转 180°），仅上缘发丝线，点击条目后 closest('details') 关闭）；侧栏自上而下为目录、发丝线分隔的工具列（连体分段三钮组：返回首页/回到顶部/点赞，点赞段主色实底最醒目）、前后篇迷你导航（「‹ 天才向左 / 疯子向右 ›」，标题两行封顶）、篇信息小注。FloatingActions 三钮组保持连体分段组件语言不变。文末前后篇对开与三钮组桌面端隐藏（已由侧栏承载），移动/平板保留。

页面结构性分割线由公共 `Divider` 组件（`@wuh.site/components/divider`）单点渲染，容器自身不带 border：评论区标题线为 hairline 默认变体（灰发丝线），仪式感点缀场景（牌记开线）用 ornament 变体——两侧线由 transparent 渐入朱砂 45%、◇ 同 `--primary-color`；牌记以 ornament 直接开线（其上不再叠 plain 分割线），牌记底部亦无独立分割线（评论区标题线承接），一个视口内结构线不重叠。文章页脚为居中仪式式 colophon（ornament 点缀开线 + 版权/来源行 + 分享行 + 移动端三钮组）；分享行为页面级 8 枚 cbtn 圆形图标钮（微信/QQ/微博/Twitter/邮件/复制链接/分享图/导出全文，无「分享到」标签，对齐 prototype-v2 原型），40×40 圆形、background-200 底 + normal-300 描边，hover 上浮放大 + 描边消隐 + 朱砂图标色，focus ring，过渡走 `--motion-*` tokens、无循环关键帧，颜色全语义 token 不用 `prefers-color-scheme`；SharedLinkGroup 组件不再被详情页引用（其与 alert/dialog/link-group/message/result 的 prefers-color-scheme 遗留问题待统一治理）。

## 执行约束

- 正文排版、排印变换、目录锚点、前后篇工具栏和 slug 兼容必须一起回归；封面细节只引用 `post-cover.md`，不得在本卡重复定义。
- 业务样式不得直写 `prefers-color-scheme`，明暗适配走手动主题体系变量；动画引用 `--motion-*` tokens 并带 reduced-motion 降级。

## 适用边界

不约束博客列表卡片和封面解析的后端实现。

## 验证方式

检查 `PostView/index.tsx`、`components/PostHeader`、`lib/articleTypography.ts`、`styles/post-*.ts`、目录组件和 `[number]/page.tsx`；验证数字与带 slug 路由均能取得同一文章；分别在 light/dark × wine/plain 四主题下检查页头构图、章节记号与书签标签。

## 关联知识

- [post cover](./post-cover.md)
- [blog code highlighting](./blog-code-highlighting.md)
- [seo](./seo.md)
- [animation system](./animation-system.md)
