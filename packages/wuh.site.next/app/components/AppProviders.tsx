'use client'

import { StyledComponentsRegistry } from '@wuh.site/components/themes/registry'
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import { CssVariableStyles } from '@wuh.site/components/themes/cssVariableProvider'
import { useRef } from 'react'
import { useEventListener, useRequest } from 'ahooks'
import type { ReactNode } from 'react'
import Footer from '@wuh.site/components/layout/footer'
import { VisitStatsReporter } from '@/components/visit-stats/visit-stats-reporter'
import dynamic from 'next/dynamic'
import { AudioPlayerProvider } from '@wuh.site/components/audio-player/provider'

const DynamicGlobalAudioPlayer = dynamic(
  () => import('./player/GlobalAudioPlayer').then((m) => m.GlobalAudioPlayer),
  { ssr: false }
)

import SiteHeader from './SiteHeader'
import { ThemeModeProvider } from './theme/ThemeModeProvider'
import { IconfontStyle } from '@wuh.site/components/icons'
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
        <IconfontStyle>
          <GoogleAnalytics gaId="G-X4ZVBQXW9E" />
          <WebVitals gaId="G-X4ZVBQXW9E" />
          <ThemeModeProvider>
            <AudioPlayerProvider trackResolver={resolveTrackSource}>
              <SiteHeader />
              <VisitStatsReporter />
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
        </IconfontStyle>
      </StyledComponentsRegistry>
    </ThemeProvider>
  )
}
