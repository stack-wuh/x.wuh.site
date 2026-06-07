'use client'

import { StyledComponentsRegistry } from '@wuh.site/components/themes/registry'
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import { CssVariableStyles } from '@wuh.site/components/themes/cssVariableProvider'
import { useRef } from 'react'
import { useEventListener, useExternal, useRequest } from 'ahooks'
import type { ReactNode } from 'react'
import Footer from '@wuh.site/components/layout/footer'
import dynamic from 'next/dynamic'
import { AudioPlayerProvider } from '@wuh.site/components/audio-player/provider'

const DynamicGlobalAudioPlayer = dynamic(
  () => import('./player/GlobalAudioPlayer').then((m) => m.GlobalAudioPlayer),
  { ssr: false }
)

import SiteHeader from './SiteHeader'
import { ThemeModeProvider } from './theme/ThemeModeProvider'
import { ProgressProvider } from '@bprogress/next/app'
import { GoogleAnalytics } from '@wuh.site/components/analytics/GoogleAnalytics'
import { WebVitals } from '@wuh.site/components/analytics/WebVitals'

export default function AppProviders({ children }: { children: ReactNode }) {
  const previousTitle = useRef<string | null>(null)

  useEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      previousTitle.current = document.title
      document.title = 'wuh.site \u00b7 雾失楼台, 月迷津渡'
      return
    }

    if (document.visibilityState === 'visible' && previousTitle.current) {
      document.title = previousTitle.current
      previousTitle.current = null
    }
  })

  useExternal('//at.alicdn.com/t/c/font_2595178_z5oq1y0t12.css', { type: 'css' })

  const { runAsync: resolveTrackSource } = useRequest(
    async (trackId: number) => {
      const response = await fetch(`/api/music/track?id=${trackId}`)
      if (!response.ok) throw new Error('无法获取音频资源')
      return response.json()
    },
    { manual: true }
  )

  return (
    <ThemeProvider>
      <StyledComponentsRegistry>
        <CssVariableStyles />
        <GoogleAnalytics gaId="G-X4ZVBQXW9E" />
        <WebVitals gaId="G-X4ZVBQXW9E" />
        <ThemeModeProvider>
          <AudioPlayerProvider trackResolver={resolveTrackSource}>
            <SiteHeader />
            <ProgressProvider
              color="var(--primary-color)"
              height="3px"
              shallowRouting
              delay={80}
              options={{ showSpinner: false }}
            >
              {children}
            </ProgressProvider>
            <Footer />
            <DynamicGlobalAudioPlayer />
          </AudioPlayerProvider>
        </ThemeModeProvider>
      </StyledComponentsRegistry>
    </ThemeProvider>
  )
}
