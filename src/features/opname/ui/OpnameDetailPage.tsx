import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getOpname } from '../api/opname.api.ts'
import { adjMark, auditNote, changeLabel, countLabel, successTitle } from '../model/opname.form.ts'
import type { Opname } from '../model/opname.types.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function OpnameDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [opname, setOpname] = useState<Opname | null>(null)

  useEffect(() => {
    let active = true
    getOpname(id)
      .then((result) => {
        if (active) setOpname(result.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Koreksi opname gagal dimuat.', failureText(error, 'Data tidak ditemukan.'))
      })
    return () => {
      active = false
    }
  }, [id, toast])

  if (!opname) return <section className="dash-page" />

  return (
    <section className="dash-page">
      <PageHeader section="Opname" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title={successTitle} className="product-card">
        <Pill tone={opname.change < 0 ? 'down' : 'up'}>{adjMark(opname.change, opname.unit)}</Pill>
        <Heading className="receipt-code" level={2}>
          {opname.code}
        </Heading>
        <Text>
          {opname.name} · {opname.sku} · {opname.location || '-'}
        </Text>
        <div className="receipt-summary">
          <div>
            <Text>Sebelum</Text>
            <Text className="receipt-figure">{countLabel(opname.before, opname.unit)}</Text>
          </div>
          <div>
            <Text>Perubahan</Text>
            <Text className="receipt-figure">{changeLabel(opname.change, opname.unit)}</Text>
          </div>
          <div>
            <Text>Setelah</Text>
            <Text className="receipt-figure">{countLabel(opname.after, opname.unit)}</Text>
          </div>
        </div>
        <Text className="product-block">{auditNote}</Text>
        <Table caption="Detail koreksi">
          <TableHeader>
            <TableHeaderCell>Kode</TableHeaderCell>
            <TableHeaderCell>Tanggal</TableHeaderCell>
            <TableHeaderCell>Alasan</TableHeaderCell>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{opname.code}</TableCell>
              <TableCell>{opname.at}</TableCell>
              <TableCell>{opname.reason}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter colSpan={3} start="Menampilkan 1 dari 1 koreksi" end="1 dari 1" />
        </Table>
        <div className="product-form-actions product-form-actions-start">
          <Button onClick={() => navigate('/opname')}>Kembali ke opname</Button>
        </div>
      </Card>
    </section>
  )
}
