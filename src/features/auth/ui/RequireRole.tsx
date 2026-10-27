import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { getSession } from '../model/session.ts'
import { canAccessPath } from '@/shared/ui/layout/nav.ts'

export function RequireRole({ children }: { children: ReactNode }) {
  const session = getSession()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace />
  if (!canAccessPath(session.role, location.pathname)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
