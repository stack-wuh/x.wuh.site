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
