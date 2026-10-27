export type StockItem = {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  price: number
  unit: string
}

export type StockInput = {
  sku: string
  name: string
  category: string
  quantity: number
  price: number
  unit: string
}

export type StockListResponse = {
  data: StockItem[]
}

export type StockItemResponse = {
  data: StockItem
}
