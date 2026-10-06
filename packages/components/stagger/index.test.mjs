import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')

test('Stagger self-owns its keyframes via styled keyframes helper (hashed name, no clash with site MotionStyles)', () => {
  assert.match(indexSource, /const staggerEnter = keyframes`/)
  assert.doesNotMatch(indexSource, /@keyframes /, 'no literal @keyframes — SC helper owns naming')
})

test('keyframes animate only opacity and transform — never layout properties', () => {
  const kfBody = indexSource.match(/keyframes`([\s\S]*?)`/)?.[1] ?? ''
  assert.ok(kfBody.length > 0, 'keyframes body found')
  const declarations = kfBody.split('\n').map((line) => line.trim()).filter((line) => /^[a-z-]+:/.test(line))
  assert.ok(declarations.length >= 4, 'selector braces excluded, declarations extracted')
  for (const decl of declarations) {
    assert.match(decl, /^(opacity|transform)\s*:/, `only opacity/transform allowed, got: ${decl}`)
  }
  assert.doesNotMatch(indexSource, /transition:/, 'stagger uses animation only, no layout-anchored transitions')
})

test('timing values are motion-token-aligned literals, no CSS variable references', () => {
  // 剥注释后判定——文档注释提及 --motion-* 禁令不算违规
  const codeOnly = indexSource.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  assert.doesNotMatch(codeOnly, /--motion-/)
  assert.doesNotMatch(codeOnly, /var\(--/)
  assert.match(indexSource, /cubic-bezier\(0\.22, 1, 0\.36, 1\)/, 'ease-out-soft expanded value')
  assert.match(indexSource, /props\.duration \?\? 600/, 'dur-reveal expanded value')
  assert.match(indexSource, /props\.step \?\? 60/)
  assert.match(indexSource, /props\.count \?\? 12/)
})

test('stagger delays enumerate nth-child slots with a bounded loop', () => {
  assert.match(indexSource, /Array\.from\(\{ length: Math\.max\(0, props\.\$count - 1\) \}/)
  assert.match(indexSource, /& > :nth-child\(\$\{i \+ 2\}\)/)
  assert.match(indexSource, /animation-delay: \$\{\(i \+ 1\) \* props\.\$step\}ms/)
  assert.match(indexSource, /animation: \$\{staggerEnter\}/)
})

test('reduced-motion downgrade renders everything statically', () => {
  const reducedBlock = indexSource.match(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\n\}/)?.[0] ?? ''
  assert.ok(reducedBlock.length > 0, 'reduced-motion block present')
  assert.match(reducedBlock, /& > \*\s*\{\s*animation: none;/)
})

test('Stagger composes with layout primitives via as, props never leak to the DOM', () => {
  assert.match(indexSource, /as\?: React\.ElementType/)
  assert.match(indexSource, /as=\{props\.as\}/)
  assert.match(indexSource, /const STAGGER_ONLY_KEYS: \(keyof IStaggerProps\)\[\] = \['step', 'duration', 'count'\]/)
  assert.match(indexSource, /STAGGER_ONLY_KEYS\.forEach\(\(key\) => delete/)
})

test('Stagger obeys component-package style discipline', () => {
  // styled-components 内部 useContext(ThemeContext)，消费惯例要求客户端边界
  assert.match(indexSource, /^'use client'/)
  assert.doesNotMatch(indexSource, /#[0-9a-fA-F]{3,8}\b/)
  assert.doesNotMatch(indexSource, /addEventListener|matchMedia|ResizeObserver|IntersectionObserver/)
  assert.doesNotMatch(indexSource, /from 'next|from "next/)
})
