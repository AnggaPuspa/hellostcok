import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import arrow from '@/assets/auth/arrow-right.svg'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { getSession, register } from '../model/session.ts'
import { AuthLayout } from './AuthLayout.tsx'
import { Logo } from './Logo.tsx'
import { PasswordField } from './PasswordField.tsx'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (getSession()) return <Navigate to="/" replace />

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirm) {
      setError('Kata sandi tidak sama.')
      return
    }
    const message = register({ name, email, password })
    if (message) {
      setError(message)
      return
    }
    navigate('/')
  }

  return (
    <AuthLayout>
      <div className="auth-welcome">
        <Logo />
        <div className="auth-intro">
          <Heading>Daftar akun</Heading>
          <p>Buat akun petugas untuk mulai mencatat stok.</p>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? (
          <div className="auth-error" role="alert">
            <strong>{error}</strong>
          </div>
        ) : null}
        <TextField
          size="lg"
          label="Nama"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <TextField
          size="lg"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <PasswordField label="Kata sandi" name="password" autoComplete="new-password" value={password} onChange={setPassword} />
        <PasswordField label="Konfirmasi kata sandi" name="confirm" autoComplete="new-password" value={confirm} onChange={setConfirm} />
        <Button type="submit" size="lg" block>
          Daftar
          <img src={arrow} alt="" width="21.5238" height="21.5238" />
        </Button>
      </form>
      <p className="auth-switch">
        Sudah punya akun? <Link to="/login">Masuk</Link>
      </p>
    </AuthLayout>
  )
}
