import type { ReactNode } from 'react'
import { Heading } from '../atoms/Heading.tsx'
import { Text } from '../atoms/Text.tsx'

type PageHeaderProps = {
  section: string
  detail?: ReactNode
  aside?: ReactNode
}

export function PageHeader({ section, detail, aside }: PageHeaderProps) {
  return (
    <header className={aside ? 'dash-head dash-head-split' : 'dash-head'}>
      <div className="dash-head-copy">
        <Text className="dash-crumb">Hello Stock / {section}</Text>
        <Heading>{section}</Heading>
        {detail ? <Text className="dash-hello">{detail}</Text> : null}
      </div>
      {aside}
    </header>
  )
}
