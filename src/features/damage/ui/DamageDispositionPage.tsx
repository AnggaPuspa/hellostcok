import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { SelectField } from '@/shared/ui/atoms/SelectField.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from '@/shared/ui/molecules/Table.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { getDamage, updateDamage } from '../api/damage.api.ts'
import { dispositionHint, dispositions, pendingDisposition } from '../model/damage.form.ts'
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

export function DamageDispositionPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const [damage, setDamage] = useState<Damage | null>(null)
  const [stock, setStock] = useState(0)
  const [disposition, setDisposition] = useState('Tahan')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    getDamage(id)
      .then((result) => {
        if (!active) return
        setDamage(result.data)
        setStock(result.stock)
        setDisposition(result.data.disposition)
      })
      .catch((error: unknown) => {
        if (!active) return
        toast.error('Disposisi gagal dimuat.', failureText(error, 'Catatan tidak ditemukan.'))
      })
    return () => {
      active = false
    }
  }, [id, toast])

  async function save() {
    if (!damage) return
    setSaving(true)
    try {
      const updated = await updateDamage(damage.id, { disposition })
      toast.success('Disposisi tersimpan.', updated.data.dispositionLabel)
      navigate(`/barang-rusak/${damage.id}`)
    } catch (error: unknown) {
      toast.error('Disposisi gagal disimpan.', failureText(error, 'Stok tidak berubah.'))
    } finally {
      setSaving(false)
    }
  }

  if (!damage) return <section className="dash-page" />

  return (
    <section className="dash-page">
      <PageHeader section="Barang Rusak" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <Card title="Ubah disposisi" className="product-card">
        <Text>
          {damage.code} · {damage.name} · {damage.quantity} {damage.unit.toUpperCase()}
        </Text>
        <Pill tone={damage.disposition === 'Musnah' ? 'down' : 'up'}>{damage.dispositionLabel}</Pill>
        <SelectField label="Disposisi" name="damage-next" value={disposition} onChange={(event) => setDisposition(event.target.value)}>
          {dispositions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>
        <Text className="product-size-hint">{dispositionHint}</Text>
        <Table caption="Pilihan disposisi">
          <TableHeader>
            <TableHeaderCell>Pilihan disposisi</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {dispositions.map((item) => (
              <TableRow key={item} selected={item === disposition} onClick={() => setDisposition(item)}>
                <TableCell>{item === disposition ? `${item} · Dipilih` : item}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter colSpan={1} start={`${dispositions.length} pilihan disposisi`} end="1 dari 1" />
        </Table>
        <Text className="product-block">{pendingDisposition(stock, damage.unit)}</Text>
        <div className="product-form-actions">
          <Button variant="secondary" onClick={() => navigate(`/barang-rusak/${damage.id}`)}>
            Batal
          </Button>
          <Button disabled={saving} onClick={() => void save()}>
            Simpan disposisi
          </Button>
        </div>
      </Card>
    </section>
  )
}
