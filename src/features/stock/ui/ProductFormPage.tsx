import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getSession } from '@/features/auth/model/session.ts'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Pill } from '@/shared/ui/atoms/Pill.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { PageHeader } from '@/shared/ui/molecules/PageHeader.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { failureText } from '@/shared/ui/toast/failure.ts'
import { createStock, getStock, getStocks, updateStock } from '../api/stock.api.ts'
import {
  canSaveProduct,
  duplicateSkuMessage,
  isSkuTaken,
  photoMissing,
  photoProblem,
  photoRule,
  skuHint,
  stockReadout,
} from '../model/product.form.ts'
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

export function ProductFormPage() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()
  const session = getSession()
  const fileRef = useRef<HTMLInputElement>(null)
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [unit, setUnit] = useState('pcs')
  const [price, setPrice] = useState(0)
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [photoUploadedAt, setPhotoUploadedAt] = useState<string | null>(null)
  const [fileRejected, setFileRejected] = useState(false)
  const [ready, setReady] = useState(!editing)

  useEffect(() => {
    let active = true
    getStocks()
      .then((list) => {
        if (active) setStocks(list.data)
      })
      .catch((error: unknown) => {
        if (!active) return
        setStocks([])
        toast.error('Daftar SKU gagal dimuat.', failureText(error, 'Pemeriksaan SKU tidak bisa dijalankan.'))
      })
    if (!id) {
      return () => {
        active = false
      }
    }
    getStock(id)
      .then((detail) => {
        if (!active) return
        const item = detail.data
        setName(item.name)
        setSku(item.sku)
        setCategory(item.category)
        setLocation(item.location ?? '')
        setQuantity(item.quantity)
        setUnit(item.unit)
        setPrice(item.price)
        setPhotoName(item.photoName)
        setPhotoData(item.photoData)
        setPhotoUploadedAt(item.photoUploadedAt)
        setReady(true)
      })
      .catch((error: unknown) => {
        if (!active) return
        setReady(true)
        toast.error('Produk gagal dimuat.', failureText(error, 'Data produk tidak ditemukan.'))
      })
    return () => {
      active = false
    }
  }, [id])

  const taken = isSkuTaken(sku, stocks, id)
  const hasPhoto = Boolean(photoData)
  const saveEnabled = canSaveProduct({ name, sku, category, location }, taken, hasPhoto)

  function chooseFile(file: File | undefined) {
    if (!file) return
    if (photoProblem(file)) {
      setFileRejected(true)
      toast.error('Foto ditolak.', photoRule)
      return
    }
    setFileRejected(false)
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoData(String(reader.result))
      setPhotoName(file.name)
      setPhotoUploadedAt(new Date().toISOString())
    }
    reader.readAsDataURL(file)
  }

  async function save() {
    const body = {
      sku: sku.trim(),
      name: name.trim(),
      category: category.trim(),
      location: location.trim(),
      quantity: editing ? quantity : 0,
      price,
      unit,
      photoName,
      photoData,
      photoUploadedAt,
    }
    try {
      if (id) {
        await updateStock(id, body)
        toast.success('Perubahan tersimpan.', body.name)
        navigate(`/produk/${id}`)
        return
      }
      const created = await createStock(body)
      toast.success('Produk tersimpan.', body.name)
      navigate(`/produk/${created.data.id}`)
    } catch (error: unknown) {
      toast.error(editing ? 'Perubahan gagal disimpan.' : 'Produk gagal disimpan.', failureText(error, 'Periksa isian, lalu coba lagi.'))
    }
  }

  if (!ready) return <section className="dash-page" />

  return (
    <section className="dash-page">
      <PageHeader section="Produk" detail={`${stamp()} · ${session?.name ?? ''}`} />
      <div className="product-editor">
        <Card title={editing ? 'Ubah produk' : 'Tambah produk'} className="product-card">
          <TextField label="Nama produk" name="product-name" value={name} onChange={(event) => setName(event.target.value)} />
          <TextField
            label="SKU / barcode"
            name="product-sku"
            value={sku}
            invalid={taken}
            hint={skuHint}
            onChange={(event) => setSku(event.target.value)}
          />
          {taken ? <Text className="product-alert">{duplicateSkuMessage(sku)}</Text> : null}
          {sku.trim() && !taken ? <Pill tone="up">SKU tersedia</Pill> : null}
          <div className="product-pair">
            <TextField label="Kategori" name="product-category" value={category} onChange={(event) => setCategory(event.target.value)} />
            <TextField label="Lokasi" name="product-location" value={location} onChange={(event) => setLocation(event.target.value)} />
          </div>
          <TextField label="Stok" name="product-stock" value={stockReadout(editing ? quantity : 0, unit)} readOnly />
          <div className="product-form-actions">
            <Button variant="secondary" onClick={() => navigate(id ? `/produk/${id}` : '/produk')}>
              Batal
            </Button>
            <Button disabled={!saveEnabled} onClick={() => void save()}>
              {editing ? 'Simpan perubahan' : 'Simpan produk'}
            </Button>
          </div>
        </Card>
        <div className="product-side">
          <Card title="Foto produk" className="product-card">
            {editing || !photoData ? (
              <div className="product-upload">
                <Text className="product-upload-title">Foto produk</Text>
                {photoData ? <img className="product-thumb" src={photoData} alt="" width={96} height={96} /> : null}
                <Text>{photoName ? `${photoName} · Tersedia` : photoRule}</Text>
                <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                  {photoData ? 'Ganti foto' : 'Pilih file'}
                </Button>
              </div>
            ) : (
              <div className="product-preview">
                <img src={photoData} alt="" width={175} height={175} />
                <Button className="product-pencil" variant="secondary" aria-label="Ganti foto" onClick={() => fileRef.current?.click()}>
                  ✎
                </Button>
              </div>
            )}
            {taken && !hasPhoto ? <Text className="product-missing">{photoMissing}</Text> : null}
            {fileRejected ? <Text className="product-missing">{photoRule}</Text> : null}
            <input
              ref={fileRef}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(event) => chooseFile(event.target.files?.[0])}
            />
          </Card>
          {editing ? <ProductLabel name={name} sku={sku} location={location} unit={unit} note="Ukuran label: 70×40 mm" /> : null}
        </div>
      </div>
    </section>
  )
}
