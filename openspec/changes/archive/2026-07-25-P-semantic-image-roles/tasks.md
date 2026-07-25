# 任务清单

> 本清单仅描述后续实施工作。当前 propose 阶段不修改产品代码。

## Phase 1: 共享 Image 角色基础

### Task 1: 建立角色 API 与失败契约

- [ ] **文件:** `packages/components/image/index.tsx`、`packages/components/image/styles/index.tsx`、相关测试
- [ ] 先增加失败测试，覆盖 `ImageRole`、角色默认值、显式属性优先级和兼容默认行为
- [ ] 增加 `imageClassName`、`imageStyle` 的失败测试，确认其只作用于内部图片
- [ ] 增加开发环境无 role 提示和生产环境静默的契约
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 相关测试先 RED，最小实现后 GREEN

### Task 2: 实现角色 resolver 与状态视觉

- [ ] **文件:** `packages/components/image/index.tsx`、`packages/components/image/styles/index.tsx`
- [ ] 实现 avatar/book-cover/content/cover/thumbnail/logo/qr 默认配置
- [ ] 确保 Wrapper 单点负责圆角、背景、边框和裁切
- [ ] 让 Skeleton 和 fallback 继承角色形状，并为小尺寸角色提供紧凑错误态
- [ ] 保持显式 `borderRadius`、`appearance`、`variant` 高于 role
- [ ] 保留未传 role 的兼容默认值
- [ ] **预计耗时:** 2 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 组件测试通过；类型检查通过

### Task 3: 更新 Image 文档

- [ ] **文件:** `packages/components/image/readme.md`
- [ ] 记录角色表、属性优先级、Wrapper/内部图片职责和迁移示例
- [ ] 记录 ImagePreview、popup QR、地图 SDK 等例外
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 文档无 TBD/TODO；示例与类型一致

## Phase 2: 高优先级页面迁移

### Task 4: 迁移头像角色

- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`、`app/about/styles.ts`、`app/post/components/PostHeader.tsx`、`app/post/styles/post-header.ts`、`app/post/components/PostComments.tsx`
- [ ] 先增加失败测试，锁定圆形 Wrapper、透明背景和首字母 fallback
- [ ] About 头像移除内部 inline 圆角修补，使用 `role='avatar'`
- [ ] 文章作者头像迁移并保留 accent ring
- [ ] 评论头像迁移并保留无图片首字母显示
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 头像在浅色/深色均无黑底，Skeleton/fallback 保持圆形

### Task 5: 迁移书封角色

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts`、`app/weread/WereadView.tsx`
- [ ] 先增加失败测试，锁定 `book-cover`、2px 圆角、contain 和中性纸张底
- [ ] 两处书封删除重复的 4px 圆角、appearance 和 variant 配置
- [ ] 保留调用方尺寸、flex 和必要的局部阴影差异
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 首页与微信读书页封面视觉一致且无过大圆角

### Task 6: 迁移 Logo 与二维码

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts`、`app/components/ContactCard.tsx`
- [ ] 先增加失败测试，锁定 logo 0 圆角透明外观和 QR 白底静区
- [ ] 首页 Logo 使用 role 与正式 `imageClassName`/`imageStyle`
- [ ] ContactCard Logo 迁移到 logo role
- [ ] ContactCard QR 迁移到 qr role，使用 contain 而非 cover
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** Logo 暗色 filter 生效；二维码在两种显示模式下保持可扫描

## Phase 3: 封面、缩略图与 HTML 内容

### Task 7: 迁移文章封面

- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`、`app/post/styles/post-header.ts`
- [ ] 先增加失败测试，复现移动端父容器 0 圆角但 Image Wrapper 仍有默认圆角的问题
- [ ] 使用 cover role，让桌面和移动圆角都落在 Wrapper
- [ ] 保留 priority、16:9、edge-to-edge 和加载失败隐藏行为
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 320px 移动端封面真实直角；桌面按页面规范显示圆角

### Task 8: 迁移足迹缩略图

- [ ] **文件:** `packages/components/footprint-map/`、`packages/wuh.site.next/app/footprint/page.tsx`
- [ ] 先增加失败测试，锁定 1:1、cover、8px 和点击预览行为
- [ ] 将可安全的足迹照片迁移到 thumbnail role
- [ ] 不改变地图容器或 SDK 资源
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 图片布局、点击预览和键盘行为保持不变

### Task 9: 统一 HTML 内容图片 CSS

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-markdown.ts`、评论样式、`app/footprint/` 内容样式
- [ ] 增加源码/视觉契约，锁定 max-width、height:auto、8px、背景和轻边框
- [ ] 让 Markdown、评论 HTML 和足迹正文图片与 content role 视觉一致
- [ ] 防止窄屏横向滚动
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 含透明 PNG 和超宽图片的 HTML 内容在 320px 下可读

## Phase 4: 回归与视觉验收

### Task 10: 完整质量门禁

- [ ] **文件:** 本次所有变更
- [ ] 运行 Image 组件与页面相关测试
- [ ] 运行 Oxlint
- [ ] 运行 Next TypeScript 检查
- [ ] 运行 Next 构建
- [ ] 运行 `git diff --check`
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 所有命令零错误；若环境阻塞需记录根因而非绕过

### Task 11: 浏览器矩阵验收

- [ ] **页面:** `/`、`/weread`、`/about`、文章详情、足迹页、Contact Dialog
- [ ] 检查酒红/素雅 × 跟随系统/浅色/深色
- [ ] 检查 320px、375px、768px、1280px
- [ ] 检查透明头像、书封、Logo、内容图、文章封面、缩略图和二维码
- [ ] 检查加载中、加载失败、减少动效和图片预览交互
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 无黑底、无双层圆角、无布局跳动、无横向滚动

## 验收

- [ ] 微信读书首页与列表书封均使用 2px 圆角
- [ ] About、文章作者和评论头像透明区域不显示黑底
- [ ] 头像 Skeleton/fallback 始终为圆形
- [ ] 首页与 ContactCard Logo 为 0 圆角透明外观，内部 filter 稳定生效
- [ ] 文章封面移动端为真实直角，桌面圆角由 Wrapper 单点负责
- [ ] 足迹缩略图保持 1:1、cover 和点击预览
- [ ] 二维码在所有主题下保持白底、静区和可扫描性
- [ ] HTML 内容图片不超出容器且与 content role 视觉一致
- [ ] ImagePreview、popup QR、地图 SDK 专用实现未被误改
- [ ] 未传 role 的旧消费者继续运行，开发环境提示迁移
- [ ] 相关测试、Lint、TypeScript、构建与 `git diff --check` 全部通过
