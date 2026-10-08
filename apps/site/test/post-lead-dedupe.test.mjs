import test from 'node:test'
import assert from 'node:assert/strict'
import {
  dedupeLeadArtifacts,
  normalizeImageUrl,
  normalizeHeadingText,
} from '../app/lib/postLeadDedupe.ts'

/**
 * 运行方式：node --experimental-strip-types --test test/post-lead-dedupe.test.mjs
 * fixture 形态对齐 renderMarkdown 实际输出：heading 内含 rehype-autolink-headings
 * 追加的 <a class="anchor">…</a>，图片为 <p><img></p> 单图壳。
 */

const COVER = 'https://cdn.wuh.site/2026-10/2026-10-07-122611.png'
const TITLE = 'Vibe Coding Workflow 概述'

/** #172 真实文档结构的最小渲染产物：标题 h2 → 封面图 → 实质段落 → 后续正文 */
const fixture172 = [
  `<h2 id="vibe-coding-workflow-概述">${TITLE}<a class="anchor" href="#vibe-coding-workflow-概述" aria-hidden="true">#</a></h2>`,
  `<p><img src="${COVER}" alt=""></p>`,
  `<p>在今年 4 月底我开始正式接触和使用 AI，最开始使用的 chatgpt 和 opus。</p>`,
  `<p>慢慢地我们开始发现，有点不太对劲。</p>`,
  `<h3 id="工作流存在的意义">工作流存在的意义?<a class="anchor" href="#工作流存在的意义" aria-hidden="true">#</a></h3>`,
  `<p>不要让 AI 更快写代码，应该是让 AI 先明确边界。</p>`,
].join('\n')

test('#172 命中：导语区重复标题与同 URL 封面图被移除，实质段落起不动', () => {
  const { html, removedImages, removedHeadings } = dedupeLeadArtifacts(fixture172, { title: TITLE, cover: COVER })
  assert.equal(removedHeadings, 1)
  assert.equal(removedImages, 1)
  assert.ok(!html.includes(`<h2 id="vibe-coding-workflow-概述">`), '重复标题 h2 应被移除')
  assert.ok(!html.includes(COVER), '同 URL 封面图应被移除')
  assert.ok(html.includes('在今年 4 月底我开始正式接触和使用 AI'), '首个实质段落保留')
  assert.ok(html.includes('工作流存在的意义'), '后续正文与标题不受影响')
})

test('正文中途出现的同 URL 图片不动（仅收导语区）', () => {
  const html = [
    `<p><img src="${COVER}" alt=""></p>`,
    `<p>第一段实质文字。</p>`,
    `<p>中间配图：<img src="${COVER}" alt="复用图"></p>`,
  ].join('\n')
  const result = dedupeLeadArtifacts(html, { title: null, cover: COVER })
  assert.equal(result.removedImages, 1)
  assert.ok(result.html.includes('中间配图'), '正文中途同 URL 图保留')
  assert.ok(result.html.includes('alt="复用图"'))
})

test('无 metadata.cover：图片规则不触发，标题规则独立生效（生成式封面同样承载 h1）', () => {
  const { html, removedImages, removedHeadings } = dedupeLeadArtifacts(fixture172, { title: TITLE, cover: null })
  assert.equal(removedImages, 0)
  assert.ok(html.includes(COVER), '无显式封面时正文首图是文章内容，保留')
  assert.equal(removedHeadings, 1)
  assert.ok(!html.includes(`id="vibe-coding-workflow-概述"`), '重复标题仍被收编')
})

test('title 与 cover 双空：原样返回零 diff', () => {
  const result = dedupeLeadArtifacts(fixture172, { title: null, cover: null })
  assert.equal(result.html, fixture172)
  assert.equal(result.removedImages, 0)
  assert.equal(result.removedHeadings, 0)
})

test('无 title 上下文时图片规则独立生效', () => {
  const { html, removedImages, removedHeadings } = dedupeLeadArtifacts(fixture172, { title: null, cover: COVER })
  assert.equal(removedImages, 1)
  assert.equal(removedHeadings, 0)
  assert.ok(html.includes(`id="vibe-coding-workflow-概述"`), '无 title 时标题保留')
})

test('首个 heading 不等于标题时保留（作者写的是真章节）', () => {
  const html = [
    `<h2 id="intro">引言<a class="anchor" href="#intro" aria-hidden="true">#</a></h2>`,
    `<p>这是一段实质导语文字。</p>`,
  ].join('\n')
  const result = dedupeLeadArtifacts(html, { title: TITLE, cover: COVER })
  assert.equal(result.removedHeadings, 0)
  assert.ok(result.html.includes('引言'))
})

