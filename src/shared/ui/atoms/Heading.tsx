import type { ReactNode } from 'react'

type HeadingProps = {
  level?: 1 | 3
  children: ReactNode
  className?: string
}

export function Heading({ level = 1, children, className = '' }: HeadingProps) {
  const Tag = level === 1 ? 'h1' : 'h3'
  return <Tag className={`hs-heading hs-heading-${level} ${className}`.trim()}>{children}</Tag>
}
