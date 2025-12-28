import React from 'react'
import classnames from 'classnames'

export type TFlexProps = {
  className?: string
  size?: 'small' | 'middle' | 'large'
  direction?: 'vertical' | 'horizontal'
}

const Flex: React.FC<TFlexProps> = props => {
  const { size, direction } = props

  const outerClassNames = classnames('ww_flex', props.className)
  const innerClassNames = classnames('ww_flex__inner', {
    [`is-${size}`]: size,
    [`is-${direction}`]: direction,
  })

  const nodes = React.Children.map(props.children, child => {
    return <div className="ww_flex__item">{child}</div>
  })

  return (
    <div className={outerClassNames}>
      <div className={innerClassNames}>{nodes}</div>
    </div>
  )
}

Flex.defaultProps = {
  size: 'middle',
  direction: 'horizontal',
}

export default Flex
