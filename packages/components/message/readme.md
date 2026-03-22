## Message 全局提示

Ant Design 风格的轻量提示，用于替代 `window.alert`。

### 快速使用

```tsx
import message from '@wuh.site/components/message'

message.success('保存成功')
message.error('提交失败，请重试')
message.loading('加载中...', 0)
```

### 配置与自定义

```tsx
message.config({
  placement: 'topRight',
  duration: 3,
  maxCount: 5,
  top: 24,
  bottom: 24,
  side: 24,
})

message.open({
  type: 'warning',
  content: '请填写必填项',
  duration: 4,
  closable: true,
  placement: 'bottomRight',
})
```

### API

- `message.open(options)`
- `message.success(content, duration?, onClose?)`
- `message.info(content, duration?, onClose?)`
- `message.warning(content, duration?, onClose?)`
- `message.error(content, duration?, onClose?)`
- `message.loading(content, duration?, onClose?)`
- `message.config(config)`
- `message.destroy(key?)`

### Options

- `content: ReactNode`
- `type?: 'info' | 'success' | 'warning' | 'error' | 'loading'`
- `duration?: number`（秒，`0` 表示常驻）
- `closable?: boolean`
- `placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'`
- `key?: string | number`
- `icon?: ReactNode`
- `onClose?: () => void`

### Config

- `duration?: number`（默认 3s）
- `placement?: MessagePlacement`（默认 `top`）
- `maxCount?: number`（默认 5）
- `top?: number`（默认 24）
- `bottom?: number`（默认 24）
- `side?: number`（默认 24）
