import type * as React from 'react'

interface ArticleIconProps {
  size?: number
  className?: string
}

const ArticleIcon: React.FC<ArticleIconProps> = ({ size = 16, className }) => (
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
    <path d='M6 2 H14 L18 6 V20 a2 2 0 0 1-2 2 H6 a2 2 0 0 1-2-2 V4 a2 2 0 0 1 2-2 Z' />
    <path d='M14 2 V6 H18' />
    <path d='M7 11 H15' />
    <path d='M7 14 H15' />
    <path d='M7 17 H12' />
  </svg>
)

export default ArticleIcon
