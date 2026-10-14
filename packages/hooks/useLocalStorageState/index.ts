import { useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

/**
 * 读 localStorage 原始串：SSR / 键缺失 / 抛异常（隐私模式）一律静默返回 undefined。
 * validate 用于白名单值校验（如 'en'|'ja'），不通过同样归为 undefined——调用方回落初始值。
 */
export const readStorage = (key: string, validate?: (raw: string) => boolean): string | undefined => {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return undefined
    if (validate && !validate(raw)) return undefined
    return raw
  } catch {
    return undefined
  }
}

/** 写 localStorage（值已是字符串；非字符串由调用方自控 String() 序列化）。SSR 跳过、异常静默。 */
export const writeStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // 存储不可用（隐私模式/配额）：当前会话状态照常工作
  }
}

export interface UseLocalStorageStateOptions<T> {
  /** 原始串 → T；返回 undefined 视为无效值，回落 initialValue。默认直通（T 即 string） */
  deserialize?: (raw: string) => T | undefined
  /** T → 存储串。默认 String(value) */
  serialize?: (value: T) => string
}

/**
 * localStorage 同步读写状态：useState 惰性初始化同步读存储（SSR 渲染返回 initialValue，
 * 水合差异由消费方现状负责），setState 后 write-through 同步落存储。
 * 只覆盖「状态变化即持久化」语义；延迟写（仅提交成功后落盘）的站点用底层 readStorage/writeStorage。
 * serialize/deserialize 经 ref 取最新值，函数身份变化不触发额外读写。
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageStateOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>] {
  const deserializeRef = useRef(options.deserialize)
  deserializeRef.current = options.deserialize
  const serializeRef = useRef(options.serialize)
  serializeRef.current = options.serialize

  const [value, setValue] = useState<T>(() => {
    const raw = readStorage(key)
    if (raw === undefined) return initialValue
    return deserializeRef.current ? deserializeRef.current(raw) ?? initialValue : (raw as T)
  })

  useEffect(() => {
    writeStorage(key, serializeRef.current ? serializeRef.current(value) : String(value))
  }, [key, value])

  return [value, setValue]
}

export { useLocalStorageState as default }
