import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
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
    <Table caption="Daftar stok dari fake server">
      <TableHeader>
        <TableHeaderCell>SKU</TableHeaderCell>
        <TableHeaderCell>Nama</TableHeaderCell>
        <TableHeaderCell>Kategori</TableHeaderCell>
        <TableHeaderCell className="hs-num">Jumlah</TableHeaderCell>
        <TableHeaderCell className="hs-num">Harga</TableHeaderCell>
        <TableHeaderCell />
      </TableHeader>
      <TableBody>
        {stocks.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="hs-num">
              {formatNumber(item.quantity)} {item.unit}
            </TableCell>
            <TableCell className="hs-num">{formatRupiah(item.price)}</TableCell>
            <TableCell className="hs-num">
              <Button variant="secondary" disabled={busyId === item.id} onClick={() => onDelete(item.id)}>
                {busyId === item.id ? '...' : 'Hapus'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter start={`Menampilkan ${formatNumber(stocks.length)} barang`} end="Daftar stok" colSpan={6} />
    </Table>
  )
}
