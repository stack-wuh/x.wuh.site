const SITE_URL = 'https://wuh.site'
const PERSON_URL = `${SITE_URL}/about`
const PERSON_ID = `${PERSON_URL}#person`

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
    name: 'shadow',
    url: PERSON_URL,
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
        description: '记录前端工程、开源项目、设计系统与个人思考。',
        inLanguage: 'zh-CN',
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'shadow',
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
