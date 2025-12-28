let timer = null
onmessage = function (e) {
  console.log('======== [work.js] web worker 任务已开始')
  const MAX_TIMEOUT = 1 * 60 * 60 * 1000
  const originName = e.data.from
  let initTheme = e.data.theme
  let theme = null
  let count = 0

  const getTheme = mode => {
    return mode === 'light' ? 'dark' : 'light'
  }

  if (!theme) {
    theme = getTheme(initTheme)
  }

  const clear = () => {
    console.log(
      `======== [work.js][${originName}] 任务在第[${count}]轮被终结了`
    )
    this.clearInterval(timer)
  }

  const called = () => {
    if (timer) {
      clear()
    }
    timer = this.setInterval(() => {
      if (theme) {
        theme = getTheme(theme)
      }

      this.postMessage({
        from: originName,
        theme,
        timerId: timer,
        tracetime: new Date().getTime(),
      })
      console.log(
        `========== [work.js][${originName}] 任务成功执行, 第${++count}次`
      )
    }, MAX_TIMEOUT)
  }

  if (e.data.init) {
    called()
  }

  if (e.data.close) {
    clear()
  }
}
