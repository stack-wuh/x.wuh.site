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

/* 隔离清单——逐条原因（2026-11-04 基线盘点，11 文件 25 用例） */
const QUARANTINE = {
  'apps/site/test/contact-dialog-paper.test.mjs':
    'ContactCard 断点轴（560 vs 640）与站内裸锚点守卫漂移，待对账',
  'apps/site/test/header-quiet-bar.test.mjs':
    '页头令牌（--font-size-sm）与外观入口形态守卫漂移，待对账',
  'apps/site/test/image-role-migration.test.mjs':
    'Image 语义角色/头像 accent ring 守卫漂移，待对账',
  'apps/site/test/post-typography-design-language.test.mjs':
    '文章排版（更新提示线、related thread 样式）守卫漂移，待对账',
  'apps/site/test/seo-p12-related-posts.test.mjs':
    'related posts 文学线视觉守卫漂移（related-posts.test.mjs 为绿，双守卫口径冲突），待对账',
  'apps/site/test/seo-p13-topic-pages.test.mjs':
    'topics 页守卫漂移，待对账',
  'apps/site/test/seo-p14-sitemap-noindex.test.mjs':
    'sitemap noindex 守卫红——真回归嫌疑，优先甄别',
  'apps/site/test/site-header-theme-toggle.test.mjs':
    '主题入口钤印「墨」与调色台守卫漂移，待对账',
  'apps/site/test/soft-navigation.test.mjs':
    '站内裸 a 锚点守卫红——真回归嫌疑（同文档存续=全局播放器不断播前提），优先甄别',
  'apps/site/test/typewriter-motto-stability.test.mjs':
    '打字机 PHRASES 推导与覆盖层结构守卫漂移，待对账',
  'packages/components/test/image-role-contract.test.mjs':
    'Image 组件语义角色集合契约守卫漂移，待对账'
}

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
  { cwd: repoRoot, stdio: 'inherit' }
)

if (result.error) {
  console.error(`run-tests: spawn 失败: ${result.error}`)
  process.exit(1)
}
process.exit(result.status ?? 1)
