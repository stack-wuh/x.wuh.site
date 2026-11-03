import { useCallback } from 'react'
import { flushSync } from 'react-dom'

export interface UseViewTransitionResult {
  /**
   * 身份变化的内容提交（换幕，change 20261104-style-state-transition-motion）：
   * - 换幕可用（浏览器支持 startViewTransition 且未 reduced-motion）时，
   *   commit 经 startViewTransition 回调内 flushSync 同步提交，浏览器对内容区做交叉淡化；
   * - SSR / 特性不支持 / reduced-motion 三分支直接执行 commit，功能零变化（回落无损）。
   * commit 只包视觉提交（setState 等纯客户端状态写入），不改变数据流语义。
   */
  withTransition: (commit: () => void) => void
}

// 模块级纯实现：闭包不依赖渲染上下文，withTransition 引用跨渲染天然稳定
type ViewTransitionLike = { ready?: Promise<void>; finished?: Promise<void> }
const withTransitionImpl = (commit: () => void): void => {
  if (typeof document === 'undefined') {
    commit()
    return
  }
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => ViewTransitionLike | undefined
  }
  if (typeof doc.startViewTransition !== 'function') {
    commit()
    return
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    commit()
    return
  }
  const transition = doc.startViewTransition(() => {
    flushSync(commit)
  })
  /* 换幕被跳过/中断（连切、文档隐藏、渲染失效）是正常业务态：吸收 ready/finished 拒绝，
     避免 unhandledRejection 噪音；updateCallbackDone 不吞——真实 commit 失败保持响亮 */
  transition?.ready?.catch(() => {})
  transition?.finished?.catch(() => {})
}

// 换幕统一入口：浏览器能力封装（startViewTransition + flushSync 配对），
// 只做视觉提交包装、不掺页面业务流程；消费方为内容区挂 view-transition-name: content-swap。
export const useViewTransition = (): UseViewTransitionResult => {
  const withTransition = useCallback(withTransitionImpl, [])
  return { withTransition }
}

export default useViewTransition
