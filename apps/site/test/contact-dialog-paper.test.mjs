import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(testDir, '../../..')
const area = await readFile(resolve(repoRoot, 'apps/site/app/HomeView/ContactArea.tsx'), 'utf8')
const card = await readFile(resolve(repoRoot, 'apps/site/app/components/ContactCard.tsx'), 'utf8')

const block = (source, decl) => {
  const matched = source.match(new RegExp(`${decl}[^\`]*\`([\\s\\S]*?)\``))
  assert.ok(matched, `未找到样式块 ${decl}`)
  return matched[1]
}

/* ===== 弹窗挂载：paper 变体与 640 宽度 ===== */

test('联系弹窗启用 paper 变体，宽度收敛 640', () => {
  assert.match(area, /variant='paper'/)
  assert.match(area, /width='min\(640px, calc\(100vw - 32px\)\)'/)
  assert.doesNotMatch(area, /760px/, '旧 760px 宽度必须清除')
})

/* ===== 标题钤印（墨签同源，装饰性） ===== */

test('Dialog 标题组合渠道钤印：装饰性 aria-hidden + 印框/印面走 token', () => {
  assert.match(area, /<Seal aria-hidden/)
  const seal = block(area, 'const Seal = styled')
  assert.match(seal, /color-mix\(in oklab, var\(--primary-color\) 45%, transparent\)/, '印框同「墨」印 45% 语言')
  assert.match(seal, /border-radius: var\(--border-radius-xs\)/)
  assert.match(seal, /font-family: var\(--font-serif\)/)
  assert.match(seal, /color: var\(--primary-color\)/)
})

test('七渠道钤印字符映射齐备', () => {
  const sealMap = area.match(/SEAL_CHARS[^\n]*= \{([\s\S]*?)\}/)
  assert.ok(sealMap, '缺 SEAL_CHARS 映射')
  for (const ch of ['微', 'Q', 'T', 'G', '豆', '云', 'D']) {
    assert.ok(sealMap[1].includes(`'${ch}'`), `钤印字符 ${ch} 缺失`)
  }
})

/* ===== 响应式与硬编码禁令 ===== */

test('ContactCard 清除 560 裸断点，与 BREAKPOINTS.mobile(640) 同轴', () => {
  assert.doesNotMatch(card, /max-width: 560px/)
  assert.match(card, /import \{ BREAKPOINTS \} from '@wuh\.site\/components\/themes\/breakpoints'/)
  assert.match(card, /@media \(max-width: \$\{BREAKPOINTS\.mobile\}px\)/)
})

test('ActionArea 无硬编码 rgba 边框，走 color-mix 语义 token', () => {
  assert.doesNotMatch(card, /rgba\(0, 0, 0, 0\.06\)/)
  const action = block(card, 'const ActionArea =')
  assert.match(action, /border: 1px solid color-mix\(in oklab, var\(--normal-300\) 35%, transparent\)/)
})

/* ===== 错峰入场 ===== */

test('两栏与提示区 write-fade 错峰入场（0/80/160ms）', () => {
  assert.match(card, /animation: write-fade var\(--motion-dur-write\) var\(--motion-ease-out-soft\) both/, 'ActionArea 入场')
  assert.match(card, /animation-delay: 80ms/, '信息区错峰')
  assert.match(card, /animation-delay: 160ms/, '提示区错峰')
  assert.match(card, /animation-name: write-fade[\s\S]*?animation-delay: 0ms/, 'ActionArea 零延迟显式声明')
})

/* ===== 3D 手势契约（定稿：倾角 ±12° / 浮起 28px / 透视 700px） ===== */

test('ActionArea 3D 变换走 CSS 变量 + perspective 700px + preserve-3d', () => {
  const action = block(card, 'const ActionArea =')
  assert.match(action, /transform: translateY\(var\(--ty, 0px\)\) perspective\(700px\) rotateX\(var\(--rx, 0deg\)\) rotateY\(var\(--ry, 0deg\)\)/)
  assert.match(action, /transform-style: preserve-3d/)
})

test('倾角常量定稿 ±12°，裱框浮起 28px，高光层越过裱框', () => {
  assert.match(card, /const TILT_DEG = 12/)
  assert.match(card, /transform: translateZ\(28px\)/, 'QrMat 裱框层深')
  const action = block(card, 'const ActionArea =')
  assert.match(action, /&::after \{[\s\S]*?transform: translateZ\(34px\)/, '光层须在裱框之上（28+6）')
  assert.match(action, /var\(--accent-color\)/, '高光取暖金（wine light 纸面可见性）')
})

test('指针跟踪经 ref setProperty 直写 DOM，不经 React state', () => {
  assert.match(card, /el\.style\.setProperty\('--rx'/)
  assert.match(card, /el\.style\.setProperty\('--ry'/)
  assert.match(card, /el\.style\.setProperty\('--gx'/)
  assert.match(card, /el\.style\.setProperty\('--gy'/)
  assert.doesNotMatch(card, /setTilt|useState<.*tilt/i, '禁止 tilt 进 React state')
})

test('启用条件与降级在位：精确指针 + reduced-motion 停用 + 触屏不绑定', () => {
  assert.match(card, /matchMedia\('\(hover: hover\) and \(pointer: fine\)'\)/)
  assert.match(card, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/)
})

/* ===== 信息层级 ===== */

test('handle 等宽字体、hints 墨点主色化', () => {
  const handle = block(card, 'const Handle =')
  assert.match(handle, /font-family: var\(--font-mono\)/)
  const hints = block(card, 'const HintDot =')
  assert.match(hints, /color-mix\(in oklab, var\(--primary-color\) 60%, transparent\)/)
})
