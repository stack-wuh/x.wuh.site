# 设计文档

## 架构

详情页在服务端准备 `PostView` 所需的 `Issue` 数据。正文 HTML 统一通过 `ensureRenderedBody` 处理：

```text
内容 API
   |
   v
mapContentToIssue
   |
   v
ensureRenderedBody
   |-- body 非空 ------> renderMarkdown
   |                         |-- rehypeSlug 生成标题 id
   |                         `-- rehypeAutolinkHeadings 生成锚点
   `-- body 为空 ------> 有效 body_html 回退
              |
              v
           PostView
              |
              v
           useToc
              |
              v
       桌面/移动目录
```

`PostView`、`useToc`、`useHeadingObserver` 和目录样式保持现有职责与接口不变。修复点位于服务端正文数据准备层，避免在客户端为缺少 `id` 的 HTML 额外补丁。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 正文来源 | `body` 优先，`body_html` 回退 | 统一经过现有 Markdown renderer，确保标题 id 与锚点一致，同时兼容 body 缺失的数据 |
| 标题锚点 | 复用 `rehypeSlug` 与 `rehypeAutolinkHeadings` | 项目已有实现，无新增依赖，目录与正文共享同一 HTML |
| 回归验证 | Node 原生回归测试 + 现有 lint/typecheck | 与详情页现有测试风格一致，覆盖实现约束与工程门禁 |

## 数据模型（如涉及）

不涉及 API、DTO、Schema 或数据库模型变更。`Issue.body`、`Issue.body_html` 的现有类型和接口保持不变。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### `ensureRenderedBody`

位于 `app/post/[number]/page.tsx` 的服务端数据准备层。行为调整为：

1. `issue.body` 非空时调用 `renderMarkdown(issue.body)`。
2. `issue.body` 为空但 `issue.body_html` 非空时返回已有 HTML。
3. 两者均为空时抛出明确错误，保持现有错误处理语义。

### `useToc` 与目录渲染

保持现有实现不变。由于输入 HTML 的标题由统一 renderer 生成并具有 `id`，现有 `useToc` 可同时驱动 `TocMobile` 和 `TocAside` 渲染。

## 响应式策略（如涉及）

不调整现有响应式策略：

| 断点 | 行为 |
|------|------|
| >= 1024px | 显示桌面端 `TocAside` |
| < 1024px | 使用现有移动端 `TocMobile` |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无 API 和数据模型变更
- **向后兼容:** `body` 非空的文章统一生成规范 HTML；仅有有效 `body_html` 的内容继续可展示
- **性能影响:** 详情页已有服务端 Markdown renderer；目录客户端解析逻辑不变，预计无额外显著开销
