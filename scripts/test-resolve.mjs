import { existsSync } from 'node:fs'
import { dirname as pathDirname, resolve as pathResolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/* 质量门测试 sweep 的解析钩子（与 scripts/run-tests.mjs 配套，20261107-chore-audit-quality-gates）。

   背景：node:test 直载 TS 源码（strip-types）时，workspace 包走 package.json main——
   core 的 main 指向 dist/index.js（产物不入库，fresh clone 必 ERR_MODULE_NOT_FOUND，
   审计 #568 P1-22 双解析面）。本钩子把测试链路统一钉到源码单源：
   1. `@wuh.site/core` → packages/core/src/index.ts（连带 dto/site 子模块）
   2. `@wuh.site/hooks/*` → packages/hooks/<sub>（exports "./*" 无扩展名，补 .ts）
   3. 相对导入缺扩展名 → 依次试 .ts / .tsx / /index.ts（bundler 风格源码 vs node 显式扩展名）
   P1-22 根治（core main/types 统一指向 + prepare 构建）落地后，规则 1 可退役。 */

const repoRoot = pathResolve(pathDirname(fileURLToPath(import.meta.url)), '..')

const tryCandidates = (base, specifier, context, nextResolve) => {
  for (const suffix of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
    const candidate = pathResolve(base, `${specifier}${suffix}`)
    if (existsSync(candidate)) {
      return { url: pathToFileURL(candidate).href, shortCircuit: true }
    }
  }
  return nextResolve(specifier, context)
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@wuh.site/core') {
    return {
      url: pathToFileURL(pathResolve(repoRoot, 'packages/core/src/index.ts')).href,
      shortCircuit: true
    }
  }
  if (specifier.startsWith('@wuh.site/hooks/')) {
    return tryCandidates(pathResolve(repoRoot, 'packages/hooks'), specifier.slice('@wuh.site/hooks/'.length), context, nextResolve)
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[cm]?[jt]s$/.test(specifier)) {
    const parentDir = context.parentURL ? pathDirname(fileURLToPath(context.parentURL)) : repoRoot
    return tryCandidates(parentDir, specifier, context, nextResolve)
  }
  return nextResolve(specifier, context)
}
