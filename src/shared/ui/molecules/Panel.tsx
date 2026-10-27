import type { ReactNode } from 'react'
import { Heading } from '../atoms/Heading.tsx'
import { Text } from '../atoms/Text.tsx'

type PanelProps = {
  title: string
  meta?: ReactNode
  aside?: ReactNode
  children: ReactNode
}

export function Panel({ title, meta, aside, children }: PanelProps) {
  return (
    <article className="dash-card">
      <header className="dash-card-head">
        <div>
          <Heading level={2}>{title}</Heading>
          {meta ? <Text className="dash-card-meta">{meta}</Text> : null}
        </div>
        {aside}
      </header>
      {children}
    </article>
  )
}
