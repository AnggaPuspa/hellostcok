import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getStock } from '../api/stock.api.ts'
import { labelSizes, printButtonLabel, printCount } from '../model/product.form.ts'
import type { StockItem } from '../model/stock.types.ts'
import { ProductLabel } from './ProductLabel.tsx'

function stamp() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function ProductPrintPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [item, setItem] = useState<StockItem | null>(null)
  const [count, setCount] = useState('2')
  const [size, setSize] = useState(labelSizes[0])
  const [printed, setPrinted] = useState(false)

  useEffect(() => {
    let active = true
    getStock(id)
      .then((detail) => {
        if (active) setItem(detail.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        setItem(null)
        toast.error('Produk gagal dimuat.', failureText(error, 'Label tidak bisa disiapkan.'))
      })
    return () => {
      active = false
    }
  }, [id])

  if (!item) return <section className="dash-page" />

  const copies = printCount(count)

  function printLabels() {
    if (!copies || !item) {
      toast.error('Cetak gagal.', 'Jumlah label harus angka 1 atau lebih.')
      return
    }
    window.print()
    setPrinted(true)
    toast.success('Label terkirim ke printer.', `${copies} label · ${item.name}`)
  }

  return (
    <section className="dash-page">
      <PageHeader section="Produk" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <div className="product-editor">
        <Card className="product-card" title={printed ? undefined : 'Cetak label'}>
          {printed ? (
            <div className="product-success">
              <Text className="product-success-mark">✓</Text>
              <Heading level={2}>Label terkirim ke printer</Heading>
              <Text>
                {copies} label · {size} · {item.name} ({item.sku})
              </Text>
              <div className="product-success-note">
                <Text>Produk: {item.name} · {item.sku}</Text>
                <Text>Jumlah: {copies} label · Ukuran: {size} · Dialog print browser</Text>
                <Text>Cek hasil di printer label sebelum menempel ke produk.</Text>
              </div>
              <div className="product-form-actions product-form-actions-start">
                <Button onClick={() => navigate('/produk')}>Kembali ke produk</Button>
                <Button variant="secondary" onClick={() => setPrinted(false)}>
                  Cetak lagi
                </Button>
              </div>
            </div>
          ) : (
            <>
              <TextField label="Produk" name="print-product" value={`${item.name} · ${item.sku}`} readOnly />
              <TextField label="Jumlah label" name="print-count" value={count} onChange={(event) => setCount(event.target.value)} />
              <SelectField label="Ukuran label" name="print-size" value={size} onChange={(event) => setSize(event.target.value)}>
                {labelSizes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectField>
              <Text className="product-size-hint">Pilihan ukuran: 70×40 mm / 50×30 mm / 100×50 mm</Text>
              <Text>Total label: {copies}</Text>
              <div className="product-form-actions">
                <Button variant="secondary" onClick={() => navigate(`/produk/${item.id}`)}>
                  Batal
                </Button>
                <Button disabled={!copies} onClick={printLabels}>
                  {printButtonLabel(copies)}
                </Button>
              </div>
            </>
          )}
        </Card>
        <ProductLabel
          name={item.name}
          sku={item.sku}
          location={item.location ?? ''}
          unit={item.unit}
          note={`${size} · Pratinjau statis`}
        />
      </div>
    </section>
  )
}
