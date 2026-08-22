import { extractFirstParagraphText } from './markdown'
import { buildPostUrl } from './slug'
import { SITE_URL, SITE_NAME, AUTHOR_URL } from '@wuh.site/shared-contracts'

export { SITE_URL }
export const GITHUB_PROFILE_URL = AUTHOR_URL
export const SITE_PERSON_ID = `${SITE_URL}/about#person`
export const DEFAULT_OG_IMAGE_PATH = '/og-default.png'
export const DEFAULT_ARTICLE_DESCRIPTION = '吴尒红（Shadow）的技术文章'

type ArticleIssue = {
  number: number
  title: string
  created_at: string
  updated_at?: string
  body?: string
  labels: Array<{ name: string }>
  user?: { login?: string | null; userName?: string | null } | null
  metadata?: {
    cover?: string | null
    coverAlt?: string | null
    summary?: string | null
    keywords?: string[] | null
    extra?: Record<string, unknown>
  } | null
}

type GitHubProfile = {
  login?: string | null
  name?: string | null
  avatar_url?: string | null
  blog?: string | null
}


type ImageMetadata = {
  url: string
  alt: string
}

function getMetadata(issue: ArticleIssue): ArticleIssue['metadata'] | undefined {
  return issue.metadata ?? undefined
}

function getAuthorName(issue: ArticleIssue): string {
  return issue.user?.userName?.trim() || issue.user?.login?.trim() || 'stack-wuh'
}

function getAuthorUrl(issue: ArticleIssue): string {
  const login = issue.user?.login?.trim()
  return login ? `https://github.com/${login}` : GITHUB_PROFILE_URL
}

export function buildArticleDescription(issue: ArticleIssue): string {
  const cmsSummary = getMetadata(issue)?.summary?.trim()
  if (cmsSummary) return cmsSummary

  const body = issue.body?.trim()
  return body ? extractFirstParagraphText(body) : DEFAULT_ARTICLE_DESCRIPTION
}

export function getArticleKeywords(issue: ArticleIssue): string[] {
  const cmsKeywords = getMetadata(issue)?.keywords
    ?.map((keyword) => keyword.trim())
    .filter(Boolean)
  if (cmsKeywords?.length) return cmsKeywords

  return issue.labels
    .map((label) => label.name.trim())
    .filter(Boolean)
}

export function getArticleCategory(issue: ArticleIssue): string | undefined {
  const extraCategory = getMetadata(issue)?.extra?.category
  if (typeof extraCategory === 'string' && extraCategory.trim()) {
    return extraCategory.trim()
  }

  const fallback = issue.labels[0]?.name.trim()
  return fallback || undefined
}

export function getArticleImage(issue: ArticleIssue): ImageMetadata {
  const metadata = getMetadata(issue)
  const cover = metadata?.cover?.trim()
  return {
    url: cover || DEFAULT_OG_IMAGE_PATH,
    alt: metadata?.coverAlt?.trim() || issue.title,
  }
}

export function buildArticleMetadata(issue: ArticleIssue): Record<string, unknown> {
  const description = buildArticleDescription(issue)
  const image = getArticleImage(issue)
  const category = getArticleCategory(issue)
  const keywords = getArticleKeywords(issue)
  const url = `${SITE_URL}${buildPostUrl(issue.number, issue.title)}`
  const author = {
    name: getAuthorName(issue),
    url: getAuthorUrl(issue),
  }

  return {
    title: issue.title,
    description,
    authors: [author],
    keywords,
    category,
    alternates: { canonical: url },
    openGraph: {
      title: issue.title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: issue.created_at,
      modifiedTime: issue.updated_at,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: issue.title,
      description,
      images: [image.url],
    },
  }
}

export function buildBlogPostingJsonLd(issue: ArticleIssue): Record<string, unknown> {
  const image = getArticleImage(issue)
  const authorName = getAuthorName(issue)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: issue.title,
    description: buildArticleDescription(issue),
    image: image.url,
    datePublished: issue.created_at,
    dateModified: issue.updated_at,
    url: `${SITE_URL}${buildPostUrl(issue.number, issue.title)}`,
    author: {
      '@type': 'Person',
      '@id': SITE_PERSON_ID,
      name: authorName,
      url: getAuthorUrl(issue),
      sameAs: GITHUB_PROFILE_URL,
    },
  }
}

export function buildProfilePageJsonLd(profile: GitHubProfile | null): Record<string, unknown> {
  const name = profile?.name?.trim() || profile?.login?.trim() || 'stack-wuh'
  const profileUrl = profile?.blog?.trim() || GITHUB_PROFILE_URL
  const sameAs = Array.from(new Set([GITHUB_PROFILE_URL, profileUrl]))

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/about#profilepage`,
    url: `${SITE_URL}/about`,
    name: 'About · wuh.site',
    mainEntity: {
      '@type': 'Person',
      '@id': SITE_PERSON_ID,
      name,
      url: profileUrl,
      image: profile?.avatar_url || undefined,
      sameAs,
    },
  }
}
