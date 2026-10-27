import type { ReactNode } from 'react'

export function Chip({ children }: { children: ReactNode }) {
  return <span className="dash-chip">{children}</span>
}
