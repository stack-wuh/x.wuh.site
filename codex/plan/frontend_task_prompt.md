# Frontend Task Prompt Inputs

按下列小节补充内容；若暂缺信息，可写 `TBD` 或 `假设:` 前缀说明。

## 任务背景 / Background
新增展示组件Tag, 用来展示博客项目中的标签。
在文件`/Users/wuhong/shadow-desktop/github/x.wuh.site/packages/wuh.site.next/app/HomeView.tsx`中， `CardHeader`组件的标签部分，替换为新增的Tag组件，要求以github中的标签色彩保持一致。

博客数据全部来自于github，标签数据来自于github，标签数据的获取方式为：
1. 获取博客数据，获取标签数据
2. 将标签数据转换为数组，数组元素为标签名称
3. 替换为Tag组件


## 目标与范围 / Goals
- 必须完成:
  1. 完成组件的UI设计与开发, 组件样式必须使用现有项目的样式处理方案,注意响应式设计
- 可选增强：
  1. 色彩与字体大小与github保持一致
- 不在范围:
  1. 标签的排序与github保持一致
  2. 标签的点击事件与github保持一致
  3. 标签的删除与github保持一致
  4. 标签的编辑与github保持一致

## 交互与设计 / UX
1. 鼠标悬停时有动画交互, 字体放大一个字号, 字色与背景色互换

## 技术栈约束 / Tech Stack
1. 必须使用相同技术栈
3. 必须接入现有的项目的样式处理方案, 支持light/dark模式互换
## 数据与接口 / Data
1. 保持不变
## 状态与权限 / State & Auth
1. 无
## 可观测性 / Observability
1. 无
## 开发步骤建议 / Execution Order

## 交付物 / Deliverables

## 校验标准 / Validation

## 依赖与风险 / Dependencies & Risks

## 沟通约定 / Communication

## Pending Input

## Assumptions
