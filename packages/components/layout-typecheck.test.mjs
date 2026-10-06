import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// 布局组件域（themes/responsive + flex + row + col + stagger）类型清零守卫。
// 根 `tsc --noEmit` 的 include 仅覆盖 packages 下的 src 目录，而 packages/components 无 src/，
// 布局域从不被根命令覆盖——#449/#450 型空转漏检（site 又 ignoreBuildErrors）。
// 本守卫以域专属 tsconfig 全量编译布局文件，结构性拦阻漏引（TS2304）、ref 错型（TS2769）、
// undefined 顶层赋值（TS2322）等，不依赖源码正则镜像实现。域外组件不在此断言范围。

const packageDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(packageDir, '..', '..')
const tscBin = resolve(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc')
const guardConfig = resolve(packageDir, 'tsconfig.layout.guard.json')

test('布局组件域 TypeScript 类型错误清零', () => {
  const result = spawnSync(process.execPath, [tscBin, '-p', guardConfig, '--pretty', 'false'], {
    cwd: packageDir,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  })

  assert.equal(result.error, undefined, `tsc 进程启动失败: ${result.error}`)

  const errorLines = (result.stdout ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\S+\.tsx?\(\d+,\d+\): error TS\d+/.test(line))
  // 诊断行以 ../ 开头属域外文件（其他组件包），不扩大打击面
  const inDomain = errorLines.filter((line) => !line.startsWith('../'))

  assert.equal(
    inDomain.length,
    0,
    `布局域内出现 TypeScript 错误 ${inDomain.length} 条（全量 ${errorLines.length} 条）：\n${inDomain.join('\n')}`,
  )
})
