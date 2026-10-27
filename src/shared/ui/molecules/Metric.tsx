import { Pill } from '../atoms/Pill.tsx'
import { Text } from '../atoms/Text.tsx'

type MetricProps = {
  label: string
  value: string
  tone: 'up' | 'down'
  note: string
  detail: string
}

export function Metric({ label, value, tone, note, detail }: MetricProps) {
  return (
    <div className="dash-metric">
      <Text className="dash-metric-label">{label}</Text>
      <Text className="dash-figure">{value}</Text>
      <Pill tone={tone}>{note}</Pill>
      <Text as="span" className="dash-metric-detail">{detail}</Text>
    </div>
  )
}
