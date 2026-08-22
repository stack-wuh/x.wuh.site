import { SITE_URL, AUTHOR_NAME, AUTHOR_URL } from '@wuh.site/core'

const PERSON_URL = `${SITE_URL}/about`
const PERSON_NAME = AUTHOR_NAME
const PERSON_ID = `${PERSON_URL}#person`
const GITHUB_PROFILE_URL = AUTHOR_URL

type JsonLdRecord = Record<string, unknown>

type ArticleStructuredDataInput = {
  url: string
  title: string
  description: string
  publishedAt: string
  modifiedAt?: string | null
  image?: string | null
  imageAlt?: string | null
  keywords?: string[] | null
  labels?: string[]
}

type BreadcrumbItem = {
  name: string
  url: string
}

function createAuthorReference(): JsonLdRecord {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON_NAME,
    url: PERSON_URL,
    sameAs: [GITHUB_PROFILE_URL],
  }
}

function compactStrings(values: string[] | null | undefined): string[] {
  return Array.from(new Set((values || []).map((value) => value.trim()).filter(Boolean)))
}

export function createSiteStructuredData(): JsonLdRecord {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'wuh.site',
        description: '吴尒红（Shadow）的个人站，记录前端工程、开源项目、设计系统与个人思考。',
        inLanguage: 'zh-CN',
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: PERSON_NAME,
        url: PERSON_URL,
        sameAs: ['https://github.com/stack-wuh'],
      },
    ],
  }
}

export function createArticleStructuredData(input: ArticleStructuredDataInput): JsonLdRecord {
  const keywords = compactStrings(input.keywords)
  const labels = compactStrings(input.labels)
  const data: JsonLdRecord = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt || input.publishedAt,
    url: input.url,
    inLanguage: 'zh-CN',
    isPartOf: {
      '@type': 'Blog',
      name: 'wuh.site',
      url: `${SITE_URL}/blog`,
    },
    author: createAuthorReference(),
    publisher: createAuthorReference(),
  }

  if (input.image) {
    data.image = {
      '@type': 'ImageObject',
      url: input.image,
      caption: input.imageAlt || input.title,
    }
  }

  if (keywords.length > 0) {
    data.keywords = keywords.join(', ')
  }

  if (labels.length > 0) {
    data.articleSection = labels[0]
  }

  return data
}

export function createBreadcrumbStructuredData(items: BreadcrumbItem[]): JsonLdRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

type CollectionPageItem = {
  name: string
  url: string
}

type CollectionPageStructuredDataInput = {
  url: string
  name: string
  description: string
  items: CollectionPageItem[]
}

export function createCollectionPageStructuredData(input: CollectionPageStructuredDataInput): JsonLdRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: 'zh-CN',
    isPartOf: {
      '@type': 'Blog',
      name: 'wuh.site',
      url: `${SITE_URL}/blog`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  }
}
