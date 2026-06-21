# 设计文档

## 架构

4 个 section 纵向排列，关于我区块内嵌左侧装饰时间线：

```
Hero → 关于我(合并) → 热力图 → 时间线
```

## 配色

沿用 `data-theme='plain'` 色板，不引入新变量：
- 主色：`--primary-color: #A87348`
- 背景：`--background-color: #F2EDE4`
- 强调：`--accent-color: #C89060`

## 排版

| 层级 | 字体 | 字重 | 字号 |
|------|------|------|------|
| Hero 标签 | `--font-sans` | 400 | 12px, letter-spacing: 3px |
| Hero 标题 | `--font-serif` | 700 | 28px |
| Hero 副标题 | `--font-sans` | 400 | 14px |
| Section 标签 | `--font-sans` | 500 | 11px, letter-spacing: 1.5px |
| 正文 | `--font-serif` | 400 | 15px, line-height: 1.9 |
| 标签/元数据 | `--font-sans` | 400 | 11px |
| 时间线条目 | `--font-sans` | 400 | 13px |

间距：Hero → 48px，Section 间 → 40px，装饰线 → 左 24px，卡片 padding → 16px

## 组件

### Hero
左对齐，无装饰。"ABOUT" 标签 → 标题 → 副标题。去掉原有 3 个指标。

### 关于我（合并）
左侧装饰时间线（2px 竖线 + 3 个圆点），右侧自上而下：
1. 个人（头像 + 名字 + 简介 + 标签）
2. 平台（3 个横向卡片，浅暖色背景 + 8px 圆角）
3. 联系（图标行，24px 间距）
4. 指标（数值 + 标签，顶部分隔线）

### 热力图
Section 标题 + 筛选器 ChipButton + 方格矩阵 + 图例。桌面 7 列，移动端横向滚动。

### 时间线
Section 标题 + 时间范围下拉 + 日期-标题行。日期左置 48px，右对齐。hover 左移 + 高亮。

## 响应式

| 断点 | 行为 |
|------|------|
| >= 768px | 完整布局，装饰线可见，平台卡片横向，max-width: 640px |
| < 768px | 装饰线 hidden，平台卡片纵向堆叠，热力图横向滚动，padding 缩小 |

## 接口兼容性

- 路由不变：`/about`
- 数据源不变：仍从 `data.ts` 硬编码读取
- layout.tsx 不变：metadata 保持不变
