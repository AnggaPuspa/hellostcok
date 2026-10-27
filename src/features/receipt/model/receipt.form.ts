export const scanHint = 'Pindai label barang untuk memeriksa produk.'
export const notFoundMessage = 'Produk tidak ditemukan. Pindai ulang atau minta Admin memeriksa label.'
export const checkingNote = 'Belum dianggap cocok. Stok belum berubah.'
export const conditionHint = 'Pilihan: Baik / Rusak → Disposisi'
export const conditions = ['Baik', 'Rusak']

export function checkingLabel(sku: string) {
  return `Memeriksa ${sku.trim()}…`
}

export function incomingCount(value: string) {
  const count = Number(value)
  if (!Number.isInteger(count) || count < 1) return 0
  return count
}

export const photoMissing = 'Belum bisa disimpan: foto QC belum tersedia · Lengkapi foto QC sebelum menyimpan penerimaan.'
export const photoEmpty = 'Belum ada foto QC'

export function photoReady(name: string) {
  return `${name} · Tersedia`
}

export function quantityLine(quantity: number, unit: string, condition: string) {
  return `Jumlah: ${quantity} ${unit.toUpperCase()} · Kondisi: ${condition}`
}

export function stockDelta(incoming: number, unit: string, condition: string) {
  const label = unit.toUpperCase()
  if (condition === 'Rusak') return `0 ${label}`
  return `+${incoming} ${label}`
}

export function stockAfter(quantity: number, incoming: number, condition: string) {
  if (condition === 'Rusak') return quantity
  return quantity + incoming
}

export const stockLimitHint = 'Jumlah tidak boleh melebihi stok.'
export const stockKept = 'Penjualan tidak disimpan. Tidak ada pengurangan stok.'

export function maxStockHint(stock: number, unit: string) {
  return `Maksimal ${stock} ${unit.toUpperCase()}.`
}

export function saleRejected(count: number, stock: number, unit: string) {
  const label = unit.toUpperCase()
  return `Ditolak: jumlah melebihi stok tercatat · Permintaan ${count} ${label}, stok fisik tercatat ${stock} ${label}. Kurangi jumlah menjadi maksimal ${stock} ${label}. Stok tetap ${stock} ${label}.`
}

export function saleForecast(count: number, stock: number, unit: string) {
  const label = unit.toUpperCase()
  return `${count} ${label} tidak melebihi stok ${stock} ${label} · Setelah transaksi tersimpan, stok menjadi ${stock - count} ${label}. Saat ini tetap ${stock} ${label}.`
}

export function stockForecast(quantity: number, unit: string, incoming: number, condition: string) {
  const label = unit.toUpperCase()
  if (condition === 'Rusak') return 'Barang rusak tidak menambah stok. Disposisi dicatat.'
  return `Stok saat ini: ${quantity} ${label} · Setelah penerimaan disimpan, stok menjadi ${quantity + incoming} ${label}.`
}
