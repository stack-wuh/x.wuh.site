# Progress

纸墨「运笔」双模态进度条。发丝轨道 + 朱砂 `scaleX` 自左铺墨（与导航下划线同一支运笔笔顺）；不确定态为两端渐隐墨迹沿轨道往复行笔；印光标 = 白文方印「樂」，立在墨迹尽头。

## 用法

```tsx
import Progress from '@wuh.site/components/progress'

// 只读确定态（role='progressbar' + aria 值链路）
<Progress value={62} />

// 显示态 + 印光标 + 百分比标注
<Progress value={62} thumb showLabel />

// 交互态：传 onChange 即原生 range 底座（拖拽/键盘/读屏零降级）
<Progress value={progress} onChange={seek} label="播放进度" />

// 不确定态：缺 value，渐隐墨迹行笔
<Progress />

// 细线（MiniPlayer 底行同款）
<Progress size="sm" value={percent} />
```

## 印光标语义

- **形 = 最爱**：`glyph="愛"` 换印面字（默认「樂」）
- **动 = 播放**：`breathing={playing}` 呼吸晕——曲在放印即活，暂停止息
- 播放中 + 最爱 = 「愛」印呼吸（最醒目组合）

组件不含「最爱/播放」领域知识，两信号皆由消费方组合。

## 客制化

消费方经 CSS 变量改形，不动组件内部：

| 变量 | 默认 | 说明 |
|------|------|------|
| `--progress-height` | 3px（sm 2px） | 轨道高 |
| `--progress-thumb-size` | 15px | 印面尺寸 |
| `--progress-thumb-color` | `--primary-color` | 印面色 |
| `--progress-thumb-glyph-size` | 10px | 阴文字号 |
| `--progress-fill-color` | `--primary-color` | 填充色 |

`glyph=""` 置空落无字阴线框回退（个别环境 10px 字形发糊时使用）。

## 纪律

- 颜色只走主题 token；不引用 motion tokens（时长自持字面量，console 不注入 motion 变量）
- 不确定态行笔与呼吸 keyframes 本地定义，`css` 包裹条件动画，`prefers-reduced-motion` 降级（行笔静止半程、呼吸静态晕、填充去 transition）
- 无滚动/resize 监听（阅读进度条走站点级 `animation-timeline: scroll(root)`，与本组件无关）
