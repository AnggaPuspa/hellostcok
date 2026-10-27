import { api } from '@/shared/api/client.ts'
import type { Receipt, ReceiptInput } from '../model/receipt.types.ts'

export function getReceipts(path = '/receipts') {
  return api<{ data: Receipt[] }>(path)
}

export function getReceipt(id: string, path = '/receipts') {
  return api<{ data: Receipt }>(`${path}/${id}`)
}

export function updateReceiptPhoto(id: string, photoName: string, path = '/receipts') {
  return api<{ data: Receipt }>(`${path}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ photoName }),
  })
}

export function createReceipt(input: ReceiptInput, path = '/receipts') {
  return api<{ data: Receipt }>(path, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
