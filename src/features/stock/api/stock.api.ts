import { api } from '@/shared/api/client.ts'
import type { StockDetailResponse, StockInput, StockItemResponse, StockListResponse } from '../model/stock.types.ts'

export function getStocks() {
  return api<StockListResponse>('/stocks')
}

export function lookupStock(code: string) {
  return api<StockItemResponse>(`/stocks/lookup?code=${encodeURIComponent(code)}`)
}

export function getStock(id: string) {
  return api<StockDetailResponse>(`/stocks/${id}`)
}

export function createStock(input: StockInput) {
  return api<StockItemResponse>('/stocks', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateStock(id: string, input: StockInput) {
  return api<StockItemResponse>(`/stocks/${id}`, {
    method: 'PATCH',
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
