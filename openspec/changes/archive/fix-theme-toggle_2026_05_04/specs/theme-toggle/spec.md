# Spec: theme-toggle

## FIXED

### Requirement: 酒红主题色系

默认 `:root` 必须使用酒红色系（非纸张风）。

GIVEN 用户访问网站（默认主题为 money）
WHEN 页面渲染完成
THEN `--primary-color` 值为 #C94A44（暖红）
AND `--accent-color` 值为 #E3B567（金）
AND `--background-color` 为暖棕色调
AND 页面背景使用径向渐变叠加暖红色

### Requirement: 素雅主题色系

`:root[data-theme='plain']` 使用纸张风色系。

GIVEN 用户点击主题按钮切换到素雅
WHEN `document.documentElement.dataset.theme` 变为 'plain'
THEN `--primary-color` 值为 #C89060（陶土赭）
AND `--accent-color` 值为 #C89060
AND `--background-color` 为象牙白纸色
AND 页面背景为线性渐变淡纸色

### Requirement: 两套主题有明显视觉差异

GIVEN 用户在同一设备上
WHEN 在酒红和素雅之间切换
THEN 页面色系从暖红/金变为象牙白/陶土赭
AND 变化肉眼可见

### Requirement: 主题切换不影响 dark mode 分支

GIVEN 系统处于 dark 主题
WHEN 用户在酒红和素雅之间切换
THEN 两套主题在 dark mode 下各自有明显差异
AND `@media (prefers-color-scheme: dark)` 规则正确生效
