const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('id-ID')

export function formatRupiah(value: number) {
  return rupiah.format(value)
}

export function formatNumber(value: number) {
  return number.format(value)
}
