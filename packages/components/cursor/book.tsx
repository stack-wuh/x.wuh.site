/**
 * 跟随层「一页书」SVG 结构（决策 D1/D4）——比稿稿 cursor-v4.html 的无损移植。
 * 三个元件：左页 pl / 右页 pr（背面淡一档）/ 翻页 g.pt（face+纸边 edge），
 * 底页三行弧字 rules、朱砂脊线 spine、脊头钉 pin（钉即热点 D3）。
 * 纯结构件：动效与配色全部在 style.tsx 的瞬态 class / CSS 变量里，这里零内联样式。
 */
import { P1, P2, EDGE, RULES, OFFSET } from './tints'

/** 跟随层用的翻页面：抬起时是右页形状，落到左侧后镜像覆盖（scaleX 1→−1） */
const FACE = P2

export default function BookCursor() {
  return (
    <svg viewBox="0 0 30 30" width="30" height="30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform={`translate(${OFFSET[0]},${OFFSET[1]})`}>
      <path className="pl" d={P1} vectorEffect="non-scaling-stroke" />
      <path className="pr" d={P2} vectorEffect="non-scaling-stroke" />
      <g className="rules">
        {RULES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="pt">
        <path className="face" d={FACE} vectorEffect="non-scaling-stroke" />
        <path className="edge" d={EDGE} vectorEffect="non-scaling-stroke" />
      </g>
      <rect className="base" x="4.3" y="17.9" width="15.4" height="1.3" rx=".65" />
      <line className="spine" x1="12" y1="4.6" x2="12" y2="16.6" />
      <circle className="pin" cx="12" cy="3.6" r=".78" />
      </g>
    </svg>
  )
}
