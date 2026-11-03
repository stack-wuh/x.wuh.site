import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { register } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// useViewTransition 契约守卫（change 20261104-style-state-transition-motion）：
// INV-2 回落无损——SSR / 特性不支持 / reduced-motion 三分支行为 = 直接 commit；
// 支持路径 = document.startViewTransition 回调内同步 flushSync(commit)（换幕交叉淡化）；
// commit 异常透传——hook 不吞没调用方错误。
// 行为断言经 module.register 把 react/react-dom 重定向到忠实语义桩（见 view-transition-loader.mjs），
// 导入 .ts 依赖 node 原生类型剥离——node ≥ 23 可跑（SGN-002 同源豁免，ambient node 24 实测）。
const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '..', '..', '..')
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

register('./view-transition-loader.mjs', import.meta.url)
const { useViewTransition } = await import('../useViewTransition/index.ts')

/** 安装最小浏览器环境并返回调用记录；用毕必须 cleanup 防串扰 */
const installEnv = ({ supported = true, invokeSync = false, reduced = false } = {}) => {
  const calls = { startViewTransition: 0, commit: 0, callbackRan: 0 }
  const commit = () => {
    calls.commit += 1
  }
  globalThis.window = { matchMedia: () => ({ matches: reduced }) }
  globalThis.document = supported
    ? {
        startViewTransition: (cb) => {
          calls.startViewTransition += 1
          if (invokeSync) cb()
          else calls.callback = cb
          return { finished: Promise.resolve() }
        },
      }
    : {}
  return { calls, commit }
}
const cleanupEnv = () => {
  delete globalThis.window
  delete globalThis.document
}

test('INV-2 分支一 SSR（无 document）：直接 commit，不经 startViewTransition', async (t) => {
  if (parseInt(process.versions.node) < 23) return t.skip('需 node ≥ 23 原生类型剥离')
  delete globalThis.document
  delete globalThis.window
  t.after(cleanupEnv)
  const { withTransition } = useViewTransition()
  let committed = 0
  withTransition(() => {
    committed += 1
  })
  assert.equal(committed, 1)
})

test('INV-2 分支二 特性不支持（document 无 startViewTransition）：直接 commit', async (t) => {
  if (parseInt(process.versions.node) < 23) return t.skip('需 node ≥ 23 原生类型剥离')
  const { calls, commit } = installEnv({ supported: false })
  t.after(cleanupEnv)
  const { withTransition } = useViewTransition()
  withTransition(commit)
  assert.equal(calls.commit, 1)
  assert.equal(calls.startViewTransition, 0)
})

test('INV-2 分支三 reduced-motion：直接 commit，跳过换幕', async (t) => {
  if (parseInt(process.versions.node) < 23) return t.skip('需 node ≥ 23 原生类型剥离')
  const { calls, commit } = installEnv({ reduced: true })
  t.after(cleanupEnv)
  const { withTransition } = useViewTransition()
  withTransition(commit)
  assert.equal(calls.commit, 1)
  assert.equal(calls.startViewTransition, 0)
})

test('flushSync wiring：支持路径经 startViewTransition，commit 在回调内同步执行', async (t) => {
  if (parseInt(process.versions.node) < 23) return t.skip('需 node ≥ 23 原生类型剥离')
  const { calls, commit } = installEnv()
  t.after(cleanupEnv)
  const { withTransition } = useViewTransition()
  withTransition(commit)
  assert.equal(calls.startViewTransition, 1, 'startViewTransition 恰好调用一次')
  assert.equal(calls.commit, 0, 'commit 不在提交时机之外执行')
  calls.callback()
  assert.equal(calls.commit, 1, 'commit 由换幕回调内同步驱动（flushSync 桩语义）')
})

test('INV-2 透传：commit 异常不被吞没（直接分支与同步回调路径均抛出）', async (t) => {
  if (parseInt(process.versions.node) < 23) return t.skip('需 node ≥ 23 原生类型剥离')
  const { withTransition } = useViewTransition()
  const boom = () => {
    throw new Error('commit boom')
  }
  // 直接分支（不支持）：异常自然透传
  installEnv({ supported: false })
  try {
    assert.throws(() => withTransition(boom), /commit boom/)
  } finally {
    cleanupEnv()
  }
  // 换幕分支（浏览器同步调用回调）：异常经回调透传，hook 不吞没
  installEnv({ invokeSync: true })
  try {
    assert.throws(() => withTransition(boom), /commit boom/)
  } finally {
    cleanupEnv()
  }
})

test('INV-2 拒绝吸收：换幕跳过（ready/finished 拒绝）不产生 unhandledRejection', async (t) => {
  if (parseInt(process.versions.node) < 23) return t.skip('需 node ≥ 23 原生类型剥离')
  const rejections = []
  const onUnhandled = (reason) => rejections.push(String(reason))
  process.on('unhandledRejection', onUnhandled)
  t.after(() => process.off('unhandledRejection', onUnhandled))
  const { calls, commit } = installEnv()
  // mock 返回已拒绝的 ready/finished（模拟连切/文档隐藏导致的换幕跳过）
  globalThis.document.startViewTransition = (cb) => {
    calls.startViewTransition += 1
    calls.callback = cb
    return { ready: Promise.reject(new Error('skip-ready')), finished: Promise.reject(new Error('skip-finished')) }
  }
  const { withTransition } = useViewTransition()
  withTransition(commit)
  calls.callback()
  await new Promise((r) => setTimeout(r, 20))
  assert.equal(rejections.length, 0, `换幕跳过拒绝被吸收，实际收到: ${rejections.join('; ')}`)
})

test('hook 导出契约：双导出 + 三分支 SSR guard + flushSync 包裹（源码文本）', () => {
  const src = read('packages/hooks/useViewTransition/index.ts')
  assert.match(src, /export const useViewTransition/)
  assert.match(src, /export default useViewTransition/)
  assert.match(src, /typeof document === 'undefined'/, 'SSR guard 在场')
  assert.match(src, /prefers-reduced-motion: reduce/, 'reduced-motion 分支在场')
  assert.match(src, /(?:document|doc)\.startViewTransition/, '换幕入口在场')
  assert.match(src, /flushSync\(commit\)/, '回调内同步提交语义')
  assert.match(src, /ready\?\.catch/, '换幕跳过拒绝吸收在场')
  assert.match(src, /finished\?\.catch/, 'finished 拒绝吸收在场')
})
