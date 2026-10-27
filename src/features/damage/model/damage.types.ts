export type Damage = {
  id: string
  code: string
  name: string
  sku: string
  quantity: number
  unit: string
  disposition: string
  dispositionLabel: string
  note: string
  photoName: string | null
  at: string
}

export type DamageInput = {
  sku: string
  quantity: number
  note: string
  disposition: string
  photoName: string
}
