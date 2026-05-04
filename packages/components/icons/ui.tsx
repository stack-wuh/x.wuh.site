import * as React from 'react'

export const IconClose = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M18 6L6 18' />
    <path d='M6 6l12 12' />
  </svg>
)

export const IconArrowLeft = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M15 6l-6 6 6 6' />
  </svg>
)

export const IconArrowRight = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M9 6l6 6-6 6' />
  </svg>
)

export const IconHome = () => (
  <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
    <path d='M3 10.5L12 3l9 7.5' />
    <path d='M5.5 9.5V20a1 1 0 0 0 1 1h4.5v-6h2v6H17.5a1 1 0 0 0 1-1V9.5' />
  </svg>
)

export const IconScrollToTop = () => (
  <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
    <path d='M12 5l-6 6' />
    <path d='M12 5l6 6' />
    <path d='M12 5v14' />
  </svg>
)

export const IconThumbUp = () => (
  <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
    <path d='M7 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2' />
    <path d='M7 10h9.2a2 2 0 0 1 1.95 2.43l-1.2 6A2 2 0 0 1 15 20H7' />
    <path d='M7 10V6.8a3 3 0 0 1 .88-2.12L10 2l1.5 1.5A2.5 2.5 0 0 1 12 5.27V10' />
  </svg>
)

export const IconBars = () => (
  <svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' focusable='false'>
    <path fill='currentColor' d='M4 7.5c0-.55.45-1 1-1h14a1 1 0 1 1 0 2H5c-.55 0-1-.45-1-1Zm0 5c0-.55.45-1 1-1h14a1 1 0 1 1 0 2H5c-.55 0-1-.45-1-1Zm1 4c-.55 0-1 .45-1 1s.45 1 1 1h14a1 1 0 1 0 0-2H5Z' />
  </svg>
)

export const IconChevronLeft = () => (
  <span className='toolbar-icon' aria-hidden='true'>
    <svg viewBox='0 0 16 16' focusable='false'>
      <path d='M10.5 3.5L5.5 8l5 4.5' />
    </svg>
  </span>
)

export const IconChevronRight = () => (
  <span className='toolbar-icon' aria-hidden='true'>
    <svg viewBox='0 0 16 16' focusable='false'>
      <path d='M5.5 3.5L10.5 8l-5 4.5' />
    </svg>
  </span>
)

export const IconLink = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
    <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
  </svg>
)

export const IconCopy = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
    <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
  </svg>
)

export const IconZoomIn = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M11 11V7m0 4h4m-4 0H7m4 0v4m2.5-6.5l5.5 5.5' />
  </svg>
)

export const IconZoomOut = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M15 11H7m11 8l-5.5-5.5' />
  </svg>
)

export const IconRotate = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M4 7v6h6M20 17V11h-6M4 7a8 8 0 0 1 14-3' />
  </svg>
)

export const IconDownload = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M12 5v12m0 0-4-4m4 4 4-4M5 19h14' />
  </svg>
)

export const IconFullscreen = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M9 3H5v4m10-4h4v4M9 21H5v-4m10 4h4v-4' />
  </svg>
)

export const IconExitFullscreen = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M9 9L5 5m0 0h4M5 5v4m10 6 4 4m0 0v-4m0 4h-4' />
  </svg>
)

export const IconReset = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M3 12a9 9 0 1 1 3 6.708M3 12h4m0 0v-4' />
  </svg>
)
