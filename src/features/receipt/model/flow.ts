export type FlowKind = 'in' | 'out'

type Flow = {
  kind: FlowKind
  section: string
  listTitle: string
  newTitle: string
  newLabel: string
  saveLabel: string
  successTitle: string
  backLabel: string
  listPath: string
  api: string
  loadError: string
  detailError: string
  saveError: string
  defaultQuantity: string
  photoMissing: string
  photoNote: string
  mark: string
}

export const flows: Record<FlowKind, Flow> = {
  in: {
    kind: 'in',
    section: 'Penerimaan',
    listTitle: 'Daftar penerimaan',
    newTitle: 'Penerimaan baru',
    newLabel: 'Penerimaan baru',
    saveLabel: 'Simpan penerimaan',
    successTitle: 'Penerimaan berhasil disimpan',
    backLabel: 'Kembali ke penerimaan',
    listPath: '/penerimaan',
    api: '/receipts',
    loadError: 'Daftar penerimaan gagal dimuat.',
    detailError: 'Penerimaan gagal dimuat.',
    saveError: 'Penerimaan gagal disimpan.',
    defaultQuantity: '2',
    photoMissing: 'Belum bisa disimpan: foto QC belum tersedia · Lengkapi foto QC sebelum menyimpan penerimaan.',
    photoNote: '',
    mark: 'IN',
  },
  out: {
    kind: 'out',
    section: 'Penjualan',
    listTitle: 'Daftar penjualan',
    newTitle: 'Penjualan baru',
    newLabel: 'Penjualan baru',
    saveLabel: 'Simpan penjualan',
    successTitle: 'Penjualan berhasil disimpan',
    backLabel: 'Kembali ke penjualan',
    listPath: '/penjualan',
    api: '/sales',
    loadError: 'Daftar penjualan gagal dimuat.',
    detailError: 'Penjualan gagal dimuat.',
    saveError: 'Penjualan gagal disimpan.',
    defaultQuantity: '1',
    photoMissing: 'Belum bisa disimpan: foto QC belum tersedia · Lengkapi foto QC sebelum menyimpan penjualan.',
    photoNote: 'Foto kondisi barang dan label barcode harus terlihat.',
    mark: 'OUT',
  },
}
