import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Checkbox } from '@/shared/ui/atoms/Checkbox.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { Dialog } from '@/shared/ui/molecules/Dialog.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { deleteStock, getStocks } from '../api/stock.api.ts'
import type { StockItem } from '../model/stock.types.ts'

type ProductDialog =
  | { kind: 'blocked'; item: StockItem }
  | { kind: 'confirm'; item: StockItem }
  | { kind: 'deleted'; name: string }

function stockLabel(item: StockItem) {
  return `${item.quantity} ${item.unit.toUpperCase()}`
}

export function ProductPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('semua')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<ProductDialog | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getStocks()
      .then((list) => {
        if (active) setStocks(list.data)
      })
      .catch((err: unknown) => {
        if (!active) return
        const message = failureText(err, 'Stok tidak bisa dimuat.')
        setError(message)
        toast.error('Daftar produk gagal dimuat.', message)
      })
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () => [...new Set(stocks.map((item) => item.category))].sort((a, b) => a.localeCompare(b, 'id')),
    [stocks],
  )

  const visible = stocks.filter((item) => {
    const haystack = `${item.name} ${item.sku}`.toLowerCase()
    const matchesQuery = haystack.includes(query.trim().toLowerCase())
    const matchesCategory = category === 'semua' || item.category === category
    return matchesQuery && matchesCategory
  })

  const selected = stocks.find((item) => item.id === selectedId) ?? null
  const total = stocks.reduce((sum, item) => sum + item.quantity, 0)
  const unit = stocks[0]?.unit.toUpperCase() ?? 'UNIT'
  const when = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  function askDelete() {
    if (!selected) return
    setDialog(selected.quantity > 0 ? { kind: 'blocked', item: selected } : { kind: 'confirm', item: selected })
  }

  async function confirmDelete(item: StockItem) {
    try {
      await deleteStock(item.id)
      setStocks((current) => current.filter((stock) => stock.id !== item.id))
      setSelectedId(null)
      setDialog({ kind: 'deleted', name: item.name })
      toast.success('Produk terhapus.', item.name)
    } catch (err: unknown) {
      setDialog(null)
      const message = failureText(err, 'Produk tidak terhapus.')
      setError(message)
      toast.error('Produk gagal dihapus.', message)
    }
  }

  return (
    <section className="dash-page">
      <PageHeader section="Produk" detail={`${when} · ${session?.name ?? ''}`} />

      <Card title="Daftar produk">
        <div className="product-tools">
          <TextField
            label="Cari"
            name="product-search"
            value={query}
            placeholder="Cari nama / SKU / barcode"
            onChange={(event) => setQuery(event.target.value)}
          />
          <SelectField
            className="product-filter"
            label="Filter"
            name="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="semua">Semua kategori</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <Button onClick={() => navigate('/produk/tambah')}>Tambah produk</Button>
        </div>

        {error ? <Text className="banner">{error}</Text> : null}

        <Table caption="Daftar produk">
          <TableHeader>
            <TableHeaderCell className="product-check" />
            <TableHeaderCell>Nama</TableHeaderCell>
            <TableHeaderCell>Foto</TableHeaderCell>
            <TableHeaderCell>SKU/barcode</TableHeaderCell>
            <TableHeaderCell>Kategori</TableHeaderCell>
            <TableHeaderCell>Lokasi</TableHeaderCell>
            <TableHeaderCell>Stok</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {visible.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="product-check">
                  <Checkbox
                    hideLabel
                    label={`Pilih ${item.name}`}
                    name={`pick-${item.id}`}
                    checked={selectedId === item.id}
                    onChange={(event) => setSelectedId(event.target.checked ? item.id : null)}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.photoData ? <img className="product-photo" src={item.photoData} alt="" width={48} height={48} /> : null}
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{stockLabel(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            colSpan={7}
            start={`Menampilkan ${visible.length} dari ${stocks.length} produk`}
            end={`${visible.length === 0 ? 0 : 1} dari 1`}
          />
        </Table>

        <div className="product-actions">
          <Text>
            Total stok: {total} {unit}
          </Text>
          <Button variant="secondary" disabled={!selected} onClick={() => selected && navigate(`/produk/${selected.id}`)}>
            Lihat detail
          </Button>
          <Button variant="secondary" disabled={!selected} onClick={() => selected && navigate(`/produk/${selected.id}/ubah`)}>
            Ubah
          </Button>
          <Button className={selected && selected.quantity > 0 ? 'is-quiet' : undefined} variant="secondary" disabled={!selected} onClick={askDelete}>
            Hapus
          </Button>
        </div>
      </Card>

      {dialog?.kind === 'blocked' ? (
        <Dialog
          title="Produk tidak dapat dihapus"
          body={`Stok ${stockLabel(dialog.item)} masih tersedia · Produk tidak dapat dihapus.`}
          cancelLabel="Tutup"
          confirmLabel="Kembali ke produk"
          onCancel={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
        />
      ) : null}

      {dialog?.kind === 'confirm' ? (
        <Dialog
          title="Hapus produk?"
          body="Tindakan ini tidak dapat dibatalkan."
          detail={`${dialog.item.name} · ${dialog.item.sku} · ${stockLabel(dialog.item)}`}
          cancelLabel="Batal"
          confirmLabel="Hapus produk"
          onCancel={() => setDialog(null)}
          onConfirm={() => void confirmDelete(dialog.item)}
        />
      ) : null}

      {dialog?.kind === 'deleted' ? (
        <Dialog
          title={`${dialog.name} berhasil dihapus`}
          body="Produk dengan stok 0 UNIT telah dihapus."
          cancelLabel="Tutup"
          confirmLabel="Kembali ke produk"
          onCancel={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
        />
      ) : null}
    </section>
  )
}
