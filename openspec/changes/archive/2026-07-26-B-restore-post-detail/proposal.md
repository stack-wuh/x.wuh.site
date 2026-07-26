# 修复博客详情页发布后 500 错误

## 背景

图片语义角色变更 PR #268 合并并由 CI-CD 成功发布后，博客详情路由出现回归。访问：

`/post/165-再读《坐忘歌》`

页面命中详情路由自定义错误边界，展示：

- `500`
- `文章加载失败`
- `当前文章暂时无法加载`

线上接口 `/api/content/posts/165` 仍返回 HTTP 200，文章 `body` 非空；抓取到的 Next Flight 数据也可包含转换后的 `body_html`。因此修复不能仅假设后端取数失败，也不能在缺少复现测试时随机修改数据接口。

同时确认 `PostView` 当前只消费 `body_html`，没有在 HTML 缺失时利用仍存在的 Markdown `body`，这是会导致正文空白的韧性缺陷，但现有证据尚不足以证明它是本次运行时 500 的唯一触发源。

## 目标

- 先用发布后代码稳定复现博客详情页进入 500 错误边界的具体异常。
- 定位 PR #268 中导致文章详情运行时异常的最小变更点。
- 以最小修改恢复 `/post/[number]-[slug]` 正常展示标题、作者、封面和正文。
- 保证后端返回 `body` 非空但 `bodyHtml` 为空时，详情页仍不会渲染空正文。
- 增加覆盖文章 165 URL、图片角色调用和 Markdown fallback 的回归测试。
- 发布后验证真实线上详情页面不再展示自定义 500 错误页。

## 非目标（明确不做）

- 不回滚 PR #268 的全部图片语义角色体系，除非最小复现证明整体设计不可用。
- 不修改博客内容、GitHub Issue 数据或 MongoDB 记录。
- 不重构完整 Markdown 渲染架构。
- 不改变博客 URL slug 规则、SEO metadata 或 JSON-LD 结构。
- 不将 HTTP 200 的接口响应问题错误归因于 Nest API。

## 影响范围

- `packages/wuh.site.next/app/post/` — 详情页错误触发点、PostView 正文渲染和图片角色调用。
- `packages/components/image/` — 若复现确认 Image role 在详情页触发运行时异常，仅修正对应角色边界。
- `packages/wuh.site.next/test/` — 新增详情页 500 复现、Markdown fallback 和发布回归契约。
- `.github/workflows/` 或部署检查 — 如有必要，增加发布后详情页 smoke test；不改变部署架构。
- 影响包：`@wuh.site/next`；仅在根因指向共享 Image 时影响 `@wuh.site/components`。
