import type { ReactNode } from 'react'

type HeadingProps = {
  level?: 1 | 2 | 3
  id?: string
  children: ReactNode
  className?: string
}

const tags = { 1: 'h1', 2: 'h2', 3: 'h3' } as const

export function Heading({ level = 1, id, children, className = '' }: HeadingProps) {
  const Tag = tags[level]
  return (
    <Tag id={id} className={`hs-heading hs-heading-${level} ${className}`.trim()}>
      {children}
    </Tag>
  )
}
