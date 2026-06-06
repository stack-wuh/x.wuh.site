'use client'
import { StyledComponentsRegistry } from '@wuh.site/components/themes/registry'
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import { CssVariableStyles } from '@wuh.site/components/themes/cssVariableProvider'
import { useCallback, useRef } from 'react'
import { useEventListener, useExternal } from 'ahooks'
import type { ReactNode } from 'react'
import Footer from '@wuh.site/components/layout/footer'
import dynamic from 'next/dynamic'
import { AudioPlayerProvider } from '@wuh.site/components/audio-player/provider'

const DynamicGlobalAudioPlayer = dynamic(
  () => import('./components/player/GlobalAudioPlayer').then((m) => m.GlobalAudioPlayer),
  { ssr: false }
)
import SiteHeader from './components/SiteHeader'
import { ThemeModeProvider } from './components/theme/ThemeModeProvider'
import { ProgressProvider } from '@bprogress/next/app'
import { GoogleAnalytics } from '@wuh.site/components/analytics/GoogleAnalytics'
import { WebVitals } from '@wuh.site/components/analytics/WebVitals'
import { Inter, JetBrains_Mono, Noto_Serif_SC } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const previousTitle = useRef<string | null>(null)

  useEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      previousTitle.current = document.title
      document.title = 'wuh.site · 雾失楼台, 月迷津渡'
      return
    }

    if (document.visibilityState === 'visible' && previousTitle.current) {
      document.title = previousTitle.current
      previousTitle.current = null
    }
  })

  useExternal('//at.alicdn.com/t/c/font_2595178_z5oq1y0t12.css', { type: 'css' })

  const resolveTrackSource = useCallback(async (trackId: number) => {
    const response = await fetch(`/api/music/track?id=${trackId}`)
    if (!response.ok) {
      throw new Error('无法获取音频资源')
    }
    return response.json()
  }, [])

  return (
    <ThemeProvider>
      <StyledComponentsRegistry>
        <html lang='en'>
          <head />
          <CssVariableStyles />
          <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSerifSC.variable}`}>
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
          </body>
        </html>
      </StyledComponentsRegistry>
    </ThemeProvider>
  )
}
