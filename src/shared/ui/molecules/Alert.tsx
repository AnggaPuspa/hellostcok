import type { ReactNode } from 'react'
import { Text } from '../atoms/Text.tsx'

type AlertProps = {
  title: string
  children?: ReactNode
}

export function Alert({ title, children }: AlertProps) {
  return (
    <div className="auth-error" role="alert">
      <Text className="auth-error-title">{title}</Text>
      {children ? <Text className="auth-error-body">{children}</Text> : null}
    </div>
  )
}
