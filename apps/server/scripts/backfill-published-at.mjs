#!/usr/bin/env node
// 存量数据回填：publishedAt 全服务端无写入路径（审计 #568 P1-10），
// schema 有字段但历史记录恒空——"最近日志"与热力图发布数不工作。
// 回填规则：publishedAt=null → 置为该记录的 createdAtGitHub（issue 创建时间
// 即发布时间，与站点 PostView 口径一致）。
// 用法：node scripts/backfill-published-at.mjs           # dry-run 只打印
//       node scripts/backfill-published-at.mjs --yes     # 落库
// 与 backfill-comment-status.mjs 同构；生产在服务器上执行。
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is required');
  process.exit(1);
}
const APPLY = process.argv.includes('--yes');

await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });

// content schema 落 collection 'blogs'（content.schema.ts @Schema 显式指定）
const Content = mongoose.connection.collection('blogs');
const targets = await Content
  .find({ publishedAt: { $in: [null, undefined] }, createdAtGitHub: { $type: 'date' } })
  .project({ number: 1, title: 1, createdAtGitHub: 1 })
  .toArray();

console.log(`found ${targets.length} doc(s) with publishedAt missing`);

let updated = 0;
for (const doc of targets) {
  if (APPLY) {
    await Content.updateOne(
      { _id: doc._id },
      { $set: { publishedAt: doc.createdAtGitHub } },
    );
    updated += 1;
  }
  console.log(`  #${doc.number} ${doc.title} → publishedAt=${doc.createdAtGitHub?.toISOString?.() ?? doc.createdAtGitHub}`);
}

console.log(APPLY ? `done: ${updated} docs updated` : `dry-run: ${targets.length} doc(s) would be updated (rerun with --yes to apply)`);
await mongoose.disconnect();
