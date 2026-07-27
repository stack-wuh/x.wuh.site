# OpenSpec 规范索引

> 新需求开始前，先查阅此索引了解当前系统规范，避免设计与已有规范冲突。
> 每个领域列出核心需求和关键词，匹配后可深入阅读对应 spec.md。

## about-activity — About 统一综合热力图
- **关键词:** About, 综合热力图, GitHub 贡献, 站点活动, 365天, 统一总量
- **需求:** 最近 365 天统一活动聚合, 站点活动分类明细, 统一总量与等级, 缺失日期补零, 单一综合热力图, 统一错误处理, Heatmap 多数据语义
- **路径:** `openspec/specs/about-activity/spec.md`

## components — 组件包
- **关键词:** 组件库, exports map, 图片组件, 语义角色, 头像, 书封, 二维码, 透明背景, 图片预览, 动画, framer-motion
- **需求:** 组件包使用 exports map 导出, 图片切换有过渡动画, 缩放和旋转有弹性动画, ImagePreview 组件代码按职责拆分, Image 支持语义角色, 图片外轮廓由 Wrapper 单点负责, 内部图片提供正式样式通道, 未传 role 时保持兼容, 头像角色使用圆形透明外观, 书封角色保持实体书轮廓, 内容图片具有稳定阅读外观, 页面封面圆角由上下文明确控制, 缩略图使用紧凑状态, Logo 保持透明完整, 二维码保持可扫描性, 专用图片链路保持例外
- **路径:** `openspec/specs/components/spec.md`

## content-api — 内容 API
- **关键词:** 内容API, 分页, REST, 博客, 项目, 404, 查询参数, labels, AND查询, 相邻文章, 封面图, metadata.cover
- **需求:** Paginated response format, Post not found returns 404, Query parameter type coercion, Labels comma-separated, Multiple labels query uses AND semantics, findAll returns PaginatedResult, Post detail includes prev/next adjacent posts, Post detail derives cover from first content image, Post detail falls back to markdown first image
- **路径:** `openspec/specs/content-api/spec.md`

## rss — RSS 订阅
- **关键词:** RSS, feed, 订阅, XML, 自动发现
- **需求:** RSS feed URL 格式, RSS 仅输出已发布内容, 前端 RSS 自动发现
- **路径:** `openspec/specs/rss/spec.md`

## weread-shelf-order — 微信读书书架顺序
- **关键词:** 微信读书, 书架顺序, 在读, finishReading, shelfIndex
- **需求:** 微信读书页面保持书架顺序, 首页展示在读前 6 本, 同步持久化书架位置, 微信读书分页查询
- **路径:** `openspec/specs/weread-shelf-order/spec.md`

## seo — SEO 优化
- **关键词:** SEO, Open Graph, Twitter Card, metadata, Markdown AST, JSON-LD, ProfilePage, canonical, 结构化数据, URL slug, ISR, redirect, sitemap, topic pages, 主题页, archive, 归档页, CollectionPage, ItemList, breadcrumb, 面包屑, structured-data builder
- **需求:** 全站 Open Graph 标签, Twitter Card 标签, 文章差异化 description, 全站默认 Open Graph 图片, 文章 Twitter 图片回退, 文章作者关键词与分类 metadata, 语义 Markdown 自动摘要, CMS 摘要优先, JSON-LD BlogPosting, About 作者档案结构化数据, canonical URL, 博客 URL 包含标题 slug, 旧 URL 格式向后兼容, 文章页对非规范路径永久重定向, 公开文章页不依赖请求 Cookie 且使用 ISR, Sitemap 分页生成并错误即失败, 调试页不进入 sitemap, 根布局 Metadata 默认值, WebSite与Person JSON-LD, BlogPosting builder, 面包屑 JSON-LD, 主题页 canonical 与 sitemap, 主题URL编解码单一入口, 旧 labels 筛选页 noindex, 归档页 canonical, 集合页 CollectionPage 与 ItemList
- **路径:** `openspec/specs/seo/spec.md`


## mobile-viewport — 移动端 viewport 增强
- **关键词:** viewport, themeColor, colorScheme, 移动端, 浏览器主题色, 闪白修复
- **需求:** 亮/暗主题工具栏颜色, colorScheme 声明
- **路径:** `openspec/changes/archive/2026-07-12-P-mobile-viewport-enhance/specs/mobile-viewport/spec.md`
## repos-api — 仓库 API
- **关键词:** GitHub API, 仓库, 置顶, GraphQL, Octokit, 缓存
- **需求:** Get GitHub pinned repositories, 5-minute memory cache, Stale cache fallback
- **路径:** `openspec/specs/repos-api/spec.md`

