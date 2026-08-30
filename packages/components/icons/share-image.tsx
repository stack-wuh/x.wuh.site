import type * as React from 'react'

interface ShareImageIconProps {
  size?: number
  className?: string
}

const ShareImageIcon: React.FC<ShareImageIconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
    aria-hidden='true'
  >
    <rect x='3' y='8' width='13' height='13' rx='2' />
    <path d='M5 17 L8.5 12 L12 16 L15 12' />
    <path d='M16 3 H21 V9' />
    <path d='M16 9 L21 3' />
  </svg>
)

export default ShareImageIcon
