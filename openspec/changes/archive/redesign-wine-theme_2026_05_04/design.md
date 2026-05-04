# 设计：酒红主题浅底深字方案

## 配色对比

### 改前（暗底深字，对比度低）

| 变量 | 值 | 对比度(对背景) |
|------|-----|---------------|
| background | #7B5A5A | — |
| text-primary | #1F1F1F | 2.2:1 ❌ |
| text-secondary | #8A7A7A | 1.4:1 ❌ |
| text-muted | #A19090 | 1.3:1 ❌ |

### 改后（浅底深字，对比度高）

| 变量 | 值 | 对比度(对背景) |
|------|-----|---------------|
| background | #F5F0EC | — |
| text-primary | #2A1E16 | 15:1 ✅ |
| text-secondary | #8A6E5C | 4.2:1 ✅ |
| text-muted | #A08878 | 2.8:1 ✅ |

## 新色阶设计

### backgroundLight（页面底/卡片色）

```
100: #FFFBF8  — 卡片表面，暖白
200: #FDF3EC  — Tag 背景
300: #FAE5D8
400: #F5D0BC
500: #EBB89E
600: #DE9A7C
700: #C88062
800: #A86A50
900: #F5F0EC  — 页面底色，暖米色
```

### normalLight（文本色）

```
100: #FFFDFB  — 最亮
200: #F8F3EE
300: #EBE2D8
400: #D4C8B8
500: #B9A998  — secondary
600: #A08878  — muted
700: #8A6E5C  — text-secondary
800: #5A4438
900: #2A1E16  — text-primary，深棕
```

### primaryLight（酒红主色，保持不变）

```
100: #FCEDEC → 500: #C94A44 → 900: #4D1515
```

## CSS 变量映射

| 变量 | 映射 | 新值 |
|------|------|------|
| --primary-color | primary.light[500] | #C94A44 |
| --text-color | normal.light[900] | #2A1E16 |
| --text-primary | normal.light[900] | #2A1E16 |
| --text-secondary | normal.light[700] | #8A6E5C |
| --text-muted | normal.light[600] | #A08878 |
| --background-color | background.light[900] | #F5F0EC |
| --accent-color | (hardcoded) | #E3B567 |
| --page-bg | (hardcoded) | linear-gradient(180deg, #F5F0EC, #FDF3EC) |
