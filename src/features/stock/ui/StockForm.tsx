import { useState, type FormEvent } from 'react'
import { ApiError } from '@/shared/api/client.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import type { StockInput } from '../model/stock.types.ts'

type StockFormProps = {
  disabled?: boolean
  onCreate: (input: StockInput) => Promise<void>
}

const initialForm = {
  sku: '',
  name: '',
  category: 'Umum',
  quantity: '1',
  price: '0',
  unit: 'pcs',
}

export function StockForm({ disabled = false, onCreate }: StockFormProps) {
  const [form, setForm] = useState(initialForm)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(name: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      await onCreate({
        sku: form.sku.trim(),
        name: form.name.trim(),
        category: form.category.trim() || 'Umum',
        quantity: Number(form.quantity),
        price: Number(form.price),
        unit: form.unit.trim() || 'pcs',
      })
      setForm(initialForm)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal menyimpan stok')
    } finally {
      setPending(false)
    }
  }

  return (
    <Card title="Barang baru">
    <form className="hs-form" onSubmit={handleSubmit}>
      <Text className="card-lead">Terkirim ke POST /api/stocks di fake server.</Text>
      <TextField label="SKU" name="sku" value={form.sku} onChange={(event) => update('sku', event.target.value)} required />
      <TextField label="Nama barang" name="name" value={form.name} onChange={(event) => update('name', event.target.value)} required />
      <TextField label="Kategori" name="category" value={form.category} onChange={(event) => update('category', event.target.value)} />
      <div className="split">
        <TextField label="Jumlah" name="quantity" type="number" min="0" value={form.quantity} onChange={(event) => update('quantity', event.target.value)} required />
        <TextField label="Harga" name="price" type="number" min="0" value={form.price} onChange={(event) => update('price', event.target.value)} required />
      </div>
      <TextField label="Satuan" name="unit" value={form.unit} onChange={(event) => update('unit', event.target.value)} />
      {error ? <Text className="form-error">{error}</Text> : null}
      <Button type="submit" block disabled={disabled || pending}>
        {pending ? 'Menyimpan...' : 'Simpan ke server'}
      </Button>
    </form>
    </Card>
  )
}
