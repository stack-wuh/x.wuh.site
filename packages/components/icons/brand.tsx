import * as React from 'react'

interface IconProps {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

function withDefaults(p: IconProps) {
  return { size: p.size ?? 24, color: p.color ?? 'currentColor', sw: p.strokeWidth ?? 2 }
}

export const IconWechat = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M9 13a5.5 5.5 0 0 0 10.8 1.4 3.5 3.5 0 0 1-2.6 3.9l-2.2.8.7-2.6' />
      <path d='M16.5 8.5A5.5 5.5 0 0 0 6.5 13' />
      <circle cx='10' cy='11' r='1' fill={color} stroke='none' />
      <circle cx='14' cy='11' r='1' fill={color} stroke='none' />
    </svg>
  )
}

export const IconQQ = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M12 3c-2 0-4 2-4 4 0 1 .3 1.8.8 2.5-.4.8-.8 2-.8 3 0 .4.3.7.7.7.6 0 1.5-.6 2.3-1.3.5.1 1 .2 1.7.2s1.2-.1 1.7-.2c.8.7 1.7 1.3 2.3 1.3.4 0 .7-.3.7-.7 0-1-.4-2.2-.8-3 .5-.7.8-1.5.8-2.5 0-2-2-4-4-4z' />
      <circle cx='10' cy='7' r='1' fill={color} stroke='none' />
      <circle cx='14' cy='7' r='1' fill={color} stroke='none' />
    </svg>
  )
}

export const IconTwitter = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M4 4l11.7 11.7M20 4l-11.7 11.7M8.3 8.3l-4.3 11.7M15.7 15.7L20 4' />
    </svg>
  )
}

export const IconGithub = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M15 21v-1.5a3.5 3.5 0 0 0-2.5-3.4M9 21v-1.5a3.5 3.5 0 0 1 2.5-3.4' />
      <path d='M9 14.6A3.5 3.5 0 0 1 6 12.7 3.5 3.5 0 0 1 6.6 9.5a3.8 3.8 0 0 1 .1-3.2s1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2a3.8 3.8 0 0 1 .1 3.2A3.5 3.5 0 0 1 19 12.7a3.5 3.5 0 0 1-3 1.9' />
      <circle cx='12' cy='12' r='10' />
    </svg>
  )
}

export const IconDouban = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M5 6h14v2H5zM6.5 10h11v7h-11z' />
      <path d='M8.5 12v3h7v-3M4 19h16v2H4z' />
    </svg>
  )
}

export const IconDiscord = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M8 7C6.5 7.3 5 8 3.5 9c.8 4.5-1.3 9.5.2 12 1.8 0 3.5-2.5 5.3-2.5s3.5 2.5 5.3 2.5c1.5-2.5-.6-7.5.2-12C13 8 11.5 7.3 10 7' />
      <circle cx='9' cy='12' r='1.5' fill={color} stroke='none' />
      <circle cx='15' cy='12' r='1.5' fill={color} stroke='none' />
    </svg>
  )
}

export const IconWeibo = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <circle cx='12' cy='12' r='10' />
      <circle cx='12' cy='11' r='4' />
      <circle cx='12' cy='11' r='1.5' fill={color} stroke='none' />
      <path d='M8 19c-1.5.5-2.5 1-2 2s2 1 4 1 3.5-.5 2.5-1.5' />
    </svg>
  )
}

export const IconEmail = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <rect x='2' y='4' width='20' height='16' rx='2' />
      <path d='M2 6l10 7 10-7' />
    </svg>
  )
}

export const IconMusic = (props: IconProps) => {
  const { size, color, sw } = withDefaults(props)
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth={sw} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M9 18V5l12-2v12' />
      <circle cx='6' cy='18' r='3' />
      <circle cx='18' cy='15' r='3' />
    </svg>
  )
}
