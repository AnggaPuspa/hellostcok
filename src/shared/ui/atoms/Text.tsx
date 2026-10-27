import type { ReactNode } from 'react'

type TextProps = {
  as?: 'p' | 'span'
  className?: string
  children: ReactNode
}

export function Text({ as = 'p', className = '', children }: TextProps) {
  const Tag = as
  return <Tag className={`hs-text ${className}`.trim()}>{children}</Tag>
}
