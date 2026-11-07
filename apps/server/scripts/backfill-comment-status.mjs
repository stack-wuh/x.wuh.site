/**
 * 一次性数据订正（审计 #568 P0-2 配套，默认 dry-run）：
 * 公开评论端点改为默认只返回 approved 后，需要把「本应公开但被 schema 默认值
 * 卡在 pending」的存量评论归位为 approved。
 *
 * 规则：
 *   1. repo='guestbook'                       → approved（留言板 auto-approve 语义，
 *                                                此前 controller 未显式赋值落到默认 pending）
 *   2. repo=<CONTENT_REPO_NAME> 且 externalId 为纯数字 → approved（GitHub 源评论，
 *                                                syncComment 此前不写 status）
 *   3. 其余（blog 匿名 UUID externalId）        → 保持 pending（真实待审核队列）
 *
 * 用法：
 *   node scripts/backfill-comment-status.mjs           # 预览命中数，不写库
 *   node scripts/backfill-comment-status.mjs --yes     # 实际执行
 */
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env') })

const { MONGO_URI, CONTENT_REPO_NAME = 'blog' } = process.env
const APPLY = process.argv.includes('--yes')

if (!MONGO_URI) {
  console.error('Missing MONGO_URI')
  process.exit(1)
}

await mongoose.connect(MONGO_URI)

// 与 CommentSchema（NestJS SchemaFactory, class Comment）对应的默认集合名
const Comment = mongoose.model('Comment', new mongoose.Schema({}, { strict: false, collection: 'comments' }))

const rules = [
  { name: 'guestbook → approved', filter: { repo: 'guestbook', status: { $ne: 'approved' } } },
  { name: `github-sourced (${CONTENT_REPO_NAME}, numeric externalId) → approved`, filter: { repo: CONTENT_REPO_NAME, status: { $ne: 'approved' }, externalId: { $regex: /^\d+$/ } } },
]

for (const { name, filter } of rules) {
  const count = await Comment.countDocuments(filter)
  if (!APPLY) {
    console.log(`[dry-run] ${name}: ${count} docs`)
    continue
  }
  const { modifiedCount } = await Comment.updateMany(filter, { $set: { status: 'approved' } })
  console.log(`[applied] ${name}: ${modifiedCount} docs updated`)
}

if (!APPLY) {
  console.log('\n预览模式，未写库。确认无误后追加 --yes 执行。')
}

await mongoose.disconnect()
