import type * as React from 'react'

const QQFallback: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
    <ellipse cx="12" cy="14" rx="8" ry="6" />
    <circle cx="12" cy="8" r="4" />
    <circle cx="9.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
    <path d="M7 18c1 2 3 2.5 5 2.5s4-.5 5-2.5" />
  </svg>
)

export default QQFallback
