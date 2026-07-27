# 留言板群聊弹窗

## Requirements

### Requirement: About 页面留言板入口

About 页面必须提供视觉一致、可读且可自然进入留言弹窗的入口。

#### Scenario: 用户从 About 页面进入留言板
- **GIVEN** 用户正在浏览 About 页面
- **WHEN** 用户看到或操作“留言板”区块
- **THEN** 系统应展示一个与 About 页面视觉一致且文字清晰可读的留言入口
- **AND** 入口应使用聊天语义的头像、标题、预览文案和进入提示
- **AND** 指针悬停和键盘聚焦状态应使用自然、同步的渐进反馈
- **AND** 用户点击入口后应打开居中的留言弹窗

### Requirement: 留言板入口 Hover 保持文字可读

留言板入口的交互状态必须使用当前站点主题色，并保持纸张风格与文字可读性。

#### Scenario: 用户悬停或聚焦留言板入口
- **GIVEN** 用户在 About 页面看到留言板入口
- **WHEN** 指针悬停在入口上，或入口获得 `focus-visible`
- **THEN** 入口以 `--background-100` 为纸张基底，并以 `--primary-color` 从左向右自然衰减形成单向主题雾化渐变
- **AND** 默认状态与交互状态均直接跟随当前 `data-theme-family` 和 `data-color-scheme`
- **AND** 背景渐变不使用固定 `--accent-color` 作为主色
- **AND** 标题、预览文案和 CTA 在亮色与暗色主题下保持清晰可读
- **AND** 入口不使用位移、缩放或强阴影反馈

### Requirement: 留言板入口状态同步渐进

留言板入口的主题渐变、边框与文字反馈必须使用一致且自然的过渡节奏。

#### Scenario: 入口状态发生变化
- **GIVEN** 留言板入口正在进入或离开 Hover / `focus-visible` 状态
- **WHEN** 主题渐变、边框和文字状态发生变化
- **THEN** 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡
- **AND** Hover / Focus 仅适度增强主题色浓度与衰减范围，不改变渐变方向
- **AND** 左侧强调线、交互边框和 CTA 使用当前 `--primary-color`
- **AND** 各视觉元素不会出现不同步跳变或布局偏移

### Requirement: 留言板入口尊重减少动态偏好

留言板入口必须在减少动态模式下提供无动画但完整的状态反馈。

#### Scenario: 用户启用减少动态偏好
- **GIVEN** 用户启用了 `prefers-reduced-motion: reduce`
- **WHEN** 留言板入口进入或离开 Hover / `focus-visible` 状态
- **THEN** 入口取消渐进动画并直接呈现目标状态
- **AND** 文字可读性、背景反馈和焦点轮廓仍然保留

### Requirement: 群聊式留言弹窗

#### Scenario: 用户打开留言弹窗
- **GIVEN** 用户点击 About 页面留言入口
- **WHEN** 弹窗渲染完成
- **THEN** 系统应默认展示群聊式消息流
- **AND** 示例留言应以左侧气泡展示
- **AND** 用户新发送的留言应以右侧气泡展示
- **AND** 消息头像应使用昵称的第一个字符

### Requirement: 输入框字数限制

#### Scenario: 用户输入留言内容
- **GIVEN** 用户正在弹窗底部输入留言
- **WHEN** 输入内容长度达到 100 个字符
- **THEN** 输入框应停止继续增长
- **AND** 系统应保证不会提交超过 100 个字符的内容
- **AND** 页面应清晰展示字数状态

### Requirement: 点击发送即提交

#### Scenario: 用户发送留言
- **GIVEN** 用户已输入至少 2 个字符昵称和至少 5 个字符内容
- **WHEN** 用户点击发送
- **THEN** 系统应立即在本地消息流展示该留言
- **AND** 系统应立即向 `/api/comments` 发起提交请求
- **AND** 发送中、已发送、发送失败状态应在消息气泡内可见
- **AND** 失败状态应展示可读错误信息

### Requirement: 缓存留言昵称

#### Scenario: 用户再次打开留言板
- **GIVEN** 用户曾经输入过昵称
- **WHEN** 用户再次打开留言弹窗
- **THEN** 系统应从本地缓存恢复昵称
- **AND** 用户仍可修改昵称

### Requirement: Next 留言代理

#### Scenario: 留言提交失败
- **GIVEN** Next 收到 `/api/comments` 提交请求
- **WHEN** Nest 上游返回错误或不可用
- **THEN** Next 应返回包含可读 `message` 的 JSON 响应
- **AND** Next 服务端应输出 `[guestbook]` 前缀的错误日志
- **AND** 前端应在消息气泡中展示该错误信息

### Requirement: 匿名留言字段对齐

#### Scenario: Nest 接收匿名留言
- **GIVEN** 前端提交昵称、内容和可选页面标识
- **WHEN** Nest 校验请求体
- **THEN** `page` 字段不应被白名单校验拒绝
- **AND** 匿名留言生成的 UUID externalId 应能保存到 MongoDB
- **AND** GitHub 同步的数字 externalId 查询应保持兼容

### Requirement: dev 与 build 输出目录隔离

#### Scenario: 开发服务运行时误触发生产构建
- **GIVEN** Next dev server 正在运行
- **WHEN** 开发者执行生产构建命令
- **THEN** 生产构建不应污染 dev server 使用的静态资源输出目录
- **AND** 开发环境应使用 `dist/wuh.site.next-dev`
- **AND** 生产环境应使用 `dist/wuh.site.next`

 留言板 Dialog 头部优化

### Requirement: Dialog Header 展示 subtitle

#### Scenario: 用户打开留言弹窗
- **GIVEN** 用户打开留言板弹窗
- **WHEN** Dialog 渲染完成
- **THEN** header 应展示标题 "留言板"
- **AND** header 标题下方应展示副文本 "声无哀乐"
- **AND** 副文本应使用小字号和 muted 颜色

### Requirement: Dialog Body 顶部引导短语

#### Scenario: 用户打开留言弹窗
- **GIVEN** 用户打开留言板弹窗
- **WHEN** DialogBody 渲染完成
- **THEN** 消息流上方应展示引导短语 "萍水楚客，路远情长"
- **AND** 引导短语不应与真实留言混淆（不同气泡样式或位置）

### Requirement: subtitle 向后兼容

#### Scenario: Dialog 未传 subtitle
- **GIVEN** 其他页面调用 Dialog 组件
- **WHEN** 未传入 subtitle prop
- **THEN** header 仅渲染标题，行为完全不变
- **AND** 不渲染额外 DOM 节点
