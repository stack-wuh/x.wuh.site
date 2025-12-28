/** 允许格式化的地址 */
export const allowPaths = ['post']

export const formatter = url => {
  if (window.hljs && allowPaths.some(s => url.includes(s))) {
    window.hljs.highlightAll()
  }
}

export const toggleTheme = () => {
  const $html = document.querySelector('html')
  const $target = document.querySelector('#theme-hljs-id')
  const currentMode = $html.getAttribute('data-theme-mode')

  const prefix = 'https://src.wuh.site/stylesheet'
  const url = `${prefix}/${
    currentMode === 'light' ? 'github' : 'github-dark'
  }.min.css`
  $target.setAttribute('href', url)
  $target.setAttribute('data-id', Math.random().toString(32).slice(3))
}