test('导语区多个 heading 时只比对并移除首个', () => {
  const html = [
    `<h2 id="a">${TITLE}<a class="anchor" href="#a" aria-hidden="true">#</a></h2>`,
    `<h3 id="b">小引</h3>`,
    `<p><img src="${COVER}" alt=""></p>`,
    `<p>实质段落。</p>`,
  ].join('\n')
  const result = dedupeLeadArtifacts(html, { title: TITLE, cover: COVER })
  assert.equal(result.removedHeadings, 1)
  assert.equal(result.removedImages, 1)
  assert.ok(result.html.includes('小引'), '首个之后的 heading 不动')
})

test('hr 不终止导语区', () => {
  const html = [
    `<h2 id="a">${TITLE}<a class="anchor" href="#a" aria-hidden="true">#</a></h2>`,
    `<hr>`,
    `<p><img src="${COVER}" alt=""></p>`,
    `<p>实质段落。</p>`,
  ].join('\n')
  const result = dedupeLeadArtifacts(html, { title: TITLE, cover: COVER })
  assert.equal(result.removedHeadings, 1)
  assert.equal(result.removedImages, 1)
})

test('列表/引用块作为实质内容块终止导语区', () => {
  const html = [
    `<ul><li>要点一</li></ul>`,
    `<p><img src="${COVER}" alt=""></p>`,
  ].join('\n')
  const result = dedupeLeadArtifacts(html, { title: TITLE, cover: COVER })
  assert.equal(result.removedImages, 0)
  assert.ok(result.html.includes(COVER), '列表已开启正文，之后的图不动')
})

test('图文混排的段落只删 img 标签、保留文本与壳', () => {
  const html = [
    `<p>卷首语：<img src="${COVER}" alt=""></p>`,
    `<p>实质段落。</p>`,
  ].join('\n')
  const result = dedupeLeadArtifacts(html, { title: TITLE, cover: COVER })
  assert.equal(result.removedImages, 1)
  assert.ok(result.html.includes('卷首语'), '文本保留')
  assert.ok(!result.html.includes(COVER))
})

test('URL 归一化：协议差异、查询串、host 大小写均命中', () => {
  const variants = [
    `http://cdn.wuh.site/2026-10/2026-10-07-122611.png`,
    `https://CDN.WUH.SITE/2026-10/2026-10-07-122611.png`,
    `https://cdn.wuh.site/2026-10/2026-10-07-122611.png?x-oss-process=resize`,
    `https://cdn.wuh.site/2026-10/2026-10-07-122611.png#v2`,
  ]
  for (const src of variants) {
    const html = `<p><img src="${src}" alt=""></p>\n<p>实质段落。</p>`
    const result = dedupeLeadArtifacts(html, { title: TITLE, cover: COVER })
    assert.equal(result.removedImages, 1, `应命中：${src}`)
  }
})

test('标题比对：空白折叠与 HTML 实体解码后等强', () => {
  const html = [
    `<h2 id="a">Vibe&nbsp;Coding&nbsp;Workflow\n  <em>概述</em><a class="anchor" href="#a" aria-hidden="true">#</a></h2>`,
    `<p>实质段落。</p>`,
  ].join('\n')
  const result = dedupeLeadArtifacts(html, { title: TITLE, cover: null })
  assert.equal(result.removedHeadings, 1)
  assert.equal(result.html.match(/<h2/g), null)
})

test('幂等：重复执行输出不变', () => {
  const first = dedupeLeadArtifacts(fixture172, { title: TITLE, cover: COVER })
  const second = dedupeLeadArtifacts(first.html, { title: TITLE, cover: COVER })
  assert.equal(second.html, first.html)
  assert.equal(second.removedImages, 0)
  assert.equal(second.removedHeadings, 0)
})

test('空输入与非结构文本原样返回', () => {
  assert.deepEqual(dedupeLeadArtifacts('', { title: TITLE, cover: COVER }), { html: '', removedImages: 0, removedHeadings: 0 })
  const plain = `<p>纯正文没有图没有标题重复。</p>`
  const result = dedupeLeadArtifacts(plain, { title: TITLE, cover: COVER })
  assert.equal(result.html, plain)
})

test('helper：normalizeImageUrl 与 normalizeHeadingText 行为', () => {
  assert.equal(normalizeImageUrl('HTTPS://Cdn.WUH.SITE/a/b.png?x=1#y'), 'cdn.wuh.site/a/b.png')
  assert.equal(normalizeImageUrl('  https://cdn.wuh.site/a.png '), 'cdn.wuh.site/a.png')
  assert.equal(normalizeHeadingText('<em>A&nbsp;&amp; B</em><a class="anchor" href="#a" aria-hidden="true">#</a>'), 'A & B')
  assert.equal(normalizeHeadingText('  一、\n  前言  '), '一、 前言')
})
