'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { FootprintData, FootprintMapProps } from './types'

export type { FootprintData, FootprintMapProps } from './types'

const STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/liberty'
const STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
const DEFAULT_CENTER: [number, number] = [113.81, 22.69]

function getColorScheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  return (document.documentElement.dataset.colorScheme as 'light' | 'dark') || 'light'
}

function getThemeFamily(): string {
  if (typeof document === 'undefined') return 'wine'
  return document.documentElement.dataset.themeFamily || 'wine'
}

function markerColor(family: string) {
  return family === 'plain' ? '#A87348' : '#C89060'
}

function markerSvg(color: string) {
  return `<svg width="22" height="28" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg"><path d="M14 0c-4 0-7.5 1.5-10 4C1.3 6.7 0 10 0 14c0 3.5 1.5 7 3.5 10l10 12 10.5-12C26.5 21 28 17.5 28 14c0-4-1.3-7.3-4-10C21.5 1.5 18 0 14 0z" fill="${color}"/><circle cx="14" cy="13" r="4" fill="#fff"/></svg>`
}

export function FootprintMap({
  footprints = [],
  variant = 'compact',
  onMarkerClick,
}: FootprintMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [loaded, setLoaded] = useState(false)

  const rebuildMarkers = useCallback((map: any, maplibregl: any) => {
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const color = markerColor(getThemeFamily())

    // Home marker — always visible with CSS animation
    const homeEl = document.createElement('div')
    homeEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="position:relative;width:60px;height:60px;display:flex;align-items:center;justify-content:center;">
          <div class="fp-home-pulse" style="position:absolute;width:24px;height:24px;border-radius:50%;background:${color};opacity:0.4;"></div>
          <svg width="24" height="30" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" style="position:relative;z-index:1;">
            <path d="M14 0c-4 0-7.5 1.5-10 4C1.3 6.7 0 10 0 14c0 3.5 1.5 7 3.5 10l10 12 10.5-12C26.5 21 28 17.5 28 14c0-4-1.3-7.3-4-10C21.5 1.5 18 0 14 0z" fill="${color}"/>
            <circle cx="14" cy="13" r="4" fill="#fff"/>
          </svg>
        </div>
        <span style="font-size:12px;font-weight:600;color:var(--text-primary,#333);margin-top:-8px;white-space:nowrap;text-shadow:0 1px 3px rgba(255,255,255,0.8);">我在这里</span>
      </div>`
    homeEl.style.cursor = 'default'

    const homePopup = new maplibregl.Popup({ offset: 28 }).setHTML('<strong>我在这里</strong><br><span style="font-size:12px;color:#666">深圳市宝安区 · 立新湖创意园</span>')
    const homeMarker = new maplibregl.Marker({ element: homeEl, anchor: 'bottom' })
      .setLngLat(DEFAULT_CENTER)
      .addTo(map)

    const homeWrapper = homeEl.closest('.maplibregl-marker') as HTMLElement | null
    if (homeWrapper) homeWrapper.style.overflow = 'visible'

    homeEl.addEventListener('mouseenter', () => { homeMarker.setPopup(homePopup); homePopup.addTo(map) })
    homeEl.addEventListener('mouseleave', () => homePopup.remove())

    markersRef.current.push(homeMarker)

    // Footprint markers
    footprints.forEach((fp) => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
        `<strong>${fp.name}</strong><br><span style="font-size:12px;color:#666">${new Date(fp.date).toLocaleDateString('zh-CN')}</span>`
      )

       const el = document.createElement('div')
      el.innerHTML = `<span class="fp-marker-bounce" style="display:block;padding-top:12px;overflow:visible;">${markerSvg(color)}</span>`
      el.style.cssText = 'overflow:visible;'

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([fp.lng, fp.lat])
        .addTo(map)

      // Fix MaplibreGL clipping of marker content
      const wrapper = el.closest('.maplibregl-marker') as HTMLElement | null
      if (wrapper) wrapper.style.overflow = 'visible'

      if (variant === 'compact') {
        el.addEventListener('mouseenter', () => { marker.setPopup(popup); popup.addTo(map) })
        el.addEventListener('mouseleave', () => popup.remove())
      }
      if (variant === 'full' && onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(fp))
      }

      markersRef.current.push(marker)
    })

    if (footprints.length > 0) {
      const bounds = new maplibregl.LngLatBounds()
      bounds.extend(DEFAULT_CENTER)
      footprints.forEach((fp) => bounds.extend([fp.lng, fp.lat]))
      map.fitBounds(bounds, { padding: 60, maxZoom: 12 })
    }
  }, [footprints, variant, onMarkerClick])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    const scheme = getColorScheme()
    const style = scheme === 'dark' ? STYLE_DARK : STYLE_LIGHT

    // Fix MaplibreGL marker clipping
    if (!document.getElementById('fp-marker-style')) {
      const styleEl = document.createElement('style')
      styleEl.id = 'fp-marker-style'
      styleEl.textContent = `
        .maplibregl-marker { overflow: visible !important; }
        @keyframes fp-home-pulse { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(2); opacity: 0; } }
        .fp-home-pulse { animation: fp-home-pulse 2s ease-out infinite; }
        @keyframes fp-marker-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .fp-marker-bounce { animation: fp-marker-bounce 1.8s ease-in-out infinite; }
      `
      document.head.appendChild(styleEl)
    }

    import('maplibre-gl').then((maplibregl) => {
      import('maplibre-gl/dist/maplibre-gl.css')
      if (cancelled || !containerRef.current) return

      const map = new maplibregl.Map({
        container: el,
        style,
        center: DEFAULT_CENTER,
        zoom: 12,
        attributionControl: false,
      })

      map.addControl(new maplibregl.AttributionControl({ compact: true }))

      map.on('load', () => {
        rebuildMarkers(map, maplibregl)
        setLoaded(true)
      })
      mapRef.current = map
    })

    const observer = new MutationObserver(() => {
      const map = mapRef.current
      if (!map) return

      const newScheme = getColorScheme()
      const newStyle = newScheme === 'dark' ? STYLE_DARK : STYLE_LIGHT
      map.setStyle(newStyle)

      map.once('style.load', () => {
        import('maplibre-gl').then((m) => rebuildMarkers(map, m))
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-scheme', 'data-theme-family'],
    })

    return () => {
      cancelled = true
      observer.disconnect()
      markersRef.current.forEach((m) => m.remove())
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.loaded()) return
    import('maplibre-gl').then((m) => rebuildMarkers(map, m))
  }, [rebuildMarkers])

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--background-color, #f2ede4)',
          borderRadius: 12,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Terrain blocks */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id="terrain" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--text-muted, #bbb)" stopOpacity="0.06" />
                <stop offset="100%" stopColor="var(--text-muted, #bbb)" stopOpacity="0.14" />
              </linearGradient>
            </defs>
            <rect x="5%" y="15%" width="30%" height="18%" rx="20" fill="url(#terrain)" />
            <rect x="20%" y="10%" width="45%" height="12%" rx="16" fill="url(#terrain)" />
            <rect x="60%" y="20%" width="25%" height="22%" rx="18" fill="url(#terrain)" />
            <rect x="10%" y="38%" width="35%" height="14%" rx="14" fill="url(#terrain)" />
            <rect x="55%" y="48%" width="40%" height="10%" rx="12" fill="url(#terrain)" />
            <rect x="8%" y="58%" width="22%" height="20%" rx="16" fill="url(#terrain)" />
            <rect x="35%" y="65%" width="50%" height="15%" rx="14" fill="url(#terrain)" />
            <rect x="15%" y="85%" width="28%" height="10%" rx="10" fill="url(#terrain)" />
            <rect x="50%" y="88%" width="38%" height="8%" rx="10" fill="url(#terrain)" />
            {/* Pulsing marker dots */}
            {[[0.25, 0.22], [0.65, 0.30], [0.40, 0.55], [0.18, 0.72], [0.72, 0.75]].map(([cx, cy], i) => (
              <circle key={i} cx={`${+cx * 100}%`} cy={`${+cy * 100}%`} r="5"
                fill="var(--accent-color, #C89060)" opacity="0.5"
                style={{ animation: `fp-pulse 2s ${i * 0.4}s ease-in-out infinite` }} />
            ))}
            {/* Center marker — "我在这里" */}
            <circle cx="50%" cy="52%" r="5" fill="var(--accent-color, #C89060)" opacity="0.15">
              <animate attributeName="r" values="4;26;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50%" cy="52%" r="5" fill="var(--accent-color, #C89060)">
              <animate attributeName="cy" values="52%;51.5%;52%" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="50%" cy="52%" r="2.5" fill="#fff" opacity="0.9" />
            {/* Drop line */}
            <line x1="50%" y1="57%" x2="50%" y2="85%" stroke="var(--accent-color, #C89060)" strokeWidth="1.5" opacity="0.25" strokeDasharray="3,4" />
            {/* Center label */}
            <text x="50%" y="93%" textAnchor="middle" fontSize="13" fill="var(--text-secondary, #666)" fontWeight="500" style={{ animation: 'fp-fadeIn 0.6s ease-out' }}>
              我在这里
            </text>
          </svg>
          {/* Text overlay */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary, #666)', fontWeight: 500 }}>
              地图加载中
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted, #999)' }}>
              正在绘制足迹
            </span>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fp-pulse {
          0%, 100% { r: 5; opacity: 0.5; }
          50% { r: 9; opacity: 0.15; }
        }
        @keyframes fp-fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default FootprintMap
