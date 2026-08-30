import QRCode from 'qrcode'
import type { ShareCardData } from './specs'

const CARD_WIDTH = 1080
const CARD_HEIGHT = 1440
const PADDING = 72
const COVER_HEIGHT = 460
const CONTENT_WIDTH = CARD_WIDTH - PADDING * 2

const COLORS = {
  primary: '#C94A44',
  accent: '#E3B567',
  background: '#FFFBF8',
  backgroundAlt: '#FDF3EC',
  textPrimary: '#2A1E16',
  textSecondary: '#8A6E5C',
  textMuted: '#B9A998',
  border: '#D4C8B8',
} as const

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = []
  for (const paragraph of text.split('\n')) {
    if (!paragraph.trim()) {
      lines.push('')
      continue
    }
    let current = ''
    for (const char of paragraph) {
      const test = current + char
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current)
        current = char
      } else {
        current = test
      }
    }
    if (current) lines.push(current)
  }
  return lines
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.arcTo(x + w, y, x + w, y + radius, radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
  ctx.lineTo(x + radius, y + h)
  ctx.arcTo(x, y + h, x, y + h - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.closePath()
}

function drawMountainOrnament(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  width: number,
  color: string,
): void {
  const segW = width / 4
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.globalAlpha = 0.38
  ctx.beginPath()
  for (let i = 0; i <= 4; i++) {
    const x = cx - width / 2 + i * segW
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      const midX = x - segW / 2
      ctx.quadraticCurveTo(midX, y - 14, x, y)
    }
  }
  ctx.stroke()

  ctx.globalAlpha = 0.2
  ctx.beginPath()
  const y2 = y + 10
  for (let i = 0; i <= 4; i++) {
    const x = cx - width / 2 + i * segW
    if (i === 0) {
      ctx.moveTo(x, y2)
    } else {
      const midX = x - segW / 2
      ctx.quadraticCurveTo(midX, y2 - 10, x, y2)
    }
  }
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
): void {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  const imgRatio = img.width / img.height
  let drawW = radius * 2
  let drawH = radius * 2
  if (imgRatio > 1) {
    drawW = drawH * imgRatio
  } else {
    drawH = drawW / imgRatio
  }
  ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH)
  ctx.restore()
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  ctx.save()
  drawRoundRect(ctx, x, y, w, h, radius)
  ctx.clip()
  const imgRatio = img.width / img.height
  const containerRatio = w / h
  let drawW = w
  let drawH = h
  let drawX = x
  let drawY = y
  if (imgRatio > containerRatio) {
    drawW = h * imgRatio
    drawX = x - (drawW - w) / 2
  } else {
    drawH = w / imgRatio
    drawY = y - (drawH - h) / 2
  }
  ctx.drawImage(img, drawX, drawY, drawW, drawH)
  ctx.restore()
}

function drawCoverFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
): void {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h)
  grad.addColorStop(0, COLORS.backgroundAlt)
  grad.addColorStop(1, hexToRgba(COLORS.accent, 0.18))
  ctx.fillStyle = grad
  drawRoundRect(ctx, x, y, w, h, 16)
  ctx.fill()

  drawMountainOrnament(ctx, x + w / 2, y + 44, 180, COLORS.accent)

  ctx.fillStyle = COLORS.textPrimary
  ctx.font = '700 46px Georgia, "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const lines = wrapText(ctx, title, w - 80)
  const maxLines = 3
  const lineHeight = 62
  const totalHeight = Math.min(lines.length, maxLines) * lineHeight
  let ty = y + h / 2 - totalHeight / 2 + lineHeight / 2
  for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
    ctx.fillText(lines[i], x + w / 2, ty)
    ty += lineHeight
  }
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
}

