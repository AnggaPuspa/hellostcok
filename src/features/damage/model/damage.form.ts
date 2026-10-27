export const dispositions = ['Tahan', 'Retur', 'Musnah']
export const dispositionHint = 'Tahan / Retur / Musnah'
export const draftNotice = 'Catatan kerusakan belum tersimpan · Lengkapi produk, jumlah, catatan, foto, dan disposisi. Data ini belum mengubah stok tercatat.'
export const receiptCondition = 'Rusak → Disposisi'
export const photoEmpty = 'Belum ada foto QC'

export function photoReady(name: string) {
  return `${name} · Tersedia`
}

export function receiptKept(stock: number, unit: string) {
  const label = unit.toUpperCase()
  return `Penerimaan tidak disimpan. Tidak ada transaksi IN yang disimpan dan tidak ada penambahan stok. Stok tetap ${stock} ${label}.`
}

export function maxDamageHint(stock: number, unit: string) {
  return `Maksimal ${stock} ${unit.toUpperCase()}.`
}

export function destroyRejected(count: number, stock: number, unit: string) {
  const label = unit.toUpperCase()
  return `Ditolak: jumlah melebihi stok tercatat · Permintaan ${count} ${label}, stok fisik tercatat ${stock} ${label}. Kurangi jumlah menjadi maksimal ${stock} ${label}. Stok tetap ${stock} ${label}.`
}

export const destroyLimit = 'Jumlah tidak boleh melebihi stok.'
export const destroyKept = 'Catatan kerusakan tidak disimpan. Tidak ada pengurangan stok.'

export function stockNotice(disposition: string, stock: number, count: number, unit: string) {
  const label = unit.toUpperCase()
  if (disposition === 'Musnah') {
    return `Disposisi Musnah mengurangi stok tercatat. Setelah disimpan, stok menjadi ${stock - count} ${label}. Saat ini tetap ${stock} ${label}.`
  }
  return `Disposisi ${disposition} tidak otomatis mengurangi stok tercatat. Stok tetap ${stock} ${label}.`
}

export function detailNotice(disposition: string, stock: number, unit: string) {
  const label = unit.toUpperCase()
  if (disposition === 'Tahan') return `Barang ditahan tetap termasuk stok tercatat ${stock} ${label}. Catatan ditahan tidak otomatis mengurangi stok.`
  if (disposition === 'Musnah') return `Barang dimusnahkan. Stok tercatat sekarang ${stock} ${label}.`
  return `Barang retur tetap termasuk stok tercatat ${stock} ${label}.`
}

export function pendingDisposition(stock: number, unit: string) {
  return `Perubahan disposisi belum disimpan · Stok tetap ${stock} ${unit.toUpperCase()}.`
}
