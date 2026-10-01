import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

/* audio-player 域类型清零守卫（语义守卫）：tsc 以域专属 tsconfig 全量编译本目录，
   断言域内错误为 0。漏引标识符（TS2304）、ref 错型（TS2769）等由编译器结构性拦阻，
   不依赖源码正则镜像实现——正则守卫只断言用法存在、不断言 import，曾放行
   MARQUEE_SPEED_PX_PER_S 漏引直达生产（#450）。域外存量错误（locales/progress 等）
   不在此断言范围，另行治理。 */

const componentDir = dirname(fileURLToPath(import.meta.url))
const packageDir = resolve(componentDir, '..')
const repoRoot = resolve(packageDir, '..', '..')
const tscBin = resolve(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc')
const guardConfig = resolve(componentDir, 'tsconfig.guard.json')

test('audio-player 域 TypeScript 类型错误清零', () => {
  const result = spawnSync(process.execPath, [tscBin, '-p', guardConfig, '--pretty', 'false'], {
    cwd: componentDir,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  })

  assert.equal(result.error, undefined, `tsc 进程启动失败: ${result.error}`)

  const errorLines = (result.stdout ?? '')
    .split('\n')
    .filter((line) => /^\S+\.tsx?\(\d+,\d+\): error TS\d+/.test(line.trim()))
  // tsc 以 cwd=audio-player 运行，诊断行以 ../ 开头的属于域外文件，不扩大打击面
  const inDomain = errorLines.filter((line) => !line.trim().startsWith('../'))

  assert.equal(
    inDomain.length,
    0,
    `audio-player 域内出现 TypeScript 错误 ${inDomain.length} 条（全量 ${errorLines.length} 条）：
${errorLines.join('\n')}`
  )
})