async function generateQR(
  text: string,
  size: number,
): Promise<HTMLCanvasElement | null> {
  try {
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, text, {
      width: size,
      margin: 2,
      color: { dark: COLORS.textPrimary, light: COLORS.background },
      errorCorrectionLevel: 'M',
    })
    return canvas
  } catch {
    return null
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function drawTextWithEllipsis(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
): void {
  let line = text
  if (ctx.measureText(line).width > maxWidth) {
    while (ctx.measureText(line + '…').width > maxWidth && line.length > 0) {
      line = line.slice(0, -1)
    }
    line += '…'
  }
  ctx.fillText(line, x, y)
}

export async function drawShareCard(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT

  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready
    } catch {
      /* ignore */
    }
  }

  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  const bgGrad = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  bgGrad.addColorStop(0, COLORS.background)
  bgGrad.addColorStop(1, COLORS.backgroundAlt)
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  const rGrad = ctx.createRadialGradient(
    CARD_WIDTH * 0.85, 0, 0,
    CARD_WIDTH * 0.85, 0, CARD_WIDTH * 0.6,
  )
  rGrad.addColorStop(0, hexToRgba(COLORS.accent, 0.1))
  rGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = rGrad
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  const rGrad2 = ctx.createRadialGradient(
    0, CARD_HEIGHT, 0,
    0, CARD_HEIGHT, CARD_WIDTH * 0.5,
  )
  rGrad2.addColorStop(0, hexToRgba(COLORS.accent, 0.07))
  rGrad2.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = rGrad2
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  let yCursor = PADDING

  if (data.cover) {
    const coverImg = await loadImage(data.cover)
    if (coverImg) {
      drawCoverImage(ctx, coverImg, PADDING, yCursor, CONTENT_WIDTH, COVER_HEIGHT, 16)
      const overlayGrad = ctx.createLinearGradient(
        0, yCursor + COVER_HEIGHT - 100,
        0, yCursor + COVER_HEIGHT,
      )
      overlayGrad.addColorStop(0, 'rgba(0,0,0,0)')
      overlayGrad.addColorStop(1, hexToRgba(COLORS.background, 0.4))
      ctx.fillStyle = overlayGrad
      drawRoundRect(ctx, PADDING, yCursor + COVER_HEIGHT - 100, CONTENT_WIDTH, 100, 0)
      ctx.fill()
    } else {
      drawCoverFallback(ctx, PADDING, yCursor, CONTENT_WIDTH, COVER_HEIGHT, data.title)
    }
  } else {
    drawCoverFallback(ctx, PADDING, yCursor, CONTENT_WIDTH, COVER_HEIGHT, data.title)
  }
  yCursor += COVER_HEIGHT + 40

  drawMountainOrnament(ctx, CARD_WIDTH / 2, yCursor, 200, COLORS.accent)
  yCursor += 46

  if (data.labels.length > 0) {
    ctx.font = '500 24px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const labelGap = 12
    const labelHeight = 38
    let labelX = PADDING
    for (const label of data.labels.slice(0, 5)) {
      const textWidth = ctx.measureText(label.name).width
      const pillWidth = textWidth + 30
      if (labelX + pillWidth > PADDING + CONTENT_WIDTH) break
      ctx.fillStyle = hexToRgba(COLORS.primary, 0.08)
      drawRoundRect(ctx, labelX, yCursor, pillWidth, labelHeight, labelHeight / 2)
      ctx.fill()
      ctx.fillStyle = COLORS.primary
      ctx.fillText(label.name, labelX + 15, yCursor + labelHeight / 2 + 1)
      labelX += pillWidth + labelGap
    }
    yCursor += labelHeight + 28
  }

  ctx.fillStyle = COLORS.textPrimary
  ctx.font = '700 50px Georgia, "Noto Serif SC", serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  const titleLines = wrapText(ctx, data.title, CONTENT_WIDTH)
  const maxTitleLines = 3
  const titleLineHeight = 66
  for (let i = 0; i < Math.min(titleLines.length, maxTitleLines); i++) {
    if (i === maxTitleLines - 1 && titleLines.length > maxTitleLines) {
      drawTextWithEllipsis(ctx, titleLines[i], PADDING, yCursor, CONTENT_WIDTH)
    } else {
      ctx.fillText(titleLines[i], PADDING, yCursor)
    }
    yCursor += titleLineHeight
  }
  yCursor += 14

  if (data.summary) {
    ctx.fillStyle = COLORS.textSecondary
    ctx.font = 'italic 30px Georgia, "Noto Serif SC", serif'
    const summaryLines = wrapText(ctx, data.summary, CONTENT_WIDTH)
    const maxSummaryLines = 2
    const summaryLineHeight = 46
    for (let i = 0; i < Math.min(summaryLines.length, maxSummaryLines); i++) {
      if (i === maxSummaryLines - 1 && summaryLines.length > maxSummaryLines) {
        drawTextWithEllipsis(ctx, summaryLines[i], PADDING, yCursor, CONTENT_WIDTH)
      } else {
        ctx.fillText(summaryLines[i], PADDING, yCursor)
      }
      yCursor += summaryLineHeight
    }
    yCursor += 20
  }

  const footerStart = CARD_HEIGHT - 300
  if (yCursor < footerStart) {
    yCursor = footerStart
  }

  ctx.strokeStyle = hexToRgba(COLORS.border, 0.45)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PADDING, yCursor)
  ctx.lineTo(CARD_WIDTH - PADDING, yCursor)
  ctx.stroke()
  yCursor += 32

  const qrSize = 150
  const qrCanvas = await generateQR(data.url, qrSize)
  const avatarRadius = 34
  const avatarCx = PADDING + avatarRadius
  const avatarCy = yCursor + avatarRadius

  if (data.authorAvatar) {
    const avatarImg = await loadImage(data.authorAvatar)
    if (avatarImg) {
      ctx.strokeStyle = hexToRgba(COLORS.accent, 0.35)
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(avatarCx, avatarCy, avatarRadius + 3, 0, Math.PI * 2)
      ctx.stroke()
      drawCircleImage(ctx, avatarImg, avatarCx, avatarCy, avatarRadius)
    } else {
      drawAvatarFallback(ctx, avatarCx, avatarCy, avatarRadius, data.authorName)
    }
  } else {
    drawAvatarFallback(ctx, avatarCx, avatarCy, avatarRadius, data.authorName)
  }

  const textX = PADDING + avatarRadius * 2 + 22
  ctx.fillStyle = COLORS.textPrimary
  ctx.font = '600 32px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  drawTextWithEllipsis(ctx, data.authorName, textX, avatarCy - avatarRadius, CARD_WIDTH - PADDING - qrSize - 60 - textX)

  let metaText = formatDate(data.createdAt)
  if (data.viewCount !== undefined && data.viewCount > 0) {
    metaText += ` · ${data.viewCount} 次阅读`
  }
  ctx.fillStyle = COLORS.textSecondary
  ctx.font = '400 26px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(metaText, textX, avatarCy - avatarRadius + 42)

  if (qrCanvas) {
    const qrX = CARD_WIDTH - PADDING - qrSize
    const qrY = yCursor
    ctx.fillStyle = COLORS.background
    drawRoundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12)
    ctx.fill()
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize)
    ctx.fillStyle = COLORS.textMuted
    ctx.font = '400 20px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('扫码阅读全文', qrX + qrSize / 2, qrY + qrSize + 12)
  }

  ctx.fillStyle = COLORS.textMuted
  ctx.font = '400 22px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.fillText('wuh.site', CARD_WIDTH / 2, CARD_HEIGHT - 32)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.globalAlpha = 1
}

function drawAvatarFallback(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  name: string,
): void {
  ctx.fillStyle = hexToRgba(COLORS.accent, 0.2)
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.textSecondary
  ctx.font = `600 ${radius}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name.charAt(0).toUpperCase(), cx, cy)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
}
