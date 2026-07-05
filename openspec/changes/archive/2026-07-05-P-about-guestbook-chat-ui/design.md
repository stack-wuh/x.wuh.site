# 设计：About 页面留言板群聊化改造

## 1. 入口 UI

About 页面保留窄栏内容结构，留言板作为独立 section 出现在“足迹”之后：
- 由页面提供 `SectionHeader + SectionLabel`，与现有模块保持一致。
- 入口卡片使用 8px 圆角、细边框、左侧 accent 线，降低工具按钮感。
- 左侧使用叠放昵称头像，暗示群聊语境。
- 主体文案说明“给我留一句话”，右侧提供轻量 `进入` CTA。

## 2. 弹窗交互

弹窗主区从弹幕轨道改为聊天消息流：
- 示例消息使用左侧气泡。
- 用户提交的新消息使用右侧气泡。
- 头像使用昵称首字符。
- 消息区自动滚动到底部。
- 输入区包含昵称、内容、字数和提交按钮。

## 3. 提交流程

点击发送后立即创建本地消息并发起请求：
1. 前端校验昵称至少 2 个字符，内容至少 5 个字符，内容最多 100 个字符。
2. 本地消息状态先置为 `sending`。
3. `POST /api/comments` 由 Next Route Handler 代理到 Nest `/v2/comments`。
4. 成功后消息状态改为 `sent`。
5. 失败后消息状态改为 `failed`，并展示后端或代理返回的错误文案。

## 4. API 对齐

### Next Route Handler

路径：`POST /api/comments`

职责：
- 解析前端 JSON 请求。
- 转发到 `NEST_API_URL/comments`。
- 上游失败时输出 `[guestbook] ...` 日志。
- 将上游错误 JSON 或纯文本错误转换为前端可读响应。

### Nest 留言接口

路径：`POST /v2/comments`

调整：
- `CreateAnonymousCommentDto` 增加可选 `page?: string`。
- `Comment.externalId` 支持匿名留言 UUID，以字符串写入 MongoDB。
- `CommentService.findByExternalId` 接受 `string | number`，兼容 GitHub 同步数字 ID。

## 5. 构建输出隔离

Next 配置按环境拆分输出目录：
- production: `dist/wuh.site.next`
- development: `dist/wuh.site.next-dev`

这样可以避免开发服务运行时误跑 `next build` 后污染 dev CSS chunk。

## 风险与后续

- `externalId` schema 从 Number 改为 String 后，Mongoose 查询数字 ID 会被 cast 为字符串；历史数字值如果以 Number 形式存在，需要在后续数据迁移中统一。
- 当前只实现本地会话内消息展示，不拉取数据库历史留言。
- 当前失败消息只展示错误，不支持一键重试。
