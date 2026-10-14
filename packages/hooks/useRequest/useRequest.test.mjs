import test from 'node:test'
import assert from 'node:assert/strict'
import { RequestRunner } from './runner.ts'

// useRequest 等价守卫（change 20261014-refactor-final-cleanup-wave · Phase 1）：
// 钉死 5 个消费点用到的全部能力面——auto / manual+runAsync / run 吞错 / onSuccess·onError /
// refresh 沿 lastArgs / stale 响应保护 / cacheKey(挂载种子秒显+swr 重校验,构造与 SSR 期不种子)。
// node ≥ 23 原生 type-stripping 可直跑(SGN-002)。

const tick = () => new Promise((r) => setTimeout(r, 0))

test('UR1 auto start: loading 即真→resolve 后 data 落位、onSuccess 收到返回值', async () => {
  let done
  const seen = []
  const runner = new RequestRunner(() => new Promise((res) => { done = res }), {
    onSuccess: (d) => seen.push(d),
  })
  runner.start()
  assert.equal(runner.getSnapshot().loading, true)
  assert.equal(runner.getSnapshot().data, null)
  done('payload')
  await tick()
  const s = runner.getSnapshot()
  assert.equal(s.data, 'payload')
  assert.equal(s.loading, false)
  assert.equal(s.error, null)
  assert.deepEqual(seen, ['payload'])
})

test('UR2 manual: start 不触发,runAsync 透传参数并返回结果', async () => {
  const calls = []
  const runner = new RequestRunner((...args) => { calls.push(args); return Promise.resolve(args[0] * 2) }, { manual: true })
  runner.start()
  await tick()
  assert.deepEqual(calls, [])
  assert.equal(runner.getSnapshot().loading, false)
  const out = await runner.runAsync(21)
  assert.equal(out, 42)
  assert.deepEqual(calls, [[21]])
  assert.equal(runner.getSnapshot().data, 42)
})

test('UR3 run 吞错不抛、error 落位;runAsync 抛出同一错误;onError 收到', async () => {
  const boom = new Error('net down')
  const seen = []
  const runner = new RequestRunner(() => Promise.reject(boom), { onError: (e) => seen.push(e) })
  await runner.run()
  assert.equal(runner.getSnapshot().error, boom)
  assert.equal(runner.getSnapshot().loading, false)
  assert.equal(runner.getSnapshot().data, null)
  await assert.rejects(runner.runAsync(), (e) => e === boom)
  assert.deepEqual(seen, [boom, boom])
})

test('UR4 refresh 沿最近一次 args;初始 args 为空', async () => {
  const calls = []
  const runner = new RequestRunner((x) => { calls.push(x); return Promise.resolve(x) }, { manual: true })
  await runner.runAsync()
  await runner.refresh()
  await runner.runAsync(7)
  await runner.refresh()
  assert.deepEqual(calls, [undefined, undefined, 7, 7])
})

test('UR5 stale 保护:后发先至时旧响应不得覆写新状态', async () => {
  let first
  let second
  const runner = new RequestRunner((tag) => tag === 'slow'
    ? new Promise((res) => { first = res })
    : new Promise((res) => { second = res }))
  runner.run('slow')
  runner.run('fast')
  second('new')
  await tick()
  const mid = runner.getSnapshot()
  assert.equal(mid.data, 'new')
  assert.equal(mid.loading, false, '最新一次已完成')
  first('old')
  await tick()
  assert.equal(runner.getSnapshot().data, 'new', '迟到的旧响应必须被丢弃')
  assert.equal(runner.getSnapshot().loading, false)
})

test('UR6 cacheKey: 构造期空态(SSR 安全),start 种子秒显并后台重校验(SWR,staleTime=0)', async () => {
  const v1 = await new RequestRunner(() => Promise.resolve('v1'), { cacheKey: 'k1' }).runAsync()
  assert.equal(v1, 'v1')

  let reqCount = 0
  const runner2 = new RequestRunner(() => { reqCount++; return Promise.resolve('v2') }, { cacheKey: 'k1' })
  assert.equal(runner2.getSnapshot().data, null, '构造期不得读缓存(hydrate 首帧对齐 SSR)')
  runner2.start()
  assert.equal(runner2.getSnapshot().data, 'v1', '挂载即种子缓存值')
  assert.equal(runner2.getSnapshot().loading, true, '种子同时后台重发')
  await tick()
  assert.equal(reqCount, 1)
  assert.equal(runner2.getSnapshot().data, 'v2', '重校验后更新')

  const runner3 = new RequestRunner(() => Promise.resolve('never'), { cacheKey: 'k1', manual: true })
  assert.equal(runner3.getSnapshot().data, null)
  runner3.start()
  assert.equal(runner3.getSnapshot().data, 'v2', 'manual+cacheKey:start 只种子不请求')
  await tick()
})

test('UR7 subscribe/getSnapshot: 状态变化通知且 snapshot 引用仅在变化时替换', async () => {
  let notify = 0
  const runner = new RequestRunner(() => Promise.resolve('x'))
  const unsub = runner.subscribe(() => { notify++ })
  const snap0 = runner.getSnapshot()
  runner.start()
  const snap1 = runner.getSnapshot()
  assert.notEqual(snap1, snap0, 'loading 置真即新快照')
  await tick()
  const snap2 = runner.getSnapshot()
  assert.notEqual(snap2, snap1)
  assert.equal(snap2.data, 'x')
  const ref = runner.getSnapshot()
  await tick()
  assert.equal(runner.getSnapshot(), ref, '无变化不替换引用(防 useSyncExternalStore 空转)')
  unsub()
  await runner.runAsync('after-unsub')
  assert.ok(notify <= 4, `unsub 后不再通知(实际 ${notify})`)
})
