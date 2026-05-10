# 设计：Footer 组件响应式优化

## 方案

在 `footer.tsx` 中新增一个 `StyledFooter` 包装组件，使用 `styled-components` 的媒体查询，在 768px 以下切换为垂直堆叠布局。不修改共享 Flex 组件。

### 桌面端（> 768px）

保持现有布局不变：

```
[Logo | Slogan+Copyright]  ← space-between →  [标题+Marked | ICP+公安]
```

使用 `SpaceBetween` + 两个 `Row` + 四个 `Column`。

### 移动端（≤ 768px）

```
[Logo（缩小, 居中）]
[Slogan + Copyright（居中）]
[标题 + Marked（居中）]
[ICP + 公安备案（居中）]
```

垂直堆叠，内容居中，减小间距。

## 实现方式

```tsx
const StyledFooter = styled.div`
  @media (max-width: 768px) {
    .footer-wrapper {
      flex-direction: column;
      align-items: center;
    }
    /* 缩小间距和文字 */
  }
`
```

## 断点选择

选择 **768px** 作为移动端断点：
- 与 SiteHeader 的断点一致，保持项目风格统一
- Footer 4 列布局在 768px 以下确实难以舒适展示
- Dialog/Result 等小组件用 640px 是因为它们只有 2 列或更简单的结构

## 依赖

- `styled-components`（项目已有依赖）
- 不需要新增任何 npm 包
