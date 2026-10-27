import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { getStocks } from '@/features/stock/api/stock.api.ts'
import type { StockItem } from '@/features/stock/model/stock.types.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { ownerReadOnlyLabel, roleTitle } from '@/shared/ui/layout/nav.ts'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { StageTabs } from '@/shared/ui/molecules/StageTabs.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { exportReport, getReport } from '../api/report.api.ts'
import { adjustLabel, exportPreparing, exportReady, qtyLabel, ranges } from '../model/report.form.ts'
import type { ReportList, ReportRange } from '../model/report.types.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

type ExportState = 'idle' | 'preparing' | 'ready'

export function ReportPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const isOwner = session?.role === 'pemilik'
  const who = session ? (isOwner ? roleTitle[session.role] : session.name) : ''
  const [range, setRange] = useState<ReportRange>('today')
  const [sku, setSku] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [applied, setApplied] = useState({ range: 'today' as ReportRange, sku: '', from: '', to: '' })
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [report, setReport] = useState<ReportList | null>(null)
  const [exportState, setExportState] = useState<ExportState>('idle')
  const [exportMeta, setExportMeta] = useState<{ fileName: string; blob: Blob; rows: number } | null>(null)

  useEffect(() => {
    let active = true
    getStocks()
      .then((list) => {
        if (active) setStocks(list.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Produk gagal dimuat.', failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [toast])

  useEffect(() => {
    let active = true
    getReport({
      range: applied.range,
      sku: applied.sku || undefined,
      from: applied.from || undefined,
      to: applied.to || undefined,
    })
      .then((result) => {
        if (active) setReport(result)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Laporan gagal dimuat.', failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [applied, toast])

  function applyFilter() {
    setExportState('idle')
    setExportMeta(null)
    setApplied({ range, sku, from, to })
  }

  async function prepareExport() {
    setExportState('preparing')
    setExportMeta(null)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      const file = await exportReport({
        range: applied.range,
        sku: applied.sku || undefined,
        from: applied.from || undefined,
        to: applied.to || undefined,
      })
      const rows = report?.data.length ?? 0
      setExportMeta({ ...file, rows })
      setExportState('ready')
      toast.success('Ekspor siap.', file.fileName)
    } catch (error: unknown) {
      setExportState('idle')
      toast.error('Ekspor gagal.', failureText(error, 'File tidak dibuat.'))
    }
  }

  function downloadExport() {
    if (!exportMeta) return
    const url = URL.createObjectURL(exportMeta.blob)
    const link = document.createElement('a')
    link.href = url
    link.download = exportMeta.fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const rows = report?.data ?? []

  return (
    <section className="dash-page">
      <PageHeader section="Laporan" detail={`${stamp()} · ${who}`} />
      {isOwner ? <Pill tone="up">{ownerReadOnlyLabel}</Pill> : null}
      <Card title="Laporan stok" className="product-card">
        <StageTabs
          value={range}
          onChange={(id) => setRange(id as ReportRange)}
          stages={ranges.map((item) => ({ id: item.id, label: item.label }))}
        />
        <div className="product-tools">
          <SelectField
            label="Periode"
            name="report-period"
            value={range}
            onChange={(event) => setRange(event.target.value as ReportRange)}
          >
            {ranges.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <SelectField label="Produk" name="report-product" value={sku} onChange={(event) => setSku(event.target.value)}>
            <option value="">Semua produk</option>
            {stocks.map((item) => (
              <option key={item.id} value={item.sku}>
                {item.name} · {item.sku}
              </option>
            ))}
          </SelectField>
          <Button onClick={applyFilter}>Terapkan filter</Button>
          <Button variant="secondary" onClick={() => void prepareExport()}>
            Ekspor CSV
          </Button>
        </div>
        {range === 'custom' ? (
          <div className="product-pair">
            <TextField label="Dari" name="report-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
            <TextField label="Sampai" name="report-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </div>
        ) : null}
        <Text>{report?.summary ?? 'Memuat…'}</Text>
        <Table caption="Laporan stok">
          <TableHeader>
            <TableHeaderCell>Produk</TableHeaderCell>
            <TableHeaderCell>Awal</TableHeaderCell>
            <TableHeaderCell>Penerimaan (+IN)</TableHeaderCell>
            <TableHeaderCell>Penjualan (−OUT)</TableHeaderCell>
            <TableHeaderCell>Koreksi (±ADJ)</TableHeaderCell>
            <TableHeaderCell>Kerusakan toko (−DAMAGE)</TableHeaderCell>
            <TableHeaderCell>Akhir</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.sku}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{qtyLabel(item.opening, item.unit)}</TableCell>
                <TableCell>{qtyLabel(item.incoming, item.unit)}</TableCell>
                <TableCell>{qtyLabel(item.outgoing, item.unit)}</TableCell>
                <TableCell>{adjustLabel(item.adjust, item.unit)}</TableCell>
                <TableCell>{qtyLabel(item.damage, item.unit)}</TableCell>
                <TableCell>{qtyLabel(item.closing, item.unit)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            colSpan={7}
            start={`Menampilkan ${rows.length} dari ${rows.length} produk`}
            end={`${rows.length === 0 ? 0 : 1} dari 1`}
          />
        </Table>
        <div className="product-form-actions product-form-actions-start">
          <Button
            variant="secondary"
            disabled={rows.length === 0}
            onClick={() => {
              const first = rows[0]
              if (!first) return
              const params = new URLSearchParams({ range: applied.range })
              if (applied.from) params.set('from', applied.from)
              if (applied.to) params.set('to', applied.to)
              navigate(`/laporan/${encodeURIComponent(first.sku)}?${params.toString()}`)
            }}
          >
            Lihat detail transaksi & foto QC →
          </Button>
        </div>
        {exportState === 'preparing' ? <Text className="product-block">{exportPreparing}</Text> : null}
        {exportState === 'ready' && exportMeta ? (
          <>
            <Text className="product-block">{exportReady(exportMeta.fileName, exportMeta.rows)}</Text>
            <div className="product-form-actions product-form-actions-start">
              <Button onClick={downloadExport}>Unduh CSV</Button>
            </div>
          </>
        ) : null}
      </Card>
    </section>
  )
}
