# 设计：酒红/素雅双主题

## 主题定义

### 酒红（money，默认 `:root`）
- 主色色阶：暖红系 #C94A44（500）/ #A13531（600 hover）
- 文本色系：暖灰（#FFFDFD ~ #1F1F1F）
- 背景色系：暖红粉棕（#FFF3F0 ~ #7B5A5A）
- 辅助色 accent：金色 #E3B567
- 页面背景：径向渐变叠加暖红色调

### 素雅（plain，`:root[data-theme='plain']`）
- 主色色阶：陶土赭 #C89060（500）/ #A87348（600）
- 文本色系：深棕墨迹（#FDFCFA ~ #2A2218）
- 背景色系：象牙白纸色（#FFFDF9 ~ #F2EDE4）
- 辅助色 accent：#C89060
- 页面背景：线性渐变淡纸色

## 切换机制
- ThemeModeProvider 管理 mode 状态（localStorage 持久化）
- `document.documentElement.dataset.theme = mode`
- 纯 CSS 属性选择器 `:root[data-theme='plain']` 覆盖默认变量
- 不依赖 React re-render，浏览器原生 CSS 级联处理
