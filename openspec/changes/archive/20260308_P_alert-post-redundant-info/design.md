# 设计：Alert 组件与博客冗余信息

## 方案

### 1. Alert 组件 API

```ts
interface AlertProps {
  children: React.ReactNode
  type?: 'info' | 'success' | 'warning' | 'error'
  icon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
}
```

### 2. 博客详情页布局

**Meta Card**:
- 5 个字段，每个 label: value 结构，Icon 前置
- 更新时间: 由 {github.userName} 于 yyyy-MM-dd HH:MM:SS 更新
- 原文链接: GitHub Issue 链接（去域名）
- 所属项目: Project 链接
- 开源许可: 许可说明
- 所属标签: 标签列表
- 单行展示，不换行（white-space: nowrap + text-overflow: ellipsis）
- Icon hover 绕中心旋转 360 度

**Share Card**:
- 独立的 Card 包裹 SharedLinkGroup

### 3. 样式

- 使用 styled-components + CSS 变量
- Meta Card 与 Share Card 独立卡片，放在正文下方
- 响应式: 移动端字段可能折断，需调整最小宽度
