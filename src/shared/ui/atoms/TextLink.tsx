import type { ReactNode } from 'react'
import { Link } from 'react-router'

type TextLinkProps = {
  to: string
  children: ReactNode
}

export function TextLink({ to, children }: TextLinkProps) {
  return (
    <Link className="hs-text-link" to={to}>
      {children}
    </Link>
  )
}
