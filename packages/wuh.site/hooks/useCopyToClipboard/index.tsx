import { useState, useCallback, useEffect } from 'react'

const useCopyToClipboard = (value: string): [any, any] => {
  const [isCopied, setisCopied] = useState(false)

  const copyToClipboard = (str: string) => {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', 'true')
    el.setAttribute(
      'style',
      'position: absolute; left: -999999px; z-index: -9999;'
    )
    document.body.appendChild(el)
    el.select()
    const success = document.execCommand('copy')
    document.body.removeChild(el)

    console.log(`%c 以下内容已复制到了剪切板: ${str}`, 'color: red;')
    return success
  }

  const copy = useCallback(() => {
    if (!isCopied) {
      setisCopied(copyToClipboard(value))
    }
  }, [value])

  useEffect(() => {
    setisCopied(false)
  }, [value])

  return [isCopied, copy]
}

export default useCopyToClipboard
