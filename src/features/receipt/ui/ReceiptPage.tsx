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
import { getReceipts } from '../api/receipt.api.ts'
import { flows, type FlowKind } from '../model/flow.ts'
import { conditions } from '../model/receipt.form.ts'
import type { Receipt } from '../model/receipt.types.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function ReceiptPage({ kind = 'in' }: { kind?: FlowKind }) {
  const flow = flows[kind]
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [query, setQuery] = useState('')
  const [condition, setCondition] = useState('semua')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getReceipts(flow.api)
      .then((list) => {
        if (active) setReceipts(list.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error(flow.loadError, failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [toast, flow.api, flow.loadError])

  const visible = useMemo(
    () =>
      receipts.filter((item) => {
        const haystack = `${item.code} ${item.name} ${item.sku}`.toLowerCase()
        const matchesQuery = haystack.includes(query.trim().toLowerCase())
        const matchesCondition = condition === 'semua' || item.condition === condition
        return matchesQuery && matchesCondition
      }),
    [receipts, query, condition],
  )

  const selected = visible.find((item) => item.id === selectedId) ?? null

  function openDetail() {
    if (!selected) return
    navigate(`${flow.listPath}/${selected.id}`)
  }

  return (
    <section className="dash-page">
      <PageHeader section={flow.section} detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title={flow.listTitle}>
        <div className="product-tools">
          <TextField
            label="Cari"
            name={`${kind}-search`}
            value={query}
            placeholder="Cari kode / nama / SKU"
            onChange={(event) => setQuery(event.target.value)}
          />
          <SelectField className="product-filter" label="Filter" name={`${kind}-condition`} value={condition} onChange={(event) => setCondition(event.target.value)}>
            <option value="semua">Semua kondisi</option>
            {conditions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <Button onClick={() => navigate(`${flow.listPath}/baru`)}>{flow.newLabel}</Button>
        </div>
        <Table caption={flow.listTitle}>
          <TableHeader>
            <TableHeaderCell className="product-check" />
            <TableHeaderCell>Kode transaksi</TableHeaderCell>
            <TableHeaderCell>Produk</TableHeaderCell>
            <TableHeaderCell>Jumlah</TableHeaderCell>
            <TableHeaderCell>Kondisi</TableHeaderCell>
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
                <TableCell>{item.condition}</TableCell>
                <TableCell>{item.at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            colSpan={6}
            start={`Menampilkan ${visible.length} dari ${receipts.length} transaksi`}
            end={`${visible.length === 0 ? 0 : 1} dari 1`}
          />
        </Table>
        <div className="product-form-actions product-form-actions-start">
          <Button variant="secondary" disabled={!selected} onClick={openDetail}>
            Lihat detail
          </Button>
        </div>
      </Card>
    </section>
  )
}
