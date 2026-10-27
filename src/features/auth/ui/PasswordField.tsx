import { useState } from 'react'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'

type PasswordFieldProps = {
  label: string
  name: string
  value: string
  autoComplete: string
  onChange: (value: string) => void
}

export function PasswordField({ label, name, value, autoComplete, onChange }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      size="lg"
      label={label}
      name={name}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
      trailing={
        <button type="button" className="auth-reveal" onClick={() => setVisible((current) => !current)}>
          {visible ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      }
    />
  )
}
