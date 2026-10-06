import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

/* cursor 域类型清零守卫（build-config.md「组件域守卫配方」audio-player 先例的照搬）：
   根 tsc 的 include 不覆盖 packages/components（无 src/ 目录）——域外空转曾放行
   TS2304 直达生产（#449/#450）。本守卫以域专属 tsconfig 全量编译 cursor，
   断言域内错误为 0；tints 的 import 图拉入 ../themes 等域外文件，其存量错误不扩大打击面。 */

const componentDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(componentDir, '..', '..', '..')
const tscBin = resolve(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc')
const guardConfig = resolve(componentDir, 'tsconfig.guard.json')

test('cursor 域 TypeScript 类型错误清零', () => {
  const result = spawnSync(process.execPath, [tscBin, '-p', guardConfig, '--pretty', 'false'], {
    cwd: componentDir,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  })

  assert.equal(result.error, undefined, `tsc 进程启动失败: ${result.error}`)

  const errorLines = (result.stdout ?? '')
    .split('\n')
    .filter((line) => /^\S+\.tsx?\(\d+,\d+\): error TS\d+/.test(line.trim()))
  // tsc 以 cwd=cursor 运行，诊断行以 ../ 开头的属于域外文件，不计入本域断言
  const inDomain = errorLines.filter((line) => !line.trim().startsWith('../'))

  assert.equal(
    inDomain.length,
    0,
    `cursor 域内出现 TypeScript 错误 ${inDomain.length} 条（全量 ${errorLines.length} 条）：
${errorLines.join('\n')}`
  )
})
