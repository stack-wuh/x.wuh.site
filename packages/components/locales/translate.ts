/**
 * 词典查找与文案插值的纯函数层。
 * 与 React 解耦：node --test 可直读（类型可剥离），LocaleProvider 只做接线。
 */

/** 点路径取词典叶子；路径中断或叶子非字符串返回 undefined。 */
export function resolvePath(dict: unknown, key: string): string | undefined {
  let node: unknown = dict
  for (const part of key.split('.')) {
    if (node == null || typeof node !== 'object') return undefined
    node = (node as Record<string, unknown>)[part]
  }
  return typeof node === 'string' ? node : undefined
}

/** 替换 {name} 占位符；params 未提供或占位符未命名的原样保留。 */
export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  )
}

export interface TranslateDicts {
  zh: unknown
  en?: unknown
  ja?: unknown
}

/**
 * 运行时缺 key 回落中文（zh 为类型基准、en/ja 为 Partial 的运行时对应物）；
 * 中文也缺时返回 key 本身，让缺失在界面上可见而非静默空白。
 */
export function translate(
  dicts: TranslateDicts,
  locale: keyof TranslateDicts,
  key: string,
  params?: Record<string, string | number>
): string {
  const current = resolvePath(dicts[locale], key) ?? resolvePath(dicts.zh, key)
  if (current === undefined) return key
  return interpolate(current, params)
}
