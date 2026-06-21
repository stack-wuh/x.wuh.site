import type * as React from 'react'

const TwitterFallback: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
    <path d="M4 4l6.5 7.5L4 20h2l5.5-7.5L17 20h4l-6.5-8.5L20 4h-2l-5 6.5L8 4H4z" />
  </svg>
)

export default TwitterFallback
