import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { getStocks } from '@/features/stock/api/stock.api.ts'
import type { StockItem } from '@/features/stock/model/stock.types.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Checkbox } from '@/shared/ui/atoms/Checkbox.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { StageTabs } from '@/shared/ui/molecules/StageTabs.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { createOpname } from '../api/opname.api.ts'
import {
  adjMark,
  auditNote,
  changeLabel,
  countLabel,
  formTitle,
  parseCount,
  pendingNote,
  reasonHint,
  reasonRequired,
  successTitle,
} from '../model/opname.form.ts'
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

type Stage = 'pick' | 'count' | 'confirm'

export function OpnameFormPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('pick')
  const [counted, setCounted] = useState('')
  const [reason, setReason] = useState('')
  const [triedContinue, setTriedContinue] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<Opname | null>(null)

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

  const visible = useMemo(
    () =>
      stocks.filter((item) => {
        const haystack = `${item.name} ${item.sku} ${item.location}`.toLowerCase()
        return haystack.includes(query.trim().toLowerCase())
      }),
    [stocks, query],
  )
  const product = stocks.find((item) => item.id === selectedId) ?? null
  const count = parseCount(counted)
  const reasonReady = reason.trim().length > 0
  const reasonInvalid = triedContinue && !reasonReady
  const change = product && count !== null ? count - product.quantity : null
  const locked = !product

  function goStage(next: string) {
    if (next === 'pick') {
      setStage('pick')
      return
    }
    if (!product) return
    if (next === 'count') {
      setStage('count')
      return
    }
    if (next === 'confirm' && count !== null && reasonReady) {
      setStage('confirm')
    }
  }

  function continueCount() {
    if (!product) {
      toast.error('Produk belum dipilih.', 'Pilih satu produk dari daftar.')
      return
    }
    setCounted(String(product.quantity))
    setTriedContinue(false)
    setStage('count')
  }

  function continueConfirm() {
    setTriedContinue(true)
    if (count === null) {
      toast.error('Hitung fisik tidak valid.', 'Isi dengan angka 0 atau lebih.')
      return
    }
    if (!reasonReady) {
      toast.error('Alasan kosong.', reasonRequired)
      return
    }
    setStage('confirm')
  }

  async function save() {
    if (!product || count === null || !reasonReady) {
      toast.error('Koreksi belum lengkap.', reasonRequired)
      return
    }
    setSaving(true)
    try {
      const created = await createOpname({
        sku: product.sku,
        counted: count,
        reason: reason.trim(),
      })
      setSaved(created.data)
      toast.success(successTitle, created.data.code)
    } catch (error: unknown) {
      toast.error('Koreksi gagal disimpan.', failureText(error, 'Stok tidak berubah.'))
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    navigate('/opname')
  }

  return (
    <section className="dash-page">
      <PageHeader section="Opname" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title={saved ? successTitle : formTitle} className="product-card">
        {saved && product && change !== null ? (
          <>
            <Pill tone={change < 0 ? 'down' : 'up'}>{adjMark(change, product.unit)}</Pill>
            <Heading className="receipt-code" level={2}>
              {saved.code}
            </Heading>
            <Text>
              {saved.name} · {saved.sku} · {saved.location || '-'}
            </Text>
            <div className="receipt-summary">
              <div>
                <Text>Sebelum</Text>
                <Text className="receipt-figure">{countLabel(saved.before, saved.unit)}</Text>
              </div>
              <div>
                <Text>Perubahan</Text>
                <Text className="receipt-figure">{changeLabel(saved.change, saved.unit)}</Text>
              </div>
              <div>
                <Text>Setelah</Text>
                <Text className="receipt-figure">{countLabel(saved.after, saved.unit)}</Text>
              </div>
            </div>
            <Text className="product-block">{auditNote}</Text>
            <Table caption="Koreksi tersimpan">
              <TableHeader>
                <TableHeaderCell>Kode</TableHeaderCell>
                <TableHeaderCell>Tanggal</TableHeaderCell>
                <TableHeaderCell>Alasan</TableHeaderCell>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{saved.code}</TableCell>
                  <TableCell>{saved.at}</TableCell>
                  <TableCell>{saved.reason}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter colSpan={3} start="Menampilkan 1 dari 1 koreksi" end="1 dari 1" />
            </Table>
            <div className="product-form-actions product-form-actions-start">
              <Button onClick={reset}>Kembali ke opname</Button>
            </div>
          </>
        ) : null}

        {saved ? null : (
          <>
            <StageTabs
              value={stage}
              onChange={goStage}
              stages={[
                { id: 'pick', label: 'Pilih produk' },
                { id: 'count', label: 'Hitung fisik', disabled: locked },
                { id: 'confirm', label: 'Konfirmasi', disabled: locked || count === null || !reasonReady },
              ]}
            />

            {stage === 'pick' ? (
              <>
                <TextField
                  label="Cari nama / SKU / barcode"
                  name="opname-pick-search"
                  value={query}
                  placeholder="Cari nama / SKU / barcode"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Table caption="Pilih produk opname">
                  <TableHeader>
                    <TableHeaderCell className="product-check" />
                    <TableHeaderCell>Produk</TableHeaderCell>
                    <TableHeaderCell>SKU</TableHeaderCell>
                    <TableHeaderCell>Lokasi</TableHeaderCell>
                    <TableHeaderCell>Stok tercatat</TableHeaderCell>
                  </TableHeader>
                  <TableBody>
                    {visible.map((item) => (
                      <TableRow key={item.id} selected={item.id === selectedId}>
                        <TableCell className="product-check">
                          <Checkbox
                            hideLabel
                            label={`Pilih ${item.name}`}
                            name={`opname-product-${item.id}`}
                            checked={selectedId === item.id}
                            onChange={(event) => setSelectedId(event.target.checked ? item.id : null)}
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.location || '-'}</TableCell>
                        <TableCell>{countLabel(item.quantity, item.unit)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter
                    colSpan={5}
                    start={`Menampilkan ${visible.length} dari ${stocks.length} produk`}
                    end={`${visible.length === 0 ? 0 : 1} dari 1`}
                  />
                </Table>
                <div className="product-form-actions">
                  <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                    Batal
                  </Button>
                  <Button disabled={!product} onClick={continueCount}>
                    Lanjut ke hitung fisik
                  </Button>
                </div>
              </>
            ) : null}

            {(stage === 'count' || stage === 'confirm') && product && change !== null ? (
              <>
                <div>
                  <Heading level={3}>{product.name}</Heading>
                  <Text>
                    {product.sku} · {product.category} · {product.location || '-'}
                  </Text>
                  <Text className="receipt-stock">{countLabel(product.quantity, product.unit)}</Text>
                </div>
                <div className="receipt-summary">
                  <div>
                    <Text>Stok tercatat</Text>
                    <Text className="receipt-figure receipt-figure-lg">{product.quantity}</Text>
                  </div>
                  <div>
                    <Text>Hitung fisik</Text>
                    <Text className="receipt-figure receipt-figure-lg">{count ?? '—'}</Text>
                  </div>
                  <div>
                    <Text>Selisih</Text>
                    <Text className="receipt-figure receipt-figure-lg">{count === null ? '—' : change}</Text>
                  </div>
                </div>
                <TextField
                  label="Hitung fisik"
                  name="opname-counted"
                  value={stage === 'confirm' && count !== null ? countLabel(count, product.unit) : counted}
                  readOnly={stage === 'confirm'}
                  onChange={(event) => setCounted(event.target.value)}
                />
                <TextField
                  label="Alasan koreksi"
                  name="opname-reason"
                  value={reason}
                  placeholder="Masukkan alasan koreksi"
                  readOnly={stage === 'confirm'}
                  invalid={stage === 'count' && reasonInvalid}
                  hint={stage === 'count' && reasonInvalid ? reasonHint : stage === 'confirm' ? reasonHint : undefined}
                  onChange={(event) => setReason(event.target.value)}
                />
                {stage === 'count' && reasonInvalid ? <Text className="product-alert">{reasonRequired}</Text> : null}
                <Text className="product-block">{pendingNote(product.quantity, product.unit)}</Text>
                <div className="product-form-actions">
                  <Button variant="secondary" onClick={() => setStage(stage === 'confirm' ? 'count' : 'pick')}>
                    Kembali
                  </Button>
                  {stage === 'count' ? (
                    <Button disabled={count === null || !reasonReady} onClick={continueConfirm}>
                      Lanjut ke konfirmasi
                    </Button>
                  ) : (
                    <Button disabled={saving} onClick={() => void save()}>
                      Konfirmasi koreksi
                    </Button>
                  )}
                </div>
              </>
            ) : null}
          </>
        )}
      </Card>
    </section>
  )
}
