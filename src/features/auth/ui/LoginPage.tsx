import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import arrow from '@/assets/auth/arrow-right.svg'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Checkbox } from '@/shared/ui/atoms/Checkbox.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { getSession, login } from '../model/session.ts'
import { AuthLayout } from './AuthLayout.tsx'
import { Logo } from './Logo.tsx'
import { PasswordField } from './PasswordField.tsx'

const demos = {
  admin: { email: 'admin@hellostock.test', password: 'admin' },
  pemilik: { email: 'pemilik@hellostock.test', password: 'pemilik' },
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(() => localStorage.getItem('hello-stock-remember') ?? '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState(false)

  if (getSession()) return <Navigate to="/" replace />

  function submit(nextEmail: string, nextPassword: string) {
    const session = login(nextEmail, nextPassword)
    if (!session) {
      setError(true)
      return
    }
    if (remember) localStorage.setItem('hello-stock-remember', nextEmail)
    navigate('/')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submit(email, password)
  }

  function enterAs(role: keyof typeof demos) {
    const account = demos[role]
    setEmail(account.email)
    setPassword(account.password)
    setError(false)
    submit(account.email, account.password)
  }

  return (
    <AuthLayout>
      <div className="auth-welcome">
        <Logo />
        <div className="auth-intro">
          <Heading>Masuk ke akun Anda</Heading>
          <p>Selamat datang kembali! Isi detail akun Anda untuk masuk.</p>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? (
          <div className="auth-error" role="alert">
            <strong>Email atau kata sandi tidak cocok.</strong>
            <span>Coba lagi atau hubungi admin toko.</span>
          </div>
        ) : null}
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
        <PasswordField label="Kata sandi" name="password" autoComplete="current-password" value={password} onChange={setPassword} />
        <Checkbox size="lg" label="Ingat saya" name="remember" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
        <Button type="submit" size="lg" block>
          Masuk
          <img src={arrow} alt="" width="21.5238" height="21.5238" />
        </Button>
      </form>
      <div className="auth-demos">
        <p>Masuk Sebagai</p>
        <div>
          <Button variant="soft" onClick={() => enterAs('admin')}>Admin</Button>
          <Button variant="soft" onClick={() => enterAs('pemilik')}>Pemilik</Button>
        </div>
      </div>
      <p className="auth-helper">Hubungi admin toko jika tidak memiliki akses.</p>
      <p className="auth-switch">
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </AuthLayout>
  )
}
