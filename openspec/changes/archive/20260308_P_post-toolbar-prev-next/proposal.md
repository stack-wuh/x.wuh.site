# 博客详情页上下篇导航

## 为什么做

博客详情页底部 Toolbar 当前是"返回首页"和"在 GitHub 查看"按钮，缺少文章之间的导航。需要改为上下篇导航，让读者可以连续阅读。

## 做什么

- 删除底部 Toolbar 的"返回首页"和"在 GitHub 查看"按钮
- 左侧按钮改为 prevIcon + 上一条 issue 标题
- 右侧按钮改为 nextIcon + 下一条 issue 标题
- 上一条/下一条不存在时按钮不可点击，文案显示"空空如也"
- 单行展示，超出显示省略号
- 保持单行双按钮左右两端对齐布局

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 按钮重构
- `packages/wuh.site.next/app/post/[number]/page.tsx` — 邻接数据获取
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式更新
