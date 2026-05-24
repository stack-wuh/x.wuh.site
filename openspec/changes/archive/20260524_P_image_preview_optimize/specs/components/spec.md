# Components — ImagePreview

## MODIFIED

### Requirement: 图片切换有过渡动画
- **GIVEN** 用户在预览中切换到上一张或下一张图片
- **WHEN** 图片 src 发生变化
- **THEN** 旧图淡出并向切换反方向滑动，新图淡入并从切换方向滑入，过渡时长约 300ms

### Requirement: 缩放有弹性动画
- **GIVEN** 用户点击放大或缩小按钮
- **WHEN** zoom 值发生变化
- **THEN** 图片以 spring 动画过渡到新缩放级别

### Requirement: 旋转有过渡动画
- **GIVEN** 用户点击旋转按钮
- **WHEN** rotation 值变化
- **THEN** 图片平滑旋转到新角度

### Requirement: 组件代码按职责拆分
- **GIVEN** ImagePreview 组件文件
- **WHEN** 开发者查看代码
- **THEN** types、hooks、Toolbar、MoreMenu、ThumbnailRail 各自独立文件，主组件不超过 500 行
