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

/* server 侧 jest spec（白名单渐进收编，20261111 审计批次 5 起）：
   apps/server 的 spec 是 jest 形态（仓内惯例），不在上面的 node:test 枚举内——
   白名单列出收编进 gate 的 spec 文件，spawn jest 逐一执行，退出码透传。
   存量 10 个 spec 尚未甄别漂移，后批单独对账收编；新 server spec 应直接进本清单。
   注意：sync 链路的用例与 webhook spec 同文件承载（jest mock hoisting × ts-jest
   isolatedModules 交互下独立 sync spec 文件稳定 OOM，gate 五轮实证见批次 5 brief）。 */
const serverJestSpecs = [
  'apps/server/src/modules/webhook/webhook.controller.spec.ts'
]

console.log(`run-tests: ${active.length} files in gate, ${quarantined.length} quarantined, ${serverJestSpecs.length} server jest specs`)
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
if (result.status !== 0) {
  console.error(`run-tests: node:test sweep 失败 (exit ${result.status})`)
  process.exit(result.status ?? 1)
}

// server jest sweep（jest 二进制按 apps/server 本地依赖解析）。
// 不用 --runInBand：单进程顺序加载两个 spec 的模块图（mongoose/@nestjs 全家桶×2）
// 会堆爆 4GB（gate 20261112 四轮实证），默认 worker 每文件独立进程内存天然隔离；
// --max-workers=2 控并发，NODE_OPTIONS 限单 worker 堆 4G 双保险
const jestResult = spawnSync(
  resolve(repoRoot, 'apps/server', 'node_modules', '.bin', process.platform === 'win32' ? 'jest.cmd' : 'jest'),
  ['--max-workers', '2', '--silent', ...serverJestSpecs.map((file) => resolve(repoRoot, file))],
  {
    cwd: resolve(repoRoot, 'apps/server'),
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: [process.env.NODE_OPTIONS, '--max-old-space-size=4096'].filter(Boolean).join(' ')
    }
  }
)

if (jestResult.error) {
  console.error(`run-tests: jest spawn 失败: ${jestResult.error}`)
  process.exit(1)
}
process.exit(jestResult.status ?? 1)
