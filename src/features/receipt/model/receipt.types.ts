export type Receipt = {
  id: string
  code: string
  name: string
  sku: string
  quantity: number
  unit: string
  condition: string
  photoName: string | null
  at: string
}

export type ReceiptInput = {
  sku: string
  quantity: number
  condition: string
  photoName?: string | null
}
