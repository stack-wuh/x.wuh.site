# 技术方案

## 布局

- 流动阅读线风格，column flex，gap 36px
- prev card 全宽左对齐，next card 56% 右对齐
- 流动线：竖线 + 圆点
- 位置指示器 + 返回按钮居中排列

## 后端

- `findAdjacentPosts` 新增 `total` 和 `position` 返回
- 通过 countDocuments 并行查询
