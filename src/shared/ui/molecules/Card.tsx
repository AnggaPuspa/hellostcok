import type { ReactNode } from 'react'
import { Heading } from '../atoms/Heading.tsx'

type CardProps = {
  title?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`hs-card ${className}`.trim()}>
      {title ? <Heading level={3}>{title}</Heading> : null}
      {title ? <div className="hs-card-rule" aria-hidden="true" /> : null}
      <div className="hs-card-body">{children}</div>
    </section>
  )
}
