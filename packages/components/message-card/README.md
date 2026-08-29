# MessageCard

信笺风留言组件集：奶油纸底便笺卡片、圆形纸底头像、衬线斜体昵称、琥珀时间戳、状态小字。

- 全部走主题 token，四主题（wine/plain × light/dark）自动适配
- 只负责「长什么样」，「怎么摆」（行对齐、间距）由消费方组合
- 参考 shadcn-chat Message 的结构（头像 + 信息行 + 内容卡片）

## 用法

```tsx
import { MessageCard, MessageAvatar, MessageMeta, MessageName, MessageTime, MessageStatus, MessageContent } from '@wuh.site/components/message-card'

// 他人留言
<MessageCard>
  <MessageMeta>
    <MessageName>远方的朋友</MessageName>
    <MessageTime>12:20</MessageTime>
  </MessageMeta>
  <MessageContent>这个聊天式留言板比弹幕更容易回看。</MessageContent>
</MessageCard>

// 自己的留言：镜像斜切圆角 + 主色浅染，信息行右对齐
<MessageCard $mine>
  <MessageMeta align='end'>
    <MessageName>吴尒红</MessageName>
    <MessageTime>12:34</MessageTime>
    <MessageStatus>已发送</MessageStatus>
  </MessageMeta>
  <MessageContent>来这里打个招呼，顺便看看最近在折腾什么。</MessageContent>
</MessageCard>
```

## 组成

| 组件 | 说明 |
|------|------|
| `MessageCard` | 便笺卡片容器，`$mine` 变体（镜像圆角 + 主色浅染） |
| `MessageAvatar` | 圆形纸底头像，内容传昵称首字 |
| `MessageMeta` | 信息行容器，`align='end'` 右对齐 |
| `MessageName` | 衬线斜体昵称 |
| `MessageTime` | 琥珀色时间戳 |
| `MessageStatus` | 状态小字，`$tone='error'` 主色调 |
| `MessageContent` | 正文段落 |
