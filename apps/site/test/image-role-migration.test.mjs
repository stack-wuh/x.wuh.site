import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const root = resolve(appRoot, '..')

const [about, home, homeStyles, weread, wereadSection, postHeader, postHeaderStyles, comments, commentsStyles, contact, postCover, footprintStyles, footprintPage, markdownStyles] = await Promise.all([
  readFile(resolve(appRoot, 'app/about/AboutView/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/HomeView/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/styles/index.ts'), 'utf8'),
  readFile(resolve(appRoot, 'app/weread/WereadView/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/HomeView/WereadSection.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/components/PostHeader/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/styles/post-header.ts'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/components/PostComments/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/components/PostComments/styles/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/components/ContactCard.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/components/PostCover/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, '../../packages/components/footprint-map/styles.ts'), 'utf8'),
  readFile(resolve(appRoot, 'app/footprint/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/styles/post-markdown.ts'), 'utf8'),
])

test('About 头像使用 avatar role 且不再以内联圆角修补内部图片', () => {
  assert.match(about, /role='avatar'/)
  assert.doesNotMatch(about, /style=\{\{ borderRadius: '50%'/)
})

test('首页和微信读书页书封使用 book-cover role', () => {
  assert.match(wereadSection, /<S\.BookCover[\s\S]*role=["']book-cover["']/)
  assert.match(weread, /<S\.BookCover[\s\S]*role=["']book-cover["']/)
  assert.doesNotMatch(homeStyles, /const BookCover[\s\S]*border-radius:\s*4px/)
  assert.doesNotMatch(weread, /const BookCover[\s\S]*border-radius:\s*4px/)
})

test('文章作者头像迁移到共享 avatar role 并保留 accent ring', () => {
  assert.match(postHeader, /<AuthorAvatar[\s\S]*role='avatar'/)
  assert.match(postHeaderStyles, /AuthorAvatarFrame/)
  assert.match(postHeaderStyles, /border:\s*2px solid/)
})

test('评论头像图片使用 avatar role 并保留首字母 fallback', () => {
  assert.match(comments, /role='avatar'/)
  assert.match(comments, /getAvatarInitial/)
})

test('评论头像错误首字母使用绝对居中容器', () => {
  assert.match(commentsStyles, /export const AvatarFallback = styled\.span/)
  assert.match(commentsStyles, /position:\s*absolute/)
  assert.match(commentsStyles, /inset:\s*0/)
  assert.match(commentsStyles, /place-items:\s*center/)
  assert.match(comments, /errorFallback=\{<S\.AvatarFallback>/)
})

test('首页和 ContactCard Logo 使用 IconLogo 组件', () => {
  assert.match(home, /<IconLogo width=\{64\} height=\{38\.4\}/)
  assert.match(contact, /<IconLogo width=\{48\} height=\{29\}/)
  assert.doesNotMatch(home, /logo\.svg/)
  assert.doesNotMatch(contact, /logo\.svg/)
})

test('ContactCard 二维码使用 qr role 和 contain 语义', () => {
  assert.match(contact, /role='qr'/)
  assert.doesNotMatch(contact, /const QRImage = styled\.img/)
})

test('文章封面使用 cover role 并显式响应移动端圆角', () => {
  assert.match(postCover, /role='cover'/)
  assert.match(postCover, /borderRadius='var\(--post-cover-radius\)'/)
  assert.match(postHeaderStyles, /--post-cover-radius:\s*12px/)
  assert.match(postHeaderStyles, /--post-cover-radius:\s*0/)
})

test('足迹照片使用 thumbnail role 并保留预览点击', () => {
  assert.match(footprintStyles, /styled\(Image\)/)
  assert.match(footprintPage, /<Photo[\s\S]*role=["']thumbnail["']/)
  assert.match(footprintPage, /onClick=\{\(\) => handlePhotoClick\(i\)\}/)
})

test('Markdown 评论和足迹 HTML 图片遵循 content 视觉规范', () => {
  for (const source of [markdownStyles, commentsStyles, footprintStyles]) {
    assert.match(source, /img\s*\{[\s\S]*max-width:\s*100%/)
    assert.match(source, /img\s*\{[\s\S]*height:\s*auto/)
    assert.match(source, /img\s*\{[\s\S]*border-radius:\s*8px/)
    assert.match(source, /img\s*\{[\s\S]*background:\s*var\(--background-100\)/)
  }
})
