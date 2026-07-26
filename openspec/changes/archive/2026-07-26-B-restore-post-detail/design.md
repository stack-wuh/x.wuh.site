# 博客详情页 500 回归修复设计

## 架构

修复遵循“先捕获异常，再做最小恢复”的边界，不预先假定是接口、Markdown 或 Image 单一模块导致。

```text
生产详情 URL
  ↓
Next /post/[number] Server Component
  ├─ 解析 number
  ├─ GET Nest /v2/content/posts/:number
  ├─ body → renderMarkdown → body_html
  └─ PostView props
         ↓
PostView Client Component
  ├─ PostHeader / PostCover
  ├─ useToc(body_html)
  ├─ MarkdownBody
  └─ 任一运行时异常 → app/post/[number]/error.tsx（500）
```

实施时先在发布后代码上通过可执行测试或本地浏览器捕获错误对象、堆栈和触发组件，再将修复限制在异常源。无论本次 500 的直接异常是什么，正文数据链路需要增加 `body_html` 缺失时的明确 fallback，避免 metadata 正常但正文为空。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 修复策略 | 发布回归的最小修复 | 需求是恢复博客详情，不撤销无关图片优化 |
| 根因定位 | 真实详情 URL + 错误边界/控制台/服务端日志 | HTTP 抓取已证明接口和 Flight 可正常，必须捕获浏览器运行时异常 |
| 回归基线 | `/post/165-再读《坐忘歌》` | 用户提供的稳定复现 URL |
| 数据边界 | Nest API 保持不变 | `/api/content/posts/165` 已返回 HTTP 200 和完整 Markdown |
| 正文兜底 | 服务端统一生成 HTML，PostView 不静默渲染空字符串 | 避免在客户端引入第二套 Markdown 渲染实现 |
| 图片处理 | 仅修正触发详情异常的 role/调用 | 不回滚 avatar、book-cover、logo、qr 等无关角色 |
| 测试 | TDD + 详情页 smoke test | 必须先看到 500 复现测试失败，再实现修复 |

## 数据模型

不修改 DTO、Schema 或数据库字段。

继续兼容合法响应：

```ts
{
  body: string
  bodyHtml?: string | null
}
```

Next 页面层负责将非空 `body` 转换为最终 `body_html`，不能假设数据库一定持久化 HTML。

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/content/posts/:slugOrNumber` | Nest 内部文章详情接口，保持现有响应 |
| GET | `/api/content/posts/:slugOrNumber` | 浏览器侧代理接口，用于诊断与契约验证 |
| GET | `/post/:number-:slug` | 必须返回并渲染文章内容，不命中 500 错误边界 |

无请求或响应格式变更。

## 组件/模块设计

### 详情页复现测试

- 使用文章 165 的最小 fixture，保留标题、用户、Markdown body、可选封面和评论相关字段。
- 运行发布后 `PostView` 所需组件树，捕获导致错误边界的异常。
- 测试必须在修复前因同一异常失败，而不是只检查源码字符串。
- 如本地环境无法完整运行 React 页面，增加部署 smoke test，通过最终页面正文文本和无 500 文案验证。

### Server Component 数据归一化

- `getIssue` 成功返回后，确保最终传入 `PostView` 的 `body_html` 非空。
- `body` 非空时统一使用现有 `renderMarkdown` 转换。
- 转换失败应抛出可观察错误并记录文章编号，不能静默变为空字符串。
- 已有 `body_html` 可直接复用，避免不必要的重复转换。

### PostView 正文保护

- 不再将缺失 `body_html` 无条件归一化为 `''` 后继续渲染空文章卡片。
- 若页面层已归一化但仍收到空 HTML，应提供明确保护：使用已归一化结果或触发带上下文的错误，而不是无内容成功页。
- 保持 `useToc` 只处理目录，不承担 Markdown 转换职责。

### 图片角色回归边界

重点检查 PR #268 在详情页实际使用的：

- `PostHeader` 作者 `avatar`
- `PostCover` 的 `cover`
- 评论头像 `avatar`
- `Image` fallback 与 styled-components transient props

只修改被复现堆栈命中的组件。若异常来自某个 role 的运行时属性，修正共享组件并增加组件级回归；若不相关，则保留现状。

### 发布后 Smoke Test

- 请求用户提供的文章 URL。
- 断言页面不含 `500`、`文章加载失败`。
- 在浏览器水合完成后断言 `.markdown-body` 含文章正文文本。
- 检查控制台无未捕获异常和 hydration error。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | 正常展示桌面文章标题、封面、正文和侧边目录 |
| < 768px | 正常展示移动端 edge-to-edge 封面和正文，不因图片 role 触发错误 |

本次不改变现有排版，只验证所有断点不进入错误边界。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无。
- **向后兼容:** 兼容旧数字 URL、带 slug URL，以及 `bodyHtml: null` 的文章记录。
- **性能影响:** 服务端仅在缺少可用 HTML 时转换 Markdown；无额外 API 请求。
- **安全影响:** 继续使用现有统一 Markdown sanitize/render 流程，不在客户端直接引入未净化 HTML。
- **发布风险:** 修复必须在部署后对线上文章 165 做 smoke test，避免 CI 成功但运行时仍命中 500。
- **回滚策略:** 若最小修复发布后仍失败，只回滚详情页相关图片迁移或触发异常的单一提交，不回滚整套图片角色体系。
