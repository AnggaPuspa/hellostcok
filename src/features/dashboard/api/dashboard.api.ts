import { api } from '@/shared/api/client.ts'
import type { DashboardView } from '../model/dashboard.types.ts'

export function getDashboard() {
  return api<{ data: DashboardView }>('/dashboard').then((result) => result.data)
}
