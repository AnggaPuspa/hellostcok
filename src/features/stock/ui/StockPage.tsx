import { useEffect, useState } from 'react'
import { ApiError } from '@/shared/api/client.ts'
import { getHealth } from '@/shared/api/health.ts'
import { formatNumber, formatRupiah } from '@/shared/lib/format.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { createStock, deleteStock, getStocks, resetStocks } from '../api/stock.api.ts'
import type { StockInput, StockItem } from '../model/stock.types.ts'
import { StockForm } from './StockForm.tsx'
import { StockTable } from './StockTable.tsx'

function offlineMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  return 'Fake server belum jalan. Jalankan npm run dev dari folder proyek.'
}

export function StockPage() {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [serverOk, setServerOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [health, list] = await Promise.all([getHealth(), getStocks()])
      setServerOk(health.ok)
      setStocks(list.data)
    } catch (err) {
      setServerOk(false)
      setStocks([])
      setError(offlineMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    async function firstLoad() {
      try {
        const [health, list] = await Promise.all([getHealth(), getStocks()])
        if (!active) return
        setServerOk(health.ok)
        setStocks(list.data)
      } catch (err) {
        if (!active) return
        setServerOk(false)
        setStocks([])
        setError(offlineMessage(err))
      } finally {
        if (active) setLoading(false)
      }
    }

    void firstLoad()
    return () => {
      active = false
    }
  }, [])

  async function handleCreate(input: StockInput) {
    const created = await createStock(input)
    setStocks((current) => [created.data, ...current])
    setServerOk(true)
    setError(null)
  }

  async function handleDelete(id: string) {
    setBusyId(id)
    setError(null)
    try {
      await deleteStock(id)
      setStocks((current) => current.filter((item) => item.id !== id))
    } catch (err) {
      setError(offlineMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  async function handleReset() {
    setLoading(true)
    setError(null)
    try {
      const list = await resetStocks()
      setStocks(list.data)
      setServerOk(true)
    } catch (err) {
      setError(offlineMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const totalQty = stocks.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = stocks.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div className="page">
      <section className="status-row" aria-live="polite">
        <Text as="span" className={serverOk ? 'pill pill-ok' : 'pill pill-off'}>
          {serverOk ? 'Fake server terhubung' : 'Fake server tidak terhubung'}
        </Text>
        <div className="status-actions">
          <Button variant="secondary" onClick={() => void load()} disabled={loading}>
            Muat ulang
          </Button>
          <Button variant="secondary" onClick={() => void handleReset()} disabled={loading || !serverOk}>
            Reset data awal
          </Button>
        </div>
      </section>

      {error ? <Text className="banner">{error}</Text> : null}

      <section className="stats">
        <article>
          <Text>Jenis barang</Text>
          <Text className="dash-figure">{formatNumber(stocks.length)}</Text>
        </article>
        <article>
          <Text>Total jumlah</Text>
          <Text className="dash-figure">{formatNumber(totalQty)}</Text>
        </article>
        <article>
          <Text>Nilai stok</Text>
          <Text className="dash-figure">{formatRupiah(totalValue)}</Text>
        </article>
      </section>

      <div className="layout">
        <StockForm disabled={!serverOk || loading} onCreate={handleCreate} />
        <Card title="Daftar stok">
          <Text className="card-lead">GET /api/stocks</Text>
          {loading ? <Text className="empty">Mengambil data dari fake server...</Text> : <StockTable stocks={stocks} busyId={busyId} onDelete={(id) => void handleDelete(id)} />}
        </Card>
      </div>
    </div>
  )
}
