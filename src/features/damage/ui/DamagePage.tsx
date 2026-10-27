import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Checkbox } from '@/shared/ui/atoms/Checkbox.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getDamages } from '../api/damage.api.ts'
import { dispositions } from '../model/damage.form.ts'
import type { Damage } from '../model/damage.types.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function DamagePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [rows, setRows] = useState<Damage[]>([])
  const [query, setQuery] = useState('')
  const [disposition, setDisposition] = useState('semua')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getDamages()
      .then((list) => {
        if (active) setRows(list.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Daftar barang rusak gagal dimuat.', failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [toast])

  const visible = useMemo(
    () =>
      rows.filter((item) => {
        const haystack = `${item.code} ${item.name} ${item.sku}`.toLowerCase()
        const matchesQuery = haystack.includes(query.trim().toLowerCase())
        const matchesDisposition = disposition === 'semua' || item.disposition === disposition
        return matchesQuery && matchesDisposition
      }),
    [rows, query, disposition],
  )
  const selected = visible.find((item) => item.id === selectedId) ?? null

  return (
    <section className="dash-page">
      <PageHeader section="Barang Rusak" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title="Daftar barang rusak">
        <div className="product-tools">
          <TextField label="Cari" name="damage-search" value={query} placeholder="Cari kode / nama / SKU" onChange={(event) => setQuery(event.target.value)} />
          <SelectField className="product-filter" label="Filter" name="damage-filter" value={disposition} onChange={(event) => setDisposition(event.target.value)}>
            <option value="semua">Semua disposisi</option>
            {dispositions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <Button onClick={() => navigate('/barang-rusak/baru')}>Catatan baru</Button>
        </div>
        <Table caption="Daftar barang rusak">
          <TableHeader>
            <TableHeaderCell className="product-check" />
            <TableHeaderCell>Kode</TableHeaderCell>
            <TableHeaderCell>Produk</TableHeaderCell>
            <TableHeaderCell>Jumlah</TableHeaderCell>
            <TableHeaderCell>Disposisi</TableHeaderCell>
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
                <TableCell>
                  {item.quantity} {item.unit.toUpperCase()}
                </TableCell>
                <TableCell>{item.dispositionLabel}</TableCell>
                <TableCell>{item.at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter colSpan={6} start={`Menampilkan ${visible.length} dari ${rows.length} transaksi`} end={`${visible.length === 0 ? 0 : 1} dari 1`} />
        </Table>
        <div className="product-form-actions product-form-actions-start">
          <Button variant="secondary" disabled={!selected} onClick={() => selected && navigate(`/barang-rusak/${selected.id}`)}>
            Lihat detail
          </Button>
        </div>
      </Card>
    </section>
  )
}
