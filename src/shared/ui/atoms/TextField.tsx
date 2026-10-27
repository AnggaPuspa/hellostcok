import type { InputHTMLAttributes, ReactNode } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: ReactNode
}

export function TextField({ label, hint, id, name, readOnly = false, className = '', ...props }: TextFieldProps) {
  const fieldId = id ?? name

  return (
    <label className={`hs-field ${className}`.trim()} htmlFor={fieldId}>
      <span className="hs-label">{label}</span>
      <input
        id={fieldId}
        name={name}
        readOnly={readOnly}
        className={readOnly ? 'hs-input hs-input-readonly' : 'hs-input'}
        {...props}
      />
      {hint ? <span className="hs-hint">{hint}</span> : null}
    </label>
  )
}
