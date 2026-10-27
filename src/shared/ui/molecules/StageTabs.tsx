import { Button } from '../atoms/Button.tsx'

type Stage = {
  id: string
  label: string
  disabled?: boolean
}

type StageTabsProps = {
  value: string
  stages: Stage[]
  onChange: (id: string) => void
}

export function StageTabs({ value, stages, onChange }: StageTabsProps) {
  return (
    <div className="stage-tabs" role="tablist">
      {stages.map((stage) => (
        <Button
          key={stage.id}
          className={value === stage.id ? 'stage-tab is-selected' : 'stage-tab'}
          aria-selected={value === stage.id}
          disabled={stage.disabled}
          onClick={() => onChange(stage.id)}
        >
          {stage.label}
        </Button>
      ))}
    </div>
  )
}