## admin-console — 后台 Console 与权限
- **关键词:** 后台, Console, Vite, React, GitHub OAuth, root, reader, 博客管理, 留言板, 评论审核, 生产部署, 静态镜像, SPA fallback, 同源 API, /v2, Nginx 代理, staging, 健康检查, 发布, 回滚, Cookie, 环境变量边界
- **需求:** 独立后台 Console, GitHub 认证登录, stack-wuh 唯一 Root, 其他用户自动 Read, 服务端写权限保护, 博客管理, 留言板管理, 博客评论管理, Console 以独立静态镜像发布, Console 容器 SPA 路由, 外部 Nginx 代理保持原始路径, Console 使用同源 API, 生产 OAuth Callback Console 域名, 环境变量不注入 Secret, CI/CD Console 构建与发布, 首次上线同步发布, 后续纯静态变更独立发布, 静态资源缓存策略
- **路径:** `openspec/specs/admin-console/spec.md`

## api-standardization — API 标准化
- **关键词:** API标准化, 前后端联调, OpenAPI, Swagger, 异常过滤器
- **需求:** GET /v2/repos, Swagger 文档自动生成, 统一异常过滤器, 前端使用 NestJS API
- **路径:** `openspec/specs/api-standardization/spec.md`

## design-system — 设计系统
- **关键词:** UI设计, 主题, 主题切换, CSS变量, 酒红, 素雅, 暗黑模式跟随系统, 闪动修复, 过渡动画, 打字动画, 响应式, 可访问性, 移动菜单, 内联展开, Header, 桌面导航, 渐隐下划线
- **需求:** 双维度主题模型, 三层CSS变量架构, CSS变量命名规范, 首屏主题无闪动, 首屏禁用过渡动画, 全局主题色过渡动画, 首页主题胶囊控件, 移动端主题操作项, 主题切换行为保持不变, 主题控件可访问, 主题风格色板固定预览, 移动端外观设置内联展开, 桌面外观入口与导航统一, 外观选项控件共享, 首页标语打字动画, HomeView Motto区域, PostView组件拆分, marked前端解析, MarkdownBody排版细化, 桌面主导航使用渐隐装饰下划线, 桌面主导航保持可访问与稳定布局, 移动菜单不采用桌面下划线方案
- **路径:** `openspec/specs/design-system/spec.md`

## blog-display — 博客展示
- **关键词:** 日期格式, 浏览量, viewCount, MM-dd, 相对时间
- **需求:** 首页/列表页时间格式, 详情页时间格式
- **路径:** `openspec/specs/blog-display/spec.md`

## blog-detail — 博客详情页
- **关键词:** 博客详情, 排版, 暗黑模式, WCAG, 对比度, 代码块, 封面图, 正文首图, 相关文章, 继续阅读, 阅读余韵索引, 响应式, 可访问性, 主题页链接, Alert 站内外链接
- **需求:** 正文字号与行高, 标题层级字号, 文字色彩对比度, 代码块可读性, 素雅Dark模式完整性, Detail page shows cover below header metadata, Detail page hides unavailable cover image, Detail page hides failed cover image, 相关文章以阅读余韵索引呈现, 索引项提供阅读判断信息, 索引项可访问且具备克制反馈, 索引在窄屏和减少动态偏好下保持可用, 相关文章基于标签与时间排序去重且最多三篇, 文章标签链接指向站内主题页, Alert 区分站内外链接的打开行为
- **路径:** `openspec/specs/blog-detail/spec.md`

## blog-code-highlighting — 代码高亮
- **关键词:** 代码高亮, Markdown, unified, rehype, 服务端渲染
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/blog-code-highlighting/spec.md`

## blog-category-filter — 博客分类查询
- **关键词:** 博客列表, 分类查询, labels, 多标签, AND查询, 分页, GitHub Issues, 主题色
- **需求:** 博客列表支持分类查询, 多标签 AND 分类查询, 分类筛选状态可分享, 多标签筛选状态可分享, 分类入口展示完整 open 标签汇总, 分类数量文案, 分类筛选与分页联动, 多标签分类筛选与分页联动, 切换分类重置分页, 多个筛选 token 可单独移除, GitHub Issues 风格过滤条, 博客列表分页 URL
- **路径:** `openspec/specs/blog-category-filter/spec.md`

## blog-scroll-flicker-fix — 滚动闪屏修复
- **关键词:** 滚动, 性能, CSS动画, scroll-driven, 阅读进度
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/blog-scroll-flicker-fix/spec.md`

## contact-dialog — 联系弹窗
- **关键词:** 联系, 弹窗, Header, 关闭图标, 垂直对齐
- **需求:** Dialog遮罩层, Dialog圆角和间距, Dialog移动端底部弹出, Dialog动画(弹性缓动+退出), 纸张风视觉, Dialog标题栏垂直对齐, Dialog副标题场景对齐
- **路径:** `openspec/specs/contact-dialog/spec.md`

## homepage-data — 首页数据获取
- **关键词:** 首页, 数据获取, Server Component, 构建后, force-dynamic, 空数据
- **需求:** Homepage fetches data at runtime after production build, Homepage logs server data fetch failures
- **路径:** `openspec/specs/homepage-data/spec.md`

## icon-system — 图标系统
- **关键词:** 图标, lucide-react, Outline风格, SVG, 组件库
- **需求:** 统一Outline图标风格, 统一图标接口, 移除混用fill/stroke旧图标, Brand图标风格对齐
- **路径:** `openspec/specs/icon-system/spec.md`

