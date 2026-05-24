'use client'
import { StyledComponentsRegistry } from '@wuh.site/components/themes/registry'
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import { CssVariableStyles } from '@wuh.site/components/themes/cssVariableProvider'
import { useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import Footer from '@wuh.site/components/layout/footer'
import { AudioPlayerProvider } from '@wuh.site/components/audio-player'
import { GlobalAudioPlayer } from './components/player/GlobalAudioPlayer'
import SiteHeader from './components/SiteHeader'
import { ThemeModeProvider } from './components/theme/ThemeModeProvider'
import { ProgressProvider } from '@bprogress/next/app'

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  useEffect(() => {
    let previousTitle: string | null = null

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        previousTitle = document.title
        document.title = 'wuh.site · 雾失楼台, 月迷津渡'
        return
      }

      if (document.visibilityState === 'visible' && previousTitle) {
        document.title = previousTitle
        previousTitle = null
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

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
          <head>
            <link rel='stylesheet' href='https://at.alicdn.com/t/c/font_2595178_yxlvt61lad.css' />
          </head>
          <CssVariableStyles />
          <body>
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
                <GlobalAudioPlayer />
              </AudioPlayerProvider>
            </ThemeModeProvider>
          </body>
        </html>
      </StyledComponentsRegistry>
    </ThemeProvider>
  )
}
