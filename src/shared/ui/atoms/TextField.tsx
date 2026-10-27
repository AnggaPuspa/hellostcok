import type { InputHTMLAttributes, ReactNode } from 'react'
import { Text } from './Text.tsx'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  invalid?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  size?: 'md' | 'lg'
}

export function TextField({
  label,
  hideLabel = false,
  hint,
  invalid = false,
  leading,
  trailing,
  size = 'md',
  id,
  name,
  readOnly = false,
  className = '',
  ...props
}: TextFieldProps) {
  const fieldId = id ?? name

  return (
    <label className={`hs-field hs-field-${size} ${className}`.trim()} htmlFor={fieldId}>
      <Text as="span" className={hideLabel ? 'hs-label sr-only' : 'hs-label'}>{label}</Text>
      <span className="hs-input-wrap">
        {leading ? <span className="hs-input-leading">{leading}</span> : null}
        <input
          id={fieldId}
          name={name}
          readOnly={readOnly}
          className={`hs-input hs-input-${size} ${readOnly ? 'hs-input-readonly' : ''} ${invalid ? 'hs-input-invalid' : ''} ${leading ? 'hs-input-lead' : ''} ${trailing ? 'hs-input-pad' : ''}`.trim()}
          {...props}
        />
        {trailing ? <span className="hs-input-trailing">{trailing}</span> : null}
      </span>
      {hint ? <Text as="span" className={invalid ? 'hs-hint hs-hint-invalid' : 'hs-hint'}>{hint}</Text> : null}
    </label>
  )
}
