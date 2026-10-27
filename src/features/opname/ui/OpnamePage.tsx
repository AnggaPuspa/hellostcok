import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Checkbox } from '@/shared/ui/atoms/Checkbox.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getOpnames } from '../api/opname.api.ts'
import { changeLabel } from '../model/opname.form.ts'
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

export function OpnamePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [rows, setRows] = useState<Opname[]>([])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getOpnames()
      .then((list) => {
        if (active) setRows(list.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Daftar opname gagal dimuat.', failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [toast])

  const visible = useMemo(
    () =>
      rows.filter((item) => {
        const haystack = `${item.code} ${item.name} ${item.sku} ${item.reason}`.toLowerCase()
        return haystack.includes(query.trim().toLowerCase())
      }),
    [rows, query],
  )
  const selected = visible.find((item) => item.id === selectedId) ?? null

  return (
    <section className="dash-page">
      <PageHeader section="Opname" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title="Daftar koreksi opname">
        <div className="product-tools">
          <TextField
            label="Cari"
            name="opname-search"
            value={query}
            placeholder="Cari kode / nama / SKU"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button onClick={() => navigate('/opname/baru')}>Koreksi baru</Button>
        </div>
        <Table caption="Daftar koreksi opname">
          <TableHeader>
            <TableHeaderCell className="product-check" />
            <TableHeaderCell>Kode</TableHeaderCell>
            <TableHeaderCell>Produk</TableHeaderCell>
            <TableHeaderCell>Perubahan</TableHeaderCell>
            <TableHeaderCell>Alasan</TableHeaderCell>
            <TableHeaderCell>Tanggal</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {visible.map((item) => (
              <TableRow key={item.id} selected={item.id === selectedId}>
                <TableCell className="product-check">
                  <Checkbox
                    hideLabel
                    label={`Pilih ${item.code}`}
                    name={`pick-${item.id}`}
                    checked={selectedId === item.id}
                    onChange={(event) => setSelectedId(event.target.checked ? item.id : null)}
                  />
                </TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{changeLabel(item.change, item.unit)}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            colSpan={6}
            start={`Menampilkan ${visible.length} dari ${rows.length} koreksi`}
            end={`${visible.length === 0 ? 0 : 1} dari 1`}
          />
        </Table>
        <div className="product-form-actions product-form-actions-start">
          <Button variant="secondary" disabled={!selected} onClick={() => selected && navigate(`/opname/${selected.id}`)}>
            Lihat detail
          </Button>
        </div>
      </Card>
    </section>
  )
}
