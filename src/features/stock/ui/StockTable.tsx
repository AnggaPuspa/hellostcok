import { Button } from '@/shared/ui/atoms/Button.tsx'
import { formatNumber, formatRupiah } from '@/shared/lib/format.ts'
import type { StockItem } from '../model/stock.types.ts'

type StockTableProps = {
  stocks: StockItem[]
  busyId: string | null
  onDelete: (id: string) => void
}

export function StockTable({ stocks, busyId, onDelete }: StockTableProps) {
  if (stocks.length === 0) {
    return <p className="empty">Belum ada barang. Tambah dari formulir, atau reset data awal.</p>
  }

  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Daftar stok dari fake server</caption>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nama</th>
            <th>Kategori</th>
            <th className="num">Jumlah</th>
            <th className="num">Harga</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((item) => (
            <tr key={item.id}>
              <td className="sku">{item.sku}</td>
              <td>
                <span className="item-name">{item.name}</span>
              </td>
              <td>{item.category}</td>
              <td className="num">
                {formatNumber(item.quantity)} {item.unit}
              </td>
              <td className="num">{formatRupiah(item.price)}</td>
              <td className="actions">
                <Button variant="danger" disabled={busyId === item.id} onClick={() => onDelete(item.id)}>
                  {busyId === item.id ? '...' : 'Hapus'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
