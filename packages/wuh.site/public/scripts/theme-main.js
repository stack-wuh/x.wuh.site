;(function () {
  const docCookies = {
    getItem: function (sKey) {
      return (
        decodeURIComponent(
          document.cookie.replace(
            new RegExp(
              '(?:(?:^|.*;)\\s*' +
                encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
                '\\s*\\=\\s*([^;]*).*$)|^.*$'
            ),
            '$1'
          )
        ) || null
      )
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false
      }
      var sExpires = ''
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires =
              vEnd === Infinity
                ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
                : '; max-age=' + vEnd
            break
          case String:
            sExpires = '; expires=' + vEnd
            break
          case Date:
            sExpires = '; expires=' + vEnd.toUTCString()
            break
        }
      }
      document.cookie =
        encodeURIComponent(sKey) +
        '=' +
        encodeURIComponent(sValue) +
        sExpires +
        (sDomain ? '; domain=' + sDomain : '') +
        (sPath ? '; path=' + sPath : '') +
        (bSecure ? '; secure' : '')
      return true
    },
  }
  window.__set_cookie__ = docCookies.setItem
  window.__get_cookie__ = docCookies.getItem

  if (window.Worker) {
    const worker = new Worker('/scripts/theme-worker.js')
    const $target = document.querySelector('html')
    const cookieTheme = docCookies.getItem('data-theme-mode') || 'light'

    /**
     * 文档加载完成之后立即开始任务
     */
    window.addEventListener(
      'load',
      () => {
        window.__timer__load = null
        worker.postMessage({
          init: true,
          close: false,
          theme: cookieTheme,
          from: 'load',
        })
      },
      false
    )

    /**
     *
     * Tab隐藏之后终结任务，可见后开始任务
     */
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (window.__timer_visibility) {
          clearInterval(window.__timer_visibility)
        }

        worker.postMessage({
          init: true,
          close: false,
          theme: cookieTheme,
          from: 'visibility',
        })
      } else {
        if (window.__timer_load) {
          this.clearInterval(window.__timer_load)
        }

        if (window.__timer_visibility) {
          this.clearInterval(window.__timer_visibility)
        }

        worker.postMessage({
          init: false,
          close: true,
          theme: cookieTheme,
          from: 'load',
          timer: window.__timer__load,
        })
      }
    })

    worker.onmessage = function (e) {
      console.log('====== [main.js], 主线程接收通讯')
      const { theme, from, timerId } = e.data
      window['__timer_' + from] = timerId

      $target.setAttribute('data-theme-mode', theme)
      docCookies.setItem('data-theme-mode', theme)
    }

    worker.onmessageerror = function (e) {
      console.error('====== [main.js], 主线程接收失败. 原因: ', e)
    }
  } else {
    console.error(
      '====== [main.js] web worker 任务注册失败, 当前浏览器不支持web worker'
    )
  }
})()
