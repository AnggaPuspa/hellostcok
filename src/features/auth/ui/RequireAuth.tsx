import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { getSession } from '../model/session.ts'

export function RequireAuth({ children }: { children: ReactNode }) {
  if (!getSession()) return <Navigate to="/login" replace />
  return children
}
