import { Metadata } from 'next'
import Image from 'next/image'
import Button from '@wuh.site/components/button'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'wuh.site · 前端工程师的作品与笔记',
  description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具'
}

type Repo = {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  homepage: string | null
  fork: boolean
}

async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch('https://api.github.com/users/stack-wuh/repos', {
      headers: { 'Accept': 'application/vnd.github+json' },
      next: { revalidate: 3600 }
    })
    if (!res.ok) return []
    const data = (await res.json()) as Repo[]
    return data
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
  } catch {
    return []
  }
}

export default async function Home() {
  const repos = await getRepos()
  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.brand}>
            <Image className={styles.logo} src='/logo.svg' alt='wuh.site.logo' width={180} height={108} priority />
            <h1 className={styles.title}>stack-wuh的博客</h1>
            <p className={styles.subtitle}>React / Vue / 工程化 / 可视化</p>
          </div>
          <div className={styles.ctas}>
            <Button href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' variant='filled' color='primary'>
              <Image src='/vercel.svg' alt='blog' width={16} height={16} />
              知识库
            </Button>
            <Button href='https://github.com/stack-wuh' target='_blank' rel='noopener noreferrer' variant='outlined' color='primary'>
              <Image src='/globe.svg' alt='github' width={16} height={16} />
              GitHub
            </Button>
          </div>
        </section>

        <section className={styles.projects}>
          <h2>精选项目</h2>
          <div className={styles.grid}>
            {repos.length === 0 && <div className={styles.empty}>暂时无法获取 GitHub 数据</div>}
            {repos.map(repo => (
              <a key={repo.html_url} className={styles.card} href={repo.homepage || repo.html_url} target='_blank' rel='noopener noreferrer'>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{repo.name}</span>
                  {repo.language && <span className={styles.lang}>{repo.language}</span>}
                </div>
                {repo.description && <p className={styles.desc}>{repo.description}</p>}
                <div className={styles.meta}>
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>⇢ 查看</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.footerCtas}>
          <Button
            href='mailto:shadow_u@foxmail.com'
            variant='filled'
            color='primary'
            size='small'
          >
            联系我
          </Button>
          <Button
            href='/design/system-color'
            variant='text'
            color='primary'
            size='small'
          >
            色彩系统
          </Button>
        </section>
      </main>
    </div>
  )
}
