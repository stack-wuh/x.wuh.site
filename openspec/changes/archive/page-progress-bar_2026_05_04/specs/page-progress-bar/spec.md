# Spec: page-progress-bar

## ADDED

### Requirement: 导航进度反馈

GIVEN 用户点击 Link 或调用 router.push
WHEN 路由切换开始
THEN 页面顶部显示 3px 进度条
AND 进度条颜色跟随当前主题 `--primary-color`
AND 导航完成后进度条消失

### Requirement: 快速导航不闪烁

GIVEN 导航在 80ms 内完成
WHEN 进度条 delay 机制生效
THEN 不显示进度条

### Requirement: shallow 路由不触发

GIVEN 仅 searchParams/query 参数变化
WHEN pathname 未变化
THEN 不显示进度条
