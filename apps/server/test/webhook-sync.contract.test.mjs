/* webhook 签名防线行为契约（审计 #568 P1-1，批次 3 落地 / 批次 5 入 gate）——
   node:test 直载纯函数 util（Nest 装饰器类无法被 strip/transform 通道直载，
   编排面的自动化防线待引入完整 TS loader 基建后另行补齐，批次 5 brief 有记录）。
   曾经的 jest spec 形态在 gate 白名单七轮实证 ts-jest transform 内存不稳（OOM×5），
   故走 sweep 主通道。 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {
  createDeliveryDeduper,
  isWebhookSecretConfigured,
  verifyWebhookSignature,
} from '../src/modules/webhook/webhook-signature.util.ts'

const SECRET = 'test-secret'
const RAW = Buffer.from(JSON.stringify({ action: 'opened', issue: { id: 1, number: 10 } }))

function sign(secret, body) {
  return `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`
}

test('secret 未配置判定：undefined/空串视为未配置', () => {
  assert.equal(isWebhookSecretConfigured(undefined), false)
  assert.equal(isWebhookSecretConfigured(null), false)
  assert.equal(isWebhookSecretConfigured(''), false)
  assert.equal(isWebhookSecretConfigured(SECRET), true)
})

test('合法 raw body 签名放行', () => {
  assert.equal(verifyWebhookSignature(sign(SECRET, RAW), RAW, SECRET), true)
})

test('对 re-serialize JSON 的签名被拒（raw body 契约）', () => {
  const wrongSig = sign(SECRET, Buffer.from(JSON.stringify({ a: 1 }, null, 2)))
  assert.equal(verifyWebhookSignature(wrongSig, RAW, SECRET), false)
})

test('签名缺失被拒', () => {
  assert.equal(verifyWebhookSignature(undefined, RAW, SECRET), false)
})

test('密钥不符被拒（伪造签名防线）', () => {
  assert.equal(verifyWebhookSignature(sign('wrong-secret', RAW), RAW, SECRET), false)
})

test('body 被篡改（签名与内容不匹配）被拒', () => {
  const tampered = Buffer.from(RAW.toString().replace('opened', 'closed'))
  assert.equal(verifyWebhookSignature(sign(SECRET, RAW), tampered, SECRET), false)
})

test('delivery 去重：同 id 窗口内只处理一次', () => {
  const deduper = createDeliveryDeduper()
  assert.equal(deduper.seen('d1', 1000), false)
  assert.equal(deduper.seen('d1', 2000), true)
  assert.equal(deduper.seen('d2', 2000), false)
})

test('delivery 去重：窗口过期后放行重投', () => {
  const deduper = createDeliveryDeduper()
  assert.equal(deduper.seen('d1', 1000), false)
  assert.equal(deduper.seen('d1', 1000 + 1000), true)
  assert.equal(deduper.seen('d1', 1000 + 5 * 60 * 1000), false)
})
