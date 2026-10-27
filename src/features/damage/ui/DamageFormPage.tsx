import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { photoProblem } from '@/features/stock/model/product.form.ts'
import { getStocks } from '@/features/stock/api/stock.api.ts'
import type { StockItem } from '@/features/stock/model/stock.types.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { createDamage } from '../api/damage.api.ts'
import { destroyKept, destroyLimit, destroyRejected, dispositionHint, dispositions, draftNotice, maxDamageHint, photoEmpty, photoReady, receiptCondition, receiptKept, stockNotice } from '../model/damage.form.ts'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function DamageFormPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const toast = useToast()
  const session = getSession()
  const fromReceipt = params.get('from') === 'penerimaan'
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [sku, setSku] = useState(params.get('sku') ?? '')
  const [quantity, setQuantity] = useState(params.get('qty') ?? '1')
  const [note, setNote] = useState('')
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [disposition, setDisposition] = useState(dispositions[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    getStocks()
      .then((list) => {
        if (!active) return
        setStocks(list.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Produk gagal dimuat.', failureText(error, 'Fake server tidak menjawab.'))
      })
    return () => {
      active = false
    }
  }, [toast])

  const product = stocks.find((item) => item.sku === sku) ?? null
  const count = Number(quantity)
  const copies = Number.isInteger(count) && count >= 1 ? count : 0
  const ready = Boolean(product && copies && note.trim() && photoName && disposition)
  const tooMany = disposition === 'Musnah' && product !== null && copies > product.quantity

  function choosePhoto(file: File | undefined) {
    if (!file) return
    const problem = photoProblem(file)
    if (problem) {
      toast.error('Foto QC ditolak.', problem)
      return
    }
    setPhotoName(file.name)
  }

  async function save() {
    if (!product || !ready || tooMany) {
      toast.error('Catatan belum lengkap.', draftNotice)
      return
    }
    setSaving(true)
    try {
      const created = await createDamage({
        sku: product.sku,
        quantity: copies,
        note: note.trim(),
        disposition,
        photoName: photoName ?? '',
      })
      toast.success('Catatan kerusakan tersimpan.', created.data.code)
      navigate(`/barang-rusak/${created.data.id}`)
    } catch (error: unknown) {
      toast.error('Catatan kerusakan gagal disimpan.', failureText(error, 'Stok tidak berubah.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="dash-page">
      <PageHeader section="Barang Rusak" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title="Catatan kerusakan baru" className="product-card">
        <Text className="product-block">{draftNotice}</Text>
        {fromReceipt && product ? (
          <>
            <TextField label="Kondisi penerimaan" name="damage-source" value={receiptCondition} readOnly />
            <Text className="product-block">{receiptKept(product.quantity, product.unit)}</Text>
          </>
        ) : null}
        <div className="product-pair">
          <SelectField label="Produk" name="damage-product" value={sku} onChange={(event) => setSku(event.target.value)}>
            <option value="">Pilih produk</option>
            {stocks.map((item) => (
              <option key={item.id} value={item.sku}>
                {item.name} · {item.sku}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Jumlah"
            name="damage-qty"
            value={quantity}
            invalid={tooMany}
            hint={tooMany && product ? maxDamageHint(product.quantity, product.unit) : undefined}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>
        <TextField label="Catatan kerusakan" name="damage-note" value={note} onChange={(event) => setNote(event.target.value)} />
        <div className="receipt-upload">
          <Heading level={3}>Foto QC</Heading>
          <Text>{photoName ? photoReady(photoName) : photoEmpty}</Text>
          <Button variant="secondary" onClick={() => document.getElementById('damage-file')?.click()}>
            {photoName ? 'Ganti foto' : 'Pilih file'}
          </Button>
        </div>
        <SelectField label="Disposisi" name="damage-disposition" value={disposition} onChange={(event) => setDisposition(event.target.value)}>
          {dispositions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>
        <Text className="product-size-hint">{dispositionHint}</Text>
        {tooMany && product ? <Text className="product-alert">{destroyRejected(copies, product.quantity, product.unit)}</Text> : null}
        {tooMany ? <Text>{destroyLimit}</Text> : null}
        {tooMany ? <Text className="product-missing">{destroyKept}</Text> : null}
        {product && !tooMany ? (
          <Text className="product-block">{stockNotice(disposition, product.quantity, copies || 1, product.unit)}</Text>
        ) : null}
        <div className="product-form-actions">
          <Button variant="secondary" onClick={() => navigate(fromReceipt ? '/penerimaan/baru' : '/barang-rusak')}>
            Batal
          </Button>
          <Button disabled={!ready || tooMany || saving} onClick={() => void save()}>
            Simpan catatan kerusakan
          </Button>
        </div>
        <input id="damage-file" className="sr-only" type="file" accept="image/jpeg,image/png" onChange={(event) => choosePhoto(event.target.files?.[0])} />
      </Card>
    </section>
  )
}
