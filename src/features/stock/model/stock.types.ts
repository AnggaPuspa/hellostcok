export type StockItem = {
  id: string
  sku: string
  name: string
  category: string
  location: string
  quantity: number
  price: number
  unit: string
  photoName: string | null
  photoUploadedAt: string | null
  photoData: string | null
}

export type StockInput = {
  sku: string
  name: string
  category: string
  location?: string
  quantity: number
  price: number
  unit: string
  photoName?: string | null
  photoUploadedAt?: string | null
  photoData?: string | null
}

export type StockHistory = {
  code: string
  at: string
  change: string
  condition: string
}

export type StockDetailResponse = {
  data: StockItem
  history: StockHistory[]
}

export type StockListResponse = {
  data: StockItem[]
}

export type StockItemResponse = {
  data: StockItem
}
