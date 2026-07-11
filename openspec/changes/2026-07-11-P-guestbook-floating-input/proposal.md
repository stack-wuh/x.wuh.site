# 留言板输入区改为 Telegram 风格浮动条

## 背景

About 页面留言板弹窗底部输入区存在以下问题：

1. 输入区布局占两行（昵称单独一行 + 内容输入一行），不够紧凑
2. 输入框采用独立卡片式背景，与聊天面板视觉割裂
3. 输入框和发送按钮未整合为整体，操作效率低
4. 昵称编辑入口在输入区外，改昵称不直观

## 目标

- 输入区改为单行浮动条，margin 负值重叠聊天面板底部
- 发送按钮改为圆形图标按钮，嵌入浮动条最右侧
- 昵称以首字母徽标形式展示在浮动条左侧，点击切换为内联编辑
- 暗色模式跟随站点 `data-color-scheme`

## 非目标（明确不做）

- 不修改留言板后端接口和数据模型
- 不影响弹窗 trigger 样式
- 不涉及语言国际化

## 影响范围

- `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx` — 移除 GuestbookBody/Panel 包装层，新增编辑昵称状态和徽标组件
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 重写 Composer 全部样式，新增浮动条、圆按钮、昵称徽标组件
