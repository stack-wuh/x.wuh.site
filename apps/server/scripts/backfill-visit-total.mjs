#!/usr/bin/env node
// 存量迁移：总访问量从 visit_records count 迁移到 visit_stats.global.total 计数器
// （审计 #568 P1-7——visit_records 加 90 天 TTL 后 count 语义会缩水，总访问量
// 与记录解耦）。幂等：仅在计数器缺位时写入，重跑不覆盖已累计值。
// 用法：node scripts/backfill-visit-total.mjs           # dry-run
//       node scripts/backfill-visit-total.mjs --yes     # 落库
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is required');
  process.exit(1);
}
const APPLY = process.argv.includes('--yes');

await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });

const records = mongoose.connection.collection('visit_records');
const stats = mongoose.connection.collection('visit_stats');

const legacyCount = await records.countDocuments({});
const existing = await stats.findOne({ _id: 'global' });

console.log(`visit_records count = ${legacyCount}`);
console.log(`visit_stats.global = ${existing ? JSON.stringify(existing) : '<missing>'}`);

if (existing) {
  console.log('counter already present, nothing to do (幂等：不覆盖已累计值)');
} else if (APPLY) {
  await stats.insertOne({ _id: 'global', total: legacyCount });
  console.log(`done: visit_stats.global.total = ${legacyCount}`);
} else {
  console.log(`dry-run: would set visit_stats.global.total = ${legacyCount} (rerun with --yes to apply)`);
}

await mongoose.disconnect();
