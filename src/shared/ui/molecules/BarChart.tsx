import { Text } from '../atoms/Text.tsx'

type MonthPoint = {
  label: string
  value: number
  peak?: boolean
}

type BarChartProps = {
  months: MonthPoint[]
  average: number
  averageLabel: string
  rangeLabel: string
}

export function BarChart({ months, average, averageLabel, rangeLabel }: BarChartProps) {
  return (
    <>
      <div className="dash-plot" role="img" aria-label={averageLabel}>
        <div className="dash-avg" style={{ bottom: `calc(28px + ${average} * var(--plot) / 100)` }}>
          <Text as="span">{averageLabel}</Text>
        </div>
        {months.map((month) => (
          <div key={month.label} className="dash-col">
            <Text as="span" className={month.peak ? 'is-peak' : undefined}>{month.value}%</Text>
            <div className={month.peak ? 'dash-bar is-peak' : 'dash-bar'} style={{ height: `calc(${month.value} * var(--plot) / 100)` }} />
            <Text as="span" className={month.peak ? 'dash-month is-peak' : 'dash-month'}>{month.label}</Text>
          </div>
        ))}
      </div>
      <footer className="dash-plot-foot">
        <Text as="span">{rangeLabel}</Text>
        <Text as="span">%</Text>
      </footer>
    </>
  )
}
