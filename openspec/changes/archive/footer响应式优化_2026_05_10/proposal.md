# Footer 组件响应式优化

## 为什么做

Footer 组件目前完全没有响应式设计。桌面端 4 列并排的布局（Logo | Slogan | 标题 | 备案号）在移动端仍然保持一行显示，导致内容拥挤、文字换行混乱、阅读体验差。小屏设备占据过高的屏幕比例，视觉上沉重而不优雅。

## 做什么

- 给 Footer 添加 `styled-components` 媒体查询，以 768px 为移动端断点
- 移动端下改为垂直堆叠布局，内容区块从上到下排列
- 减小移动端内边距和区块间距
- 内容居中对齐，Logo 适当缩小

## 影响范围

- `packages/components/layout/footer.tsx` — 添加 Wrapper 和响应式样式

## 不改什么

- 不修改 `flex/index.tsx`（Flex 组件是共享组件，修改影响面太大）
- 不改变桌面端 Footer 的外观和行为
- 不修改 `app/layout.tsx`（Footer 使用方式不变）
- 不添加 Footer 配置数据结构中的字段
