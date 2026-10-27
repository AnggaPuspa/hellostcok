import type { InputHTMLAttributes } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: string
  size?: 'md' | 'lg'
}

export function Checkbox({ label, size = 'md', id, name, ...props }: CheckboxProps) {
  const fieldId = id ?? name

  return (
    <label className={`hs-check hs-check-${size}`} htmlFor={fieldId}>
      <input id={fieldId} name={name} type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}
