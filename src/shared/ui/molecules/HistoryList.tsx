import { Pill } from '../atoms/Pill.tsx'
import { Text } from '../atoms/Text.tsx'

type HistoryItem = {
  title: string
  delta: string
  tone: 'up' | 'down'
  time: string
  amount: string
}

export function HistoryList({ items }: { items: HistoryItem[] }) {
  return (
    <ul className="dash-history">
      {items.map((item) => (
        <li key={`${item.title}-${item.time}`}>
          <div>
            <Text className="dash-history-title">{item.title}</Text>
            <Pill tone={item.tone}>{item.delta}</Pill>
          </div>
          <div>
            <Text className="dash-history-time">{item.time}</Text>
            <Text className="dash-history-amount">{item.amount}</Text>
          </div>
        </li>
      ))}
    </ul>
  )
}
