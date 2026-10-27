import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import arrow from '@/assets/auth/arrow-right.svg'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextLink } from '@/shared/ui/atoms/TextLink.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Alert } from '@/shared/ui/molecules/Alert.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { getSession, register } from '../model/session.ts'
import { AuthLayout } from './AuthLayout.tsx'
import { Logo } from './Logo.tsx'
import { PasswordField } from './PasswordField.tsx'

export function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (getSession()) return <Navigate to="/dashboard" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirm) {
      setError('Kata sandi tidak sama.')
      toast.error('Kata sandi tidak sama.', 'Isi konfirmasi dengan kata sandi yang sama.')
      return
    }
    const message = await register({ name, email, password })
    if (message) {
      setError(message)
      toast.error('Daftar gagal.', message)
      return
    }
    toast.success('Akun berhasil dibuat.', name)
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="auth-welcome">
        <Logo />
        <div className="auth-intro">
          <Heading>Daftar akun</Heading>
          <Text>Buat akun petugas untuk mulai mencatat stok.</Text>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? <Alert title={error} /> : null}
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
      <Text className="auth-switch">
        Sudah punya akun? <TextLink to="/login">Masuk</TextLink>
      </Text>
    </AuthLayout>
  )
}
