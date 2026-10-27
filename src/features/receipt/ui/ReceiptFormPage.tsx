import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { ApiError } from '@/shared/api/client.ts'
import { photoProblem } from '@/features/stock/model/product.form.ts'
import { lookupStock } from '@/features/stock/api/stock.api.ts'
import type { StockItem } from '@/features/stock/model/stock.types.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { StageTabs } from '@/shared/ui/molecules/StageTabs.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { createReceipt, updateReceiptPhoto } from '../api/receipt.api.ts'
import { flows, type FlowKind } from '../model/flow.ts'
import { checkingLabel, checkingNote, conditionHint, conditions, incomingCount, maxStockHint, notFoundMessage, photoEmpty, photoReady, quantityLine, saleForecast, saleRejected, scanHint, stockAfter, stockDelta, stockForecast, stockKept, stockLimitHint } from '../model/receipt.form.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

type Stage = 'scan' | 'data' | 'photo'
type Phase = 'idle' | 'checking' | 'missing' | 'matched'

type SavedReceipt = {
  id: string
  code: string
  at: string
  before: number
  after: number
}

export function ReceiptFormPage({ kind = 'in' }: { kind?: FlowKind }) {
  const flow = flows[kind]
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [stage, setStage] = useState<Stage>('scan')
  const [phase, setPhase] = useState<Phase>('idle')
  const [sku, setSku] = useState('')
  const [product, setProduct] = useState<StockItem | null>(null)
  const [quantity, setQuantity] = useState(flow.defaultQuantity)
  const [condition, setCondition] = useState(conditions[0])
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<SavedReceipt | null>(null)

  const copies = incomingCount(quantity)
  const locked = !product

  async function checkSku() {
    const key = sku.trim()
    if (!key) {
      toast.error('SKU kosong.', 'Pindai atau masukkan SKU / barcode.')
      return
    }
    setPhase('checking')
    try {
      const [found] = await Promise.all([
        lookupStock(key)
          .then((result) => result.data)
          .catch((error: unknown) => {
            if (error instanceof ApiError && error.status === 404) return null
            throw error
          }),
        new Promise((resolve) => window.setTimeout(resolve, 500)),
      ])
      if (!found) {
        setProduct(null)
        setPhase('missing')
        toast.error('Produk tidak ditemukan.', notFoundMessage)
        return
      }
      setProduct(found)
      setPhase('matched')
      setStage('data')
      toast.success('Barcode cocok.', found.name)
    } catch (error: unknown) {
      setPhase('idle')
      toast.error('Pemeriksaan gagal.', failureText(error, 'Fake server tidak menjawab.'))
    }
  }

  function goStage(next: string) {
    if (next !== 'scan' && !product) return
    setStage(next as Stage)
  }

  const tooMany = flow.kind === 'out' && product !== null && copies > product.quantity

  function continuePhoto() {
    if (!copies) {
      toast.error('Jumlah tidak valid.', 'Isi jumlah dengan angka 1 atau lebih.')
      return
    }
    if (tooMany) return
    if (flow.kind === 'in' && condition === 'Rusak' && product) {
      navigate(`/barang-rusak/baru?from=penerimaan&sku=${encodeURIComponent(product.sku)}&qty=${copies}`)
      return
    }
    setStage('photo')
  }

  function choosePhoto(file: File | undefined) {
    if (!file) return
    const problem = photoProblem(file)
    if (problem) {
      toast.error('Foto QC ditolak.', problem)
      return
    }
    setPhotoName(file.name)
    if (!saved) return
    updateReceiptPhoto(saved.id, file.name, flow.api).catch((error: unknown) => {
      toast.error('Foto QC gagal diganti.', failureText(error, 'Nama file tidak tersimpan.'))
    })
  }

  async function save() {
    if (!product || !copies) {
      toast.error(`${flow.section} belum lengkap.`, 'Periksa jumlah dan produk.')
      return
    }
    if (flow.kind === 'out' && copies > product.quantity) {
      toast.error('Jumlah ditolak.', saleRejected(copies, product.quantity, product.unit))
      return
    }
    if (!photoName) {
      toast.error('Foto QC belum ada.', flow.photoMissing)
      return
    }
    setSaving(true)
    try {
      const before = product.quantity
      const created = await createReceipt({
        sku: product.sku,
        quantity: copies,
        condition,
        photoName,
      }, flow.api)
      setSaved({
        id: created.data.id,
        code: created.data.code,
        at: created.data.at,
        before,
        after: flow.kind === 'out' ? before - copies : stockAfter(before, copies, condition),
      })
      toast.success(flow.successTitle, created.data.code)
    } catch (error: unknown) {
      toast.error(flow.saveError, failureText(error, 'Stok tidak berubah.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="dash-page">
      <PageHeader section={flow.section} detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title={saved ? flow.successTitle : flow.newTitle} className="product-card">
        {saved && product ? (
          <>
            <Pill tone={flow.kind === 'out' ? 'down' : 'up'}>
              {flow.mark} · {flow.kind === 'out' ? `−${copies} ${product.unit.toUpperCase()}` : stockDelta(copies, product.unit, condition)}
            </Pill>
            <Heading className="receipt-code" level={2}>{saved.code}</Heading>
            <Text>
              {product.name} · {product.sku} · {product.location || '-'}
            </Text>
            <div className="receipt-summary">
              <div>
                <Text>Sebelum</Text>
                <Text className="receipt-figure">{saved.before} {product.unit.toUpperCase()}</Text>
              </div>
              <div>
                <Text>Perubahan</Text>
                <Text className="receipt-figure">{flow.kind === 'out' ? `−${copies} ${product.unit.toUpperCase()}` : stockDelta(copies, product.unit, condition)}</Text>
              </div>
              <div>
                <Text>Setelah</Text>
                <Text className="receipt-figure">{saved.after} {product.unit.toUpperCase()}</Text>
              </div>
            </div>
            <Text>{saved.at}</Text>
            <div className="receipt-upload">
              <Heading level={3}>Foto QC</Heading>
              <Text>{photoName ? photoReady(photoName) : photoEmpty}</Text>
              <Button variant="secondary" onClick={() => document.getElementById(`${kind}-file`)?.click()}>
                Ganti foto
              </Button>
            </div>
            <div className="product-form-actions product-form-actions-start">
              <Button onClick={() => navigate(flow.listPath)}>{flow.backLabel}</Button>
            </div>
          </>
        ) : null}
        {saved ? null : (
        <>
        <StageTabs
          value={stage}
          onChange={goStage}
          stages={[
            { id: 'scan', label: 'Pindai' },
            { id: 'data', label: 'Data', disabled: locked },
            { id: 'photo', label: 'Foto QC', disabled: locked },
          ]}
        />

        {stage === 'scan' ? (
          <>
            <TextField
              label="SKU / barcode"
              name="receipt-sku"
              value={sku}
              placeholder="Pindai atau masukkan SKU / barcode"
              onChange={(event) => {
                setSku(event.target.value)
                if (phase !== 'idle') setPhase('idle')
              }}
            />
            {phase === 'checking' ? <Text className="product-block">{checkingLabel(sku)}</Text> : null}
            {phase === 'missing' ? <Text className="product-alert">{notFoundMessage}</Text> : null}
            {phase === 'checking' ? <Text>{checkingNote}</Text> : null}
            {phase === 'idle' || phase === 'matched' ? <Text>{scanHint}</Text> : null}
            <div className="product-form-actions">
              <Button variant="secondary" onClick={() => navigate(flow.listPath)}>
                Batal
              </Button>
              {phase === 'missing' ? (
                <Button onClick={() => setPhase('idle')}>Pindai ulang</Button>
              ) : (
                <Button disabled={phase === 'checking'} onClick={() => void checkSku()}>
                  {phase === 'checking' ? 'Memeriksa…' : 'Periksa barcode'}
                </Button>
              )}
            </div>
          </>
        ) : null}

        {stage === 'data' && product ? (
          <>
            <div className="receipt-match">
              <div>
                <Heading level={3}>{product.name}</Heading>
                <Text>
                  {product.sku} · {product.category} · {product.location || '-'}
                </Text>
                <Text className="receipt-stock">
                  {product.quantity} {product.unit.toUpperCase()}
                </Text>
              </div>
              <Pill tone="up">Barcode cocok</Pill>
            </div>
            <div className="product-pair">
              <TextField
                label="Jumlah"
                name={`${kind}-qty`}
                value={quantity}
                invalid={tooMany}
                hint={flow.kind === 'out' ? (tooMany ? maxStockHint(product.quantity, product.unit) : stockLimitHint) : undefined}
                onChange={(event) => setQuantity(event.target.value)}
              />
              <SelectField label="Kondisi barang" name={`${kind}-condition`} value={condition} onChange={(event) => setCondition(event.target.value)}>
                {conditions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectField>
            </div>
            {flow.kind === 'in' ? <Text className="product-size-hint">{conditionHint}</Text> : null}
            {tooMany ? <Text className="product-alert">{saleRejected(copies, product.quantity, product.unit)}</Text> : null}
            {flow.kind === 'out' && tooMany ? <Text>{stockLimitHint}</Text> : null}
            {flow.kind === 'out' && tooMany ? <Text className="product-missing">{stockKept}</Text> : null}
            {tooMany ? null : (
              <Text className="product-block">
                {flow.kind === 'out' ? saleForecast(copies, product.quantity, product.unit) : stockForecast(product.quantity, product.unit, copies, condition)}
              </Text>
            )}
            <div className="product-form-actions">
              <Button variant="secondary" onClick={() => setStage('scan')}>
                Kembali
              </Button>
              <Button disabled={tooMany || !copies} onClick={continuePhoto}>
                {flow.kind === 'in' && condition === 'Rusak' ? 'Catat kerusakan' : 'Lanjut ke Foto QC'}
              </Button>
            </div>
          </>
        ) : null}

        {stage === 'photo' && product ? (
          <>
            <div className="receipt-match">
              <div>
                <Heading level={3}>{product.name}</Heading>
                <Text>
                  {product.sku} · {product.category} · {product.location || '-'}
                </Text>
                <Text className="receipt-stock">
                  {product.quantity} {product.unit.toUpperCase()}
                </Text>
              </div>
              <Pill tone="up">Barcode cocok</Pill>
            </div>
            <Text>{quantityLine(copies, product.unit, condition)}</Text>
            <div className="receipt-upload">
              <Heading level={3}>Foto QC</Heading>
              <Text>{photoName ? photoReady(photoName) : photoEmpty}</Text>
              <Button variant="secondary" onClick={() => document.getElementById(`${kind}-file`)?.click()}>
                {photoName ? 'Ganti foto' : 'Pilih file'}
              </Button>
            </div>
            {flow.photoNote ? <Text>{flow.photoNote}</Text> : null}
            {photoName ? null : <Text className="product-alert">{flow.photoMissing}</Text>}
            <Text className="product-block">
              {flow.kind === 'out' ? saleForecast(copies, product.quantity, product.unit) : stockForecast(product.quantity, product.unit, copies, condition)}
            </Text>
            <div className="product-form-actions">
              <Button variant="secondary" onClick={() => setStage('data')}>
                Kembali
              </Button>
              <Button disabled={saving || !photoName} onClick={() => void save()}>
                {flow.saveLabel}
              </Button>
            </div>
          </>
        ) : null}
        </>
        )}
        <input
          id={`${kind}-file`}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(event) => choosePhoto(event.target.files?.[0])}
        />
      </Card>
    </section>
  )
}
