# 任务清单

## Phase 1: 稳定复现发布回归

### Task 1: 捕获博客详情 500 的实际异常

- [ ] **文件:** `packages/wuh.site.next/test/`、`packages/wuh.site.next/app/post/`
- [ ] 基于文章 165 创建最小 fixture 或页面 smoke test
- [ ] 在 PR #268 发布后的代码上确认测试命中与线上相同的 500/异常
- [ ] 记录错误堆栈、触发组件和输入数据，禁止根据提交范围猜测
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 修复前测试稳定失败且失败原因与线上现象一致

### Task 2: 锁定数据链路契约

- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`、相关测试
- [ ] 覆盖 `body` 非空、`bodyHtml: null` 的合法 API 响应
- [ ] 验证路由 `165-再读《坐忘歌》` 正确解析为文章编号 165
- [ ] 验证最终传入 PostView 的 `body_html` 非空
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 契约测试先 RED，再由最小实现转 GREEN

## Phase 2: 最小修复

### Task 3: 修复实际异常源

- [ ] **文件:** 由 Task 1 堆栈确定，预计位于 `packages/wuh.site.next/app/post/` 或 `packages/components/image/`
- [ ] 只修改导致详情页 500 的具体组件或 role
- [ ] 保留其他页面的图片语义角色优化
- [ ] 不修改 Nest API 或文章数据
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 原始复现测试通过，不再进入错误边界

### Task 4: 补齐 Markdown 正文 fallback

- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`、`packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 服务端将非空 Markdown body 归一化为最终 HTML
- [ ] PostView 不再将缺失 HTML 静默渲染为空正文
- [ ] 保持现有 HTML 优先，不重复转换
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** bodyHtml 为空但 body 非空时正文仍包含标题和段落

## Phase 3: 回归与发布验证

### Task 5: 运行质量门禁

- [ ] **文件:** 本次所有修复和测试
- [ ] 运行详情页相关测试、Oxlint、TypeScript 和 Next build
- [ ] 运行 `git diff --check`
- [ ] 若本机继续出现环境级 SIGSEGV，记录根因并以 CI 构建结果作为额外证据，不得隐藏失败
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 可执行门禁无代码错误；环境阻塞明确记录

### Task 6: 线上详情页 Smoke Test

- [ ] **URL:** `https://wuh.site/post/165-再读《坐忘歌》`
- [ ] 部署完成后打开真实浏览器并等待水合完成
- [ ] 断言页面不展示 `500`、`文章加载失败`
- [ ] 断言标题、作者和 `.markdown-body` 正文文本可见
- [ ] 检查控制台和网络请求无未捕获错误
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 线上页面可正常阅读文章内容

## 验收

- [ ] `/post/165-再读《坐忘歌》` 不再进入自定义 500 错误页
- [ ] 文章标题、作者、封面（如有）和正文正常展示
- [ ] `/api/content/posts/165` 的现有响应无需修改
- [ ] `bodyHtml: null` 且 `body` 非空时正文不为空
- [ ] 数字 URL 和带 slug URL 均正常
- [ ] PR #268 的非详情页图片优化保持有效
- [ ] 相关测试、Oxlint、TypeScript、构建和 diff check 完成并如实记录
- [ ] 发布后线上 smoke test 通过
