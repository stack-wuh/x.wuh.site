import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const source = readFileSync(new URL('./apiBase.ts', import.meta.url), 'utf8')
const js = source
  .replace(/export type ApiBaseEnv = \{[\s\S]*?\}\n\n/, '')
  .replace('export function resolveApiBase(env: ApiBaseEnv = process.env): string {', 'function resolveApiBase(env = process.env) {')
  .replace(/export const API_BASE = resolveApiBase\(\)\n?/, '')

const context = { process: { env: {} } }
vm.runInNewContext(`${js}\nthis.resolveApiBase = resolveApiBase`, context)
const { resolveApiBase } = context

assert.equal(resolveApiBase({ NEST_API_URL: 'https://api.example.com/v2', NODE_ENV: 'production' }), 'https://api.example.com/v2')
assert.equal(resolveApiBase({ NEST_API_URL: '  https://api.example.com/v2  ', NODE_ENV: 'production' }), 'https://api.example.com/v2')
assert.equal(resolveApiBase({ NODE_ENV: 'production' }), 'http://nest:3200/v2')
assert.equal(resolveApiBase({ NODE_ENV: 'development' }), 'http://localhost:3200/v2')
assert.equal(resolveApiBase({}), 'http://localhost:3200/v2')

console.log('apiBase fallback tests passed')
