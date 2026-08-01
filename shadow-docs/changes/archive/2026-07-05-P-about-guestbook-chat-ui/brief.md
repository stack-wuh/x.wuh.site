# About 页面留言板群聊化改造

> 原始变更名：`2026-07-05-P-about-guestbook-chat-ui`

## 元数据
- 日期：2026-07-05
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
About 页面新增留言板后，原弹幕式入口和弹窗存在几类问题：
- 弹幕持续动画在弹窗内播放不够稳定，消息增多后容易卡顿。
- 弹幕布局不利于回看留言，也不符合“留言板”的长期阅读场景。
- 发送失败时前端只显示笼统状态，Next / Nest 侧缺少可定位日志。
- About 页面入口视觉像一个独立功能按钮，与页面中“最近日志”“足迹”等内容模块不协调。

## 引用规范
- `specs/guestbook-barrage/spec.md`

## 决策
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

## 任务
### Phase 1: 提案与设计
- [x] Task 1: 创建 OpenSpec 提案
- [x] Task 2: 记录技术设计
### Phase 2: 前端体验改造
- [x] Task 3: 将弹幕弹窗改为群聊式留言弹窗
- [x] Task 4: 发送后立即提交并展示消息状态
- [x] Task 5: 重设计 About 页面留言板入口
### Phase 3: API 与后端修复
- [x] Task 6: 新增 Next 留言代理 route
- [x] Task 7: 对齐 Nest 留言 DTO 与 schema
### Phase 4: 构建与校验
- [x] Task 8: 分离 Next dev / build 输出目录
- [x] Task 9: 执行验证
### Phase 5: Review 与归档
- [x] Task 10: 代码审查并处理阻塞项
- [x] Task 11: 归档 OpenSpec change

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: about-guestbook-chat-ui
date: 2026-07-05
type: P
status: applied
issue: local
```

### `design.md`
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

### `proposal.md`
# About 页面留言板群聊化改造

## 背景

About 页面新增留言板后，原弹幕式入口和弹窗存在几类问题：
- 弹幕持续动画在弹窗内播放不够稳定，消息增多后容易卡顿。
- 弹幕布局不利于回看留言，也不符合“留言板”的长期阅读场景。
- 发送失败时前端只显示笼统状态，Next / Nest 侧缺少可定位日志。
- About 页面入口视觉像一个独立功能按钮，与页面中“最近日志”“足迹”等内容模块不协调。

## 目标

- 将留言弹窗从弹幕式浏览改为类似微信群聊的消息流。
- 点击发送后立即提交留言，并在消息气泡内展示发送中、已发送、发送失败状态。
- 缓存用户昵称，后续进入时自动带出。
- 为 `/api/comments` 增加 Next Route Handler 代理，提交失败时输出服务端日志并返回可读错误。
- 对齐 Nest 留言 DTO / schema，使 `page` 字段与匿名 UUID 留言可正常保存。
- 重设计 About 页面留言板入口，使其成为 About 页自然的内容 section。
- 分离 Next dev / build 输出目录，避免生产 build 污染 dev CSS chunk。

## 非目标

- 不新增留言历史拉取与分页。
- 不实现失败消息重试按钮。
- 不修改 MongoDB 已有历史数据迁移脚本。
- 不调整 About 页面其他模块的信息架构。

## 影响范围

- `packages/wuh.site.next/app/about/AboutView.tsx`
- `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.js`
- `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.test.js`
- `packages/wuh.site.next/app/api/comments/route.ts`
- `packages/wuh.site.next/next.config.ts`
- `packages/wuh.site.next/tsconfig.json`
- `packages/wuh.site.nest/src/modules/comment/*`
- `packages/shared-contracts/src/index.ts`

### `specs/guestbook-barrage/spec.md`
# 留言板群聊弹窗

## MODIFIED: About 页面留言入口

### Requirement: About 页面留言板入口

#### Scenario: 用户从 About 页面进入留言板
- **GIVEN** 用户正在浏览 About 页面
- **WHEN** 用户看到“留言板”区块
- **THEN** 系统应展示一个与 About 页面视觉一致的留言入口
- **AND** 入口应使用聊天语义的头像、标题、预览文案和进入提示
- **AND** 用户点击入口后应打开居中的留言弹窗

## MODIFIED: 留言弹窗主体验

### Requirement: 群聊式留言弹窗

#### Scenario: 用户打开留言弹窗
- **GIVEN** 用户点击 About 页面留言入口
- **WHEN** 弹窗渲染完成
- **THEN** 系统应默认展示群聊式消息流
- **AND** 示例留言应以左侧气泡展示
- **AND** 用户新发送的留言应以右侧气泡展示
- **AND** 消息头像应使用昵称的第一个字符

## MODIFIED: 留言提交时机

### Requirement: 点击发送即提交

#### Scenario: 用户发送留言
- **GIVEN** 用户已输入至少 2 个字符昵称和至少 5 个字符内容
- **WHEN** 用户点击发送
- **THEN** 系统应立即在本地消息流展示该留言
- **AND** 系统应立即向 `/api/comments` 发起提交请求
- **AND** 发送中、已发送、发送失败状态应在消息气泡内可见
- **AND** 失败状态应展示可读错误信息

## MODIFIED: 用户昵称记忆

### Requirement: 缓存留言昵称

#### Scenario: 用户再次打开留言板
- **GIVEN** 用户曾经输入过昵称
- **WHEN** 用户再次打开留言弹窗
- **THEN** 系统应从本地缓存恢复昵称
- **AND** 用户仍可修改昵称

## MODIFIED: 留言 API 代理与错误日志

### Requirement: Next 留言代理

#### Scenario: 留言提交失败
- **GIVEN** Next 收到 `/api/comments` 提交请求
- **WHEN** Nest 上游返回错误或不可用
- **THEN** Next 应返回包含可读 `message` 的 JSON 响应
- **AND** Next 服务端应输出 `[guestbook]` 前缀的错误日志
- **AND** 前端应在消息气泡中展示该错误信息

## MODIFIED: 留言后端数据契约

### Requirement: 匿名留言字段对齐

#### Scenario: Nest 接收匿名留言
- **GIVEN** 前端提交昵称、内容和可选页面标识
- **WHEN** Nest 校验请求体
- **THEN** `page` 字段不应被白名单校验拒绝
- **AND** 匿名留言生成的 UUID externalId 应能保存到 MongoDB
- **AND** GitHub 同步的数字 externalId 查询应保持兼容

## MODIFIED: Next 构建输出隔离

### Requirement: dev 与 build 输出目录隔离

#### Scenario: 开发服务运行时误触发生产构建
- **GIVEN** Next dev server 正在运行
- **WHEN** 开发者执行生产构建命令
- **THEN** 生产构建不应污染 dev server 使用的静态资源输出目录
- **AND** 开发环境应使用 `dist/wuh.site.next-dev`
- **AND** 生产环境应使用 `dist/wuh.site.next`

### `tasks.md`
# 任务清单：About 页面留言板群聊化改造

## Phase 1: 提案与设计

- [x] Task 1: 创建 OpenSpec 提案
  - 文件: `openspec/changes/2026-07-05-P-about-guestbook-chat-ui/proposal.md`
  - 预估: 10min
  - 实际: 8min

- [x] Task 2: 记录技术设计
  - 文件: `openspec/changes/2026-07-05-P-about-guestbook-chat-ui/design.md`
  - 预估: 15min
  - 实际: 12min

## Phase 2: 前端体验改造

- [x] Task 3: 将弹幕弹窗改为群聊式留言弹窗
  - 文件: `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
  - 预估: 1h
  - 实际: 45min

- [x] Task 4: 发送后立即提交并展示消息状态
  - 文件: `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.js`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.test.js`
  - 预估: 45min
  - 实际: 35min

- [x] Task 5: 重设计 About 页面留言板入口
  - 文件: `packages/wuh.site.next/app/about/AboutView.tsx`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
  - 预估: 35min
  - 实际: 25min

## Phase 3: API 与后端修复

- [x] Task 6: 新增 Next 留言代理 route
  - 文件: `packages/wuh.site.next/app/api/comments/route.ts`
  - 预估: 30min
  - 实际: 20min

- [x] Task 7: 对齐 Nest 留言 DTO 与 schema
  - 文件: `packages/wuh.site.nest/src/modules/comment/dto/comment.dto.ts`
  - 文件: `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
  - 文件: `packages/wuh.site.nest/src/modules/comment/comment.service.ts`
  - 文件: `packages/shared-contracts/src/index.ts`
  - 预估: 30min
  - 实际: 20min

## Phase 4: 构建与校验

- [x] Task 8: 分离 Next dev / build 输出目录
  - 文件: `packages/wuh.site.next/next.config.ts`
  - 文件: `packages/wuh.site.next/tsconfig.json`
  - 预估: 20min
  - 实际: 15min

- [x] Task 9: 执行验证
  - 命令: `./node_modules/.bin/oxlint ...`
  - 命令: `./node_modules/.bin/nest build`（直接执行曾通过；最后复跑出现本地 SWC/Node 139 与卡住，已中断）
  - 命令: `node --test packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.test.js`
  - 预估: 20min
  - 实际: 15min

## Phase 5: Review 与归档

- [x] Task 10: 代码审查并处理阻塞项
  - 检查: 需求覆盖、设计一致性、lint、构建、错误可观测性
  - 预估: 20min
  - 实际: 15min

- [x] Task 11: 归档 OpenSpec change
  - 文件: `openspec/specs/guestbook-barrage/spec.md`
  - 文件: `openspec/changes/archive/2026-07-05-P-about-guestbook-chat-ui/`
  - 预估: 15min
  - 实际: 10min
