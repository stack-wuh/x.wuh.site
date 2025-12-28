import classNames from 'classnames'
import React from 'react'

export type sizes = 'small' | 'middle' | 'large' | number
export type directions = 'vertical' | 'horizontal'
export type SpaceProps = {
  size?: sizes
  wrap?: boolean
  direction?: directions
  border?: boolean
  style?: React.CSSProperties
  itemStyle?: React.CSSProperties
  ghost?: boolean
  block?: boolean
  className?: string
}

const Space: React.FC<SpaceProps> = props => {
  const {
    size = 'middle',
    wrap = true,
    direction = 'horizontal',
    children,
    border = false,
    style,
    itemStyle,
    ghost,
    block,
    className,
  } = props
  const outClassnames = classNames('ww_space')
  const innerClassnames = classNames('ww_space__inner', className, {
    [`is-${size}`]: size,
    [`is-wrap`]: wrap,
    [`is-${direction}`]: direction,
    [`is-border`]: border,
    'is-block': block,
    'is-ghost': ghost,
  })
  const innerStyle: React.CSSProperties = {}
  if (typeof size === 'number') {
    const paddingKey =
      direction === 'horizontal' ? 'paddingRight' : 'paddingBottom'
    innerStyle[paddingKey] = size + 'px'
  }

  const nodes = React.Children.map(children, cm => (
    <div className="ww_space__item" style={{ ...innerStyle, ...itemStyle }}>
      {cm}
    </div>
  ))
  return (
    <div className={outClassnames}>
      <div className={innerClassnames} style={style}>
        {nodes}
      </div>
    </div>
  )
}

export default Space
