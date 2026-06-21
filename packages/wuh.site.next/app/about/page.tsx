import { Metadata } from 'next'
import { reposService } from '@wuh.site/shared-contracts/endpoints'
import type { GitHubProfileDto, RepoDto } from '@wuh.site/shared-contracts'
import AboutView from './AboutView'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: 'About · wuh.site',
  description: '输出节奏总览 — 记录思考，串联碎片，构建自己的知识系统',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About · wuh.site',
    description: '输出节奏总览 — 记录思考，串联碎片，构建自己的知识系统',
    url: `${SITE_URL}/about`,
    siteName: 'wuh.site',
    type: 'website',
  },
}

async function getProfile(): Promise<GitHubProfileDto | null> {
  const { data } = await reposService.getProfile.server({ revalidate: 3600 })
  if (!data) return null
  return (data as any).profile as GitHubProfileDto
}

async function getRepos(): Promise<RepoDto[]> {
  const { data } = await reposService.getAll.server({ revalidate: 3600 })
  if (!data) return []
  return (data as any).repos.slice(0, 6) as RepoDto[]
}

export default async function AboutPage() {
  const [profile, repos] = await Promise.all([
    getProfile(),
    getRepos(),
  ])
  return <AboutView profile={profile} repos={repos} />
}
