import React from 'react'
import classnames from 'classnames'

export type positions = 'left' | 'right'

export type AffixTypeProps = {
  /** 指定参考对象 **/
  target?: () => Window | HTMLElement | null
  /** 指定affix固定的位置, 或左或右 **/
  position?: positions
  /** Y轴偏移量 **/
  offsetY?: number | string
  /** X轴偏移量 */
  offsetX?: number | string
}

const Affix: React.FC<AffixTypeProps> = props => {
  const { children, position, offsetY, offsetX } = props

  const node = React.Children.only(children)
  const innerClassname = classnames(
    'ww_affix__inner',
    `ww_affix__inner--${position}`
  )

  const innerStyle: React.CSSProperties = {
    position: 'fixed',
    top: offsetY,
    left: offsetX,
  }

  return (
    <div className="ww_affix">
      <div className={innerClassname} style={innerStyle}>
        {node}
      </div>
    </div>
  )
}

Affix.defaultProps = {
  position: 'left',
}

export default Affix
