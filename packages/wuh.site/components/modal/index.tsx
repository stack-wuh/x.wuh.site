import React from 'react'
import ReactDom from 'react-dom'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import Button from '@/components/button/button'

type ModalPropsTypes = {
  /** Modal对话框是否可见 */
  visible: boolean
  /** 取消事件 */
  onCancel?: () => void
  /** 确认事件 */
  onOk?: () => void
  /** Modal的 Title 部分 */
  title: React.ReactNode | string
  /** 是否固定Header区域 */
  allowFixedHeader?: boolean
  /** Modal.Footer */
  footer?: React.ReactNode | boolean
  /** 外部容器的类名 */
  wrapperClassName?: string
  /** 内部样式表 */
  innerStyle?: React.CSSProperties
}

const Modal: React.FC<ModalPropsTypes> = props => {
  const { visible, title, allowFixedHeader, wrapperClassName, innerStyle } =
    props

  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  const footer = props.footer ? (
    <>
      {' '}
      <Button onClick={handleCancel} type="primary">
        取消
      </Button>{' '}
    </>
  ) : null

  const outer = (
    <CSSTransition in={visible} timeout={500} classNames="alert" unmountOnExit>
      <div className="ww_modal">
        <div className={classnames('ww_modal__outer', wrapperClassName)}>
          <div
            className={classnames('ww_modal__header', {
              'ww_modal__header--fixed': allowFixedHeader,
            })}>
            <div className="ww_modal__header--left">
              <i className="iconfont-color icon-prefix iconhangkonghangtian-leidaradars" />
              {title}
              <i className="iconfont-color icon-suffix iconhangkonghangtian-leidaradars" />
            </div>
            <div className="ww_modal__header--right" onClick={handleCancel}>
              <i className="iconfont icon-searchclose"></i>
            </div>
          </div>
          <div className="ww_modal__inner" style={innerStyle}>
            {visible && props.children}
          </div>
          {footer && <div className="ww_modal__footer">{footer}</div>}
        </div>
        <style jsx global>{`
          html {
            overflow: ${visible ? 'hidden' : 'inherit'};
          }
        `}</style>
      </div>
    </CSSTransition>
  )

  const $target = document.querySelector('body')
  if ($target) {
    return ReactDom.createPortal(outer, $target)
  }

  return outer
}

Modal.defaultProps = {
  visible: false,
  allowFixedHeader: true,
  onCancel: () => {},
  onOk: () => {},
  footer: false,
}

export default typeof document !== 'undefined' ? Modal : () => null
