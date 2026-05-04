# Spec: About 重设计

## 改动文件

`packages/wuh.site.next/app/about/page.tsx`

## 验收标准

### 视觉
- [ ] Hero 无卡片包裹，内容居中在页面背景上
- [ ] 仅首尾有 OrnamentDivider，中间 Section 无分隔装饰
- [ ] 仅 Contact 使用纸张风卡片
- [ ] 最近日志为按日期聚合的单行时间线
- [ ] 平台概况为轻量条目（无 Card 包裹）

### 技术
- [ ] TypeScript 类型检查通过
- [ ] 暗色/亮色模式正常

### 回归
- [ ] 其他页面样式不受影响
