import { api } from '@/shared/api/client.ts'
import type { ReportDetail, ReportList, ReportRange } from '../model/report.types.ts'

export type ReportQuery = {
  range: ReportRange
  sku?: string
  from?: string
  to?: string
}

function queryString(query: ReportQuery) {
  const params = new URLSearchParams({ range: query.range })
  if (query.sku) params.set('sku', query.sku)
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  return params.toString()
}

export function getReport(query: ReportQuery) {
  return api<ReportList>(`/reports?${queryString(query)}`)
}

export function getReportDetail(sku: string, query: ReportQuery) {
  return api<{ data: ReportDetail }>(`/reports/${encodeURIComponent(sku)}?${queryString(query)}`)
}

export async function exportReport(query: ReportQuery) {
  const response = await fetch(`/api/reports/export?${queryString(query)}`, {
    headers: { Accept: 'text/csv' },
  })
  if (!response.ok) {
    throw new Error('Ekspor gagal')
  }
  const blob = await response.blob()
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fileName = `laporan-stok-${stamp}.csv`
  return { blob, fileName }
}
