import type { Role } from './session.ts'
import { roleTitle } from '@/shared/ui/layout/nav.ts'

export const createNotice = 'Kata sandi ditampilkan satu kali setelah user dibuat. Semua nilai pada layar ini adalah contoh.'
export const oncePasswordNotice =
  'Ditampilkan satu kali · Salin kata sandi contoh ini sebelum menutup layar. Ini bukan kredensial akun nyata.'
export const deactivateNotice = 'Nonaktif. Token user dicabut. User tidak bisa login.'
export const activateNotice = 'Aktif kembali. User bisa login lagi.'
export const selfDisableNote = 'Tidak dapat menonaktifkan akun sendiri.'

export const roles: { id: Role; label: string }[] = [
  { id: 'petugas', label: 'Petugas' },
  { id: 'admin', label: 'Admin' },
  { id: 'pemilik', label: 'Pemilik' },
]

export const statusFilters = [
  { id: 'all', label: 'Semua status' },
  { id: 'active', label: 'Aktif' },
  { id: 'inactive', label: 'Nonaktif' },
] as const

export type StatusFilter = (typeof statusFilters)[number]['id']

export function statusLabel(active: boolean) {
  return active ? 'Aktif' : 'Nonaktif'
}

export function accountLine(account: { name: string; email: string; role: Role; active: boolean }, mine = false) {
  const name = mine ? `${account.name} · Anda` : account.name
  return `${name} · ${account.email} · ${roleTitle[account.role]} · ${statusLabel(account.active)}`
}

export function displayName(account: { name: string }, mine: boolean) {
  return mine ? `${account.name} · Anda` : account.name
}
