import * as React from 'react'
import type { ReactNode } from 'react'
import { useResponsive } from 'ahooks'
import classnames from 'classnames'
import {
  ResponsiveProvider,
  responseInterfaceProps,
} from '@/hooks/useResponsive'

type ResProps = {
  children: ReactNode
}

export default function Response(props: ResProps) {
  const { children } = props
  const responsive: responseInterfaceProps = useResponsive()
  const {
    xs = false,
    sm = false,
    md = false,
    lg = false,
    xl = false,
  } = responsive || {}
  const isMobile = [xs, sm].includes(true)
  const isTablet = [md].includes(true)
  const isPc = [lg, xl].includes(true)
  const responseValue: responseInterfaceProps = {
    isMobile: isMobile && !isTablet && !isPc,
    isTablet: isTablet && !isPc,
    isPc,
    ...responsive,
  }
  return (
    <>
      <ResponsiveProvider.Provider value={responseValue}>
        <div
          className={classnames('layout', {
            layout_mobile: isMobile && !isTablet && !isPc,
            layout_tablet: isTablet && !isPc,
            layout_pc: isPc,
          })}>
          <div className="app-root">{children}</div>
        </div>
      </ResponsiveProvider.Provider>
    </>
  )
}
