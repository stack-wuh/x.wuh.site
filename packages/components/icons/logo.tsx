import * as React from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export const IconLogo: React.FC<LogoProps> = ({ width = 42, height = 26, className }) => (
  <svg
    viewBox="0 0 120 60"
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    role="img"
    style={{ display: 'block' }}
    className={className}
  >
    <title>wuh.site</title>
    <path
      d="M14 16 L24 44 L34 16 L44 44 L54 16"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="66" y="18" width="34" height="8" rx="4" fill="var(--primary-color)" />
    <rect x="66" y="34" width="20" height="8" rx="4" fill="currentColor" opacity=".55" />
  </svg>
)

IconLogo.displayName = 'IconLogo'
