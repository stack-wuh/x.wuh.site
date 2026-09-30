'use client'

import { StyledComponentsRegistry } from '@wuh.site/components/themes/registry'
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import { CssVariableStyles } from '@wuh.site/components/themes/cssVariableProvider'
import { LocaleProvider, useLocale } from '@wuh.site/components/locales'
import { MotionStyles } from '@/app/styles/motion'
import { useEventListener, useRequest } from 'ahooks'
import { useRef } from 'react'
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

/**
 * 页面失焦时的标题换装，文案随当前 locale。
 * 独立成子组件：AppProviders 本体在 LocaleProvider 之外，消费不到 context。
 */
function LocalizedDocumentTitle() {
  const { t } = useLocale()
  const previousTitle = useRef<string | null>(null)
  const siteTitle = t('site.title')

  useEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      previousTitle.current = document.title
      document.title = siteTitle
      return
    }

    if (document.visibilityState === 'visible' && previousTitle.current) {
      document.title = previousTitle.current
      previousTitle.current = null
    }
  })

  return null
}

export default function AppProviders({ children }: { children: ReactNode }) {
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
      <LocaleProvider>
        <LocalizedDocumentTitle />
        <StyledComponentsRegistry>
          <CssVariableStyles />
          <MotionStyles />
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
      </LocaleProvider>
    </ThemeProvider>
  )
}
