# Design System

## ADDED: TypewriterMotto 打字动画

### Requirement: 首页标语打字动画
- **GIVEN** 用户访问首页
- **WHEN** Motto 区域渲染
- **THEN** 标语以打字机效果逐字显示，尾部有闪烁光标
- **AND** 每个字符出现时溅出 2-3 个粒子光点
- **AND** 光标附近有 glow 模糊光晕
- **AND** 第一句打完停顿 3.5s 后逐字回删
- **AND** 回删完成后切换为第二句继续打字
- **AND** 两句循环播放："写作是抵抗遗忘的方式，代码是构建世界的语言。" / "不要停步不前，每一天都要做出改变。"

## MODIFIED: HomeView Motto 区域

### Requirement: Motto 替换为 TypewriterMotto
- **GIVEN** HomeView 渲染
- **WHEN** Motto 区域位置
- **THEN** 显示 TypewriterMotto 动态组件代替旧 `<S.Motto>` 静态 blockquote
- **AND** 动态导入加载时显示 MottoSkeleton 占位
