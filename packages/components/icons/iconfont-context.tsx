'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const CDN_URL = '//at.alicdn.com/t/c/font_2595178_z5oq1y0t12.css'

type IconfontLoadState = 'loading' | 'loaded' | 'error'

const IconfontContext = createContext<IconfontLoadState>('loading')

export function useIconfontLoadState() {
  return useContext(IconfontContext)
}

export function IconfontStyle({ children }: { children: ReactNode }) {
  const [loadState, setLoadState] = useState<IconfontLoadState>('loading')

  useEffect(() => {
    const inject = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CDN_URL
      link.onload = () => setLoadState('loaded')
      link.onerror = () => setLoadState('error')
      document.head.appendChild(link)
    }

    if (document.readyState === 'complete') {
      inject()
    } else {
      window.addEventListener('load', inject, { once: true })
    }
  }, [])

  return (
    <IconfontContext.Provider value={loadState}>
      {children}
    </IconfontContext.Provider>
  )
}
