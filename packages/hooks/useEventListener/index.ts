import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

export type EventTargetLike = EventTarget | Window | Document | HTMLElement | null | undefined
export type TargetRefLike = RefObject<EventTargetLike>
// 'window' | 'document' 为懒解析简写：调用方（含 SSR 渲染期）不触碰浏览器全局，effect 内再解析。
export type UseEventListenerTarget = EventTargetLike | TargetRefLike | 'window' | 'document'

export interface UseEventListenerOptions extends AddEventListenerOptions {
  /** 条件挂载：false 时不建立监听、卸载已有监听（开态临时监听的统一表达） */
  enabled?: boolean
}

interface RefLike {
  current: EventTargetLike
}

const isRefLike = (value: object): value is RefLike => 'current' in value

// ref 的 .current 必须在本 hook 所在 effect 执行前就位（effect 在 DOM 挂载后运行，一般成立）；
// 元素若在挂载后整体重建（如条件切换标签类型），本 hook 不适用，保留手写监听并显式 re-bind。
const resolveTarget = (target: UseEventListenerTarget): EventTarget | undefined => {
  if (target === undefined) {
    return typeof window === 'undefined' ? undefined : window
  }
  if (target === null) {
    return undefined
  }
  if (target === 'window') {
    return typeof window === 'undefined' ? undefined : window
  }
  if (target === 'document') {
    return typeof document === 'undefined' ? undefined : document
  }
  if (typeof target === 'object' && isRefLike(target)) {
    return target.current ?? undefined
  }
  return target as EventTarget
}

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: Window | 'window' | undefined,
  options?: UseEventListenerOptions
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  target: Document | 'document',
  options?: UseEventListenerOptions
): void
export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  target: HTMLElement | RefObject<HTMLElement | null>,
  options?: UseEventListenerOptions
): void
export function useEventListener<E extends Event = Event>(
  eventName: string,
  handler: (event: E) => void,
  target?: UseEventListenerTarget,
  options?: UseEventListenerOptions
): void

// 事件监听统一入口：target 支持 'window'/'document' 简写、元素、ref，省略时默认 window（ahooks 语义）。
// handler 经内部 ref 取最新值，引用变化不触发重绑；enabled/capture/once/passive 以原语参与依赖，
// options 对象身份变化同样不触发重绑。SSR 与 ref 未就位时跳过挂载，effect cleanup 必须移除监听。
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  target?: UseEventListenerTarget,
  options?: UseEventListenerOptions
): void {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  const { capture, once, passive, enabled = true } = options ?? {}

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    const resolved = resolveTarget(target)
    if (!resolved) return

    const listener: EventListener = (event) => handlerRef.current(event)
    const listenerOptions: AddEventListenerOptions = { capture, once, passive }
    resolved.addEventListener(eventName, listener, listenerOptions)
    return () => {
      resolved.removeEventListener(eventName, listener, listenerOptions)
    }
  }, [eventName, target, enabled, capture, once, passive])
}

export default useEventListener
