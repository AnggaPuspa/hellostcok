export type DashboardMetric = {
  label: string
  value: string
  tone: 'up' | 'down'
  note: string
  detail: string
}

export type DashboardMonth = {
  label: string
  value: number
  peak?: boolean
}

export type DashboardHistoryItem = {
  title: string
  delta: string
  tone: 'up' | 'down'
  time: string
  amount: string
}

export type DashboardView = {
  section: string
  greetedAt: string
  summary: {
    title: string
    meta: string
    chip: string
    metrics: DashboardMetric[]
  }
  performance: {
    title: string
    range: string
    average: number
    averageLabel: string
    score: string
    scoreLabel: string
    months: DashboardMonth[]
  }
  history: {
    title: string
    meta: string
    items: DashboardHistoryItem[]
  }
}
