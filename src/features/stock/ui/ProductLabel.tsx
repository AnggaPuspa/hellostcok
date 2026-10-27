import { Text } from '@/shared/ui/atoms/Text.tsx'
import { Card } from '@/shared/ui/molecules/Card.tsx'
import { Barcode } from './Barcode.tsx'

type ProductLabelProps = {
  name: string
  sku: string
  location: string
  unit: string
  note: string
}

export function ProductLabel({ name, sku, location, unit, note }: ProductLabelProps) {
  return (
    <Card title="Pratinjau label" className="product-card">
      <div className="product-label">
        <Text className="product-label-brand">Hello Stock</Text>
        <Text className="product-label-name">{name}</Text>
        <Barcode value={sku} />
        <Text className="product-label-sku">{sku}</Text>
        <Text className="product-label-place">Lokasi {location} · {unit.toUpperCase()}</Text>
      </div>
      <Text>{note}</Text>
    </Card>
  )
}
