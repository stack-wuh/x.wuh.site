import { Metadata } from 'next'
import { reposService } from '@wuh.site/core/endpoints'
import type { GitHubProfileDto } from '@wuh.site/core'
import { SITE_URL, SITE_NAME } from '@wuh.site/core'
import AboutView from './AboutView'
import JsonLd from '../components/JsonLd'
import { buildProfilePageJsonLd } from '../lib/seo'

export const metadata: Metadata = {
  title: '关于',
  description: '输出节奏总览 — 记录思考，串联碎片，构建自己的知识系统',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: '关于',
    description: '吴尒红（Shadow）的创作节奏总览，记录思考、串联碎片并构建知识系统',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: 'website',
  },
}

async function getProfile(): Promise<GitHubProfileDto | null> {
  const { data } = await reposService.getProfile.server({ revalidate: 3600 })
  if (!data) return null
  return (data as any).profile as GitHubProfileDto
}

export default async function AboutPage() {
  const profile = await getProfile()
  const jsonLd = buildProfilePageJsonLd(profile)

  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutView profile={profile} />
    </>
  )
}
