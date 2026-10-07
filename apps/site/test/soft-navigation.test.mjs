import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(testDir, '..')
const repoRoot = resolve(siteRoot, '../..')
const pkgRoot = resolve(repoRoot, 'packages/components')

const readSite = (rel) => readFile(resolve(siteRoot, rel), 'utf8')
const readPkg = (rel) => readFile(resolve(pkgRoot, rel), 'utf8')

// 递归收集 tsx/ts 源文件（跳过 node_modules、类型声明与示例页）
function collectTsx(root) {
  const out = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = join(root, entry.name)
    if (entry.isDirectory()) out.push(...collectTsx(full))
    else if (/\.(tsx|ts)$/.test(entry.name) && !entry.name.endsWith('.d.ts') && !entry.name.includes('.test.') && !entry.name.includes('example')) out.push(full)
  }
  return out
}

// 从匹配点截取开标签属性区（到首个裸 '>'，JSX 子节点不进入该切片）
function openingTagSlice(source, matchIndex) {
  let depth = 0
  for (let i = matchIndex; i < source.length; i++) {
    const ch = source[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    else if (ch === '>' && depth === 0) return source.slice(matchIndex, i + 1)
  }
  return source.slice(matchIndex, matchIndex + 400)
}

// 结构性豁免文件：其原生锚点由下方专项断言锁死（页脚资源项 native 分支）
const FILE_EXEMPT = ['layout/footer.tsx']

test('站内路径禁止裸 a 锚点——同文档存续是全局播放器不断播的前提', async () => {
  const sources = [...(await collectTsx(resolve(siteRoot, 'app'))), ...(await collectTsx(pkgRoot))]
  const violations = []
  for (const file of sources) {
    if (FILE_EXEMPT.some((ex) => file.endsWith(ex))) continue
    const src = await readFile(file, 'utf8')
    const re = /<a[\s>]/g
    let m
    while ((m = re.exec(src))) {
      const slice = openingTagSlice(src, m.index)
      // 合法逃逸：显式 target（外发/新窗口）、hash 锚、资源下载链接
      if (/target=/.test(slice)) continue
      if (/href=\{?[`'"]#/.test(slice)) continue
      if (/href=\{?[`'"]\/api\//.test(slice)) continue
      violations.push(`${file.replace(repoRoot + '/', '')}: ${slice.replace(/\s+/g, ' ').slice(0, 90)}`)
    }
  }
  assert.deepEqual(violations, [], `站内裸 a 会触发全文档重载，杀根布局 provider 与播放\n${violations.join('\n')}`)
})

test('styled.a 定义零增长白名单——新站内锚点须走 styled(Link)', async () => {
  const ALLOWED = new Set([
    'apps/site/app/post/styles/post-toc.ts#TocItemLink', // 文内 hash 锚
    'apps/site/app/about/styles.ts#ProfileAvatarLink', // GitHub 外链
    'apps/site/app/about/styles.ts#ProfileNameLink', // GitHub 外链
    'apps/site/app/about/components/guestbook-barrage.styles.ts#GuestbookFooterLink', // 消费侧 as 覆盖
    'apps/site/app/components/ContactCard.tsx#LinkButton', // 邮箱/外链
    'apps/site/app/styles/index.ts#ProjectLink', // 仓库外链
    'apps/site/app/guestbook/GuestbookPageView/styles/index.tsx#BackLink', // 消费侧 as 覆盖
    'packages/components/result/styles/index.tsx#LinkItem',
    'packages/components/alert/styles/index.tsx#MetaLink',
    'packages/components/alert/styles/index.tsx#LabelLink',
    'packages/components/shared-link-group/styles/index.tsx#SLink',
    'packages/components/button/styles/index.tsx#StyledLink', // Button 根内部按 href 切 Link
  ])
  const unlisted = []
  const scan = async (root) => {
    for (const file of await collectTsx(root)) {
      const src = await readFile(file, 'utf8')
      const rel = file.replace(repoRoot + '/', '')
      for (const m of src.matchAll(/export const (\w+) = styled\.a[<(]/g)) {
        const key = `${rel}#${m[1]}`
        if (!ALLOWED.has(key)) unlisted.push(key)
      }
    }
  }
  await scan(resolve(siteRoot, 'app'))
  await scan(pkgRoot)
  assert.deepEqual(unlisted, [], `styled.a 定义不在白名单（站内锚点必须 styled(Link)）\n${unlisted.join('\n')}`)
  // 本单软化的四面定义必须已是 styled(Link)
  const toolbar = await readFile(resolve(siteRoot, 'app/post/styles/post-toolbar.ts'), 'utf8')
  const article = await readFile(resolve(siteRoot, 'app/post/styles/post-article.ts'), 'utf8')
  const pagStyles = await readPkg('pagination/styles/index.tsx')
  assert.match(toolbar, /export const SpreadSide = styled\(Link\)/, 'SpreadSide 仍是裸锚根')
  assert.match(article, /export const RelatedPostLink = styled\(Link\)/, 'RelatedPostLink 仍是裸锚根')
  assert.match(pagStyles, /export const NavLink = styled\(Link\)/, '分页 NavLink 仍是裸锚根')
  assert.match(pagStyles, /export const LetterLink = styled\(Link\)/, '分页 LetterLink 仍是裸锚根')
  // 分页禁用态经 as='span' 摘除 Link 的 href 依赖（Link 无 href 会抛）
  const pagView = await readPkg('pagination/index.tsx')
  assert.match(pagView, /as=\{hasPrev \? undefined : 'span'\}/, '分页上页禁用态未摘 href')
  assert.match(pagView, /as=\{hasNext \? undefined : 'span'\}/, '分页下页禁用态未摘 href')
})

test('页脚站内导航走 Link、RSS 资源项保留原生锚点', async () => {
  const footer = await readPkg('layout/footer.tsx')
  const specs = await readPkg('layout/specs.tsx')
  assert.match(footer, /import Link from 'next\/link'/, 'footer 缺 next/link')
  assert.match(footer, /item\.native \?/, 'footer 缺资源项条件渲染')
  assert.match(footer, /<Link key=\{item\.href\} href=\{item\.href\}>/, 'footer 站内项未走 Link')
  assert.match(specs, /native\?: boolean/, 'FooterNavItem 缺 native 标记类型')
  assert.match(specs, /href: '\/api\/rss\.xml', native: true/, 'RSS 项未标记原生渲染')
})

test('文章上/下篇与话题题签走 Link 形态', async () => {
  const postView = await readSite('app/post/PostView/index.tsx')
  assert.match(postView, /<Link href=\{buildPostUrl\(prevIssue\.number\)\} data-dir='prev'>/, '上一篇未走 Link')
  assert.match(postView, /<Link href=\{buildPostUrl\(nextIssue\.number\)\} data-dir='next'>/, '下一篇未走 Link')
  assert.doesNotMatch(postView, /<a href=\{buildPostUrl/, '上/下篇残留裸锚形态')
  const postHeader = await readSite('app/post/components/PostHeader/index.tsx')
  assert.match(postHeader, /<Link key=\{label\.name\} href=\{buildTopicUrl\(label\.name\)\}/, '话题题签未走 Link')
  assert.doesNotMatch(postHeader, /<a key=\{label\.name\} href=\{buildTopicUrl/, '话题题签残留裸锚形态')
})

test('Button 站内 href 根切 Link——Empty 动作数据面同链覆盖', async () => {
  const button = await readPkg('button/index.tsx')
  assert.match(button, /import Link from 'next\/link'/, 'Button 缺 next/link')
  assert.match(button, /startsWith\('\/'\)/, 'Button 缺站内路径判定')
  assert.match(button, /startsWith\('\/\/'\)/, 'Button 缺协议相对链接排除')
  assert.match(button, /as=\{isInternalHref\(href\) \? Link : undefined\}/, 'Button 根未注入 Link')
  // Empty 动作经 Button 渲染：数据面站内 href 必须仍在，且不改道裸锚
  const blogView = await readSite('app/blog/BlogListView/index.tsx')
  assert.match(blogView, /href: '\/'/, '博客空态返回首页动作缺失')
  const wereadSection = await readSite('app/HomeView/WereadSection.tsx')
  assert.match(wereadSection, /href: '\/weread'/, '书架空态跳转动作缺失')
})
