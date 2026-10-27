import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function TextField({ label, id, name, ...props }: TextFieldProps) {
  const fieldId = id ?? name

  return (
    <label className="field" htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} name={name} {...props} />
    </label>
  )
}
