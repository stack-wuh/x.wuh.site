import React from 'react'
import classnames from 'classnames'

export type types = 'success' | 'warning' | 'error' | 'info'
export type AlertTypeProps = {
  icon?: string
  showIcon?: boolean
  type?: types
  message?: string
  description?: React.ReactNode | any
}

export const iconWithType = {
  success: 'icon-security',
  warning: 'icon-help',
  error: 'icon-cry',
  info: 'icon-history',
}

const isPatchIcons = (str: string): boolean =>
  ['success', 'warning', 'error', 'info'].includes(str)

const Alert: React.FC<AlertTypeProps> = props => {
  const { icon, showIcon, message, description, type = 'warning' } = props

  const innerClassnames = classnames('ww_alert__inner', {
    [`ww_alert__inner--${type}`]: type,
  })

  const iconClassnames = classnames('iconfont', [
    !icon && isPatchIcons(type) ? iconWithType[type] : icon,
  ])

  return (
    <div className="ww_alert">
      <div className={innerClassnames}>
        {showIcon && (
          <div className="ww_alert__icon">
            <i className={iconClassnames} />
          </div>
        )}
        <div className="ww_alert__content">
          {message && (
            <div className="ww_alert__content--message">{message}</div>
          )}
          {description && (
            <div className="ww_alert__content--content">{description}</div>
          )}
        </div>
      </div>
    </div>
  )
}

Alert.defaultProps = {
  showIcon: true,
  type: 'warning',
  icon: 'icon-help',
  message: '提示',
  description: '描述语句。。。。。。',
}

export default Alert
