# 首页打字动画标语

## 动机

首页 Motto blockquote 静态显示"写作是抵抗遗忘的方式，代码是构建世界的语言"，缺乏互动感。改为打字机动画，Sequential 循环播放两句标语，配合粒子+光晕效果，增强视觉吸引力。

## 变更范围

- 新建 TypewriterMotto 组件：打字/停顿/回删/切换 4 态状态机
- 第二句标语："不要停步不前，每一天都要做出改变"
- 视觉效果：打字光标闪烁 + 字符出现溅出粒子 + 光标附近 glow 光晕
- 替换 HomeView 中的 `<S.Motto>` 静态标签

## 非目标

- 不改变 Motto 区域在页面中的位置和布局
- 不修改其他页面

## 影响

- 前端: HomeView.tsx, styles/index.ts
- 新增: app/components/TypewriterMotto/
