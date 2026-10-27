import type { InputHTMLAttributes, ReactNode } from 'react'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string
  hint?: ReactNode
  trailing?: ReactNode
  size?: 'md' | 'lg'
}

export function TextField({
  label,
  hint,
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
      <span className="hs-label">{label}</span>
      <span className="hs-input-wrap">
        <input
          id={fieldId}
          name={name}
          readOnly={readOnly}
          className={`hs-input hs-input-${size} ${readOnly ? 'hs-input-readonly' : ''} ${trailing ? 'hs-input-pad' : ''}`.trim()}
          {...props}
        />
        {trailing ? <span className="hs-input-trailing">{trailing}</span> : null}
      </span>
      {hint ? <span className="hs-hint">{hint}</span> : null}
    </label>
  )
}
