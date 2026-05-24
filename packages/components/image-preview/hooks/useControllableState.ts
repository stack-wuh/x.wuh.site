import * as React from 'react'

export const useControllableState = <T,>(options: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const { value, defaultValue, onChange } = options
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<T>(defaultValue)

  const state = isControlled ? (value as T) : internalValue

  const setState = React.useCallback(
    (next: React.SetStateAction<T>) => {
      if (isControlled) {
        const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(value as T) : next
        if (nextValue !== value) {
          onChange?.(nextValue)
        }
      } else {
        setInternalValue((prev) => {
          const resolved = typeof next === 'function' ? (next as (prevValue: T) => T)(prev) : next
          if (resolved !== prev) {
            onChange?.(resolved)
          }
          return resolved
        })
      }
    },
    [isControlled, value, onChange]
  )

  return [state, setState]
}
