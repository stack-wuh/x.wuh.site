import React, { useRef } from 'react'
import Space from '@/components/space/space'
import Affix from '@/components/affix'
import { useHover } from 'ahooks'
import { Button } from '.'

export type BehaviorTypeProps = {}

/**
 * 滚动事件相关的行为，集中为一个hooks返回
 * @returns { scorllToTop } 回到页首
 * @returns { scorllToBottom } 回到页尾
 */
const useScroll = () => {
  const scroll = (direction = 1) => {
    window.scroll(
      0,
      window.innerHeight +
        direction *
          (document?.documentElement?.scrollTop ??
            document?.body?.scrollTop ??
            0)
    )
  }

  const getTargetRects = () => ({
    scrollTop:
      document.documentElement.scrollTop ?? document.body.scrollTop ?? 0,
    innerHeight: window.innerHeight,
  })

  /**回到页首 */
  const scrollToTop = (): void => window.scroll(0, 0)
  /**回到页尾 */
  const scrollToBottom = (): void =>
    window.scroll(0, getTargetRects().scrollTop + getTargetRects().innerHeight)

  return {
    scroll,
    scrollToTop,
    scrollToBottom,
  }
}

const Behavior: React.FC<BehaviorTypeProps> = props => {
  const {} = props
  const scroller = useScroll()
  const btnDownRef = useRef<any>()
  const btnUpRef = useRef<any>()

  useHover(btnUpRef, {
    onEnter: () => {
      scroller.scroll(-1)
    },
  })
  useHover(btnDownRef, {
    onEnter: () => {
      scroller.scroll()
    },
  })

  return (
    <Affix position="right" offsetY={'70vh'} offsetX={'90vw'}>
      <div className="ww_button ww_button-group ww_button-group__state">
        <Space direction="vertical" size={0}>
          <Button
            events={{ label: 'behavior-rss', category: 'link' }}
            className="btn__item"
            ghost
            htmlHref="https://src.wuh.site/common/rss.xml"
            shape="rect"
            icon="icon-Rss"
          />
          <Button
            events={{ label: 'behavior-up', category: 'link' }}
            onClick={scroller.scrollToTop}
            ref={btnUpRef}
            className="btn__item"
            ghost
            shape="rect"
            icon="icon-up"
          />
          <Button
            events={{ label: 'behavior-down', category: 'link' }}
            onClick={scroller.scrollToBottom}
            ref={btnDownRef}
            className="btn__item"
            ghost
            shape="rect"
            icon="icon-down"
          />
          <Button
            events={{ label: 'behavior-contact', category: 'link' }}
            className="btn__item"
            ghost
            htmlHref="mailto:wuh131420@foxmail.com?subject=联系我吧&body=在这里写内容"
            shape="rect"
            icon="icon-email"
          />
        </Space>
      </div>
    </Affix>
  )
}

export default Behavior
