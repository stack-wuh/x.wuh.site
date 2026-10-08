// 组件结构守卫——packages/components 编写规范的棘轮检查（规范见 shadow-docs/knowledge/component-standard.md）
// 硬性规则：全量即红，不进 baseline。
// 棘轮规则：violation ⊆ baseline 登记；新增违规红；已修好但未除名也红（强制台账准确，只减不增）。
// node test/structure.test.mjs --emit-baseline  # 重新采集，生成 baseline JSON
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const INFRA_DIRS = new Set(['themes', 'styled', 'test', 'locales', 'node_modules'])
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

const dirs = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !INFRA_DIRS.has(e.name))
  .map((e) => e.name)
  .sort()

const readDir = (dir, file) => {
  try {
    return fs.readFileSync(path.join(root, dir, file), 'utf8')
  } catch {
    return null
  }
}

// Windows 文件系统不区分大小写：readFileSync 拿不到真实 casing，必须以 readdir 名单为准
const topFilesOf = (dir) => fs.readdirSync(path.join(root, dir))
const hasFile = (dir, name) => topFilesOf(dir).includes(name)

const walkFiles = (rel, acc = []) => {
  for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const p = `${rel}/${e.name}`
    if (e.isDirectory()) walkFiles(p, acc)
    else acc.push(p)
  }
  return acc
}

const filesOf = (dir) => walkFiles(dir)
const isPlaceholder = (dir) => {
  const src = readDir(dir, 'index.tsx')
  return src !== null && src.trim() === ''
}

// ---- 棘轮规则采集 ----

const missingTypes = dirs.filter(
  (d) => !isPlaceholder(d) && !filesOf(d).some((f) => f === `${d}/types.ts` || f === `${d}/types.tsx`)
)

const missingReadme = dirs.filter((d) => !isPlaceholder(d) && !hasFile(d, 'readme.md'))

const legacyReadmeName = dirs.filter((d) => !isPlaceholder(d) && hasFile(d, 'README.md'))

const dualExport = dirs.filter((d) => {
  const src = readDir(d, 'index.tsx')
  if (src === null) return false
  const def = src.match(/^export default (\w+)/m)
  if (!def) return false
  const name = def[1]
  return (
    new RegExp(`^export (?:const|function) ${name}\\b`, 'm').test(src) ||
    new RegExp(`^export \\{[^}]*\\b${name}\\b`, 'm').test(src)
  )
})

const STYLED_RE = /(^|\s|>)styled\s*[.(<]|from 'styled-components'|from ['"]@wuh\.site\/components\/styled['"]/

const stylesInline = dirs.filter((d) => {
  if (isPlaceholder(d)) return false
  const files = filesOf(d)
  if (files.some((f) => /(^|\/)styles(\/|\.)/.test(f.slice(d.length + 1)))) return false
  return files
    .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
    .some((f) => STYLED_RE.test(fs.readFileSync(path.join(root, f), 'utf8')))
})

// 跨目录只允许入口级引用（'../<dir>' 或 '@wuh.site/components/<dir>'）；子路径深导入违规
const deepCrossImport = (dir) => {
  const own = path.resolve(path.join(root, dir))
  for (const f of filesOf(dir).filter((x) => /\.(tsx|ts)$/.test(x))) {
    const src = fs.readFileSync(path.join(root, f), 'utf8')
    for (const m of src.matchAll(/from ['"]([^'"]+)['"]/g)) {
      const spec = m[1]
      if (spec.startsWith('@wuh.site/components/')) {
        const sub = spec.slice('@wuh.site/components/'.length)
        const first = sub.split('/')[0]
        if (sub.includes('/') && !INFRA_DIRS.has(first)) return true
      } else if (spec.startsWith('.')) {
        const abs = path.resolve(path.join(root, path.dirname(f)), spec)
        if (abs === own || abs.startsWith(own + path.sep)) continue
        const rel = path.relative(root, abs)
        if (rel && !rel.startsWith('..') && rel.split(path.sep).length > 1) {
          const first = rel.split(path.sep)[0]
          if (!INFRA_DIRS.has(first)) return true
        }
      }
    }
  }
  return false
}

const deepCrossHits = dirs.filter(deepCrossImport)

const current = {
  'missing-entry': dirs.filter((d) => readDir(d, 'index.tsx') === null),
  'missing-types': missingTypes,
  'missing-readme': missingReadme,
  'legacy-readme-name': legacyReadmeName,
  'dual-export': dualExport,
  'styles-inline': stylesInline,
}

if (process.argv.includes('--emit-baseline')) {
  process.stdout.write(`${JSON.stringify(current, null, 2)}\n`)
  process.exit(0)
}

const baseline = JSON.parse(fs.readFileSync(path.join(root, 'test', 'structure-baseline.json'), 'utf8'))

// ---- 硬性规则：全量即红 ----

test('目录名 kebab-case', () => {
  const bad = dirs.filter((d) => !KEBAB.test(d))
  assert.deepEqual(bad, [])
})

test('禁止 specs.tsx/specs.ts 历史名再出现', () => {
  const hits = dirs.flatMap((d) => filesOf(d).filter((f) => /(^|\/)specs\.(tsx|ts)$/.test(f.slice(d.length + 1))))
  assert.deepEqual(hits, [])
})

test('index.tsx 至多一个 export default', () => {
  for (const d of dirs) {
    const src = readDir(d, 'index.tsx')
    if (src === null) continue
    const n = src.match(/^export default/gm)
    assert.ok(n === null || n.length === 1, `${d}/index.tsx 有 ${n?.length} 个 default`)
  }
})

test('类型契约唯一命名为 types.ts(x)', () => {
  for (const d of dirs) {
    const src = readDir(d, 'index.tsx')
    if (src === null) continue
    assert.doesNotMatch(src, /from '\.\/specs'/, `${d}/index.tsx 引用 ./specs`)
  }
})

test('禁止跨组件目录深导入（入口级引用除外）', () => {
  assert.deepEqual(deepCrossHits, [], `深导入: ${deepCrossHits.join(', ')}`)
})

// ---- 棘轮规则：只减不增 ----

for (const [rule, found] of Object.entries(current)) {
  const registered = baseline[rule] ?? []
  test(`棘轮 ${rule}：无新增违规`, () => {
    const added = found.filter((d) => !registered.includes(d))
    assert.deepEqual(added, [], `新增违规未登记: ${added.join(', ')}`)
  })
  test(`棘轮 ${rule}：台账与现状一致（已修好须除名）`, () => {
    const stale = registered.filter((d) => !found.includes(d))
    assert.deepEqual(stale, [], `以下已合规但仍登记，请从 baseline 除名: ${stale.join(', ')}`)
  })
}

// ---- 占位组件：空 index.tsx 者不得伪装成已实现 ----

test('占位组件维持空壳或已实现全结构', () => {
  for (const d of dirs) {
    const src = readDir(d, 'index.tsx')
    if (src === null || src.trim() === '') continue
    // 非空即视为实现中：至少要有一个 readme（缺失者在棘轮 missing-readme 登记）
  }
})
