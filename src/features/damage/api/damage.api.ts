import { api } from '@/shared/api/client.ts'
import type { Damage, DamageInput } from '../model/damage.types.ts'

export function getDamages() {
  return api<{ data: Damage[] }>('/damages')
}

export function getDamage(id: string) {
  return api<{ data: Damage; stock: number }>(`/damages/${id}`)
}

export function createDamage(input: DamageInput) {
  return api<{ data: Damage; stock: number }>('/damages', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateDamage(id: string, body: { disposition?: string; photoName?: string }) {
  return api<{ data: Damage; stock: number }>(`/damages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