## error-handling — 错误处理
- **关键词:** 错误处理, 异常, 过滤器, Swagger, Sentry
- **需求:** Global exception filter, Swagger API documentation
- **路径:** `openspec/specs/error-handling/spec.md`

## guestbook-barrage — 留言板群聊弹窗
- **关键词:** 留言, 群聊, Dialog, About入口, Hover, 文字对比度, 过渡动画, reduced-motion, 即时提交, 错误日志
- **需求:** About 页面留言板入口, 留言板入口 Hover 保持文字可读, 留言板入口状态同步渐进, 留言板入口尊重减少动态偏好, 群聊式留言弹窗, 输入框字数限制, 点击发送即提交, 缓存留言昵称, Next 留言代理, 匿名留言字段对齐, dev 与 build 输出目录隔离
- **路径:** `openspec/specs/guestbook-barrage/spec.md`

## redesign-error-pages — 错误页面重设计
- **关键词:** 404, 500, 错误页面, editorial风格
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/redesign-error-pages/spec.md`

## build-config — 构建配置
- **关键词:** 构建, 环境变量, dotenv, MongoDB, health check, sync, Docker, NEST_API_URL, Console, Dockerfile, Docker Compose, deploy-docker.sh, staging, 端口规划
- **需求:** dotenv环境变量加载, sync:init使用完整NestJS启动, MongooseModule异步工厂, health检查, sync仅同步open issues, Production server API fallback uses Docker service name, Dockerfile 支持 Console 构建, Docker Compose 包含 Console 服务, 部署脚本管理 Console 生命周期
- **路径:** `openspec/specs/build-config/spec.md`

## code-split — 代码拆分
- **关键词:** 代码拆分, 重构, About页面, 组件化
- **需求:** (见 spec.md)
- **路径:** `openspec/specs/code-split/spec.md`

## code-style — 代码风格约定
- **关键词:** 代码风格, CODE_STYLE, 文件长度, JSDoc, 样式拆分, styled-components
- **需求:** 单文件不超过300行, 导出函数必须加JSDoc, 样式统一为styles/index.ts, 通过import * as S命名空间导入
- **路径:** `openspec/specs/code-style/spec.md`

## next — 前端构建
- **关键词:** Next.js, 导入路径, tsconfig paths, CDN, 路径别名, @/*
- **需求:** 导入路径统一无 /index 后缀, shared-contracts 路径映射, 优先使用 @/* 路径别名
- **路径:** `openspec/specs/next/spec.md`

## pagination — 分页器
- **关键词:** 分页器, 分页, W-u-H, 字母式, 组件库
- **需求:** W-u-H字母式分页, 窗口裁剪, 导航按钮, 空状态不渲染, 组件导出, 替换内联分页
- **路径:** `openspec/specs/pagination/spec.md`

## post — 博客详情
- **关键词:** 博客详情, 500, 正文 fallback, slug, 发布 smoke test, PostToolbar, 流动阅读线
- **需求:** PostToolbar 流动阅读线样式, 发布后博客详情页正常展示, 详情页回归必须捕获真实异常, Markdown 正文具有可靠 fallback, 详情路由兼容标题 slug, 发布流程验证真实文章详情
- **路径:** `openspec/specs/post/spec.md`

## post-cover — 博客详情页封面图
- **关键词:** 博客, 封面图, GitHub Issue, metadata.cover, coverAlt, 移动端, 动效
- **需求:** Issue 隐藏封面元数据, 显式封面与正文图片独立, 移动端封面开场, 封面动效可访问性, 文章详情封面回退与去重, 桌面端阅读栏封面
- **路径:** `openspec/specs/post-cover/spec.md`

## visit-stats — 全站访问量统计
- **关键词:** 访问量统计, visit-stats, 统计, pageview, 计数器, analytics, 独立访客, UV
- **需求:** 前端自动上报访问, 后端按 IP 去重计数, 查询访问量统计, 页面展示统计数据, 为站点活动提供逐日访问聚合
- **路径:** `openspec/specs/visit-stats/spec.md`
## openspec-workflow — 工作流规范
- **关键词:** OpenSpec, 工作流, propose, discuss, apply, review, archive
- **需求:** propose, discuss, apply, review, archive, 单一Skill入口
- **路径:** `openspec/specs/openspec-workflow/spec.md`

## page-flash-fix — 页面刷新闪烁修复
- **关键词:** 闪烁, flash, data-no-transition, reflow, 过渡动画, setAttribute, offsetHeight
- **需求:** 修复防闪烁机制中 dataset API 导致的属性名不匹配；调整执行顺序防止过渡动画可见
- **路径:** `openspec/changes/archive/2026-07-12-B-fix-page-flash/specs/page-flash-fix/spec.md`

## blog-comments — 博客评论
- **关键词:** 评论, comment, GitHub Issues, 匿名评论, 审核
- **需求:** 博客详情页展示评论, 匿名提交评论, 审批后发到 GitHub Issue, 重复审批拦截
- **路径:** `openspec/changes/archive/2026-07-12-P-blog-comments/specs/blog-comments/spec.md`
