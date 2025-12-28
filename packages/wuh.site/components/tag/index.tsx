import React from 'react'
import classnames from 'classnames'

export type colors =
  | 'yuque'
  | 'github'
  | 'zhihu'
  | 'qqzone'
  | 'wechat'
  | 'douban'
  | 'twitter'
  | 'default'
export type sizes = 'small' | 'middle' | 'large'
export type TagTypeProps = {
  icon?: string | null
  color?: colors | string
  ghost?: boolean
  iconFamily?: string
  size?: sizes
  className?: string
}

const allowHexColor = (value: string | any): boolean =>
  [
    'yuque',
    'github',
    'zhihu',
    'qqzone',
    'wechat',
    'douban',
    'twitter',
  ].includes(value)

const Tag: React.FC<TagTypeProps> = props => {
  const { children, ghost, color, icon, iconFamily, size, className } = props
  const innerClassnames = classnames('ww_tag__inner', className, {
    'is-ghost': ghost,
    [`is-${color}`]: allowHexColor(color),
    [`is-${size}`]: size,
    [`ww_tag--${color}`]: allowHexColor(color),
    [`ww_tag--${color}--ghost`]: ghost && allowHexColor(color),
  })
  const node = React.Children.only(children)

  const innerStyle: React.CSSProperties = {}
  if (!allowHexColor(color)) {
    innerStyle.backgroundColor = color
  }

  const iconClassnames = classnames('ww_tag__icon', iconFamily, icon)
  const iconPrefix = icon && <i className={iconClassnames} />
  return (
    <div className="ww_tag">
      <div className={innerClassnames} style={innerStyle}>
        {iconPrefix}
        {node}
      </div>
    </div>
  )
}

Tag.defaultProps = {
  ghost: false,
  color: 'default',
  icon: null,
  iconFamily: 'iconfont',
}

export default Tag
