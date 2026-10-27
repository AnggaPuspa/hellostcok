import { api } from '@/shared/api/client.ts'
import type { StockInput, StockItemResponse, StockListResponse } from '../model/stock.types.ts'

export function getStocks() {
  return api<StockListResponse>('/stocks')
}

export function createStock(input: StockInput) {
  return api<StockItemResponse>('/stocks', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function deleteStock(id: string) {
  return api<StockItemResponse>(`/stocks/${id}`, {
    method: 'DELETE',
  })
}

export function resetStocks() {
  return api<StockListResponse>('/stocks/reset', {
    method: 'POST',
  })
}
