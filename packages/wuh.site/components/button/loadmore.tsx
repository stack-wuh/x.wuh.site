import { ReactNode } from 'react'
import classnames from 'classnames'
import { useDebounceFn } from 'ahooks'
import * as gtag from '@/lib/gtag'

type sizes = 'small' | 'middle' | 'large'

export type loadButtonTypeProps = {
  children?: ReactNode
  size?: sizes
  onClick: () => void
  icon?: string
  disabled?: boolean
}
const LoadMore = (props: loadButtonTypeProps) => {
  const { size, children, onClick, icon, disabled } = props
  const outerClassnames = classnames('ww_button ww_button__loadmore')
  const innerClassnames = classnames('ww_button__loadmore__inner', {
    [`is-${size}`]: size,
    'is-disabled': disabled,
  })

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    gtag.event({
      action: 'click',
      category: 'button',
      label: 'btn__loadmore',
      value: 10,
    })
  }

  const { run } = useDebounceFn(handleClick, { wait: 500 })

  const iconClassnames = classnames('iconfont', icon)

  return (
    <div className={outerClassnames}>
      <div onClick={run} className={innerClassnames}>
        <span className="lf transition-color">
          <i className={iconClassnames}></i>
        </span>
        <div className="rg">
          <div className="scroll" />
          <div className="label" />
          <button disabled={disabled}>{children}</button>
        </div>
      </div>
    </div>
  )
}

export default LoadMore
