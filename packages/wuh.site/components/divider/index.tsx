import * as React from 'react'
import classnames from 'classnames'

import { sizes, directions } from '../space/space'

export type positions = 'left' | 'center' | 'right'

export type DividerTypeProps = {
  size?: sizes
  type?: directions
  position?: positions
  allowTransition?: boolean
  notAllowLinearGradient?: boolean
}

const Divider: React.FC<DividerTypeProps> = props => {
  const {
    size = 'middle',
    type,
    children,
    position,
    allowTransition = false,
    notAllowLinearGradient = true,
  } = props

  const outerClassnames = classnames('ww_divider', {
    'is-transition': allowTransition,
  })

  const innerClassnames = classnames('ww_divider__inner', {
    [`is-${size}`]: size,
    [`is-${type}`]: type,
    [`is-text`]: children && React.Children.only(children),
    [`is-text-${position}`]: children && position,
    'disabled-linear-gradient': notAllowLinearGradient,
  })

  return (
    <div className={outerClassnames}>
      <div className={innerClassnames}>
        <div className="ww_divider__line">
          <div className="ww_divider__text">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Divider
