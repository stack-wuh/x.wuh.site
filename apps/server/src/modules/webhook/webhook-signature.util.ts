import * as crypto from 'crypto';

/* GitHub webhook 签名校验与 delivery 去重（审计 #568 P1-1，批次 3 落地）。
   纯函数面独立成 util：Nest 装饰器类无法被 node:test 直载（legacy 装饰器不支持
   strip/transform），行为契约经 apps/server/test/webhook-sync.contract.test.mjs 钉住。 */

/** delivery 去重窗口与容量（GitHub 至少一次投递会重投同一事件） */
const DEDUP_WINDOW_MS = 5 * 60 * 1000;
const DEDUP_MAX_ENTRIES = 1000;

/** 密钥未配置时公网端点等于无签名裸奔——调用方 fail-fast 拒绝处理 */
export function isWebhookSecretConfigured(
  secret: string | undefined | null,
): secret is string {
  return typeof secret === 'string' && secret.length > 0;
}

/** 签名对原始请求字节校验（GitHub 对 raw body 计算 HMAC），timingSafeEqual 防时序侧信道 */
export function verifyWebhookSignature(
  signature: string | undefined,
  rawBody: Buffer,
  secret: string,
): boolean {
  if (!signature) return false;
  const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const expected = Buffer.from(`sha256=${hash}`, 'utf8');
  const received = Buffer.from(signature, 'utf8');
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export interface DeliveryDeduper {
  /** 窗口内见过该 id 返回 true（重复投递）；否则记入并返回 false */
  seen(deliveryId: string, now?: number): boolean;
}

/** 内存版 delivery 去重器：5 分钟窗口 + 容量上限（超限先淘汰过期，仍超则清空兜底） */
export function createDeliveryDeduper(
  windowMs = DEDUP_WINDOW_MS,
  maxEntries = DEDUP_MAX_ENTRIES,
): DeliveryDeduper {
  const seen = new Map<string, number>();
  return {
    seen(deliveryId, now = Date.now()): boolean {
      if (seen.size > maxEntries) {
        for (const [id, ts] of seen) {
          if (now - ts > windowMs) seen.delete(id);
        }
        if (seen.size > maxEntries) seen.clear();
      }
      const hit = seen.get(deliveryId);
      if (hit !== undefined && now - hit < windowMs) return true;
      seen.set(deliveryId, now);
      return false;
    },
  };
}
