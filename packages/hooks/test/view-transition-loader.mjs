// react / react-dom 定制解析桩（change 20261104-style-state-transition-motion）：
// hooks 包按仓内惯例零依赖声明（react 系由消费端解析），契约测试需行为导入 hook 源码，
// 故经 module.register 把两个裸说明符重定向到忠实语义桩——
// flushSync 契约 = 同步执行 fn 并透传返回值/异常，useCallback 契约 = 返回原函数引用。
const reactStub = 'export const useCallback = (fn) => fn\nexport default { useCallback }'
const reactDomStub = 'export const flushSync = (fn) => fn()'

export async function resolve(specifier, context, next) {
  if (specifier === 'react') {
    return { shortCircuit: true, url: 'data:text/javascript,' + encodeURIComponent(reactStub) }
  }
  if (specifier === 'react-dom') {
    return { shortCircuit: true, url: 'data:text/javascript,' + encodeURIComponent(reactDomStub) }
  }
  return next(specifier, context)
}
