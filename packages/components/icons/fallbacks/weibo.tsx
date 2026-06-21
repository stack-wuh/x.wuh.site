import type * as React from 'react'

const WeiboFallback: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <ellipse cx="12" cy="12" rx="8" ry="9" />
    <circle cx="12" cy="11" r="4" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <path d="M4 7c2-2 5-3 8-2" />
    <path d="M20 7c-2-2-5-3-8-2" />
  </svg>
)

export default WeiboFallback
