import type { Role } from '@/features/auth/model/session.ts'
import bell from '@/assets/nav/bell.svg'
import dashboard from '@/assets/nav/dashboard.svg'
import laporan from '@/assets/nav/laporan.svg'
import logo from '@/assets/nav/logo.svg'
import opname from '@/assets/nav/opname.svg'
import penerimaan from '@/assets/nav/penerimaan.svg'
import pengguna from '@/assets/nav/pengguna.svg'
import penjualan from '@/assets/nav/penjualan.svg'
import produk from '@/assets/nav/produk.svg'
import rusak from '@/assets/nav/rusak.svg'
import search from '@/assets/nav/search.svg'
import sidebar from '@/assets/nav/sidebar.svg'

export const brandMark = { src: logo, width: 38.12, height: 38.12 }
export const searchIcon = { src: search, width: 24, height: 24 }
export const bellIcon = { src: bell, width: 17.999, height: 22 }
export const sidebarIcon = { src: sidebar, width: 21.372, height: 19.3884 }

type NavItem = {
  to: string
  label: string
  icon: string
  width: number
  height: number
  end: boolean
  roles: Role[]
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: dashboard, width: 24, height: 24, end: true, roles: ['admin', 'pemilik', 'petugas'] },
  { to: '/produk', label: 'Produk', icon: produk, width: 20, height: 18.25, end: false, roles: ['admin', 'petugas'] },
  { to: '/penerimaan', label: 'Penerimaan', icon: penerimaan, width: 21.1701, height: 22.06, end: false, roles: ['admin', 'petugas'] },
  { to: '/penjualan', label: 'Penjualan', icon: penjualan, width: 22.947, height: 21.4375, end: false, roles: ['admin', 'petugas'] },
  { to: '/barang-rusak', label: 'Barang Rusak', icon: rusak, width: 24, height: 24, end: false, roles: ['admin', 'petugas'] },
  { to: '/opname', label: 'Opname', icon: opname, width: 18.48, height: 22.06, end: false, roles: ['admin', 'petugas'] },
  { to: '/laporan', label: 'Laporan', icon: laporan, width: 19.98, height: 20.2, end: false, roles: ['admin', 'pemilik', 'petugas'] },
  { to: '/pengguna', label: 'Pengguna', icon: pengguna, width: 24, height: 24, end: false, roles: ['admin'] },
]

export function navFor(role: Role) {
  return navItems.filter((item) => item.roles.includes(role))
}

export function canAccessPath(role: Role, pathname: string) {
  return navFor(role).some((item) =>
    item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`),
  )
}

export const roleTitle: Record<Role, string> = {
  admin: 'Admin',
  pemilik: 'Pemilik',
  petugas: 'Petugas',
}

export const ownerReadOnlyLabel = 'Hanya baca'
export const ownerReadOnlyNote = 'Akses Pemilik · Hanya baca ringkasan dan laporan. Tidak dapat mengubah stok.'
export const ownerReportAction = 'Lihat laporan →'
