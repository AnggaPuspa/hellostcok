import type { InputHTMLAttributes } from 'react'
import { Text } from './Text.tsx'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: string
  hideLabel?: boolean
  size?: 'md' | 'lg'
}

export function Checkbox({ label, hideLabel = false, size = 'md', id, name, ...props }: CheckboxProps) {
  const fieldId = id ?? name

  return (
    <label className={`hs-check hs-check-${size}`} htmlFor={fieldId}>
      <input id={fieldId} name={name} type="checkbox" {...props} />
      <Text as="span" className={hideLabel ? 'sr-only' : undefined}>{label}</Text>
    </label>
  )
}
