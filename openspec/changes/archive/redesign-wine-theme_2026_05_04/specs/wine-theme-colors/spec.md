# Spec: wine-theme-colors

## CHANGED

### Requirement: 酒红主题浅色背景

GIVEN 用户以酒红主题（默认）访问网站
WHEN 页面渲染完成
THEN `--background-color` 为浅暖米色（#F5F0EC）
AND `--text-primary` 在背景上对比度 >= 10:1
AND `--text-secondary` 在背景上对比度 >= 4:1
AND `--text-muted` 在背景上对比度 >= 2.5:1

### Requirement: 酒红主题色彩一致性

GIVEN 酒红主题
WHEN 查看首页 Hero/格言/博客列表/项目列表
THEN 主色保持 #C94A44（酒红）
AND 辅助色保持 #E3B567（金）
AND 页面背景为干净的线性渐变，无径向渐变干扰
AND 文本清晰可读

### Requirement: 不影响素雅主题

GIVEN 用户切换到素雅主题
WHEN 页面重新渲染
THEN 素雅主题（纸张风）的颜色、背景、文本完全不受影响
AND `:root[data-theme='plain']` CSS 规则保持不变
