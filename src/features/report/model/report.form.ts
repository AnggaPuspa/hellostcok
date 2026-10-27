import type { ReportRange } from './report.types.ts'

export const ranges: { id: ReportRange; label: string }[] = [
  { id: 'today', label: 'Hari ini' },
  { id: '7d', label: '7 hari' },
  { id: '30d', label: '30 hari' },
  { id: 'custom', label: 'Kustom' },
]

export function qtyLabel(value: number, unit: string) {
  return `${value} ${unit.toUpperCase()}`
}

export function signedQty(value: number, unit: string) {
  if (value === 0) return qtyLabel(0, unit)
  const sign = value > 0 ? '+' : '−'
  return `${sign}${Math.abs(value)} ${unit.toUpperCase()}`
}

export function adjustLabel(value: number, unit: string) {
  if (value === 0) return qtyLabel(0, unit)
  return signedQty(value, unit)
}

export function photoReady(name: string) {
  return `${name} · Tersedia`
}

export const photoExpired = 'Foto sudah dihapus (retensi 90 hari)'
export const exportPreparing = 'Menyiapkan file…'
export function exportReady(fileName: string, rows: number) {
  return `Siap diunduh · ${fileName} · ${rows} baris.`
}
