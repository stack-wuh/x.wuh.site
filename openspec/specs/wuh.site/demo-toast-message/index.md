---
component: Message
keywords:
  - Message
  - message
  - 消息
  - toast
  - 吐司
  - notification
  - 通知
  - snackbar
  - info
  - success
  - 成功
  - warning
  - 警告
  - error
  - 错误
  - loading
  - 加载中
  - placement
  - top
  - bottom
  - 顶部
  - 底部
  - duration
  - 时长
  - global
  - 全局
  - portal
  - prompt
  - 提示
related: [demo-dialog-confirm]
hooks: []
---

## 全局消息提示

操作成功/失败/加载中的非侵入式全局提示。支持 6 种 placement，自动消失。

Message 是命令式 API，不返回 JSX 组件，直接调用函数即可。

### 使用方式

```tsx
import message from '@wuh.site/components/message'

message.success('操作成功')
message.error('操作失败')
message.info('这是一条提示')
message.warning('注意')
message.loading('加载中...')
```

### API

| 方法 | 说明 |
| --- | --- |
| `message.info(content, duration?, onClose?)` | 普通提示 |
| `message.success(content, duration?, onClose?)` | 成功提示 |
| `message.warning(content, duration?, onClose?)` | 警告提示 |
| `message.error(content, duration?, onClose?)` | 错误提示 |
| `message.loading(content)` | 加载中（duration=0 不自动消失） |
| `message.config({ duration, placement, maxCount })` | 全局配置 |
| `message.destroy(key?)` | 手动销毁 |

### 注意事项

- loading 类型 duration 默认为 0，需手动调用 `message.destroy()` 关闭
- `duration` 单位秒，默认 3
- 调用 `message.destroy()` 不传参时销毁所有消息
