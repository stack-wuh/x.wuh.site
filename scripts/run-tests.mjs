import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/* 质量门测试 sweep（20261107-chore-audit-quality-gates，审计 #568 P0-4/P1-31）。
   枚举全仓 node:test 测试文件交 `node --test` 逐一执行，退出码透传——隔离清单外的
   任何红文件都会让 quality-gate 变红。

   隔离棘轮（INV-4）：QUARANTINE 内是 2026-11-04 审计盘点时已知红、待对账的守卫文件，
   每条必须写明原因（漂移=断言落后于有意的设计演进；真回归嫌疑=需优先甄别）。
   清单只准缩小不准扩大：对账修复一个就删一条；新测试文件不允许进清单。 */

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const testDirs = [
  'apps/site/test',
  'packages/hooks/test',
  'packages/components/test'
]
// 域类型清零守卫（spawn tsc 的语义守卫，见 audio-player/typecheck.test.mjs 头注释）
const extraTestFiles = [
  'packages/components/audio-player/typecheck.test.mjs',
  'packages/components/cursor/typecheck.test.mjs'
]

/* 隔离清单——20261107-test-guard-realign-batch2 对账后清零（11→0，棘轮单调不增保持）：
   seo-p14 甄别为 SGN 环境误报直接出清单；其余 10 文件 22 红全为守卫漂移，断言等强对齐后回 gate。
   新测试文件不允许进清单；再有漂移按对账三分类处理（漂移/真回归/环境误报）。 */
const QUARANTINE = {}

const listTests = (dir) =>
  readdirSync(join(repoRoot, dir))
    .filter((name) => name.endsWith('.test.mjs'))
    .map((name) => join(dir, name))

const testFiles = [...testDirs.flatMap(listTests), ...extraTestFiles]
  .map((file) => relative(repoRoot, resolve(repoRoot, file)))
  .sort()

const active = testFiles.filter((file) => !(file in QUARANTINE))
const quarantined = testFiles.filter((file) => file in QUARANTINE)

console.log(`run-tests: ${active.length} files in gate, ${quarantined.length} quarantined`)
for (const file of quarantined) {
  console.log(`  quarantined: ${file} — ${QUARANTINE[file]}`)
}

const result = spawnSync(
  process.execPath,
  ['--test', ...active.map((file) => resolve(repoRoot, file))],
  {
    cwd: repoRoot,
    stdio: 'inherit',
    // workspace 包钉源码单源 + 相对导入补 .ts（见 scripts/test-resolve.mjs 头注释）；
    // transform-types：core 源码含 TS enum（UserRole），strip-only 不支持
    env: {
      ...process.env,
      NODE_OPTIONS: ['--import', resolve(repoRoot, 'scripts', 'test-register.mjs'), '--experimental-transform-types'].join(' ')
    }
  }
)

if (result.error) {
  console.error(`run-tests: spawn 失败: ${result.error}`)
  process.exit(1)
}
process.exit(result.status ?? 1)
