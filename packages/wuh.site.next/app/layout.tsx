'use client'
import { StyledComponentsRegistry } from '@wuh.site/components/themes/registry'
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import { CssVariableStyles } from '@wuh.site/components/themes/cssVariableProvider'
import { Geist, Geist_Mono } from 'next/font/google'
import { useEffect } from 'react'
import Footer from '@wuh.site/components/layout/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
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

  return (
    <ThemeProvider>
      <StyledComponentsRegistry>
        <html lang='en'>
          <CssVariableStyles />
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            {children}
            <Footer />
          </body>
        </html>
      </StyledComponentsRegistry>
    </ThemeProvider>
  )
}
