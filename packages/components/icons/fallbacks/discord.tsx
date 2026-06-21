import type * as React from 'react'

const DiscordFallback: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
    <path d="M9 8c-2 .5-3.5 1.5-4 3v4c.5 1 1.5 2 3 2.5" />
    <path d="M15 8c2 .5 3.5 1.5 4 3v4c-.5 1-1.5 2-3 2.5" />
    <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    <path d="M10 15.5c.8.5 2 .8 2 .8s1.2-.3 2-.8" />
  </svg>
)

export default DiscordFallback
