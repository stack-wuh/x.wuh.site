import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC, Noto_Serif_SC, JetBrains_Mono } from 'next/font/google'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_URL } from '@wuh.site/shared-contracts'
import AppProviders from './components/AppProviders'
import JsonLd from './components/JsonLd'
import { createSiteStructuredData } from './lib/structured-data'

const notoSansSC = Noto_Sans_SC({
  weight: ['400', '500', '600', '700'],
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
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [{
      url: '/og-default.png',
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-default.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#b91c1c' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0a0a' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="alternate" type="application/rss+xml" title="wuh.site RSS" href="https://wuh.site/api/rss.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  // Step 1: disable all CSS transitions before touching data attrs
  document.documentElement.setAttribute('data-no-transition', '');
  // Force reflow so the transition:none rule is applied
  void document.documentElement.offsetHeight;

  // Step 2: restore persisted theme family
  var family = 'wine';
  try {
    var storedFamily = window.localStorage.getItem('wuh.site.theme');
    if (storedFamily === 'wine' || storedFamily === 'plain') family = storedFamily;
  } catch (_) {}
  document.documentElement.dataset.themeFamily = family;

  // Step 3: restore display mode and resolve the effective color scheme
  var mode = 'system';
  try {
    var storedMode = window.localStorage.getItem('wuh.site.color-scheme-mode');
    if (storedMode === 'system' || storedMode === 'light' || storedMode === 'dark') mode = storedMode;
  } catch (_) {}
  var scheme = mode === 'light' || mode === 'dark'
    ? mode
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.colorScheme = scheme;

  // Step 4: re-enable transitions now that data attrs are settled
  document.documentElement.removeAttribute('data-no-transition');
})();
          `.trim(),
          }}
        />
      </head>
      <body className={`${notoSansSC.variable} ${notoSerifSC.variable} ${jetbrainsMono.variable}`}>
        <JsonLd data={createSiteStructuredData()} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
