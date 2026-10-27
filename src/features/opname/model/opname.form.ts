export const reasonRequired = 'Alasan koreksi wajib diisi.'
export const reasonHint = 'Wajib. Koreksi tidak dapat disimpan tanpa alasan.'
export const auditNote = 'Jejak audit tercatat · Riwayat koreksi tidak dapat diubah atau dihapus.'
export const successTitle = 'Koreksi stok berhasil disimpan'
export const formTitle = 'Koreksi opname'

export function pendingNote(stock: number, unit: string) {
  return `Koreksi belum disimpan · Stok tetap ${stock} ${unit.toUpperCase()} hingga Anda mengonfirmasi koreksi.`
}

export function countLabel(value: number, unit: string) {
  return `${value} ${unit.toUpperCase()}`
}

export function changeLabel(change: number, unit: string) {
  const sign = change > 0 ? '+' : change < 0 ? '−' : ''
  return `${sign}${Math.abs(change)} ${unit.toUpperCase()}`
}

export function adjMark(change: number, unit: string) {
  return `ADJ · ${changeLabel(change, unit)}`
}

export function parseCount(value: string) {
  const count = Number(value)
  if (!Number.isInteger(count) || count < 0) return null
  return count
}
