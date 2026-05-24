# Components — 组件包

## MODIFIED

### Requirement: 组件包使用 exports map 导出
- **GIVEN** 消费者导入 `@wuh.site/components/flex`
- **WHEN** 构建工具解析模块路径
- **THEN** 通过 `exports` map 直接映射到对应子路径，无需桶文件

### Requirement: 图片切换有过渡动画
- **GIVEN** 用户在 ImagePreview 中切换到上一张或下一张
- **WHEN** 图片 src 发生变化
- **THEN** 旧图淡出并向切换反方向滑动，新图淡入并从切换方向滑入

### Requirement: 缩放和旋转有弹性动画
- **GIVEN** 用户点击缩放或旋转按钮
- **WHEN** zoom 或 rotation 值变化
- **THEN** 图片以 spring 动画过渡到新状态

### Requirement: ImagePreview 组件代码按职责拆分
- **GIVEN** ImagePreview 组件文件
- **WHEN** 开发者查看代码
- **THEN** types、hooks、Toolbar、MoreMenu、ThumbnailRail 各自独立文件，主组件不超过 500 行
