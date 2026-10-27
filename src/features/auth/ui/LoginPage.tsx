import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import arrow from '@/assets/auth/arrow-right.svg'
import { Button } from '@/shared/ui/atoms/Button.tsx'
import { Checkbox } from '@/shared/ui/atoms/Checkbox.tsx'
import { Heading } from '@/shared/ui/atoms/Heading.tsx'
import { Text } from '@/shared/ui/atoms/Text.tsx'
import { TextLink } from '@/shared/ui/atoms/TextLink.tsx'
import { TextField } from '@/shared/ui/atoms/TextField.tsx'
import { Alert } from '@/shared/ui/molecules/Alert.tsx'
import { useToast } from '@/shared/ui/toast/ToastProvider.tsx'
import { getDemos, getSession, login, loginAs, rememberedEmail, rememberEmail, type DemoAccount } from '../model/session.ts'
import { AuthLayout } from './AuthLayout.tsx'
import { Logo } from './Logo.tsx'
import { PasswordField } from './PasswordField.tsx'

export function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState(rememberedEmail)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState(false)
  const [demos, setDemos] = useState<DemoAccount[]>([])

  useEffect(() => {
    let active = true
    getDemos()
      .then((list) => {
        if (active) setDemos(list)
      })
      .catch(() => {
        if (!active) return
        setDemos([])
        toast.error('Daftar akun demo gagal dimuat.', 'Periksa fake server, lalu muat ulang halaman.')
      })
    return () => {
      active = false
    }
  }, [])

  if (getSession()) return <Navigate to="/dashboard" replace />

  async function submit(nextEmail: string, nextPassword: string) {
    const session = await login(nextEmail, nextPassword)
    if (!session) {
      setError(true)
      toast.error('Email atau kata sandi tidak cocok.', 'Coba lagi atau hubungi admin toko.')
      return
    }
    if (remember) rememberEmail(nextEmail)
    toast.success('Berhasil masuk.', session.name)
    navigate('/dashboard')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submit(email, password)
  }

  async function enterAs(account: DemoAccount) {
    setError(false)
    const session = await loginAs(account.role)
    if (!session) {
      setError(true)
      toast.error('Masuk sebagai akun itu gagal.', 'Akun nonaktif atau server tidak menjawab.')
      return
    }
    toast.success('Berhasil masuk.', session.name)
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="auth-welcome">
        <Logo />
        <div className="auth-intro">
          <Heading>Masuk ke akun Anda</Heading>
          <Text>Selamat datang kembali! Isi detail akun Anda untuk masuk.</Text>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? <Alert title="Email atau kata sandi tidak cocok.">Coba lagi atau hubungi admin toko.</Alert> : null}
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
        <Text>Masuk Sebagai</Text>
        <div>
          {demos.map((account) => (
            <Button key={account.role} variant="soft" onClick={() => void enterAs(account)}>
              {account.name}
            </Button>
          ))}
        </div>
      </div>
      <Text className="auth-helper">Hubungi admin toko jika tidak memiliki akses.</Text>
      <Text className="auth-switch">
        Belum punya akun? <TextLink to="/register">Daftar</TextLink>
      </Text>
    </AuthLayout>
  )
}
