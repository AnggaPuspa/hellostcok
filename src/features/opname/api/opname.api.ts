import { api } from '@/shared/api/client.ts'
import type { Opname, OpnameInput } from '../model/opname.types.ts'

export function getOpnames() {
  return api<{ data: Opname[] }>('/opnames')
}

export function getOpname(id: string) {
  return api<{ data: Opname }>(`/opnames/${id}`)
}

export function createOpname(input: OpnameInput) {
  return api<{ data: Opname }>('/opnames', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
