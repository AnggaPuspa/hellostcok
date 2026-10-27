import type { StockItem } from './stock.types.ts'

export const skuHint = 'Harus unik. Gunakan barcode pemasok atau SKU pada label toko.'
export const photoRule = 'JPG atau PNG, maksimal 5 MB'
export const photoMissing = 'Foto produk belum ada.'
export const labelSizes = ['70×40 mm', '50×30 mm', '100×50 mm']
const photoBytes = 5 * 1024 * 1024

export function duplicateSkuMessage(sku: string) {
  return `SKU ${sku.trim()} sudah digunakan.`
}

export function isSkuTaken(sku: string, stocks: Pick<StockItem, 'id' | 'sku'>[], ignoreId?: string) {
  const key = sku.trim().toLowerCase()
  if (!key) return false
  return stocks.some((item) => item.id !== ignoreId && item.sku.toLowerCase() === key)
}

export function stockReadout(quantity: number, unit: string) {
  return `${quantity} ${unit.toUpperCase()} · Hanya dibaca`
}

export function canSaveProduct(
  fields: { name: string; sku: string; category: string; location: string },
  taken: boolean,
  hasPhoto: boolean,
) {
  return Boolean(
    fields.name.trim() && fields.sku.trim() && fields.category.trim() && fields.location.trim() && !taken && hasPhoto,
  )
}

export function photoProblem(file: File) {
  const allowed = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!allowed || file.size > photoBytes) return photoRule
  return null
}

export function detailNotice(quantity: number, unit: string) {
  if (quantity <= 0) return null
  return `Produk tidak dapat dihapus · Masih ada stok ${quantity} ${unit.toUpperCase()} dan riwayat transaksi.`
}

export function printCount(value: string) {
  const count = Number(value)
  if (!Number.isInteger(count) || count < 1) return 0
  return count
}

export function printButtonLabel(count: number) {
  return `Cetak ${count} label`
}
