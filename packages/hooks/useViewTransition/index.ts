import { useCallback } from 'react'
import { flushSync } from 'react-dom'

export interface UseViewTransitionResult {
  /**
   * 身份变化的内容提交（换幕，change 20261104-style-state-transition-motion）：
   * - 换幕可用（浏览器支持 startViewTransition 且未 reduced-motion）时，
   *   commit 经 startViewTransition 回调内 flushSync 同步提交，浏览器对内容区做交叉淡化；
   * - SSR / 特性不支持 / reduced-motion 三分支直接执行 commit，功能零变化（回落无损）。
   * commit 只包视觉提交（setState 等纯客户端状态写入），不改变数据流语义。
   * 换幕期间 html 挂 data-vt-scoped，MotionStyles 借此把整页 root 过渡压到 0——
   * startViewTransition 会快照整页，不抑制则硬导航的 600ms 整页淡出会一并触发（全屏闪动）。
   * 消费方只需给内容区挂 view-transition-name，无需感知该属性。
   */
  withTransition: (commit: () => void) => void
}

// 模块级纯实现：闭包不依赖渲染上下文，withTransition 引用跨渲染天然稳定
type ViewTransitionLike = { ready?: Promise<void>; finished?: Promise<void> }

/* 手动换幕抑制整页 root 过渡：startViewTransition 每次都会快照整个页面，
   MotionStyles 给 root 定的是硬导航用的 600ms 淡出+上浮——不抑制就会整页闪。
   标记挂在 html 上（CSS 侧 html[data-vt-scoped] 把 root 过渡压到 0），
   finished 后移除；连切时由下一轮覆盖，只认最新一次的引用计数。 */
const VT_SCOPED_ATTR = 'data-vt-scoped'
let activeTransitions = 0
const setScoped = (on: boolean) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (!root) return
  activeTransitions = Math.max(0, activeTransitions + (on ? 1 : -1))
  if (activeTransitions > 0) root.setAttribute(VT_SCOPED_ATTR, '')
  else root.removeAttribute(VT_SCOPED_ATTR)
}

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
  setScoped(true)
  let transition: ViewTransitionLike | undefined
  try {
    transition = doc.startViewTransition(() => {
      flushSync(commit)
    })
  } catch (error) {
    /* 同步抛错（能力异常/被策略拦截）：解除抑制后原样抛出，不吞真实失败 */
    setScoped(false)
    throw error
  }
  /* 换幕被跳过/中断（连切、文档隐藏、渲染失效）是正常业务态：吸收 ready/finished 拒绝，
     避免 unhandledRejection 噪音；updateCallbackDone 不吞——真实 commit 失败保持响亮 */
  transition?.ready?.catch(() => {})
  transition?.finished?.catch(() => {})
  /* finished 必达（正常结束或被跳过），解除抑制；同步失败分支也兜底解除 */
  Promise.resolve(transition?.finished).catch(() => {}).finally(() => setScoped(false))
}

// 换幕统一入口：浏览器能力封装（startViewTransition + flushSync 配对），
// 只做视觉提交包装、不掺页面业务流程；消费方为内容区挂 view-transition-name: content-swap。
export const useViewTransition = (): UseViewTransitionResult => {
  const withTransition = useCallback(withTransitionImpl, [])
  return { withTransition }
}

export default useViewTransition
