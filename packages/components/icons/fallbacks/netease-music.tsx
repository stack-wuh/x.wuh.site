import type * as React from 'react'

const NeteaseMusicFallback: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
    <circle cx="8" cy="18" r="2" />
    <circle cx="16" cy="16" r="2" />
    <path d="M10 18V6l8-2v10" />
  </svg>
)

export default NeteaseMusicFallback
