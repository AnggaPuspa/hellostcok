import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { photoProblem } from '@/features/stock/model/product.form.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getDamage, updateDamage } from '../api/damage.api.ts'
import { detailNotice, photoReady } from '../model/damage.form.ts'
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

export function DamageDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [damage, setDamage] = useState<Damage | null>(null)
  const [stock, setStock] = useState(0)
  const [meta, setMeta] = useState({ category: '', location: '' })

  useEffect(() => {
    let active = true
    getDamage(id)
      .then((result) => {
        if (!active) return
        setDamage(result.data)
        setStock(result.stock)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Barang rusak gagal dimuat.', failureText(error, 'Catatan tidak ditemukan.'))
      })
    return () => {
      active = false
    }
  }, [id, toast])

  useEffect(() => {
    if (!damage?.sku) return
    let active = true
    import('@/features/stock/api/stock.api.ts').then(({ getStocks }) =>
      getStocks().then((list) => {
        if (!active) return
        const found = list.data.find((item) => item.sku === damage.sku)
        setMeta({ category: found?.category ?? '', location: found?.location ?? '' })
      }),
    )
    return () => {
      active = false
    }
  }, [damage?.sku])

  function choosePhoto(file: File | undefined) {
    if (!file || !damage) return
    const problem = photoProblem(file)
    if (problem) {
      toast.error('Foto QC ditolak.', problem)
      return
    }
    updateDamage(damage.id, { photoName: file.name })
      .then((result) => setDamage(result.data))
      .catch((error: unknown) => toast.error('Foto QC gagal diganti.', failureText(error, 'Nama file tidak tersimpan.')))
  }

  if (!damage) return <section className="dash-page" />

  return (
    <section className="dash-page">
      <PageHeader section="Barang Rusak" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title="Detail barang rusak" className="product-card">
        <Heading className="receipt-code" level={2}>
          {damage.code}
        </Heading>
        <Pill tone={damage.disposition === 'Musnah' ? 'down' : 'up'}>{damage.dispositionLabel}</Pill>
        <div>
          <Heading level={3}>{damage.name}</Heading>
          <Text>
            {damage.sku} · {meta.category || '-'} · {meta.location || '-'}
          </Text>
          <Text className="receipt-stock">
            {stock} {damage.unit.toUpperCase()}
          </Text>
        </div>
        <Text>
          Jumlah kerusakan: {damage.quantity} {damage.unit.toUpperCase()} · Disposisi: {damage.disposition}
        </Text>
        <Text>Catatan: {damage.note || '-'}</Text>
        <Text className="product-block">{detailNotice(damage.disposition, stock, damage.unit)}</Text>
        <div className="receipt-upload">
          <Heading level={3}>Foto QC</Heading>
          <Text>{damage.photoName ? photoReady(damage.photoName) : 'Belum ada foto QC'}</Text>
          <Button variant="secondary" onClick={() => document.getElementById('damage-detail-file')?.click()}>
            Ganti foto
          </Button>
        </div>
        <Text>{damage.at}</Text>
        <div className="product-form-actions product-form-actions-start">
          <Button onClick={() => navigate(`/barang-rusak/${damage.id}/disposisi`)}>Ubah disposisi</Button>
        </div>
        <input
          id="damage-detail-file"
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(event) => choosePhoto(event.target.files?.[0])}
        />
      </Card>
    </section>
  )
}
