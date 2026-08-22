'use client'

import message from '@wuh.site/components/message'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const openSharePopup = (url: string, name: string) => {
  if (typeof window === 'undefined') return
  const width = 640
  const height = 520
  const screenLeft = window.screenX ?? window.screenLeft ?? 0
  const screenTop = window.screenY ?? window.screenTop ?? 0
  const outerWidth = window.outerWidth ?? document.documentElement.clientWidth
  const outerHeight = window.outerHeight ?? document.documentElement.clientHeight
  const left = Math.round(screenLeft + Math.max(0, (outerWidth - width) / 2))
  const top = Math.round(screenTop + Math.max(0, (outerHeight - height) / 2))
  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'toolbar=0',
    'location=0',
    'menubar=0',
    'status=0',
    'scrollbars=1',
    'resizable=1',
  ].join(',')

  const popup = window.open(url, name, features)
  if (!popup) {
    message.error('浏览器已阻止分享窗口，请允许弹窗后再试')
    return
  }

  popup.focus()
}

export const openWechatShareWindow = (url: string, title: string) => {
  if (typeof window === 'undefined') return
  const shareWindow = window.open('', 'share-wechat', 'width=360,height=420,toolbar=0,location=0,menubar=0,scrollbars=0,resizable=0')
  if (!shareWindow) {
    message.error('浏览器已阻止分享窗口，请允许弹窗后再试')
    return
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`
  const safeTitle = escapeHtml(title)
  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <title>微信扫码分享</title>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
      background: #f8f8f8;
      color: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .wrapper {
      text-align: center;
      padding: 24px;
    }
    .wrapper h2 {
      margin: 0 0 8px;
      font-size: 18px;
    }
    .wrapper p {
      margin: 4px 0;
      font-size: 13px;
      color: #555;
    }
    .wrapper img {
      width: 240px;
      height: 240px;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>微信扫一扫</h2>
    <p>请在微信中使用“扫一扫”扫描下方二维码</p>
    <img src="${qrSrc}" alt="微信扫码分享" />
    <p>文章：${safeTitle}</p>
    <p style="font-size:12px;color:#888;margin-top:12px;">关闭窗口以返回页面</p>
  </div>
</body>
</html>`

  shareWindow.document.open()
  shareWindow.document.write(html)
  shareWindow.document.close()
  shareWindow.focus()
}
