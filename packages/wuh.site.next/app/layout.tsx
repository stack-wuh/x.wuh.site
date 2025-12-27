'use client'
import { StyledComponentsRegistry } from '@wuh.site/components/themes/registry'
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import { CssVariableStyles } from '@wuh.site/components/themes/cssVariableProvider'
import { Geist, Geist_Mono } from 'next/font/google'
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
