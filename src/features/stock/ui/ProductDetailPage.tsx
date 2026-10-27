import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { Dialog } from '@/shared/ui/molecules/Dialog.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { deleteStock, getStock } from '../api/stock.api.ts'
import { detailNotice } from '../model/product.form.ts'
import type { StockHistory, StockItem } from '../model/stock.types.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function uploaded(item: StockItem) {
  if (!item.photoName || !item.photoUploadedAt) return null
  const when = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(item.photoUploadedAt))
  return `${item.photoName} · Terunggah · ${when}`
}

export function ProductDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [item, setItem] = useState<StockItem | null>(null)
  const [history, setHistory] = useState<StockHistory[]>([])
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    let active = true
    getStock(id)
      .then((detail) => {
        if (!active) return
        setItem(detail.data)
        setHistory(detail.history)
      })
      .catch((error: unknown) => {
        if (!active) return
        setItem(null)
        toast.error('Produk gagal dimuat.', failureText(error, 'Data produk tidak ditemukan.'))
      })
    return () => {
      active = false
    }
  }, [id])

  if (!item) return <section className="dash-page" />

  const notice = detailNotice(item.quantity, item.unit)
  const fileLine = uploaded(item)

  async function remove() {
    if (!item) return
    try {
      await deleteStock(item.id)
      toast.success('Produk terhapus.', item.name)
      navigate('/produk')
    } catch (error: unknown) {
      setConfirming(false)
      toast.error('Produk gagal dihapus.', failureText(error, 'Stok masih ada atau server menolak.'))
    }
  }

  return (
    <section className="dash-page">
      <PageHeader section="Produk" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title={item.name}>
        <div className="product-hero">
          {item.photoData ? <img src={item.photoData} alt="" width={104} height={104} /> : null}
          <div>
            <Text className="product-hero-name">{item.name}</Text>
            <Text className="product-hero-meta">
              {item.sku} · {item.category} · {item.location}
            </Text>
            <div className="product-hero-row">
              <Pill tone="up">Stok {item.quantity} {item.unit.toUpperCase()}</Pill>
              {fileLine ? <Text>{fileLine}</Text> : null}
            </div>
          </div>
        </div>
        {notice ? <Text className="product-block">{notice}</Text> : null}
        <div className="product-form-actions product-form-actions-start">
          <Button onClick={() => navigate(`/produk/${item.id}/ubah`)}>Ubah produk</Button>
          <Button variant="secondary" onClick={() => navigate(`/produk/${item.id}/cetak`)}>
            Cetak label
          </Button>
          <Button variant="secondary" disabled={item.quantity > 0} onClick={() => setConfirming(true)}>
            Hapus
          </Button>
        </div>
      </Card>
      <Card title="Riwayat transaksi">
        <Table caption="Riwayat transaksi">
          <TableHeader>
            <TableHeaderCell>Kode transaksi</TableHeaderCell>
            <TableHeaderCell>Tanggal</TableHeaderCell>
            <TableHeaderCell>Perubahan stok</TableHeaderCell>
            <TableHeaderCell>Kondisi</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {history.map((row) => (
              <TableRow key={row.code}>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.at}</TableCell>
                <TableCell>{row.change}</TableCell>
                <TableCell>{row.condition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            colSpan={4}
            start={`Menampilkan ${history.length} dari ${history.length} transaksi`}
            end={`${history.length === 0 ? 0 : 1} dari 1`}
          />
        </Table>
      </Card>
      {confirming ? (
        <Dialog
          title="Hapus produk?"
          body="Tindakan ini tidak dapat dibatalkan."
          detail={`${item.name} · ${item.sku} · ${item.quantity} ${item.unit.toUpperCase()}`}
          cancelLabel="Batal"
          confirmLabel="Hapus produk"
          onCancel={() => setConfirming(false)}
          onConfirm={() => void remove()}
        />
      ) : null}
    </section>
  )
}
