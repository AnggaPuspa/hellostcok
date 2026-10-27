import type { ReactNode } from 'react'

type PillProps = {
  tone: 'up' | 'down'
  children: ReactNode
}

export function Pill({ tone, children }: PillProps) {
  return <span className={`dash-pill dash-pill-${tone}`}>{children}</span>
}
