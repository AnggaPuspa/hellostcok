import { api } from './client.ts'

export type HealthResponse = {
  ok: boolean
  service: string
}

export function getHealth() {
  return api<HealthResponse>('/health')
}
