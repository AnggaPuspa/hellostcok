export type ReportRange = 'today' | '7d' | '30d' | 'custom'

export type ReportRow = {
  sku: string
  name: string
  unit: string
  opening: number
  incoming: number
  outgoing: number
  adjust: number
  damage: number
  closing: number
}

export type ReportList = {
  range: ReportRange
  periodLabel: string
  summary: string
  data: ReportRow[]
}

export type ReportTransaction = {
  id: string
  code: string
  at: string
  mark: string
  after: string
  photoName: string | null
  photoStatus: 'ready' | 'expired' | 'missing'
  type: string
}

export type ReportDetail = ReportRow & {
  category: string
  location: string
  periodLabel: string
  periodNote: string
  damageNote: string
  transactions: ReportTransaction[]
  photo: { code: string; status: string; name: string | null } | null
}
