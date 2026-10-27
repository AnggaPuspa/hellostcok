import type { InputHTMLAttributes } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}

export function Checkbox({ label, id, name, ...props }: CheckboxProps) {
  const fieldId = id ?? name

  return (
    <label className="hs-check" htmlFor={fieldId}>
      <input id={fieldId} name={name} type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}
