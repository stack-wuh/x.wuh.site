# 留言板群聊弹窗

## MODIFIED: 留言板 Dialog 头部优化

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
