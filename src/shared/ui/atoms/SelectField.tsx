import type { ReactNode, SelectHTMLAttributes } from 'react'
import { Text } from './Text.tsx'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  children: ReactNode
}

export function SelectField({ label, id, name, className = '', children, ...props }: SelectFieldProps) {
  const fieldId = id ?? name

  return (
    <label className={`hs-field ${className}`.trim()} htmlFor={fieldId}>
      <Text as="span" className="hs-label">{label}</Text>
      <select id={fieldId} name={name} className="hs-input" {...props}>
        {children}
      </select>
    </label>
  )
}
