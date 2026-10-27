import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { ownerReadOnlyLabel, roleTitle } from '@/shared/ui/layout/nav.ts'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { exportReport, getReportDetail } from '../api/report.api.ts'
import { photoExpired, photoReady, qtyLabel } from '../model/report.form.ts'
import type { ReportDetail, ReportRange } from '../model/report.types.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function ReportDetailPage() {
  const { sku = '' } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const isOwner = session?.role === 'pemilik'
  const who = session ? (isOwner ? roleTitle[session.role] : session.name) : ''
  const [detail, setDetail] = useState<ReportDetail | null>(null)

  const query = {
    range: (params.get('range') as ReportRange) || 'today',
    from: params.get('from') || undefined,
    to: params.get('to') || undefined,
  }

  useEffect(() => {
    let active = true
    getReportDetail(sku, query)
      .then((result) => {
        if (active) setDetail(result.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Detail laporan gagal dimuat.', failureText(error, 'Data tidak ditemukan.'))
      })
    return () => {
      active = false
    }
  }, [sku, query.range, query.from, query.to, toast])

  async function prepareExport() {
    try {
      const file = await exportReport({ ...query, sku })
      const url = URL.createObjectURL(file.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.fileName
      link.click()
      URL.revokeObjectURL(url)
      toast.success('CSV diunduh.', file.fileName)
    } catch (error: unknown) {
      toast.error('Ekspor gagal.', failureText(error, 'File tidak dibuat.'))
    }
  }

  if (!detail) return <section className="dash-page" />

  return (
    <section className="dash-page">
      <PageHeader section="Laporan" detail={`${stamp()} · ${who}`} />
      {isOwner ? <Pill tone="up">{ownerReadOnlyLabel}</Pill> : null}
      <Card title={`Detail laporan · ${detail.name}`} className="product-card">
        <div>
          <Heading level={3}>{detail.name}</Heading>
          <Text>
            {detail.sku} · {detail.category || '-'} · {detail.location || '-'}
          </Text>
          <Text className="receipt-stock">{qtyLabel(detail.closing, detail.unit)}</Text>
        </div>
        <Text>{detail.periodNote}</Text>
        <Table caption="Transaksi laporan">
          <TableHeader>
            <TableHeaderCell>Kode transaksi</TableHeaderCell>
            <TableHeaderCell>Tanggal</TableHeaderCell>
            <TableHeaderCell>Pergerakan</TableHeaderCell>
            <TableHeaderCell>Stok sesudah</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {detail.transactions.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.at}</TableCell>
                <TableCell>{item.mark}</TableCell>
                <TableCell>{item.after}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            colSpan={4}
            start={`Menampilkan ${detail.transactions.length} dari ${detail.transactions.length} transaksi`}
            end={`${detail.transactions.length === 0 ? 0 : 1} dari 1`}
          />
        </Table>
        <Text>{detail.damageNote}</Text>
      </Card>
      <Card title={detail.photo ? `Foto QC · ${detail.photo.code}` : 'Foto QC'} className="product-card">
        <div className="receipt-upload">
          <Heading level={3}>Foto QC</Heading>
          <Text>
            {detail.photo?.status === 'ready' && detail.photo.name
              ? photoReady(detail.photo.name)
              : detail.photo?.status === 'expired'
                ? photoExpired
                : 'Belum ada foto QC pada periode ini'}
          </Text>
        </div>
        <div className="product-form-actions product-form-actions-start">
          <Button variant="secondary" onClick={() => navigate('/laporan')}>
            Kembali ke laporan
          </Button>
          <Button onClick={() => void prepareExport()}>Ekspor CSV</Button>
        </div>
      </Card>
    </section>
  )
}
