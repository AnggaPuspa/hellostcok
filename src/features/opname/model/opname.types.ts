export type Opname = {
  id: string
  code: string
  name: string
  sku: string
  location: string
  before: number
  after: number
  change: number
  unit: string
  reason: string
  at: string
}

export type OpnameInput = {
  sku: string
  counted: number
  reason: string
}
