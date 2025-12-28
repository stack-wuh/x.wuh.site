import React from 'react'
import classnames from 'classnames'
import Loading from './loading'

import { sizes } from '../space/space'

export type alignItems = 'start' | 'center' | 'end'
export interface EmptyTypeProps {
  size?: sizes
  align?: alignItems
}

export interface EmptyInterTypeProps extends React.FC<EmptyTypeProps> {
  Loading: typeof Loading
}

const Empty: EmptyInterTypeProps = props => {
  const { size, align, children } = props

  const innerClassnames = classnames('ww_empty__inner', {
    [`ww_empty__inner--${size}`]: size,
    [`ww_empty__inner--${align}`]: align,
  })

  return (
    <div className="ww_empty">
      <div className={innerClassnames}>{children}</div>
    </div>
  )
}

Empty.Loading = Loading

export default Empty
